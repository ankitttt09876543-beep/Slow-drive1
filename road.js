import * as THREE from 'three';
import { noise, getRoadTurn } from './terrain.js';

export class RoadChunk {
    constructor(zOffset, size) {
        this.mesh = new THREE.Group();
        const segments = 10;
        const step = size / segments;

        for (let i = 0; i < segments; i++) {
            const currentZ = -i * step;
            const absoluteZ = zOffset + currentZ;
            const roadX = getRoadTurn(absoluteZ);

            const geo = new THREE.PlaneGeometry(12, step + 0.5);
            geo.rotateX(-Math.PI / 2);
            const mat = new THREE.MeshPhongMaterial({ color: 0x222222 });
            const segment = new THREE.Mesh(geo, mat);
            
            segment.position.set(roadX, noise(roadX, absoluteZ) + 0.05, currentZ);
            // Road ko modna
            segment.rotation.y = (getRoadTurn(absoluteZ - 1) - roadX) * 0.5;
            this.mesh.add(segment);

            // Side Barriers
            const barrierGeo = new THREE.BoxGeometry(0.4, 0.8, step);
            const barrierMat = new THREE.MeshPhongMaterial({color: 0xcccccc});
            const leftB = new THREE.Mesh(barrierGeo, barrierMat);
            leftB.position.set(-6, 0.4, 0);
            segment.add(leftB);
            const rightB = new THREE.Mesh(barrierGeo, barrierMat);
            rightB.position.set(6, 0.4, 0);
            segment.add(rightB);
        }
        this.mesh.position.z = zOffset;
    }
}
