import React from 'react';
import { AdvancedMetrics } from '../types';
import { TrendingUp, Moon, Coffee, Calendar as CalendarIcon, Zap } from 'lucide-react';
import { useI18n } from '../i18n';

interface AdvancedMetricsDisplayProps {
    metrics: AdvancedMetrics;
    scenarioName: string;
}

const AdvancedMetricsDisplay: React.FC<AdvancedMetricsDisplayProps> = ({ metrics, scenarioName }) => {
    const { t } = useI18n();
    
    const title = t.advancedMetrics.title.replace('{scenarioName}', scenarioName);
    
    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">{title}</h3>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Consecutive Patterns */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CalendarIcon className="w-4 h-4 text-green-400" />
                        <h4 className="text-sm font-semibold text-gray-300">{t.advancedMetrics.restPatterns}</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.maxConsecutiveOffDays}</span>
                            <span className={`text-lg font-bold ${metrics.maxConsecutiveOffDays >= 5 ? 'text-green-400' : 'text-yellow-400'}`}>
                                {metrics.maxConsecutiveOffDays}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.miniVacations}</span>
                            <span className="text-lg font-bold text-blue-400">{metrics.miniVacations}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.isolatedOffDays}</span>
                            <span className={`text-sm font-mono ${metrics.isolatedOffDays > 20 ? 'text-red-400' : 'text-gray-400'}`}>
                                {metrics.isolatedOffDays}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Work Load */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-orange-400" />
                        <h4 className="text-sm font-semibold text-gray-300">{t.advancedMetrics.workLoad}</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.maxConsecutiveWorkDays}</span>
                            <span className={`text-lg font-bold ${metrics.maxConsecutiveWorkDays > 7 ? 'text-red-400' : 'text-green-400'}`}>
                                {metrics.maxConsecutiveWorkDays}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.totalNightShifts}</span>
                            <span className="text-lg font-bold text-purple-400">{metrics.totalNightShifts}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.nightShiftsPerMonth}</span>
                            <span className={`text-sm font-mono ${metrics.nightShiftsPerMonth > 10 ? 'text-red-400' : 'text-gray-400'}`}>
                                {metrics.nightShiftsPerMonth.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Night Shifts */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Moon className="w-4 h-4 text-indigo-400" />
                        <h4 className="text-sm font-semibold text-gray-300">{t.advancedMetrics.nightShiftImpact}</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.maxConsecutiveNightShifts}</span>
                            <span className={`text-lg font-bold ${metrics.maxConsecutiveNightShifts > 5 ? 'text-red-400' : metrics.maxConsecutiveNightShifts > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                                {metrics.maxConsecutiveNightShifts}
                            </span>
                        </div>
                        <div className="pt-2 border-t border-gray-700">
                            <div className="text-xs text-gray-500 mb-1">{t.advancedMetrics.healthImpact}</div>
                            <div className={`text-xs font-medium ${metrics.maxConsecutiveNightShifts === 0
                                ? 'text-gray-400'
                                : metrics.maxConsecutiveNightShifts > 5
                                    ? 'text-red-400'
                                    : metrics.maxConsecutiveNightShifts > 3
                                        ? 'text-yellow-400'
                                        : 'text-green-400'
                                }`}>
                                {metrics.maxConsecutiveNightShifts === 0
                                    ? t.advancedMetrics.healthImpactNone
                                    : metrics.maxConsecutiveNightShifts > 5
                                        ? t.advancedMetrics.healthImpactHigh
                                        : metrics.maxConsecutiveNightShifts > 3
                                            ? t.advancedMetrics.healthImpactMedium
                                            : t.advancedMetrics.healthImpactLow}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Life */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <Coffee className="w-4 h-4 text-pink-400" />
                        <h4 className="text-sm font-semibold text-gray-300">{t.advancedMetrics.socialLife}</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.fridayNightsOff}</span>
                            <span className="text-lg font-bold text-pink-400">{metrics.fridayNightsOff}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.saturdayNightsOff}</span>
                            <span className="text-lg font-bold text-pink-400">{metrics.saturdayNightsOff}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.sundayMorningsOff}</span>
                            <span className="text-lg font-bold text-blue-400">{metrics.sundayMorningsOff}</span>
                        </div>
                    </div>
                </div>

                {/* Holidays */}
                <div className="bg-gray-900/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                        <CalendarIcon className="w-4 h-4 text-yellow-400" />
                        <h4 className="text-sm font-semibold text-gray-300">{t.advancedMetrics.holidays}</h4>
                    </div>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.holidaysWorked}</span>
                            <span className={`text-lg font-bold ${metrics.holidaysWorked >= 10 ? 'text-green-400' : metrics.holidaysWorked >= 6 ? 'text-yellow-400' : 'text-gray-400'}`}>
                                {metrics.holidaysWorked}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-400">{t.advancedMetrics.holidaysOff}</span>
                            <span className="text-sm font-mono text-gray-400">
                                {metrics.holidaysOff}
                            </span>
                        </div>
                        {metrics.holidaysList && metrics.holidaysList.length > 0 && (
                            <div className="pt-2 border-t border-gray-700">
                                <div className="text-xs text-gray-500 mb-1">{t.advancedMetrics.holidaysFree}</div>
                                <div className="text-xs text-blue-400 max-h-20 overflow-y-auto">
                                    {metrics.holidaysList.join(', ')}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Score */}
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-lg p-4 md:col-span-2">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">{t.advancedMetrics.qualityIndicators}</h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                            {metrics.maxConsecutiveOffDays >= 5 ? (
                                <span className="text-green-400">✅</span>
                            ) : (
                                <span className="text-yellow-400">⚠️</span>
                            )}
                            <span className="text-xs text-gray-400">{t.advancedMetrics.restQuality}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {metrics.maxConsecutiveWorkDays <= 6 ? (
                                <span className="text-green-400">✅</span>
                            ) : (
                                <span className="text-red-400">❌</span>
                            )}
                            <span className="text-xs text-gray-400">{t.advancedMetrics.workBalance}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {metrics.nightShiftsPerMonth < 8 ? (
                                <span className="text-green-400">✅</span>
                            ) : (
                                <span className="text-yellow-400">⚠️</span>
                            )}
                            <span className="text-xs text-gray-400">{t.advancedMetrics.nightLoad}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {metrics.fridayNightsOff >= 40 ? (
                                <span className="text-green-400">✅</span>
                            ) : (
                                <span className="text-yellow-400">⚠️</span>
                            )}
                            <span className="text-xs text-gray-400">{t.advancedMetrics.socialLifeQuality}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvancedMetricsDisplay;
