import { Application, Sprite } from 'pixi.js';

import * as Input from './../systems/inputs';


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
	type: ShotType
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
		type: ShotType
	) {
		this.properties = {
			app: app,
			from: { x: xOrigin, y: yOrigin },
			size: size,
			speed: speed,
			angle: 0,
			type: type
		};
		Input.onPointerDown(() => {
			let bullet: Bullet = new Bullet(this.properties);
			this.bullets.push(bullet);
		});
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
		}
	}
}

class Bullet {
	private properties: BulletProperties;
	private sprite: Sprite;

	constructor(properties: BulletProperties) {
		this.properties = { ...properties };

		this.sprite = Sprite.from("particle");
		this.properties.app.stage.addChild(this.sprite);

		this.sprite.zIndex = 9;
		this.sprite.anchor.set(0.5);
		this.sprite.scale.set(this.properties.size);
		this.sprite.position.x = this.properties.from.x;
		this.sprite.position.y = this.properties.from.y;
	}

	update(delta: number) {
		let radians = this.properties.angle * Math.PI / 180;
		this.sprite.position.x += Math.cos(radians) * this.properties.speed * delta;
		this.sprite.position.y += Math.sin(radians) * this.properties.speed * delta;
	}
}
