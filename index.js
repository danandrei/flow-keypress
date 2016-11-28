'use strict';

// Dependencies

/*
 *
 * initialize instance
 * @name init
 *
 */
exports.init = (scope, inst, args, data, next) => {

    let events = args.events || {};
    inst.handlers = {};

    // assing an event name for each of the key codes configured
    Object.keys(events).forEach(eventName => {
        events[eventName].forEach(handler => {

            if (!handler.keyCode) return;

            inst.handlers[handler.keyCode] = {
                eventName: eventName,
                ctrl: handler.ctrl || false,
                shift: handler.shift || false
            };
        });
    });

    // listen for key presses
    window.addEventListener('keydown', e => {
        let handler = inst.handlers[e.keyCode];

        if (handler) {

            // check for modifiers
            if (handler.ctrl !== e.ctrlKey || handler.shift !== e.shiftKey) {
                return;
            }

            scope.flow(inst._name + '/' + handler.eventName).write({});
        }
    });

    next(null, data);
};