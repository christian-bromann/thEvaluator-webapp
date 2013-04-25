/*global define */
define([
    'jquery',
    'views/StartView',
    'views/NavigationView'
], function( $, StartView, NavigationView) {

    'use strict';

    var Application = function() {
        this.init();
    };

    Application.prototype = {

        init: function() {

            this.view = new StartView();
            this.nav  = new NavigationView();

        }

    };

    return Application;
});