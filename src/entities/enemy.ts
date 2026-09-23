import { Application, Sprite } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";
import * as Shapes from "yy-intersects";


export class Enemy {
	sprite: Sprite;

	private app: Application;
	private health: number;
	private shape: Shapes.Rectangle;
	private moveToward: Tween;

	constructor(
		app: Application,
		spawnX: number,
		spawnY: number,
		targetX: number,
		speedPerMS: number = 128 / 1000
	) {
		this.app = app;

		this.sprite = Sprite.from("player");
		this.sprite.anchor.set(0.5);
		this.sprite.x = spawnX + this.sprite.width / 2 + 4;
		this.sprite.y = spawnY - this.sprite.height / 2;
		this.app.stage.addChild(this.sprite);

		this.health = 2;
		this.shape = new Shapes.Rectangle(this.sprite);
		this.moveToward = new Tween(this.sprite.position)
			.to({ x: targetX }, Math.abs(targetX - spawnX) / speedPerMS)
			.easing(Easing.Linear.InOut)
			.onComplete(() => {
				this.moveToward.stop();
			})
			.start();
	}

	update(delta: number) {
		this.moveToward.update();
		this.shape.update();
	}

	dealDamage(attackPoint: number) {
		console.log(this.health);
		this.health -= attackPoint;
		console.log(this.health);
	}

	getShape(): Shapes.Rectangle {
		return this.shape;
	}
}
