import { Application, Point, Sprite } from 'pixi.js';

import * as Input from './../systems/inputs';
import { exportedObjects } from "./../state/list/gameplay";
import { Enemy } from './enemy';


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
	private bullets: Bullet[] = [];

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
				this.bullets.push(bullet);
			});
		}
	}

	update(
		delta: number,
		currentAngle: number,
		currentX: number,
		currentY: number
	) {
		this.properties.angle = currentAngle;
		this.properties.from.x = currentX;
		this.properties.from.y = currentY;

		for (let i = 0; i < this.bullets.length; i++) {
			this.bullets[i].update(delta);

			// Delete the bullet when is not flying
			if (!this.bullets[i].isBulletFlying) {
				this.properties.app.stage.removeChild(this.bullets[i].sprite);
				this.bullets.splice(i, 1);
			}
		}
	}
}

class Bullet {
	sprite: Sprite;
	isBulletFlying: boolean = true;
	private properties: BulletProperties;
	private wasShotByPlayer: boolean;
	private pointShape: Point;

	constructor(properties: BulletProperties) {
		this.properties = { ...properties };

		this.sprite = Sprite.from("particle");
		this.properties.app.stage.addChild(this.sprite);

		this.sprite.zIndex = 9;
		this.sprite.anchor.set(0.5);
		this.sprite.scale.set(this.properties.size);
		this.sprite.position.x = this.properties.from.x;
		this.sprite.position.y = this.properties.from.y;

		this.wasShotByPlayer = this.properties.fromPlayer;
		this.pointShape = new Point(this.sprite.x, this.sprite.y);
	}

	update(delta: number) {
		let radians = this.properties.angle * Math.PI / 180;
		this.sprite.position.x += Math.cos(radians) * this.properties.speed * delta;
		this.sprite.position.y += Math.sin(radians) * this.properties.speed * delta;
		this.pointShape.set(this.sprite.x, this.sprite.y);

		if (this.wasShotByPlayer) this.checkEnemyCollision();
	}

	private checkEnemyCollision() {
		let enemies: Enemy[] = exportedObjects[0].getEnemyList();
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].getShape().collidesPoint(this.pointShape)) {
				enemies[i].dealDamage(2);
				this.deleteBullet();
			}
		}
	}

	private deleteBullet() {
		this.isBulletFlying = false;
	}
}
