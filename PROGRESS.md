# PROGRESS.md — ShiftSim Factory

Log de execuções autónomas do Bot Orquestrador (modelos free: `opencode/hy3-free`).

## Round 56 — 2026-08-22
**Objetivo:** Auditar e corrigir as strings hardcoded remanescentes em `WorkforcePlanning.tsx`, `Comparison.tsx` e `Reports.tsx` (últimas páginas pendentes da migração i18n).

**Contexto:** O `grep -rn "lang === " src` só retorna `Layout.tsx` e `Settings.tsx` (ambos são o seletor de idioma, não strings de UI). As três páginas já usavam massivamente `t.*`, mas restavam algumas strings literais quebrando a experiência fora de PT/EN.

**O que foi feito:**
- **`src/pages/WorkforcePlanning.tsx`:** substituída a string literal `"pessoas"` por `t.workforcePlanning.people` (chave já existente); as descrições das regras de pessoal (`DEFAULT_STAFFING_RULES` e regras personalizadas) passaram a respeitar `lang` (`descriptionEn` para `en`, `description` para as restantes) em vez de mostrar sempre PT.
- **`src/pages/Comparison.tsx`:** a legenda do padrão `title="Day N: X"` passou a `t.comparison.dayLabel` (template `Dia {n}`/`Day {n}`/`Jour {n}`/`Tag {n}`), adicionada a chave `dayLabel` às 5 línguas.
- **`src/pages/Reports.tsx`:** confirmada já 100% em `t.reports.*`; os rótulos de formato (`PDF`/`Excel`/`CSV`/`JSON`) foram mantidos como identificadores de ficheiro (não são strings traduzíveis).
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:** adicionada a chave `comparison.dayLabel` (paridade mantida, validada por `tsc`).

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**.

**Decisão registada:** Auditoria i18n das páginas concluída — o projeto já não tem strings hardcoded de UI PT/EN fora do seletor de idioma. Próximos passos (ver `TODO.md` secção 2): revisar a qualidade das traduções em `es`/`fr`/`de` das secções recentes (`costCalculator`, `scheduleOptimizer`, `analyticsDashboard`, `workforcePlanning`, `comparison`).

## Round 55 — 2026-08-22
**Objetivo:** Finalizar e corrigir a ronda de migração i18n pendente no working tree (HelpPage, ScheduleOptimizer, AnalyticsDashboard, ScheduleTemplates, Layout) e o novo motor `scheduleOptimizer`, deixando o projeto a compilar e com os testes a passar, depois fazer push.

**Contexto:** O working tree tinha um conjunto de alterações não commitadas de uma ronda anterior interrompida, num estado **quebrado**: (1) a secção `scheduleOptimizer` tinha sido adicionada em duplicado em `src/i18n/locales/{pt,en,es,fr,de}.ts` (TS1117 — objeto com chave repetida); (2) `src/utils/scheduleOptimizer.ts` referenciava `calculateScore(...)` que não estava definida (TS2304); (3) o teste `src/utils/__tests__/scheduleOptimizer.test.ts` usava `first.description` num tipo que passou a ter `descriptionKey`. Além disso, `src/pages/ScheduleTemplates.tsx` ainda usava `name`/`nameEn`/`description`/`descriptionEn` hardcoded com ternários `lang === 'pt'`, apesar de as chaves `industry*Name`/`industry*Desc`/`template*` já existirem nos locales.

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:** removida a secção `scheduleOptimizer` duplicada (a pequena, incompleta) de cada ficheiro, mantida a secção completa (com `noScenario*`, `constraint*`, `suggestion*`, `alternativePattern*`). Paridade de chaves preservada nas 5 línguas.
- **`src/utils/scheduleOptimizer.ts`:** implementada `calculateScore(analysis)` (0–100, ponderada pelos `status` das constraints) usada por `generateAlternatives` e `optimizeSchedule`.
- **`src/utils/__tests__/scheduleOptimizer.test.ts`:** corrigido `first.description` → `first.descriptionKey`.
- **`src/pages/ScheduleTemplates.tsx`:** substituídas as strings hardcoded `name`/`nameEn`/`description`/`descriptionEn` e os ternários `lang === 'pt'` por chaves i18n existentes (`industry*Name`, `industry*Desc`, `template*`), via `nameKey`/`descKey` tipados (`StKey`); o nome do cenário importado passa a ser a tradução atual.
- **`src/Layout.tsx`:** seletor de feriados agora reutiliza `t.calendar.months` (removeu array PT hardcoded).
- **`src/pages/HelpPage.tsx`, `src/pages/ScheduleOptimizer.tsx`, `src/pages/AnalyticsDashboard.tsx`:** concluídas as migrações i18n iniciadas na ronda anterior (uso de `t.helpPage.*`, `t.scheduleOptimizer.*`, `t.analyticsDashboard.*`).

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**.

**Decisão registada:** Migração i18n de HelpPage/ScheduleOptimizer/AnalyticsDashboard/ScheduleTemplates/Layout concluída e estado quebrado corrigido. Próximos passos (ver `TODO.md`): auditar `WorkforcePlanning.tsx`, `Comparison.tsx` e `Reports.tsx` quanto a strings hardcoded PT/EN.

## Round 54 — 2026-08-21
**Objetivo:** Migrar as strings hardcoded de `src/pages/CostCalculator.tsx` para o sistema i18n, removendo todos os ternários `lang === 'pt' ? ... : ...` e garantindo paridade de chaves em 5 línguas.

**Contexto:** `CostCalculator.tsx` era o pior ofensor do projeto — **~55 ternários** `lang === 'pt'` espalhados por todo o componente (título, subtítulo, rótulos de configuração salarial, notas legais, cartões de resumo, tabela de detalhe, gráficos, projeção mensal, distribuição de custos, comparação entre equipas e resumo anual). O componente não usava `t()` — apenas `lang` para selecionar manualmente entre PT e EN, quebrando a experiência em `es`/`fr`/`de`.

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:**
  - Adicionada a secção `costCalculator` (35 chaves: `title`, `subtitle`, `scenario`, `teams`, `payConfig`, `hourlyRate`, `nightPremium`, `holidayPremium`, `weekendPremium`, `numberOfTeams`, `notes`, `noteNight`, `noteHoliday`, `noteEstimated`, `hoursPerTeam`, `costPerTeam`, `totalCost`, `monthlyAvg`, `breakdownTitle`, `colType`, `colHours`, `colRate`, `colSubtotal`, `regular`, `night`, `holiday`, `weekend`, `totalPerTeam`, `monthlyProjection`, `costDistribution`, `teamComparison`, `annualSummary`, `totalTeams`, `costPerYear`, `costPerMonth`, `costPerDay`, `emptyState`) traduzida para as 5 línguas — paridade mantida (validada por `tsc`).
- **`src/pages/CostCalculator.tsx`:**
  - `const { t } = useI18n();` (removido `lang`);
  - Todos os ~55 ternários `lang === 'pt' ? ... : ...` substituídos por `t.costCalculator.*`;
  - Nomes dos meses na projeção mensal passam a vir de `t.calendar.months` (com `substring(0, 3)` para abreviaturas);
  - Labels dos dados do gráfico (pieData) migrados para `t.costCalculator.regular`/`night`/`holiday`/`weekend`;
  - Reutilizada chave `calendar.months` para projeção mensal.

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**.

**Decisão registada:** Migração de `CostCalculator.tsx` concluída. Próximos passos (ver `TODO.md`): migrar `AnalyticsDashboard.tsx` (pior ofensor restante: ~45 ternários), `HelpPage.tsx` (FAQ hardcoded), `ScheduleTemplates.tsx` (nomes de templates) e `Layout.tsx` (meses hardcoded do seletor de feriados).

## Round 53 — 2026-08-20
**Objetivo:** Migrar as strings hardcoded de `src/pages/HolidayCalendar.tsx` para o sistema i18n, removendo os ternários `lang === 'pt' ? ... : ...` (fallback apenas EN) e garantindo paridade de chaves em 5 línguas.

**Contexto:** `HolidayCalendar.tsx` tinha ~20 strings hardcoded (título, subtítulo, toasts, rótulos de UI, nomes dos meses via `MONTH_NAMES_PT`/`MONTH_NAMES_EN` e dias via `DAY_NAMES_PT`/`DAY_NAMES_EN`, legenda de tipos de feriado, arias de navegação) que quebravam a experiência em `es`/`fr`/`de`. Parte reutiliza chaves já existentes (`header.holidayNameRequired`/`holidayAdded`/`holidayRemoved`, `calendar.months`).

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:**
  - Adicionado `calendar.dayNames` (array de 7) em 5 línguas — reutilizável noutros componentes;
  - Adicionada a secção `holidayCalendar` (12 chaves: `title`, `subtitle`, `national`, `religious`, `regional`, `custom`, `prevMonthAria`, `nextMonthAria`, `addHoliday`, `newCustomHoliday`, `add`, `allHolidaysThisMonth`, `noHolidaysThisMonth`, `remove`) traduzida para as 5 línguas — paridade mantida (validada por `tsc`).
- **`src/pages/HolidayCalendar.tsx`:**
  - `const { t } = useI18n();` (removido `lang`);
  - Removidas constantes `MONTH_NAMES_PT`/`MONTH_NAMES_EN`/`DAY_NAMES_PT`/`DAY_NAMES_EN`; `monthNames`/`dayNames` passam a vir de `t.calendar.months`/`t.calendar.dayNames`;
  - Toasts de erro/sucesso migrados para `t.header.holidayNameRequired`/`holidayAdded`/`holidayRemoved`;
  - `getTypeLabel` passou a mapear tipos para `t.holidayCalendar.*` (com fallback);
  - Todos os restantes ternários de UI/arias substituídos por `t.holidayCalendar.*`.

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**; `eslint` 0 erros (apenas warnings pré-existentes em testes de locales).

**Decisão registada:** Migração de `HolidayCalendar.tsx` concluída. Próximos passos (ver `TODO.md`): migrar as restantes páginas (`WorkforcePlanning`, `HelpPage`, `ScheduleOptimizer`, `Comparison`, `Reports`, `ScheduleTemplates`, `CostCalculator`, `AnalyticsDashboard`) e reaproveitar `calendar.months` no `Layout.tsx`.

## Round 52 — 2026-08-20
**Objetivo:** Migrar as strings hardcoded de `src/pages/TeamRoster.tsx` para o sistema i18n, removendo os ternários `lang === 'pt' ? ... : ...` (fallback apenas EN) e garantindo paridade de chaves em 5 línguas.

**Contexto:** `TeamRoster.tsx` tinha ~25 strings hardcoded (título, subtítulo, legenda de turnos, rótulos de UI, nomes dos meses via `MONTH_NAMES_PT`/`MONTH_NAMES_EN`, toasts/estados de seleção, resumo de equipa) que quebravam a experiência em `es`/`fr`/`de`. Parte mapeava para chaves já existentes (`calendar.morning`/`afternoon`/`night`/`off`, `calendar.months`), pelo que a tarefa incluiu uma nova secção `teamRoster` e reuso do array de meses.

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:**
  - Adicionada a secção `teamRoster` (11 chaves: `title`, `subtitle`, `teams`, `noScenarios`, `team`, `off`, `selectScenario`, `work`, `days`, `mornings`, `afternoons`, `nights`) com tradução para as 5 línguas — paridade mantida (validada por `tsc`).
- **`src/pages/TeamRoster.tsx`:**
  - `const { t } = useI18n();` (removido `lang`);
  - `monthNames` passou a vir de `t.calendar.months` (fim do hardcoded `MONTH_NAMES_PT`/`MONTH_NAMES_EN`); constantes removidas;
  - Legenda de turnos migrada para `t.calendar.morning`/`afternoon`/`night`/`off`;
  - Todos os restantes ternários de UI substituídos por `t.teamRoster.*` (título, subtítulo, rótulo de "equipas", ausência de cenários, cabeçalho "Equipa"/"Folgas", tooltip do turno, cartões de resumo: "Equipa", "Trabalho", "dias", "Manhas"/"Tardes"/"Noites").

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**; `eslint` 0 erros.

**Decisão registada:** Migração de `TeamRoster.tsx` concluída. Próximos passos (ver `TODO.md`): migrar as restantes páginas (`WorkforcePlanning`, `HelpPage`, `ScheduleOptimizer`, `Comparison`, `Reports`, `ScheduleTemplates`, `HolidayCalendar`, `CostCalculator`, `AnalyticsDashboard`) e reaproveitar `calendar.months` no `Layout.tsx`.

## Round 51 — 2026-08-20
**Objetivo:** Migrar as strings hardcoded de `src/pages/Settings.tsx` para o sistema i18n, removendo os ternários `lang === 'pt' ? ... : ...` (fallback apenas EN) e garantindo paridade de chaves em 5 línguas.

**Contexto:** `Settings.tsx` tinha ~40 strings hardcoded (títulos, ajudas, toasts de backup/restore/import/holiday/clear, rótulos de UI, nomes dos meses do seletor de feriados) que quebravam a experiência em `es`/`fr`/`de`. A maioria mapeava para chaves já existentes em `settings.*`/`header.*` (traduzidas), pelo que a tarefa foi sobretudo de substituição de consumo, com a adição de 6 chaves novas e do array `calendar.months`.

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:**
  - Adicionadas 6 chaves à secção `settings` (`backupSuccess`, `bulkImportInvalid`, `bulkImportError`, `confirmClearData`, `dataCleared`, `license`) com tradução para as 5 línguas — paridade mantida (validada por `tsc`);
  - Adicionado `calendar.months` (array de 12 nomes de mês) a todas as línguas — reutilizável também pelo seletor de feriados do `Layout.tsx` (pendente de migração).
- **`src/pages/Settings.tsx`:**
  - `const { lang, setLang, t } = useI18n();` (adicionado `t`);
  - `monthNames` agora vem de `t.calendar.months` (fim do hardcoded PT/EN);
  - Substituídos todos os ternários de UI por `t.settings.*` e de toasts por `t.settings.*` / `t.header.*` (reuso de chaves existentes: `backupSuccess`, `backupError`, `bulkImportSuccess`, `holidayNameRequired`, `holidayAdded`, `holidayRemoved`);
  - `{count}` resolvido via `.replace('{count}', ...)` em `backupCount` e `bulkImportSuccess`; `{age}` via `.replace('{age}', '')` em `lastAutoBackup`;
  - Mantidos os ternários de estilo dos botões de idioma (`lang === 'pt'`, etc.) — são de apresentação, não de texto.

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**; `eslint` 0 erros (warnings pré-existentes).

**Decisão registada:** Migração de `Settings.tsx` concluída. Próximos passos (ver `TODO.md`): migrar as restantes páginas (`WorkforcePlanning`, `HelpPage`, `ScheduleOptimizer`, `Comparison`, `TeamRoster`, `Reports`, `ScheduleTemplates`, `HolidayCalendar`, `CostCalculator`, `AnalyticsDashboard`) e reaproveitar `calendar.months` no `Layout.tsx`.

## Round 50 — 2026-08-19
**Objetivo:** Migrar as strings hardcoded de `src/components/ICSImporter.tsx` para o sistema i18n (secção `icsImporter`), mantendo a paridade de chaves em 5 línguas.

**Contexto:** `ICSImporter.tsx` tinha ~30 strings hardcoded em PT (labels, placeholders, aria-labels, mensagens de erro, estados de carregamento, relatório de conflitos, botões) que quebravam a experiência em `es`/`fr`/`de`. A secção `icsImporter` já existia em `pt/en/es/fr/de` (26 chaves), pelo que a maioria das substituições foi puramente de consumo. Foram adicionadas 4 chaves novas (`expandAria`, `collapseAria`, `conflictSummaryOk`, `conflictSummaryConflicts`) a todas as línguas para cobrir aria-labels e o resumo de conflitos.

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:** adicionadas 4 chaves à secção `icsImporter` (`expandAria`, `collapseAria`, `conflictSummaryOk`, `conflictSummaryConflicts`) com tradução para as 5 línguas — mantendo a paridade de chaves.
- **`src/components/ICSImporter.tsx`:**
  - Adicionado `import { useI18n } from '../i18n'` e `const { t } = useI18n();`
  - Substituídos todos os ~30 literais hardcoded por `t.icsImporter.*`;
  - `analyzeFile` e `handleFileSelect` passaram a depender de `t` (adicionado a `useCallback` deps);
  - `getConflictSummary` (utility) substituído por lógica inline usando `t.icsImporter.conflictSummaryOk` / `conflictSummaryConflicts` com `.replace('{count}'...)` / `.replace('{days}'...)` — mantendo o mesmo output em PT;
  - Removido `getConflictSummary` do import (função e testes preservados no utilitário);
  - `console.error('Error parsing ICS:', error)` mantido (log, não UI).

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham** (incluindo `ICSImporter.test.tsx` com `I18nProvider`); `eslint` 0 erros (37 warnings pré-existentes).

**Decisão registada:** Migração de `ICSImporter.tsx` concluída. Próximos passos (ver `TODO.md`): migrar as restantes páginas com `lang ===` hardcoded (Settings, CostCalculator, AnalyticsDashboard, Comparison, TeamRoster, Reports, ScheduleOptimizer, ScheduleTemplates, HolidayCalendar, WorkforcePlanning, HelpPage).

## Round 49 — 2026-08-19
**Objetivo:** Migrar as strings hardcoded de `src/Layout.tsx` (toasts de backup/restore/holiday e rótulos de UI) para o sistema i18n (`t.header.*`), removendo os ternários `lang === 'pt' ? ... : ...` (fallback apenas EN).

**Contexto:** `Layout.tsx` duplicava em hardcoded as chaves `header.*` que já existiam (e estavam traduzidas) em `pt/en/es/fr/de` — quebrando a experiência em `es`/`fr`/`de` nos toasts e nos painéis de idioma/feriados. As chaves já existiam em todas as línguas (paridade mantida), pelo que esta tarefa foi puramente de substituição de consumo.

**O que foi feito:**
- **`src/Layout.tsx`:** substituídos 16 ternários por `t.header.*`:
  - toasts: `backupSuccess`, `backupError`, `bulkImportNoScenarios`, `bulkImportError`, `bulkImportSuccess` (com `.replace('{count}', ...)`), `holidayNameRequired`, `holidayAdded`, `holidayRemoved`;
  - UI: `skipToMain`, `languageLabel`, `languageHelp`, `customHolidaysLabel`, `customHolidaysHelp`, `holidayNamePlaceholder`, `removeHoliday`, `noCustomHolidays`.
  - Mantido `lang` para o realce do botão de idioma ativo (não é string de display).
- **Nota:** os nomes dos meses do seletor de feriados (`Janeiro`...`Dezembro`) continuam hardcoded em PT — ficam fora do âmbito (requereriam novas chaves `header.months`); apontado para auditoria futura.

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**; as chaves `header.*` já tinham paridade em 5 línguas.

**Decisão registada:** Migração de `Layout.tsx` concluída. Próximos passos (ver `TODO.md`): `src/components/ICSImporter.tsx` (mensagens hardcoded + estabilidade jsdom), e auditoria completa dos restantes componentes.

## Round 48 — 2026-08-19
**Objetivo:** Migrar as strings hardcoded de `ScenarioForm.tsx` (label da descrição e placeholder das notas) para o sistema i18n (secção `form`), mantendo a paridade de chaves em 5 línguas.

**Contexto:** `ScenarioForm.tsx` usava ternários `lang === 'pt' ? ... : ...` (fallback EN) para a label "Descricao (opcional)" e o placeholder "Notas sobre este cenario...", quebrando a experiência em `es`/`fr`/`de`. O componente já usava `t.form.*` noutros campos; esta migração completa a secção `form` no formulário.

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:** adicionadas as chaves `description` e `placeholderNotes` à secção `form` com tradução para as 5 línguas — mantendo a paridade de chaves.
- **`src/components/ScenarioForm.tsx`:** substituídos os 2 ternários por `t.form.description` e `t.form.placeholderNotes`. Removido o `lang` não utilizado do `useI18n` (agora só `t`).

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**; `eslint` sem erros.

**Decisão registada:** O padrão de migração continua validado. Próximos passos (ver `TODO.md`): `Layout.tsx` (toasts duplicados), `ICSImporter.tsx` e auditar os restantes componentes.

## Round 47 — 2026-08-19
**Objetivo:** Migrar as strings hardcoded de `ImportPreview.tsx` para o sistema i18n (secção `importPreview`), mantendo a paridade de chaves em 5 línguas e os testes de `parseImportData` intactos.

**Contexto:** `ImportPreview.tsx` usava ternários `lang === 'pt' ? ... : ...` (fallback EN) para o título, total, valid/invalid, noScenarios, selectAllValid, cancel e o botão de importação — quebrando a experiência em `es`/`fr`/`de`. Os testes de `parseImportData` continuam a validar as mensagens de erro de validação (que permanecem em PT, fora do âmbito desta tarefa).

**O que foi feito:**
- **`src/i18n/locales/{pt,en,es,fr,de}.ts`:** nova secção `importPreview` (8 chaves: title, total, valid, invalid, noScenarios, selectAllValid, cancel, import) com tradução para as 5 línguas — mantendo a paridade de chaves (requisito de `tsc` e dos testes de paridade).
- **`src/components/ImportPreview.tsx`:** substituídos todos os 7 ternários por `t.importPreview.*`. O componente passa a usar `t` (em vez de `lang`). O botão de importação usa `t.importPreview.import.replace('{count}', String(selected.size))`, mantendo o plural correto por idioma.

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham** (incluindo `ImportPreview.test.tsx` e os testes de paridade `de`/`es`/`fr`); `eslint` sem erros (apenas warnings pré-existentes).

**Decisão registada:** O padrão de migração (chaves em 5 línguas + reutilização de `t.*`) continua validado. Próximos passos (ver `TODO.md`): migrar `ScenarioForm.tsx`, `Layout.tsx` (toasts duplicados), `ICSImporter.tsx` e auditar os restantes componentes.

## Round 46 — 2026-08-18
**Objetivo:** Migrar as strings hardcoded de `DashboardStats.tsx` para o sistema i18n, corrigindo simultaneamente a secção `dashboardStats` em falta em `de.ts` (que quebrava o `tsc -b`).

**Contexto:** O `pt.ts`/`en.ts`/`es.ts`/`fr.ts` já continham a secção `dashboardStats` (7 chaves), mas `de.ts` não a incluía, provocando erro `TS2741` e falha no `tsc -b`. A componente `DashboardStats.tsx` ainda usava ternários `lang === 'pt' ? ... : ...`, só com fallback para Inglês, ignorando `es`/`fr`/`de`.

**O que foi feito:**
- **`src/i18n/locales/de.ts`:** adicionada a secção `dashboardStats` (7 chaves: scenarios, totalTeams, avgHours, avgWeekends, avgOffDays, nightShifts, fridaysOff) com tradução para Alemão — restaurando a paridade de chaves com `pt` e eliminando o erro `TS2741`.
- **`src/components/DashboardStats.tsx`:** migradas as 7 strings hardcoded para `t.dashboardStats.*`. O componente passa a usar `t` em vez de `lang` (via `useI18n`), preservando a paridade de keys para todas as línguas.

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham** (incluindo os testes de paridade `de`/`es`/`fr` e os testes de `DashboardStats` que esperam strings em `pt`); `eslint` sem erros (apenas warnings pré-existentes).

**Decisão registada:** O patrão de migração (chaves em 5 línguas + reutilização de `t.*` no componente) continua validado. Próximos passos (ver `TODO.md`): migrar `ImportPreview.tsx`, `ScenarioForm.tsx`, `Layout.tsx` (toasts duplicados) e `ICSImporter.tsx`.

## Round 45 — 2026-08-18
**Objetivo:** Iniciar a migração das strings hardcoded (`lang === 'pt' ? 'PT' : 'EN'`) para o sistema i18n, começando por `ScheduleDiff.tsx`, e criar o `TODO.md` com o plano de migração pendente.

**Contexto:** O Round 44 deixou pendente migrar as strings hardcoded fora do i18n. Múltiplos componentes ainda usam ternários `lang === 'pt' ? ... : ...` que só fazem fallback para Inglês, quebrando a experiência em `es`/`fr`/`de`. Foi criado `TODO.md` a listar todos os ficheiros pendentes e o plano de trabalho.

**O que foi feito:**
- **`src/components/ScheduleDiff.tsx`:** todas as strings hardcoded migradas para `t.scheduleDiff.*`. Os rótulos de turno (`M/T/N/F`) passam a reutilizar as chaves já existentes `t.calendar.morning/afternoon/night/off` (evitando duplicação). O componente já não depende de `lang`, só de `t`.
- **`src/i18n/locales/pt.ts`:** nova secção `scheduleDiff` (10 chaves: title, selectA, selectB, days, same, different, day, colSame, valEqual, valDifferent, selectTwo).
- **`src/i18n/locales/en.ts`, `es.ts`, `fr.ts`, `de.ts`:** mesma secção `scheduleDiff` adicionada (paridade de chaves mantida — requisito dos testes de paridade e do `tsc`).
- **`TODO.md` (novo):** lista as melhorias pendentes, com foco na migração i18n ficheiro-a-ficheiro, na tradução das strings e na estabilização do `ICSImporter` em jsdom.

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham** (incluindo os 22 testes de i18n/paridade); `eslint` sem erros (apenas warnings pré-existentes).

**Decisão registada:** O padrão de migração está estabelecido e validado. Próximos passos (ver `TODO.md`): migrar `DashboardStats.tsx`, `ImportPreview.tsx`, `ScenarioForm.tsx`, `Layout.tsx` (toasts duplicados) e `ICSImporter.tsx`, adicionando sempre as chaves às 5 línguas.

## Round 44 — 2026-08-18
**Objetivo:** Corrigir a paridade de traduções dos ficheiros de locale (en/es/fr/de) que estavam incompletos face a `pt`, quebrando o `tsc -b`.

**Contexto:** O `tsc -b` falhava com erros `TS2740` porque `en`, `es`, `fr` e `de` (tipados como `Translations = typeof pt`) não continham 103 chaves presentes em `pt` — nomeadamente as chaves extra de `header`/`dashboard` e as secções inteiras `settings` e `icsImporter`. Sem isto, qualquer língua não-Portuguesa quebrasse a compilação.

**O que foi feito:**
- **`src/i18n/locales/en.ts`:** adicionadas as 103 chaves em falta (header extra, dashboard extra, secção `settings` completa, secção `icsImporter` completa) com traduções para Inglês.
- **`src/i18n/locales/es.ts`:** adicionadas as 103 chaves em falta com traduções para Espanhol.
- **`src/i18n/locales/fr.ts`:** adicionadas as 103 chaves em falta com traduções para Francês.
- **`src/i18n/locales/de.ts`:** adicionadas as 103 chaves em falta com traduções para Alemão.

**Verificação:** `tsc -b` passa (exit 0) — erros `TS2740` eliminados; `eslint` sem erros (apenas warnings pré-existentes); `vitest` → **591 passam**, **0 falham** (os testes de paridade `de`/`es`/`fr` contra `pt` continuam a passar).

**Decisão registada:** A paridade de locale (5 línguas × 220 chaves) está agora restaurada. Mantém-se pendente: (1) migrar as restantes strings hardcoded fora do sistema i18n para usar `t.*` (ex.: `lang === 'pt' ? 'PT' : 'EN'`, labels de gráficos, mensagens de erro do `ICSImporter`); (2) traduzir essas strings para `es`/`de`/`fr` para consistência total; (3) `ICSImporter.drop/jsdom` se ainda falhar.


## Round 43 — 2026-08-17
**Objetivo:** Adicionar a língua Alemã (`Deutsch / de`), a próxima candidata pendente do Round 42.

**O que foi feito:**
- **Novo ficheiro `src/i18n/locales/de.ts`:** tradução completa de todas as chaves (mesma estrutura de `pt.ts`) para Alemão.
- **Registo de `de`:** adicionado `'de'` ao tipo `Language`, a `SUPPORTED_LANGUAGES`, ao `import` e ao record `translations` em `src/i18n/index.tsx`. O `detectBrowserLanguage()` passa a detetar `de-DE`/`de` automaticamente.
- **Botões de seleção de idioma:** adicionado o botão `Deutsch` no `Layout.tsx` e no `Settings.tsx`, incluindo o respetivo estado ativo.
- **Labels hardcoded migrados para `de`:** as strings `lang === 'pt' ? 'Idioma' : ...` e a respetiva frase de ajuda nos seletores de idioma passam a incluir o ramo `lang === 'de' ? 'Sprache' : ...` (passo parcial da pendência de migração de strings hardcoded do Round 42).
- **Testes:** criado `src/i18n/locales/__tests__/de.test.ts` (paridade de chaves com `pt`, valores não-vazios, distinção do PT) — 3 testes. Em `src/i18n/__tests__/index.test.tsx`, corrigidas 2 suposições obsoletas (os testes de "idioma não suportado" usavam `de`, que agora é suportado — trocados para `it`/`it-IT`) e adicionados 3 testes (`de` via browser, `de` via localStorage, fallback `it`).

**Verificação:** `tsc -b` passa (exit 0); `eslint` sem erros (warnings preexistentes); `vitest` → **591 passam** (+5), **0 falham**.

**Decisão registada:** A alemã é a 5ª língua suportada (`pt`, `en`, `es`, `fr`, `de`). Mantém-se pendente: (1) migrar as restantes strings hardcoded fora do sistema i18n para usar `t.*` (ex.: `lang === 'pt' ? 'PT' : 'EN'`, labels de gráficos, mensagens de erro do `ICSImporter`); (2) traduzir essas strings hardcoded para `es`/`de`/`fr` para consistência total; (3) `ICSImporter.drop/jsdom` se ainda falhar.


## Round 42 — 2026-08-17
**Objetivo:** Detecção automática de idioma do browser + estabilização de testes pendentes.

**O que foi feito:**
- **Detecção de idioma do browser (`detectBrowserLanguage()`):** adicionada função exportada a `src/i18n/index.tsx` que lê `navigator.language`, extrai o código de língua (ex: `en-US` → `en`) e faz *match* contra as línguas suportadas (`pt`, `en`, `es`, `fr`).
- **Priorização de preferências:** o `I18nProvider` agora usa a ordem: (1) `localStorage` validado > (2) idioma do browser > (3) `pt` como fallback. Valor em `localStorage` que não seja uma língua suportada é ignorado (antes, qualquer string era usada sem validação).
- **`SUPPORTED_LANGUAGES`:** constante extraída para validar línguas em ambos os locais (localStorage + browser), evitando crashes se um valor inesperado for armazenado.
- **Testes para i18n:** 11 novos testes em `src/i18n/__tests__/index.test.tsx` cobrindo `detectBrowserLanguage` (4 línguas suportadas, fallback para 'pt', navegador vazio/undefined), `I18nProvider` (localStorage válido, fallback a browser, fallback para 'pt' quando localStorage tem língua inválida, throw quando `useI18n` fora do provider).
- **Fix test setup:** `src/test/setup.ts` define `window.navigator.language = 'pt-PT'` para que o ambiente jsdom (que por defeito usa `en-US`) mantenha comportamento consistente com os testes existentes.
- **Estabilização de `YearCalendarView.test.tsx`:** corrigido o teste "navigates to the previous and next year" — a função `clickYearButton` passava a usar o ano fixo `currentYear` mesmo após navegar para outro ano, causando `null` no `getByText`. Agora o ano é passado como parâmetro.

**Verificação:** `tsc -b` passa (exit 0); `eslint` sem erros (2 warnings preexistentes de `react-refresh/only-export-components`); `vitest` → **586 passam** (11 novos + 2 pré-existentes corrigidos), **0 falham**.

**Decisão registada:** O `fr.ts` já existe (não mencionado no PROGRESS.md Round 41) e passou o teste de paridade estrutural. A língua francesa já está registada em `i18n/index.tsx` e no `Layout.tsx`. Ficou pendente: migrar strings hardcoded (`lang === 'pt' ? 'PT' : 'EN'`) do i18n do `Layout.tsx`, `Dashboard.tsx`, `Settings.tsx`, páginas `CostCalculator`/`HolidayCalendar`/etc para usar `t.*` consistentemente.


## Melhorias pendentes / futuras
- ~~Estabilizar os 4 testes falhando (`ICSImporter` drop/jsdom e `YearCalendarView` seletor de ano/mobile)~~ — `YearCalendarView` corrigido (2 testes passam agora). `ICSImporter.drop/jsdom` permanece pendente se houver falhas.
- Traduzir para `es` os textos atualmente hardcoded (fora do sistema i18n) em vários componentes/páginas (ex.: mensagens de erro do `ICSImporter`, labels de gráficos, textos de ajuda) para que a troca para Espanhol seja 100% consistente.
- ~~Adicionar mais línguas~~ — `Français (fr)` e `Deutsch (de)` já adicionadas e testadas. Próxima candidata: `Italiano (it)`.
- ~~Detetar o idioma do browser~~ — Implementado em Round 42 (`detectBrowserLanguage()`).
- Expandir presets de cenários industriais em `src/data/presetScenarios.ts`.
- ~~Adicionar testes unitários para utilitários~~ — `shareScenario.ts` e `storageQuota.ts` já têm cobertura.
