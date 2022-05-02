import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { capitalizeFirstLetter } from '../utils';
import EventsCenter from '../services/events-center';

const fontSize = 32;

// TODO: change colors to red, orange, and gold, with the
// yellow color changing quickest when health changes, and the
// orange changing more slowly to show where the health was before
// the hit.
export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'game-over' });
    }

    create() {
        const text = 'Game Over';
        const width = text.length * fontSize;
        this.gameOverText = this.add.text((CANVAS_WIDTH / 2) - (width / 2), CANVAS_HEIGHT / 2, 'Game Over', {
            fontFamily: "PressStart2P",
            fontSize: `${fontSize}px`,
            padding: {
                y: 6
            }
        });

        EventsCenter.on('game-over', this.handleGameOver, this);

        // Clean up when scene is switched
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
    		eventsCenter.off('game-over', this.handleGameOver, this);
    	});
    }

    handleGameOver(player1, player2) {
        console.log(player1, player2);
    }
}
