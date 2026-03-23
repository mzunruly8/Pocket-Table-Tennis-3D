function createPaddle(x, y, z) {
    const geom = new THREE.BoxGeometry(1, 0.3, 1);
    const mat = new THREE.MeshPhongMaterial({ color: 0x0033aa });
    const paddle = new THREE.Mesh(geom, mat);
    paddle.position.set(x, y, z);
    return paddle;
}
