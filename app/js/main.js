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
        // libraries
        jquery: '../components/jquery/jquery',
        jqueryui: '../components/jquery-ui/jquery-ui',
        bootstrapDropdown: '../components/sass-bootstrap/js/bootstrap-dropdown',
        backbone: '../components/backbone-amd/backbone',
        underscore: '../components/underscore-amd/underscore',
        heatmapjs: '../components/heatmapjs/heatmap',

        // requirejs plugins
        text: '../components/text/text',
        async: '../components/requirejs-plugins/src/async',
        goog: '../components/requirejs-plugins/src/goog',
        propertyParser: '../components/requirejs-plugins/src/propertyParser',

        // application files
        application: 'controllers/app',
        router: 'router',
    }
});

require(['backbone','application','router'], function (Backbone,Application,Router) {

    window.app = new Application();
    window.router = new Router();

});