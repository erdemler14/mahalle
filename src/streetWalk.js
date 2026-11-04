import * as THREE from 'three';

// Ground-level first-person navigation for the existing compact Beyoğlu scene.
// No pointer lock, no global game-state mutations, and no physics dependency.
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const bound = 35;
const eyeHeight = 1.28;
const pedestrianRadius = 0.29;
const walkSpeed = 2.9;
const sprintSpeed = 4.6;
const widthFor = property => Number(property.width) ||
  ([4, 10, 21, 24, 27, 40].includes(property.id) ? 2.75 : [9, 25, 31, 39].includes(property.id) ? 2.45 : 2.05);
const depthFor = property => Number(property.depth) ||
  ([2, 8, 21, 24, 27].includes(property.id) ? 2.35 : 1.9);

export function createStreetWalker(camera, properties) {
  const position = new THREE.Vector3(2.5, eyeHeight, -0.5);
  const velocity = new THREE.Vector3();
  const inputs = new Set();
  const colliders = properties.map(p => ({
    x: p.x, z: p.z,
    // Building depth and width exchange axes when the default facade is rotated 90°.
    radiusX: depthFor(p) / 2 + pedestrianRadius,
    radiusZ: widthFor(p) / 2 + pedestrianRadius
  }));
  let active = false;
  let yaw = 0;
  let yawTarget = 0;
  let pitch = 0;
  let pitchTarget = 0;
  let walkingElapsed = 0;
  const forward = new THREE.Vector3();
  const looking = new THREE.Vector3();

  function isFree(x, z) {
    if (!Number.isFinite(x) || !Number.isFinite(z) || Math.abs(x) > bound || Math.abs(z) > bound) return false;
    return !colliders.some(c => Math.abs(c.x - x) < c.radiusX && Math.abs(c.z - z) < c.radiusZ);
  }

  function begin(selected) {
    if (!active) {
      const x = Number(selected?.x) || 0;
      const z = Number(selected?.z) || 0;
      const side = x >= 0 ? 1 : -1;
      const frontage = depthFor(selected || {}) / 2;
      const destinations = [
        [x - side * (frontage + 1.85), z],
        [x - side * (frontage + 2.75), z],
        [x - side * (frontage + 2.75), z + 1.4],
        [x - side * (frontage + 2.75), z - 1.4],
        [side * 3.4, z],
        [side * 3.4, 0],
        [2.5, 0],
        [0, -3]
      ];
      const [spawnX, spawnZ] = destinations.find(([px,pz])=>isFree(px,pz)) || [2.5, -0.5];
      position.set(spawnX, eyeHeight, spawnZ);
      yaw = yawTarget = (z > 0 ? 0 : Math.PI) + (x >= 0 ? (z > 0 ? -0.22 : 0.22) : (z > 0 ? 0.22 : -0.22));
      pitch = pitchTarget = 0.055;
    }
    active = true;
    velocity.set(0, 0, 0);
    inputs.clear();
  }

  function end() {
    active = false;
    velocity.set(0, 0, 0);
    inputs.clear();
  }

  function rotate(dx, dy, sensitivity = 0.0049) {
    yawTarget += dx * sensitivity;
    pitchTarget = clamp(pitchTarget - dy * sensitivity * 0.80, -1.07, 1.04);
  }

  function setInput(key, pressed) {
    if (pressed) inputs.add(key);
    else inputs.delete(key);
  }

  function clearInputs() { inputs.clear(); }

  function update(dt) {
    if (!active) return false;
    const delta = Math.min(0.05, Math.max(0, dt));
    const ease = 1 - Math.exp(-delta * 13);
    // Keep accumulated yaw continuous so rotating through 360° never snaps backwards.
    yaw += (yawTarget - yaw) * ease;
    pitch += (pitchTarget - pitch) * ease;

    const forwardPressed = inputs.has('forward') || inputs.has('w') || inputs.has('arrowup');
    const backwardPressed = inputs.has('back') || inputs.has('s') || inputs.has('arrowdown');
    const strafeLeft = inputs.has('left') || inputs.has('a') || inputs.has('arrowleft');
    const strafeRight = inputs.has('right') || inputs.has('d') || inputs.has('arrowright');

    const vertical = Number(forwardPressed) - Number(backwardPressed);
    const horizontal = Number(strafeRight) - Number(strafeLeft);
    const inputLength = Math.hypot(vertical, horizontal) || 1;
    const speed = inputs.has('shift') ? sprintSpeed : walkSpeed;
    const fx = Math.sin(yaw);
    const fz = -Math.cos(yaw);
    // A positive strafe is camera-right: (cos(yaw),sin(yaw)).
    const wantedX = ((fx * vertical + Math.cos(yaw) * horizontal) / inputLength) * speed;
    const wantedZ = ((fz * vertical + Math.sin(yaw) * horizontal) / inputLength) * speed;
    velocity.x += (wantedX - velocity.x) * (1 - Math.exp(-delta * 11));
    velocity.z += (wantedZ - velocity.z) * (1 - Math.exp(-delta * 11));

    // Resolve axes separately so the player slides alongside walls instead of entering geometry.
    const nextX = position.x + velocity.x * delta;
    if (isFree(nextX, position.z)) position.x = nextX;
    else velocity.x = 0;
    const nextZ = position.z + velocity.z * delta;
    if (isFree(position.x, nextZ)) position.z = nextZ;
    else velocity.z = 0;

    const moving = Math.hypot(velocity.x, velocity.z);
    walkingElapsed += delta * Math.max(0.05, moving);
    const bob = moving > 0.2 ? Math.sin(walkingElapsed * 7) * 0.018 * Math.min(1, moving / walkSpeed) : 0;
    camera.position.set(position.x, eyeHeight + bob, position.z);
    looking.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
    forward.copy(looking);
    camera.lookAt(camera.position.clone().add(looking));
    return true;
  }

  function centerHit(buildingMeshes) {
    const ray = new THREE.Raycaster();
    ray.setFromCamera(new THREE.Vector2(0, 0), camera);
    ray.far = 11;
    const hits = ray.intersectObjects(buildingMeshes, true);
    for (const hit of hits) {
      let obj = hit.object;
      while (obj && obj.userData.propertyId == null) obj = obj.parent;
      if (obj?.userData.propertyId != null) {
        return properties.find(p => p.id === obj.userData.propertyId) || null;
      }
    }
    return null;
  }

  return {
    begin, end, update, rotate, setInput, clearInputs, centerHit,
    get active() { return active; },
    get position() { return position; },
    get yaw() { return yaw; },
    get forward() { return forward; }
  };
}
