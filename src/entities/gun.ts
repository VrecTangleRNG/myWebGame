import { Application, Sprite } from 'pixi.js';
import { Tween, Easing } from '@tweenjs/tween.js';
import { yoyo } from './../systems/utils';

import * as Input from './../systems/inputs';


export class Gun {
	// Gun properties
	public sprite: Sprite;
	private aimSpeed: number;
	private aimingMovement: Tween;

	constructor(
		app: Application,
		aimSpeed: number = 2,
	) {
		this.sprite = Sprite.from("pistol");
		this.sprite.zIndex = 11;
		this.sprite.angle = 0;
		app.stage.addChild(this.sprite);

		this.aimSpeed = aimSpeed;
		this.aimingMovement = new Tween(this.sprite)
			.to({ angle: -60}, this.aimSpeed * 1000)
			.easing(yoyo(Easing.Linear.InOut))
			.repeat(Infinity)
			.start();
	}

	update(delta: number): void {
		this.aimingMovement.update();
		Input.onPointerDown(() => {
			console.log("I've been clicked!");
		})
	}
}
