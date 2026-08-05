function createBall() {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.22, 20, 20),
        new THREE.MeshPhongMaterial({ color: 0xfff6c7, emissive: 0x4a4218, shininess: 100 })
    );
    mesh.position.set(0, 1.45, 3.55);

    return {
        mesh,
        velocity: new THREE.Vector3(0, 0, 0),
        spin: new THREE.Vector3(0, 0, 0),
        active: false,
        lastHit: null,
        bounces: 0
    };
}
