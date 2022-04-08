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

function determineWinner(player, enemy, timerId) {
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
