import { Application, Sprite, Ticker, Text, TextStyle, Container } from "pixi.js";
import { State } from './../machine';
import Matter from "matter-js";

import { EnemySpawner, SpawnMode } from "../../systems/enemySpawner";
import { enemySignals } from "../../systems/events";

import { GameoverState } from "./gameover";
import { Player } from "../../entities/player";


export let runningPhysicsEngine: Matter.Engine;
export let runningPlayer: Player;

export class GameplayState implements State {
	name = "gameplay";
	app: Application;
	container: Container = new Container;

	private player: Player;
	private enemySpawner: EnemySpawner;
	private physicsEngine: Matter.Engine;

	private textStyle: TextStyle;
	private scoreText: Text;			// TODO: Substitute with BitmapText later
	private hpText: Text;				// TODO: Substitute with BitmapText later
	private score: number = 0;
	private waitTIme: number = 2500;

	constructor(app: Application) {
		this.app = app;

		// Physics engine
		this.physicsEngine = Matter.Engine.create({
			gravity: {
				x: 0, y: 2
			}
		});
		runningPhysicsEngine = this.physicsEngine;

		// Player
		this.player = new Player(app);
		runningPlayer = this.player;

		// Enemy spawning
		this.enemySpawner = new EnemySpawner(app, SpawnMode.Normal);

		// Text rendering
		this.textStyle = new TextStyle({
			fontSize: 36,
			fill: 0x111111
		});
		this.scoreText = new Text({ text: "score: 0", style: this.textStyle});
		this.hpText = new Text({ text: "HP: 20", style: this.textStyle, y: 44});
		this.app.stage.addChild(this.scoreText);
		this.app.stage.addChild(this.hpText);

		// Events
		enemySignals.on("enemyKilled", () => {
			this.score += 10;
			this.scoreText.text = `score: ${this.score}`;
		});
	}

	enter(): void {
		this.player.init();
	}

	update(ticker: Ticker): boolean {
		Matter.Engine.update(this.physicsEngine, ticker.deltaMS);
		this.enemySpawner.update(ticker);
		this.player.update(ticker);
		this.hpText.text = `HP: ${this.player.health}`;

		if (this.player.health <= 0) {
			this.waitTIme -= ticker.deltaMS;
			if (this.waitTIme <= 0) return false;
		}
		return true;
	}

	exit(): State {
		this.enemySpawner.clearEnemies();
		this.player.clear();

		Matter.Events.off(this.physicsEngine);
		Matter.World.clear(this.physicsEngine.world, false);
		Matter.Engine.clear(this.physicsEngine);
		return new GameoverState(this.app);
	}
}
