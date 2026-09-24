import { Application, Sprite, Ticker } from "pixi.js";
import { State } from './../machine';
import Matter from "matter-js";

import { Player } from "../../entities/player";
import { EnemySpawner, SpawnMode } from "../../systems/enemySpawner";


export let runningPhysicsEngine: Matter.Engine;

export class GameplayState implements State {
	name = "gameplay";
	app: Application;

	private player: Player;
	private background: Sprite;
	private enemySpawner: EnemySpawner;
	private physicsEngine: Matter.Engine;

	constructor(app: Application) {
		this.app = app;
		this.player = new Player(app);

		// Physics engine
		this.physicsEngine = Matter.Engine.create({
			gravity: {
				x: 0, y: 0
			}
		});
		runningPhysicsEngine = this.physicsEngine;

		// Background
		this.background = Sprite.from("background");
		this.app.stage.addChild(this.background);

		// Enemy spawning
		this.enemySpawner = new EnemySpawner(app, SpawnMode.Normal);
	}

	enter(): void {
		this.player.init();
		this.background.zIndex = 0;
	}

	update(ticker: Ticker): boolean {
		Matter.Engine.update(this.physicsEngine, ticker.deltaMS);
		this.enemySpawner.update(ticker);
		this.player.update(ticker);
		return true;
	}

	exit(): State {
		return;
	}
}
