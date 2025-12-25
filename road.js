import * as THREE from 'three';

export const noise = (x, z) => {
    return Math.sin(x * 0.05) * Math.cos(z * 0.05) * 5 + Math.sin(z * 0.01) * 8;
};

export function getRoadPoint(z) {
    const x = Math.sin(z * 0.015) * 20 + Math.cos(z * 0.008) * 10;
    return new THREE.Vector3(x, noise(x, z), z);
}

export class RoadChunk {
    constructor(zOffset, size) {
        this.group = new THREE.Group();
        const points = [];
        for (let i = 0; i <= 10; i++) {
            points.push(getRoadPoint(zOffset - (i / 10) * size));
        }
        const curve = new THREE.CatmullRomCurve3(points);
        const geo = new THREE.TubeGeometry(curve, 20, 7, 8, false);
        const mat = new THREE.MeshPhongMaterial({ color: 0x222222 });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.scale.set(1, 0.04, 1);
        this.group.add(mesh);
    }
}
