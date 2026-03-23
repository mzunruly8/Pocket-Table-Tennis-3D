function createBall() {
    const geom = new THREE.SphereGeometry(0.25, 16, 16);
    const mat = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geom, mat);

    return {
        mesh,
        velocity: new THREE.Vector3(0.05, 0.02, -0.2),
        spin: new THREE.Vector3(0, 0, 0)
    };
}
