import * as THREE from "./libs/three.module.js";

const make_wave = (freq, amp = 1, phase = 0) => {
  const points = [];
  const max_points = 20;
  points.push(new THREE.Vector3(0, 0, 0));
  for (let i = 0; i < max_points + 1; i++) {
    points.push(
      new THREE.Vector3(
        i * (1 / max_points / freq),
        Math.sin((i / max_points) * Math.PI * 2) * (amp / 2),
        0
      )
    );
  }
  points.push(new THREE.Vector3(0, 0, 0));
  var geometry = new THREE.BufferGeometry().setFromPoints(points);
  geometry.setDrawRange(0, max_points + 2);
  // CREATE THE LINE
  var line = new THREE.Line(
    geometry,
    new THREE.MeshBasicMaterial({
      color: 0xff00ff
    })
  );
  return line;
};

export default make_wave;
