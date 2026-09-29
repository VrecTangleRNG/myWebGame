import { Assets } from 'pixi.js';


export async function load() {
	await Assets.load([

		// Textures
		{ alias: "background", src: "/assets/textures/bg.png" },
		{ alias: "particle", src: "/assets/textures/particle.png" },
		{ alias: "platform", src: "/assets/textures/rect8.png" },
		{ alias: "pistol", src: "/assets/textures/glock.png" },
		{ alias: "player", src: "/assets/textures/char0.png" },

		// UI elements
		{ alias: "gameoverBanner", src: "/assets/textures/gameOver.png" },
		{ alias: "backButton", src: "/assets/textures/backButton.png" },
		{ alias: "reviewButton", src: "/assets/textures/reviewButton.png" },

		// Texts
		{ alias: "Rationale", src: "https://fonts.googleapis.com/css2?family=Rationale&display=swap" },
	]);
}

//export class sounds {}
