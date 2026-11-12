import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xe8ecef);


const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

camera.position.set(3.2, 2.3, 3.8);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.getElementById('scene').appendChild(renderer.domElement);


const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-0.3, 0.9, -0.5);
controls.maxPolarAngle = Math.PI / 2;
controls.minAzimuthAngle = -0.2;
controls.maxAzimuthAngle = Math.PI / 2 + 0.2;
controls.maxDistance = 8;
controls.update();


const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8d7c6a, 1.2);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff4e0, 2.5);
sunLight.position.set(-6, 5, -1);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.left = -5;
sunLight.shadow.camera.right = 5;
sunLight.shadow.camera.top = 5;
sunLight.shadow.camera.bottom = -5;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

const deskLight = new THREE.PointLight(0xffffff, 4, 6);
deskLight.position.set(0, 2.1, 0);
scene.add(deskLight);


function canvasTexture(width, height, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    draw(ctx, width, height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}


const textureLoader = new THREE.TextureLoader();

function floorTexture(file) {
    const t = textureLoader.load('textures/' + file);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    return t;
}

const floorColor = floorTexture('floor_diff.jpg');
floorColor.colorSpace = THREE.SRGBColorSpace;

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 6),
    new THREE.MeshStandardMaterial({
        map: floorColor,
        normalMap: floorTexture('floor_nor.jpg'),
        roughnessMap: floorTexture('floor_rough.jpg'),
    })
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

const backWall = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 3),
    new THREE.MeshStandardMaterial({ color: 0x37474f })
);
backWall.position.set(0, 1.5, -3);
backWall.receiveShadow = true;
scene.add(backWall);

const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(6, 3),
    new THREE.MeshStandardMaterial({ color: 0xf2f4f5 })
);
leftWall.position.set(-3, 1.5, 0);
leftWall.rotation.y = Math.PI / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

const skirtingMaterial = new THREE.MeshStandardMaterial({ color: 0x263238 });

const skirtingBack = new THREE.Mesh(new THREE.BoxGeometry(6, 0.1, 0.02), skirtingMaterial);
skirtingBack.position.set(0, 0.05, -2.99);
scene.add(skirtingBack);

const skirtingLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.1, 6), skirtingMaterial);
skirtingLeft.position.set(-2.99, 0.05, 0);
scene.add(skirtingLeft);

const rug = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 2.8),
    new THREE.MeshStandardMaterial({ color: 0x455a64 })
);
rug.rotation.x = -Math.PI / 2;
rug.position.y = 0.005;
rug.receiveShadow = true;
scene.add(rug);


const logoTexture = canvasTexture(1024, 256, function (ctx, w, h) {
    ctx.fillStyle = '#26a69a';
    ctx.beginPath();
    ctx.arc(110, 128, 80, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 90px sans-serif';
    ctx.fillText('</>', 42, 158);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 110px sans-serif';
    ctx.fillText('NEXUS IT', 230, 140);
    ctx.fillStyle = '#b0bec5';
    ctx.font = '40px sans-serif';
    ctx.fillText('SOFTWARE & CLOUD SOLUTIONS', 235, 210);
});

const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 0.5),
    new THREE.MeshBasicMaterial({ map: logoTexture, transparent: true })
);
logo.position.set(0.4, 2.5, -2.98);
scene.add(logo);


const dashboardTexture = canvasTexture(1024, 576, function (ctx, w, h) {
    ctx.fillStyle = '#101820';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('Server Status', 40, 65);
    ctx.fillStyle = '#4caf50';
    ctx.fillText('● ONLINE', 760, 65);

    const stats = [['CPU', '42%'], ['RAM', '68%'], ['Users', '1,284']];
    for (let i = 0; i < stats.length; i++) {
        const x = 40 + i * 320;
        ctx.fillStyle = '#1e2a36';
        ctx.fillRect(x, 100, 290, 120);
        ctx.fillStyle = '#90a4ae';
        ctx.font = '30px sans-serif';
        ctx.fillText(stats[i][0], x + 20, 145);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 52px sans-serif';
        ctx.fillText(stats[i][1], x + 20, 200);
    }

    ctx.fillStyle = '#1e2a36';
    ctx.fillRect(40, 250, 944, 290);
    for (let i = 0; i < 16; i++) {
        const barHeight = 60 + Math.random() * 180;
        ctx.fillStyle = i % 2 === 0 ? '#26a69a' : '#42a5f5';
        ctx.fillRect(70 + i * 57, 520 - barHeight, 38, barHeight);
    }
});

const tv = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 0.86, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x111111 })
);
tv.position.set(0.4, 1.55, -2.97);
scene.add(tv);

const tvScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.44, 0.81),
    new THREE.MeshBasicMaterial({ map: dashboardTexture })
);
tvScreen.position.set(0.4, 1.55, -2.944);
scene.add(tvScreen);


const whiteboardTexture = canvasTexture(1024, 512, function (ctx, w, h) {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#1565c0';
    ctx.font = 'bold 44px sans-serif';
    ctx.fillText('Sprint 12 - Architecture', 40, 70);

    const boxes = ['Client', 'API', 'Database'];
    ctx.lineWidth = 6;
    ctx.font = '38px sans-serif';
    for (let i = 0; i < boxes.length; i++) {
        const x = 60 + i * 330;
        ctx.strokeStyle = '#1565c0';
        ctx.strokeRect(x, 180, 240, 110);
        ctx.fillStyle = '#212121';
        ctx.fillText(boxes[i], x + 40, 248);

        if (i < boxes.length - 1) {
            ctx.strokeStyle = '#c62828';
            ctx.beginPath();
            ctx.moveTo(x + 250, 235);
            ctx.lineTo(x + 320, 235);
            ctx.lineTo(x + 300, 220);
            ctx.moveTo(x + 320, 235);
            ctx.lineTo(x + 300, 250);
            ctx.stroke();
        }
    }

    ctx.fillStyle = '#2e7d32';
    ctx.font = '34px sans-serif';
    ctx.fillText('✔ login page     ✔ REST API     ☐ deploy to cloud', 60, 400);
});

const whiteboardFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 1.1, 2.1),
    new THREE.MeshStandardMaterial({ color: 0xb0b0b0, metalness: 0.6, roughness: 0.4 })
);
whiteboardFrame.position.set(-2.98, 1.5, 1.3);
scene.add(whiteboardFrame);

const whiteboard = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 1),
    new THREE.MeshStandardMaterial({ map: whiteboardTexture, roughness: 0.3 })
);
whiteboard.position.set(-2.955, 1.5, 1.3);
whiteboard.rotation.y = Math.PI / 2;
scene.add(whiteboard);


const windowFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.05, 1.5, 1.9),
    new THREE.MeshStandardMaterial({ color: 0x263238 })
);
windowFrame.position.set(-2.98, 1.6, -1.3);
scene.add(windowFrame);

const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.8, 1.4),
    new THREE.MeshBasicMaterial({ color: 0xbfe3f7 })
);
glass.position.set(-2.95, 1.6, -1.3);
glass.rotation.y = Math.PI / 2;
scene.add(glass);

const slatMaterial = new THREE.MeshStandardMaterial({ color: 0xeeeeee });
for (let i = 0; i < 12; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.006, 1.78), slatMaterial);
    slat.position.set(-2.92, 2.28 - i * 0.05, -1.3);
    slat.rotation.z = 0.5;
    slat.castShadow = true;
    scene.add(slat);
}


const leds = [];

function createServerRack(x, z) {
    const rack = new THREE.Group();

    const body = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x1b1f24, metalness: 0.5, roughness: 0.5 })
    );
    body.position.y = 1;
    body.castShadow = true;
    rack.add(body);

    for (let i = 0; i < 14; i++) {
        const y = 0.25 + i * 0.12;

        const server = new THREE.Mesh(
            new THREE.BoxGeometry(0.52, 0.09, 0.01),
            new THREE.MeshStandardMaterial({ color: 0x2f3640 })
        );
        server.position.set(0, y, 0.405);
        rack.add(server);

        for (let j = 0; j < 3; j++) {
            const led = new THREE.Mesh(
                new THREE.BoxGeometry(0.02, 0.02, 0.01),
                new THREE.MeshBasicMaterial({ color: 0x00e676 })
            );
            led.position.set(0.15 + j * 0.035, y, 0.412);
            rack.add(led);
            leds.push(led);
        }
    }

    rack.position.set(x, 0, z);
    scene.add(rack);
}

createServerRack(-2.6, -2.55);
createServerRack(-1.95, -2.55);


const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.05, 0.15),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 })
);
lamp.position.set(0, 2.3, 0);
scene.add(lamp);

const cableMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
for (const x of [-0.7, 0.7]) {
    const cable = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.7), cableMaterial);
    cable.position.set(x, 2.65, 0);
    scene.add(cable);
}


const DESK_HEIGHT = 0.79;

function codeScreenTexture() {
    return canvasTexture(512, 300, function (ctx, w, h) {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, w, h);

        const colors = ['#569cd6', '#9cdcfe', '#ce9178', '#6a9955', '#dcdcaa', '#c586c0'];
        let indent = 0;
        for (let i = 0; i < 16; i++) {
            ctx.fillStyle = '#5a5a5a';
            ctx.fillRect(10, 14 + i * 17, 14, 8);

            let x = 40 + indent * 20;
            const words = 1 + Math.floor(Math.random() * 4);
            for (let k = 0; k < words; k++) {
                const width = 20 + Math.random() * 70;
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
                ctx.fillRect(x, 14 + i * 17, width, 8);
                x += width + 10;
            }
            indent = Math.max(0, Math.min(3, indent + Math.floor(Math.random() * 3) - 1));
        }
    });
}

function createWorkstation(x, z, rotation) {
    const station = new THREE.Group();
    const black = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.5 });

    const base = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.015, 0.16), black);
    base.position.y = 0.008;
    station.add(base);

    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.3, 0.03), black);
    neck.position.set(0, 0.16, -0.04);
    station.add(neck);

    const monitor = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.36, 0.03), black);
    monitor.position.set(0, 0.38, -0.02);
    monitor.castShadow = true;
    station.add(monitor);

    const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(0.57, 0.33),
        new THREE.MeshBasicMaterial({ map: codeScreenTexture() })
    );
    screen.position.set(0, 0.38, -0.004);
    station.add(screen);

    const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.02, 0.14),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    keyboard.position.set(0, 0.01, 0.26);
    keyboard.castShadow = true;
    station.add(keyboard);

    const mouse = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.025, 0.1),
        new THREE.MeshStandardMaterial({ color: 0x333333 })
    );
    mouse.position.set(0.3, 0.012, 0.26);
    station.add(mouse);

    station.position.set(x, DESK_HEIGHT, z);
    station.rotation.y = rotation;
    scene.add(station);
}

createWorkstation(-0.5,  0.1, 0);
createWorkstation( 0.5,  0.1, 0);
createWorkstation(-0.5, -0.1, Math.PI);
createWorkstation( 0.5, -0.1, Math.PI);

const divider = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.4, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xcfd8dc, transparent: true, opacity: 0.6 })
);
divider.position.set(-0.1, DESK_HEIGHT + 0.2, 0);
scene.add(divider);


const loader = new GLTFLoader();

function addShadows(model) {
    model.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
}


loader.load('models/metal_office_desk/metal_office_desk_1k.gltf', function (gltf) {
    const table = gltf.scene;
    addShadows(table);
    table.position.set(0, 0, 0);
    scene.add(table);
});


const chairs = [
    { x: -0.5, z: -1.0, rotation: 0,       scale: 0.85 },
    { x:  0.5, z: -1.0, rotation: 0,       scale: 0.85 },
    { x: -0.5, z:  1.0, rotation: Math.PI, scale: 0.85 },
    { x:  0.5, z:  1.0, rotation: Math.PI, scale: 0.85 },
];

loader.load('models/modern_arm_chair_01/modern_arm_chair_01_1k.gltf', function (gltf) {
    const chairModel = gltf.scene;
    addShadows(chairModel);

    for (let i = 0; i < chairs.length; i++) {
        const chair = chairModel.clone();

        chair.scale.set(chairs[i].scale, chairs[i].scale, chairs[i].scale);
        chair.position.set(chairs[i].x, 0, chairs[i].z);
        chair.rotation.y = chairs[i].rotation;

        scene.add(chair);
    }
});


loader.load('models/potted_plant_04/potted_plant_04_1k.gltf', function (gltf) {
    const plant = gltf.scene;
    addShadows(plant);
    plant.scale.set(1.2, 1.2, 1.2);
    plant.position.set(0.85, DESK_HEIGHT, 0);
    scene.add(plant);
});


loader.load('models/potted_plant_01/potted_plant_01_1k.gltf', function (gltf) {
    const plant = gltf.scene;
    addShadows(plant);
    plant.position.set(2.5, 0, -2.5);
    scene.add(plant);
});


loader.load('models/wall_clock/wall_clock_1k.gltf', function (gltf) {
    const clock = gltf.scene;
    clock.position.set(-2.97, 2.45, 1.3);
    clock.rotation.y = Math.PI / 2;
    scene.add(clock);
});


window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});


function animate() {
    requestAnimationFrame(animate);

    for (let i = 0; i < leds.length; i++) {
        if (Math.random() < 0.02) {
            leds[i].visible = !leds[i].visible;
        }
    }

    renderer.render(scene, camera);
}

animate();
