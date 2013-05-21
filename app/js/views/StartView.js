/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/Start.tpl',
    'views/TestcaseListView',
    'collections/TestcaseCollection'
], function ($, _, Backbone, template, TestCaseListView, TestCaseCollection) {
    'use strict';

    var StartView = Backbone.View.extend({
        el: '.main',
        initialize:function(){
            this.testCaseCollection = new TestCaseCollection();
            this.render();
        },
        render: function(){
            document.title = 'thEvaluator - Home';

            this.unrender();
            $(this.el).html( _.template( template ));
            this.testCaseListView   = new TestCaseListView({testCaseCollection: this.testCaseCollection});
            this.testCaseListView.render();
        },
        unrender:function(){
            $(this.el).empty();
        }

    });

    return StartView;
});