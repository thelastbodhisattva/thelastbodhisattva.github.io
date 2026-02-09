// Orbital particle field fragment shader
// Creates a dynamic star field with nebula effects that react to mouse and scroll

precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform vec2 uResolution;

varying vec2 vUv;

// Noise functions for organic movement
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  
  return value;
}

// Star field generation
float stars(vec2 uv, float density, float brightness) {
  vec2 grid = fract(uv * density) - 0.5;
  vec2 id = floor(uv * density);
  float d = length(grid);
  float r = hash(id);
  
  // Only render some cells as stars
  float star = 0.0;
  if (r > 0.85) {
    float twinkle = sin(uTime * 2.0 + r * 6.28) * 0.5 + 0.5;
    star = smoothstep(0.1 * r, 0.0, d) * brightness * (0.5 + twinkle * 0.5);
  }
  
  return star;
}

// Nebula effect
vec3 nebula(vec2 uv, float time) {
  vec2 p = uv * 3.0;
  
  float n1 = fbm(p + time * 0.1);
  float n2 = fbm(p * 2.0 - time * 0.05 + vec2(100.0));
  float n3 = fbm(p * 0.5 + time * 0.02);
  
  // Purple nebula
  vec3 col1 = vec3(0.49, 0.23, 0.93) * n1 * 0.4;
  // Cyan nebula
  vec3 col2 = vec3(0.02, 0.71, 0.83) * n2 * 0.3;
  // Pink nebula
  vec3 col3 = vec3(0.93, 0.29, 0.60) * n3 * 0.2;
  
  return col1 + col2 + col3;
}

// Orbital ring effect
float orbitalRing(vec2 uv, float radius, float width, float rotation) {
  vec2 centered = uv - 0.5;
  float angle = atan(centered.y, centered.x) + rotation;
  float dist = length(centered);
  
  float ring = smoothstep(width, 0.0, abs(dist - radius));
  float fade = sin(angle * 3.0 + uTime) * 0.5 + 0.5;
  
  return ring * fade * 0.3;
}

void main() {
  vec2 uv = vUv;
  vec2 aspectUv = uv;
  aspectUv.x *= uResolution.x / uResolution.y;
  
  // Mouse influence - subtle distortion
  vec2 mouseInfluence = (uMouse - 0.5) * 0.1;
  vec2 distortedUv = uv + mouseInfluence * (1.0 - length(uv - 0.5));
  
  // Scroll influence - depth effect
  float scrollDepth = uScroll * 0.5;
  
  // Background - deep space gradient
  vec3 bgColor = mix(
    vec3(0.04, 0.04, 0.06),
    vec3(0.02, 0.02, 0.04),
    length(uv - 0.5) * 1.5
  );
  
  // Star layers with parallax
  float stars1 = stars(distortedUv + scrollDepth * 0.1, 50.0, 1.0);
  float stars2 = stars(distortedUv * 1.5 + scrollDepth * 0.2, 100.0, 0.7);
  float stars3 = stars(distortedUv * 2.0 + scrollDepth * 0.3, 200.0, 0.4);
  
  vec3 starColor = vec3(0.97, 0.98, 0.99) * (stars1 + stars2 + stars3);
  
  // Nebula layer
  vec3 nebulaColor = nebula(distortedUv + scrollDepth * 0.05, uTime);
  nebulaColor *= smoothstep(0.8, 0.2, length(uv - 0.5 + mouseInfluence));
  
  // Orbital rings
  float ring1 = orbitalRing(uv, 0.3, 0.01, uTime * 0.2);
  float ring2 = orbitalRing(uv, 0.4, 0.008, -uTime * 0.15);
  float ring3 = orbitalRing(uv, 0.5, 0.006, uTime * 0.1);
  
  vec3 ringColor = vec3(0.49, 0.23, 0.93) * (ring1 + ring2 + ring3);
  
  // Combine all layers
  vec3 finalColor = bgColor;
  finalColor += nebulaColor;
  finalColor += starColor;
  finalColor += ringColor;
  
  // Vignette
  float vignette = 1.0 - length(uv - 0.5) * 0.8;
  finalColor *= vignette;
  
  // Subtle color grading
  finalColor = pow(finalColor, vec3(0.95));
  
  gl_FragColor = vec4(finalColor, 1.0);
}
