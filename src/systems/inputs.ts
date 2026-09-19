import { Application } from 'pixi.js';


let thisApp: Application;

export function initialize(app: Application) {
	app.stage.eventMode = "static";
	thisApp = app;
}

export function onPointerDown(f: () => any) {
	thisApp.stage.on("pointerdown", f);
}
