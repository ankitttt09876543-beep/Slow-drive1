import * as THREE from 'three';
import { noise, getRoadTurn } from './terrain.js';

export class Vehicle {
    constructor(scene) {
        this.mesh = new THREE.Group();
        
        // Car Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, 2.5), new THREE.MeshPhongMaterial({ color: 0xff4444 }));
        body.position.y = 0.6;
        
        // Cabin
        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), new THREE.MeshPhongMaterial({ color: 0x88ccff, transparent: true, opacity: 0.7 }));
        cabin.position.set(0, 1.1, -0.2);
        
        // Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3);
        wheelGeo.rotateZ(Math.PI/2);
        const wheelMat = new THREE.MeshPhongMaterial({color: 0x111111});
        const positions = [[-0.8, 0.4, 0.8], [0.8, 0.4, 0.8], [-0.8, 0.4, -0.8], [0.8, 0.4, -0.8]];
        positions.forEach(p => {
            const w = new THREE.Mesh(wheelGeo, wheelMat);
            w.position.set(...p);
            this.mesh.add(w);
        });

        this.mesh.add(body, cabin);
        scene.add(this.mesh);
        
        this.speed = 0.7;
        this.steering = 0;
        this.targetX = 0;
    }

    update(input) {
        if (input.left) this.targetX -= 0.15;
        if (input.right) this.targetX += 0.15;

        // Road ke mod (turn) ke saath car ka position adjust karna
        const roadX = getRoadTurn(this.mesh.position.z);
        this.mesh.position.x += (roadX + this.targetX - this.mesh.position.x) * 0.1;
        this.mesh.position.z -= this.speed;
        
        this.mesh.rotation.y = (roadX + this.targetX - this.mesh.position.x) * 0.5;
        this.mesh.position.y = noise(this.mesh.position.x, this.mesh.position.z) + 0.1;
    }
}
