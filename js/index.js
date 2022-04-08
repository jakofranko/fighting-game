const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const floorHeight = 72;

const background = new Sprite({
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
        x: 0,
        y: 15
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
        }
    },
    rowCurrent: 0,
    framesMax: 18,
    framesHold: 20,
    framesRows: 7,
    attack1BoxOffset: {
        x: 0,
        y: 0
    }
});

const playerHealthBar = document.querySelector('#player-hp');
playerHealthBar.max = player.health;
playerHealthBar.value = player.health;

const enemy = new Fighter({
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
        x: 0,
        y: 15
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
        }
    },
    rowCurrent: 0,
    framesMax: 18,
    framesHold: 30,
    framesRows: 7,
    attack1BoxOffset: {
        x: -50,
        y: 0
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
    if (attackRectangleCollision(player, enemy) && player.isAttacking) {
        console.log('player attack');
        enemy.health -= player.attack1Damage;
        enemyHealthBar.value = enemy.health;
    }

    if (attackRectangleCollision(enemy, player) && enemy.isAttacking) {
        console.log('enemy attack')
        player.health -= enemy.attack1Damage;
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
