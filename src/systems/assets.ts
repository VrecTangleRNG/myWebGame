import { Assets } from 'pixi.js';


export async function load() {
	await Assets.load([
		{ alias: "background", src: "/assets/textures/bg.png" },
		{ alias: "particle", src: "/assets/textures/particle.png" },
		{ alias: "pistol", src: "/assets/textures/glock.png" },
		{ alias: "player", src: "/assets/textures/char0.png" },
	]);
}

//export class sounds {}
