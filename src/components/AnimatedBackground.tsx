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
    float t = u_time;

    // Two animated, differently directed warp fields bend the boundaries
    // into long, interconnected currents instead of circular color spots.
    vec2 warpA = vec2(
      fbm(p * 1.18 + vec2(t * 0.13, -t * 0.08)),
      fbm(p * 1.18 + vec2(5.2 - t * 0.09, 2.7 + t * 0.11))
    );
    vec2 warped = p * 1.45 + (warpA - 0.5) * 2.25;
    vec2 warpB = vec2(
      fbm(warped * 1.35 + vec2(1.7 + t * 0.07, 8.1 - t * 0.04)),
      fbm(warped * 1.35 + vec2(6.4 - t * 0.05, 3.3 + t * 0.08))
    );
    vec2 fluid = warped + (warpB - 0.5) * 1.45;

    float field = fbm(fluid * 1.85 + vec2(t * 0.045, -t * 0.032));
    float current = fbm(fluid * vec2(2.35, 1.65) + vec2(-t * 0.065, t * 0.052));
    float detail = fbm(fluid * 3.1 + vec2(t * 0.035, t * 0.048));

    vec3 color = vec3(0.012, 0.027, 0.067);
    float navy = smoothstep(0.29, 0.68, field);
    color = mix(color, vec3(0.025, 0.105, 0.235), navy * 0.9);

    float royalField = field + (current - 0.5) * 0.2;
    float royal = smoothstep(0.47, 0.70, royalField);
    color = mix(color, vec3(0.075, 0.245, 0.70), royal * 0.88);

    float electricField = current + (detail - 0.5) * 0.16;
    float electric = smoothstep(0.57, 0.73, electricField) * smoothstep(0.38, 0.55, field);
    color = mix(color, vec3(0.055, 0.39, 0.83), electric * 0.72);

    float cyanField = detail + (field - 0.5) * 0.12;
    float cyan = smoothstep(0.68, 0.82, cyanField) * smoothstep(0.48, 0.65, current);
    color = mix(color, vec3(0.055, 0.57, 0.82), cyan * 0.58);

    // Keep a gentle dark veil so the blue currents remain behind readable text.
    float vignette = 1.0 - smoothstep(0.18, 1.1, length((uv - 0.5) * vec2(1.05, 0.9)));
    color *= mix(0.74, 1.0, vignette);
    gl_FragColor = vec4(color, 1.0);
  }
`;

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
