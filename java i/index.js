import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(6, 5, 9);

const boxCylinder = new THREE.CylinderGeometry(Math.SQRT1_2, Math.SQRT1_2, 1, 4, 1, false, Math.PI / 4);
const pyramidCone = new THREE.ConeGeometry(Math.SQRT1_2, 1, 4, 1, false, Math.PI / 4);

const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xf5deb3 });
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0xb22222 });
const doorMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
const windowMaterial = new THREE.MeshStandardMaterial({ color: 0x66ccff });
const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0x777777 });
const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x6b3e1f });
const leavesMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
const fenceMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

const house = new THREE.Group();
scene.add(house);

const wallWidth = 4;
const wallHeight = 2.5;
const wallDepth = 3;

const walls = new THREE.Mesh(boxCylinder, wallMaterial);
walls.scale.set(wallWidth, wallHeight, wallDepth);
walls.position.y = wallHeight / 2;
house.add(walls);

const roofHeight = 1.8;
const roof = new THREE.Mesh(pyramidCone, roofMaterial);
roof.scale.set(wallWidth + 0.6, roofHeight, wallDepth + 0.6);
roof.position.y = wallHeight + roofHeight / 2;
house.add(roof);

const chimney = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 1.4, 32), chimneyMaterial);
chimney.position.set(1.1, wallHeight + 1.1, -0.5);
house.add(chimney);

const door = new THREE.Mesh(boxCylinder, doorMaterial);
door.scale.set(0.8, 1.5, 0.1);
door.position.set(0, 0.75, wallDepth / 2);
house.add(door);

const doorKnob = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16), chimneyMaterial);
doorKnob.rotation.x = Math.PI / 2;
doorKnob.position.set(0.25, 0.75, wallDepth / 2 + 0.08);
house.add(doorKnob);

function createWindow(x, y, z, rotationY) {
    const windowMesh = new THREE.Mesh(boxCylinder, windowMaterial);
    windowMesh.scale.set(0.7, 0.7, 0.1);
    windowMesh.position.set(x, y, z);
    windowMesh.rotation.y = rotationY;
    house.add(windowMesh);
}

createWindow(-1.3, 1.5, wallDepth / 2, 0);
createWindow(1.3, 1.5, wallDepth / 2, 0);
createWindow(wallWidth / 2, 1.5, 0, Math.PI / 2);
createWindow(-wallWidth / 2, 1.5, 0, Math.PI / 2);

const roofHalfDepth = (wallDepth + 0.6) / 2;
const roundWindowHeight = 0.6;
const roundWindow = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.1, 32), windowMaterial);
roundWindow.position.set(0, wallHeight + roundWindowHeight, roofHalfDepth * (1 - roundWindowHeight / roofHeight) + 0.03);
roundWindow.rotation.x = Math.atan(roofHeight / roofHalfDepth);
house.add(roundWindow);

function createTree(x, z, size) {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.15 * size, 0.2 * size, 1 * size, 16), trunkMaterial);
    trunk.position.y = 0.5 * size;
    tree.add(trunk);

    for (let i = 0; i < 3; i++) {
        const leaves = new THREE.Mesh(new THREE.ConeGeometry((0.9 - i * 0.2) * size, 1 * size, 32), leavesMaterial);
        leaves.position.y = (1.2 + i * 0.5) * size;
        tree.add(leaves);
    }

    tree.position.set(x, 0, z);
    scene.add(tree);
}

createTree(-4, -1, 1.2);
createTree(4.2, 1, 1);
createTree(-3.5, 2.5, 0.8);

const fencePostGeometry = new THREE.CylinderGeometry(0.06, 0.06, 0.6, 12);
const fenceTipGeometry = new THREE.ConeGeometry(0.09, 0.2, 12);

for (let x = -3; x <= 3; x += 0.5) {
    if (Math.abs(x) < 0.6) continue;

    const post = new THREE.Mesh(fencePostGeometry, fenceMaterial);
    post.position.set(x, 0.3, 3.5);
    scene.add(post);

    const tip = new THREE.Mesh(fenceTipGeometry, fenceMaterial);
    tip.position.set(x, 0.7, 3.5);
    scene.add(tip);
}

const ground = new THREE.Mesh(
    new THREE.CylinderGeometry(8, 8, 0.2, 64),
    new THREE.MeshStandardMaterial({ color: 0x7cba3d })
);
ground.position.y = -0.1;
scene.add(ground);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('scene').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.5, 0);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
