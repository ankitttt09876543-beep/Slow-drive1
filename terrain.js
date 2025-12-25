import * as THREE from 'three';

const noise = (x, z) => {
    return Math.sin(x * 0.05) * Math.cos(z * 0.05) * 4 + Math.sin(x * 0.02) * 10;
};

// Road ka turn calculate karne ke liye function
const getRoadTurn = (z) => Math.sin(z * 0.01) * 15;

export class TerrainChunk {
    constructor(zOffset, size) {
        this.group = new THREE.Group();
        const geometry = new THREE.PlaneGeometry(150, size, 20, 20);
        geometry.rotateX(-Math.PI / 2);
        
        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i+1] = noise(vertices[i], vertices[i+2] + zOffset);
        }
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({ color: 0x4d7a3a, flatShading: true });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.z = zOffset;
        this.group.add(this.mesh);

        // Add Simple Trees
        for(let i=0; i<15; i++) {
            const tx = (Math.random() - 0.5) * 100;
            const tz = (Math.random() - 0.5) * size;
            if (Math.abs(tx - getRoadTurn(tz + zOffset)) > 15) { // Road se door ped lagao
                const tree = new THREE.Group();
                const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 1), new THREE.MeshPhongMaterial({color: 0x4b3621}));
                const leaves = new THREE.Mesh(new THREE.ConeGeometry(1.5, 3, 4), new THREE.MeshPhongMaterial({color: 0x2d5a27}));
                leaves.position.y = 2;
                tree.add(trunk, leaves);
                tree.position.set(tx, noise(tx, tz + zOffset), tz);
                this.group.add(tree);
            }
        }
    }
}
export { noise, getRoadTurn };
