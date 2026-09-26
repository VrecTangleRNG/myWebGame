import { Application, Sprite, Ticker, Text, TextStyle } from "pixi.js";
import { State } from './../machine';
import Matter from "matter-js";

import { Player } from "../../entities/player";
import { EnemySpawner, SpawnMode } from "../../systems/enemySpawner";
import { enemySignals } from "../../systems/events";


export let runningPhysicsEngine: Matter.Engine;
export let runningPlayer: Player;

export class GameplayState implements State {
	name = "gameplay";
	app: Application;

	private player: Player;
	private background: Sprite;
	private enemySpawner: EnemySpawner;
	private physicsEngine: Matter.Engine;

	private textStyle: TextStyle;
	private scoreText: Text;			// TODO: Substitute with BitmapText later
	private hpText: Text;				// TODO: Substitute with BitmapText later
	private score: number = 0;

	constructor(app: Application) {
		this.app = app;

		// Physics engine
		this.physicsEngine = Matter.Engine.create({
			gravity: {
				x: 0, y: 0
			}
		});
		runningPhysicsEngine = this.physicsEngine;

		// Player initializations
		this.player = new Player(app);
		runningPlayer = this.player;

		// Background
		this.background = Sprite.from("background");
		this.app.stage.addChild(this.background);

		// Enemy spawning
		this.enemySpawner = new EnemySpawner(app, SpawnMode.Normal);

		// Text rendering
		this.textStyle = new TextStyle({
			fontFamily: "Pacifico",
			fontSize: 36,
			fill: 0x111111
		});
		this.scoreText = new Text({ text: "score: 0", style: this.textStyle});
		this.hpText = new Text({ text: "HP: 20", style: this.textStyle, y: 44});
		this.app.stage.addChild(this.scoreText);
		this.app.stage.addChild(this.hpText);
		enemySignals.on("enemyKilled", () => {
			this.score += 10;
			this.scoreText.text = `score: ${this.score}`;
		});
	}

	enter(): void {
		this.player.init();
		this.background.zIndex = 0;
	}

	update(ticker: Ticker): boolean {
		Matter.Engine.update(this.physicsEngine, ticker.deltaMS);
		this.enemySpawner.update(ticker);
		this.player.update(ticker);
		this.hpText.text = `HP: ${this.player.health}`;
		return true;
	}

	exit(): State {
		return;
	}
}
