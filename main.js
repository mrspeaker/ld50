import * as THREE from "./libs/three.module.js";
import World from "./World.js";

const { PerspectiveCamera, Scene, WebGLRenderer } = THREE;

const camera_p = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 14;
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2,
  (frustumSize * aspect) / 2,
  frustumSize / 2 - 2,
  frustumSize / -2 - 2.01,
  1,
  20
);

const renderer = new WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0x000, 1);
const scene = new Scene();

const light_amb = new THREE.AmbientLight(0x707070);
scene.add(light_amb);

const light = new THREE.PointLight(0xffffff, 4, 10);
light.position.set(0, 10, 4);
light.castShadow = false;
scene.add(light);
const light2 = new THREE.PointLight(0xffffff, 2, 10);
light2.position.set(3, 0, 3);
scene.add(light2);

camera.position.z = 10;
camera.position.y = 2;
let clock = new THREE.Clock();
let time = 0;

function animate(world) {
  requestAnimationFrame(() => animate(world));
  renderer.render(scene, camera);

  var delta = clock.getDelta();
  time += delta;
  world.update(delta, time, scene);
}

async function main() {
  const world = new World(scene);
  await world.init();
  animate(world);
}

main();
