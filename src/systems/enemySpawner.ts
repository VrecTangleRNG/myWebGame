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
	private enemies: Enemy[] = [];

	constructor(app: Application, mode: SpawnMode) {
		this.app = app;
		this.mode = mode;
		switch (this.mode) {
			case SpawnMode.Normal:
				this.spawnRate = 1.5;
				this.spawnPoints.push(
					{
						x: app.screen.width,
						y: app.screen.height
					},
					{
						x: app.screen.width,
						y: app.screen.height - 150
					},
					{
						x: app.screen.width,
						y: app.screen.height - 300
					},
					{
						x: app.screen.width,
						y: app.screen.height - 450
					},
				);
				this.targetX.push(400, 500, 600, 700, 800);
				break;
			default: break;
		}
	}

	update(delta: number) {
		this.currentSpawnDuration += delta;
		if (this.currentSpawnDuration >= this.spawnRate) {
			let randomY = Math.floor(Math.random() * this.spawnPoints.length);
			let randomTargetX = Math.floor(Math.random() * this.targetX.length);
			let enemy = new Enemy(
				this.app,
				this.spawnPoints[0].x,
				this.spawnPoints[randomY].y,
				this.targetX[randomTargetX]
			)
			this.enemies.push(enemy);
			this.currentSpawnDuration = 0;
		}

		// Update each instance
		for (let i = 0; i < this.enemies.length; i++) {
			this.enemies[i].update(delta);
		}
	}

	getEnemyList() {
		return this.enemies;
	}
}
