import * as THREE from 'three';
import { TerrainChunk } from './terrain.js';
import { RoadChunk } from './road.js';
import { Vehicle } from './vehicle.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Sky blue background
scene.fog = new THREE.Fog(0x87ceeb, 20, 100);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.body.appendChild(renderer.domElement);

// Bright Lighting
const sun = new THREE.DirectionalLight(0xffffff, 1.2);
sun.position.set(10, 50, 10);
scene.add(sun);
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

const vehicle = new Vehicle(scene);
const chunks = [];
const CHUNK_SIZE = 50;
let lastChunkZ = 0;

function spawnChunk(z) {
    const terrain = new TerrainChunk(z, CHUNK_SIZE);
    const road = new RoadChunk(z, CHUNK_SIZE);
    scene.add(terrain.group);
    scene.add(road.mesh);
    chunks.push({ terrain, road, z });
}

for (let i = 0; i < 5; i++) {
    spawnChunk(lastChunkZ);
    lastChunkZ -= CHUNK_SIZE;
}

const input = { left: false, right: false };
const handleInput = (e, val) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    if (x < window.innerWidth / 2) input.left = val;
    else input.right = val;
};
window.addEventListener('touchstart', (e) => handleInput(e, true));
window.addEventListener('touchend', () => input.left = input.right = false);

function animate() {
    requestAnimationFrame(animate);
    vehicle.update(input);

    camera.position.set(vehicle.mesh.position.x, vehicle.mesh.position.y + 3.5, vehicle.mesh.position.z + 8);
    camera.lookAt(vehicle.mesh.position.x, vehicle.mesh.position.y, vehicle.mesh.position.z - 10);

    if (vehicle.mesh.position.z < lastChunkZ + (CHUNK_SIZE * 3)) {
        spawnChunk(lastChunkZ);
        lastChunkZ -= CHUNK_SIZE;
    }
    if (chunks.length > 6) {
        const oldest = chunks.shift();
        scene.remove(oldest.terrain.group);
        scene.remove(oldest.road.mesh);
    }
    renderer.render(scene, camera);
}
animate();
