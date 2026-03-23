function initAI(paddle, ball) {
    paddle.ai = { speed: 0.05 };
}

function updateAI(paddle, ball) {
    const targetX = ball.mesh.position.x;
    paddle.position.x += (targetX - paddle.position.x) * paddle.ai.speed;

    // Return ball when close
    if (ball.mesh.position.z < -4 && ball.velocity.z < 0) {
        ball.velocity.z = 0.25;
        ball.velocity.y = 0.04;
    }
}
