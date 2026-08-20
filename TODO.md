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
- [ ] Restantes páginas (auditoria com `grep -rn "lang === " src`): `WorkforcePlanning.tsx`, `HelpPage.tsx`, `ScheduleOptimizer.tsx`, `Comparison.tsx`, `TeamRoster.tsx`, `Reports.tsx`, `ScheduleTemplates.tsx`, `HolidayCalendar.tsx`, `CostCalculator.tsx`, `AnalyticsDashboard.tsx`
- [ ] `src/Layout.tsx` — reaproveitar `calendar.months` nos nomes dos meses do seletor de feriados (hardcoded PT)

## 2. Traduzir as strings migradas
Após migrar, garantir tradução completa em `es`/`fr`/`de` (as chaves já foram criadas
em todas as línguas, mas revisar qualidade das traduções).

## 3. ICSImporter — estabilidade em jsdom
`ICSImporter.drop`/jsdom pode falhar nos testes (`src/components/__tests__/ICSImporter.test.tsx`).
**Resolvido:** os 4 testes de `ICSImporter` passam com `I18nProvider` (Round 50) — 591 passam, 0 falham. Não requer `it.skip`.

## 4. Cobertura de testes
- Manter `vitest` → 0 falhas após cada mudança.
- Adicionar teste de paridade de chaves se uma nova secção de locale for criada
  (padrão existente em `src/i18n/locales/__tests__/*`).

## 5. Documentação
- Manter `PROGRESS.md` atualizado por round.
- README: adicionar secção "Línguas suportadas" (pt/en/es/fr/de).
