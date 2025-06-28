//import { genRandomPosition, genRandomVelocity } from './utils';

class Person {
    constructor(config, id) {
        // ID человека
        this.id = id || Math.random().toString(36).substring(2, 9);
    
        // Радиус человека на экране
        this.radius = 15;
    
        // Случайная начальнаяпозиция
        this.position = this.genRandomPosition(config.width, config.height);
    
        // Случайная начальная скорость
        this.velocity = this.genRandomVelocity(config.speed);
    
        // Статус здоровья
        this.status = 'healthy';
    
        // Время заражения
        this.infectionStartTime = null;
    
        // Время начала симптомов
        this.symptomStartTime = null;
    
        // Конфигурация параметров модели
        this.config = config;
    
        // Флаг иммунитета после выздоровления
        this.immune = false;
    
        // Флаг смерти 
        this.dead = false;
    
        // Социальное дистанцирование — булевское значение с вероятностью из конфига
        this.distancing = Math.random() < config.socialDistancePercent;

      }

      // Метод движения шарика по экрану
      move(canvasWidth, canvasHeight){
        // Если человек умер, то он не двигается
        if(this.dead) return;

        // Вектор скорости
        let dx = this.velocity.dx;
        let dy = this.velocity.dy;

        // Снижаем скорость при соблюдении соц дистанции
        if(this.distancing){
            dx *= 1 - this.config.socialDistanceStrictness;
            dy *= 1 - this.config.socialDistanceStrictness;
        }
        
        // Обновляем позицию
        this.position.x += dx;
        this.position.y += dy;

        // Проверка границ экрана и корректировка позиции
        if(this.position.x - this.radius < 0){
            this.position.x = this.radius;
            this.velocity.dx *= -1;
        }
        if(this.position.x + this.radius > canvasWidth){
            this.position.x = canvasWidth - this.radius;
            this.velocity.dx *= -1;
        }
        if(this.position.y - this.radius < 0){
            this.position.y = this.radius;
            this.velocity.dy *= -1;
        }
        if(this.position.y + this.radius > canvasHeight){
            this.position.y = canvasHeight - this.radius;
            this.velocity.dy *= -1;
        }
        
      }

    genRandomPosition(canvasWidth, canvasHeight){
        return {
            x: Math.random() * (canvasWidth - 2 * this.radius) + this.radius,
            y: Math.random() * (canvasHeight- 2 * this.radius) + this.radius
        }
    }
    
    genRandomVelocity(speed){
        const angle = Math.random() * 2 * Math.PI;
        return {
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed
        }
    }
    
    collidesWith(otherPerson){
        if(this.dead || otherPerson.dead) return false;
        
        const dx = this.position.x - otherPerson.position.x;
        const dy = this.position.y - otherPerson.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance <= this.radius + otherPerson.radius;
    }                                           

    // Метод попытки заразить текущего человека
    infect(currentTime) {
        // Если человек здоров и не имеет иммунитета
        if (this.status === 'healthy' && !this.immune) {
        // С вероятностью, заданной в конфиге, заражаем
            if (Math.random() < this.config.infectivityPercent) {
                this.status = 'infected';       // меняем статус на инкубацию
                this.infectionStartTime = currentTime; // сохраняем время заражения
            }
        }
    }

  // Обновление состояния по времени: переход из одной стадии в другую
  update(currentTime) {
    // Если инкубационный период завершён
    if (this.status === 'infected' && currentTime - this.infectionStartTime >= this.config.incubationPeriod) {
      this.status = 'symptomatic';      // переходим к симптоматическому периоду
      this.symptomStartTime = currentTime; // фиксируем время начала симптомов
    }

    // Если симптоматический период закончился
    if (this.status === 'symptomatic' && currentTime - this.symptomStartTime >= this.config.symptomaticPeriod) {
      // С вероятностью смертности человек умирает
      if (Math.random() < this.config.mortalityRate) {
        this.status = 'dead';
        this.dead = true;                // останавливаем движение
      } else {
        // Иначе выздоравливает и получает иммунитет
        this.status = 'recovered';
        this.immune = true;
      }
    }
  }
}

export default Person;