export function attackRectangleCollision(fighter1, fighter2) {
    const {
        attackBox: {
            position: {
                x: fighter1AttackX,
                y: fighter1AttackY
            },
            width: fighter1AttackWidth,
            height: fighter1AttackHeight
        }
    } = fighter1;
    const {
        position: {
            x: fighter2XInitial,
            y: fighter2YInitial
        },
        offset: {
            x: fighter2OffsetX,
            y: fighter2OffsetY
        },
        width: fighter2WidthInitial,
        height: fighter2HeightInitial
    } = fighter2;

    const fighter2X = fighter2XInitial - fighter2OffsetX;
    const fighter2Y = fighter2YInitial - fighter2OffsetY;
    const fighter2Width = fighter2WidthInitial / fighter1.framesMax;
    const fighter2Height = fighter2HeightInitial / fighter1.framesRows;

    if (
        fighter1AttackX + fighter1AttackWidth >= fighter2X &&
        fighter1AttackX <= fighter2X + fighter2Width &&
        fighter1AttackY + fighter1AttackHeight >= fighter2Y &&
        fighter1AttackY <= fighter2Y + fighter2Height
    ) {
        fighter1.isAttacking = false;
        return true;
    }

    return false;
}

export function determineWinner(player, enemy, timerId) {
    clearTimeout(timerId)
    const overlay = document.querySelector('#game-end-overlay');
    overlay.style.display = 'flex';
    if (player.health > enemy.health) {
        overlay.innerHTML = 'PLAYER 1 WINS';
    } else if (enemy.health > player.health) {
        overlay.innerHTML = 'PLAYER 2 WINS';
    } else {
        overlay.innerHTML = 'TIE';
    }
}

export function capitalizeFirstLetter([ first, ...rest ], locale = navigator.language) {
    return first.toLocaleUpperCase(locale) + rest.join('');
}
