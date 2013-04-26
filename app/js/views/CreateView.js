/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/AlertView',
    'models/testcase',
    'collections/testCaseCollection',
    'text!/templates/createView.tpl',
    'text!/templates/createCookie.tpl',
], function ($, _, Backbone, Alert, Testcase, TestCaseCollection, view, cookieInput) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el: '.main',
        events: {
            'click .add-cookie': 'addCookieInput',
            'click .remove-cookie': 'removeCookieInput',
            'click .submit': 'submit',
            'keydown .numberField': 'checkNumperInput'
        },
        initialize:function(options){
            this.id = options.id;
            this.render();
            this.cookieInput = this.getCookieTemplate();
        },
        render: function(){
            document.title = 'thEvaluator - ' + (this.id ? 'Edit' : 'Create new') + ' Testcase';

            var that        = this,
                cookieInput = '';

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

                        $(that.el).html(_.template( view, {testcase: testcase, cookies: cookieInput} ));
                    }
                });
            } else {
                $(this.el).html(_.template( view, {testcase: {}, cookies: cookieInput} ));
            }
        },
        unrender:function(){
            $(this.el).empty();
        },
        addCookieInput: function() {
            $(this.el).find('.cookies').append(this.cookieInput);
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
            data.targetAction = $(this.el).find('.targetAction').val();

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
        },
        getCookieTemplate: function(cookie) {
            return _.template(cookieInput, {cookie:cookie || {}});
        }
    });

    return CreateView;
});