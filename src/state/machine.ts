import { Application } from 'pixi.js';


export interface State {
	name: string;
	app: Application;
	enter(): void;
	update(delta: number): boolean;
	exit(): State;
}

export class StateMachine {
	constructor(initialState: State) {
		this.push(initialState);
	}

	private states: State[] = [];

	private push(state: State) {
		this.states.push(state);
		this.states[this.states.length - 1].enter();
	}
	
	private pop() {
		this.states[this.states.length - 1].exit();
		return this.states.pop();
	}

	run(delta: number) {
		if (!this.states[this.states.length - 1].update(delta)) {
			this.push(this.states[this.states.length - 1].exit());
			this.pop();
		}
	}
}
