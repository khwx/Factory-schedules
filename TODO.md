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
- [ ] `src/components/DashboardStats.tsx` — labels: Scenarios, Total Teams, Avg Hours, Avg Weekends, Avg Off Days, Night Shifts, Fridays Off
- [ ] `src/components/ImportPreview.tsx` — título, total, valid/invalid, noScenarios, selectAllValid, cancel, import N
- [ ] `src/components/ScenarioForm.tsx` — Description (optional), placeholder notes
- [ ] `src/Layout.tsx` — toasts de backup/restore/holiday já têm chaves `header.*` duplicadas em hardcoded; migrar para `t.header.*`
- [ ] `src/components/ICSImporter.tsx` — mensagens de erro hardcoded (ver pendência #3)
- [ ] Restantes: `ComparisonCharts`, `WorkloadHeatmap`, `MultiYearAnalysis`, `TeamAnalysis`, etc. (auditoria completa com `grep -rn "lang === " src --include=*.tsx --include=*.ts`)

## 2. Traduzir as strings migradas
Após migrar, garantir tradução completa em `es`/`fr`/`de` (as chaves já foram criadas
em todas as línguas, mas revisar qualidade das traduções).

## 3. ICSImporter — estabilidade em jsdom
`ICSImporter.drop`/jsdom pode falhar nos testes (`src/components/__tests__/ICSImporter.test.tsx`).
Investigar e estabilizar (ou marcar com `it.skip` justificado se dependência de ambiente).

## 4. Cobertura de testes
- Manter `vitest` → 0 falhas após cada mudança.
- Adicionar teste de paridade de chaves se uma nova secção de locale for criada
  (padrão existente em `src/i18n/locales/__tests__/*`).

## 5. Documentação
- Manter `PROGRESS.md` atualizado por round.
- README: adicionar secção "Línguas suportadas" (pt/en/es/fr/de).
