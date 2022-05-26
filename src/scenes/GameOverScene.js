import Phaser from 'phaser';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import EventsCenter from '../services/events-center';

const fontSize = 32;
const padding = 6;

// TODO: change colors to red, orange, and gold, with the
// yellow color changing quickest when health changes, and the
// orange changing more slowly to show where the health was before
// the hit.
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'game-over' });

        EventsCenter.on('game-over', this.handleGameOver, this);
    }

    create() {
        // Clean up when scene is switched
        this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
            EventsCenter.off('game-over', this.handleGameOver, this);
       });
    }

    handleGameOver(player1Health, player2Health) {
        const gameOverText = 'Game Over';
        const gameOverWidth = gameOverText.length * fontSize;
        this.gameOverText = this.add.text(
            (CANVAS_WIDTH / 2) - (gameOverWidth / 2),
            CANVAS_HEIGHT / 2,
            gameOverText,
            {
                fontFamily: "PressStart2P",
                fontSize: `${fontSize}px`,
                padding: {
                    y: padding
                }
            }
        );

        let victorText = 'Placeholder';
        if (player1Health > player2Health) {
            victorText = 'Player 1 Wins!!!';
        } else if (player1Health < player2Health) {
            victorText = 'Player 2 Wins!!!';
        } else if (player1Health === player2Health) {
            victorText = 'IT\'S A TIE!!!';
        }

        const victorWidth = victorText.length * fontSize;
        this.victorText = this.add.text(
            (CANVAS_WIDTH / 2) - (victorWidth / 2),
            CANVAS_HEIGHT / 2 + fontSize + padding,
            victorText,
            {
                fontFamily: "PressStart2P",
                fontSize: `${fontSize}px`,
                padding: {
                    y: padding
                }
            }
        );
    }
}
