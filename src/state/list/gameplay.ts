import { Application, Sprite } from "pixi.js";
import { State } from './../machine';

import { Player } from "../../entities/player";
import { Gun } from "../../entities/gun";
import { EnemySpawner, SpawnMode } from "../../systems/enemySpawner";


export const exportedObjects: any[] = [];

export class GameplayState implements State {
	name = "gameplay";
	app: Application;

	private player: Player;
	private gun: Gun;
	private background: Sprite;
	private enemySpawner: EnemySpawner;

	constructor(app: Application) {
		this.app = app;

		// Game objects
		this.player = new Player(app);
		this.gun = new Gun(app);

		// Background
		this.background = Sprite.from("background");
		this.app.stage.addChild(this.background);

		// Enemy spawning
		this.enemySpawner = new EnemySpawner(app, SpawnMode.Normal);
		exportedObjects.push(this.enemySpawner);
	}

	enter(): void {
		this.player.sprite.anchor.set(0.5);
		this.player.sprite.position.y =
			this.app.screen.height - 
			this.player.sprite.height / 2;
		this.player.sprite.position.x =
			this.player.sprite.width / 2;

		this.gun.sprite.anchor.y = 0.5;
		this.gun.sprite.position.set(
			this.player.sprite.position.x,
			this.player.sprite.position.y
		);

		this.background.zIndex = 0;
	}

	update(delta: number): boolean {
		this.gun.update(delta);
		this.enemySpawner.update(delta);
		return true;
	}

	exit(): State {
		return;
	}
}
