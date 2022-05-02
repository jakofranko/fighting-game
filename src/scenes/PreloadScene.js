import Phaser from 'phaser';
import { CHARACTER_WIDTH, CHARACTER_HEIGHT } from '../constants';

export default class PreloadScene extends Phaser.Scene {
    constructor() {
        super('preload');
    }

    preload() {
        document.fonts.load('32px "PressStart2P"');
        for (var i = 0; i < 12; i++) {
            this.load.image(`forest_layer_${i}`, `assets/backgrounds/Forest/PNG/layer${i}.png`);
        }

        this.load.image('ground', 'assets/backgrounds/Forest/PNG/ground.png');

        this.load.spritesheet(
            'Char3',
            'assets/characters/Char_3_trimmed.png', {
                frameWidth: CHARACTER_WIDTH,
                frameHeight: CHARACTER_HEIGHT
            }
        );
        this.load.spritesheet(
            'Char4',
            'assets/characters/Char_4_trimmed.png', {
                frameWidth: CHARACTER_WIDTH,
                frameHeight: CHARACTER_HEIGHT
            }
        );
        this.load.spritesheet(
            'Char5',
            'assets/characters/Char_5_trimmed.png', {
                frameWidth: CHARACTER_WIDTH,
                frameHeight: CHARACTER_HEIGHT
            }
        );
    }

    create() {
        this.scene.start('forest-scene');
    }
}
