function createTable() {
    const table = new THREE.Group();
    const tableGeometry = new THREE.BoxGeometry(10, 0.3, 20);
    const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x087ca1, shininess: 70 });
    const surface = new THREE.Mesh(tableGeometry, tableMaterial);
    surface.position.y = 0;
    table.add(surface);

    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xdaf7ff });
    const centerLine = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.012, 19.7), lineMaterial);
    centerLine.position.y = 0.16;
    table.add(centerLine);

    const net = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.72, 0.12),
        new THREE.MeshPhongMaterial({ color: 0xe9fbff, transparent: true, opacity: 0.72 })
    );
    net.position.set(0, 0.52, 0);
    table.add(net);

    const postMaterial = new THREE.MeshPhongMaterial({ color: 0x17283a });
    for (const x of [-5.03, 5.03]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.9, 10), postMaterial);
        post.position.set(x, 0.42, 0);
        table.add(post);
    }

    return table;
}
