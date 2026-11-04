import * as THREE from 'three';

// Architectural kit built for the compact 1920s Pera diorama.
// Every building retains its original interactive parent and property ID.
const detailsByType = {
  Konut: 'residence',
  Ticaret: 'shop',
  İşletme: 'shop',
  Atölye: 'workshop',
  Depo: 'warehouse',
};
const colorRamp = ['#715349', '#5a6361', '#806351', '#626650', '#786454'];
const random = x => {
  const n = Math.sin(x * 91.77 + 0.31) * 45242.19;
  return n - Math.floor(n);
};

function tiledRoofTexture(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f0e6d2';
  ctx.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 16; row++) {
    for (let col = -1; col < 17; col++) {
      const x = col * 17 + (row % 2) * 8.5;
      const y = row * 16;
      const light = Math.round(198 + random(row * 17 + col) * 44);
      ctx.fillStyle = 'rgb(' + light + ',' + Math.round(light * 0.84) + ',' + Math.round(light * 0.74) + ')';
      ctx.fillRect(x + 1, y + 1, 15.5, 14);
      ctx.strokeStyle = 'rgba(70,49,38,.23)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 1, y + 15);
      ctx.lineTo(x + 16, y + 15);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(1.4, 1.3);
  tex.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
  return tex;
}

function box(parent, mat, size, position) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), mat);
  mesh.position.set(...position);
  mesh.castShadow = false;
  parent.add(mesh);
  return mesh;
}

function instancedTrim(group, material, parts) {
  if (!parts.length) return;
  const mesh = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), material, parts.length);
  const transform = new THREE.Object3D();
  parts.forEach(([x, y, z, w, h, d], index) => {
    transform.position.set(x, y, z);
    transform.scale.set(w, h, d);
    transform.rotation.set(0, 0, 0);
    transform.updateMatrix();
    mesh.setMatrixAt(index, transform.matrix);
  });
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = false;
  mesh.receiveShadow = false;
  mesh.computeBoundingSphere();
  group.add(mesh);
  return mesh;
}

export function createArchitectureKit(renderer, { mobile = false } = {}) {
  const tileMap = tiledRoofTexture(renderer);
  const stone = new THREE.MeshStandardMaterial({ color: '#e0cdb0', roughness: 0.93 });
  const agedStone = new THREE.MeshStandardMaterial({ color: '#a79b8a', roughness: 1 });
  const limestone = new THREE.MeshStandardMaterial({ color: '#d0bca3', roughness: 0.92 });
  const wood = new THREE.MeshStandardMaterial({ color: '#655043', roughness: 0.93 });
  const roofMaterials = colorRamp.map(color => new THREE.MeshStandardMaterial({
    color, map: tileMap, roughness: 0.92, metalness: 0
  }));
  const slateRoof = new THREE.MeshStandardMaterial({ color: '#625f57', map: tileMap, roughness: 0.95 });
  const glass = new THREE.MeshStandardMaterial({ color: '#506d70', roughness: 0.35, metalness: 0.12 });
  const iron = new THREE.MeshStandardMaterial({ color: '#424b48', roughness: 0.68, metalness: 0.32 });
  const brass = new THREE.MeshStandardMaterial({ color: '#a58b5d', roughness: 0.53, metalness: 0.38 });
  const cloth = [
    new THREE.MeshStandardMaterial({ color: '#766b58', roughness: 0.99, side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ color: '#7a574e', roughness: 0.99, side: THREE.DoubleSide }),
    new THREE.MeshStandardMaterial({ color: '#5f7572', roughness: 0.99, side: THREE.DoubleSide })
  ];

  const decorate = ({ group, property, width, depth, height, floorHeight, index }) => {
    const id = property.id;
    const kind = detailsByType[property.type] || 'residence';
    const front = depth / 2;
    const grand = property.floors >= 4 || [4, 8, 10, 21, 24, 27].includes(id);
    const timberHouse = [6, 11, 22, 30].includes(id);
    const floors = Math.max(1, Math.round(height / floorHeight));
    const doorX = kind === 'shop' ? width * 0.31 : 0;
    const roofKind = !timberHouse && floors >= 2
      ? (grand && id % 3 !== 0 ? 'mansard' : id % 6 === 2 || kind === 'warehouse' ? 'gable' : 'flat')
      : 'flat';

    // Mansard and gable roofs are solid roof volumes, not shallow decorative triangles.
    if (roofKind !== 'flat') {
      const roofRise = roofKind === 'mansard' ? 0.86 : 0.62;
      const shape = new THREE.Shape();
      if (roofKind === 'mansard') {
        shape.moveTo(-width * 0.54, 0);
        shape.lineTo(-width * 0.42, 0.62);
        shape.lineTo(-width * 0.32, roofRise);
        shape.lineTo(width * 0.32, roofRise);
        shape.lineTo(width * 0.42, 0.62);
        shape.lineTo(width * 0.54, 0);
      } else {
        shape.moveTo(-width * 0.55, 0);
        shape.lineTo(0, roofRise);
        shape.lineTo(width * 0.55, 0);
      }
      shape.closePath();
      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: depth + 0.18,
        steps: 1,
        bevelEnabled: false,
        curveSegments: 4
      });
      const rooftop = new THREE.Mesh(geo, kind === 'warehouse' ? slateRoof : roofMaterials[id % roofMaterials.length]);
      rooftop.position.set(0, height + 0.08, -(depth + 0.18) / 2);
      rooftop.castShadow = !mobile;
      rooftop.receiveShadow = true;
      group.add(rooftop);

      // Dormers make upper rooflines readable at both street and isometric distances.
      if (roofKind === 'mansard' && !mobile) {
        const dormerCount = width > 2.3 ? 2 : 1;
        for (let k = 0; k < dormerCount; k++) {
          const dx = (k - (dormerCount - 1) / 2) * 0.83;
          box(group, wood, [0.36, 0.31, 0.10], [dx, height + 0.40, front + 0.14]);
          box(group, glass, [0.25, 0.22, 0.035], [dx, height + 0.41, front + 0.20]);
          box(group, limestone, [0.48, 0.055, 0.18], [dx, height + 0.60, front + 0.16]);
          box(group, limestone, [0.42, 0.055, 0.16], [dx, height + 0.22, front + 0.18]);
        }
      }
    }

    // Rhythm of cornice corbels breaks up the box silhouette, using one instanced draw call.
    const upperBrackets = [];
    const bracketCount = mobile ? 4 : grand ? 9 : 6;
    for (let i = 0; i < bracketCount; i++) {
      upperBrackets.push([
        -width * 0.44 + (width * 0.88 * i / Math.max(1, bracketCount - 1)),
        height - 0.16, front + 0.12, 0.075, 0.15, 0.20
      ]);
    }
    instancedTrim(group, grand ? limestone : agedStone, upperBrackets);

    // Distinctive sandstone lintels, rounded arches, and iron transoms on landmark houses.
    if (grand) {
      const columns = 3;
      const windows = [];
      for (let floor = 1; floor < Math.min(floors, mobile ? 2 : 4); floor++) {
        for (let col = 0; col < columns; col++) {
          const x = (col - 1) * 0.67;
          const y = 0.48 + floor * floorHeight;
          const standout = id % 2 === 0 || floor === 1;
          windows.push([x, y + 0.305, front + 0.10, 0.46, 0.05, 0.13]);
          if (standout && !mobile && (floor + col) % 2 === 0) {
            const arch = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.026, 4, 14, Math.PI), stone);
            arch.position.set(x, y + 0.28, front + 0.11);
            group.add(arch);
            box(group, limestone, [0.09, 0.11, 0.09], [x, y + 0.48, front + 0.13]);
          }
        }
      }
      instancedTrim(group, limestone, windows);
    } else if (kind === 'workshop' || kind === 'warehouse') {
      const braces = [];
      for (const side of [-1, 1]) {
        braces.push([side * (width * 0.35), 0.42, front + 0.12, 0.085, 0.78, 0.10]);
        braces.push([side * (width * 0.35), 0.84, front + 0.12, 0.16, 0.055, 0.13]);
      }
      instancedTrim(group, wood, braces);
    }

    // Shopfront identity: recessed doorway, patterned grille, hand-painted awning edge.
    if ((kind === 'shop' || kind === 'workshop') && id % 3 !== 0) {
      const doorway = [];
      doorway.push([doorX - 0.23, 0.45, front + 0.15, 0.08, 0.81, 0.08]);
      doorway.push([doorX + 0.23, 0.45, front + 0.15, 0.08, 0.81, 0.08]);
      doorway.push([doorX, 0.88, front + 0.15, 0.52, 0.10, 0.11]);
      if (!mobile) {
        doorway.push([doorX, 0.73, front + 0.16, 0.42, 0.025, 0.045]);
        doorway.push([doorX, 0.52, front + 0.16, 0.42, 0.025, 0.045]);
      }
      instancedTrim(group, wood, doorway);
      if (id % 4 === 1 && !mobile) {
        const hanging = box(group, brass, [0.28, 0.03, 0.07], [width * 0.3, 1.12, front + 0.31]);
        const plaque = box(group, iron, [0.37, 0.31, 0.045], [width * 0.3, 0.93, front + 0.35]);
        plaque.rotation.z = Math.sin(id) * 0.04;
      }
      if (id % 4 === 2) {
        // Canvas valance at the storefront edge (not a full duplicate awning).
        const fabric = cloth[id % cloth.length];
        const valancePieces = [];
        for (let i = 0; i < 7; i++) {
          valancePieces.push([
            -width * 0.39 + i * width * 0.13,
            0.85 + (i % 2) * 0.025,
            front + 0.59,
            width * 0.13, 0.15, 0.026
          ]);
        }
        instancedTrim(group, fabric, valancePieces);
      }
    }

    if (timberHouse) {
      // Visible wooden façade framing with diagonals between storeys.
      const timber = [];
      for (const side of [-1, 1]) {
        timber.push([side * width * 0.45, height * 0.48, front + 0.12, 0.09, height * 0.89, 0.08]);
      }
      for (let f = 1; f < floors; f++) {
        timber.push([0, f * floorHeight, front + 0.12, width * 0.91, 0.085, 0.09]);
      }
      instancedTrim(group, wood, timber);
      if (!mobile) {
        for (const side of [-1, 1]) {
          const diag = box(group, wood, [0.075, 0.65, 0.075],
            [side * width * 0.31, height * 0.73, front + 0.14]);
          diag.rotation.z = side * -0.32;
        }
      }
    }

    // Copper roof details and vertical rainwater outlets make the silhouettes asymmetric.
    if (!mobile && id % 8 === 1) {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.038, 0.73, 8), iron);
      pipe.position.set(-width * 0.27, height + (roofKind === 'flat' ? 0.40 : 0.95), -depth * 0.15);
      group.add(pipe);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.07, 0.06, 8), stone);
      cap.position.set(pipe.position.x, pipe.position.y + 0.39, pipe.position.z);
      group.add(cap);
    }

    // Windows retain their existing building selection parent; no extra picking layer.
  };

  return { decorate };
}
