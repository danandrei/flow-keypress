'use strict';

// Dependencies

/*
 *
 * initialize a new state
 * @name init
 * @param {Object} args.events
 * @param {Int} args.events.$eventName.$.keyCode
 * @param {Boolean} args.events.$eventName.$.shift
 * @param {Boolean} args.events.$eventName.$.ctrl
 */
exports.init = (scope, state, args, data, next) => {

    let events = args.events || {};
    state.handlers = {};

    // assing an event name for each of the key codes configured
    Object.keys(events).forEach(eventName => {
        events[eventName].forEach(handler => {

            if (!handler.keyCode) return;

            state.handlers[handler.keyCode] = {
                eventName: eventName,
                ctrl: handler.ctrl || false,
                shift: handler.shift || false
            };
        });
    });

    // listen for key presses
    window.addEventListener('keydown', e => {
        let handler = state.handlers[e.keyCode];

        if (handler) {

            // check for modifiers
            if (handler.ctrl !== e.ctrlKey || handler.shift !== e.shiftKey) {
                return;
            }

            scope.flow(handler.eventName).write({ event: e });
        }
    });

    next(null, data);
};