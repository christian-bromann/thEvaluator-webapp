/*global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/TestrunCollection',
    'models/TestcaseModel',

    // widgets
    'views/widgets/heatmapView',
    'views/widgets/geoDataView',
    'views/widgets/resultsView'
], function( $, _, Backbone, TestrunCollection, Testcase, HeatmapWidget, GeoDataWidget, ResultsWidget) {

    'use strict';

    var Evaluation = function(view,testcase) {
        this.view = view;

        this.init(testcase);
    };

    Evaluation.prototype = {

        init: function(testcase) {

            var that = this;

            this.testcase = new Testcase(testcase);
            this.testcase.fetch({
                success: function(testcase) {
                    that.view.render(testcase);
                    that.fetchTestruns();
                }
            });

            this.widgets = [];

        },

        fetchTestruns: function() {
            this.testrunCollection = new TestrunCollection();
            this.testrunCollection.fetchByTestcase(this.testcase,function() {
                this.widgets.push(new HeatmapWidget(this.testrunCollection,this.testcase));
                this.widgets.push(new GeoDataWidget(this.testrunCollection,this.testcase));
                this.widgets.push(new ResultsWidget(this.testrunCollection,this.testcase));
            }.bind(this));
        }

    };

    return Evaluation;
});