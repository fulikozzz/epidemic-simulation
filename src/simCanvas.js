import React, { useRef, useEffect } from 'react';
import Person from './person';
import simulationConfig from './simulatiionConfig';

const config = {
  distancingRate: 0.5,
  distancingStrictness: 0.5,
  infectivity: 0.3,
  incubationTime: 3000,
  symptomDuration: 5000,
  mortalityRate: 0.2,
  width: 800,
  height: 600,
  speed: 2
};

const colors = {
  healthy: '#4fd1c5',
  infected: '#f6e05e',
  symptomatic: '#f56565',
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

    const simConfig = new simulationConfig();

    const persons = [];
    for (let i = 0; i < simConfig.totalPeople; i++){
      const person = new Person(config);
      persons.push(person);
    }

    persons[0].status = 'symptomatic';
    persons[0].infectionStartTime = performance.now();
 
    personsRef.current = persons;

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const time = performance.now();

      for(const person of personsRef.current){
        person.move(canvasWidth, canvasHeight);
        //update
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
      case 'incubating': ctx.fillStyle = colors.incubating; break;
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
