/*global define*/

define([
    'jquery',
    'underscore',
    'backbone',
    'text!/templates/startView.tpl'
], function ($, _, Backbone, template) {
    'use strict';

    var StartView = Backbone.View.extend({
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

    return StartView;
});