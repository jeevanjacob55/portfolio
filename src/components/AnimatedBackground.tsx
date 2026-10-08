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
  uniform vec2 u_pointer;
  varying vec2 v_uv;

  float organicBlob(vec2 p, vec2 center, vec2 radius, float phase) {
    vec2 scaledRadius = radius * 0.8;
    vec2 q = (p - center) / scaledRadius;
    float angle = atan(q.y, q.x);
    float contour = 1.0
      + 0.12 * sin(angle * 3.0 + phase)
      + 0.075 * sin(angle * 2.0 - phase * 1.3)
      + 0.045 * cos(angle * 5.0 + phase * 0.7);
    float distanceToEdge = (contour - length(q)) * min(scaledRadius.x, scaledRadius.y);
    return smoothstep(-0.104, 0.104, distanceToEdge);
  }

  void main() {
    vec2 p = (v_uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
    const float LOOP_SECONDS = 16.0;
    const float TAU = 6.28318530718;
    float phase = mod(u_time, LOOP_SECONDS) * (TAU / LOOP_SECONDS);
    vec2 pointerOffset = u_pointer * 0.018;
    float blob1 = organicBlob(p - pointerOffset, vec2(-0.38 + 0.13 * sin(phase), 0.22 + 0.08 * cos(phase)), vec2(0.58, 0.34), phase + 0.2);
    float blob2 = organicBlob(p - pointerOffset * 0.7, vec2(0.42 + 0.12 * cos(phase + 1.2), -0.16 + 0.10 * sin(phase + 1.2)), vec2(0.62, 0.39), phase + 2.1);
    float blob3 = organicBlob(p, vec2(-0.08 + 0.16 * cos(phase + 2.5), -0.42 + 0.07 * sin(phase + 2.5)), vec2(0.48, 0.30), phase + 4.0);
    float blob4 = organicBlob(p, vec2(0.08, 0.48 + 0.06 * sin(phase + 3.4)), vec2(0.42, 0.28), phase + 5.3);
    float lightAmount = 1.0 - (1.0 - blob1 * 0.126) * (1.0 - blob2 * 0.144) * (1.0 - blob3 * 0.114) * (1.0 - blob4 * 0.102);
    float grainCoverage = max(max(blob1, blob2), max(blob3, blob4));
    float grain = fract(52.9829189 * fract(dot(floor(gl_FragCoord.xy), vec2(0.06711056, 0.00583715)))) - 0.5;
    lightAmount = clamp(lightAmount + grain * 0.07 * grainCoverage, 0.0, 0.5);
    vec3 base = vec3(6.0, 21.0, 37.0) / 255.0;
    vec3 light = vec3(244.0, 247.0, 251.0) / 255.0;
    gl_FragColor = vec4(mix(base, light, lightAmount), 1.0);
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
    let pointerLocation: WebGLUniformLocation | null = null;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerX = 0;
    let pointerY = 0;
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
      pointerLocation = context.getUniformLocation(nextProgram, "u_pointer");
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
      if (pointerLocation) gl.uniform2f(pointerLocation, pointerX, pointerY);
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

      const frameDelta = previousFrame ? timestamp - previousFrame : 16.67;
      if (previousFrame) elapsed += frameDelta;
      previousFrame = timestamp;
      const pointerEase = 1 - Math.exp(-frameDelta / 520);
      pointerX += (pointerTargetX - pointerX) * pointerEase;
      pointerY += (pointerTargetY - pointerY) * pointerEase;
      if (timestamp - lastDraw >= 1000 / 60) {
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
    const handlePointerMove = (event: PointerEvent) => {
      pointerTargetX = (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1;
      pointerTargetY = 1 - (event.clientY / Math.max(window.innerHeight, 1)) * 2;
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
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
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
      window.removeEventListener("pointermove", handlePointerMove);
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
