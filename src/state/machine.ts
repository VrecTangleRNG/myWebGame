import { Application } from 'pixi.js';


export interface State {
	name: string;
	app: Application;
	enter(): void;
	update(delta: number): boolean;
	exit(): State | void;
}

export class StateMachine {
	private app: Application;
	private states: State[] = [];

	constructor(app: Application) {
		this.app = app;
	}

	push(state: State): void {
		this.states.push(state);
		this.states[this.states.length - 1].enter();
	}
	
	pop() {
		this.states[this.states.length - 1].exit();
		return this.states.pop();
	}

	// TODO: Implement this next
	update(delta: number) {
		return;
	}
}
