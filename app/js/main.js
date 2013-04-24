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
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        }
    },
    paths: {
        jquery: '../components/jquery/jquery',
        backbone: '../components/backbone-amd/backbone',
        underscore: '../components/underscore-amd/underscore',
        text: '../components/text/text',
        application: 'controllers/app',
        router: 'router'
    }
});

require(['backbone','application','router'], function (Backbone,Application,Router) {

    window.app = new Application();
    window.router = new Router();

});