import { Application, Sprite, Ticker } from 'pixi.js';
import Matter from 'matter-js';

import { Gun } from './gun';
import { runningPhysicsEngine } from '../state/list/gameplay';


export class Player {
	public sprite: Sprite;
	public gun: Gun;
	public health: number = 20;
	private app: Application;
	private body: Matter.Body;

	constructor(app: Application) {
		this.sprite = Sprite.from("player");
		app.stage.addChild(this.sprite);
		this.gun = new Gun(app, true, 2);
		this.app = app;

		this.body = Matter.Bodies.rectangle(
			this.sprite.width / 2,
			this.app.screen.height - this.sprite.height / 2,
			this.sprite.width,
			this.sprite.height
		);
		Matter.Composite.add(runningPhysicsEngine.world, this.body);

		// Collision events
		Matter.Events.on(runningPhysicsEngine, "collisionStart", (event) => {
			let pairs = event.pairs;
			
			pairs.forEach((pair) => {
				if (
					(pair.bodyA.label !== pair.bodyB.label) &&
					(pair.bodyA === this.body || pair.bodyB === this.body)
				) {
					// TODO: Emit a signal to indicate the player was hurt
					this.health -= 1;
				}
			});
		});
	}
	
	init() {
		this.sprite.zIndex = 10;
		this.sprite.anchor.set(0.5);

		this.body.isSensor = true;
		this.body.label = "f";

		this.gun.sprite.position.set(
			this.body.position.x,
			this.body.position.y
		);
		this.gun.sprite.angle = 0;
	}

	update(ticker: Ticker) {
		this.gun.update(ticker);
		this.sprite.x = this.body.position.x;
		this.sprite.y = this.body.position.y;
	}
}
