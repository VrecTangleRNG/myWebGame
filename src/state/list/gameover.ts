import { Application, Container, Sprite, Ticker } from "pixi.js";

import { State } from './../machine';


export class gameoverState implements State {
	name = "gameover";
	app: Application;
	container: Container;

	private gameoverBanner: Sprite;
	private backButton: Sprite;
	private reviewButton: Sprite;
	private toReviewPage: boolean = false;
	private toMainMenu: boolean = false;

	constructor(app: Application) {
		this.app = app;
		this.container = new Container();

		this.gameoverBanner = Sprite.from("gameoverBanner");
		this.backButton = Sprite.from("backButton");
		this.reviewButton = Sprite.from("reviewButton");
		this.container.addChild(
			this.gameoverBanner,
			this.backButton,
			this.reviewButton
		);
		this.app.stage.addChild(this.container);
	}

	enter(): void {
		this.container.zIndex = 256;

		this.gameoverBanner.anchor.set(0.5);
		this.gameoverBanner.x = this.app.screen.width / 2;
		this.gameoverBanner.y = this.app.screen.height / 2;

		this.backButton.anchor.set(0.5);
		this.backButton.x = this.gameoverBanner.x;
		this.backButton.y = this.gameoverBanner.y;
		this.backButton.eventMode = "static";
		this.backButton.cursor = "pointer";
		this.backButton.on("pointertap", () => {
			this.toMainMenu = true;
			console.log("this was clicked!");
		});

		this.reviewButton.anchor.set(0.5);
		this.reviewButton.x = this.gameoverBanner.x;
		this.reviewButton.y = this.backButton.y + this.backButton.height + 50;
		this.reviewButton.eventMode = "static";
		this.reviewButton.cursor = "pointer";
		this.reviewButton.on("pointertap", () => {
			this.toReviewPage = true;
			console.log("this was clicked too!");
		});
	}

	update(ticker: Ticker): boolean {
		if (this.toMainMenu || this.toReviewPage) return true;
		return true;
	}

	exit(): State {
		return;
	}
}
