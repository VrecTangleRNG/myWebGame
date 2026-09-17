import { Application, Sprite } from 'pixi.js';

export class Player {
	public sprite: Sprite;

	constructor(app: Application) {
		this.sprite = Sprite.from("player");
		app.stage.addChild(this.sprite);
	}
}
