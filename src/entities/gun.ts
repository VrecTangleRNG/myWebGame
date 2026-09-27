import { Application, Sprite, Ticker, Graphics, GraphicsContext } from 'pixi.js';
import { Tween, Easing } from '@tweenjs/tween.js';
import { yoyo } from './../systems/utils';

import { ShotType, BulletContainer } from './bullet';
import { onPointerDown } from '../systems/inputs';
import { playerSignals } from '../systems/events';


export class Gun {

	// Gun properties
	public sprite: Sprite;
	public magazine: BulletContainer;
	private ownedByPlayer: boolean;
	private aimingMovement: Tween;
	private aimSpeed: number;
	private bulletSize: number;
	private bulletSpeed: number;
	private shotType: ShotType;
	private shootingAnimation: Tween;
	private recoil: number;
	private currentRecoilTime: number = 0;

	// Pointer line and marker
	private pointerLine: Graphics;
	private pointerContext: GraphicsContext;
	private markerPointer: Graphics;
	private markerContext: GraphicsContext;
	private lineLength: number;

	constructor(
		app: Application,
		fromPlayer: boolean,
		aimSpeed?: number,
	) {
		this.sprite = Sprite.from("pistol");
		this.sprite.zIndex = 11;
		this.sprite.angle = 0;

		// TODO: Make the gun anchor itself with different sprite textures
		this.sprite.anchor.set(0, 0.2);

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
		this.ownedByPlayer = fromPlayer;
		this.recoil = 350;

		this.aimSpeed = aimSpeed ? aimSpeed : 0;
		this.aimingMovement = new Tween(this.sprite)
			.to({ angle: -60}, this.aimSpeed * 1000)
			.easing(yoyo(Easing.Linear.InOut))
			.repeat(Infinity)
			.start();

		this.pointerContext = new GraphicsContext();
		this.markerContext = new GraphicsContext();
		this.pointerLine = new Graphics(this.pointerContext);
		this.markerPointer = new Graphics(this.markerContext);
		this.lineLength = 300;
		if (fromPlayer) {
			app.stage.addChild(this.markerPointer);
			app.stage.addChild(this.pointerLine);
			this.markerPointer.zIndex = 9;
			this.pointerLine.zIndex = 9;
		}

		onPointerDown(() => {
			this.aimingMovement.pause();
		});
	}

	update(ticker: Ticker): void {
		if (this.ownedByPlayer) {
			let radians = this.sprite.angle * Math.PI / 180;

			if (this.aimingMovement.isPaused()) {
				this.currentRecoilTime += ticker.deltaMS;
				this.pointerLine.alpha = 0;
				this.markerPointer.alpha = this.currentRecoilTime / this.recoil;

				if (this.currentRecoilTime >= this.recoil) {
					this.currentRecoilTime = 0;
					playerSignals.emit("readyToFire", null);
					this.aimingMovement.resume();
				}
			}

			else {
				this.pointerLine.alpha = 1;
				this.markerPointer.alpha = 1;
				this.markerContext.clear()
					.moveTo(this.sprite.x, this.sprite.y)
					.arc(
						this.sprite.x, this.sprite.y,
						this.lineLength, 0,
						radians, true
					)
					.fill({ color: 0xFFFFFF, alpha: 0.3});
				this.pointerContext.clear()
					.moveTo(this.sprite.x, this.sprite.y)
					.lineTo(
						this.sprite.x + this.lineLength * Math.cos(radians),
						this.sprite.y + this.lineLength * Math.sin(radians)
					)
					.stroke({ width: 2, color: 0xFFFFFF });
			}
			this.aimingMovement.update();
		}

		this.magazine.update(
			ticker,
			this.sprite.angle,
			this.sprite.x,
			this.sprite.y
		);
	}
}
