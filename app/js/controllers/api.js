/*global define */
define([
    'jquery'
], function($) {

    'use strict';

    var scope = {};
    var API = function(params) {
        scope = this;
        this.params = params;
    };

    var sendRequest = function(cb) {
        $.ajax({
            url: 'http://localhost/api/create',
            type: scope.type,
            data: scope.params,
            dataType: 'json',
            success: function(data) {
                cb(null,data);
            },
            error: function(error) {
                cb(error,null);
            }
        });
    };

    API.prototype = {

        get: function(cb) {
            this.type = 'GET';
            sendRequest(cb);
        },
        post: function(cb) {
            this.type = 'POST';
            sendRequest(cb);
        },
        put: function(cb) {
            this.type = 'PUT';
            sendRequest(cb);
        },
        delete: function(cb) {
            this.type = 'DELETE';
            sendRequest(cb);
        }

    };


    return API;
});