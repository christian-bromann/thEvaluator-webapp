/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/Evaluate.tpl',
    'text!templates/TestcaseOptionView.tpl',
    'collections/TestcaseCollection',
    'bootstrapDropdown'
], function ($, _, Backbone, template, testcaseOptionTemplate, TestCaseCollection) {
    'use strict';

    var EvaluateView = Backbone.View.extend({
        el: '.main',
        initialize:function(){
            this.testCaseCollection = new TestCaseCollection();
            this.render();
        },
        render: function(){
            document.title = 'thEvaluator - Evaluate';

            var that = this;

            this.unrender();
            $(this.el).html( _.template( template ));

            this.testCaseCollection.fetch({
                success: function(collection) {
                    _.each(collection.models,function(testcase) {
                        $(that.el).find('.testcaseList').append(_.template(testcaseOptionTemplate,{url:'/evaluate/',testcase: testcase}));
                    });
                }
            });

        },
        unrender:function(){
            $(this.el).empty();
        },

    });

    return EvaluateView;
});