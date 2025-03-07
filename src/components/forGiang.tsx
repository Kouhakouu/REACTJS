"use client";
import { Button } from "antd";
import Link from "next/link";

import { useEffect, useRef } from "react";

// Component HeartAnimation như file bạn đã có
const HeartAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Lấy context WebGL
    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("Unable to initialize WebGL.");
      return;
    }

    // Shader sources
    const vertexSource = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fragmentSource = `
      precision highp float;
      uniform float width;
      uniform float height;
      uniform float time;
      vec2 resolution = vec2(width, height);
      #define POINT_COUNT 8
      vec2 points[POINT_COUNT];
      const float speed = -0.4;
      const float len = 0.25;
      float intensity = 0.8;
      float radius = 0.03;

      float sdBezier(vec2 pos, vec2 A, vec2 B, vec2 C) {    
        vec2 a = B - A;
        vec2 b = A - 2.0 * B + C;
        vec2 c = a * 2.0;
        vec2 d = A - pos;
        float kk = 1.0 / dot(b, b);
        float kx = kk * dot(a, b);
        float ky = kk * (2.0 * dot(a, a) + dot(d, b)) / 3.0;
        float kz = kk * dot(d, a);      
        float res = 0.0;
        float p = ky - kx * kx;
        float p3 = p * p * p;
        float q = kx * (2.0 * kx * kx - 3.0 * ky) + kz;
        float h = q * q + 4.0 * p3;
        if (h >= 0.0) { 
          h = sqrt(h);
          vec2 x = (vec2(h, -h) - q) / 2.0;
          vec2 uv = sign(x) * pow(abs(x), vec2(1.0 / 3.0));
          float t = uv.x + uv.y - kx;
          t = clamp(t, 0.0, 1.0);
          vec2 qos = d + (c + b * t) * t;
          res = length(qos);
        } else {
          float z = sqrt(-p);
          float v = acos(q / (p * z * 2.0)) / 3.0;
          float m = cos(v);
          float n = sin(v) * 1.732050808;
          vec3 t = vec3(m + m, -n - m, n - m) * z - kx;
          t = clamp(t, 0.0, 1.0);
          vec2 qos = d + (c + b * t.x) * t.x;
          float dis = dot(qos, qos);
          res = dis;
          qos = d + (c + b * t.y) * t.y;
          dis = dot(qos, qos);
          res = min(res, dis);
          qos = d + (c + b * t.z) * t.z;
          dis = dot(qos, qos);
          res = min(res, dis);
          res = sqrt(res);
        }
        return res;
      }

      vec2 getHeartPosition(float t) {
        return vec2(
          16.0 * sin(t) * sin(t) * sin(t),
          -(13.0 * cos(t) - 5.0 * cos(2.0 * t) - 2.0 * cos(3.0 * t) - cos(4.0 * t))
        );
      }

      float getGlow(float dist, float radius, float intensity) {
        return pow(radius / dist, intensity);
      }

      float getSegment(float t, vec2 pos, float offset, float scale) {
        for (int i = 0; i < POINT_COUNT; i++) {
          points[i] = getHeartPosition(offset + float(i) * len + fract(speed * t) * 6.28);
        }
        vec2 c = (points[0] + points[1]) / 2.0;
        vec2 c_prev;
        float dist = 10000.0;
        for (int i = 0; i < POINT_COUNT - 1; i++) {
          c_prev = c;
          c = (points[i] + points[i + 1]) / 2.0;
          dist = min(dist, sdBezier(pos, scale * c_prev, scale * points[i], scale * c));
        }
        return max(0.0, dist);
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float widthHeightRatio = resolution.x / resolution.y;
        vec2 centre = vec2(0.5, 0.5);
        vec2 pos = centre - uv;
        pos.y /= widthHeightRatio;
        pos.y += 0.02;
        float scale = 0.00001 * height;
        float tPink = time;
        float tBlue = time + 1.5;
        float distPink = getSegment(tPink, pos, 0.0, scale);
        float distBlue = getSegment(tBlue, pos, 1.0, scale);
        float glowPink = getGlow(distPink, radius, intensity);
        float glowBlue = getGlow(distBlue, radius, intensity);
        vec3 colorPink = vec3(1.0, 0.2, 0.6);
        vec3 colorBlue = vec3(0.2, 0.8, 1.0);
        vec3 col = vec3(0.0);
        col += glowPink * colorPink;
        col += glowBlue * colorBlue;
        col = 1.0 - exp(-col);

        // Tính toán độ sáng thay đổi liên tục
        float brightness = 0.5 + 0.4 * sin(time * 1.0);
        col *= brightness;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    // Hàm compile shader và log lỗi nếu có
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
      }
      return shader;
    };

    const vertexShader = compileShader(vertexSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentSource, gl.FRAGMENT_SHADER);

    // Tạo chương trình, attach shader, link và dùng chương trình
    const program = gl.createProgram()!;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
    }
    gl.useProgram(program);

    // Lấy uniform locations
    const widthHandle = gl.getUniformLocation(program, "width");
    const heightHandle = gl.getUniformLocation(program, "height");
    const timeHandle = gl.getUniformLocation(program, "time");

    if (widthHandle) gl.uniform1f(widthHandle, window.innerWidth);
    if (heightHandle) gl.uniform1f(heightHandle, window.innerHeight);

    // Cập nhật kích thước canvas khi load/resize
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (widthHandle) gl.uniform1f(widthHandle, window.innerWidth);
      if (heightHandle) gl.uniform1f(heightHandle, window.innerHeight);
    };

    setCanvasSize();

    // Thiết lập dữ liệu vertex cho hình chữ nhật phủ toàn canvas
    const vertexData = new Float32Array([-1, 1, -1, -1, 1, 1, 1, -1]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    let time = 0.0;
    const render = () => {
      time += 0.01;
      if (timeHandle) gl.uniform1f(timeHandle, time);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    window.addEventListener("resize", setCanvasSize);
    render();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    // Canvas phủ toàn màn hình
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
    />
  );
};

// Component chính kết hợp HeartAnimation và nút bấm có hiệu ứng ripple
export default function HomePage() {
  useEffect(() => {
    // Hiệu ứng ripple cho các nút <a>
    const buttons = document.querySelectorAll("a");
    buttons.forEach((button) => {
      button.addEventListener("click", function (e) {
        const target = e.currentTarget as HTMLElement;
        const x = e.clientX - target.offsetLeft;
        const y = e.clientY - target.offsetTop;
        const ripples = document.createElement("span");
        ripples.style.left = x + "px";
        ripples.style.top = y + "px";
        target.appendChild(ripples);

        setTimeout(() => {
          ripples.remove();
        }, 1000);
      });
    });
  }, []);

  return (
    <div>
      {/* Canvas cho hiệu ứng trái tim */}
      <HeartAnimation />
      {/* Các nút button */}
      <Link href="/forGiang2">
        <div className="buttons">
          HUHU CẢ TỐI CODE ĐƯỢC MỖI CÁI TRÁI TIM
          <span></span>
        </div>
      </Link>

      {/* CSS từ file style.css và import font Google */}
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");
        * {
          margin: 0;
          padding: 0;
          font-family: "Poppins", sans-serif;
        }
        body,
        html,
        #__next {
          height: 100%;
        }
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          flex-direction: column;
          background: #040d15;
        }
        .buttons {
          position: relative;
          display: inline-block;
          padding: 10px 20px;
          margin: 5px 0;
          color: #fff;
          text-decoration: none;
          text-transform: uppercase;
          font-size: 7px;
          letter-spacing: 2px;
          border-radius: 40px;
          overflow: hidden;
          background: linear-gradient(90deg, #3498db, #9b59b6);
        }
        .buttons a:nth-child(2) {
          background: linear-gradient(90deg, #755bea, #ff72c0);
        }
        .buttons div span {
          position: absolute;
          background: #fff;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          pointer-events: none;
          animation: animate 1s linear infinite;
        }
        @keyframes animate {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.5;
          }
          100% {
            width: 500px;
            height: 500px;
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
