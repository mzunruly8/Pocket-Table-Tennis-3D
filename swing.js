// ===============================================
// REAL-FEEL SWING SYSTEM FOR POCKET TABLE TENNIS
// Overrides hitBall() and adds paddle animation,
// force curves, timing, spin, and realism.
// ===============================================

// Track swipe start
let swingStartX = 0;
let swingStartY = 0;

// Attach listeners
window.addEventListener("touchstart", e => {
    swingStartX = e.touches[0].clientX;
    swingStartY = e.touches[0].clientY;
});

window.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - swingStartX;
    const dy = e.changedTouches[0].clientY - swingStartY;
    realFeelSwing(dx, dy);
});

// ===============================================
// MAIN REAL-FEEL SWING FUNCTION
// ===============================================
function realFeelSwing(dx, dy) {
    const swingVector = new THREE.Vector2(dx, dy);
    const swingSpeed = swingVector.length();

    // Ignore tiny swipes
    if (swingSpeed < 20) return;

    // Normalize direction
    swingVector.normalize();

    // Force curve (adds "snap" to the swing)
    const force = Math.pow(swingSpeed / 100, 1.3);

    // Distance from paddle → timing window
    const dz = Math.abs(ball.mesh.position.z - playerPaddle.position.z);
    const timingBoost = THREE.MathUtils.clamp(1 - dz / 2, 0.5, 1.2);

    // ===========================================
    // APPLY REALISTIC BALL VELOCITY
    // ===========================================
    ball.velocity.z = (-0.18 - force * 0.35) * timingBoost;
    ball.velocity.y = (0.03 + (-swingVector.y * 0.04 * force)) * timingBoost;
    ball.velocity.x = (swingVector.x * 0.12 * force) * timingBoost;

    // ===========================================
    // APPLY REALISTIC SPIN
    // ===========================================
    ball.spin.x = swingVector.y * 0.25 * force * timingBoost;  // Top/backspin
    ball.spin.y = swingVector.x * 0.35 * force * timingBoost;  // Sidespin
    ball.spin.z = 0;

    // Slight randomness for realism
    ball.velocity.x += (Math.random() - 0.5) * 0.01;
    ball.velocity.y += (Math.random() - 0.5) * 0.005;

    // Paddle animation
    animatePaddleSwing(force);
}

// ===============================================
// PADDLE SWING ANIMATION
// ===============================================
function animatePaddleSwing(force) {
    const paddle = playerPaddle;

    const swingAmount = 0.4 * force;
    const startRot = paddle.rotation.x;
    const endRot = startRot - swingAmount;

    let t = 0;

    function swing() {
        t += 0.15;
        paddle.rotation.x = THREE.MathUtils.lerp(startRot, endRot, t);

        if (t < 1) {
            requestAnimationFrame(swing);
        } else {
            // Return paddle to neutral
            paddle.rotation.x = startRot;
        }
    }

    swing();
}
