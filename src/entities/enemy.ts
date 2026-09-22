import { Application, ObservablePoint, Sprite } from "pixi.js";
import { Tween, Easing } from "@tweenjs/tween.js";


export class Enemy {
	sprite: Sprite;

	private app: Application;
	private moveToward: Tween;

	constructor(
		app: Application,
		spawnX: number,
		spawnY: number,
		targetX: number,
		speedPerMS: number = 64 / 1000
	) {
		this.app = app;

		this.sprite = Sprite.from("player");
		this.sprite.anchor.set(0.5);
		this.sprite.x = spawnX;
		this.sprite.y = spawnY;
		this.app.stage.addChild(this.sprite);

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
	}
}
