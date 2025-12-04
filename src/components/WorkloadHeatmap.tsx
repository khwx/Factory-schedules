import React, { useMemo } from 'react';
import { Scenario } from '../types';
import { generateYearCalendar } from '../utils/calendar';
import { Flame } from 'lucide-react';

interface WorkloadHeatmapProps {
    scenario: Scenario;
    year?: number;
}

const WorkloadHeatmap: React.FC<WorkloadHeatmapProps> = ({ scenario, year = new Date().getFullYear() }) => {
    const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    // Generate heatmap data
    const heatmapData = useMemo(() => {
        const calendar = generateYearCalendar(scenario, year);
        const monthlyData: { [key: number]: { work: number; off: number; nights: number } } = {};

        // Initialize months
        for (let i = 0; i < 12; i++) {
            monthlyData[i] = { work: 0, off: 0, nights: 0 };
        }

        // Count shifts per month
        calendar.forEach(day => {
            const month = day.date.getMonth();
            if (day.shift === 'F') {
                monthlyData[month].off++;
            } else {
                monthlyData[month].work++;
                if (day.shift === 'N') {
                    monthlyData[month].nights++;
                }
            }
        });

        return monthlyData;
    }, [scenario, year]);

    // Calculate intensity (0-100)
    const getIntensity = (monthData: { work: number, off: number, nights: number }) => {
        const workRatio = monthData.work / (monthData.work + monthData.off);
        const nightBonus = monthData.nights / monthData.work * 0.3; // Nights add intensity
        return Math.min(100, (workRatio + nightBonus) * 100);
    };

    // Get color based on intensity
    const getColor = (intensity: number) => {
        if (intensity > 80) return 'bg-red-600';
        if (intensity > 65) return 'bg-orange-500';
        if (intensity > 50) return 'bg-yellow-500';
        if (intensity > 35) return 'bg-green-500';
        return 'bg-blue-500';
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-700 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                <h3 className="text-lg font-semibold text-white">
                    Heatmap de Intensidade de Trabalho - {scenario.name} ({year})
                </h3>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-12 gap-2">
                    {Object.entries(heatmapData).map(([monthIdx, data]) => {
                        const intensity = getIntensity(data);
                        const color = getColor(intensity);

                        return (
                            <div key={monthIdx} className="flex flex-col items-center">
                                <div
                                    className={`w-full aspect-square ${color} rounded-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity`}
                                    title={`${MONTH_NAMES[parseInt(monthIdx)]}: ${data.work} dias de trabalho, ${data.nights} noites, ${data.off} folgas - Intensidade: ${intensity.toFixed(0)}%`}
                                >
                                    {intensity.toFixed(0)}%
                                </div>
                                <span className="text-xs text-gray-400 mt-1">{MONTH_NAMES[parseInt(monthIdx)]}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>Leve (&lt;35%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Moderado (35-50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                        <span>Médio (50-65%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded"></div>
                        <span>Alto (65-80%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-600 rounded"></div>
                        <span>Intenso (&gt;80%)</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkloadHeatmap;
