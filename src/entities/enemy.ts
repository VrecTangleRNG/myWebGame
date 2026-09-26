import { Application, Sprite, Ticker } from "pixi.js";
import Matter from "matter-js";
import { Tween, Easing } from "@tweenjs/tween.js";

import { enemySignals } from "../systems/events";
import { Gun } from "./gun";
import {
	runningPhysicsEngine,
	runningPlayer
}
from "../state/list/gameplay";


export class Enemy {
	public sprite: Sprite;

	private body: Matter.Body;
	private gun: Gun;
	private app: Application;

	private health: number;
	private aimTime: number;
	private currentAimTime: number = 0;
	private targetX: number;
	private xVelocity: number;
	private isAlive: boolean;

	private bodyCopy: { y: number, rad: number };
	private jumpAndDie: Tween;
	private fallOffScreen: Tween;
	private rotateEnemy: Tween;
	private deadAnimationDuration: number;
	private aimingAnimation: Tween;

	constructor(
		app: Application,
		spawnX: number,
		spawnY: number,
		targetX: number,
		speedPerMS: number = 8
	) {
		this.app = app;

		this.sprite = Sprite.from("player");
		this.sprite.anchor.set(0.5);
		this.app.stage.addChild(this.sprite);

		this.body = Matter.Bodies.rectangle(
			spawnX + this.sprite.width / 2 + 4,
			spawnY - this.sprite.height / 2,
			this.sprite.width,
			this.sprite.height, {
				isSensor: true
		});
		Matter.Composite.add(runningPhysicsEngine.world, this.body);
		
		this.gun = new Gun(this.app, false);
		this.gun.sprite.angle = 180;
		this.gun.sprite.scale.y = -1;

		this.health = 2;
		this.aimTime = 3000;
		this.targetX = targetX;
		this.xVelocity = speedPerMS;
		this.isAlive = true;

		// Enemy died animations
		this.deadAnimationDuration = 1500;
		this.bodyCopy = {
			y: this.body.position.y,
			rad: this.body.angle
		}
		this.fallOffScreen = new Tween(this.bodyCopy)
			.to({
				y: this.app.screen.height + this.sprite.height,
			}, this.deadAnimationDuration * 6/10)
			.easing(Easing.Quadratic.In);
		this.jumpAndDie = new Tween(this.bodyCopy)
			.to({
				y: this.body.position.y - 300,
			}, this.deadAnimationDuration * 4/10)
			.easing(Easing.Quadratic.Out)
			.chain(this.fallOffScreen);
		this.rotateEnemy = new Tween(this.bodyCopy)
			.to({
				rad: -Math.PI * 6
			}, this.deadAnimationDuration)
			.easing(Easing.Linear.InOut);

		// Enemy aiming animation
		this.aimingAnimation = new Tween(this.gun.sprite)
			.easing(Easing.Back.Out)
			.onComplete(() => {
				this.aimingAnimation.pause();
			});
	}

	private checkCollision() {
		const collisions = Matter.Query.collides(
			this.body,
			runningPlayer.gun.magazine.getFlyingBulletBodies()
		);

		if (collisions.length > 0) {
			const bulletBody = collisions[0].bodyA === this.body
				? collisions[0].bodyB
				: collisions[0].bodyA;
			this.health -= 2;
			if (this.health <= 0) {
				enemySignals.emit("enemyKilled", bulletBody);
				Matter.Body.setStatic(this.body, true);
				this.body.collisionFilter.mask = 3;
				this.jumpAndDie.start();
				this.rotateEnemy.start();
				this.isAlive = false;
			}
		}
	}

	public update(ticker: Ticker) {

		// Move to target if still alive
		this.aimingAnimation.update();
		this.gun.update(ticker);
		if (this.isAlive) {
			this.checkCollision();
			if (this.body.position.x > this.targetX) {
				Matter.Body.setVelocity(this.body, { x: -this.xVelocity, y: 0 });
			}

			// Target to player in a specified time
			else {
				Matter.Body.setVelocity(this.body, { x: 0, y: 0 });

				if (
					!this.aimingAnimation.isPlaying() &&
					!this.aimingAnimation.isPaused()
				) {
					this.aimingAnimation.to({
						angle: Math.atan2(
							this.sprite.y - runningPlayer.sprite.y,
							this.sprite.x - runningPlayer.sprite.x,
						) * 180 / Math.PI + 180
					}, 1500);
					this.aimingAnimation.start();
				}

				this.currentAimTime += ticker.deltaMS;
				if (this.currentAimTime >= this.aimTime) {
					this.gun.magazine.fireBullet();
					this.currentAimTime = 0;
				}
			}
		}
		else {
			this.jumpAndDie.update();
			this.fallOffScreen.update();
			this.rotateEnemy.update();
			Matter.Body.setPosition(this.body, {
				x: this.body.position.x,
				y: this.bodyCopy.y
			});
			Matter.Body.setAngle(this.body, this.bodyCopy.rad);
		}

		// Match body and gun visual with physics calculations
		this.sprite.x = this.gun.sprite.x = this.body.position.x;
		this.sprite.y = this.gun.sprite.y = this.body.position.y;
		this.sprite.angle = this.body.angle * 180 / Math.PI;
	}
}
