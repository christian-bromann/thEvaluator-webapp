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

            if(!this.testrunCollection.models.length) {
                this.$el.html('<i>no data available</i>');
                this.$el.addClass('nocontent');
                return;
            }

            this.initialize();
        }
    });

    return WidgetView;
});