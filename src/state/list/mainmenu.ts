import { Application, Container, Ticker, Sprite, Text, TextStyle } from "pixi.js";

import { State } from './../machine';
import { GameplayState } from "./gameplay";

export class MainmenuState implements State {
	name = "mainmenu";
	app: Application;
	container: Container;

	private background: Sprite;
	private textStyle: TextStyle;
	private text: Text;
	private isClicked: boolean;

	constructor(app: Application) {
		this.app = app;
		this.container = new Container();
		app.stage.addChild(this.container);

		this.background = Sprite.from("background");
		this.textStyle = new TextStyle();
		this.text = new Text();
		this.isClicked = false;

		this.container.addChild(this.background, this.text);

		app.stage.on("pointertap", () => {
			this.isClicked = true;
		});
	}

	enter(): void {
		this.background.zIndex = 0;

		this.textStyle.fontSize = 36;
		this.textStyle.fill = 0x000000;

		this.text.style = this.textStyle;
		this.text.text = "Hello playtester, welcome to the prototype!\n\
		The enemies are chasing you from right!\n\
		Survive with your gun at the bottom left of screen\n\
		Click the screen with your mouse/finger to shoot while\n\
		swinging the gun aiming up and down.\n\
		don't aim too long or the enemies will shoot you back!\n\n\Submit\
		any bugs and glitches to the provided forms\n\
		from \"GIVE INPUTS\" button at the game over screen\n\n\
		And lastly, tap the screen to HAVE FUN!";
	}

	update(ticker: Ticker): boolean {
		if (this.isClicked) return false;
		return true;
	}

	exit(): State {
		this.container.removeChild(this.text);
		return new GameplayState(this.app);
	}
}
