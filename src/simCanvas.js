import React, { useRef, useEffect, useImperativeHandle, forwardRef } from 'react';
import Person from './person';

const colors = {
  healthy: '#4fd1c5',
  infected: '#ffa500',
  symptomatic: '#af2b1e',
  recovered: '#68d391',
  dead: '#718096',
  undefined: '#818589'
}

const SimCanvas = forwardRef(({ config, onSimulationStateChange, onStatsUpdate }, ref) => {
  const canvasRef = useRef(null);
  const personsRef = useRef([]);
  const animationRef = useRef(null);
  const isRunningRef = useRef(false);

  // Определяем размеры канвы из конфига
  const canvasWidth = config.width || 1400;
  const canvasHeight = config.height || 900;

  // Методы для взаимодействия с родительским компонентом
  useImperativeHandle(ref, () => ({
    startSimulation: () => {
      isRunningRef.current = true;
      onSimulationStateChange?.(true);
      if (!animationRef.current) {
        draw();
      }
    },
    
    stopSimulation: () => {
      isRunningRef.current = false;
      onSimulationStateChange?.(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    },
    
    resetSimulation: () => {
      isRunningRef.current = false;
      onSimulationStateChange?.(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      initializeSimulation();
    },
    
    restartSimulation: (newConfig) => {
      // Это будет обработано useEffect при изменении конфига
    },
    
    getPersons: () => {
      return personsRef.current;
    }
  }));

  /**
   * Инициализирует симуляцию
   */
  const initializeSimulation = () => {
    // Массив людей
    const persons = [];  
    
    // Заполняем массив людей
    for (let i = 0; i < config.totalPeople; i++) {
      const person = new Person(config, i);
      persons.push(person);
    }

    // Устанавливаем начально инфецированных
    for (let i = 0; i < Math.min(config.infectedPeople, config.totalPeople); i++) {
      persons[i].status = 'infected';
      persons[i].infectionStartTime = performance.now();
    }
 
    personsRef.current = persons;
  };

  /**
   * Рисует симуляцию
   */
  const draw = () => {
    if (!isRunningRef.current) return; 
    
    const canvas = canvasRef.current; 
    const ctx = canvas.getContext('2d'); 
    
    ctx.clearRect(0, 0, canvasWidth, canvasHeight); 

    const time = performance.now(); // Время в миллисекундах

    // Движение и обновление состояния людей
    for(const person of personsRef.current){
      person.move(canvasWidth, canvasHeight);
      person.update(time);

      // Проверка столкновений с другими людьми
      for(const otherPerson of personsRef.current){
        if(person !== otherPerson && person.collidesWith(otherPerson)){
          // Вычисление расстояния между людьми
          const dx = otherPerson.position.x - person.position.x;
          const dy = otherPerson.position.y - person.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Получаем вектор нормали
          const nx = dx / distance; // косинус
          const ny = dy / distance; // синус
          
          // Разделение людей для предотвращения прилипания
          const overlap = (person.radius + otherPerson.radius) - distance; // Насколько круги перекрываются
          const separationX = nx * overlap / 2; // На сколько нужно сдвинуть людей
          const separationY = ny * overlap / 2; 
          
          person.position.x -= separationX; // Сдвигаем первого человека
          person.position.y -= separationY;
          otherPerson.position.x += separationX; // Сдвигаем второго человека
          otherPerson.position.y += separationY;
          
          // Реакция на столкновение
          // Вычисляем скалярное произведение вектора скорости людей с вектором нормали
          const scalar1 = person.velocity.dx * nx + person.velocity.dy * ny;
          const scalar2 = otherPerson.velocity.dx * nx + otherPerson.velocity.dy * ny;
          
          // Если скаляры разнознаковы, значит люди движутся навстречу друг другу
          if (scalar1 > 0 && scalar2 < 0) {
            person.velocity.dx -= 2 * scalar1 * nx;
            person.velocity.dy -= 2 * scalar1 * ny;
            otherPerson.velocity.dx -= 2 * scalar2 * nx;
            otherPerson.velocity.dy -= 2 * scalar2 * ny;
          }
          
          
          const canBeInfected = (p) =>
            p.status === 'healthy' || (p.status === 'recovered' && p.config.recurrentInfection);

          if((person.status === 'infected' || person.status === 'symptomatic') && canBeInfected(otherPerson)){
            otherPerson.infect(time);
          }
          if((otherPerson.status === 'infected' || otherPerson.status === 'symptomatic') && canBeInfected(person)){
            person.infect(time);
          }
        }
      }

      // Рисуем человека
      drawPerson(ctx, person);
    }
    
    // Обновление статуса для статистики
    if (onStatsUpdate) {
      const personsArray = [...personsRef.current];
      onStatsUpdate(personsArray);
    }
    
    animationRef.current = requestAnimationFrame(draw);
  };

  /**
   * Рисует человека
   * @param {CanvasRenderingContext2D} ctx - Контекст канвы
   * @param {Person} p - Человек
   */
  const drawPerson = (ctx, p) => {
    ctx.beginPath();
    ctx.arc(p.position.x, p.position.y, p.radius, 0, 2 * Math.PI);

    switch (p.status) {
      case 'healthy': ctx.fillStyle = colors.healthy; break;
      case 'infected': ctx.fillStyle = colors.infected; break;
      case 'symptomatic': ctx.fillStyle = colors.symptomatic; break;
      case 'recovered': ctx.fillStyle = colors.recovered; break;
      case 'dead': ctx.fillStyle = colors.dead; break;
      default: ctx.fillStyle = colors.undefined; break;
    }

    ctx.fill();
    ctx.stroke();
  };

  // Инициализация симуляции при монтировании компонента или изменении конфига
  useEffect(() => {
    initializeSimulation();
    
    // Очистка при размонтировании компонента
    return () => {
      if (animationRef.current) { 
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [config]); // Переинициализация при изменении конфига

  return (
    <div style={{ textAlign: 'center', marginTop: '20px'}}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }} />
    </div>
  );
});

export default SimCanvas;
