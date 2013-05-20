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
            deps: ['jquery'],
            exports: 'jquery'
        },
        jqueryuiSortable: {
            deps: ['jquery']
        }
    },
    paths: {
        // components
        jquery: '../components/jquery/jquery',
        bootstrapDropdown: '../components/sass-bootstrap/js/bootstrap-dropdown',
        backbone: '../components/backbone-amd/backbone',
        underscore: '../components/underscore-amd/underscore',
        d3: '../components/d3/d3.min',

        // libraries
        jqueryuiSortable: '../components/vendor/jquery-ui-1.10.3.sortable.min',
        heatmapjs: '../components/vendor/heatmap',

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