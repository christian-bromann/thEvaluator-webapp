/*global define*/

define([
    'jquery',
    'backbone'
], function ($, Backbone) {
    'use strict';

    var AlertView = Backbone.View.extend({
        el: '.main',
        events: {
            'click .close': 'close'
        },
        initialize:function(options){
            this.type = options.type;
            this.content = options.content;

            this.el = $('<div />').addClass('alert').addClass('alert-'+this.type);
            this.el.html(this.content);
            this.el.prepend('<button type="button" class="close" data-dismiss="alert">&times;</button>');

            this.el.delay(5000).fadeOut(this.remove);
        },
        close: function(e) {
            $(e.target).parent().fadeOut(this.remove);
        },
        remove: function() {
            // scope (this) is the alert box not this view!
            this.remove();
        }
    });

    return AlertView;
});