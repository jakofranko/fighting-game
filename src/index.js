import { Sprite, Fighter } from './classes';
import { determineWinner, attackRectangleCollision } from './utils';
import { CANVAS_WIDTH, CANVAS_HEIGHT, FLOOR_HEIGHT } from './constants';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

const floorHeight = FLOOR_HEIGHT;

const background = new Sprite({
    ctx: c,
    position: {
        x: 0,
        y: -375
    },
    scale: {
        x: 1.2,
        y: 1.2
    },
    imageSrc: './assets/backgrounds/Forest/Preview/Background.png'
});

const player = new Fighter({
    ctx: c,
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    scale: {
        x: 1.5,
        y: 1.5
    },
    offset: {
        x: -5,
        y: -5
    },
    imageSrc: './assets/characters/Char_3_trimmed.png',
    sprites: {
        idle: {
            row: 0,
            framesStart: 0,
            framesEnd: 1
        },
        dashForward: {
            row: 1,
            framesStart: 0,
            framesEnd: 3
        },
        floatBack: {
            row: 0,
            framesStart: 1,
            framesEnd: 2
        },
        jump: {
            row: 0,
            framesStart: 7,
            framesEnd: 2
        },
        punch1: {
            row: 2,
            framesStart: 0,
            framesEnd: 4
        },
        takeHit: {
            row: 3,
            framesStart: 3,
            framesEnd: 3
        }
    },
    noInterruptSprites: ['punch1', 'takeHit'],
    rowCurrent: 0,
    framesMax: 18,
    framesHold: 10,
    framesRows: 7,
    attackBox: {
        offset: {
            x: 50,
            y: 30
        },
        width: 30,
        height: 20,
        totalFrames: 4,
        hitFrames: [0, 2]
    }
});

const playerHealthBar = document.querySelector('#player-hp');
playerHealthBar.max = player.health;
playerHealthBar.value = player.health;

const enemy = new Fighter({
    ctx: c,
    position: {
        x: 600,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    scale: {
        x: 1.5,
        y: 1.5
    },
    offset: {
        x: -5,
        y: -5
    },
    imageSrc: './assets/characters/Char_4_trimmed.png',
    sprites: {
        idle: {
            row: 0,
            framesStart: 0,
            framesEnd: 1
        },
        dashForward: {
            row: 1,
            framesStart: 0,
            framesEnd: 3
        },
        floatBack: {
            row: 0,
            framesStart: 1,
            framesEnd: 2
        },
        jump: {
            row: 0,
            framesStart: 7,
            framesEnd: 2
        },
        punch1: {
            row: 2,
            framesStart: 0,
            framesEnd: 4
        },
        takeHit: {
            row: 3,
            framesStart: 3,
            framesEnd: 2
        }
    },
    noInterruptSprites: ['punch1', 'takeHit'],
    rowCurrent: 0,
    framesMax: 18,
    framesHold: 50,
    framesRows: 7,
    attackBox: {
        offset: {
            x: 0,
            y: 0
        },
        width: 50,
        height: 30,
        totalFrames: 4,
        hitFrames: [0, 2]
    }
});

const enemyHealthBar = document.querySelector('#enemy-hp');
enemyHealthBar.max = enemy.health;
enemyHealthBar.value = enemy.health;

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    w: {
        pressed: false
    },
    s: {
        pressed: false
    },
    ' ': {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },
};

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case "d":
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case "a":
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case "w":
            keys.w.pressed = true;
            break;
        case "s":
            keys.s.pressed = true;
            break;
        case " ":
            keys[' '].pressed = true;
            player.attack();
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = true;
            break;
        case "m":
            enemy.attack();
            break;
    }
});

window.addEventListener('keyup', (e) => {
    switch (e.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;
        case "s":
            keys.s.pressed = false;
            break;
        case " ":
            keys[' '].pressed = false;
            break;
        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break;
    }
});

let timer = 10;
let timerId;
function decreaseTimer() {
    if (timer > 0) {
        timer--;
        document.querySelector('#timer').innerHTML = timer;
        timerId = setTimeout(decreaseTimer, 1000);
    } else {
        determineWinner(player, enemy, timerId);
    }
}

function animationLoop() {
    window.requestAnimationFrame(animationLoop);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.velocity.x = 0;

    if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 1;
        player.switchSprite('dashForward');
    } else if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -1;
        player.switchSprite('floatBack');
    } else {
        player.switchSprite('idle');
    }

    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('floatBack');
    }

    if (keys.w.pressed) {
        player.velocity.y = -10;
        keys.w.pressed = false;
    }

    enemy.velocity.x = 0;

    if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 1;
        enemy.switchSprite('floatBack');
    } else if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -1;
        enemy.switchSprite('dashForward');
    } else {
        enemy.switchSprite('idle');
    }

    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('floatBack');
    }

    if (keys.ArrowUp.pressed) {
        enemy.velocity.y = -10;
        keys.ArrowUp.pressed = false;
    }

    // Collision detection
    if (player.isAttacking &&
        player.attackBox.hitFrames.includes(player.framesCurrent) &&
        attackRectangleCollision(player, enemy)
    ) {
        console.log('player attack');
        enemy.takeHit(player.attack1Damage);
        enemyHealthBar.value = enemy.health;
    }

    if (enemy.isAttacking &&
        enemy.attackBox.hitFrames.includes(enemy.framesCurrent) &&
        attackRectangleCollision(enemy, player)
    ) {
        console.log('enemy attack')
        player.takeHit(enemy.attack1Damage);
        playerHealthBar.value = player.health;
    }

    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner(player, enemy, timerId);
    }

    background.update();
    player.update();
    enemy.update();
}

// decreaseTimer();
animationLoop();
