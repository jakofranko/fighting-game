import Phaser from 'phaser';
import { CANVAS_WIDTH } from '../constants';
import { capitalizeFirstLetter } from '../utils';
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

        this.player1LastHealth = 0;
        this.player2LastHealth = 0;

        // Let the rest of the game know that the UI is ready
        this.events.on('create', () =>{
            EventsCenter.emit('ui-ready');
        });
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
        this.player2HealthBar.fillStyle(0x808080);
        this.player2HealthBar.fillRoundedRect(x, y, width, height, 5);
        this.player2HealthBar.fillStyle(0x00ff80);
        this.player2HealthBar.fillRoundedRect(x, y, width * percent, height, 5);
    }

    handlePlayerHealthChange(player) {
        if (player.name === 'player1' || player.name === 'player2') {
            const capPlayer = capitalizeFirstLetter(player.name);
            const from = this[`${player.name}LastHealth`];

            this.tweens.addCounter({
                from,
                to: player.health,
                duration: 300,
                ease: Phaser.Math.Easing.Sine.InOut,
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
}
