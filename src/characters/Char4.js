import Phaser from 'phaser';
import Fighter from './Fighter';
import { CHARACTER_4 } from '../constants';

class Char4 extends Fighter {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture, config);
    }
}

Phaser.GameObjects.GameObjectFactory.register(CHARACTER_4, function(x, y, texture, config) {
    const char4 = new Char4(this.scene, x, y, texture, config);

    this.displayList.add(char4);
    this.updateList.add(char4);

    this.scene.physics.world.enableBody(char4, Phaser.Physics.Arcade.DYNAMIC_BODY);

    char4.setBounce(0);
    char4.setCollideWorldBounds(true);
    char4.setScale(1.2);
    char4.setSize(23, 46, true);

    return char4;
})
