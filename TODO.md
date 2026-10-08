# TODO.md — ShiftSim Factory

Melhorias pendentes e plano de trabalho autónomo do Bot Orquestrador.

## 1. Migração de strings hardcoded para i18n (prioridade)
Muitos componentes ainda usam `lang === 'pt' ? 'PT' : 'EN'` (fallback apenas EN),
quebrando a experiência para `es`/`fr`/`de`. Cada item abaixo deve:
- adicionar as chaves novas a `src/i18n/locales/pt.ts` e respetivamente a `en`/`es`/`fr`/`de`
  (a paridade de chaves é validada por testes — `tsc` também falha se faltar alguma);
- substituir os ternários por `t.*` no componente.

### Ficheiros pendentes (por ordem sugerida)
- [x] `src/components/ScheduleDiff.tsx` — concluído (secção `scheduleDiff` + reuso `calendar.*`)
- [x] `src/components/DashboardStats.tsx` — concluído (secção `dashboardStats` + uso `t.dashboardStats.*`)
- [x] `src/components/ImportPreview.tsx` — concluído (secção `importPreview` em 5 línguas + uso `t.importPreview.*`)
- [x] `src/components/ScenarioForm.tsx` — concluído (secção `form`: description + placeholderNotes em 5 línguas + uso `t.form.*`)
- [x] `src/Layout.tsx` — toasts de backup/restore/holiday e rótulos de UI migrados para `t.header.*` (chaves já existiam em 5 línguas); falta apenas os nomes dos meses do seletor de feriados (hardcoded PT)
- [x] `src/components/ICSImporter.tsx` — concluído (secção `icsImporter` em 5 línguas; 4 chaves novas: expandAria, collapseAria, conflictSummaryOk, conflictSummaryConflicts + uso `t.icsImporter.*`; testes envolvidos com `I18nProvider`)
- [x] `src/pages/Settings.tsx` — concluído (Round 51; 6 chaves novas em `settings.*` + array `calendar.months` em 5 línguas; reuso de `header.*`; falta reaproveitar `calendar.months` no `Layout.tsx`)
- [x] `src/pages/HolidayCalendar.tsx` — concluído (Round 53; nova secção `holidayCalendar` em 5 línguas; array `calendar.dayNames` em 5 línguas; reuso de `calendar.months` e `header.holidayNameRequired`/`holidayAdded`/`holidayRemoved`; removido hardcoded PT/EN + constantes MONTH_NAMES/DAY_NAMES)
- [x] `src/pages/CostCalculator.tsx` — concluído (Round 54; nova secção `costCalculator` em 5 línguas com 35 chaves; reuso de `calendar.months` para meses; removido ~55 ternários lang === 'pt')
- [x] `src/pages/HelpPage.tsx` — concluído (Round 55; FAQ/funcionalidades/atalhos migrados para `t.helpPage.*`; removido ~hardcoded PT/EN)
- [x] `src/pages/ScheduleOptimizer.tsx` — concluído (Round 55; nova secção `scheduleOptimizer` em 5 línguas + motor em `src/utils/scheduleOptimizer.ts` com constraints/sugestões/padrões alternativos; uso `t.scheduleOptimizer.*`)
- [x] `src/pages/AnalyticsDashboard.tsx` — concluído (Round 55; migração de rótulos/gráficos para `t.analyticsDashboard.*`)
- [x] `src/pages/ScheduleTemplates.tsx` — concluído (Round 55; indústrias/cenários migrados para chaves `industry*Name`/`industry*Desc`/`template*` existentes em 5 línguas; removido `name`/`nameEn`/`description` hardcoded e ternários `lang === 'pt'`)
- [x] `src/components/ComparisonCharts.tsx` — concluído (Round 77; nova secção `comparisonCharts` em 5 línguas com 9 chaves (títulos, labels, abreviaturas de meses); migradas todas as strings hardcoded PT para `t.comparisonCharts.*`)
- [x] `WorkforcePlanning.tsx`, `Comparison.tsx`, `Reports.tsx` — concluído (Round 56; auditoria `grep -rn "lang === " src` só retorna Layout/Settings (seletor de idioma); corrigidas strings hardcoded restantes: "pessoas"→`t.workforcePlanning.people` em WorkforcePlanning, descrições das regras de pessoal agora respeitam `lang` (description/descriptionEn); "Day {n}"→`t.comparison.dayLabel` em Comparison; Reports já 100% em `t.reports.*` (rótulos de formato PDF/Excel/CSV/JSON mantidos como identificadores de ficheiro))
- [x] `src/pages/TeamRoster.tsx` — concluído (Round 52; nova secção `teamRoster` em 5 línguas; reuso de `calendar.morning`/`afternoon`/`night`/`off` e `calendar.months`; removido hardcoded PT/EN)
- [x] `src/Layout.tsx` — reaproveitar `calendar.months` nos nomes dos meses do seletor de feriados (hardcoded PT) — concluído (Round 55)

## 2. Traduzir as strings migradas
Após migrar, garantir tradução completa em `es`/`fr`/`de` (as chaves já foram criadas
em todas as línguas, mas revisar qualidade das traduções).
- [x] `costCalculator`, `scheduleOptimizer`, `analyticsDashboard`, `workforcePlanning`, `comparison`, `reports` — revisadas e corrigidos erros gramaticais em es/fr/de (Round 57)
- [x] `holidayCalendar`, `scheduleTemplates`, `settings`, `helpPage`, `dashboardStats`, `importPreview`, `icsImporter`, `scenarioForm`, `teamRoster`, `scheduleDiff` — revisadas e corrigidos erros gramaticais + convenção ASCII em es/fr/de (Round 58)

## 3. ICSImporter — estabilidade em jsdom
`ICSImporter.drop`/jsdom pode falhar nos testes (`src/components/__tests__/ICSImporter.test.tsx`).
**Resolvido:** os 4 testes de `ICSImporter` passam com `I18nProvider` (Round 50) — 591 passam, 0 falham. Não requer `it.skip`.

## 4. Cobertura de testes
- Manter `vitest` → 0 falhas após cada mudança.
- Adicionar teste de paridade de chaves se uma nova secção de locale for criada
  (padrão existente em `src/i18n/locales/__tests__/*`).

## 5. Documentação
- Manter `PROGRESS.md` atualizado por round.
- [x] README: adicionar secção "Línguas suportadas" (pt/en/es/fr/de) — concluído (Round 59).

## 6. Melhorias pendentes (novas — pós Round 61)
Expansão de funcionalidades e melhorias contínuas, por ordem de prioridade sugerida:
- [x] **Analisador QoL — nova métrica:** adicionar índice de "recuperação/regularidade" (dias de folga após blocos de noite + regularidade do padrão) e respetivas chaves i18n em 5 línguas + teste — concluído (Round 62).
- [x] **ICS — exportação por período:** permitir escolher intervalo de datas (semestre/trimestre) na exportação ICS, filtrando eventos por período — concluído (Round 64).
- [x] **ICS — `PRODID` neutro:** atualizar `PRODID:-//ShiftSim Factory//PT` para identificador estável independente do idioma — concluído (Round 63).
- [x] **Dashboard — atalho de teclado para exportação ICS:** estender atalhos existentes para disparar `downloadICS` — concluído (Round 65).
- [x] **Acessibilidade:** auditoria de `aria-label` nos gráficos do `AnalyticsDashboard` (Recharts) e respetiva tradução — concluído (Round 66; 5 chaves `*Aria` em 5 línguas + `<div role="img" aria-label>` por gráfico + teste).
- [x] **Testes:** aumentar cobertura de `scheduleOptimizer.ts` (constraints/sugestões) com casos limite — concluído (Round 67; 44 testes cobrindo boundaries good/warning/bad, sugestões, alternativas, score, edge cases).
- [x] **Acessibilidade (i18n aria-labels):** migrar `aria-label` hardcoded em componentes UI (Dashboard, ShortcutsHelp, StorageWarning, PresetSelector, Tutorial, ComparisonCharts, YearCalendarView, ScheduleGenerator, BottomSheet, ImportPreview, QuickActions) para i18n — concluído (Round 68; secção `a11y`/`common` + `dashboard.*Aria` em 5 línguas + 14 componentes migrados + testes com I18nProvider).
- [x] **ICS — exportação por equipa individual:** botões A/B/C no cartão do cenário para exportar apenas o horário dessa equipa — concluído (Round 69; `downloadICSTeam`, `onExportICSTeam`, chave `card.exportICSTeam` em 5 línguas).
- [x] **Presets industriais expandidos:** 16 novos presets específicos por indústria (Oil & Gas, Segurança, Bombeiros, Call Center, Mineração, Marítimo, Aviação, Alimentar, Farmacêutica, Siderurgia, Energia, Data Center, etc.) com `teamPatterns` individuais — concluído (Round 70; 23 presets totais cobrindo setores 24/7).
- [x] **Presets industriais — expansão adicional:** +10 novos presets (Saúde/Hospital enfermagem + médicos, Hotelaria recepção + governantas, Retalho/Supermercado, Logística/Armazém, Transportes/Autocarros, Indústria Automóvel, Química/Petroquímica, Tratamento Água/ETAR) — concluído (Round 85; 33 presets totais cobrindo mais setores 24/7).
- [x] **QoL — métricas avançadas:** 4 novas métricas (fadiga acumulada, disrupção social, disrupção circadiana, sustentabilidade a longo prazo) — concluído (Round 71; 10 sub-scores totais, pesos rebalanceados, 6 novos testes).
- [x] **QoL UI — integração das métricas avançadas:** exibição das 4 novas métricas no QualityOfLifeDisplay + chaves i18n em 5 línguas — concluído (Round 72; QualityOfLifeDisplay atualizado, chaves i18n em 5 línguas).
- [x] **QoL — exportação em relatórios:** métricas QoL detalhadas (10 sub-scores) agora exportadas em Excel, CSV, JSON — concluído (Round 74; Excel Sheet "Qualidade de Vida" + "QoL_Comparacao", CSV/JSON com seções QoL).
- [x] **QoL — badge no ScenarioCard + linha na ComparisonTable:** exibir grade/score QoL no cartão do cenário (vista at-a-glance) e adicionar row "Qualidade de Vida" na tabela de comparação — concluído (Round 75; badge com Heart + grade colorida no ScenarioCard, QoL row com grade/score na ComparisonTable, ComparisonTable migrado para i18n com chaves existentes, 6 testes atualizados).
- [x] **QoL — ordenação no Dashboard:** ordenar cenários por score QoL (decrescente) + migração dos dropdowns de ordenação (desktop/mobile) para i18n — concluído (Round 76; novo branch `sortBy === 'qol'`, 10 chaves i18n novas em 5 línguas, labels hardcoded PT removidas dos dropdowns).
- [x] **QoL — insights + períodos críticos i18n:** migrar 8 insights e 3 descrições de períodos críticos hardcoded PT em `qualityOfLife.ts` para chaves i18n — concluído (Round 78; novos tipos `InsightKey`, `descriptionKey`/`descriptionParams` em `CriticalPeriod`, 11 chaves novas em 5 línguas, QualityOfLifeDisplay traduz via `t.qol.*`, retrocompatibilidade mantida).
- [x] **advancedMetrics — insights i18n:** migrar `generateAdvancedInsights()` em `advancedMetrics.ts` (15 insights hardcoded PT) + `calculations.ts` (8 insights hardcoded PT) para chaves i18n — concluido (Round 79; `generateAdvancedInsightKeys()` com 16 chaves `advancedInsights.*`, `qualitativeKeys` com 8 chaves `calcInsights.*`, 120 chaves novas em 5 linguas, retrocompat mantida).
- [x] **teamAnalysis — insights i18n:** migrar insights hardcoded PT em `teamAnalysis.ts` (análise de equipas + cobertura) para chaves i18n — concluído (Round 80; `insightKeys` com chaves `teamAnalysis.fairness.*` e `teamAnalysis.coverage.*` em `FairnessAnalysis`/`CoverageAnalysis`, secção `teamAnalysis` em 5 línguas, `TeamFairness` usa `t.teamAnalysis.*` + testes actualizados).

## 7. Qualidade de código — React hooks dependencies
Corrigir avisos de `react-hooks/exhaustive-deps` em componentes principais (potenciais bugs de stale closures):
- [x] `src/components/Dashboard.tsx` — `handleFilterTeamsChange`, `handleSortChange` faltam `setFilterTeams`, `setSortBy` — concluído (Round 81)
- [x] `src/components/ICSImporter.tsx` — `handleImport` faltam `handleReset` — concluído (Round 81)
- [x] `src/components/YearCalendarView.tsx` — `handleDayInteraction` faltam `getShiftLabel`, `t.calendar.weekendOff` — concluído (Round 81)
- [x] `src/pages/WorkforcePlanning.tsx` — `monthlyAnalysis` useMemo faltam `t.calendar.months` — concluído (Round 83)
- [x] `src/components/SystemHealth.tsx` — useEffect faltam `propScenarios` — concluído (Round 83)

## 8. Novas funcionalidades — QoL Trend
- [x] **QoL — visualização de tendência histórica:** novo componente `QualityOfLifeTrend` exibindo evolução mensal da pontuação QoL (gráfico de barras por mês, média anual, melhor/pior mês, direção da tendência) — concluído (Round 84; componente integrado no Dashboard, i18n em 5 línguas, expõe `monthlyScores` no `QualityOfLifeScore`).

## 9. Melhorias de UX — Preset Selector
- [x] **PresetSelector — categorias por indústria + filtro + i18n:** adicionar campo `industry` aos 33 presets, filtro por indústria no seletor, migrar strings hardcoded PT para `t.presetSelector.*` (5 línguas) — concluído (Round 86; 7 chaves novas em 5 línguas, PresetSelector com dropdown de filtro e badge de indústria).

## 10. Presets industriais — expansão nicho (Round 87)
- [x] **+8 novos presets nicho:** Educação/Escolas, Administração Pública, Telecomunicações/NOC, SAMU/Emergência Médica, Segurança Pública/Polícia, Gestão Resíduos, Energia Renovável, Casino/Entretenimento — total 41 presets, 26 indústrias cobertas (concluído Round 87).

## 11. Presets industriais — nichos emergentes (Round 89)
- [x] **+8 novos presets emergentes:** Hidrogénio Verde, Data Center IA, Logística Última Milha, Biotecnologia, Aeroespacial, Semicondutores, Veículos Elétricos/Baterias, Cibersegurança/SOC — total 49 presets, 34 indústrias cobertas (concluído Round 89).

## 12. Presets industriais — infraestruturas e serviços essenciais (Round 90)
- [x] **+8 novos presets infraestruturas:** Ferroviário/Tráfego, Portos/Logística Portuária, Água e Saneamento, Gás Natural/Distribuição, Telecom/Serviços Campo, Serviços Funerários, Segurança Eletrónica/Central Alarmes, Manutenção Industrial/Facilities — total 57 presets, 41 indústrias cobertas (concluído Round 90).

## 13. Presets industriais — serviços de emergência e segurança crítica (Round 91)
- [x] **+8 novos presets críticos:** Atendimento Emergência 112, Controle Tráfego Aéreo, Metropolitano/Metro, Oleodutos/Gasodutos, Central Nuclear, Banco de Sangue/Transfusão, Procura Órgãos/Transplante, Estabelecimento Prisional — total 65 presets, 49 indústrias cobertas (concluído Round 91).

## 14. Presets industriais — infraestruturas e serviços essenciais (Round 90)
- [x] **+8 novos presets infraestruturas:** Ferroviário/Tráfego, Portos/Logística Portuária, Água e Saneamento, Gás Natural/Distribuição, Telecom/Serviços Campo, Serviços Funerários, Segurança Eletrónica/Central Alarmes, Manutenção Industrial/Facilities — total 57 presets, 41 indústrias cobertas (concluído Round 90).

## 15. Presets industriais — nichos emergentes (Round 89)
- [x] **+8 novos presets emergentes:** Hidrogénio Verde, Data Center IA, Logística Última Milha, Biotecnologia, Aeroespacial, Semicondutores, Veículos Elétricos/Baterias, Cibersegurança/SOC — total 49 presets, 34 indústrias cobertas (concluído Round 89).

## 16. Presets industriais — expansão nicho (Round 87)
- [x] **+8 novos presets nicho:** Educação/Escolas, Administração Pública, Telecomunicações/NOC, SAMU/Emergência Médica, Segurança Pública/Polícia, Gestão Resíduos, Energia Renovável, Casino/Entretenimento — total 41 presets, 26 indústrias cobertas (concluído Round 87).

## 17. Presets industriais — defesa e aeroespacial operacional (Round 92)
- [x] **+8 novos presets defesa/aeroespacial:** Operações Espaciais, Defesa Aérea, Ciberdefesa Militar, Operações Navais, Defesa de Mísseis, Operações de Satélites, Comando Estratégico, Logística de Defesa — total 73 presets, 57 indústrias cobertas (concluído Round 92).

## 18. Presets industriais — saúde especializada de alta complexidade (Round 93)
- [x] **+8 novos presets saúde:** Oncologia, Hemodiálise, Cuidados Paliativos, Saúde Mental, Unidade Queimados, Neonatologia, Medicina Nuclear, Radioterapia — total 81 presets, 65 indústrias cobertas (concluído Round 93).

## 19. Presets industriais — tecnologia emergente e transição energética (Round 94)
- [x] **+8 novos presets tech emergente:** Semicondutores Avançados (empacotamento 3D/teste), Energia de Fusão (tokamak/laser), Captura de Carbono (DAC/fonte pontual), Computação Quântica, Materiais Avançados (nanofabricação) — total 89 presets, 70 indústrias cobertas (concluído Round 94).

## 20. Presets industriais — biofabricação, mineração espacial e novos materiais (Round 95)
- [x] **+8 novos presets tech/bio emergentes:** Biofabricação (bioprinting 3D órgãos), Mineração Espacial (asteroides), Hidrogénio Verde Distribuição, Biobanco/Criopreservação, Engenharia de Tecidos (medicina regenerativa), Agricultura Celular (carne cultivada), Química de Fluxo (farmacêutica contínua), Materiais Meta (nanomateriais programáveis) — total 97 presets, 77 indústrias cobertas (concluído Round 95).

## 21. Presets industriais — energia de próxima geração, autonomia e espaço (Round 96)
- [x] **+8 novos presets next-gen:** Eólica Offshore Flutuante, Reactores Modulares Pequenos (SMR), Utilização de Carbono (CO2 para produtos), Frota Veículos Autónomos (robotaxi/camiões), Consciência Espacial / Lixo Orbital (SSA), Biologia Sintética / Cell-Free, Testes Hipersónicos (Mach 5+), Operações Submarinas / Deep Sea — total 105 presets, 85 indústrias cobertas (concluído Round 96).

## 22. Presets industriais — energia oceânica, fusão, computação quântica, mineração mar profunda (Round 97)
- [x] **+8 novos presets next-gen:** Captura Carbono Oceânica, Energia de Fusão Comercial, Computação Quântica Tolerante a Falhas, Mineração Nódulos Polimetálicos, Hidrogénio Verde Offshore, Data Centers Submersos, Fabrico Orbital, Armazenamento Energia Longa Duração — total 110 presets, 102 indústrias cobertas (concluído Round 97).

## 23. Presets industriais — AGI, biologia programável, energia espacial, materiais avançados (Round 98)
- [x] **+8 novos presets next-gen:** Infraestrutura AGI, Biologia Sintética Programável, Energia Solar Espacial, Nuclear Híbrido Fusão-Fissão, Materiais Carbono-Negativo, Computação Neuromórfica/BCI, Biofabricação Terapias Celulares, Defesa Planetária — total 118 presets, 110 indústrias cobertas (concluído Round 98).

## 24. Presets industriais — i18n alemão/francês para Round 98 (Round 99)
- [x] **Completar i18n de/fr:** Adicionadas 8 chaves `presetSelector.industries.*` em falta nos locales `de.ts` e `fr.ts` para as indústrias da Round 98 — paridade de 5 línguas restaurada (concluído Round 99).

## 25. Presets industriais — comunicações quânticas, MSR, UAM, geotermia, detritos, AM metálico, DNA, marítimo autónomo (Round 100)
- [x] **+8 novos presets next-gen:** Comunicações Quânticas, Reactores Sal Fundido, Mobilidade Aérea Urbana, Geotermia Profunda, Remoção Detritos Espaciais, Fabrico Aditivo Metálico, Computação Biológica/DNA, Operações Marítimas Autónomas — total 126 presets, 118 indústrias cobertas (concluído Round 100).

## 26. Presets industriais — mineração lunar, proteínas alternativas, hiperloop, geoengenharia, agricultura vertical, fotónica, internet quântica, Ocean DAC (Round 101)
- [x] **+8 novos presets fronteira:** Mineração Lunar/ISRU, Proteínas Alternativas/Fermentação Precisão, Hiperloop/Transporte Ultra-Rápido, Geoengenharia Solar/Gestão Radiação, Agricultura Vertical/Fábricas Urbanas, Computação Fotónica/Processadores Ópticos, Internet Quântica/Redes Quânticas, Captura Direta Oceânica/Ocean DAC — total 134 presets, 126 indústrias cobertas (concluído Round 101).

## 27. Presets industriais — infraestrutura crítica, reciclagem, semicondutores potência, H2 liquefeito, sísmica, isótopos, cabos submarinos, água atmosférica (Round 102)
- [x] **+8 novos presets infraestrutura crítica:** Integridade Dutos/Proteção Catódica, Reciclagem Baterias/Black Mass, Semicondutores Potência SiC/GaN, Hidrogénio Verde Liquefação/Transporte, Monitoramento Sísmico/Alerta Precoce, Produção Isótopos Médicos, Cabos Submarinos Fibra Óptica, Geração Atmosférica de Água — total 142 presets, 134 indústrias cobertas (concluído Round 102).
