/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/testCaseListView.tpl',
    'text!/templates/testCaseListItemView.tpl'
], function ($, _, Backbone, testcaseList, testcaseItem) {
    'use strict';

    var TestCaseListView = Backbone.View.extend({
        el: '.all-testcases',
        events: {
            'click .icon-minus': 'removeTestcase'
        },
        initialize:function(options){
            this.testCaseCollection = options.testCaseCollection;
        },
        render: function(){
            var that = this;
            this.unrender();

            $(this.el).html(_.template( testcaseList ));

            this.testCaseCollection.fetch({
                success: function(collection) {

                    if(collection.models.length) {
                        $.each(collection.models,function(i,testcase) {
                            $('.testcases').append(_.template( testcaseItem, {testcase: testcase} ));
                        });
                    } else {
                        $('.testcases').remove();
                        $(that.el).append('<i>no testcases found</i>');
                    }
                }
            });
        },
        unrender:function(){
            $(this.el).empty();
        },
        removeTestcase: function(e) {
            var elem  = $(e.target).parents('li'),
                model = this.testCaseCollection.getModelByID(elem.data('id'));

            model.destroy();
            elem.remove();
        }

    });

    return TestCaseListView;
});
