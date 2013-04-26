/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/StartView',
    'views/TestcaseFormView'
], function ($, _, Backbone, StartView, CreateView) {

    'use strict';

    var Router = Backbone.Router.extend({

        routes: {
            'create': 'createView',
            'edit/:id': 'createView',
            '*actions': 'startView'
        },

        activeView: null,

        initialize: function() {
            var that = this;

            // make beautiful URLs without hashtags
            Backbone.history.start({ pushState: true });
            $(document).on('click', 'a', function(e) {

                var href     = $(this).attr('href'),
                    protocol = this.protocol + '//';

                if(href === undefined) {
                    return false;
                }

                if(href.slice(protocol.length) !== protocol) {
                    e.preventDefault();
                    that.navigate(href, true);
                }
            });

            // unrender active view
            Backbone.history.loadUrl = (function(old){
                return function() {
                    if(that.activeView) {
                        that.activeView.undelegateEvents();
                        that.activeView.unrender();
                        that.activeView = null;
                    }
                    old.apply( Backbone.history, arguments );
                };
            })(Backbone.history.loadUrl);

            return this;
        },

        startView: function() {
            this.activeView = new StartView();
        },
        createView: function(id) {
            this.activeView = new CreateView({id:id});
        }
    });

    return Router;
});