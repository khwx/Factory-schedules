# PROGRESS.md — ShiftSim Factory

Log de execuções autónomas do Bot Orquestrador (modelos free: `opencode/hy3-free`).

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
- ~~Adicionar mais línguas~~ — `Français (fr)` já adicionada e testada. Próxima candidata: `Deutsch (de)`.
- ~~Detetar o idioma do browser~~ — Implementado em Round 42 (`detectBrowserLanguage()`).
- Expandir presets de cenários industriais em `src/data/presetScenarios.ts`.
- ~~Adicionar testes unitários para utilitários~~ — `shareScenario.ts` e `storageQuota.ts` já têm cobertura.
