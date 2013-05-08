/*global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/TestcaseModel'
], function( $, _, Backbone, Testcase) {

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
                }
            });

        }

    };

    return Evaluation;
});