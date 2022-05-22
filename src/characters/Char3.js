import Phaser from 'phaser';
import Fighter from './Fighter';
import { CHARACTER_3 } from '../constants';

class Char3 extends Fighter {
    constructor(scene, x, y, texture, config) {
        super(scene, x, y, texture, config);
    }
}

Phaser.GameObjects.GameObjectFactory.register(CHARACTER_3, function(x, y, texture, config) {
    const char3 = new Char3(this.scene, x, y, texture, config);

    this.displayList.add(char3);
    this.updateList.add(char3);

    this.scene.physics.world.enableBody(char3, Phaser.Physics.Arcade.DYNAMIC_BODY);

    char3.setBounce(0);
    char3.setCollideWorldBounds(true);
    char3.setScale(1.2);
    char3.setSize(23, 46, true)

    return char3;
})
