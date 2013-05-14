/*global define*/

define([
    'jquery',
    'backbone',
    'heatmapjs'
], function ($, Backbone, heatmapFactory) {
    'use strict';

    var HeatmapView = Backbone.View.extend({
        el: '.heatmap',
        initialize:function(testrunCollection){
            this.testrunCollection = testrunCollection;

            this.maxCanvasWidth = $(this.el).width(),
            this.ratio          = this.maxCanvasWidth / this.testrunCollection.models[0]._testcase.resolution[0];

            // set size of screenshots
            $(this.el).css('height',this.testrunCollection.models[0]._testcase.resolution[1] * this.ratio);

            // init heatmap
            var config = {
                'radius': 10,
                'element': $(this.el).get(0),
                'opacity': 50,
                'gradient': { 0.45: 'rgb(0,0,255)', 0.55: 'rgb(0,255,255)', 0.65: 'rgb(0,255,0)', 0.95: 'yellow', 1.0: 'rgb(255,0,0)' }
            };

            this.heatmap = window.heatmapFactory.create(config);
            this.render();
        },
        render: function() {

            // let's get some data
            var data = {
                max: 20,
                data: this.testrunCollection.getClickCoordinates(this.ratio)
            };

            this.heatmap.store.setDataSet(data);

        }
    });

    return HeatmapView;
});