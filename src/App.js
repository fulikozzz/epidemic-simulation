import React, { useState, useRef } from 'react';
import './App.css';
import SimCanvas from './simCanvas';
import SettingsPanel from './SettingsPanel';
import StatsPanel from './StatsPanel';
import simulationConfig from './simulatiionConfig';
//import Plot from './Plot';
import ChartPlot from './ChartPlot';
import virusImage from './images/virusImage.png';

/**
 * Главный компонент приложения
 * 
 * Управляет общим состоянием приложения:
 * - Конфигурация симуляции
 * - Статус симуляции
 * - Интеграция между панелью настроек и канвой
 */
function App() {
  // Ссылка на канву для управления состоянием симуляции
  const simCanvasRef = useRef(null);
  
  // Состояние для отслеживания статуса симуляции
  const [isRunning, setIsRunning] = useState(false);
  
  // Состояние для хранения данных о людях для статистики
  const [persons, setPersons] = useState([]);
  
  // Массивы для графика
  const [healthyArr, setHealthyArr] = useState([]);
  const [infectedArr, setInfectedArr] = useState([]);
  const [symptomaticArr, setSymptomaticArr] = useState([]);
  const [recoveredArr, setRecoveredArr] = useState([]);
  const [deadArr, setDeadArr] = useState([]);
  
  // Начальная конфигурация симуляции
  const [config, setConfig] = useState(new simulationConfig({
    totalPeople: 100,
    infectedPeople: 3,
    infectivityPercent: 0.4,
    incubationPeriod: 2, 
    symptomaticPeriod: 3, 
    incubationPeriodMin: 1,
    incubationPeriodMax: 5,
    symptomaticPeriodMin: 2,
    symptomaticPeriodMax: 7,
    socialDistancePercent: 0.2,
    socialDistanceStrictness: 5,
    recoverySpeed: 3000,
    mortalityRate: 0.15,
    hospitalCapacityPercent: 0.4,
    recurrentInfection: true,
    reinfectionImmunityFactor: 0.5,
    width: 1400,
    height: 900,
    speed: 1
  }));

  /**
   * Обрабатывает изменения конфигурации в панели настроек
   * @param {Object} newConfig - Обновлённая конфигурация
   */
  const handleConfigChange = (newConfig) => {
    const configInstance = newConfig instanceof simulationConfig 
      ? newConfig 
      : new simulationConfig(newConfig);
    
    setConfig(configInstance);
    
    // Если симуляция запущена, перезапускаем её с новой конфигурацией
    if (isRunning && simCanvasRef.current) {
      simCanvasRef.current.restartSimulation(configInstance);
    }
  };

  /**
   * Обрабатывает обновления статистики от симуляции
   * @param {Object} stats - Объект статистики
   */
  const handleStatsUpdate = (stats) => {
    setPersons(stats.persons);
    setHealthyArr(arr => [...arr, stats.healthy]);
    setInfectedArr(arr => [...arr, stats.infected]);
    setSymptomaticArr(arr => [...arr, stats.symptomatic]);
    setRecoveredArr(arr => [...arr, stats.recovered]);
    setDeadArr(arr => [...arr, stats.dead]);
  };

  /**
   * Сброс массивов статистики
   */
  const handleResetStats = () => {
    setHealthyArr([]);
    setInfectedArr([]);
    setSymptomaticArr([]);
    setRecoveredArr([]);
    setDeadArr([]);
  };

  /**
   * Запускает симуляцию
   */
  const startSimulation = () => {
    setIsRunning(true);
    if (simCanvasRef.current) { 
      simCanvasRef.current.startSimulation();
    }
  };

  /**
   * Останавливает симуляцию
   */
  const stopSimulation = () => {
    setIsRunning(false);
    if (simCanvasRef.current) { 
      simCanvasRef.current.stopSimulation();
    }
  };

  /**
   * Сбрасывает симуляцию в начальное состояние
   */
  const resetSimulation = () => {
    handleResetStats();
    setIsRunning(false);
    if (simCanvasRef.current) {
      simCanvasRef.current.resetSimulation();
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">Модель распространения эпидемии</h1>
        <img src={virusImage} alt="logo" className="virus-image" />
        <p style={{marginLeft: '850px', fontSize: '16px', color: '#666'}}>
          Реализовал Непомнящий Кирилл, студент 2 курса, группа ПИ-33, 2025 год.
        </p>
      </header>

      {/* Body */}
      <div className="app-content">
        {/* Панель настроек и статистики */}
        <div className="settings-container">
          <SettingsPanel 
            config={config}
            onConfigChange={handleConfigChange}
            isRunning={isRunning}
          />
          
          {/* Панель статистики */}
          <StatsPanel 
            persons={persons}
            isRunning={isRunning}
          />
          {/* График эпидемии */}
          <ChartPlot
            healthy={healthyArr}
            infected={infectedArr}
            symptomatic={symptomaticArr}
            recovered={recoveredArr}
            dead={deadArr}
            width={600}
            height={300}
          />
        </div>

        {/* Канва и панель управления симуляцией */}
        <div className="simulation-container">
          <SimCanvas 
            ref={simCanvasRef}
            config={config}
            onSimulationStateChange={setIsRunning}
            onStatsUpdate={handleStatsUpdate}
          />
          
          {/* Панель управления симуляцией */}
          <div className="simulation-controls">
            <h4>Управление симуляцией</h4> 
            <div className="control-buttons">
              {!isRunning ? (
                <button 
                  onClick={startSimulation}
                  className="control-button start-button"
                >
                  Запустить симуляцию
                </button>
              ) : (
                <button 
                  onClick={stopSimulation}
                  className="control-button stop-button"
                >
                  Остановить симуляцию
                </button>
              )}
              
              <button 
                onClick={resetSimulation}
                className="control-button reset-button"
                disabled={isRunning}
              >
                Сбросить симуляцию
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Интерактивная модель распространения эпидемии с настраиваемыми параметрами.
        </p>
      </footer>
    </div>
  );
}

export default App;
