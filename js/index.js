const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.2;

class Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        attack1BoxOffset
    }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.attack1Width = 100;
        this.attack1Height = 50;
        this.lastKey = null;
        this.attack1Box = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width: this.attack1Width,
            height:this.attack1Height
        };
        this.attack1BoxOffset = attack1BoxOffset;
        this.color = color;
        this.isAttacking = false;
    }

    draw() {
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);

        // attack box
        if (this.isAttacking) {
            c.fillStyle = 'green';
            c.fillRect(
                this.attack1Box.position.x,
                this.attack1Box.position.y,
                this.attack1Box.width,
                this.attack1Box.height,
            );
        }
    }

    update() {
        this.draw();

        this.attack1Box.position.x = this.position.x + this.attack1BoxOffset.x;
        this.attack1Box.position.y = this.position.y + this.attack1BoxOffset.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    attack1BoxOffset: {
        x: 0,
        y: 0
    }
});

const enemy = new Sprite({
    position: {
        x: 500,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    attack1BoxOffset: {
        x: -50,
        y: 0
    }
});

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

function attackRectangleCollision(rect1, rect2) {
    if (
        rect1.attack1Box.position.x + rect1.attack1Box.width >= rect2.position.x &&
        rect1.attack1Box.position.x <= rect2.position.x + rect2.width &&
        rect1.attack1Box.position.y + rect1.attack1Box.height >= rect2.position.y &&
        rect1.attack1Box.position.y <= rect2.position.y + rect2.height
    ) {
        return true;
    }

    return false;
}

function animationLoop() {
    window.requestAnimationFrame(animationLoop);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.velocity.x = 0;

    if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 1;
    } else if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -1;
    }

    if (keys.w.pressed) {
        player.velocity.y = -10;
        keys.w.pressed = false;
    }

    enemy.velocity.x = 0;

    if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 1;
    } else if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -1;
    }

    if (keys.ArrowUp.pressed) {
        enemy.velocity.y = -10;
        keys.ArrowUp.pressed = false;
    }

    // Collision detection
    if (attackRectangleCollision(player, enemy) && player.isAttacking) {
        console.log('player attack');
    }

    if (attackRectangleCollision(enemy, player) && enemy.isAttacking) {
        console.log('enemy attack')
    }

    player.update();
    enemy.update();
}

animationLoop();
