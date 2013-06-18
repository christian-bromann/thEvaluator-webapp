/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/WidgetView',
    'text!templates/widgets/FeedbackWidget.tpl'
], function ($, _, backbone, WidgetView, template) {
    'use strict';

    var GeoDataView = WidgetView.extend({
        el: '.feedback .content',
        initialize: function() {
            this.render();
        },
        render: function() {

            var data = {testruns: this.testrunCollection.filter(function(testrun) { return testrun.feedback ? !(testrun.feedback instanceof Array) : false; })};

            if(data.testruns.length === 0) {
                this._renderNoContent();
                return;
            }

            this.$el.html(_.template( template, data ));

        }
    });

    return GeoDataView;
});