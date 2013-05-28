/*global define */

define([
    'jquery',
    'underscore',
    'backbone',
    'models/TestcaseModel'
], function($, _, Backbone, TestCase){

    'use strict';

    var TestCaseCollection = Backbone.Collection.extend({
        model: TestCase,
        url:function(){
            return 'http://' + window.location.hostname + ':9001/api/testcase';
        },
        getModelByID: function(id){
            return this.detect(function(model) {
                return model.get('id') === id;
            });
        },
    });

    return TestCaseCollection;
});