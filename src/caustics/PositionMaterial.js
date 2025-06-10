import * as THREE from "three";

export class PositionMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
            vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
      fragmentShader: /* glsl */ `
        varying vec3 vWorldPosition;
        void main() {
            gl_FragColor = vec4(vWorldPosition, 1.0);
        }
        `,
    });
  }
}
