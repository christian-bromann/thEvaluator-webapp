/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        bootstrapDropdown: {
            deps: ['jquery','jqueryui'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../components/jquery/jquery',
        jqueryui: '../components/jquery-ui/jquery-ui',
        bootstrapDropdown: '../components/sass-bootstrap/js/bootstrap-dropdown',
        backbone: '../components/backbone-amd/backbone',
        underscore: '../components/underscore-amd/underscore',
        text: '../components/text/text',
        heatmapjs: '../components/heatmapjs/heatmap',
        application: 'controllers/app',
        router: 'router'
    }
});

require(['backbone','application','router'], function (Backbone,Application,Router) {

    window.app = new Application();
    window.router = new Router();

});