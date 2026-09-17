import { Application } from "pixi.js";
import { State } from './../machine';

import { Player } from "../../entities/player";


export class GameplayState implements State {
	constructor(app: Application) {
		this.app = app;
		this.player = new Player(app);
	}

	name = "gameplay";
	app: Application;

	private player: Player;

	enter(): void {
		this.player.sprite.anchor.set(0.5);
		this.player.sprite.position.y =
			this.app.screen.height - 
			this.player.sprite.height / 2;
		this.player.sprite.position.x =
			this.player.sprite.width / 2;
	}

	update(delta: number): boolean {
		this.player.sprite.angle += 200 * delta;
		return true;
	}

	exit(): State {
		return;
	}
}
