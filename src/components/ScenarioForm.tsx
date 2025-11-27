import React, { useState } from 'react';
import { Plus, HelpCircle } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioFormProps {
    onAdd: (scenario: Omit<Scenario, 'id'>) => void;
}

const ScenarioForm: React.FC<ScenarioFormProps> = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [teams, setTeams] = useState(4);
    const [shiftDuration, setShiftDuration] = useState(8);
    const [pattern, setPattern] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !pattern) return;

        onAdd({
            name,
            teams,
            shiftDuration,
            pattern: pattern.toUpperCase(),
        });

        // Reset form
        setName('');
        setPattern('');
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                Create New Scenario
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div className="lg:col-span-1">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Scenario Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., 4 Teams - Continental"
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Teams</label>
                    <input
                        type="number"
                        value={teams}
                        onChange={(e) => setTeams(Number(e.target.value))}
                        min={1}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Shift Duration (h)</label>
                    <input
                        type="number"
                        value={shiftDuration}
                        onChange={(e) => setShiftDuration(Number(e.target.value))}
                        step={0.5}
                        min={1}
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1 flex items-center gap-1">
                        Rotation Pattern
                        <div className="group relative">
                            <HelpCircle className="w-4 h-4 text-gray-500 cursor-help" />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2 bg-black text-xs text-gray-300 rounded hidden group-hover:block z-10">
                                Enter the sequence of shifts for ONE team. Use M (Morning), T (Afternoon), N (Night), F (Off). Example: MM TT NN FFFF
                            </div>
                        </div>
                    </label>
                    <input
                        type="text"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="e.g., MM TT NN FFFF"
                        className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 font-mono uppercase"
                        required
                    />
                </div>

                <div className="lg:col-span-5 flex justify-end mt-2">
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Scenario
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScenarioForm;
