import React, { useMemo } from 'react';
import { Scenario } from '../types';
import { validateLegalCompliance } from '../utils/legalValidator';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface LegalComplianceBannerProps {
    scenario: Scenario;
    year?: number;
}

const LegalComplianceBanner: React.FC<LegalComplianceBannerProps> = ({ scenario, year }) => {
    const reports = useMemo(
        () => validateLegalCompliance(scenario, year),
        [scenario, year]
    );

    const allTeamsPassed = reports.every(r => r.allPassed);
    const someTeamsFailed = reports.some(r => r.criticalFailures > 0);
    const totalFailures = reports.reduce((sum, r) => sum + r.criticalFailures, 0);

    const getResultIcon = (passed: boolean, isInformational: boolean) => {
        if (isInformational) return <Info className="w-4 h-4 text-blue-400" />;
        if (passed) return <CheckCircle className="w-4 h-4 text-green-400" />;
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
    };

    const getRowStyle = (passed: boolean, isInformational: boolean) => {
        if (isInformational) return 'text-blue-300';
        if (passed) return 'text-green-300';
        return 'text-red-300';
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-6">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {allTeamsPassed ? (
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                    ) : someTeamsFailed ? (
                        <ShieldAlert className="w-5 h-5 text-red-400" />
                    ) : (
                        <Shield className="w-5 h-5 text-yellow-400" />
                    )}
                    <h3 className="text-lg font-semibold text-white">
                        Conformidade Legal — Código do Trabalho
                    </h3>
                </div>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                    allTeamsPassed
                        ? 'bg-green-900 text-green-300'
                        : someTeamsFailed
                            ? 'bg-red-900 text-red-300'
                            : 'bg-yellow-900 text-yellow-300'
                }`}>
                    {allTeamsPassed
                        ? 'Conforme'
                        : someTeamsFailed
                            ? `${totalFailures} Falhas`
                            : 'A Verificar'}
                </span>
            </div>

            <div className="p-4 overflow-x-auto">
                {reports.map((report) => (
                    <div key={report.teamIndex} className="mb-4 last:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-white font-medium">{report.teamName}</span>
                            {report.allPassed ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                            )}
                            {report.criticalFailures > 0 && (
                                <span className="text-xs text-red-400">
                                    ({report.criticalFailures} falhas críticas)
                                </span>
                            )}
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 border-b border-gray-700">
                                    <th className="pb-2 pr-4">Regra</th>
                                    <th className="pb-2 pr-4">Artigo</th>
                                    <th className="pb-2 pr-4">Estado</th>
                                    <th className="pb-2">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {report.results.map((result) => {
                                    const isInfo = result.limit === undefined;
                                    return (
                                        <tr key={result.rule.id} className={`border-b border-gray-700/50 last:border-0 ${getRowStyle(result.passed, isInfo)}`}>
                                            <td className="py-2 pr-4 text-white">{result.rule.title}</td>
                                            <td className="py-2 pr-4 text-xs text-gray-500 font-mono">{result.rule.article}</td>
                                            <td className="py-2 pr-4">
                                                <span className="flex items-center gap-1">
                                                    {getResultIcon(result.passed, isInfo)}
                                                    <span className="text-xs">
                                                        {result.passed ? 'OK' : 'FALHA'}
                                                    </span>
                                                </span>
                                            </td>
                                            <td className="py-2 text-xs">
                                                {result.details}
                                                {result.actual !== undefined && (
                                                    <span className="ml-1 text-gray-500">
                                                        ({result.actual}{result.limit !== undefined ? ` / ${result.limit}` : ''})
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LegalComplianceBanner;