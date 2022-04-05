import * as THREE from "./libs/three.module.js";
import * as Loaders from "./libs/GLTFLoader.js";

import make_wave from "./make_wave.js";

const { GLTFLoader } = Loaders;
const loader = new GLTFLoader();

class World {
  constructor(scene) {
    this.scene = scene;
    this.mixer = null;
    this.models = { cubes: [], other:{} };
    this.times = {};
  }

  async init() {
    const { scene, models, times } = this;
    const modelData = await loadModels();

    times.moon = 0;

    // Add them to models
    Object.entries(modelData).reduce((ac, el) => {
      models[el[0]] = el[1];
      return ac;
    }, models);

    const size = 14;
    const divisions = 14;

    const gridHelper = new THREE.GridHelper(
      size,
      divisions,
      0x282828,
      0x333333
    );
    gridHelper.rotation.x = Math.PI / 2;
    scene.add(gridHelper);

    // Set positions
    const { man, tree, moon, cube, compy, dish } = models;
    man.model.position.set(-0.5, 0, 0);
    man.model.rotation.z = (Math.PI / 180) * -25;
    tree.model.position.set(-2, 0, 0);

    scene.add(man.model);
    scene.add(tree.model);

    moon.model.position.set(2, -1.5, 0);
    moon.model.scale.set(0.75,0.75,0.75);
    scene.add(moon.model);

    dish.model.position.set(-4, 3, 0);
    dish.model.rotation.y = -Math.PI / 2;      

    scene.add(dish.model);


    cube.model.position.set(0.5, 0.5, -0.5);
    scene.add(cube.model);

    const c2 = cube.model.clone();
    c2.position.set(-3.5, -1.5, -0.5);
    models.other.c2 = c2;
    scene.add(c2);

    compy.model.position.set(2.5, 3, 0);
    scene.add(compy.model);


    // Anims
    const mixer = new THREE.AnimationMixer(man.model);
    console.log(man.animations[0]);
    mixer.clipAction(man.animations[0]).play();
    this.mixer = mixer;

    const line1 = make_wave(1);
    const line2 = make_wave(1);
    const line3 = make_wave(0.5);
    line1.position.y += 1;
    line2.position.y += 1;
    line3.position.y += 1;
    line2.position.x = 1;
    line3.position.x = 2;
    scene.add(line1);
    scene.add(line2);
    scene.add(line3);
    models.lines = [line1, line2, line3];
  }

  spawn(x, y) {
    const { scene, models } = this;
    const c = models.moon.model.clone();
    c.scale.set(0.2, 0.2, 0.2);
    c.position.set(x * 11.5, -y * 7, models.moon.model.position.z);
    models.cubes.push(c);
    scene.add(c);

  }

  update(dt, time, scene) {
    const { mixer, models, times } = this;

    if (time > times.moon) {
      times.moon += 4.5;
      if (times.moom < time) times.moon = time + 4.5;
      // spawn.
      const c = models.moon.model.clone();
      c.scale.set(0.2, 0.2, 0.2);
      c.position.copy(models.dish.model.position);
      c.position.x += 1.5;
      models.cubes.push(c);
      scene.add(c);
    }

    //    models.tree.model.rotation.y += dt * -0.2;

    mixer.update(dt);
    models.moon.model.rotation.y += 1 * dt;
    models.cube.model.rotation.x += 0.5 * dt;
    models.man.model.rotation.z += 1 * dt;
    models.lines.forEach(l => {
      l.position.x -= 0.5 * dt;
      if (l.position.x < -3) {
        l.position.x += 4;
      }
    });

    models.compy.model.rotation.y += -0.3 * dt;
    models.dish.model.rotation.y += 1.4 * dt;

    models.cubes.forEach((c, i) => {
      c.position.x += 0.5 * dt;
      c.rotation.x += 1 * dt;
      if (c.position.x > 5) {
        scene.remove(c);
        models.cubes = models.cubes.filter(cu => cu != c);
      }
    });

    models.other.c2.rotation.z -= Math.abs(Math.sin(time) * 0.4 * dt);
  }
}

async function loadModels() {
  const [man, tub, tree, moon, cube, compy, dish] = (await Promise.all([
    loader.loadAsync("res/walk.glb"),
    loader.loadAsync("res/cubel.glb"),
    loader.loadAsync("res/tree.glb"),
    loader.loadAsync("res/moon.glb"),
    loader.loadAsync("res/cube.glb"),
    loader.loadAsync("res/compy.glb"),
    loader.loadAsync("res/dish.glb")
  ])).map(setupModel);
  return { man, tub, tree, moon, cube, compy, dish };
}

function setupModel(data) {
  const model = data.scene.children[0];
  const animations = data.animations;
  return { model, animations };
}

export default World;
