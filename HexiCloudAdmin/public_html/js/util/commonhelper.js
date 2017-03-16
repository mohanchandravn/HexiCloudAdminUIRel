/**
 * Copyright © 2016, Oracle and/or its affiliates. All rights reserved.
 */

/**
 * Singleton with all common helper methods
 */
define([
], function () {
    'use strict';

    function CommonHelper() {

        var self = this;

        self.emailRegExpPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$';
    }

    return new CommonHelper();
});
