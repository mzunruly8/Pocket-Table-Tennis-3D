function createPaddle(x, y, z, color = 0x3867ff) {
    const paddle = new THREE.Group();
    const face = new THREE.Mesh(
        new THREE.CylinderGeometry(0.62, 0.62, 0.13, 32),
        new THREE.MeshPhongMaterial({ color, shininess: 80 })
    );
    face.rotation.x = Math.PI / 2;
    paddle.add(face);

    const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.62, 0.18),
        new THREE.MeshPhongMaterial({ color: 0xd28b50 })
    );
    handle.position.y = -0.4;
    paddle.add(handle);

    paddle.position.set(x, y, z);
    paddle.userData = { radius: 0.72, homeX: x, swingUntil: 0 };
    return paddle;
}
