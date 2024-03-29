import { CHARACTER_3, CHARACTER_4 } from '../constants';

function createChar3Anims(anims) {
    anims.create({
        key: `${CHARACTER_3}_idle`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [0]
        }),
        frameRate: 10
    });

    anims.create({
        key: `${CHARACTER_3}_forward`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [18, 19, 20]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_3}_back`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [1, 2]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_3}_jump`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [4, 5, 6, 7]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_3}_low_kick`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [13, 14, 15, 16]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_3}_high_kick`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [45, 46, 47]
        }),
        frameRate: 10
    });

    anims.create({
        key: `${CHARACTER_3}_fast_punch`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [36, 37, 38]
        }),
        frameRate: 10
    });

    anims.create({
        key: `${CHARACTER_3}_hurt`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [57]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_3}_block`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [54, 55]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_3}_death`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [61]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_3}_defeat`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [63, 64]
        }),
        frameRate: 1,
    });

    anims.create({
        key: `${CHARACTER_3}_victory`,
        frames: anims.generateFrameNumbers(CHARACTER_3, {
            frames: [86]
        }),
        frameRate: 10,
    });
}

function createChar4Anims(anims) {
    anims.create({
        key: `${CHARACTER_4}_idle`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [0]
        }),
        frameRate: 10
    });

    anims.create({
        key: `${CHARACTER_4}_forward`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [18, 19, 20]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_back`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [1, 2]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_jump`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [4, 5, 6, 7]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_low_kick`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [13, 14, 15, 16]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_high_kick`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [45, 46, 47]
        }),
        frameRate: 10
    });

    anims.create({
        key: `${CHARACTER_4}_hurt`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [57]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_fast_punch`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [36, 37, 38]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_block`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [54, 55]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_death`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [61]
        }),
        frameRate: 10,
    });

    anims.create({
        key: `${CHARACTER_4}_defeat`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [63, 64]
        }),
        frameRate: 1,
    });

    anims.create({
        key: `${CHARACTER_4}_victory`,
        frames: anims.generateFrameNumbers(CHARACTER_4, {
            frames: [86]
        }),
        frameRate: 10,
    });
}

export default function createCharacterAnims(anims) {
    createChar3Anims(anims);
    createChar4Anims(anims);
}
