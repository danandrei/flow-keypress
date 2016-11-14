'use strict';

// Dependencies

/*
 *
 * initialize instance
 * @name init
 *
 */
exports.init = (scope, inst, args, data, next) => {
    console.log(scope, inst, args);
    next(null, data);
};