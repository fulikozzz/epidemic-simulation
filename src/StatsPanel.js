import React, { Component } from 'react';
import './StatsPanel.css';

export default class StatsPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stats: {
                healthy: 0,
                infected: 0,
                symptomatic: 0,
                recovered: 0,
                dead: 0,
                total: 0
            }
        };
    }

    /**
     * Обновляет статистику когда изменяется состояние агентов
     * @param {Object} prevProps - Предыдущие параметры
     */
    componentDidUpdate(prevProps) {
        if (prevProps.persons !== this.props.persons) {
            this.updateStats();
        }
    }

    /**
     * Обновляет статистику
     */
    updateStats() {
        if (this.props.persons && this.props.persons.length > 0) {
            const stats = {
                healthy: 0,
                infected: 0,
                symptomatic: 0,
                recovered: 0,
                dead: 0,
                total: this.props.persons.length
            };

            this.props.persons.forEach(person => {
                switch (person.status) {
                    case 'healthy':
                        stats.healthy++;
                        break;
                    case 'infected':
                        stats.infected++;
                        break;
                    case 'symptomatic':
                        stats.symptomatic++;
                        break;
                    case 'recovered':
                        stats.recovered++;
                        break;
                    case 'dead':
                        stats.dead++;
                        break;
                    default:
                        break;
                }
            });

            this.setState({ stats });
        }
    }

    /**
     * Рассчитывает процент от общего количества
     * @param {number} count - Количество
     * @param {number} total - Общее количество
     * @returns {number} Процент
     */
    calculatePercentage(count, total) {
        if (total === 0) return 0;
        return Math.round((count / total) * 100);
    }

    /**
     * Рендерит статистику симуляции
     * @returns {JSX.Element} Элемент статистики
     */
    render() {
        const { stats } = this.state;

        return (
            <div className="stats-panel">
                <h3>Статистика симуляции</h3>
                
                <div className="stats-grid">
                    <div className="stat-item healthy">
                        <div className="stat-label">Здоровых</div>
                        <div className="stat-value">{stats.healthy}</div>
                        <div className="stat-percentage">
                            {this.calculatePercentage(stats.healthy, stats.total)}%
                        </div>
                    </div>

                    <div className="stat-item infected">
                        <div className="stat-label">Зараженных</div>
                        <div className="stat-value">{stats.infected}</div>
                        <div className="stat-percentage">
                            {this.calculatePercentage(stats.infected, stats.total)}%
                        </div>
                    </div>

                    <div className="stat-item symptomatic">
                        <div className="stat-label">С симптомами</div>
                        <div className="stat-value">{stats.symptomatic}</div>
                        <div className="stat-percentage">
                            {this.calculatePercentage(stats.symptomatic, stats.total)}%
                        </div>
                    </div>

                    <div className="stat-item recovered">
                        <div className="stat-label">Выздоровевших</div>
                        <div className="stat-value">{stats.recovered}</div>
                        <div className="stat-percentage">
                            {this.calculatePercentage(stats.recovered, stats.total)}%
                        </div>
                    </div>

                    <div className="stat-item dead">
                        <div className="stat-label">Умерших</div>
                        <div className="stat-value">{stats.dead}</div>
                        <div className="stat-percentage">
                            {this.calculatePercentage(stats.dead, stats.total)}%
                        </div>
                    </div>
                </div>
            </div>
        );
    }
} 