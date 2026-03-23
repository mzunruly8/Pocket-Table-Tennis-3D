function updateBallPhysics(ball, table) {
    const b = ball.mesh;

    // Apply velocity
    b.position.add(ball.velocity);

    // Gravity
    ball.velocity.y -= 0.001;

    // Bounce on table
    if (b.position.y <= 0.25) {
        ball.velocity.y *= -0.8;
        b.position.y = 0.25;
    }

    // Table boundaries
    if (Math.abs(b.position.x) > 5) ball.velocity.x *= -1;
    if (Math.abs(b.position.z) > 10) ball.velocity.z *= -1;

    // Spin effect (Magnus-like)
    ball.velocity.x += ball.spin.y * 0.001;
    ball.velocity.z += ball.spin.x * 0.001;
}
