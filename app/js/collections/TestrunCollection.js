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
            var that = this;

            $.getJSON(this.url()+'/byTestcase/'+testcase.id, function(testruns) {
                that.models = testruns;
                cb();
            });
        },
        getClickCoordinates: function(ratio) {
            var ret = [],
                i,j;

            // iterate through all testruns
            for(i = 0; i < this.models.length; ++i) {

                // iterate through all clicks
                for(j = 0; j < this.models[i].clicks.length; ++j) {
                    var x = this.models[i].clicks[j].x * ratio,
                        y = this.models[i].clicks[j].y * ratio;

                    ret.push({x: x, y: y});
                }

            }

            // add count attribute (number of all clicks)
            for(var k = 0; k < ret.length; ++k) {
                ret[k].count = ret.length;
            }

            return ret;
        }
    });

    return TestrunCollection;
});