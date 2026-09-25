import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
  attribute vec2 a_position;
  varying vec2 v_uv;

  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec3 u_base;
  uniform vec3 u_royal;
  varying vec2 v_uv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);
    local = local * local * (3.0 - 2.0 * local);

    float a = hash(cell);
    float b = hash(cell + vec2(1.0, 0.0));
    float c = hash(cell + vec2(0.0, 1.0));
    float d = hash(cell + vec2(1.0, 1.0));
    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int octave = 0; octave < 4; octave++) {
      value += amplitude * noise(p);
      p = p * 2.03 + vec2(17.1, 9.2);
      amplitude *= 0.5;
    }
    return value / 0.9375;
  }

  void main() {
    vec2 uv = v_uv;
    vec2 p = (uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
    const float LOOP_SECONDS = 180.0;
    const float TAU = 6.28318530718;
    float phase = mod(u_time, LOOP_SECONDS) * (TAU / LOOP_SECONDS);

    // Periodic domain warps create fluid currents and return to their exact
    // starting coordinates every three minutes for a seamless loop.
    vec2 driftA = vec2(cos(phase), sin(phase)) * 0.22;
    vec2 driftB = vec2(cos(phase + 1.7), sin(phase + 1.7)) * 0.19;
    vec2 warpA = vec2(
      fbm(p * 0.92 + driftA),
      fbm(p * 0.92 + vec2(5.2, 2.7) + driftB)
    );
    vec2 warped = p * 1.12 + (warpA - 0.5) * 1.85;
    vec2 driftC = vec2(cos(phase * 2.0 + 0.8), sin(phase * 2.0 + 0.8)) * 0.14;
    vec2 driftD = vec2(cos(phase * 2.0 + 2.6), sin(phase * 2.0 + 2.6)) * 0.12;
    vec2 warpB = vec2(
      fbm(warped * 1.08 + vec2(1.7, 8.1) + driftC),
      fbm(warped * 1.08 + vec2(6.4, 3.3) + driftD)
    );
    vec2 fluid = warped + (warpB - 0.5) * 1.15;

    float field = fbm(fluid * 1.05 + driftA * 0.35);
    float current = fbm(fluid * vec2(1.48, 1.12) + driftB * 0.42);
    float detail = fbm(fluid * 1.92 + driftC * 0.3);
    float flow = smoothstep(0.32, 0.72, field + (current - 0.5) * 0.22 + (detail - 0.5) * 0.1);
    vec3 color = mix(u_base, u_royal, flow * 0.82);

    // Fine animated grain is deliberately low contrast and also loops with the field.
    float grainFrame = mod(floor(u_time * 12.0), LOOP_SECONDS * 12.0);
    float grain = (hash(gl_FragCoord.xy + vec2(grainFrame, grainFrame * 0.37)) - 0.5) * 0.012;
    color += grain;

    gl_FragColor = vec4(color, 1.0);
  }
`;

type PaletteColor = [number, number, number];

function readPaletteColor(name: string, fallback: PaletteColor): PaletteColor {
  const channels = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim()
    .split(/\s+/)
    .map(Number);

  if (channels.length !== 3 || channels.some((channel) => !Number.isFinite(channel))) {
    return fallback;
  }
  return channels.map((channel) => channel / 255) as PaletteColor;
}

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let positionLocation = -1;
    let resolutionLocation: WebGLUniformLocation | null = null;
    let timeLocation: WebGLUniformLocation | null = null;
    let paletteLocations: (WebGLUniformLocation | null)[] = [];
    const paletteColors: PaletteColor[] = [
      readPaletteColor("--color-base", [3, 8, 23]),
      readPaletteColor("--color-royal", [18, 54, 107]),
    ];
    let frameId = 0;
    let elapsed = 0;
    let previousFrame = 0;
    let lastDraw = 0;
    let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dispose = () => {
      if (!gl) return;
      if (buffer) gl.deleteBuffer(buffer);
      if (program) gl.deleteProgram(program);
      buffer = null;
      program = null;
      gl = null;
    };

    const initialize = () => {
      const context = canvas.getContext("webgl", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
      if (!context) return false;

      const vertex = compileShader(context, context.VERTEX_SHADER, VERTEX_SHADER);
      const fragment = compileShader(context, context.FRAGMENT_SHADER, FRAGMENT_SHADER);
      if (!vertex || !fragment) {
        if (vertex) context.deleteShader(vertex);
        if (fragment) context.deleteShader(fragment);
        return false;
      }

      const nextProgram = context.createProgram();
      if (!nextProgram) {
        context.deleteShader(vertex);
        context.deleteShader(fragment);
        return false;
      }

      context.attachShader(nextProgram, vertex);
      context.attachShader(nextProgram, fragment);
      context.linkProgram(nextProgram);
      context.deleteShader(vertex);
      context.deleteShader(fragment);
      if (!context.getProgramParameter(nextProgram, context.LINK_STATUS)) {
        context.deleteProgram(nextProgram);
        return false;
      }

      const nextBuffer = context.createBuffer();
      if (!nextBuffer) {
        context.deleteProgram(nextProgram);
        return false;
      }

      context.bindBuffer(context.ARRAY_BUFFER, nextBuffer);
      context.bufferData(
        context.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        context.STATIC_DRAW
      );
      context.useProgram(nextProgram);

      gl = context;
      program = nextProgram;
      buffer = nextBuffer;
      positionLocation = context.getAttribLocation(nextProgram, "a_position");
      resolutionLocation = context.getUniformLocation(nextProgram, "u_resolution");
      timeLocation = context.getUniformLocation(nextProgram, "u_time");
      paletteLocations = ["u_base", "u_royal"].map(
        (name) => context.getUniformLocation(nextProgram, name)
      );
      context.enableVertexAttribArray(positionLocation);
      context.vertexAttribPointer(positionLocation, 2, context.FLOAT, false, 0, 0);
      context.disable(context.DEPTH_TEST);
      context.disable(context.BLEND);
      canvas.style.visibility = "visible";
      resizeAndDraw();
      return true;
    };

    const draw = (time: number) => {
      if (!gl || !program || !resolutionLocation || !timeLocation) return;
      gl.useProgram(program);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(timeLocation, time);
      paletteLocations.forEach((location, index) => {
        if (location) gl?.uniform3fv(location, paletteColors[index]);
      });
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const resizeAndDraw = () => {
      if (!gl) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 720 ? 1 : 1.25);
      const width = Math.max(1, Math.round(canvas.clientWidth * pixelRatio));
      const height = Math.max(1, Math.round(canvas.clientHeight * pixelRatio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      draw(elapsed / 1000);
    };

    const tryInitialize = () => {
      try {
        return initialize();
      } catch {
        dispose();
        canvas.style.visibility = "hidden";
        return false;
      }
    };

    const stopAnimation = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = 0;
      previousFrame = 0;
    };

    const animate = (timestamp: number) => {
      frameId = 0;
      if (document.hidden || reducedMotion || !gl) return;

      if (previousFrame) elapsed += timestamp - previousFrame;
      previousFrame = timestamp;
      if (timestamp - lastDraw >= 1000 / 30) {
        draw(elapsed / 1000);
        lastDraw = timestamp;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (!frameId && !document.hidden && !reducedMotion && gl) {
        previousFrame = 0;
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleMotionChange = () => {
      reducedMotion = motionPreference.matches;
      if (reducedMotion) {
        stopAnimation();
        draw(elapsed / 1000);
      } else {
        startAnimation();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation();
      else startAnimation();
    };
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      stopAnimation();
      canvas.style.visibility = "hidden";
      dispose();
    };
    const handleContextRestored = () => {
      if (!tryInitialize()) return;
      if (reducedMotion) draw(elapsed / 1000);
      else startAnimation();
    };

    canvas.style.visibility = "hidden";
    canvas.addEventListener("webglcontextlost", handleContextLost);
    canvas.addEventListener("webglcontextrestored", handleContextRestored);
    window.addEventListener("resize", resizeAndDraw, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);
    motionPreference.addEventListener("change", handleMotionChange);

    if (tryInitialize()) {
      if (reducedMotion) draw(0);
      else startAnimation();
    }

    return () => {
      stopAnimation();
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      canvas.removeEventListener("webglcontextrestored", handleContextRestored);
      window.removeEventListener("resize", resizeAndDraw);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      motionPreference.removeEventListener("change", handleMotionChange);
      dispose();
    };
  }, []);

  return (
    <div className="mesh-bg" aria-hidden="true">
      <canvas ref={canvasRef} className="mesh-canvas" />
    </div>
  );
}
