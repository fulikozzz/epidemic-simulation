import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Chart, registerables } from 'chart.js';
import './Plot.css';

// Регистрируем все компоненты Chart.js
Chart.register(...registerables);

// Цвета для графика
const COLORS = {
  healthy: '#4fd1c5',
  infected: '#ffa500',
  symptomatic: '#af2b1e',
  recovered: '#68d391',
  dead: '#718096',
  bg: '#f8f9fa',
};

// Константы для оптимизации
const MAX_DATA_POINTS = 160; // Уменьшаем максимальное количество точек
const UPDATE_THROTTLE = 200; // Увеличиваем интервал между обновлениями (мс)

export default function ChartPlot({ healthy, infected, symptomatic, recovered, dead, width = 600, height = 300 }) {
  const canvasRef = useRef();
  const chartRef = useRef();
  const lastUpdateRef = useRef(0);
  const [showLegend, setShowLegend] = useState(false);

  // Функция для ограничения количества точек данных
  const limitDataPoints = useCallback((data) => {
    if (data.length <= MAX_DATA_POINTS) return data;
    
    
    //ерем каждую N-ю точку для сохранения формы графика
    const step = Math.ceil(data.length / MAX_DATA_POINTS);
    const limited = [];
    for (let i = 0; i < data.length; i += step) {
      limited.push(data[i]);
    }
    return limited;
  }, []);

  useEffect(() => {
    // Показываем легенду только если есть данные
    setShowLegend(healthy && healthy.length > 1);
  }, [healthy]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Уничтожаем предыдущий график
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Создаем новый график
    const ctx = canvasRef.current.getContext('2d');
    
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Здоровые',
            data: [],
            backgroundColor: COLORS.healthy,
            borderColor: COLORS.healthy,
            borderWidth: 1,
            fill: true,
            stack: 'Stack 0',
            tension: 0.1
          },
          {
            label: 'Заражённые',
            data: [],
            backgroundColor: COLORS.infected,
            borderColor: COLORS.infected,
            borderWidth: 1,
            fill: true,
            stack: 'Stack 0',
            tension: 0.1
          },
          {
            label: 'Симптомы',
            data: [],
            backgroundColor: COLORS.symptomatic,
            borderColor: COLORS.symptomatic,
            borderWidth: 1,
            fill: true,
            stack: 'Stack 0',
            tension: 0.1
          },
          {
            label: 'Выздоровели',
            data: [],
            backgroundColor: COLORS.recovered,
            borderColor: COLORS.recovered,
            borderWidth: 1,
            fill: true,
            stack: 'Stack 0',
            tension: 0.1
          },
          {
            label: 'Умерли',
            data: [],
            backgroundColor: COLORS.dead,
            borderColor: COLORS.dead,
            borderWidth: 1,
            fill: true,
            stack: 'Stack 0',
            tension: 0.1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false, // Отключаем анимации для производительности
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            display: false, // Скрываем встроенную легенду
          },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            borderColor: '#fff',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            type: 'linear',
            display: false,
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Количество людей',
              color: '#222',
              font: {
                size: 12
              }
            },
            grid: {
              color: '#eee',
              drawBorder: false
            },
            ticks: {
              color: '#222',
              font: {
                size: 10
              },
              maxTicksLimit: 8 // Ограничиваем количество меток на оси Y
            },
            beginAtZero: true
          }
        },
        elements: {
          point: {
            radius: 0, // Скрываем точки
            hoverRadius: 0 // Отключаем hover эффекты для производительности
          }
        },
        hover: {
          mode: null, // Отключаем hover режим
          intersect: false
        }
      }
    });

    // Очистка при размонтировании
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Оптимизированное обновление данных с throttling
  useEffect(() => {
    if (!chartRef.current || !healthy || healthy.length === 0) return;

    const now = Date.now();
    if (now - lastUpdateRef.current < UPDATE_THROTTLE) return;
    lastUpdateRef.current = now;

    // Ограничиваем количество точек данных
    const limitedHealthy = limitDataPoints(healthy);
    const limitedInfected = limitDataPoints(infected);
    const limitedSymptomatic = limitDataPoints(symptomatic);
    const limitedRecovered = limitDataPoints(recovered);
    const limitedDead = limitDataPoints(dead);

    const labels = limitedHealthy.map((_, index) => index);
    
    chartRef.current.data.labels = labels;
    chartRef.current.data.datasets[0].data = limitedHealthy;
    chartRef.current.data.datasets[1].data = limitedInfected;
    chartRef.current.data.datasets[2].data = limitedSymptomatic;
    chartRef.current.data.datasets[3].data = limitedRecovered;
    chartRef.current.data.datasets[4].data = limitedDead;
    
    // Используем 'none' для максимальной производительности
    chartRef.current.update('none');
  }, [healthy, infected, symptomatic, recovered, dead, limitDataPoints]);

  const legendItems = [
    { color: COLORS.healthy, label: 'Здоровые' },
    { color: COLORS.infected, label: 'Заражённые' },
    { color: COLORS.symptomatic, label: 'Симптомы' },
    { color: COLORS.recovered, label: 'Выздоровели' },
    { color: COLORS.dead, label: 'Умерли' },
  ];

  return (
    <div className="plot-panel">
      <div className="plot-container">
        <canvas 
          ref={canvasRef} 
          width={width} 
          height={height}
          style={{ width: '100%', height: '300px' }}
        />
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