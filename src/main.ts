import { Application, Sprite, Assets } from "pixi.js";
import { textureManager } from './systems/assets';

async function main(): Promise<void> {
	const app = new Application();

	await app.init({
		width: 960,
		height: 540,
		backgroundColor: 0x000000
	});

	document.body.appendChild(app.canvas);

	const textures = new textureManager();
	await textures.load();

	const player = Sprite.from("player");
	app.stage.addChild(player);

	const gun = Sprite.from("pistol");
	app.stage.addChild(gun);

	player.anchor.set(0.5);
	player.position.x = player.width / 2;
	player.position.y = app.screen.height - player.height / 2;

	app.ticker.add((ticker) => {
		let delta = ticker.deltaMS / 1000;
	});
}

await main();
