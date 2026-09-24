import { Application, Sprite, Ticker } from "pixi.js";
import Matter from "matter-js";

import { runningPhysicsEngine } from "../state/list/gameplay";


export class Enemy {
	public sprite: Sprite;

	private body: Matter.Body;
	private app: Application;
	private health: number;
	private targetX: number;
	private xVelocity: number;

	constructor(
		app: Application,
		spawnX: number,
		spawnY: number,
		targetX: number,
		speedPerMS: number = 8
	) {
		this.app = app;

		this.sprite = Sprite.from("player");
		this.sprite.anchor.set(0.5);
		this.app.stage.addChild(this.sprite);

		this.body = Matter.Bodies.rectangle(
			spawnX + this.sprite.width / 2 + 4,
			spawnY - this.sprite.height / 2,
			this.sprite.width,
			this.sprite.height, {
				isSensor: true
		});
		Matter.Composite.add(runningPhysicsEngine.world, this.body);

		this.health = 2;
		this.targetX = targetX;
		this.xVelocity = speedPerMS;
	}

	update(ticker: Ticker) {
		if (this.body.position.x > this.targetX) {
			Matter.Body.setVelocity(this.body, { x: -this.xVelocity, y: 0 });
		}
		else {
			Matter.Body.setVelocity(this.body, { x: 0, y: 0 });
		}
		this.sprite.x = this.body.position.x;
		this.sprite.y = this.body.position.y;
	}

	dealDamage(attackPoint: number) {
		console.log(this.health);
		this.health -= attackPoint;
		console.log(this.health);
	}
}
