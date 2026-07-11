import React, { useMemo, useState } from 'react';
import { Scenario } from '../types';
import { calculateEstimatedPay, formatCurrency, PayConfig, DEFAULT_PAY_CONFIG } from '../utils/payCalculator';
import { DollarSign, Moon, CalendarDays, TrendingUp } from 'lucide-react';

interface PayEstimateDisplayProps {
    scenario: Scenario;
    teamIndex?: number;
}

const PayEstimateDisplay: React.FC<PayEstimateDisplayProps> = ({ scenario, teamIndex = 0 }) => {
    const [hourlyRate, setHourlyRate] = useState(DEFAULT_PAY_CONFIG.hourlyRate);
    const [nightPremium, setNightPremium] = useState(DEFAULT_PAY_CONFIG.nightPremium);
    const [holidayPremium, setHolidayPremium] = useState(DEFAULT_PAY_CONFIG.holidayPremium);

    const config: PayConfig = useMemo(() => ({
        hourlyRate,
        nightPremium,
        holidayPremium,
        weekendPremium: 0,
    }), [hourlyRate, nightPremium, holidayPremium]);

    const teamName = `Equipa ${String.fromCharCode(65 + teamIndex)}`;
    const pay = useMemo(
        () => calculateEstimatedPay(scenario, teamIndex, config),
        [scenario, teamIndex, config]
    );

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">
                    Estimativa de Remuneracao — {teamName}
                </h3>
            </div>

            <div className="p-4">
                {/* Config inputs */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1" htmlFor="hourly-rate">
                            Valor/Hora (EUR)
                        </label>
                        <input
                            id="hourly-rate"
                            type="number"
                            value={hourlyRate}
                            min={0}
                            step={0.05}
                            onChange={(e) => setHourlyRate(Number(e.target.value))}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1" htmlFor="night-premium">
                            Premio Noturno (%)
                        </label>
                        <input
                            id="night-premium"
                            type="number"
                            value={nightPremium * 100}
                            min={0}
                            max={100}
                            step={5}
                            onChange={(e) => setNightPremium(Number(e.target.value) / 100)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1" htmlFor="holiday-premium">
                            Premio Feriado (%)
                        </label>
                        <input
                            id="holiday-premium"
                            type="number"
                            value={holidayPremium * 100}
                            min={0}
                            max={200}
                            step={10}
                            onChange={(e) => setHolidayPremium(Number(e.target.value) / 100)}
                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                    </div>
                </div>

                {/* Results grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-xs">Base</span>
                        </div>
                        <div className="text-lg font-bold text-white">{formatCurrency(pay.regularPay)}</div>
                        <div className="text-xs text-gray-500">{pay.regularHours}h</div>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <Moon className="w-4 h-4" />
                            <span className="text-xs">Noturno (+{Math.round(nightPremium * 100)}%)</span>
                        </div>
                        <div className="text-lg font-bold text-blue-400">{formatCurrency(pay.nightPay)}</div>
                        <div className="text-xs text-gray-500">{pay.nightHours}h</div>
                    </div>
                    <div className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <CalendarDays className="w-4 h-4" />
                            <span className="text-xs">Feriados (+{Math.round(holidayPremium * 100)}%)</span>
                        </div>
                        <div className="text-lg font-bold text-yellow-400">{formatCurrency(pay.holidayPay)}</div>
                        <div className="text-xs text-gray-500">{pay.holidayHours}h</div>
                    </div>
                    <div className="bg-green-900/30 p-3 rounded border border-green-700/50">
                        <div className="flex items-center gap-2 text-gray-400 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-xs">Total Anual</span>
                        </div>
                        <div className="text-lg font-bold text-green-400">{formatCurrency(pay.totalPay)}</div>
                        <div className="text-xs text-gray-500">{pay.totalHours}h / {formatCurrency(pay.monthlyAvg)}/mes</div>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mt-3">
                    * Valores estimados. Consulte o CCT aplicavel para percentuais exatas (Art. 226 CT: 25% noturno, Art. 269 CT: feriado a dobrar).
                </p>
            </div>
        </div>
    );
};

export default PayEstimateDisplay;