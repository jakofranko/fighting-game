// This will manage switching states for any Phaser GameObject.
// Every state can have an init, onEnter, onUpdate, and onExit
// functions which will handle lifecycle methods for switching
// between states.
export default class StateMachine {
    constructor(gameObject, label = 'StateMachine', debug = false) {
        this.gameObject = gameObject;
        this.states = {};
        this.lastState = null;
        this.currentState = null;
        this.isSwitchingState = false;
        this.isFrozen = false;
        this.stateQueue = [];
        this.log = debug ? console.log.bind(this, `%c${label} State Machine`, 'color: aliceblue; background-color: darkslategrey; padding: 5px') : () => {} // eslint-disable-line no-console
    }

    addState(stateName, config = {}) {
        if (this.states[stateName]) {
            return;
        }

        this.states[stateName] = {
            onEnter: config.onEnter ? config.onEnter.bind(this.gameObject) : false,
            onUpdate: config.onUpdate ? config.onUpdate.bind(this.gameObject) : false,
            onExit: config.onExit ? config.onExit.bind(this.gameObject) : false
        };

        return this;
    }

    setState(stateName, stateData) {
        if (stateData?.unfreeze) {
            this.log(`Unfreezing from state ${stateName}`);
            this.isFrozen = false;
        }

        if (!this.states[stateName] || stateName === this.currentState || this.isFrozen) {
            this.log(
                'Not setting state:',
                `State exists: ${this.states[stateName] !== undefined}`,
                `Setting to current state: ${stateName === this.currentState}`,
                `Frozen: ${this.isFrozen}`
            );
            return;
        }

        // Avoid race conditions when switching states rapidly
        if (this.isSwitchingState) {
            this.log(`Currently switching state, queueing state ${stateName}`);
            this.stateQueue.push([stateName, stateData]);
            return;
        }

        this.isSwitchingState = true;

        this.log(`Switching state from ${this.currentState} to ${stateName}`);

        if (this.currentState && this.states[this.currentState].onExit) {
            this.states[this.currentState].onExit(stateData);
        }

        if (this.states[stateName].onEnter) {
            this.states[stateName].onEnter(stateData);
        }

        if (stateData?.freeze) {
            this.isFrozen = true;
        }

        this.lastState = this.currentState;
        this.currentState = stateName;

        this.isSwitchingState = false;
    }

    update(delta) {
        // Process stateQueue first before doing updates
        if (this.stateQueue.length) {
            const [newState, newStateData] = this.stateQueue.shift();
            this.setState(newState, newStateData);
            return;
        }

        if (!this.currentState) {
            return;
        }

        if (this.states[this.currentState].onUpdate) {
            this.states[this.currentState].onUpdate(delta);
        }
    }
}
