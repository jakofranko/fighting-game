import Phaser from 'phaser';
import { CANVAS_WIDTH } from '../constants';

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

        this.handlePlayer1HealthChange(10);
        this.setPlayer2Health(20);
    }

    setPlayer1Health(value) {
        const x = pad;
        const y = pad;

        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
        this.player1HealthBar.fillStyle(0x808080);
        this.player1HealthBar.fillRoundedRect(x, y, width, height, 5);
        this.player1HealthBar.fillStyle(0x00ff80);
        this.player1HealthBar.fillRoundedRect(x, y, width * percent, height, 5);
    }

    setPlayer2Health(value) {
        const x = CANVAS_WIDTH - width - pad;
        const y = pad;

        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;
        this.player1HealthBar.fillStyle(0x808080);
        this.player1HealthBar.fillRoundedRect(x, y, width, height, 5);
        this.player1HealthBar.fillStyle(0x00ff80);
        this.player1HealthBar.fillRoundedRect(x, y, width * percent, height, 5);
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
}
