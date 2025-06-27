//import { genRandomPosition, genRandomVelocity } from './utils';

class person {
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
        this.infectionTime = null;
    
        // Время начала симптомов
        this.symptomStartTime = null;
    
        // Конфигурация параметров модели
        this.config = config;
    
        // Флаг иммунитета после выздоровления
        this.immune = false;
    
        // Флаг смерти 
        this.dead = false;
    
        // Социальное дистанцирование — булевское значение с вероятностью из конфига
        this.distancing = Math.random() < config.distancingRate;
      }

      // Метод движения шарика по экрану
      move(canvasWidth, canvasHeight){
        // Если человек умер, то он не двигается
        if(this.dead) return;

        let dx = this.velocity.dx;
        let dy = this.velocity.dy;

        // Снижаем скорость при соблюдении соц дистанции
        if(this.distancing){
            dx *= this.config.distancingStrictness;
            dy *= this.config.distancingStrictness;
        }
        
        // Обновляем позицию
        this.position.x += dx;
        this.position.y += dy;

        // Проверка границ экрана
        if(this.position.x - this.radius <= 0 || this.position.x + this.radius > canvasWidth){
            this.velocity.dx *= -1;
        }
        if(this.position.y - this.radius <= 0 || this.position.y + this.radius > canvasHeight){
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
    

}

export default person;