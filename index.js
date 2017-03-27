'use strict';

// Dependencies
const Events = require('events');

function FlowKeypress (args) {
    let self = new Events();

    args = args || {};
    let events = args.events || {};

    self.handlers = {};
    self.context = args.defaultContext || '_no_context_';

    // assing an event name for each of the key codes configured
    Object.keys(events).forEach(eventName => {
        events[eventName].forEach(handler => {

            if (!handler.keyCode) return;

            let context = handler.context || '_no_context_';
            self.handlers[context] = self.handlers[context] || {};

            self.handlers[context][handler.keyCode] = {
                eventName: eventName,
                ctrl: handler.ctrl || false,
                shift: handler.shift || false
            };
        });
    });

    // listen for key presses
    window.addEventListener('keydown', e => {

        if (!self.handlers[self.context]) { // context must exist
            return;
        }

        let handler = self.handlers[self.context][e.keyCode];

        if (handler) { // handler must exist

            // check for modifiers
            if (handler.ctrl !== e.ctrlKey || handler.shift !== e.shiftKey) {
                return;
            }

            self.emit('keyEvent', {
                name: handler.eventName,
                data: e
            });
        }
    });

    self.setContext = (context) => {
        self.context = context;
    }

    return self;
}

module.exports = FlowKeypress;