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

  float circularBlob(vec2 p, vec2 center, vec2 radius) {
    vec2 scaledRadius = radius * 0.8;
    vec2 q = (p - center) / scaledRadius;
    float distanceToEdge = (1.0 - length(q)) * min(scaledRadius.x, scaledRadius.y);
    float softEdge = smoothstep(-0.11, 0.11, distanceToEdge);
    float centerFalloff = 0.72 + 0.28 * exp(-dot(q, q) * 0.8);
    return softEdge * centerFalloff;
  }

  void main() {
    vec2 p = (v_uv - 0.5) * vec2(u_resolution.x / u_resolution.y, 1.0);
    const float LOOP_SECONDS = 32.0;
    const float TAU = 6.28318530718;
    float phase = mod(u_time, LOOP_SECONDS) * (TAU / LOOP_SECONDS);
    vec2 pointerOffset = u_pointer * 0.018;
    float blob1 = circularBlob(p - pointerOffset, vec2(-0.52 + 0.19 * sin(phase), 0.22 + 0.12 * cos(phase)), vec2(0.88 + 0.04 * sin(phase)));
    float blob2 = circularBlob(p - pointerOffset * 0.7, vec2(0.48 + 0.17 * cos(phase + 1.2), -0.2 + 0.14 * sin(phase + 1.2)), vec2(0.82 + 0.035 * cos(phase + 1.2)));
    float blob3 = circularBlob(p, vec2(-0.12 + 0.16 * cos(phase + 2.5), -0.58 + 0.12 * sin(phase + 2.5)), vec2(0.76 + 0.03 * sin(phase + 2.5)));
    float blob4 = circularBlob(p, vec2(0.18 + 0.15 * sin(phase + 3.4), 0.52 + 0.13 * cos(phase + 3.4)), vec2(0.68 + 0.035 * cos(phase + 3.4)));
    float grain = fract(52.9829189 * fract(dot(floor(gl_FragCoord.xy), vec2(0.06711056, 0.00583715)))) - 0.5;
    float grainFactor = 1.0 + grain * 0.24;
    vec3 color = vec3(3.0) / 255.0;
    float opacity1 = clamp(blob1 * 0.18 * grainFactor, 0.0, 0.2);
    float opacity2 = clamp(blob2 * 0.17 * grainFactor, 0.0, 0.2);
    float opacity3 = clamp(blob3 * 0.15 * grainFactor, 0.0, 0.2);
    float opacity4 = clamp(blob4 * 0.13 * grainFactor, 0.0, 0.2);
    color = mix(color, vec3(96.0, 165.0, 250.0) / 255.0, opacity1);
    color = mix(color, vec3(59.0, 130.0, 246.0) / 255.0, opacity2);
    color = mix(color, vec3(37.0, 99.0, 235.0) / 255.0, opacity3);
    color = mix(color, vec3(29.0, 78.0, 216.0) / 255.0, opacity4);
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
