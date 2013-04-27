/*global define */

define([
    'backbone'
], function(Backbone) {

    'use strict';

    var Task = Backbone.Model.extend({
        idAttribute: 'id',
        initialize: function(attributes) {
            this.attributes = attributes;
        }
    });

    return Task;
});