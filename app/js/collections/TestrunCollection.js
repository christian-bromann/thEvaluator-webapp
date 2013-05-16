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
        getEventCoordinates: function(type,ratio) {
            var ret = [],
                i,j;

            if(type !== 'moves' && type !== 'clicks') {
                console.warn('[WARNING] wrong event type ("%s"), choose event type (moves or clicks)',type);
                return [];
            }

            // iterate through all testruns
            for(i = 0; i < this.models.length; ++i) {

                if(!this.models[i][type]) {
                    continue;
                }

                // iterate through all clicks/moves
                for(j = 0; j < this.models[i][type].length; ++j) {
                    var x = this.models[i][type][j].x * ratio,
                        y = this.models[i][type][j].y * ratio;

                    // neglect {0,0} coords
                    if(x === 0 && y === 0) {
                        continue;
                    }

                    ret.push({x: x, y: y});
                }

            }

            // add count attribute (number of all clicks/moves)
            for(var k = 0; k < ret.length; ++k) {
                ret[k].count = ret.length;
            }

            return ret;
        },
        getGeoData: function() {
            var ret = [['Country', 'Participants']],
                participantsByCountry = {};

            // iterate through testruns
            for(var i = 0; i < this.models.length; ++i) {

                if(!this.models[i].geoData) {
                    continue;
                }

                var country = this.models[i].geoData.countryName;
                if(participantsByCountry[country]) {
                    participantsByCountry[country]++;
                } else {
                    participantsByCountry[country] = 1;
                }
            }

            for(var countryName in participantsByCountry) {
                ret.push([countryName,participantsByCountry[countryName]]);
            }

            return ret;
        },
        getStepsCount: function() {
            var click,
                maxSteps = 0,
                minSteps,
                maxTime = 0,
                minTime,
                stepsCount = 0,
                timeCount = 0,
                mostViewed = {},
                currentUrl = '',
                timeNeeded = 0,
                startTime = 0,
                endTime = 0,
                steps = 0,
                successfulTestruns = 0;

            // iterate through testruns
            for(var i = 0; i < this.models.length; ++i) {

                if(!this.models[i].clicks || !this.models[i].clicks.length || this.models[i].status !== 1) {
                    continue;
                }
                successfulTestruns++;

                currentUrl = '';
                steps = 0;
                for(var j = 0; j < this.models[i].clicks.length; ++j) {
                    click = this.models[i].clicks[j];

                    if(currentUrl !== click.url) {
                        steps++;
                        currentUrl = click.url;
                    }

                    if(mostViewed[click.url]) {
                        mostViewed[click.url]++;
                    } else {
                        mostViewed[click.url] = 1;
                    }
                }

                startTime = new Date(this.models[i].clicks[0].timestamp).getTime();
                endTime = new Date(this.models[i].clicks[this.models[i].clicks.length-1].timestamp).getTime();
                timeNeeded = Math.round((endTime - startTime)/100) / 10;

                if(timeNeeded > maxTime) {
                    maxTime = timeNeeded;
                }
                if(!minTime || timeNeeded < minTime) {
                    minTime = timeNeeded;
                }
                timeCount += timeNeeded;

                if(steps > maxSteps) {
                    maxSteps = steps;
                }
                if(!minSteps || steps < minSteps) {
                    minSteps = steps;
                }
                stepsCount += steps;
            }

            function sortByValue(object) {
                var tuples = _.map(object, function (value, key) { return [key, value]; });
                return _.sortBy(tuples, function (tuple) { return tuple[1]; });
            }

            return {
                maxSteps: maxSteps,
                minSteps: minSteps,
                stepsCount: stepsCount,
                maxTime: maxTime,
                minTime: minTime,
                timeCount: timeCount,
                mostViewed: sortByValue(mostViewed),
                testruns: successfulTestruns
            };
        },
        countStatusTypes: function() {
            var ret = [0,0,0,0];

            // iterate through testruns
            for(var i = 0; i < this.models.length; ++i) {
                ret[this.models[i].status]++;
            }

            return ret;
        }
    });

    return TestrunCollection;
});