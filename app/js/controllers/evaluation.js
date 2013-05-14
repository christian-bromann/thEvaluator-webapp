/*global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/TestrunCollection',
    'models/TestcaseModel',
    'views/widgets/heatmapView'
], function( $, _, Backbone, TestrunCollection, Testcase, Heatmap) {

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
                this.widgets.push(new Heatmap(this.testrunCollection));
            }.bind(this));
        }

    };

    return Evaluation;
});