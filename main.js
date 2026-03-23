let scene, camera, renderer;
let table, ball, playerPaddle, opponentPaddle;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(0, 6, 12);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("game-container").appendChild(renderer.domElement);

    // Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(light);

    // Table
    table = createTable();
    scene.add(table);

    // Paddles
    playerPaddle = createPaddle(0, 0.3, 4.5);
    opponentPaddle = createPaddle(0, 0.3, -4.5);
    scene.add(playerPaddle);
    scene.add(opponentPaddle);

    // Ball
    ball = createBall();
    scene.add(ball.mesh);

    initInput(playerPaddle);
    initAI(opponentPaddle, ball);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    updateBallPhysics(ball, table);
    updateAI(opponentPaddle, ball);

    renderer.render(scene, camera);
}

init();
