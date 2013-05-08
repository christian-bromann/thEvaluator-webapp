/*global define */

define([
    'jquery',
    'underscore',
    'backbone',
    'models/TestrunModel'
], function($, _, Backbone, Testrun){

    'use strict';

    var TestrunCollection = Backbone.Collection.extend({
        model: Testrun,
        url:function(){
            return 'http://localhost:9001/api/testrun';
        },
        getModelByID: function(id){
            return this.detect(function(model) {
                return model.get('id') === id;
            });
        },
        fetchByTestcase: function(testcase,cb) {
            $.getJSON(this.url()+'/byTestcase/'+testcase.id,cb);
        }
    });

    return TestrunCollection;
});