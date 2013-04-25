/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/AlertView',
    'models/testcase',
    'text!/templates/createView.tpl',
    'text!/templates/createCookie.tpl',
], function ($, _, Backbone, Alert, Testcase, view, cookieInput) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el: '.main',
        events: {
            'click .add-cookie': 'addCookieInput',
            'click .remove-cookie': 'removeCookieInput',
            'click .submit': 'submit',
            'keydown .numberField': 'checkNumperInput'
        },
        initialize:function(){
            this.render();
            this.cookieInput = _.template(cookieInput);
        },
        render: function(){
            this.unrender();

            $(this.el).html(_.template( view ));
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
            $(this.el).find('input').val('');
            $(this.el).find('.cookies > .control-group').remove();
        }
    });

    return CreateView;
});