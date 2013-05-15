/*global define, google*/

define([
    'jquery',
    'underscore',
    'views/WidgetView',
    'text!/templates/widgets/ResultsWidget.tpl',
    'goog!visualization,1,packages:[geochart,corechart]'
], function ($, _, WidgetView, template) {
    'use strict';

    var ResultsView = WidgetView.extend({
        name: 'results',
        constructor: function(){
            WidgetView.prototype.constructor.apply( this, arguments );
        },
        initialize: function() {
            this.render();
        },
        render: function() {

            var stepsCount = this.testrunCollection.getStepsCount();
            this.el.find('.content').html(_.template( template, stepsCount));

            var status = this.testrunCollection.countStatusTypes(),
                data   = google.visualization.arrayToDataTable([
                    ['Result', 'Participants'],
                    ['Running',    status[0]],
                    ['Successful', status[1]],
                    ['Timedout',   status[2]],
                    ['Canceled',   status[3]]
                ]);

            var options = {
                title: 'Testrun Results',
                legend: {position: 'right', textStyle: {color: '#333333', fontSize: 12}},
                colors:['blue','green','yellow','red']
            };

            this.pieChart = new google.visualization.PieChart($('.pieChart').get(0));
            this.pieChart.draw(data, options);

        }
    });

    return ResultsView;
});