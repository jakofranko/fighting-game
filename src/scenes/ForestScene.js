import Phaser from 'phaser';
import EventsCenter from '../services/events-center';
import Char3 from '../characters/Char3'; // eslint-disable-line no-unused-vars
import Char4 from '../characters/Char4'; // eslint-disable-line no-unused-vars
import createCharacterAnims from '../anims/characterAnims';
import {
    CANVAS_HEIGHT,
    BACKGROUND_X_OFFSET,
    BACKGROUND_Y_OFFSET,
    BACKGROUND_SCALE,
    CHARACTER_3,
    CHARACTER_3_MOVE_SPEED,
    CHARACTER_3_JUMP_SPEED,
    CHARACTER_4,
    CHARACTER_4_MOVE_SPEED,
    CHARACTER_4_JUMP_SPEED,
} from '../constants';

export default class ForestScene extends Phaser.Scene {
    constructor() {
        super('forest-scene');
        this.player1 = undefined;
        this.player2 = undefined;
        this.player1Controls = undefined;
        this.player2Controls = undefined;
        this.animationIsPlaying = false;
    }

    create() {
        // Run the UI
        this.scene.run('ui');

        this.createBackground();
        this.ground = this.createGround();
        this.player1 = this.add[CHARACTER_3](400, 150, CHARACTER_3, {
            name: 'player1',
            moveSpeed: CHARACTER_3_MOVE_SPEED,
            jumpSpeed: CHARACTER_3_JUMP_SPEED
        });
        this.player2 = this.add[CHARACTER_4](600, 150, CHARACTER_4, {
            name: 'player2',
            moveSpeed: CHARACTER_4_MOVE_SPEED,
            jumpSpeed: CHARACTER_4_JUMP_SPEED
        });
        this.createForeground();

        // Register animations
        createCharacterAnims(this.anims);

        // Create colliders
        this.physics.add.collider(this.player1, this.ground);
        this.physics.add.collider(this.player2, this.ground);

        // Add cursors
        this.player1Controls = this.input.keyboard.createCursorKeys();
        this.player2Controls = {
            up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            space: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F),
        }

        // Make each player object aware of the other
        this.player1.enemyPlayer = this.player2;
        this.player2.enemyPlayer = this.player1;

        // Once the UI is ready, let the UI know about the players
        EventsCenter.once('ui-ready', () => {
            EventsCenter.emit('player-health-update', this.player1);
            EventsCenter.emit('player-health-update', this.player2);
        });

        EventsCenter.once('game-over', () => {
            this.scene.run('game-over');
        });
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

    update() {
        this.player1.update(this.player1Controls);
        this.player2.update(this.player2Controls);

        if (this.player1.x > this.player2.x) {
            this.player1.flipX = true;
            this.player2.flipX = false;
        } else {
            this.player1.flipX = false;
            this.player2.flipX = true;
        }
    }
}
