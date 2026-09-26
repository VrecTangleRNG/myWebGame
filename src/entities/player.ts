import { Application, Sprite, Ticker } from 'pixi.js';
import { Gun } from './gun';

export class Player {
	public sprite: Sprite;
	public gun: Gun;
	private app: Application;

	constructor(app: Application) {
		this.sprite = Sprite.from("player");
		app.stage.addChild(this.sprite);
		this.sprite.zIndex = 10;
		this.gun = new Gun(app, true, 2);
		this.app = app;
	}
	
	init() {
		this.sprite.anchor.set(0.5);
		this.sprite.position.y =
			this.app.screen.height -
			this.sprite.height / 2;
		this.sprite.position.x =
			this.sprite.width / 2;

		this.gun.sprite.anchor.y = 0.5;
		this.gun.sprite.position.set(
			this.sprite.position.x,
			this.sprite.position.y
		);
	}

	update(ticker: Ticker) {
		this.gun.update(ticker);
	}
}
