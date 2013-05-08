/*global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'collections/TestrunCollection',
    'models/TestcaseModel'
], function( $, _, Backbone, TestrunCollection, Testcase) {

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

        },

        fetchTestruns: function() {
            this.testrunCollection = new TestrunCollection();
            this.testrunCollection.fetchByTestcase(this.testcase,function(testruns) {
                console.log(testruns);
            });
        }

    };

    return Evaluation;
});