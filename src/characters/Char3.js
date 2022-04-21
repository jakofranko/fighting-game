import Phaser from 'phaser';
import {
    CHARACTER_3
} from '../constants';

class Char3 extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, CHARACTER_3);

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
            this.startAnimation(`${CHARACTER_3}_back`);
        } else if (right.timeDown > left.timeDown && right.isDown) {
            this.setVelocityX(160)
            this.startAnimation(`${CHARACTER_3}_forward`);
        } else {
            this.setVelocityX(0)
        }

        if (
            left.isUp &&
            right.isUp &&
            up.isUp
        ) {
            this.animationIsPlaying = false;
            this.anims.play(`${CHARACTER_3}_idle`);
        }

        if (up.isDown && this.body.touching.down) {
            this.setVelocityY(-330);
            this.anims.play(`${CHARACTER_3}_jump`)
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

Phaser.GameObjects.GameObjectFactory.register(CHARACTER_3, function(x, y) {
    const char3 = new Char3(this.scene, x, y);

    this.displayList.add(char3);
    this.updateList.add(char3);

    this.scene.physics.world.enableBody(char3, Phaser.Physics.Arcade.DYNAMIC_BODY);

    char3.setBounce(0.1);
    char3.setCollideWorldBounds(true);
    char3.setScale(1.5);
    char3.setSize(23, 46, true)

    return char3;
})
