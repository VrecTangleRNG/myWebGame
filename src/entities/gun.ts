import { Application, Sprite } from 'pixi.js';
import { Tween, Easing } from '@tweenjs/tween.js';
import { yoyo } from './../systems/utils';

import { ShotType, BulletContainer } from './bullet';


export class Gun {
	// Gun properties
	public sprite: Sprite;
	private aimingMovement: Tween;
	private aimSpeed: number;
	private bulletSize: number;
	private bulletSpeed: number;
	private shotType: ShotType;
	private magazine: BulletContainer;

	constructor(
		app: Application,
		aimSpeed: number = 2,
	) {
		this.sprite = Sprite.from("pistol");
		this.sprite.zIndex = 11;
		this.sprite.angle = 0;
		app.stage.addChild(this.sprite);

		// TODO: Make this customizable later
		this.bulletSize = 1.5;
		this.bulletSpeed = 2000;
		this.shotType = ShotType.Precise;
		this.magazine = new BulletContainer(
			app, 0, 0,
			this.bulletSize,
			this.bulletSpeed,
			this.shotType
		)

		this.aimSpeed = aimSpeed;
		this.aimingMovement = new Tween(this.sprite)
			.to({ angle: -60}, this.aimSpeed * 1000)
			.easing(yoyo(Easing.Linear.InOut))
			.repeat(Infinity)
			.start();
	}

	update(delta: number): void {
		this.aimingMovement.update();
		this.magazine.update(
			delta,
			this.sprite.angle,
			this.sprite.x, this.sprite.y
		);
	}
}
