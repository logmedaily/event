class Event {
    constructor() {
        this.logger = null;
        this.actions = {};
    }

    initialize(logger) {
        this.logger = logger;
    }

    register(actionName, handler) {
        if (typeof handler !== 'function') {
            throw new Error(`Handler for action '${actionName}' must be a function.`);
        }
        this.actions[actionName] = handler;
    }

    unregister(actionName) {
        if (this.actions.hasOwnProperty(actionName)) {
            delete this.actions[actionName];
        } else {
            this.logger && this.logger.warning(`Action '${actionName}' is not registered.`);
        }
    }

    process(code, action, data) {
        if (!this.logger) {
            throw new Error('Logger is not initialized.');
        }

        this.logger.info(code, 'Event triggered', `Action: ${action}`);

        if (this.actions.hasOwnProperty(action)) {
            try {
                const result = this.actions[action](data);
                this.logger.success(code, 'Event processed', `Action: ${action}`);
                return result;
            } catch (error) {
                this.logger.error(code, 'Event processing failed', `Action: ${action}`, error);
                throw error;
            }
        } else {
            this.logger.warning(code, 'Event action not found', `Action: ${action}`);
            throw new Error(`Action '${action}' is not registered.`);
        }
    }
}

if (typeof module !== 'undefined') {
    module.exports = Event;
} else if (typeof window !== 'undefined') {
    window.Event = Event;
} else if (typeof exports !== 'undefined') {
    exports.default = Event;
}