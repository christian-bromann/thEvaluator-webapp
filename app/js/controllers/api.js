/*global define */
define([
    'jquery'
], function($) {

    'use strict';

    var scope = {};
    var API = function(url) {
        scope = this;
        this.url = url;
    };

    var sendRequest = function() {
        $.ajax({
            url: scope.url,
            type: scope.type,
            data: scope.data,
            dataType: 'json',
            success: function(data) {
                scope.cb(null,data);
            },
            error: function(error) {
                scope.cb(error,null);
            }
        });
    };

    API.prototype = {

        get: function(data,cb) {
            this.type = 'GET';
            this.data = data;
            this.cb   = cb;
            sendRequest();
        },
        post: function(data,cb) {
            this.type = 'POST';
            this.data = data;
            this.cb   = cb;
            sendRequest();
        },
        put: function(data,cb) {
            this.type = 'PUT';
            this.data = data;
            this.cb   = cb;
            sendRequest();
        },
        delete: function(data,cb) {
            this.type = 'DELETE';
            this.data = data;
            this.cb   = cb;
            sendRequest();
        }

    };


    return API;
});