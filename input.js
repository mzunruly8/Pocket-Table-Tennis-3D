let inputState = {
    pointerId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    keys: new Set()
};

function initInput(paddle) {
    const container = document.getElementById("game-container");

    container.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        inputState.pointerId = event.pointerId;
        inputState.startX = event.clientX;
        inputState.startY = event.clientY;
        inputState.currentX = event.clientX;
        inputState.currentY = event.clientY;
        container.setPointerCapture?.(event.pointerId);
    });

    container.addEventListener("pointermove", event => {
        if (event.pointerId !== inputState.pointerId || UI.paused() || UI.gameOver()) return;
        inputState.currentX = event.clientX;
        inputState.currentY = event.clientY;
        const normalizedX = (event.clientX / window.innerWidth - 0.5) * 8;
        paddle.position.x = THREE.MathUtils.clamp(normalizedX, -4.1, 4.1);
    });

    container.addEventListener("pointerup", event => {
        if (event.pointerId !== inputState.pointerId) return;
        const dx = event.clientX - inputState.startX;
        const dy = event.clientY - inputState.startY;
        inputState.pointerId = null;
        container.releasePointerCapture?.(event.pointerId);
        attemptPlayerSwing(dx, dy);
    });

    container.addEventListener("pointercancel", () => {
        inputState.pointerId = null;
    });

    window.addEventListener("keydown", event => {
        inputState.keys.add(event.key.toLowerCase());
        if (["arrowleft", "arrowright", "a", "d", " "].includes(event.key.toLowerCase())) event.preventDefault();
        if (event.key === " " && !UI.paused()) attemptPlayerSwing(0, -90);
    });

    window.addEventListener("keyup", event => inputState.keys.delete(event.key.toLowerCase()));
}

function updatePlayerInput(paddle, dt) {
    const left = inputState.keys.has("arrowleft") || inputState.keys.has("a");
    const right = inputState.keys.has("arrowright") || inputState.keys.has("d");
    paddle.position.x += (right - left) * 5.5 * dt;
    paddle.position.x = THREE.MathUtils.clamp(paddle.position.x, -4.1, 4.1);
}

function attemptPlayerSwing(dx, dy) {
    const distance = Math.hypot(dx, dy);
    if (distance < 18 || UI.paused() || UI.gameOver()) return;
    const strength = THREE.MathUtils.clamp(distance / 110, 0.45, 1.55);
    const aim = THREE.MathUtils.clamp(dx / 100, -1, 1);
    const topspin = THREE.MathUtils.clamp(-dy / 100, -1, 1);
    const hit = hitBallFromPaddle(ball, playerPaddle, "player", { strength, aim, topspin, sidespin: dx / 120 });
    if (hit) UI.setStatus("Rally on");
}
