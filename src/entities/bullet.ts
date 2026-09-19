import { Application, Sprite } from 'pixi.js';


export enum ShotType {
}

export class Bullet {
	public sprite: Sprite;
	private size: number;
	private speed: number;
	private angle: number;
	private type: ShotType;

	constructor(app: Application) {
		this.sprite = Sprite.from("particle");
		app.stage.addChild(this.sprite);
		this.sprite.zIndex = 9;
	}
}
