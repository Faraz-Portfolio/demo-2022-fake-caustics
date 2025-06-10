import * as THREE from "three";

export class NormalMaterial extends THREE.ShaderMaterial {
  constructor() {
    super({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() },
      },
      vertexShader: /* glsl */ `
        varying vec3 vWorldNormal;
        void main() {
            vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
      fragmentShader: /* glsl */ `
        varying vec3 vWorldNormal;
        void main() {
            gl_FragColor = vec4(vWorldNormal, 1.0);
        }
        `,
    });
  }
}
