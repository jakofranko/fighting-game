import { CANVAS_HEIGHT, FLOOR_HEIGHT, GRAVITY } from './constants';

export class Sprite {
    constructor({
        ctx,
        position,
        height,
        width,
        offset = { x: 0, y: 0 },
        scale = { x: 1, y: 1 },
        imageSrc,
        sprites,
        noInterruptSprites = [],
        framesMax = 1,
        framesHold = 10,
        framesRows = 1,
        rowCurrent = 0
    }) {
        this.ctx = ctx;
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
        this.noInterruptSprites = noInterruptSprites;
        this.spriteCurrent = 'idle';
    }

    switchSprite(sprite) {
        if (sprite === this.spriteCurrent) {
            return
        }

        if (this.noInterruptSprites.includes(this.spriteCurrent) && this.framesCurrent < this.sprites[this.spriteCurrent].framesEnd - 1) {
            return
        }

        const { row, framesStart, framesEnd } = this.sprites[sprite];

        this.rowCurrent = row;
        this.framesStart = framesStart;
        this.framesEnd = framesEnd;
        this.framesCurrent = 0;
        this.spriteCurrent = sprite;
    }

    draw() {
        this.ctx.drawImage(
            this.image,
            ((this.framesCurrent + this.framesStart) * (this.width / this.framesMax)) - this.offset.x,
            (this.rowCurrent * (this.height / this.framesRows)) - this.offset.y,
            this.width / this.framesMax,
            this.height / this.framesRows,
            this.position.x,
            this.position.y,
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

export class Fighter extends Sprite {
    constructor({
        ctx,
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
        noInterruptSprites,
        velocity,
        attackBox
    }) {
        super({
            ctx,
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
            sprites,
            noInterruptSprites
        });

        this.velocity = velocity;
        this.attack1Width = 100;
        this.attack1Height = 50;
        this.lastKey = null;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
            totalFrames: attackBox.totalFrames,
            hitFrames: attackBox.hitFrames
        };
        this.attack1Damage = 20;
        this.isAttacking = false;
        this.health = 100;
    }

    update() {
        this.draw();
        this.animateFrames();

        // Disable attacking
        if (this.isAttacking && this.framesCurrent === this.attackBox.totalFrames - 1) {
            this.isAttacking = false;
        }

        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        // this.ctx.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.position.y + (this.height / this.framesRows) + this.velocity.y >= CANVAS_HEIGHT - FLOOR_HEIGHT) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += GRAVITY;
        }
    }

    attack() {
        this.isAttacking = true;
        this.switchSprite('punch1');
    }

    takeHit(damage) {
        this.switchSprite('takeHit');
        this.health -= damage;
    }
}
