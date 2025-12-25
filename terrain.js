import * as THREE from 'three';
import { noise, getRoadPoint } from './road.js';

export class TerrainChunk {
    constructor(zOffset, size) {
        this.group = new THREE.Group();
        const geometry = new THREE.PlaneGeometry(300, size, 30, 30);
        geometry.rotateX(-Math.PI / 2);

        const vertices = geometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            vertices[i+1] = noise(vertices[i], vertices[i+2] + zOffset);
        }
        geometry.computeVertexNormals();
        const material = new THREE.MeshPhongMaterial({ color: 0x5a8a4a, flatShading: true });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zOffset;
        this.group.add(mesh);

        // Spawn Trees
        for(let i=0; i<30; i++) {
            const tx = (Math.random() - 0.5) * 250;
            const tz = (Math.random() - 0.5) * size;
            const roadX = getRoadPoint(zOffset + tz).x;
            if (Math.abs(tx - roadX) > 15) {
                this.addTree(tx, noise(tx, zOffset + tz), zOffset + tz);
            }
        }
    }

    addTree(x, y, z) {
        const tree = new THREE.Group();
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 2), new THREE.MeshPhongMaterial({color: 0x4b3621}));
        const leaves = new THREE.Mesh(new THREE.ConeGeometry(2.5, 5, 6), new THREE.MeshPhongMaterial({color: 0x2d5a27}));
        leaves.position.y = 3;
        tree.add(trunk, leaves);
        tree.position.set(x, y, z);
        this.group.add(tree);
    }
}
