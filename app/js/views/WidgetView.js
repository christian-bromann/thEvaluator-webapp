/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var WidgetView = Backbone.View.extend({
        elements: '.widget',
        constructor: function(testrunCollection){
            this.testrunCollection = testrunCollection;

            this.el = $('.'+this.name);
            this.initialize();
        }
    });

    return WidgetView;
});