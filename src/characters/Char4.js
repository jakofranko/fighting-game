import Phaser from 'phaser';
import {
    CHARACTER_4
} from '../constants';

class Char4 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, CHARACTER_4);

        this.animationIsPlaying = false;
        this.lastAnimation = null;
    }

    update(cursors) {
        const {
            left,
            right,
            up,
            down,
            space,
            shift
        } = cursors;

        if (left.timeDown > right.timeDown && left.isDown) {
            this.setVelocityX(-160)
            this.startAnimation(`${CHARACTER_4}_back`);
        } else if (right.timeDown > left.timeDown && right.isDown) {
            this.setVelocityX(160)
            this.startAnimation(`${CHARACTER_4}_forward`);
        } else {
            this.setVelocityX(0)
        }

        if (
            left.isUp &&
            right.isUp &&
            up.isUp
        ) {
            this.animationIsPlaying = false;
            this.anims.play(`${CHARACTER_4}_idle`);
        }

        if (up.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
            this.anims.play(`${CHARACTER_4}_jump`)
        }
    }

    startAnimation(anim) {
        if (this.animationIsPlaying === false || this.lastAnimation !== anim) {
            this.animationIsPlaying = true;
            this.anims.play(anim, true);
            this.lastAnimation = anim;
        }
    }
}

Phaser.GameObjects.GameObjectFactory.register(CHARACTER_4, function(x, y) {
    const char4 = new Char4(this.scene, x, y);

    this.displayList.add(char4);
    this.updateList.add(char4);

    this.scene.physics.world.enableBody(char4, Phaser.Physics.Arcade.DYNAMIC_BODY);

    char4.setBounce(0.1);
    char4.setCollideWorldBounds(true);
    char4.setScale(1.5);
    char4.setSize(23, 46, true);

    return char4;
})
