import { Application, Container, Ticker } from 'pixi.js';


export interface State {
	name: string;
	app: Application;
	container: Container;
	enter(): void;
	update(ticker: Ticker): boolean;
	exit(): State;
}

export class StateMachine {
	private states: State[] = [];

	constructor(initialState: State) {
		this.push(initialState);
	}

	private push(state: State) {
		this.states.push(state);
		this.states[this.states.length - 1].enter();
	}
	
	private pop() {
		this.states.pop();
	}

	run(ticker: Ticker) {
		if (!this.states[this.states.length - 1].update(ticker)) {
			const buffer = this.states[this.states.length - 1].exit();
			this.pop();
			this.push(buffer);
		}
	}
}
