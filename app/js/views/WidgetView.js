/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var WidgetView = Backbone.View.extend({
        className : 'widget',
        constructor: function(testrunCollection,testcase) {
            this.$el = $(this.el);

            this.testrunCollection = testrunCollection;
            this.testcase          = testcase;

            if(!this.testrunCollection.models.length) {
                this._renderNoContent();
                return;
            }

            this.delegateEvents();
            this.initialize();
        },
        _renderNoContent: function() {
            this.$el.html('<i>no data available</i>');
            this.$el.addClass('nocontent');
        }
    });

    return WidgetView;
});