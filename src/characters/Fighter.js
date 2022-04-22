import Phaser from 'phaser';

export default class Fighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture);

        this.name = texture;
        this.animationIsPlaying = false;
        this.lastAnimation = null;
        this.overrideAnimations = [`${this.name}_low_kick`];
        this.moveSpeed = config.moveSpeed;
        this.jumpSpeed = config.jumpSpeed;
    }

    update(controls) {
        const {
            left,
            right,
            up,
            down,
            space
        } = controls;

        if (left.timeDown > right.timeDown && left.isDown) {
            this.setVelocityX(-this.moveSpeed)
            this.flipX
                ? this.startAnimation(`${this.name}_forward`)
                : this.startAnimation(`${this.name}_back`);
        } else if (right.timeDown > left.timeDown && right.isDown) {
            this.setVelocityX(this.moveSpeed)
            this.flipX
                ? this.startAnimation(`${this.name}_back`)
                : this.startAnimation(`${this.name}_forward`);
        } else {
            this.setVelocityX(0)
        }

        if (space.isDown) {
            this.startAnimation(`${this.name}_low_kick`);
        }

        if (
            left.isUp &&
            right.isUp &&
            up.isUp &&
            space.isUp
        ) {
            this.animationIsPlaying = false;
            this.anims.play(`${this.name}_idle`);
        }

        if (up.isDown && this.body.touching.down) {
            this.setVelocityY(-this.jumpSpeed);
            this.anims.play(`${this.name}_jump`)
        }
    }

    unsetAnimation() {
        this.animationIsPlaying = false;
        this.lastAnimation = null;
    }

    startAnimation(anim) {
        const isOverrideAnimation = this.overrideAnimations.includes(this.lastAnimation);

        if (!isOverrideAnimation &&
            this.lastAnimation !== anim ||
            this.animationIsPlaying === false
        ) {
            console.log(anim)
            this.animationIsPlaying = true;
            this.anims.play(anim, true);
            this.lastAnimation = anim;

            if (this.overrideAnimations.includes(anim)) {
                this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.unsetAnimation();
                    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
                })
            }
        }
    }
}
