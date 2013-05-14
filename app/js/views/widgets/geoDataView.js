/*global define,google*/

define([
    'jquery',
    'views/WidgetView',
    'goog!visualization,1,packages:[geochart]'
], function ($, WidgetView) {
    'use strict';

    var GeoDataView = WidgetView.extend({
        name: 'geoData',
        constructor: function(){
            WidgetView.prototype.constructor.apply( this, arguments );
        },
        initialize: function(){
            this.render();
        },
        render: function() {

            var data    = google.visualization.arrayToDataTable(this.testrunCollection.getGeoData()),
                options = {};

            this.chart = new google.visualization.GeoChart(this.el.get(0));
            this.chart.draw(data, options);
        }
    });

    return GeoDataView;
});