import { Assets } from 'pixi.js';


export async function load() {
	await Assets.load([
		{ alias: "player", src: "/assets/textures/char0.png" },
		{ alias: "background", src: "/assets/textures/bg.png" },
		{ alias: "particle", src: "/assets/textures/particle.png" },
		{ alias: "pistol", src: "/assets/textures/glock.png" },
	]);
}

//export class sounds {}
