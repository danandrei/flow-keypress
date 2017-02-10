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

    // default keypress context
    state.context = 'graph';

    // assing an event name for each of the key codes configured
    Object.keys(events).forEach(eventName => {
        events[eventName].forEach(handler => {

            if (!handler.keyCode) return;

            let context = handler.context || '_no_context_';
            state.handlers[context] = state.handlers[context] || {};

            state.handlers[context][handler.keyCode] = {
                eventName: eventName,
                ctrl: handler.ctrl || false,
                shift: handler.shift || false
            };
        });
    });

    // listen for key presses
    window.addEventListener('keydown', e => {

        if (!state.handlers[state.context]) { // context must exist
            return;
        }

        let handler = state.handlers[state.context][e.keyCode];

        if (handler) { // handler must exist

            // check for modifiers
            if (handler.ctrl !== e.ctrlKey || handler.shift !== e.shiftKey) {
                return;
            }

            scope.flow(handler.eventName).write({ event: e });
        }
    });

    next(null, data);
};

/*
 *
 * changes state context
 * @name set
 * @param {String} args.context
 * @param {String} data.context
 */
exports.setContext = (scope, state, args, data, next) => {

    let context = args.context || data.context;

    if (!context) {
        return next(null, data);
    }

    if (!state.handlers[context]) {
        return next(new Error('Flow-keypress.setContext: Context does not exist'));
    }

    state.context = context;

    next(null, data);
};