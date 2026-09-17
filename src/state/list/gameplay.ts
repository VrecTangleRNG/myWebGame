// Critical Piece Lines of Codes
import { Application } from "pixi.js";
import { State } from './../machine';

import { Player } from "../../entities/player";


export class GameplayState implements State {
	name = "gameplay";
	app: Application;

	private player: Player;

	constructor(app: Application) {
		this.app = app;
		this.player = new Player(this.app);
	}

	enter(): void {
		this.player.sprite.anchor.set(0.5);
		this.player.sprite.position.x = this.app.screen.height;
	}

	update(delta: number): boolean {
		this.player.sprite.angle += 2 * delta;
		return true;
	}

	exit(): State | void {
		return;
	}
}
