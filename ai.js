function initAI(paddle) {
    paddle.ai = {
        speed: 3.5,
        reaction: 0.16,
        targetX: 0,
        nextThink: 0
    };
}

function updateAI(paddle, ball, now) {
    if (!ball.active) return;
    if (now >= paddle.ai.nextThink) {
        paddle.ai.nextThink = now + paddle.ai.reaction * 1000;
        paddle.ai.targetX = THREE.MathUtils.clamp(ball.mesh.position.x + ball.velocity.x * 0.18, -4.1, 4.1);
    }

    const maxMove = paddle.ai.speed * 0.016;
    paddle.position.x += THREE.MathUtils.clamp(paddle.ai.targetX - paddle.position.x, -maxMove, maxMove);

    if (Math.abs(ball.mesh.position.z - paddle.position.z) < 0.8 && paddleCanReach(paddle, ball)) {
        hitBallFromPaddle(ball, paddle, "opponent", {
            strength: 0.72,
            aim: (Math.random() - 0.5) * 0.6,
            topspin: 0.22,
            sidespin: (paddle.position.x - ball.mesh.position.x) * 0.08
        });
    }
}
