import * as THREE from 'three';
import { getRoadPoint, noise } from './road.js';

export class Vehicle {
    constructor(scene) {
        this.mesh = new THREE.Group();
        // Body
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.6, 3), new THREE.MeshPhongMaterial({ color: 0xff4444 }));
        body.position.y = 0.6;
        // Wheels
        const wGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4); wGeo.rotateZ(Math.PI/2);
        const wMat = new THREE.MeshPhongMaterial({color: 0x222222});
        this.wheels = [];
        for(let i=0; i<4; i++) {
            const w = new THREE.Mesh(wGeo, wMat);
            this.mesh.add(w); this.wheels.push(w);
        }
        this.wheels[0].position.set(-0.8, 0.4, 1.1); this.wheels[1].position.set(0.8, 0.4, 1.1);
        this.wheels[2].position.set(-0.8, 0.4, -1.1); this.wheels[3].position.set(0.8, 0.4, -1.1);
        
        this.mesh.add(body);
        scene.add(this.mesh);

        // Physics variables
        this.speed = 0;
        this.acceleration = 0.01;
        this.friction = 0.98;
        this.maxSpeed = 1.2;
        this.rotation = 0;
        this.brakeTimer = 0;
        this.isReversing = false;
    }

    update(input) {
        // Gas Logic
        if (input.gas) {
            this.speed += this.acceleration;
            this.isReversing = false;
        } 
        // Brake & Reverse Logic
        if (input.brake) {
            if (this.speed > 0.01) {
                this.speed -= 0.03; // Normal Braking
            } else {
                this.speed = 0;
                this.brakeTimer += 0.016; // Approx 60fps
                if (this.brakeTimer > 1.5) { // 1.5 - 2 sec for mobile feels better
                    this.isReversing = true;
                    this.speed = -0.3;
                }
            }
        } else {
            this.brakeTimer = 0;
            this.speed *= this.friction; // Slow down when no gas
        }

        // Steering
        this.rotation = -input.steeringAngle * 0.05;
        this.mesh.rotation.y += (this.rotation - this.mesh.rotation.y) * 0.1;

        // Position Update
        const direction = new THREE.Vector3(0, 0, -1).applyQuaternion(this.mesh.quaternion);
        this.mesh.position.addScaledVector(direction, this.speed);

        // Ground stickiness
        const terrainY = noise(this.mesh.position.x, this.mesh.position.z);
        this.mesh.position.y = terrainY + 0.1;

        // Wheel Rotation
        this.wheels.forEach(w => w.rotation.x -= this.speed);
    }
}
