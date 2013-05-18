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

            this.maxCanvasWidth = this.$el.width(),
            this.param.ratio    = this.maxCanvasWidth / this.testrunCollection.models[0]._testcase.resolution[0];

            // init heatmap
            this.config = {
                'radius': 10,
                'element': this.$el.get(0),
                'opacity': 50,
                'gradient': { 0.45: 'rgb(0,0,255)', 0.55: 'rgb(0,255,255)', 0.65: 'rgb(0,255,0)', 0.95: 'yellow', 1.0: 'rgb(255,0,0)' }
            };

            this.render();
        },
        render: function() {

            var content = {
                pages: this.testrunCollection.getStepsCount().mostViewed,
                models: this.testrunCollection.models
            };

            this.$el.prepend(_.template( template, content));

        },
        switchLabel: function(e) {

            if(e.target.nodeName === 'I') {
                e.target = $(e.target).parent();
            }

            if($(e.target).data('param')) {
                delete this.param[$(e.target).data('param')];
                $(e.target).css('display','none');

                if(this[this.view]) {
                    this[this.view]();
                }
            }

            var label = $(e.target).data('placeholder') ? $(e.target).data('placeholder') : $(e.target).html();

            $(e.target).parents('.btn-group').find('>.btn:first-Child').html(label);
        },
        renderHeatmap: function() {

            this.view = 'renderHeatmap';

            if(!this.param.url) {
                this.clear();
                return;
            }

            this.clear();

            // let's get some data
            var data = {
                max: 1,
                data: this.testrunCollection.getEventCoordinates(this.param)
            };

            // render screenshot
            this.$el.find('.screenshot').remove();
            var screenshot = $('<img />').addClass('screenshot');
            screenshot.attr('src','http://localhost:9001/api/testcase/' + this.testcase.id + '/screenshot.jpg?url=' + encodeURIComponent(this.param.url));
            this.$el.append(screenshot);

            screenshot.load(function() {
                this.heatmap = window.heatmapFactory.create(this.config);
                this.heatmap.store.setDataSet(data);
            }.bind(this));

        },
        clear: function() {
            this.$el.find('canvas').remove();
            this.$el.find('.screenshot').remove();
        },
        switchPage: function(e) {
            var elem = $(e.target);

            this.param.url = decodeURIComponent(elem.attr('href').substr(3));
            elem.parents('.btn-group').find('.clear').css('display','inline-block');

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