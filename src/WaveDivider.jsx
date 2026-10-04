import { useMemo } from 'react';
import './App.css';

const VIEW_W = 1440;
const VIEW_H = 320;

// Sóng = tổng của 2 sóng sin. Vì số chu kỳ (k) là số nguyên nên điểm đầu
// và điểm cuối cùng độ cao => nối 2 bản SVG liền nhau không bị đứt/giật.
function buildWavePath({ base, a1, k1, p1, a2, k2, p2 }) {
  const step = 10;
  let d = '';
  for (let x = 0; x <= VIEW_W; x += step) {
    const t = (x / VIEW_W) * Math.PI * 2;
    const y = base + a1 * Math.sin(k1 * t + p1) + a2 * Math.sin(k2 * t + p2);
    d += `${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)} `;
  }
  return `${d}L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`;
}

// Layer 1 ở trước (đậm nhất), layer 4 ở sau cùng (nhạt nhất)
const LAYERS = [
  { className: 'wave-layer-1', fill: '#4FACF7', base: 250, a1: 22, k1: 2, p1: 0,   a2: 8, k2: 5, p2: 1 },
  { className: 'wave-layer-2', fill: '#98C6FA', base: 215, a1: 26, k1: 2, p1: 2,   a2: 9, k2: 4, p2: 0.5 },
  { className: 'wave-layer-3', fill: '#CEE2FD', base: 180, a1: 28, k1: 1, p1: 1,   a2: 10, k2: 3, p2: 2 },
  { className: 'wave-layer-4', fill: '#F1F6FE', base: 150, a1: 24, k1: 1, p1: 3.5, a2: 8, k2: 3, p2: 4 },
];

function WaveDivider() {
  const layers = useMemo(
    () => LAYERS.map((l) => ({ ...l, d: buildWavePath(l) })),
    []
  );

  return (
    <div className="wave-divider" aria-hidden="true">
      {layers.map(({ className, fill, d }) => (
        <div key={className} className={`wave-track ${className}`}>
          {/* 2 bản giống hệt nhau, track trượt -50% rồi lặp lại */}
          {[0, 1].map((i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              preserveAspectRatio="none"
            >
              <path fill={fill} d={d} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

export default WaveDivider;
