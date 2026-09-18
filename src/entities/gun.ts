import { Application, Sprite } from 'pixi.js';

export class Gun {
	public sprite: Sprite;

	constructor(app: Application) {
		this.sprite = Sprite.from("pistol");
		app.stage.addChild(this.sprite);
		this.sprite.zIndex = 11;
	}

	// TODO: Add a functionality for gun to take aim up and down
}
