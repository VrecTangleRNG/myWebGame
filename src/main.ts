import { Application } from "pixi.js";
import { StateMachine } from './state/machine';

async function main(): Promise<void> {

	// Game Initializations
	const app = new Application();
	await app.init({
		width: 960,
		height: 540,
		backgroundColor: 0x000000
	});
	document.body.appendChild(app.canvas);

	// Game Loop and State Machine
	const stateMachine = new StateMachine(app);
	app.ticker.add((ticker) => {
		let delta = ticker.deltaMS / 1000;
		stateMachine.run(delta);
	});
}

await main();
