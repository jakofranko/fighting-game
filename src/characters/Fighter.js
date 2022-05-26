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
            `${this.textureName}_death`
        ]
        this.health = config.health || 100;
        this.moveSpeed = config.moveSpeed;
        this.jumpSpeed = config.jumpSpeed;
        this.enemyPlayer = undefined; // Will be set in Scene
        this.isFlipped = false;

        this.hMovementStateMachine = new StateMachine(this, 'hMovement');
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
        this.vMovementStateMachine = new StateMachine(this, 'vMovement');
        this.vMovementStateMachine
            .addState('jump', {
                onEnter: () => {
                    this.setVelocityY(-this.jumpSpeed);
                }
            })
            .addState('idle');
        // For animations and physics
        this.actionStateMachine = new StateMachine(this, 'action');
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
                onEnter: this.onLowKickEnter
            })
            .addState('damage', {
                onEnter: ({ damage }) => {
                    const blocking = this.combatStateMachine.currentState === 'blocking';
                    this.health -= blocking ? damage / 10 : damage;
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
                    let player1Health, player2Health;
                    if (this.name === 'player1') {
                        player1Health = this.health;
                        player2Health = this.enemyPlayer.health;
                    } else if (this.name === 'player2') {
                        player2Health = this.health;
                        player1Health = this.enemyPlayer.health;
                    } else {
                        /* eslint-disable no-console */
                        console.error('name not assigned correctly!!! Should be player1 or player2');
                    }

                    this.startAnimation(`${this.textureName}_death`);
                    EventsCenter.emit('game-over', player1Health, player2Health);
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

            this.combatStateMachine = new StateMachine(this, 'combat');
            this.combatStateMachine
                .addState('idle')
                .addState('blocking');

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
            this.handleCombat(controls);
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
            this.actionStateMachine.setState('lowKick', { freeze: true });
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

    handleCombat(controls) {
        const { left, right } = controls;

        if (this.flipX) {
            if (right.isDown) {
                this.combatStateMachine.setState('blocking');
            } else {
                this.combatStateMachine.setState('idle');
            }
        } else {
            if (left.isDown) {
                this.combatStateMachine.setState('blocking');
            } else {
                this.combatStateMachine.setState('idle');
            }
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
        if (this.lowKickHitBox) this.lowKickHitBox.destroy();

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

        function cleanupLowKick() {
            this.body.offset.x = 20;

            if (this.flipX) {
                this.setPosition(this.x + 15, this.y);
                if (this.lowKickHitBox) {
                    this.lowKickHitBox.destroy();
                }
            } else {
                this.setPosition(this.x - 15, this.y);
                if (this.lowKickHitBox) {
                    this.lowKickHitBox.destroy();
                }
            }

            this.off(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + `${this.textureName}_low_kick`, cleanupLowKick);
        }

        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, addLowKickHitbox);
        this.on(Phaser.Animations.Events.ANIMATION_COMPLETE_KEY + `${this.textureName}_low_kick`, cleanupLowKick)

        if (this.flipX) {
            this.body.offset.x = 30;
            this.setPosition(this.x - 15, this.y);
        } else {
            this.body.offset.x = 10;
            this.setPosition(this.x + 15, this.y);
        }

        this.startAnimation(`${this.textureName}_low_kick`);
    }

    handleLowKickHit(lowKickHitBox, enemyPlayer) {
        enemyPlayer.actionStateMachine.setState('damage', { damage: 10 });
        lowKickHitBox.destroy();
    }
}
