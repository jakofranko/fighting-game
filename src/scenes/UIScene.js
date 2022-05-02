import Phaser from 'phaser';
import { CANVAS_WIDTH } from '../constants';
import { capitalizeFirstLetter } from '../utils';
import EventsCenter from '../services/events-center';

const width = CANVAS_WIDTH / 2.25;
const height = 40;
const pad = 20;
const fontSize = 32;
let countDownNum = 60;

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
        this.countDownText = this.add.text((CANVAS_WIDTH / 2) - fontSize + 2, pad * 2 + 2, countDownNum, {
            fontFamily: "PressStart2P",
            fontSize: `${fontSize}px`,
            padding: {
                y: 6
            }
        });
        this.player1LastHealth = 0;
        this.player2LastHealth = 0;

        this.initializeCountDown();

        EventsCenter.on('player-health-update', this.handlePlayerHealthChange, this);

        // Clean up when scene is switched
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
    		eventsCenter.off('player-health-update', this.handlePlayerHealthChange, this);
    	});

        // Let the rest of the game know that the UI is ready
        this.events.on('create', () =>{
            EventsCenter.emit('ui-ready');
        });
    }

    setPlayer1Health(value) {
        const x = pad;
        const y = pad * 2;
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;

        this.player1HealthBar.clear();
        this.player1HealthBar.fillStyle(0x808080);
        this.player1HealthBar.fillRoundedRect(x, y, width, height, 5);
        if (percent > 0) {
            this.player1HealthBar.fillStyle(0x00ff80);
            this.player1HealthBar.fillRoundedRect(x, y, width * percent, height, 5);
        }
    }

    setPlayer2Health(value) {
        const x = CANVAS_WIDTH - width - pad;
        const y = pad * 2;
        const percent = Phaser.Math.Clamp(value, 0, 100) / 100;

        this.player2HealthBar.clear();
        this.player2HealthBar.fillStyle(0x808080);
        this.player2HealthBar.fillRoundedRect(x, y, width, height, 5);
        if (percent > 0) {
            this.player2HealthBar.fillStyle(0x00ff80);
            this.player2HealthBar.fillRoundedRect(x, y, width * percent, height, 5);
        }
    }

    handlePlayerHealthChange(player) {
        if (player.name === 'player1' || player.name === 'player2') {
            const capPlayer = capitalizeFirstLetter(player.name);
            const from = this[`${player.name}LastHealth`];

            this.tweens.addCounter({
                from,
                to: player.health,
                duration: 100,
                ease: Phaser.Math.Easing.Cubic.easeOut,
                onUpdate: (tween) => {
                    const value = tween.getValue();
                    this[`set${capPlayer}Health`](value);
                }
            });

            this[`${player.name}LastHealth`] = player.health;
        } else {
            console.error(`Please designate which player ${player.name} is by setting the name to either player1 or player2`);
        }
    }

    initializeCountDown() {
        const width = 84;
        const height = width;
        const x = (CANVAS_WIDTH / 2) - (width / 2);
        const y = pad;

        this.countDown.fillStyle(0x212121);
        this.countDown.fillRect(x, y, width, height);

        const intervalId = setInterval(() => {
            this.countDownText.text = --countDownNum;

            if (countDownNum === 9) {
                this.countDownText.x = (CANVAS_WIDTH / 2) - (fontSize / 2) + 3
            }

            if (countDownNum === 0) {
                EventsCenter.emit('game-over', 'foo', 'bar');
                clearInterval(intervalId);
            }
        }, 1000);
    }
}
