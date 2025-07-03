import React, { useRef, useEffect } from 'react';
import './Plot.css';

// Цвета для графика
const COLORS = {
  healthy: '#4fd1c5',
  infected: '#ffa500',
  symptomatic: '#af2b1e',
  recovered: '#68d391',
  dead: '#718096',
  bg: '#f8f9fa',
};

function drawStackedChart(ctx, data, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.fillStyle = COLORS.bg;
  ctx.fillRect(0, 0, width, height);

  const n = data.healthy.length;
  if (n < 2) return;

  // Находим максимум для масштабирования
  let maxY = 0;
  for (let i = 0; i < n; ++i) {
    const sum = data.healthy[i] + data.infected[i] + data.symptomatic[i] + data.recovered[i] + data.dead[i];
    if (sum > maxY) maxY = sum;
  }
  if (maxY === 0) maxY = 1;

  // Функция для преобразования индекса в X
  const getX = (i) => (i / (n - 1)) * (width - 60) + 40;
  // Функция для преобразования значения в Y
  const getY = (y) => height - 40 - (y / maxY) * (height - 80);

  // Считаем накопленные значения для стека
  const stack = {
    healthy: Array(n).fill(0),
    infected: Array(n).fill(0),
    symptomatic: Array(n).fill(0),
    recovered: Array(n).fill(0),
    dead: Array(n).fill(0),
  };
  for (let i = 0; i < n; ++i) {
    stack.healthy[i] = data.healthy[i];
    stack.infected[i] = stack.healthy[i] + data.infected[i];
    stack.symptomatic[i] = stack.infected[i] + data.symptomatic[i];
    stack.recovered[i] = stack.symptomatic[i] + data.recovered[i];
    stack.dead[i] = stack.recovered[i] + data.dead[i];
  }

  // Рисуем слои (от нижнего к верхнему)
  const layers = [
    { key: 'healthy', color: COLORS.healthy },
    { key: 'infected', color: COLORS.infected },
    { key: 'symptomatic', color: COLORS.symptomatic },
    { key: 'recovered', color: COLORS.recovered },
    { key: 'dead', color: COLORS.dead },
  ];

  let prev = Array(n).fill(0);
  for (const layer of layers) {
    ctx.beginPath();
    for (let i = 0; i < n; ++i) {
      const x = getX(i);
      const y = getY(stack[layer.key][i]);
      if (i === 0) ctx.moveTo(x, getY(prev[i]));
      ctx.lineTo(x, y);
    }
    for (let i = n - 1; i >= 0; --i) {
      const x = getX(i);
      ctx.lineTo(x, getY(prev[i]));
    }
    ctx.closePath();
    ctx.fillStyle = layer.color;
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
    // Обновляем prev
    for (let i = 0; i < n; ++i) prev[i] = stack[layer.key][i];
  }

  // Оси
  ctx.strokeStyle = '#222';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(40, 20);
  ctx.lineTo(40, height - 40);
  ctx.lineTo(width - 20, height - 40);
  ctx.stroke();

  // Подписи по Y
  ctx.fillStyle = '#222';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= 5; ++i) {
    const yVal = Math.round((maxY * i) / 5);
    const y = getY(yVal);
    ctx.fillText(yVal, 35, y);
    ctx.beginPath();
    ctx.strokeStyle = '#eee';
    ctx.moveTo(40, y);
    ctx.lineTo(width - 20, y);
    ctx.stroke();
  }

  ctx.restore();
}

const legendItems = [
  { color: COLORS.healthy, label: 'Здоровые' },
  { color: COLORS.infected, label: 'Заражённые' },
  { color: COLORS.symptomatic, label: 'Симптомы' },
  { color: COLORS.recovered, label: 'Выздоровели' },
  { color: COLORS.dead, label: 'Умерли' },
];

export default function Plot({ healthy, infected, symptomatic, recovered, dead, width = 600, height = 300 }) {
  const canvasRef = useRef();

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d');
    drawStackedChart(
      ctx,
      { healthy, infected, symptomatic, recovered, dead },
      width,
      height
    );
  }, [healthy, infected, symptomatic, recovered, dead, width, height]);

  // Легенда видна только если есть хотя бы 2 точки (началась симуляция)
  const showLegend = healthy && healthy.length > 1;

  return (
    <div className="plot-panel">
      <div className="plot-container">
        <canvas ref={canvasRef} width={width} height={height} />
      </div>
      {showLegend && (
        <div className="legend-container even-legend">
          {legendItems.map(item => (
            <div key={item.label} className="legend-item">
              <span className="legend-color" style={{ background: item.color }}></span>
              <span className="legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 