import Phaser from 'phaser';
import StateMachine from '../services/state-machine';
import EventsCenter from '../services/events-center';

export default class Fighter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture);

        this.scene = scene;
        this.name = config.name;
        this.textureName = texture;
        this.animationIsPlaying = false;
        this.lastAnimation = null;
        this.overrideAnimations = [
            `${this.textureName}_low_kick`,
            `${this.textureName}_damage`,
            `${this.textureName}_hurt`
        ];
        this.finalAnimations = [
            `${this.textureName}_victory`,
            `${this.textureName}_defeat`,
            `${this.textureName}_dead`
        ]
        this.health = config.health || 100;
        this.moveSpeed = config.moveSpeed;
        this.jumpSpeed = config.jumpSpeed;
        this.enemyPlayer = undefined; // Will be set in Scene
        this.isFlipped = false;

        this.hMovementStateMachine = new StateMachine(this);
        this.hMovementStateMachine
            .addState('idle', {
                onEnter: () => {
                    this.setVelocityX(0);
                }
            })
            .addState('moveLeft', {
                onEnter: () => {
                    this.setVelocityX(-this.moveSpeed)
                }
            })
            .addState('moveRight', {
                onEnter: () => {
                    this.setVelocityX(this.moveSpeed)
                }
            });
        this.vMovementStateMachine = new StateMachine(this);
        this.vMovementStateMachine
            .addState('jump', {
                onEnter: () => {
                    this.setVelocityY(-this.jumpSpeed);
                }
            })
            .addState('idle');
        // For animations and physics
        this.actionStateMachine = new StateMachine(this);
        this.actionStateMachine
            .addState('null') // for resetting state
            .addState('idle', {
                onEnter: () => {
                    this.animationIsPlaying = false;
                    this.startAnimation(`${this.textureName}_idle`);
                }
            })
            .addState('moveLeft', {
                onEnter: () => {
                    this.flipX
                        ? this.startAnimation(`${this.textureName}_forward`)
                        : this.startAnimation(`${this.textureName}_back`);
                },
                onUpdate: () => {
                    if (this.flipX !== this.isFlipped) {
                        this.isFlipped = this.flipX;
                        this.flipX
                            ? this.startAnimation(`${this.textureName}_forward`)
                            : this.startAnimation(`${this.textureName}_back`);
                    }
                }
            })
            .addState('moveRight', {
                onEnter: () => {
                    this.flipX
                        ? this.startAnimation(`${this.textureName}_back`)
                        : this.startAnimation(`${this.textureName}_forward`);
                },
                onUpdate: () => {
                    if (this.flipX !== this.isFlipped) {
                        this.isFlipped = this.flipX;
                        this.flipX
                            ? this.startAnimation(`${this.textureName}_back`)
                            : this.startAnimation(`${this.textureName}_forward`);
                    }
                }
            })
            .addState('jump', {
                onEnter: () => {
                    this.startAnimation(`${this.textureName}_jump`);
                }
            })
            .addState('lowKick', {
                onEnter: this.onLowKickEnter,
                onExit: this.onLowKickExit
            })
            .addState('damage', {
                onEnter: ({ damage }) => {
                    this.health -= damage;
                    EventsCenter.emit('player-health-update', this);
                    if (this.health <= 0) {
                        this.actionStateMachine.setState('dead', { freeze: true, unfreeze: true });
                    } else {
                        this.startAnimation(`${this.textureName}_hurt`)
                    }
                    // TODO: add logic and animation for blocking
                }
            })
            .addState('dead', {
                onEnter: () => {
                    this.startAnimation(`${this.textureName}_death`);
                    EventsCenter.emit('game-over', this.health, this.enemyPlayer.health);
                    this.setVelocityX(0);
                    this.setVelocityY(0);
                }
            })
            .addState('lost', {
                onEnter: () => {
                    this.startAnimation(`${this.textureName}_defeat`);
                    this.setVelocityX(0);
                    this.setVelocityY(0);
                }
            })
            .addState('victorious', {
                onEnter: () => {
                    this.startAnimation(`${this.textureName}_victory`);
                    this.setVelocityX(0);
                    this.setVelocityY(0);
                }
            });

            EventsCenter.once('game-over', () => {
                if (this.health <= 0) {
                    return;
                } else if (this.health > this.enemyPlayer.health) {
                    this.actionStateMachine.setState('victorious', { freeze: true, unfreeze: true });
                } else if (this.health < this.enemyPlayer.health) {
                    this.actionStateMachine.setState('lost', { freeze: true, unfreeze: true });
                }
            })
    }

    update(controls) {
        const { currentState: cs } = this.actionStateMachine;
        if (!['victorious', 'lost', 'dead'].includes(cs)) {
            this.handleHMovement(controls);
            this.handleVMovement(controls);
            this.handleActions(controls);
        }

        this.hMovementStateMachine.update();
        this.vMovementStateMachine.update();
        this.actionStateMachine.update();
    }

    handleHMovement(controls) {
        const {
            left,
            right,
        } = controls;

        if (right.isUp && left.isDown) {
            this.hMovementStateMachine.setState('moveLeft');
        } else if (left.isUp && right.isDown) {
            this.hMovementStateMachine.setState('moveRight');
        } else if (left.isDown && right.isDown) {
            this.hMovementStateMachine.setState('idle');
        } else if (left.isUp && right.isUp) {
            this.hMovementStateMachine.setState('idle');
        }
    }

    handleVMovement(controls) {
        const { up } = controls;

        if (up.isDown && this.body.touching.down) {
            this.vMovementStateMachine.setState('jump');
        }

        if (up.isUp) {
            this.vMovementStateMachine.setState('idle');
        }
    }

    handleActions(controls) {
        const { up, left, right, space } = controls;

        // Handle attacks first
        if (space.isDown) {
            this.actionStateMachine.setState('lowKick');
        } else if (up.isDown) {
            this.actionStateMachine.setState('jump');
        } else if (right.isUp && left.isDown) {
            this.actionStateMachine.setState('moveLeft');
        } else if (left.isUp && right.isDown) {
            this.actionStateMachine.setState('moveRight');
        } else if (left.isDown && right.isDown) {
            this.actionStateMachine.setState('idle');
        } else if (left.isUp && right.isUp && up.isUp) {
            this.actionStateMachine.setState('idle');
        }
    }

    unsetAnimation(nullState = true) {
        this.animationIsPlaying = false;
        this.lastAnimation = null;

        if (nullState) {
            this.actionStateMachine.setState('null', { unfreeze: true });
        }
    }

    startAnimation(anim) {
        const isOverrideAnimation = this.overrideAnimations.includes(this.lastAnimation);
        const isFinalAnimation = this.finalAnimations.includes(anim);

        if (isFinalAnimation) {
            this.unsetAnimation(false);
            this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
            this.anims.play(anim, true);
            return;
        }

        if (!isOverrideAnimation &&
            (this.lastAnimation !== anim ||
            this.animationIsPlaying === false)
        ) {
            this.animationIsPlaying = true;
            this.anims.play(anim, true);
            this.lastAnimation = anim;

            if (this.overrideAnimations.includes(anim)) {
                this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    this.unsetAnimation();
                    this.off(Phaser.Animations.Events.ANIMATION_COMPLETE);
                });
            }
        }
    }

    onLowKickEnter() {
        this.lowKickHitBox = this.scene.add.rectangle(0, 0, 20, 20, 0xffffff, 0);
        this.scene.physics.add.existing(this.lowKickHitBox);
        this.lowKickHitBox.body.allowGravity = false;
        this.scene.physics.add.overlap(
            this.lowKickHitBox,
            this.enemyPlayer,
            this.handleLowKickHit,
            undefined,
            this
        );

        function addLowKickHitbox(_, frame) {
            if (frame.index === 3) {
                if (this.flipX) {
                    this.lowKickHitBox.x = this.x - 20;
                    this.lowKickHitBox.y = this.y + 25;
                } else {
                    this.lowKickHitBox.x = this.x + 20 ;
                    this.lowKickHitBox.y = this.y + 25;
                }
            } else if (frame.index === 4) {
                if (this.lowKickHitBox) this.lowKickHitBox.destroy();

                this.off(Phaser.Animations.Events.ANIMATION_UPDATE, addLowKickHitbox);
            }
        }

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, addLowKickHitbox);

        if (this.flipX) {
            this.body.offset.x = 30;
            this.setPosition(this.x - 15, this.y);
        } else {
            this.body.offset.x = 10;
            this.setPosition(this.x + 15, this.y);
        }

        this.startAnimation(`${this.textureName}_low_kick`);
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

    handleLowKickHit(lowKickHitBox, enemyPlayer) {
        enemyPlayer.actionStateMachine.setState('damage', { damage: 10, freeze: true });
        lowKickHitBox.destroy();
    }
}
