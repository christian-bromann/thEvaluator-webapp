/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'views/StartView',
    'views/TestcaseFormView',
    'views/EvaluateView',
    'views/EvaluateTestcaseView'
], function ($, _, Backbone, StartView, CreateView, EvaluateView, EvaluateTestcaseView) {

    'use strict';

    var Router = Backbone.Router.extend({

        routes: {
            'evaluate': 'evaluateView',
            'evaluate/:id': 'evaluateTestcaseView',
            'create': 'createView',
            'edit/:id': 'createView',
            // default:
            '*actions': 'startView'//'evaluateTestcaseView'
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

                if(href.slice(protocol.length) !== protocol && href.indexOf('#!/') === -1) {
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
        },
        evaluateView: function() {
            this.activeView = new EvaluateView();
        },
        evaluateTestcaseView: function(id) {
            this.activeView = new EvaluateTestcaseView({id:id});
        }
    });

    return Router;
});