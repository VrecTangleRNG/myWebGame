import { Application, Sprite, Ticker } from 'pixi.js';
import Matter from 'matter-js';

import * as Input from './../systems/inputs';
import { runningPhysicsEngine } from '../state/list/gameplay';
import { enemySignals } from '../systems/events';

export enum ShotType {
	Precise = 0,
	Burst,
	Repeated
}

type BulletProperties = {
	app: Application,
	from: { x: number, y: number },
	size: number,
	speed: number,
	angle: number,
	type: ShotType,
	fromPlayer: boolean
}

export class BulletContainer {
	private properties: BulletProperties;
	private bulletSprites: Bullet[] = [];
	private bulletBodies: Matter.Body[] = [];

	constructor(
		app: Application,
		xOrigin: number,
		yOrigin: number,
		size: number,
		speed: number,
		type: ShotType,
		fromPlayer: boolean
	) {
		this.properties = {
			app: app,
			from: { x: xOrigin, y: yOrigin },
			size: size,
			speed: speed,
			angle: 0,
			type: type,
			fromPlayer: fromPlayer
		};

		if (fromPlayer) {
			Input.onPointerDown(() => {
				let bullet: Bullet = new Bullet(this.properties);
				this.bulletSprites.push(bullet);
				this.bulletBodies.push(bullet.body);
			});

			enemySignals.on("enemyKilled", (arg) => {
				let index = this.bulletBodies.indexOf(arg);
				this.bulletSprites[index].isBulletFlying = false;
			});
		}
	}

	public getFlyingBullets() {
		return this.bulletSprites;
	}

	public getFlyingBulletBodies() {
		return this.bulletBodies;
	}

	public update(
		ticker: Ticker,
		currentAngle: number,
		currentX: number,
		currentY: number
	) {
		this.properties.angle = currentAngle;
		this.properties.from.x = currentX;
		this.properties.from.y = currentY;

		// TODO: refactor this function into event driven
		for (let i = 0; i < this.bulletSprites.length; i++) {
			this.bulletSprites[i].update(ticker);
			if (!this.bulletSprites[i].isBulletFlying) {
				this.properties.app.stage.removeChild(
					this.bulletSprites[i].sprite
				);
				Matter.Composite.remove(
					runningPhysicsEngine.world,
					this.bulletBodies[i]
				);
				this.bulletSprites.splice(i, 1);
				this.bulletBodies.splice(i, 1);
			}
		}
	}
}

class Bullet {
	public sprite: Sprite;
	public isBulletFlying: boolean = true;
	public body: Matter.Body;

	private properties: BulletProperties;

	constructor(properties: BulletProperties) {
		this.properties = { ...properties };

		this.sprite = Sprite.from("particle");
		this.properties.app.stage.addChild(this.sprite);

		this.sprite.zIndex = 9;
		this.sprite.anchor.set(0.5);
		this.sprite.scale.set(this.properties.size);

		this.body = Matter.Bodies.rectangle(
			this.properties.from.x,
			this.properties.from.y,
			this.sprite.width,
			this.sprite.height
		);
		Matter.Composite.add(runningPhysicsEngine.world, this.body);
	}

	update(ticker: Ticker) {
		let radians = this.properties.angle * Math.PI / 180;
		Matter.Body.setVelocity(this.body, {
			x: Math.cos(radians) * this.properties.speed,
			y: Math.sin(radians) * this.properties.speed,
		});

		this.sprite.x = this.body.position.x;
		this.sprite.y = this.body.position.y;
	}
}
