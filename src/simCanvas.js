import React, { useRef, useEffect } from 'react';
import Person from './person';
import simulationConfig from './simulatiionConfig';

const colors = {
  healthy: '#4fd1c5',
  infected: '#ffa500',
  symptomatic: '#af2b1e',
  recovered: '#68d391',
  dead: '#718096',
  undefined: '#818589'
}

const SimCanvas = () => {
  const canvasRef = useRef(null);
  const personsRef = useRef([]);
  const canvasWidth = 800;
  const canvasHeight = 600;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const simConfig = new simulationConfig({
      totalPeople: 100,
      infectedPeople: 5,
      infectivityPercent: 0.3,
      incubationPeriod: 3000,
      symptomaticPeriod: 5000,
      socialDistancePercent: 0.3,
      socialDistanceStrictness: 0.3});

    const persons = [];
    for (let i = 0; i < simConfig.totalPeople; i++){
      const person = new Person(simConfig);
      persons.push(person);
    }

    persons[0].status = 'infected';
    persons[0].infectionStartTime = performance.now();
 
    personsRef.current = persons;

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const time = performance.now();

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
            
            // Если один человек инфекционный/симптоматический, а другой здоров, то пытаемся заразить
            if((person.status === 'infected' || person.status === 'symptomatic') && 
               otherPerson.status === 'healthy'){
              otherPerson.infect(time);
            }
            if((otherPerson.status === 'infected' || otherPerson.status === 'symptomatic') && 
               person.status === 'healthy'){
              person.infect(time);
            }
          }
        }

        drawPerson(ctx, person);
        console.table({
          id: person.id,
          status: person.status,
          position: person.position,
          velocity: person.velocity,
          dead: person.dead,
          distancing: person.distancing,
        });
      }
      
      requestAnimationFrame(draw);
    };

    draw();
  }, []);

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

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: '1px solid black' }} />
    </div>
  );
};

export default SimCanvas;
