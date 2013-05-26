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
        getEventCoordinates: function(opts) {
            var ret = [],
                retGrouped = [],
                type = opts.type || 'clicks',
                ratio = opts.ratio || 1,
                groupedByTestrun = false || opts.groupedByTestrun,
                avgSteps = this.stats.stepsCount / this.stats.testruns,
                avgTime = this.stats.timeCount / this.stats.testruns,
                i,j,duration,moves;

            if(type !== 'moves' && type !== 'clicks') {
                console.warn('[WARNING] wrong event type ("%s"), choose event type (moves or clicks)',type);
                return [];
            }

            // iterate through all testruns
            for(i = 0; i < this.models.length; ++i) {

                if
                    (!this.models[i][type] ||
                    // testrun filter
                    (opts.testrun && opts.testrun !== this.models[i]._id) ||
                    // only successful filter
                    (opts.filter && opts.filter === 'only-successful' && this.models[i].status !== 1) ||
                    // only timedout filter
                    (opts.filter && opts.filter === 'only-timedout' && this.models[i].status !== 2) ||
                    // only failed filter
                    (opts.filter && opts.filter === 'only-failed' && this.models[i].status !== 3)
                ) {
                    continue;
                }

                // iterate through all clicks/moves
                for(j = 0; j < this.models[i][type].length; ++j) {
                    var x   = this.models[i][type][j].x * ratio,
                        y   = this.models[i][type][j].y * ratio,
                        url = this.models[i][type][j].url,
                        timestamp = new Date(this.models[i][type][j].timestamp).getTime();

                    if(
                        // neglect {0,0} coords
                        (x === 0 && y === 0) ||
                        // url filter
                        (opts.url && opts.url !== this.models[i][type][j].url)) {
                        continue;
                    }

                    duration += timestamp;
                    ret.push({x: x, y: y, count: 1, url: url, timestamp: timestamp});
                }

                // get duration
                moves = this.models[i].moves;
                duration = new Date(moves[moves.length - 1].timestamp).getTime() / 1000 - new Date(moves[0].timestamp).getTime() / 1000;

                if(groupedByTestrun) {
                    if(
                        // if no filter is selected add coords anyway
                        !opts.filter || (opts.filter && opts.filter.match(/(fastest|slowest|mostSteps|leastSteps)/) === null) ||
                        // fastest testruns filter
                        (opts.filter && opts.filter === 'fastest' && duration < avgTime) ||
                        // fastest testruns filter
                        (opts.filter && opts.filter === 'slowest' && duration > avgTime) ||
                        // most steps filter
                        (opts.filter && opts.filter === 'mostSteps' && this.models[i].visits.length > avgSteps) ||
                        // least steps filter
                        (opts.filter && opts.filter === 'leastSteps' && this.models[i].visits.length < avgSteps)
                    ) {
                        retGrouped[i] = ret;
                    }
                    ret = [];
                }

            }

            return groupedByTestrun ? retGrouped : ret;
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

            var numberOfTestruns = this.models.length,
                pagevisits = {},
                steps      = 0,
                stepsCount = 0,
                maxSteps   = 0,
                minSteps   = 0,
                timeCount  = 0,
                maxTime    = 0,
                minTime    = 0,
                duration   = 0,
                visit,moves;

            for(var i = 0; i < numberOfTestruns; ++i) {

                steps = this.models[i].visits.length;

                // skip testrun if there are no steps
                if(steps === 0) {
                    continue;
                }

                moves = this.models[i].moves;
                stepsCount += steps;

                if(steps > maxSteps) {
                    maxSteps = steps;
                }
                if(!minSteps || steps < minSteps) {
                    minSteps = steps;
                }

                if(moves.length && this.models[i].status === 1) {
                    duration = new Date(moves[moves.length - 1].timestamp).getTime() / 1000 - new Date(moves[0].timestamp).getTime() / 1000;
                    timeCount += duration;

                    if(duration > maxTime) {
                        maxTime = duration;
                    }
                    if(!minTime || duration < minTime) {
                        minTime = duration;
                    }

                }

                for(var j = 0; j < steps; ++j) {

                    visit = this.models[i].visits[j];

                    if(pagevisits[visit.url]) {
                        pagevisits[visit.url]++;
                    } else {
                        pagevisits[visit.url] = 1;
                    }

                }
            }

            function sortByValue(object) {
                var tuples = _.map(object, function (value, key) { return [key, value]; });
                return _.sortBy(tuples, function (tuple) { return tuple[1]; });
            }

            this.stats = {
                maxSteps: maxSteps,
                minSteps: minSteps,
                stepsCount: stepsCount,
                maxTime: maxTime,
                minTime: minTime,
                timeCount: timeCount,
                mostViewed: sortByValue(pagevisits),
                testruns: numberOfTestruns
            };

            return this.stats;
        },
        countStatusTypes: function() {
            var ret = [0,0,0,0];

            // iterate through testruns
            for(var i = 0; i < this.models.length; ++i) {
                ret[this.models[i].status]++;
            }

            return ret;
        },
        generateWalkPath: function(taskID) {
            var ret = [],
                visitsByTaskID;

            for(var i = 0; i < this.models.length; ++i) {

                visitsByTaskID = _.filter(this.models[i].visits.slice(0), function(visit) {
                    return visit.task === taskID;
                });

                if(visitsByTaskID && visitsByTaskID.length === 0) {
                    continue;
                }

                ret = this.generateTree(ret,visitsByTaskID,0,taskID);
            }
            return ret[0];
        },
        generateTree: function(childs,visits,index,taskID) {

            var visit = visits[index],
                newChild, children;

            if(!visit) {
                return childs;
            } else if(childs && childs.length === 0) {

                children = this.generateTree([],visits,++index,taskID);
                newChild = {
                    name: visit.url,
                    marching: 1,
                    children: children ? children : []
                };

                childs.push(newChild);
                return childs;

            } else {

                for(var i = 0; childs && i < childs.length; ++i) {
                    if(childs[i].name === visit.url) {
                        childs[i].children = this.generateTree(childs[i].children,visits,++index,taskID);
                        childs[i].marching++;

                        return childs;
                    }
                }

                children = this.generateTree([],visits,++index,taskID);
                newChild = {
                    name: visit.url,
                    marching: 1,
                    children: children ? children : []
                };
                childs.push(newChild);
                return childs;

            }

        }
    });

    return TestrunCollection;
});