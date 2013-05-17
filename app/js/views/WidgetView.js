/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var WidgetView = Backbone.View.extend({
        className : 'widget',
        super: function(args){
            this.testrunCollection = args[0];
        }
    });

    return WidgetView;
});