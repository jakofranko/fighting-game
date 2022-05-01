import phaser from 'phaser';
import PreloadScene from './scenes/PreloadScene';
import ForestScene from './scenes/ForestScene';
import UIScene from './scenes/UIScene';
import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_HEIGHT } from './constants';

const config = {
	type: Phaser.AUTO,
	width: CANVAS_WIDTH,
	height: CANVAS_HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 400 },
            debug: true
		}
	},
	scene: [PreloadScene, UIScene, ForestScene]
}

export default new Phaser.Game(config);
