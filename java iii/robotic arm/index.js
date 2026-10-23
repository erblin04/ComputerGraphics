import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);


const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(8, 6, 12);
camera.lookAt(0, 3, 0);


const armMaterial = new THREE.MeshStandardMaterial({color: 0x3399ff});
const jointMaterial = new THREE.MeshStandardMaterial({color: 0x555555});
const handMaterial = new THREE.MeshStandardMaterial({color: 0xffaa55});
const fingerMaterial = new THREE.MeshStandardMaterial({color: 0xffcc88});


const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const base = new THREE.Mesh(baseGeometry, jointMaterial);

scene.add(base);


const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);


const shoulderJoint = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), jointMaterial);

shoulder.add(shoulderJoint);


const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 3, 0.7), armMaterial);

upperArm.position.y = 1.5;

shoulder.add(upperArm);

const elbow = new THREE.Group();
elbow.position.y = 3;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(new THREE.SphereGeometry(0.45, 32, 32), jointMaterial);

elbow.add(elbowJoint);

const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.5, 0.6), armMaterial);

forearm.position.y = 1.25;

elbow.add(forearm);


const wrist = new THREE.Group();
wrist.position.y = 2.5;
elbow.add(wrist);


const wristJoint = new THREE.Mesh(new THREE.SphereGeometry(0.35, 32, 32), jointMaterial);

wrist.add(wristJoint);

const palm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.5, 0.4), handMaterial);
palm.position.y = 0.9;

wrist.add(palm);


const selectedFingerMaterial = new THREE.MeshStandardMaterial({color: 0xff5555});

const fingerData = [
    { name: 'Thumb', x: -0.9, y: -0.2, width: 0.32, segments: [0.45, 0.35], spread: THREE.MathUtils.degToRad(50) },
    { name: 'Index', x: -0.6, y: 0.75, width: 0.26, segments: [0.45, 0.32, 0.25], spread: 0 },
    { name: 'Middle', x: -0.2, y: 0.75, width: 0.28, segments: [0.5, 0.38, 0.28], spread: 0 },
    { name: 'Ring', x: 0.2, y: 0.75, width: 0.25, segments: [0.46, 0.34, 0.26], spread: 0 },
    { name: 'Pinky', x: 0.6, y: 0.75, width: 0.2, segments: [0.34, 0.25, 0.2], spread: 0 }
];

const fingers = [];

for (const data of fingerData) {

    const fingerBase = new THREE.Group();
    fingerBase.position.set(data.x, data.y, 0);
    fingerBase.rotation.z = data.spread;
    palm.add(fingerBase);

    const finger = { base: fingerBase, joints: [], meshes: [], spread: data.spread, bend: 0 };

    let parent = fingerBase;
    let offset = 0;

    for (const length of data.segments) {

        const joint = new THREE.Group();
        joint.position.y = offset;
        parent.add(joint);

        const knuckle = new THREE.Mesh(new THREE.SphereGeometry(data.width * 0.55, 16, 16), jointMaterial);
        joint.add(knuckle);

        const segment = new THREE.Mesh(new THREE.BoxGeometry(data.width, length, data.width), fingerMaterial);
        segment.position.y = length / 2;
        joint.add(segment);

        finger.joints.push(joint);
        finger.meshes.push(segment);

        parent = joint;
        offset = length;
    }

    fingers.push(finger);
}

const maxBendAngle = THREE.MathUtils.degToRad(80);
const thumbCloseAngle = THREE.MathUtils.degToRad(35);

function setFingerBend(finger, bend) {

    finger.bend = THREE.MathUtils.clamp(bend, 0, 1);

    for (const joint of finger.joints) {
        joint.rotation.x = finger.bend * maxBendAngle;
    }

    if (finger.spread !== 0) {
        finger.base.rotation.z = finger.spread - finger.bend * thumbCloseAngle;
    }
}

let selectedFinger = 0;

function selectFinger(index) {

    selectedFinger = index;

    fingers.forEach(function(finger, i) {
        for (const mesh of finger.meshes) {
            mesh.material = i === selectedFinger ? selectedFingerMaterial : fingerMaterial;
        }
    });

    document.getElementById('selected').textContent = fingerData[selectedFinger].name;
}

selectFinger(0);


const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff,2);

directionalLight.position.set(5, 10, 5);

scene.add(directionalLight);


const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        color: 0xcccccc
    })
);

ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.25;

scene.add(ground);
 
const grid = new THREE.GridHelper(
    20,
    20
);

scene.add(grid);

 
const renderer = new THREE.WebGLRenderer({
    antialias: true
});

renderer.setSize(
    window.innerWidth,
    window.innerHeight
);

document.getElementById('scene').appendChild(renderer.domElement);

 
const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.target.set(0, 3, 0);

controls.enableDamping = true;

controls.update();


shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

const rotationStep = THREE.MathUtils.degToRad(5);
const bendStep = 0.1;

window.addEventListener('keydown', function(event) {

    const key = event.key.toLowerCase();

    if (key === 'q') {
        shoulder.rotation.z += rotationStep;
    }

    if (key === 'a') {
        shoulder.rotation.z -= rotationStep;
    }

    if (key === 'w') {
        elbow.rotation.z += rotationStep;
    }

    if (key === 's') {
        elbow.rotation.z -= rotationStep;
    }

    if (key === 'e') {
        wrist.rotation.z += rotationStep;
    }

    if (key === 'd') {
        wrist.rotation.z -= rotationStep;
    }

    if (key >= '1' && key <= '5') {
        selectFinger(Number(key) - 1);
    }

    if (key === 't') {
        setFingerBend(fingers[selectedFinger], fingers[selectedFinger].bend + bendStep);
    }

    if (key === 'g') {
        setFingerBend(fingers[selectedFinger], fingers[selectedFinger].bend - bendStep);
    }

    if (key === 'r') {
        for (const finger of fingers) {
            setFingerBend(finger, finger.bend + bendStep);
        }
    }

    if (key === 'f') {
        for (const finger of fingers) {
            setFingerBend(finger, finger.bend - bendStep);
        }
    }

});

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(
        scene,
        camera
    );
}

animate();