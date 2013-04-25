/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/startView.tpl',
    'views/TestCaseListView',
    'collections/TestCaseCollection'
], function ($, _, Backbone, template, TestCaseListView, TestCaseCollection) {
    'use strict';

    var StartView = Backbone.View.extend({
        el: '.main',
        initialize:function(){
            this.testCaseCollection = new TestCaseCollection();
        },
        render: function(){
            this.unrender();
            $(this.el).html( _.template( template ));
            this.testCaseListView   = new TestCaseListView({testCaseCollection: this.testCaseCollection});
            this.testCaseListView.render();
        },
        unrender:function(){
            $(this.el).empty();
        },

    });

    return StartView;
});