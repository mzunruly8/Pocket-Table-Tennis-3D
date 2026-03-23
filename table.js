function createTable() {
    const tableGeometry = new THREE.BoxGeometry(10, 0.3, 20);
    const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x0066aa });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = 0;

    // Net
    const netGeometry = new THREE.BoxGeometry(10, 0.4, 0.1);
    const netMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const net = new THREE.Mesh(netGeometry, netMaterial);
    net.position.set(0, 0.35, 0);

    table.add(net);
    return table;
}
