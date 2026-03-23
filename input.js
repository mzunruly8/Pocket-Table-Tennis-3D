let startX = 0;
let startY = 0;

function initInput(paddle) {
    window.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });

    window.addEventListener("touchmove", e => {
        const dx = e.touches[0].clientX - startX;
        paddle.position.x = THREE.MathUtils.clamp(dx / 80, -4, 4);
    });

    window.addEventListener("touchend", e => {
        const dx = e.changedTouches[0].clientX - startX;
        const dy = e.changedTouches[0].clientY - startY;

        hitBall(dx, dy);
    });
}

function hitBall(dx, dy) {
    // Forward swipe = hit
    if (dy < -30) {
        ball.velocity.z = -0.3;
        ball.velocity.y = 0.05;

        // Spin
        ball.spin.x = dx * 0.02;
        ball.spin.y = dy * -0.01;
    }
}
