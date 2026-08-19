# PROGRESS.md — ShiftSim Factory

Log de execuções autónomas do Bot Orquestrador (modelos free: `opencode/hy3-free`).

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
