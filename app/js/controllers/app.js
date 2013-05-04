/*global define */
define([
    'jquery',
    'underscore',
    'backbone',
    'views/NavigationView'
], function( $, _, Backbone, NavigationView) {

    'use strict';

    var Application = function() {
        this.init();
    };

    Application.prototype = {

        init: function() {

            this.nav  = new NavigationView();
            this.eventDispatcher = _.extend({}, Backbone.Events);

        }

    };

    return Application;
});