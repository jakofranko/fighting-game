const gravity = 0.2;

class Sprite {
    constructor({
        position,
        height,
        width,
        offset = { x: 0, y: 0 },
        scale = { x: 1, y: 1 },
        imageSrc,
        sprites,
        framesMax = 1,
        framesHold = 10,
        framesRows = 1,
        rowCurrent = 0
    }) {
        this.position = position;
        this.image = new Image();
        this.image.src = imageSrc;
        this.image.onload = () => {
            this.height = height || this.image.naturalHeight;
            this.width = width || this.image.naturalWidth;
        };
        this.offset = offset;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesStart = 0;
        this.framesEnd = 1;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.framesRows = framesRows;
        this.rowCurrent = rowCurrent;
        this.sprites = sprites;
        this.spriteCurrent = 'idle';
    }

    switchSprite(sprite) {
        if (sprite === this.spriteCurrent) return;

        const { row, framesStart, framesEnd } = this.sprites[sprite];

        this.rowCurrent = row;
        this.framesStart = framesStart;
        this.framesEnd = framesEnd;
        this.framesCurrent = 0;
        this.spriteCurrent = sprite;
    }

    draw() {
        c.drawImage(
            this.image,
            (this.framesCurrent + this.framesStart) * (this.width / this.framesMax),
            this.rowCurrent * (this.height / this.framesRows),
            this.width / this.framesMax,
            this.height / this.framesRows,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.width / this.framesMax) * this.scale.x,
            (this.height / this.framesRows) * this.scale.y
        );
    }

    animateFrames() {
        this.framesElapsed = (this.framesElapsed + 1) % this.framesHold;

        if (this.framesElapsed === 0) {
            this.framesCurrent = (this.framesCurrent + 1) % this.framesEnd;
        }
    }

    update() {
        this.draw();
        this.animateFrames();
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        height,
        width,
        offset,
        scale,
        imageSrc,
        framesMax,
        framesHold,
        framesRows,
        rowCurrent,
        sprites,
        velocity,
        attack1BoxOffset
    }) {
        super({
            position,
            height,
            width,
            offset,
            scale,
            imageSrc,
            framesMax,
            framesHold,
            framesHold,
            framesRows,
            rowCurrent,
            sprites
        });

        this.velocity = velocity;
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
        this.attack1Damage = 20;
        this.attack1BoxOffset = attack1BoxOffset;
        this.isAttacking = false;
        this.health = 100;
    }

    update() {
        this.draw();
        this.animateFrames();

        this.attack1Box.position.x = this.position.x + this.attack1BoxOffset.x;
        this.attack1Box.position.y = this.position.y + this.attack1BoxOffset.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + (this.height / this.framesRows) + this.velocity.y >= canvas.height - floorHeight) {
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
