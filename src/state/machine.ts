import { Application, Ticker } from 'pixi.js';


export interface State {
	name: string;
	app: Application;
	enter(): void;
	update(ticker: Ticker): boolean;
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

	run(ticker: Ticker) {
		if (!this.states[this.states.length - 1].update(ticker)) {
			this.push(this.states[this.states.length - 1].exit());
			this.pop();
		}
	}
}
