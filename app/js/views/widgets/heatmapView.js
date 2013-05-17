/*global define*/

define([
    'jquery',
    'underscore',
    'views/WidgetView',
    'text!/templates/widgets/HeatmapWidget.tpl',
    'heatmapjs'
], function ($, _, WidgetView, template) {
    'use strict';

    var HeatmapView = WidgetView.extend({
        el: '.heatmap .content',
        events: {
            'click a':'switchLabel',
            'click a[href="#!/heatmap"]': 'renderHeatmap',
            'click a[href="#!/movemap"]': 'renderMovemap',
            'click a[href="#!/both"]': 'both',
            'click .pageList a': 'switchPage',
            'click .idList a': 'switchID'
        },
        initialize: function() {
            this.super(arguments);

            this.param = {};

            this.maxCanvasWidth = $(this.el).width(),
            this.param.ratio    = this.maxCanvasWidth / this.testrunCollection.models[0]._testcase.resolution[0];

            // set size of screenshots
            $(this.el).css('height',this.testrunCollection.models[0]._testcase.resolution[1] * this.param.ratio);

            // init heatmap
            var config = {
                'radius': 10,
                'element': $(this.el).get(0),
                'opacity': 50,
                'gradient': { 0.45: 'rgb(0,0,255)', 0.55: 'rgb(0,255,255)', 0.65: 'rgb(0,255,0)', 0.95: 'yellow', 1.0: 'rgb(255,0,0)' }
            };

            this.heatmap = window.heatmapFactory.create(config);
            this.canvas  = $(this.el).find('canvas').get(0);
            this.ctx     = this.canvas.getContext('2d');

            this.render();
        },
        render: function() {

            var content = {
                pages: this.testrunCollection.getStepsCount().mostViewed,
                models: this.testrunCollection.models
            };

            $(this.el).prepend(_.template( template, content));

        },
        switchLabel: function(e) {

            if(e.target.nodeName === 'I') {
                e.target = $(e.target).parent();
            }

            if($(e.target).data('param')) {
                delete this.param[$(e.target).data('param')];
                if(this[this.view]) {
                    this[this.view]();
                }
            }

            var label = $(e.target).data('placeholder') ? $(e.target).data('placeholder') : $(e.target).html();

            $(e.target).parents('.btn-group').find('>.btn:first-Child').html(label);
        },
        renderHeatmap: function() {

            this.view = 'renderHeatmap';

            // let's get some data
            var data = {
                max: 1,
                data: this.testrunCollection.getEventCoordinates(this.param)
            };

            this.heatmap.store.setDataSet(data);

        },
        renderMovemap: function() {

            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        },
        switchPage: function(e) {
            this.param.url = decodeURIComponent($(e.target).attr('href').substr(3));

            if(this[this.view]) {
                this[this.view]();
            }
        },
        switchID: function(e) {
            this.param.testrun = $(e.target).attr('href').substr(3);

            if(this[this.view]) {
                this[this.view]();
            }
        }
    });

    return HeatmapView;
});