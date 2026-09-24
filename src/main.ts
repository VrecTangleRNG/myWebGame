import { Application } from "pixi.js";
import { StateMachine } from './state/machine';
import * as Input from './systems/inputs';
import * as AssetsManager from './systems/assets';

import { GameplayState } from './state/list/gameplay';


async function main(): Promise<void> {

	// Game Initializations
	const app = new Application();
	await app.init({
		width: 960,
		height: 540,
		backgroundColor: 0x000000
	});
	document.body.appendChild(app.canvas);

	app.stage.sortableChildren = true;
	await AssetsManager.load();

	// Game Loop and State Machine
	Input.initialize(app);
	const stateMachine = new StateMachine(new GameplayState(app));
	app.ticker.add((ticker) => {
		stateMachine.run(ticker);
	});
}

await main();
