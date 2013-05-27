/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/widgets/FilterView.tpl'
], function ($, _, Backbone,template) {
    'use strict';

    var FilterView = Backbone.View.extend({
        events: {
            'click .filterList a': 'switchFilter'
        },
        initialize: function(el,view,onChangeAction) {
            this.el = el;
            this.$el = $(el);
            this.view = view;
            this.onChangeAction = onChangeAction;

            this.render();
        },
        render: function() {
            this.$el.append(_.template( template ));
        },
        switchFilter: function(e) {

            var elem = $(e.target);

            this.view.param.filter = elem.attr('href').substr(3);
            elem.parents('.btn-group').find('.clear').css('display','inline-block');

            this.onChangeAction.apply(this.view);

        }
    });

    return FilterView;
});