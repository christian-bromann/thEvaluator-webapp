/*global define*/

define([
    'jquery',
    'underscore',
    'views/WidgetView',
    'text!templates/widgets/HeatmapWidget.tpl',
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
            'click a[href="#!/gazespots"]': 'renderGazespots',
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
        renderClickmap: function() {
            this.view = 'renderClickmap';
            this.clear();

            if(!this.param.url) {
                return;
            }

            this.$el.find('.choose').hide();
            this.param.type = 'clicks';
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
        renderHeatmap: function() {
            this.view = 'renderHeatmap';
            this.clear();

            if(!this.param.url) {
                return;
            }

            this.$el.find('.choose').hide();
            this.param.type = 'moves';
            this.param.groupedByTestrun = true;

            var screenshot = this.createScreenshot();
            screenshot.load(function() {

                this.coordsByRun = this.testrunCollection.getEventCoordinates(this.param);
                this.heatmap = window.heatmapFactory.create(this.config);
                this.heatmap.toggleDisplay();
                this.calculatedRuns = 0;

                this.$el.find('nav').append('<small>Calculating... <em>0%</em></small>');
                setTimeout(function() {
                    this.calculateRun(0);
                }.bind(this), 0);

            }.bind(this));
        },
        renderTimelapse: function() {

            this.view = 'renderTimelapse';
            this.clear();

            if(!this.param.url) {
                return;
            }

            this.$el.find('.choose').hide();
            this.param.type = 'moves';
            this.param.groupedByTestrun = true;

            var screenshot = this.createScreenshot();
            screenshot.load(function() {

                var coordsByRun = this.testrunCollection.getEventCoordinates(this.param),
                    canvas,ctx;

                this.heatmap = window.heatmapFactory.create(this.config);

                for(var i = 0; i < coordsByRun.length; ++i) {

                    // skip if no coords available
                    if(!coordsByRun[i] || !coordsByRun[i].length) {
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
        renderGazespots: function() {
            this.view = 'renderGazespots';
            this.clear();

            if(!this.param.url) {
                return;
            }

            this.$el.find('.choose').hide();
            this.param.type = 'moves';
            this.param.groupedByTestrun = true;

            var currentRadius = this.config.radius;
            this.config.radius = 20;

            var screenshot = this.createScreenshot();
            screenshot.load(function() {

                var coordsByRun = this.testrunCollection.getEventCoordinates(this.param);
                this.heatmap = window.heatmapFactory.create(this.config);
                this.heatmap.toggleDisplay();

                this.$el.find('nav').append('<small>Calculating... <em>0%</em></small>');

                for(var i = 0; i < coordsByRun.length; ++i) {
                    setTimeout(function() {
                        this.ctx.$el.find('nav em').html(Math.round(this.i / (coordsByRun.length-1) * 10000)/100+'%');

                        for(var j = 1; coordsByRun[this.i] && j < coordsByRun[this.i].length; ++j) {
                            if(Math.abs(coordsByRun[this.i][j-1].x - coordsByRun[this.i][j].x) < 3 || Math.abs(coordsByRun[this.i][j-1].y - coordsByRun[this.i][j].y) < 3) {
                                this.ctx.heatmap.store.addDataPoint(coordsByRun[this.i][j-1].x, coordsByRun[this.i][j-1].y);
                            }
                        }

                        if(this.i === coordsByRun.length-1) {
                            this.ctx.$el.find('nav small').delay(1000).fadeOut();
                            this.ctx.config.radius = currentRadius;
                            this.ctx.heatmap.toggleDisplay();
                        }
                    }.bind({ctx:this,i:i}),0);
                }

            }.bind(this));
        },
        calculateRun: function(index) {

            // skip if no coords available
            if(!this.coordsByRun[index] || !this.coordsByRun[index].length) {
                this.finishedCalculatingTestrun();
                return;
            }

            this.drawLine( null , this.coordsByRun[index] , 1 , this.coordsByRun[index][0] );
        },
        drawLine: function(ctx,coords,index,currentPoint) {

            if(!coords[index]) {
                if(!ctx) { this.finishedCalculatingTestrun(); }
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
                if(!ctx) { this.finishedCalculatingTestrun(); }
                return;
            }

            // skip double points
            if(Math.abs(currentPoint.x - coords[index].x) < 3 || Math.abs(currentPoint.y - coords[index].y) < 3) {
                currentPoint.timestamp = coords[index].timestamp;
                this.drawLine(ctx,coords,++index,currentPoint);
                return;
            }

            var that = this,
                targetPoint = coords[index],

                tx = targetPoint.x - currentPoint.x,
                ty = targetPoint.y - currentPoint.y,
                dist = Math.sqrt(tx*tx+ty*ty),
                timeDiff = (targetPoint.timestamp - coords[index-1].timestamp) / dist,

                velX = (tx/dist)*10,
                velY = (ty/dist)*10;

            currentPoint.x += velX;
            currentPoint.y += velY;

            if(ctx) {
                ctx.fillRect(currentPoint.x, currentPoint.y, 1, 1);
                this.heatmap.store.addDataPoint(currentPoint.x, currentPoint.y);
            } else {
                this.heatmap.store.addDataPoint(currentPoint.x, currentPoint.y);
            }

            if(Math.abs(currentPoint.x - targetPoint.x) > velX && Math.abs(currentPoint.y - targetPoint.y) > velY) {

                if(ctx) {
                    setTimeout(function() {
                        that.drawLine(ctx,coords,index,currentPoint);
                    }, timeDiff);
                } else {
                    that.drawLine(ctx,coords,index,currentPoint);
                }

            } else {

                if(ctx) {
                    setTimeout(function() {
                        currentPoint.timestamp = targetPoint.timestamp;
                        that.drawLine(ctx,coords,++index,currentPoint);
                    }, timeDiff);
                } else {
                    currentPoint.timestamp = targetPoint.timestamp;
                    that.drawLine(ctx,coords,++index,currentPoint);
                }
            }

        },
        finishedCalculatingTestrun: function() {
            this.calculatedRuns++;
            this.$el.find('nav em').html((this.calculatedRuns / this.testrunCollection.models.length * 100)+'%');

            setTimeout(function() {
                if(this.testrunCollection.models.length === this.calculatedRuns) {
                    delete this.coordsByRun;
                    this.heatmap.toggleDisplay();
                    this.$el.find('nav small').delay(1000).fadeOut(function() { $(this).remove(); });
                } else {
                    this.calculateRun(this.calculatedRuns);
                }
            }.bind(this),0);
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
        switchLabel: function(e) {
            var elem = $(e.target);

            if(e.target.nodeName === 'I') {
                elem = elem.parent();
            }

            if(elem.data('param')) {
                delete this.param[elem.data('param')];
                elem.css('display','none');

                if(elem.data('param') === 'url') {
                    var testrunList = $('.testrunList');
                    testrunList.find('.clear').css('display','none');
                    testrunList.find('.drpdownLabel').html('By Testrun');
                    testrunList.hide();
                    this.$el.find('.choose').show();
                }

                if(this[this.view]) {
                    this[this.view]();
                }
            }

            var label = elem.data('placeholder') ? elem.data('placeholder') : elem.html();

            if(label.indexOf('http') === 0) {
                label = this.sanitize(label);
            }

            elem.parents('.btn-group').find('>.btn:first-Child').html(label);
        },
        switchPage: function(e) {
            var elem = $(e.target);

            this.param.url = decodeURIComponent(elem.attr('href').substr(3));
            elem.parents('.btn-group').find('.clear').css('display','inline-block');

            if(this[this.view]) {
                this[this.view]();
            }

            this.param.testrun = null;
            this.updateTestrunList();
            $('.testrunList').css('display','inline-block');
        },
        switchID: function(e) {
            var elem = $(e.target);

            this.param.testrun = elem.attr('href').substr(3);
            elem.parents('.btn-group').find('.clear').css('display','inline-block');

            if(this[this.view]) {
                this[this.view]();
            }
        },
        sanitize: function(url) {
            url = url.replace('http://','').replace('https://','');
            url = url.slice(url.indexOf('/'));

            if(url.length > 20) {
                url = url.slice(0,18)+'...';
            }

            return url;
        },
        updateTestrunList: function() {
            var wasOnPage = false;

            for(var i = 0; i < this.testrunCollection.models.length; ++i) {
                wasOnPage = false;

                for(var j = 0; j < this.testrunCollection.models[i].visits.length; ++j) {
                    if(this.testrunCollection.models[i].visits[j].url === this.param.url) {
                        wasOnPage = true;
                    }
                }

                if(!wasOnPage) {
                    $('.'+this.testrunCollection.models[i]._id).hide();
                } else {
                    $('.'+this.testrunCollection.models[i]._id).show();
                }
            }
        }
    });

    return HeatmapView;
});