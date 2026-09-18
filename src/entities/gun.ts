import { Application, Sprite } from 'pixi.js';
import { Tween, Easing } from '@tweenjs/tween.js';

export class Gun {
	public sprite: Sprite;

	private aimSpeed: number;
	private aimingMovement: Tween;

	constructor(app: Application) {
		this.sprite = Sprite.from("pistol");
		this.sprite.zIndex = 11;
		app.stage.addChild(this.sprite);

		this.aimSpeed = 20;
		this.aimingMovement = new Tween(this.sprite)
			.to({ angle: -60}, 1000)
			.easing(Easing.Linear.InOut)
			.repeat(Infinity)
			.start();
	}

	// TODO: Add a functionality for gun to take aim up and down
	update(delta: number): void {
		this.aimingMovement.update();
		console.log(this.sprite.angle);
	}
}
