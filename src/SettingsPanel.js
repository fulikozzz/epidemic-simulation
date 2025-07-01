import React, { Component } from 'react';
import './SettingsPanel.css';
import simulationConfig from './simulatiionConfig';

export default class SettingsPanel extends Component {
    constructor(props) {
        super(props);
        
        // Бинды для сохранения контекста this
        this.handleSliderChange = this.handleSliderChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
        this.resetToDefaults = this.resetToDefaults.bind(this);
    }

    /**
     * Обновляет процентные параметры
     * @param {string} paramName - Обновляемый параметр
     * @param {Event} event - Событие изменения слайдера
     */
    handleSliderChange(paramName, event) {
        const value = parseFloat(event.target.value);
        this.updateConfig(paramName, value);
    }

    /**
     * Обновляет числовые параметры
     * @param {string} paramName - Обновляемый параметр
     * @param {Event} event - Событие изменения слайдера
     */
    handleInputChange(paramName, event) {
        const value = parseInt(event.target.value);
        this.updateConfig(paramName, value);
    }

    /**
     * Обновляет булевые параметры (checkbox)
     * @param {string} paramName - Обновляемый параметр
     * @param {Event} event - Событие изменения checkbox
     */
    handleCheckboxChange(paramName, event) {
        const value = event.target.checked;
        this.updateConfig(paramName, value);
    }

    /**
     * Обновляет конфигурацию 
     * @param {string} paramName - Обновляемый параметр
     * @param {number} value - Новое значение параметра
     */
    updateConfig(paramName, value) {
        const newConfig = { ...this.props.config };
        newConfig[paramName] = value;
        
        // Проверяем, что количество инфецированных не превышает общее кол-во
        if (paramName === 'totalPeople' && newConfig.infectedPeople > value) {
            newConfig.infectedPeople = value;
        }
        if (paramName === 'infectedPeople' && value > newConfig.totalPeople) {
            newConfig.infectedPeople = newConfig.totalPeople;
        }
        
        this.props.onConfigChange(newConfig);
    }

    
    /**
     *  Сброс параметров симуляции
    */ 
    resetToDefaults() {
        const defaultConfig = new simulationConfig({
            totalPeople: 100,
            infectedPeople: 1,
            infectivityPercent: 0.3,
            incubationPeriod: 3, 
            symptomaticPeriod: 5,
            socialDistancePercent: 0.3,
            socialDistanceStrictness: 5,    
            hospitalCapacityPercent: 0.2,
            recurrentInfection: false,
            reinfectionImmunityFactor: 0.5,
            width: 2400,
            height: 1200,
            speed: 1
        });
        this.props.onConfigChange(defaultConfig);
    }

    /** 
    * Форматирует время в днях
    * @param {number} days - Время в днях
    * @returns {string} Время в днях
    */
   formatTime(days) {
    return `${days} ${days === 1 ? 'день' : days >= 5  || days === 0 ? 'дней' : 'дня'}`;
    }

    /**
     * Форматирует проценты
     * @param {number} value - Значение между 0 и 1
     * @returns {string} Форматированное значение
     */
    formatPercentage(value) {
        return `${Math.round(value * 100)}%`;
    }

    /**
     * Рендерит панель настроек
     * @returns {JSX.Element} Панель настроек
     */
    render() {
        const { config, isRunning } = this.props;

        return (
            <div className="settings-panel">
                <h3>Параметры симуляции</h3>
                
                {/* Настройка болезни */}
                <div className="settings-section">
                    <h4>Настройка болезни</h4>
                    
                    {/* Слайдер заразности */}
                    <div className="setting-item">
                        <label htmlFor="infectivityPercent">
                            Заразность: {this.formatPercentage(config.infectivityPercent)}
                        </label>
                        <input
                            type="range"
                            id="infectivityPercent"
                            min="0.01"
                            max="1"
                            step="0.01"
                            value={config.infectivityPercent}
                            onChange={(e) => this.handleSliderChange('infectivityPercent', e)}
                            disabled={isRunning}
                        />
                        <span className="setting-description">
                            Вероятность заражения при контакте
                        </span>
                    </div>

                    {/* Слайдер инкубационного периода */}
                    <div className="setting-item">
                        <label htmlFor="incubationPeriod">
                            Инкубационный период: {this.formatTime(config.incubationPeriod)}
                        </label>
                        <input
                            type="range"
                            id="incubationPeriod"
                            min="1"
                            max="30"
                            step="1"
                            value={config.incubationPeriod}
                            onChange={(e) => this.handleInputChange('incubationPeriod', e)}
                            disabled={isRunning}
                        />
                        <span className="setting-description">
                            Количество дней от заражения до появления первых симптомов
                        </span>
                    </div>

                    {/* Слайдер симптоматического периода */}
                    <div className="setting-item">
                        <label htmlFor="symptomaticPeriod">
                            Симптоматический период: {this.formatTime(config.symptomaticPeriod)}
                        </label>
                        <input
                            type="range"
                            id="symptomaticPeriod"
                            min="1"
                            max="90"
                            step="1"
                            value={config.symptomaticPeriod}
                            onChange={(e) => this.handleInputChange('symptomaticPeriod', e)}
                            disabled={isRunning}
                        />
                        <span className="setting-description">
                            Количество дней проявления симптомов после инкубационного периода
                        </span>
                    </div>
                    
                    {/* Слайдер вероятности смерти */}
                    <div className="setting-item">
                        <label htmlFor="mortalityRate">
                            Вероятность летального исхода: {this.formatPercentage(config.mortalityRate)}
                        </label>
                        <input
                            type="range"
                            id="mortalityRate"
                            min="0.01"
                            max="1"
                            step="0.01"
                            value={config.mortalityRate}
                            onChange={(e) => this.handleSliderChange('mortalityRate', e)}
                            disabled={isRunning}
                            />
                        <span className="setting-description">
                            Вероятность летального исхода вследствие болезни
                        </span>
                    </div> 

                    {/* ЧБ возможности повторного заражения */}
                    <div className="setting-item">
                        <label htmlFor="recurrentInfection">
                            <input
                                type="checkbox"
                                id="recurrentInfection"
                                checked={config.recurrentInfection}
                                onChange={(e) => this.handleCheckboxChange('recurrentInfection', e)}
                                disabled={isRunning}
                            />
                            Возможность повторного заражения
                        </label>
                        <span className="setting-description">
                            Если включено, выздоровевшие люди могут заразиться снова
                        </span>
                    </div>

                    {/* Слайдер коэффициента иммунитета при повторном заражении */}
                    {config.recurrentInfection && (
                        <div className="setting-item">
                            <label htmlFor="reinfectionImmunityFactor">
                                Коэффициент иммунитета при повторном заражении: {this.formatPercentage(config.reinfectionImmunityFactor)}
                            </label>
                            <input
                                type="range"
                                id="reinfectionImmunityFactor"
                                min="0.05"
                                max="1"
                                step="0.05"
                                value={config.reinfectionImmunityFactor}
                                onChange={(e) => this.handleSliderChange('reinfectionImmunityFactor', e)}
                                disabled={isRunning}
                            />
                            <span className="setting-description">
                                Насколько снижается вероятность заражения при каждом повторном заражении. 0 = полный иммунитет, 1 = без изменений
                            </span>
                        </div>
                    )}
                </div>

                {/* Общее количество людей */}
                <div className="settings-section">
                    <h4>Настройка популяции</h4>
                    
                    {/* Слайдер общего количества людей */}
                    <div className="setting-item">
                        <label htmlFor="totalPeople">
                            Всего агентов: {config.totalPeople}
                        </label>
                        <input
                            type="range"
                            id="totalPeople"
                            min="1"
                            max="200"
                            value={config.totalPeople}
                            onChange={(e) => this.handleInputChange('totalPeople', e)}
                            disabled={isRunning}
                        />
                        <span className="setting-description">
                            Общее количество агентов симуляции
                        </span>
                    </div>
                
                    {/* Слайдер количества инфецированных людей */}
                    <div className="setting-item">
                            <label htmlFor="infectedPeople">
                                Изначально инфецированных: {config.infectedPeople}
                            </label>
                            <input
                                type="range"
                                id="infectedPeople"
                                min="1"
                                max={config.totalPeople}
                                value={config.infectedPeople}
                                onChange={(e) => this.handleInputChange('infectedPeople', e)}
                                disabled={isRunning}
                            />
                            <span className="setting-description">
                                Количество инфецированных агентов в начале симуляции
                            </span>
                        </div>     
               
                    <h4>Настройка социального поведения</h4>
                    
                    {/* Слайдер уровня соблюдения социального дистанцирования */}
                    <div className="setting-item">
                        <label htmlFor="socialDistancePercent">
                            Уровень соблюдения социального дистанцирования: {this.formatPercentage(config.socialDistancePercent)}
                        </label>
                        <input
                            type="range"
                            id="socialDistancePercent"
                            min="0.01"
                            max="1"
                            step="0.01"
                            value={config.socialDistancePercent}
                            onChange={(e) => this.handleSliderChange('socialDistancePercent', e)}
                            disabled={isRunning}
                        />
                        <span className="setting-description">
                            Процент людей, которые будут соблюдать социальную дистанцию
                        </span>
                    </div>

                    {/* Слайдер строгости соблюдения социального дистанцирования */}
                    <div className="setting-item">
                        <label htmlFor="socialDistanceStrictness">
                            Строгость социального дистанцирования: {config.socialDistanceStrictness}
                        </label>
                        <input
                            type="range"
                            id="socialDistanceStrictness"
                            min="1"
                            max="10"
                            step="1"
                            value={config.socialDistanceStrictness}
                            onChange={(e) => this.handleInputChange('socialDistanceStrictness', e)}
                            disabled={isRunning}
                        />
                        <span className="setting-description">
                            Насколько строго будут соблюдаться правила социальной дистанции: 1 - не будет соблюдаться, 10 - соблюдается строго, перемещение ограничено.
                        </span>
                    </div>
                    
                    <h4>Инфраструктура</h4>
                    
                    {/* Слайдер уровня заполненности больниц */}
                    <div className="setting-item">
                        <label htmlFor="hospitalCapacityPercent">
                            Уровень заполненности больниц: {this.formatPercentage(config.hospitalCapacityPercent)}
                        </label>
                        <input
                            type="range"
                            id="hospitalCapacityPercent"
                            min="0.01"
                            max="1"
                            step="0.01"
                            value={config.hospitalCapacityPercent}
                            onChange={(e) => this.handleSliderChange('hospitalCapacityPercent', e)}
                            disabled={isRunning}
                        />
                        <span className="setting-description">
                            Уровень заполненности больниц и доступности медицинских услуг
                        </span>
                    </div>
                </div>
            </div>
        ); 
    }
}
