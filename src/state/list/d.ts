import { Application } from "pixi.js";

import { State } from './../machine';


export class DummyState implements State {
	name = "gameplay";
	app: Application;


	constructor(app: Application) {
		this.app = app;
	}

	enter(): void {
	}

	update(delta: number): State {
	}

	exit():void {
	}
}
