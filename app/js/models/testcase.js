/*global define */

define([
    'underscore',
    'backbone'
], function(_, Backbone) {

    'use strict';

    var TestCase = Backbone.Model.extend({
        idAttribute: '_id',
        url: function(){
            return 'http://localhost:9001/api/testcase';
        },
        initialize: function(attributes) {
            this.attributes = attributes;
        },
        getCreationTime: function() {
            var d      = new Date(this.attributes.timestamp),
                month  = d.getMonth()+1,
                day    = d.getDate(),
                hour   = d.getHours(),
                minute = d.getMinutes(),
                second = d.getSeconds();

            var output = d.getFullYear() + '-' +
                ((''+month).length<2 ? '0' : '') + month + '-' +
                ((''+day).length<2 ? '0' : '') + day + ' ' +
                ((''+hour).length<2 ? '0' :'') + hour + ':' +
                ((''+minute).length<2 ? '0' :'') + minute + ':' +
                ((''+second).length<2 ? '0' :'') + second;

            return output;
        }
    });

    return TestCase;
});