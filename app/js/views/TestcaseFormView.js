/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/AlertView',
    'models/TestcaseModel',
    'models/TaskModel',
    'collections/TestcaseCollection',
    'text!/templates/TestcaseForm.tpl',
    'text!/templates/CookieForm.tpl',
    'text!/templates/TaskForm.tpl',
    'text!/templates/TaskListItem.tpl',
    'jqueryui',
], function ($, _, Backbone, Alert, Testcase, Task, TestCaseCollection, view, cookieInput, taskInput, taskListItem) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el: '.main',
        events: {
            'click .add-cookie': 'addCookieInput',
            'click .remove-cookie': 'removeCookieInput',
            'click .add-task': 'addTaskInput',
            'click .cancel': 'closeTaskForm',
            'click .remove': 'removeTask',
            'click .edit': 'editTask',
            'click .submit.task': 'addTask',
            'click .submit.testcase': 'submit',
            'keydown .numberField': 'checkNumperInput'
        },
        initialize:function(options){
            this.id = options.id;
            this.render();
            this.cookieInput = this.getCookieTemplate();
            this.taskInput   = this.getTaskTemplate();

            this.tasks = [];
        },
        render: function(){
            document.title = 'thEvaluator - ' + (this.id ? 'Edit' : 'Create new') + ' Testcase';

            var that        = this,
                cookieInput = '',
                taskInput   = '';

            this.unrender();

            if(this.id) {
                var testcase = new Testcase({id: this.id});
                testcase.fetch({
                    success: function(testcase) {
                        that.editTestcase = testcase;

                        // render cookie inputs
                        _.each(testcase.get('cookies'), function(cookie) {
                            cookieInput += that.getCookieTemplate(cookie);
                        });

                        // render task input
                        _.each(testcase.get('tasks'), function(task) {
                            if(task.hasOwnProperty('_id')) {
                                task.timestamp = task._id;
                                task = new Task(task);
                            }
                            that.tasks.push(task);
                            taskInput += that.getTaskListTemplate(task);
                        });

                        $(that.el).html(_.template( view, {testcase: testcase, cookies: cookieInput, tasks: taskInput} ));
                        $('.testcaseList').sortable({ handle: '.move', cancel: '', update: that.orderTasks.bind(that) });
                    }
                });
            } else {
                $(this.el).html(_.template( view, {testcase: {}, cookies: cookieInput, tasks: taskInput} ));
                $('.testcaseList').sortable({ handle: '.move', cancel: '', update: this.orderTasks.bind(this) });
            }
        },
        unrender:function(){
            $(this.el).empty();
        },
        addCookieInput: function() {
            $(this.el).find('.cookies').append(this.cookieInput);
        },
        addTaskInput: function() {
            $('.tasks').append(this.taskInput);
        },
        closeTaskForm: function(e) {
            e.preventDefault();
            var elem = $(e.target).parents('.taskform:eq(0)');

            if(elem.hasClass('editMode')) {
                elem.replaceWith(this.getTaskListTemplate(this.getTaskByListElem(elem)));
            } else {
                elem.remove();
            }
        },
        removeTask: function(e) {
            var that = this,
                elem = $(e.target).parents('li:eq(0)'),
                id   = elem.data('timestamp');

            _.each(this.tasks,function(task,i) {
                if(task.get('timestamp') === id) {
                    that.tasks.splice(i,1);
                }
            });
            elem.remove();
        },
        editTask: function(e) {
            var elem = $(e.target).parents('li:eq(0)');
            elem.replaceWith(this.getTaskTemplate(this.getTaskByListElem(elem)));
        },
        getTaskByListElem: function(elem) {
            var that = this,
                id   = elem.data('timestamp'),
                ret  = null;

            _.each(this.tasks,function(task,i) {
                if(task.get('timestamp') === id) {
                    ret = that.tasks[i];
                }
            });

            return ret;
        },
        removeCookieInput: function(e) {
            $(e.target).parents('.control-group').remove();
        },
        submit: function(e) {
            e.preventDefault();

            var that    = this,
                inputs  = $(this.el).find('input'),
                cookieGroups = $(this.el).find('fieldset.cookies .control-group'),
                pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
                data    = {},
                cookies = [],
                error   = false;

            $(this.el).find('.control-group.error').removeClass('error');

            // validate input fields
            $.each(inputs, function(i,input) {
                input = $(input);

                if(input.attr('name') === 'cookieName' || input.attr('name') === 'cookieValue') {
                    return true;
                }

                if(
                  (input.hasClass('required') && input.val() === '') ||
                  (input.attr('id') === 'inputStartURL' && !pattern.test(input.val()))
                ) {
                    error = true;
                    input.parents('.control-group').addClass('error');
                }
                data[input.attr('name')] = input.val();
            });

            // validate cookies fields
            $.each(cookieGroups, function(i, cookieGroup) {
                cookieGroup = $(cookieGroup);
                var name  = cookieGroup.find('.inputCookieName').val();
                var value = cookieGroup.find('.inputCookieValue').val();
                cookies.push({name:name,value:value});
            });
            data.cookies = cookies || [];
            data.tasks   = this.tasks;

            if(!error) {
                if(this.id && this.editTestcase) {
                    // update testcase
                    this.editTestcase.save(data,{
                        success: function() {
                            that.undelegateEvents();
                            that.unrender();
                            window.router.navigate('/', {trigger: true});
                        },
                        error: function() {
                            $(that.el).append(new Alert({type: 'error', content: 'Uuups! A server error occured.'}).el);
                        }
                    });

                } else {
                    // create new testcase
                    var testcase = new Testcase(data);
                    testcase.save(data,{
                        success: function() {
                            $(that.el).append(new Alert({type: 'success', content: 'testcase created successfully!'}).el);
                            that.reset();
                        },
                        error: function() {
                            $(that.el).append(new Alert({type: 'error', content: 'Uuups! A server error occured.'}).el);
                        }
                    });
                }
            }
        },
        addTask: function(e) {
            e.preventDefault();

            var el      = $(e.target).parents('.taskform:eq(0)'),
                inputs  = el.find('input,textarea'),
                data    = {},
                error   = false;

            el.find('.control-group.error').removeClass('error');
            // validate input fields
            $.each(inputs, function(i,input) {
                input = $(input);

                if(input.hasClass('required') && input.val() === '') {
                    error = true;
                    input.parents('.control-group').addClass('error');
                }
                data[input.attr('name')] = input.val();
            });

            data.targetAction = $(this.el).find('.targetAction').val();
            data.required     = $(this.el).find('.required').is(':checked');
            data.timestamp    = Date.now();

            if(!error) {

                var task;
                if(el.hasClass('editMode')) {
                    _.each(this.tasks,function(t) {
                        if(el.data('timestamp') === t.get('_id')) {
                            t.set(data);
                            task = t;
                        }
                    });
                    el.replaceWith(this.getTaskListTemplate(task));
                } else {
                    task = new Task(data);
                    this.tasks.push(task);
                    console.log(this.tasks);
                    el.remove();
                    $('.tasks').append(this.getTaskListTemplate(task));
                }

            }
        },
        checkNumperInput: function(e) {
            if(e.keyCode === 46 || e.keyCode === 8 || e.keyCode === 9 || e.keyCode === 27 || e.keyCode === 13 ||
              (e.keyCode === 65 && e.ctrlKey === true) ||
              (e.keyCode >= 35 && e.keyCode <= 39)) {

                return false;
            } else {
                if (e.shiftKey || (e.keyCode < 48 || e.keyCode > 57) && (e.keyCode < 96 || e.keyCode > 105 )) {
                    e.preventDefault();
                }
            }
        },
        reset: function() {
            $(this.el).find('input,select').val('');
            $(this.el).find('.cookies > .control-group').remove();
            $(this.el).find('.testcaseList').empty();
            this.tasks = [];
        },
        getCookieTemplate: function(cookie) {
            return _.template(cookieInput, {cookie:cookie || {}});
        },
        getTaskTemplate: function(task) {
            return _.template(taskInput, {task:task || {}});
        },
        getTaskListTemplate: function(task) {
            if(!task) {
                return '';
            }
            return _.template(taskListItem, {task:task || {}});
        },
        orderTasks: function() {
            var that        = this,
                elements    = $('.tasks > li'),
                sortedTasks = [];

            _.each(elements,function(elem) {
                _.each(that.tasks,function(task) {
                    if($(elem).data('timestamp') === task.get('_id') || $(elem).data('timestamp') === task.get('timestamp')) {
                        sortedTasks.push(task);
                    }
                });
            });
            this.tasks = sortedTasks;
        }
    });

    return CreateView;
});