export default class simulationConfig {
    totalPeople;            // Всего людей (от 1 до 1000)
    infectedPeople;         // Зараженных людей (от 1 до 1000)
    infectivityPercent;     // Вероятность заражения при столкновении (от 0 до 1)
    incubationPeriod;       // Период инкубации в мс 
    symptomaticPeriod;      // Период симптомов в мс
    socialDistancePercent;  // Процент людей, которые будут держать дистанцию (от 0 до 1)
    socialDistanceStrictness; // Строгость соблюдения дистанции (от 0 до 1)
    recoverySpeed;            // Скорость выздоровления в мс
    deathPercent;             // Процент смертности (от 0 до 1)

    constructor(param = {}) {
        this.totalPeople = param.totalPeople || 100; 
        this.infectedPeople = param.infectedPeople || 1;
        this.infectivityPercent = param.infectivityPercent || 0.3;
        this.incubationPeriod = param.incubationPeriod || 3000;
        this.symptomaticPeriod = param.symptomaticPeriod || 5000;
        this.socialDistancePercent = param.socialDistancePercent || 0.3;
        this.socialDistanceStrictness = param.socialDistanceStrictness || 0.3;
    }
    
    // Вывод конфигурации для отладки
    logConfig(){
        console.table({
            totalPeople: this.totalPeople,
            infectedPeople: this.infectedPeople,
            infectivityPercent: this.infectivityPercent,
            incubationPeriod: this.incubationPeriod,
            symptomaticPeriod: this.symptomaticPeriod,
            socialDistancePercent: this.socialDistancePercent,
            socialDistanceStrictness: this.socialDistanceStrictness,
        })
    }
}
