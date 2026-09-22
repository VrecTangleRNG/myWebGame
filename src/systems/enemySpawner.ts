import { Application } from "pixi.js";

import { Enemy } from "../entities/enemy";


export enum SpawnMode {
	Normal = 0,
}

export class EnemySpawner {
	private app: Application;
	private mode: SpawnMode = SpawnMode.Normal;
	private spawnRate: number = 0;
	private currentSpawnDuration: number = 0;
	private spawnPoints: { x: number, y: number }[] = [];
	private targetX: number[] = [];

	// TODO: keep track of enemies here
	private enemies: any[] = [];

	constructor(app: Application, mode: SpawnMode) {
		this.app = app;
		this.mode = mode;
		switch (this.mode) {
			case SpawnMode.Normal:
				this.spawnRate = 2;
				this.spawnPoints.push(
					{
						x: app.screen.width,
						y: app.screen.height
					}
				);
				this.targetX.push(200);
				break;
			default: break;
		}
	}

	update(delta: number) {
		this.currentSpawnDuration += delta;
		if (this.currentSpawnDuration >= this.spawnRate) {
			let enemy = new Enemy(
				this.app,
				this.spawnPoints[0].x,
				this.spawnPoints[0].y,
				this.targetX[0]
			)
			this.enemies.push(enemy);
			this.currentSpawnDuration = 0;
		}

		// Update each instance
		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update(delta);
		}
	}
}
