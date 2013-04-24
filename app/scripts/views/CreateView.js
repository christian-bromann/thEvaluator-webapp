/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/createView.tpl'
], function ($, _, Backbone, template) {
    'use strict';

    var CreateView = Backbone.View.extend({
        el: '.main',
        initialize:function(){
            this.render();
        },
        render: function(){
            this.unrender();

            $(this.el).html(_.template( template ));
        },
        unrender:function(){
            $(this.el).empty();
        },

    });

    return CreateView;
});