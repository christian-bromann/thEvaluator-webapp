/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/EvaluateTestcase.tpl',
    'controllers/evaluation'
], function ($, _, Backbone, template, Evaluation) {
    'use strict';

    var EvaluateTestcaseView = Backbone.View.extend({
        el: '.main',
        initialize:function(testcase){

            this.controller = new Evaluation(this,testcase);

        },
        render: function(testcase){
            document.title = 'thEvaluator - Evaluate';

            this.unrender();
            $(this.el).html( _.template( template, {testcase: testcase} ));

        },
        unrender:function(){
            $(this.el).empty();
        },

    });

    return EvaluateTestcaseView;
});