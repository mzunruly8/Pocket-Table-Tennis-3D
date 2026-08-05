let scene, camera, renderer;
let table, ball, playerPaddle, opponentPaddle;
let lastFrame = 0;

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x061220);
    scene.fog = new THREE.Fog(0x061220, 12, 34);

    camera = new THREE.PerspectiveCamera(54, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8.7, 13.5);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("game-container").appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(0xa9eaff, 0x07111f, 1.35));
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(5, 12, 8);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x3ce4ff, 16, 24);
    rimLight.position.set(-5, 4, -5);
    scene.add(rimLight);

    table = createTable();
    scene.add(table);

    playerPaddle = createPaddle(0, 1.0, 4.55, 0x3867ff);
    opponentPaddle = createPaddle(0, 1.0, -4.55, 0xff5574);
    scene.add(playerPaddle, opponentPaddle);

    ball = createBall();
    scene.add(ball.mesh);

    initInput(playerPaddle);
    initAI(opponentPaddle);
    serveBall(ball, "player");
    window.addEventListener("resize", resize);
    animate(0);
}

function resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(now) {
    requestAnimationFrame(animate);
    const dt = lastFrame ? (now - lastFrame) / 1000 : 0;
    lastFrame = now;

    if (!UI.paused() && !UI.gameOver()) {
        updatePlayerInput(playerPaddle, dt);
        const physicsEvent = updateBallPhysics(ball, dt);
        updateAI(opponentPaddle, ball, now);
        resolveGameEvents(physicsEvent);
        animatePaddles(now);
        UI.updateSpeedUI(ball.velocity.length());
        UI.updateSpinUI(ball.spin.length());
    }

    renderer.render(scene, camera);
}

function resolveGameEvents(event) {
    if (event?.event === "out" || event?.event === "net") {
        awardPointForMiss();
        return;
    }

    if (!ball.active) return;
    if (ball.bounces > 1) {
        awardPointForMiss();
        return;
    }

    if (ball.mesh.position.z > 5.2 && ball.lastHit === "opponent") {
        UI.addPointToOpponent();
        ball.active = false;
    } else if (ball.mesh.position.z < -5.2 && ball.lastHit === "player") {
        UI.addPointToPlayer();
        ball.active = false;
    }
}

function awardPointForMiss() {
    const winner = ball.lastHit === "player" ? "player" : "opponent";
    ball.active = false;
    if (winner === "player") UI.addPointToPlayer();
    else UI.addPointToOpponent();
}

function animatePaddles(now) {
    for (const paddle of [playerPaddle, opponentPaddle]) {
        const until = paddle.userData.swingUntil || 0;
        const progress = until > now ? 1 - (until - now) / 130 : 0;
        paddle.rotation.z = until > now ? Math.sin(progress * Math.PI) * 0.45 : 0;
    }
}

init();
