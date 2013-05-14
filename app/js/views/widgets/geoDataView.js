/*global define,google*/

define([
    'jquery',
    'backbone',
    'goog!visualization,1,packages:[geochart]'
], function ($, Backbone) {
    'use strict';

    var GeoDataView = Backbone.View.extend({
        el: '.geoData',
        initialize: function(testrunCollection){
            this.testrunCollection = testrunCollection;

            this.render();
        },
        render: function() {

            var data    = google.visualization.arrayToDataTable(this.testrunCollection.getGeoData()),
                options = {};

            this.chart = new google.visualization.GeoChart($(this.el).get(0));
            this.chart.draw(data, options);
        }
    });

    return GeoDataView;
});