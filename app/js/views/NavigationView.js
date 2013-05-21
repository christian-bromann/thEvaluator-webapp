/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/Navigation.tpl'
], function ($, _, Backbone, template) {
    'use strict';

    var StartView = Backbone.View.extend({
        el: 'body',
        events: {
            'click .nav': 'toggleActiveState',
            'click .brand': 'activateHome',
            'click em': 'test'
        },
        initialize:function(){
            this.render();
        },
        render: function(){
            $(this.el).prepend(_.template( template ));
        },
        toggleActiveState: function(e) {
            var elem = $(e.target);

            elem.parent().siblings().removeClass('active');
            elem.parent().addClass('active');

        },
        activateHome: function(e) {
            var elem = $(e.target).parent();

            elem.find('li').removeClass('active');
            elem.find('li:eq(0)').addClass('active');
        },
        test: function() {
            console.log('haha');
        }

    });

    return StartView;
});