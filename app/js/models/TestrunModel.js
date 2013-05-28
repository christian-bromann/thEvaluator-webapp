/*global define */

define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    'use strict';

    var Testrun = Backbone.Model.extend({
        idAttribute: '_id',
        url: function(){
            var id = this.id || this.get('id');
            return 'http://' + window.location.hostname + ':9001/api/testrun/'+(id ? id : '');
        },
        initialize: function(attributes) {
            this.attributes = attributes;
        }
    });

    return Testrun;
});