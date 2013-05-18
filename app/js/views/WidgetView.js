/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var WidgetView = Backbone.View.extend({
        className : 'widget',
        super: function(args){
            this.$el = $(this.el);

            this.testrunCollection = args[0];
            this.testcase          = args[1];
        }
    });

    return WidgetView;
});