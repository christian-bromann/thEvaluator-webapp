/*global define*/

define([
    'jquery',
    'backbone',
    'views/CreateView'
], function ($, Backbone, CreateView) {

    'use strict';

    var Router = Backbone.Router.extend({

        routes: {
            'create': 'createView',
            '*actions': 'startView'
        },

        initialize: function() {
            var that = this;

            Backbone.history.start({ pushState: true });
            $(document).on('click', 'a', function(e) {

                var href     = $(this).attr('href'),
                    protocol = this.protocol + '//';

                if(href.slice(protocol.length) !== protocol) {
                    e.preventDefault();
                    that.navigate(href, true);
                }
            });

            return this;
        },

        startView: function() {
            document.title = 'thEvaluator - Home';
            window.app.view.render();
        },
        createView: function() {
            document.title = 'thEvaluator - Create new Testcase';
            new CreateView();
        }
    });

    return Router;
});