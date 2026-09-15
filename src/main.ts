import { Application } from "pixi.js";

const app = new Application();

await app.init({
    width: 960,
    height: 540,
    backgroundColor: 0x202020
});

document.body.appendChild(app.canvas);
