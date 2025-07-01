import React, { useState, useRef } from 'react';
import './App.css';
import SimCanvas from './simCanvas';
import SettingsPanel from './SettingsPanel';
import StatsPanel from './StatsPanel';
import simulationConfig from './simulatiionConfig';

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
  
  // Начальная конфигурация симуляции
  const [config, setConfig] = useState(new simulationConfig({
    totalPeople: 100,
    infectedPeople: 3,
    infectivityPercent: 0.4,
    incubationPeriod: 2, 
    symptomaticPeriod: 3, 
    socialDistancePercent: 0.2,
    socialDistanceStrictness: 5,
    recoverySpeed: 3000,
    mortalityRate: 0.15,
    hospitalCapacityPercent: 0.4,
    recurrentInfection: true,
    reinfectionImmunityFactor: 0.5,
    width: 1400,
    height: 900,
    speed: 2
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
   * @param {Array} personsArray - Массив людей из симуляции
   */
  const handleStatsUpdate = (personsArray) => {
    setPersons(personsArray);
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
    setIsRunning(false);
    if (simCanvasRef.current) {
      simCanvasRef.current.resetSimulation();
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1>Модель распространения эпидемии</h1>
        <p>Интерактивная симуляция распространения эпидемии с настраиваемыми параметрами</p>
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
          Эта симуляция демонстрирует, как эпидемии распространяются в популяции 
          и как меры социального дистанцирования могут влиять на скорость ихраспространения.
        </p>
      </footer>
    </div>
  );
}

export default App;
