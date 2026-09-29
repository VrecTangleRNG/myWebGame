import { Application, Sprite, Ticker } from 'pixi.js';
import Matter from 'matter-js';
import { Tween, Easing } from '@tweenjs/tween.js';

import { Gun } from './gun';
import { runningPhysicsEngine } from '../state/list/gameplay';
import { gunSignals, playerSignals } from '../systems/events';


export class Player {
	public sprite: Sprite;
	public gun: Gun;
	public health: number = 1;
	private app: Application;
	private body: Matter.Body;
	private bodyCopy: { x: number, y: number, rad: number };

	private jump: Tween;
	private fallOffScreen: Tween;
	private rotate: Tween;
	private animationDuration: number = 1500;

	constructor(app: Application) {
		this.sprite = Sprite.from("player");
		app.stage.addChild(this.sprite);
		this.gun = new Gun(app, true, 2);
		this.app = app;

		this.body = Matter.Bodies.rectangle(
			this.sprite.width / 2,
			this.app.screen.height - this.sprite.height / 2,
			this.sprite.width,
			this.sprite.height,
			{
				isStatic: true,
				label: "fp"
		});
		Matter.Composite.add(runningPhysicsEngine.world, this.body);
		this.bodyCopy = {
			x: this.body.position.x,
			y: this.body.position.y,
			rad: this.body.angle
		};

		this.fallOffScreen = new Tween(this.bodyCopy)
			.to(
				{ y: this.app.screen.height + this.sprite.height },
				3/5 * this.animationDuration
			)
			.easing(Easing.Quadratic.In);
		this.jump = new Tween(this.bodyCopy)
			.to({ y: 200 }, 2/5 * this.animationDuration)
			.easing(Easing.Quadratic.Out)
			.chain(this.fallOffScreen);
		this.rotate = new Tween(this.bodyCopy)
			.to(
				{ rad: -Math.PI * 6 },
				this.animationDuration
			)
			.easing(Easing.Linear.InOut);
	}
	
	init() {
		this.sprite.zIndex = 10;
		this.sprite.anchor.set(0.5);

		this.body.isSensor = true;

		this.gun.sprite.position.set(
			this.body.position.x,
			this.body.position.y
		);
		this.gun.sprite.angle = 0;

		// Collision events
		Matter.Events.on(runningPhysicsEngine, "collisionStart", (event) => {
			let pairs = event.pairs;
			pairs.forEach((pair) => {
				if (
					(pair.bodyA.label === "fp" || pair.bodyB.label === "fp") &&
					(pair.bodyA.label === "e" || pair.bodyB.label === "e")
				) {
					let collidingBody = pair.bodyA === this.body ?
						pair.bodyB :
						pair.bodyA;

					playerSignals.emit("hurt", collidingBody);
					this.health -= 1;

					// Check if dead
					if (this.health <= 0) {
						playerSignals.emit("dead", null);
						gunSignals.emit("throwGun", this.gun);
						this.jump.start();
						this.rotate.start();
					}
				}
			});
		});
	}

	update(ticker: Ticker) {
		if (this.health <= 0) {
			this.jump.update();
			this.fallOffScreen.update();
			this.rotate.update();
			Matter.Body.setPosition(this.body, {
				x: this.bodyCopy.x,
				y: this.bodyCopy.y,
			});
			Matter.Body.setAngle(this.body, this.bodyCopy.rad);
		}

		this.gun.update(ticker);
		this.sprite.x = this.body.position.x;
		this.sprite.y = this.body.position.y;
		this.sprite.angle = this.body.angle * 180 / Math.PI;
	}
}
