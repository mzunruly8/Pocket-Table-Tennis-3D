let inputState = {
    pointerId: null,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    startPaddleX: 0,
    startPaddleY: 0,
    keys: new Set()
};

function initInput(paddle) {
    const container = document.getElementById("game-container");

    container.style.touchAction = "none";

    container.addEventListener("pointerdown", event => {
        if (event.pointerType === "mouse" && event.button !== 0) return;
        if (UI.paused() || UI.gameOver()) return;

        inputState.pointerId = event.pointerId;

        inputState.startX = event.clientX;
        inputState.startY = event.clientY;

        inputState.currentX = event.clientX;
        inputState.currentY = event.clientY;

        inputState.startPaddleX = paddle.position.x;
        inputState.startPaddleY = paddle.position.y;

        paddle.userData.targetRotationX = 0;
        paddle.userData.targetRotationZ = 0;

        container.setPointerCapture?.(event.pointerId);
    });

    container.addEventListener("pointermove", event => {
        if (
            event.pointerId !== inputState.pointerId ||
            UI.paused() ||
            UI.gameOver()
        ) {
            return;
        }

        const dx = event.clientX - inputState.startX;
        const dy = event.clientY - inputState.startY;

        inputState.currentX = event.clientX;
        inputState.currentY = event.clientY;

        // Finger movement directly controls paddle position.
        paddle.position.x = THREE.MathUtils.clamp(
            inputState.startPaddleX + dx * 0.012,
            -4.1,
            4.1
        );

        paddle.position.y = THREE.MathUtils.clamp(
            inputState.startPaddleY - dy * 0.010,
            0.65,
            2.5
        );

        // The racket follows the direction of your movement.
        const vx = dx * 0.003;
        const vy = dy * 0.003;

        paddle.userData.targetRotationZ =
            THREE.MathUtils.clamp(-vx, -0.8, 0.8);

        paddle.userData.targetRotationX =
            THREE.MathUtils.clamp(vy, -0.8, 0.8);
    });

    container.addEventListener("pointerup", event => {
        if (event.pointerId !== inputState.pointerId) return;

        const dx = event.clientX - inputState.startX;
        const dy = event.clientY - inputState.startY;

        const duration = Math.max(
            performance.now() - (inputState.startTime || performance.now()),
            16
        );

        const vx = dx / (duration / 1000);
        const vy = dy / (duration / 1000);

        inputState.pointerId = null;

        container.releasePointerCapture?.(event.pointerId);

        attemptPlayerSwing(dx, dy, vx, vy);
    });

    container.addEventListener("pointercancel", () => {
        inputState.pointerId = null;
        paddle.userData.targetRotationX = 0;
        paddle.userData.targetRotationZ = 0;
    });

    window.addEventListener("keydown", event => {
        inputState.keys.add(event.key.toLowerCase());

        if (
            ["arrowleft", "arrowright", "a", "d", " "]
                .includes(event.key.toLowerCase())
        ) {
            event.preventDefault();
        }

        if (event.key === " " && !UI.paused()) {
            attemptPlayerSwing(0, -90, 0, -900);
        }
    });

    window.addEventListener("keyup", event => {
        inputState.keys.delete(event.key.toLowerCase());
    });
}

function updatePlayerInput(paddle, dt) {
    const left =
        inputState.keys.has("arrowleft") ||
        inputState.keys.has("a");

    const right =
        inputState.keys.has("arrowright") ||
        inputState.keys.has("d");

    paddle.position.x += (right - left) * 5.5 * dt;

    paddle.position.x = THREE.MathUtils.clamp(
        paddle.position.x,
        -4.1,
        4.1
    );
}

function attemptPlayerSwing(dx, dy, vx, vy) {
    const distance = Math.hypot(dx, dy);

    if (
        distance < 18 ||
        UI.paused() ||
        UI.gameOver()
    ) {
        return;
    }

    const speed = Math.hypot(vx, vy);

    const strength = THREE.MathUtils.clamp(
        speed / 850,
        0.45,
        1.6
    );

    const aim = THREE.MathUtils.clamp(
        dx / 120,
        -1,
        1
    );

    const topspin = THREE.MathUtils.clamp(
        -dy / 120,
        -1,
        1
    );

    const swingDuration = THREE.MathUtils.clamp(
        240 - speed * 0.06,
        120,
        240
    );

    const now = performance.now();

    // Tell the paddle to actually swing.
    playerPaddle.userData.swingStart = now;
    playerPaddle.userData.swingDuration = swingDuration;
    playerPaddle.userData.swingUntil = now + swingDuration;

    playerPaddle.userData.swingAngleZ =
        THREE.MathUtils.clamp(-vx * 0.0012, -0.9, 0.9);

    playerPaddle.userData.swingAngleX =
        THREE.MathUtils.clamp(vy * 0.0012, -0.9, 0.9);

    const hit = hitBallFromPaddle(
        ball,
        playerPaddle,
        "player",
        {
            strength,
            aim,
            topspin,
            sidespin: dx / 120
        }
    );

    if (hit) {
        UI.setStatus("Rally on");
    }
}
