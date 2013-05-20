/*global define,d3*/

define([
    'jquery',
    'underscore',
    'views/WidgetView',
    'text!/templates/widgets/WalkPathsWidget.tpl',
    'd3'
], function ($, _, WidgetView, template) {
    'use strict';

    var WalkPathsView = WidgetView.extend({
        el: '.walkPaths .content',
        events: {
            'click a':'switchLabel',
        },
        initialize: function() {
            this.param = {};
            this.render();
        },
        render: function() {

            var content = {
                tasks: this.testcase.get('tasks')
            };

            this.$el.prepend(_.template( template, content));

            console.log(d3);

        },
        switchLabel: function(e) {

            if($(e.target).data('param')) {
                delete this.param[$(e.target).data('param')];
                $(e.target).css('display','none');

                if(this[this.view]) {
                    this[this.view]();
                }
            }

            var label = $(e.target).data('placeholder') ? $(e.target).data('placeholder') : $(e.target).html();

            $(e.target).parents('.btn-group').find('>.btn:first-Child').html(label);
        },
    });

    return WalkPathsView;
});