/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    '/js/controllers/api.js',
    'text!/templates/createView.tpl',
    'text!/templates/createCookie.tpl'
], function ($, _, Backbone, APIRequest, view, cookieInput) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el: '.main',
        events: {
            'click .add-cookie': 'addCookieInput',
            'click .remove-cookie': 'removeCookieInput',
            'click .submit': 'submit'
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

            var inputs = $(this.el).find('input'),
                params = {};

            $.each(inputs, function(i,input) {
                params[input.name] = input.value;
            });

            new APIRequest(params).post(function(err,data) {
                console.log(err,data);
            });
        }
    });

    return CreateView;
});