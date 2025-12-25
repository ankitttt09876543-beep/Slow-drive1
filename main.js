import * as THREE from 'three';
import { TerrainChunk } from './terrain.js';
import { RoadChunk } from './road.js';
import { Vehicle } from './vehicle.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb4d0e7);
scene.fog = new THREE.Fog(0xb4d0e7, 40, 180);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(1);
document.body.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(50, 100, 50);
scene.add(sun, new THREE.AmbientLight(0xffffff, 0.5));

const vehicle = new Vehicle(scene);
const chunks = [];
let lastChunkZ = 0;

// Inputs
const input = { gas: false, brake: false, steeringAngle: 0 };

// Steering Wheel Logic
const wheelEl = document.getElementById('wheel');
let isSteering = false;

window.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    if (e.target.id === 'gas') input.gas = true;
    if (e.target.id === 'brake') input.brake = true;
    if (e.target.id === 'wheel' || e.target.id === 'steering-container') isSteering = true;
});

window.addEventListener('touchend', (e) => {
    input.gas = false;
    input.brake = false;
    isSteering = false;
    input.steeringAngle = 0;
    wheelEl.style.transform = `rotate(0deg)`;
});

window.addEventListener('touchmove', (e) => {
    if (isSteering) {
        const touch = e.touches[0];
        const rect = document.getElementById('steering-container').getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const angle = (touch.clientX - centerX) / (rect.width / 2);
        input.steeringAngle = Math.max(-1, Math.min(1, angle));
        wheelEl.style.transform = `rotate(${input.steeringAngle * 90}deg)`;
    }
});

function spawnChunk(z) {
    const t = new TerrainChunk(z, 100);
    const r = new RoadChunk(z, 100);
    scene.add(t.group, r.group);
    chunks.push({ t, r, z });
}

for(let i=0; i<5; i++) { spawnChunk(lastChunkZ); lastChunkZ -= 100; }

function animate() {
    requestAnimationFrame(animate);
    vehicle.update(input);

    // Smooth Camera
    const camTarget = new THREE.Vector3(vehicle.mesh.position.x, vehicle.mesh.position.y + 4, vehicle.mesh.position.z + 10);
    camera.position.lerp(camTarget, 0.1);
    camera.lookAt(vehicle.mesh.position.x, vehicle.mesh.position.y + 1, vehicle.mesh.position.z - 5);

    if (vehicle.mesh.position.z < lastChunkZ + 300) { spawnChunk(lastChunkZ); lastChunkZ -= 100; }
    if (chunks.length > 6) {
        const o = chunks.shift();
        scene.remove(o.t.group, o.r.group);
    }
    renderer.render(scene, camera);
}
animate();
