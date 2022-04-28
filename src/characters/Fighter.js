import Phaser from 'phaser';
import StateMachine from '../services/state-machine';

export default class Fighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.name = texture;
        this.animationIsPlaying = false;
        this.lastAnimation = null;
        this.overrideAnimations = [`${this.name}_low_kick`];
        this.moveSpeed = config.moveSpeed;
        this.jumpSpeed = config.jumpSpeed;
        this.enemyPlayer = config.enemyPlayer;
        this.isFlipped = false;

        this.stateMachine = new StateMachine(this);
        this.stateMachine
            .addState('idle', {
                onEnter: () => {
                    this.setVelocityX(0);
                    this.animationIsPlaying = false;
                    this.anims.play(`${this.name}_idle`);
                }
            })
            .addState('moveLeft', {
                onEnter: () => {
                    this.setVelocityX(-this.moveSpeed)
                    this.flipX
                        ? this.startAnimation(`${this.name}_forward`)
                        : this.startAnimation(`${this.name}_back`);
                },
                onUpdate: () => {
                    if (this.flipX !== this.isFlipped) {
                        this.isFlipped = this.flipX;
                        this.flipX
                            ? this.startAnimation(`${this.name}_forward`)
                            : this.startAnimation(`${this.name}_back`);
                    }
                },
                onExit: () => {
                    this.setVelocityX(0);
                }
            })
            .addState('moveRight', {
                onEnter: () => {
                    this.setVelocityX(this.moveSpeed)
                    this.flipX
                        ? this.startAnimation(`${this.name}_back`)
                        : this.startAnimation(`${this.name}_forward`);
                },
                onUpdate: () => {
                    if (this.flipX !== this.isFlipped) {
                        this.isFlipped = this.flipX;
                        this.flipX
                            ? this.startAnimation(`${this.name}_back`)
                            : this.startAnimation(`${this.name}_forward`);
                    }
                },
                onExit: () => {
                    this.setVelocityX(0);
                }
            })
            .addState('jump', {
                onEnter: () => {
                    this.setVelocityY(-this.jumpSpeed);
                    this.anims.play(`${this.name}_jump`);
                }
            })
            .addState('lowKick', {
                onEnter: this.onLowKickEnter,
                onExit: this.onLowKickExit
            })
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
            this.stateMachine.setState('moveLeft');
        } else if (right.timeDown > left.timeDown && right.isDown) {
            this.stateMachine.setState('moveRight');
        }

        if (space.isDown) {
            this.stateMachine.setState('lowKick');
        }

        if (
            left.isUp &&
            right.isUp &&
            up.isUp &&
            space.isUp
        ) {
            this.stateMachine.setState('idle');
        }

        if (up.isDown && this.body.touching.down) {
            this.stateMachine.setState('jump');
        }

        this.stateMachine.update();
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

    onLowKickEnter() {
        this.lowKickHitBox = this.scene.add.rectangle(0, 0, 20, 20, 0xffffff, 0.4);
        this.scene.physics.add.existing(this.lowKickHitBox);
        this.lowKickHitBox.body.allowGravity = false;
        this.scene.physics.add.collider(this.lowKickHitBox, this.enemyPlayer);

        if (this.flipX) {
            this.body.offset.x = 30;
            this.setPosition(this.x - 15, this.y);
            this.startAnimation(`${this.name}_low_kick`);
            this.lowKickHitBox.x = this.x - 20;
            this.lowKickHitBox.y = this.y + 25;
        } else {
            this.body.offset.x = 10;
            this.setPosition(this.x + 15, this.y);
            this.startAnimation(`${this.name}_low_kick`);
            this.lowKickHitBox.x = this.x + 20 ;
            this.lowKickHitBox.y = this.y + 25;
        }
    }

    onLowKickExit() {
        if (this.flipX) {
            this.body.offset.x = 20;
            this.setPosition(this.x + 15, this.y);
            if (this.lowKickHitBox) {
                this.lowKickHitBox.destroy();
            }
        } else {
            this.body.offset.x = 20;
            this.setPosition(this.x - 15, this.y);
            if (this.lowKickHitBox) {
                this.lowKickHitBox.destroy();
            }
        }
    }
}
