const GAME_CONSTANTS = {
    tableTop: 0.3,
    ballRadius: 0.22,
    tableHalfWidth: 5,
    tableHalfLength: 10,
    netHeight: 0.88,
    gravity: -9.8,
    tableRestitution: 0.82,
    maxSpeed: 13
};

function resetBall(ball, servingSide = "player") {
    ball.mesh.position.set(0, 1.45, servingSide === "player" ? 3.55 : -3.55);
    ball.velocity.set(0, 0, 0);
    ball.spin.set(0, 0, 0);
    ball.active = false;
    ball.lastHit = null;
    ball.bounces = 0;
}

function serveBall(ball, side = "player") {
    resetBall(ball, side);
    ball.active = true;
    ball.lastHit = side;
    ball.velocity.set((Math.random() - 0.5) * 1.2, 5.2, side === "player" ? -5.5 : 5.5);
    ball.spin.set(0, 0, 0);
}

function clampVelocity(ball) {
    const speed = ball.velocity.length();
    if (speed > GAME_CONSTANTS.maxSpeed) ball.velocity.multiplyScalar(GAME_CONSTANTS.maxSpeed / speed);
}

function updateBallPhysics(ball, dt) {
    if (!ball.active) return;
    const b = ball.mesh;
    const previousY = b.position.y;
    const previousZ = b.position.z;
    const frameDt = Math.min(dt, 0.035);

    ball.velocity.y += GAME_CONSTANTS.gravity * frameDt;
    ball.velocity.x += ball.spin.y * frameDt * 0.55;
    ball.velocity.z += ball.spin.x * frameDt * 0.55;
    ball.spin.multiplyScalar(Math.pow(0.985, frameDt * 60));
    b.position.addScaledVector(ball.velocity, frameDt);
    clampVelocity(ball);

    const tableY = GAME_CONSTANTS.tableTop + GAME_CONSTANTS.ballRadius;
    if (previousY > tableY && b.position.y <= tableY && Math.abs(b.position.x) <= GAME_CONSTANTS.tableHalfWidth && Math.abs(b.position.z) <= GAME_CONSTANTS.tableHalfLength) {
        b.position.y = tableY;
        ball.velocity.y = Math.abs(ball.velocity.y) * GAME_CONSTANTS.tableRestitution;
        ball.bounces += 1;
    }

    const wallX = GAME_CONSTANTS.tableHalfWidth - GAME_CONSTANTS.ballRadius;
    if (Math.abs(b.position.x) > wallX) {
        b.position.x = Math.sign(b.position.x) * wallX;
        ball.velocity.x *= -0.75;
    }

    const crossedTableEnd = Math.abs(b.position.z) > GAME_CONSTANTS.tableHalfLength;
    if (crossedTableEnd && b.position.y <= tableY + 0.35) {
        ball.active = false;
        return { event: "out" };
    }

    const netZ = GAME_CONSTANTS.ballRadius;
    if (previousZ < -netZ && b.position.z >= -netZ || previousZ > netZ && b.position.z <= netZ) {
        if (b.position.y < GAME_CONSTANTS.netHeight) {
            ball.active = false;
            return { event: "net" };
        }
    }

    if (Math.abs(b.position.z) > GAME_CONSTANTS.tableHalfLength + 1.2 || b.position.y < -2) {
        ball.active = false;
        return { event: "out" };
    }

    return null;
}

function paddleCanReach(paddle, ball) {
    const dx = ball.mesh.position.x - paddle.position.x;
    const dy = ball.mesh.position.y - paddle.position.y;
    return Math.hypot(dx, dy) <= paddle.userData.radius + GAME_CONSTANTS.ballRadius;
}

function hitBallFromPaddle(ball, paddle, side, swing) {
    if (!ball.active || ball.lastHit === side) return false;
    const expectedDirection = side === "player" ? 1 : -1;
    const movingTowardPaddle = Math.sign(ball.velocity.z) === expectedDirection;
    const closeEnough = Math.abs(ball.mesh.position.z - paddle.position.z) < 0.8 && paddleCanReach(paddle, ball);
    if (!movingTowardPaddle || !closeEnough) return false;

    const strength = THREE.MathUtils.clamp(swing?.strength ?? 0.75, 0.45, 1.6);
    const aim = THREE.MathUtils.clamp(swing?.aim ?? 0, -1, 1);
    const direction = side === "player" ? -1 : 1;
    ball.velocity.set(aim * 2.4 * strength, 4.2 + strength * 1.2, direction * (5.2 + strength * 2.1));
    ball.spin.set((swing?.topspin ?? 0) * 1.5, (swing?.sidespin ?? 0) * 1.2, 0);
    ball.lastHit = side;
    ball.bounces = 0;
    const now = performance.now();

paddle.userData.swingStart = now;

if (!paddle.userData.swingDuration) {
    paddle.userData.swingDuration = 180;
}

paddle.userData.swingUntil =
    now + paddle.userData.swingDuration;

if (paddle.userData.swingAngleX === undefined) {
    paddle.userData.swingAngleX =
        THREE.MathUtils.clamp(
            (swing?.topspin ?? 0) * 0.55,
            -0.8,
            0.8
        );
}

if (paddle.userData.swingAngleZ === undefined) {
    paddle.userData.swingAngleZ =
        THREE.MathUtils.clamp(
            -(swing?.aim ?? 0) * 0.65,
            -0.8,
            0.8
        );
}
