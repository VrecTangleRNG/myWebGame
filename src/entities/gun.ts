import { Application, Sprite, Ticker } from 'pixi.js';
import { Tween, Easing } from '@tweenjs/tween.js';
import { yoyo } from './../systems/utils';

import { ShotType, BulletContainer } from './bullet';


export class Gun {

	// Gun properties
	public sprite: Sprite;
	public magazine: BulletContainer;
	private aimingMovement: Tween;
	private aimSpeed: number;
	private bulletSize: number;
	private bulletSpeed: number;
	private shotType: ShotType;

	constructor(
		app: Application,
		fromPlayer: boolean,
		aimSpeed?: number,
	) {
		this.sprite = Sprite.from("pistol");
		this.sprite.zIndex = 11;
		this.sprite.angle = 0;

		// TODO: Make the gun anchor itself with different sprite textures
		this.sprite.anchor.set(0, 0.5);

		app.stage.addChild(this.sprite);

		// TODO: Make this customizable later
		this.bulletSize = 1.5;
		this.bulletSpeed = 20;
		this.shotType = ShotType.Precise;
		this.magazine = new BulletContainer(
			app, 0, 0,
			this.bulletSize,
			this.bulletSpeed, this.shotType,
			fromPlayer
		)

		this.aimSpeed = 0;
		this.aimingMovement = new Tween(this.sprite);
		if (aimSpeed) {
			this.aimSpeed = aimSpeed;
			this.aimingMovement
				.to({ angle: -60}, this.aimSpeed * 1000)
				.easing(yoyo(Easing.Linear.InOut))
				.repeat(Infinity)
				.start();
		}
	}

	update(ticker: Ticker): void {
		if (this.aimSpeed) this.aimingMovement.update();
		this.magazine.update(
			ticker,
			this.sprite.angle,
			this.sprite.x,
			this.sprite.y
		);
	}
}
