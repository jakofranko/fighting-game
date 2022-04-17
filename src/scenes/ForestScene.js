import Phaser from 'phaser';
import {
    CANVAS_HEIGHT,
    BACKGROUND_X_OFFSET,
    BACKGROUND_Y_OFFSET,
    BACKGROUND_SCALE,
    CHARACTER_WIDTH,
    CHARACTER_HEIGHT
} from '../constants';

export default class ForestScene extends Phaser.Scene {
    constructor() {
        super('forest-scene');
        this.player1 = undefined;
        this.player2 = undefined;
        this.cursors = undefined;
        this.animationIsPlaying = false;
    }

    preload() {
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
        this.createBackground();
        this.ground = this.createGround();
        this.createForeground();
        this.player1 = this.createPlayer1();

        console.log(this.player1, this.ground)

        // Create colliders
        this.physics.add.collider(this.player1, this.ground);

        // Add cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    createBackground() {
        for (var i = 0; i < 11; i++) {
            this.add.image(BACKGROUND_X_OFFSET, BACKGROUND_Y_OFFSET, `forest_layer_${i}`)
                .setOrigin(0, 0)
                .setScale(BACKGROUND_SCALE);
        }
    }

    createGround() {
        const ground = this.physics.add.staticImage(0, CANVAS_HEIGHT - 68, 'ground');
        ground.setOrigin(0, 0);
        ground.setScale(BACKGROUND_SCALE);
        ground.refreshBody();

        return ground;
    }

    createForeground() {
        this.add.image(BACKGROUND_X_OFFSET, BACKGROUND_Y_OFFSET, 'forest_layer_11')
            .setOrigin(0, 0)
            .setScale(BACKGROUND_SCALE);
    }

    createPlayer1() {
        const player1 = this.physics.add.sprite(100, 150, 'Char3');
        player1.setBounce(0.1);
        player1.setCollideWorldBounds(true);
        player1.body.setGravityY(300);

        this.createPlayer1Animations();

        return player1;
    }

    createPlayer1Animations() {
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('Char3', {
                frames: [0]
            }),
            frameRate: 10
        });

        this.anims.create({
            key: 'forward',
            frames: this.anims.generateFrameNumbers('Char3', {
                frames: [17, 18, 19]
            }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'back',
            frames: this.anims.generateFrameNumbers('Char3', {
                frames: [1, 2]
            }),
            frameRate: 10,
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('Char3', {
                frames: [4, 5, 6, 7]
            }),
            frameRate: 10,
        });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player1.setVelocityX(-160)
            this.startAnimation('back');
        } else if (this.cursors.right.isDown) {
            this.player1.setVelocityX(160)
            this.startAnimation('forward');
        } else {
            this.player1.setVelocityX(0)
        }

        if (
            this.cursors.left.isUp &&
            this.cursors.right.isUp &&
            this.cursors.up.isUp
        ) {
            this.animationIsPlaying = false;
            this.player1.anims.play('idle');
        }

        if (this.cursors.up.isDown && this.player1.body.touching.down) {
            this.player1.setVelocityY(-330);
            this.player1.anims.play('jump')
        }
    }

    startAnimation(anim) {
        if (this.animationIsPlaying === false) {
            this.animationIsPlaying = true;
            this.player1.anims.play(anim, true);
        }
    }
}
