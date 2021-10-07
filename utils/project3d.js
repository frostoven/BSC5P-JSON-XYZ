// Turns right ascension / declination / distance into x,y,z coordinates.

// This library never fails to amaze me. 3D graphics library, but can be run
// headlessly in a no-graphics env as a number cruncher to do quaternion math.
import * as THREE from 'three';

const geometry = new THREE.BufferGeometry();
const mesh = new THREE.Mesh(geometry, null);
const direction = new THREE.Vector3();

// Calculates the 3-dimensional position of a star according to specified
// RA/Dec/distance based on a center, where the center is expected to be the
// ecliptic. Unit of distance is parsecs.
export default function project3d({ rightAscension, declination, distance }) {
  // Reset position.
  mesh.position.x = 0;
  mesh.position.y = 0;
  mesh.position.z = 0;

  // Reset rotation.
  mesh.rotation.x = 0;
  mesh.rotation.y = 0;
  mesh.rotation.z = 0;

  // Apply RA and Dec.
  mesh.rotation.x = rightAscension;
  mesh.rotateY(declination);

  // Move (project) object towards the RA/Dec point for the specified distance.
  mesh.getWorldDirection(direction);
  mesh.position.addScaledVector(direction, distance);

  return {
    x: mesh.position.x,
    y: mesh.position.y,
    z: mesh.position.z,
  };
}
