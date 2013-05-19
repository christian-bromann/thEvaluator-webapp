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
            'click a[href="#!/clickmap"]': 'renderClickmap',
            'click a[href="#!/heatmap"]': 'renderHeatmap',
            'click a[href="#!/heatmap-timelapse"]': 'renderTimelapse',
            'click a[href="#!/both"]': 'both',
            'click .pageList a': 'switchPage',
            'click .idList a': 'switchID'
        },
        initialize: function() {

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
        renderClickmap: function() {
            this.view = 'renderClickmap';
            this.renderMap('clicks');
        },
        renderHeatmap: function() {
            this.view = 'renderHeatmap';
            this.renderMap('moves');
        },
        renderMap: function(type) {
            this.clear();

            if(!this.param.url) {
                return;
            }

            this.param.type = type;
            this.param.groupedByTestrun = false;

            // let's get some data
            var data = {
                max: 1,
                data: this.testrunCollection.getEventCoordinates(this.param)
            };

            this.createScreenshot().load(function() {

                this.heatmap = window.heatmapFactory.create(this.config);
                this.heatmap.store.setDataSet(data);

            }.bind(this));
        },
        renderTimelapse: function() {

            this.view = 'renderTimelapse';
            this.clear();

            if(!this.param.url) {
                return;
            }

            this.param.type = 'moves';
            this.param.groupedByTestrun = true;

            var screenshot = this.createScreenshot();
            screenshot.load(function() {

                var coordsByRun = this.testrunCollection.getEventCoordinates(this.param),
                    canvas,ctx;

                this.heatmap = window.heatmapFactory.create(this.config);

                for(var i = 0; i < coordsByRun.length; ++i) {

                    // skip if no coords available
                    if(!coordsByRun[i].length) {
                        continue;
                    }

                    canvas = document.createElement('canvas');
                    canvas.height = screenshot.get(0).height;
                    canvas.width  = screenshot.get(0).width;
                    ctx = canvas.getContext('2d');
                    ctx.fillStyle = 'rgb(200,0,0)';

                    this.$el.append(canvas);
                    this.drawLine( ctx , coordsByRun[i] , 1 , coordsByRun[i][0] );
                }

            }.bind(this));


        },
        drawLine: function(ctx,coords,index,currentPoint) {

            if(!coords[index]) {
                return;
            }

            // skip point if x and y is NaN or
            // if time difference is to big, the event originates from new page visit
            if(isNaN(currentPoint.x) || isNaN(currentPoint.y) ||
              (coords[index].timestamp - currentPoint.timestamp) > 200) {
                currentPoint = coords[index];
                ++index;
            }

            // the double IF statement maybe looks wired but is the only way to do it
            if(!coords[index]) {
                return;
            }

            var that = this,
                targetPoint = coords[index],

                tx = targetPoint.x - currentPoint.x,
                ty = targetPoint.y - currentPoint.y,
                dist = Math.sqrt(tx*tx+ty*ty),
                timeDiff = (targetPoint.timestamp - coords[index-1].timestamp) / dist,

                velX = (tx/dist)*1,
                velY = (ty/dist)*1;

            currentPoint.x += velX;
            currentPoint.y += velY;

            ctx.fillRect(currentPoint.x, currentPoint.y, 1, 1);
            if(Math.abs(currentPoint.x - targetPoint.x) > 1 && Math.abs(currentPoint.y - targetPoint.y) > 1) {

                setTimeout(function() {
                    that.drawLine(ctx,coords,index,currentPoint);
                }, timeDiff);

            } else {

                setTimeout(function() {
                    currentPoint.timestamp = targetPoint.timestamp;
                    that.drawLine(ctx,coords,++index,currentPoint);
                }, timeDiff);
            }

        },
        createScreenshot: function() {
            // render screenshot
            this.$el.find('.screenshot').remove();
            var screenshot = $('<img />').addClass('screenshot');
            screenshot.attr('src','http://localhost:9001/api/testcase/' + this.testcase.id + '/screenshot.jpg?url=' + encodeURIComponent(this.param.url));
            this.$el.append(screenshot);

            return screenshot;
        },
        clear: function() {
            delete this.heatmap;
            this.$el.find('canvas').unbind().remove();
            this.$el.find('.screenshot').unbind().remove();
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