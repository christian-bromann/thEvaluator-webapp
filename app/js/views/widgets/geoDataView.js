/*global define,google*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/WidgetView',
    'goog!visualization,1,packages:[geochart,corechart]'
], function ($, _, backbone, WidgetView) {
    'use strict';

    var GeoDataView = WidgetView.extend({
        el: '.geoData .content',
        initialize: function() {
            this.data = this.testrunCollection.getGeoData();

            if(this.data.length === 1) {
                this._renderNoContent();
                return;
            }

            this.renderMap();
            this.renderBarChart();
        },
        renderMap: function() {

            var data    = google.visualization.arrayToDataTable(this.data),
                options = {};

            this.geoMap = new google.visualization.GeoChart($(this.el).find('.map').get(0));
            this.geoMap.draw(data, options);
        },
        renderBarChart: function() {
            var data = google.visualization.arrayToDataTable(this.data);

            var options = {
                title: 'Participants By Country',
                legend: { position: 'none' }
            };

            this.barChart = new google.visualization.BarChart($(this.el).find('.barchart').get(0));
            this.barChart.draw(data, options);
        }
    });

    return GeoDataView;
});