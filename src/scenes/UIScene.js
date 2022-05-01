import Phaser from 'phaser';
import { CANVAS_WIDTH } from '../constants';
import EventsCenter from '../services/events-center';

const width = CANVAS_WIDTH / 2.5;
const height = 40;
const pad = 20;

// TODO: change colors to red, orange, and gold, with the
// yellow color changing quickest when health changes, and the
// orange changing more slowly to show where the health was before
// the hit.
export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ui' });
    }

    create() {
        this.player1HealthBar = this.add.graphics();
        this.player2HealthBar = this.add.graphics();
        this.countDown = this.add.graphics();

        EventsCenter.on('player-health-update', this.handlePlayerHealthChange, this);

        // Clean up when scene is switched
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
    		eventsCenter.off('player-health-update', this.handlePlayerHealthChange, this);
    	});

        this.player1LastHealth = 100;
        this.player2LastHealth = 100;
        this.setPlayer1Health(100);
        this.setPlayer2Health(100);
    }

    setPlayer1Health(value) {
        const x = pad;
        const y = pad;

        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
        this.player1HealthBar.fillStyle(0x808080);
        this.player1HealthBar.fillRoundedRect(x, y, width, height, 5);
        if (percent > 0) {
            this.player1HealthBar.fillStyle(0x00ff80);
            this.player1HealthBar.fillRoundedRect(x, y, width * percent, height, 5);
        }
    }

    setPlayer2Health(value) {
        const x = CANVAS_WIDTH - width - pad;
        const y = pad;

        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
        this.player2HealthBar.fillStyle(0x808080);
        this.player2HealthBar.fillRoundedRect(x, y, width, height, 5);
        if (percent > 0) {
            this.player2HealthBar.fillStyle(0x00ff80);
            this.player2HealthBar.fillRoundedRect(x, y, width * percent, height, 5);
        }
    }

    handlePlayerHealthChange(player) {
        if (player.name === 'player1') {
            this.handlePlayer1HealthChange(player.health);
        } else if (player.name === 'player2') {
            this.handlePlayer2HealthChange(player.health);
        } else {
            console.error(`Please designate which player ${player.name} is by setting the name to either player1 or player2`);
        }
    }

    handlePlayer1HealthChange(value) {
        this.tweens.addCounter({
            from: this.player1LastHealth,
            to: value,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const value = tween.getValue();
                this.setPlayer1Health(value);
            }
        });

        this.player1LastHealth = value;
    }

    handlePlayer2HealthChange(value) {
        this.tweens.addCounter({
            from: this.player2LastHealth,
            to: value,
            duration: 300,
            ease: Phaser.Math.Easing.Sine.InOut,
            onUpdate: (tween) => {
                const value = tween.getValue();
                this.setPlayer2Health(value);
            }
        });

        this.player2LastHealth = value;
    }
}
