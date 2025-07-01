export default class simulationConfig {
    totalPeople;            //* Всего людей (от 1 до 1000)
    infectedPeople;         //* Зараженных людей (от 1 до 1000)
    infectivityPercent;     //* Вероятность заражения при столкновении (от 0 до 1)
    incubationPeriod;       //* Период инкубации в днях (1 день = 5000мс)
    symptomaticPeriod;      //* Период симптомов в днях (1 день = 5000мс)
    incubationPeriodMin;    //* Минимальный инкубационный период (дни)
    incubationPeriodMax;    //* Максимальный инкубационный период (дни)
    symptomaticPeriodMin;   //* Минимальный симптоматический период (дни)
    symptomaticPeriodMax;   //* Максимальный симптоматический период (дни)
    socialDistancePercent;  //* Процент людей, которые будут держать дистанцию (от 0 до 1)
    socialDistanceStrictness; //* Строгость соблюдения дистанции (от 1 до 10)
    recoverySpeed;          //* Скорость выздоровления в мс
    mortalityRate;          //* Процент смертности (от 0 до 1)
    hospitalCapacityPercent; //* Процент заполненности больниц (от 0 до 1)
    recurrentInfection;     //* Возможность повторного заражения (boolean)
    reinfectionImmunityFactor; //* Коэффициент снижения вероятности при повторном заражении (от 0 до 1)
    width;                  //* Ширина канвы
    height;                 //* Высота канвы
    speed;                  //* Скорость симуляции

    constructor(param = {}) {
        this.totalPeople = param.totalPeople || 100; 
        this.infectedPeople = param.infectedPeople || 1;
        this.infectivityPercent = param.infectivityPercent || 0.3;
        this.incubationPeriod = param.incubationPeriod || 1; 
        this.symptomaticPeriod = param.symptomaticPeriod || 1; 
        this.incubationPeriodMin = param.incubationPeriodMin || 1;
        this.incubationPeriodMax = param.incubationPeriodMax || 5;
        this.symptomaticPeriodMin = param.symptomaticPeriodMin || 2;
        this.symptomaticPeriodMax = param.symptomaticPeriodMax || 7;
        this.socialDistancePercent = param.socialDistancePercent || 0.3;
        this.socialDistanceStrictness = param.socialDistanceStrictness || 5; 
        this.recoverySpeed = param.recoverySpeed || 3000;
        this.mortalityRate = param.mortalityRate || 0.2;
        this.recurrentInfection = param.recurrentInfection || false;
        this.hospitalCapacityPercent = param.hospitalCapacityPercent || 0.2;
        this.reinfectionImmunityFactor = param.reinfectionImmunityFactor || 0.5; 
        this.width = param.width || 800;
        this.height = param.height || 600;
        this.speed = param.speed || 1;
    }
    
    // Конвертация дней в миллисекунды
    getIncubationPeriodMs() {
        return this.incubationPeriod * 5000;
    }
        
    getSymptomaticPeriodMs() {
        return this.symptomaticPeriod * 5000;
    }
}
