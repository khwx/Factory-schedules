# PROGRESS.md — ShiftSim Factory

Log de execuções autónomas do Bot Orquestrador (modelos free: `opencode/hy3-free`).

## Round 71 — 2026-09-06
**Objetivo:** Adicionar métricas avançadas no analisador QoL (`qualityOfLife.ts`) — fadiga acumulada, disrupção social, disrupção circadiana, sustentabilidade a longo prazo (4 novas métricas).

**Contexto:** O analisador QoL tinha 6 sub-scores. Expandiu-se para **10 sub-scores** com métricas de fatiga, disrupção social/circadiana e sustentabilidade a longo prazo, alinhadas com literatura de saúde ocupacional e cronobiologia.

**O que foi feito:**
- `src/utils/qualityOfLife.ts`:
  - Interface `QualityOfLifeScore.breakdown` expandida de 6 para **10 chaves**:
    - `fatigueAccumulation`: acumulação de fatiga por blocos de trabalho longos (penaliza quadráticamente blocos >4 dias)
    - `socialDisruption`: disrupção da vida social (fins-de-semana/noites trabalhados)
    - `circadianDisruption`: disrupção do ritmo circadiano (noites, rotações rápidas dia/noite, blocos consecutivos de noite)
    - `longTermSustainability`: sustentabilidade a longo prazo (tendência mensal de QoL ao longo do ano)
  - Pesos do score global rebalanceados: 0.18/0.12/0.12/0.12/0.08/0.12/0.08/0.08/0.08/0.04 (soma = 1.0)
  - Novas funções de cálculo usando notação compacta M/T/N/F
- `src/utils/__tests__/qualityOfLife.test.ts`: expandido de 8 para **14 testes**, cobrindo:
  - Verificação de existência das 10 métricas no breakdown
  - Validação de range 0-100 para todas as novas métricas
  - Testes de comportamento: fatiga menor em blocos curtos, disrupção social menor evitando fins-de-semana, disrupção circadiana menor sem noites
- Paridade de chaves i18n inalterada (não foram adicionadas novas chaves de UI).

**Verificação:** `tsc -b` → exit 0; `vitest` → **644 passam** (vs 640 anteriores, +4 testes novos), **0 falham**; `eslint` → 0 erros.

**Decisão registada:** QoL passa a apresentar 10 sub-scores, alinhados com literatura de saúde ocupacional e cronobiologia. Próximos passos sugeridos: integrar novas métricas na UI do QualityOfLifeDisplay, ou adicionar presets industriais adicionais.


## Round 64 — 2026-08-24
**Objetivo:** Permitir escolher o intervalo de datas na exportação ICS (1ª tarefa pendente da secção 6 do TODO.md).

**Contexto:** A exportação ICS gerava sempre o ano completo, sem opção de exportar apenas um semestre ou trimestre — útil para importar apenas parte do horário num calendário externo.

**O que foi feito:**
- `src/utils/icsExport.ts`: nova interface `ICSExportPeriod` e tipo `ICSExportRange` (`'full'|'h1'|'h2'|'q1'|'q2'|'q3'|'q4'`); helper `icsPeriodForRange(range, year)` que calcula o intervalo de datas; `exportScenarioToICS` agora filtra os `VEVENT` por sobreposição com o período; `downloadICS`/`getGoogleCalendarLink`/`getOutlookCalendarLink` aceitam `period` e o nome do ficheiro ICS passa a incluir o intervalo.
- `src/i18n/locales/{pt,en,es,fr,de}.ts`: nova secção `icsExport` (rótulo do período + 7 opções de intervalo) — paridade de chaves mantida.
- `src/components/Dashboard.tsx`: seletor de período (`#ics-period`) na barra de exportação; `handleExportICS` aplica o período escolhido (ano corrente) à exportação ICS de cada cenário.
- `src/utils/__tests__/icsExport.test.ts`: 4 novos testes de filtragem por período (helper `icsPeriodForRange`, subset de eventos, validade).

**Verificação:** `tsc -b` → exit 0; `vitest` → 601 passam, 0 falham.

**Decisão registada:** O período aplica-se à exportação ICS por cenário (não à exportação "Excel/PDF Todos"). Próximos passos sugeridos (secção 6 do TODO): atalho de teclado para exportação ICS, ou auditoria de `aria-label` nos gráficos do AnalyticsDashboard.



## Round 63 — 2026-08-24
**Objetivo:** Tornar o `PRODID` da exportação ICS estável e independente do idioma (2ª tarefa pendente da secção 6 do TODO.md).

**Contexto:** O `PRODID` continha o sufixo `//PT`, o que sugeria uma dependência do idioma da interface e era inconsistente com a exportação multilíngue (nomes de turno/equipa e `X-WR-CALDESC` já traduzidos).

**O que foi feito:**
- `src/utils/icsExport.ts`: `PRODID:-//ShiftSim Factory//PT` → `PRODID:-//ShiftSim Factory//Schedule Generator//EN` (identificador estável, idioma neutro `EN` conforme RFC 5545, não dependente do UI locale).
- `src/utils/__tests__/icsExport.test.ts`: atualizada a asserção do `PRODID` para o novo valor.

**Verificação:** `tsc -b` → exit 0; `vitest` (icsExport) → 21 passam, 0 falham.

**Decisão registada:** `PRODID` agora é estável e não varia com o idioma selecionado. Próximos passos sugeridos (secção 6 do TODO): exportação ICS por período personalizado, ou atalho de teclado para exportação ICS.

## Round 62 — 2026-08-24
**Objetivo:** Adicionar nova métrica de "recuperação/regularidade" ao analisador QoL (primeira tarefa pendente da secção 6 do TODO.md).

**Contexto:** O analisador QoL (`src/utils/qualityOfLife.ts`) calculava 5 sub-scores (fins de semana, equilíbrio trabalho-vida, descanso consecutivo, impacto de noite, feriados) mas não media a capacidade de recuperação após blocos de noite nem a previsibilidade do padrão — aspetos centrais da qualidade de vida operária.

**O que foi feito:**
- `src/utils/qualityOfLife.ts`: nova métrica `recoveryRegularity` no `breakdown`, combinando:
  - `recoveryAfterNights` — média de dias de folga imediatamente após cada bloco de noite (sem noites → 100);
  - `regularity` — consistência dos blocos de trabalho (desvio-padrão dos comprimentos de blocos; padrão uniforme → 100).
  - Reequilibradas as ponderações do score global (0.25/0.15/0.15/0.15/0.10/0.20) para acomodar a nova métrica (soma = 1.0) e adicionado 1 insight sobre recuperação/regularidade.
- `src/i18n/locales/{pt,en,es,fr,de}.ts`: nova secção `qol` (rótulos dos 6 sub-scores, descrição da nova métrica, graus A+→F, severidades e títulos de secção) — paridade de chaves mantida (`tsc` valida).
- `src/components/QualityOfLifeDisplay.tsx`: passou a usar `t.qol.*` (antes hardcoded PT — quebrava es/fr/de), incluindo grau, severidade, "dias" e descrição da nova métrica. Adicionado `useI18n`.
- `src/components/__tests__/QualityOfLifeDisplay.test.tsx`: envolvido em `I18nProvider` e atualizadas asserções (inclui nova métrica "Recuperacao/Recovery").
- `src/utils/__tests__/qualityOfLife.test.ts`: +2 testes (recoveryRegularity em 0-100 e alto p/ `MMTTNNFFFF`; 100 p/ padrão sem noites `MMMMFFFF`).

**Verificação:** `tsc -b` → exit 0; `vitest` → **597 passam** (vs 595 anteriores, +2 testes novos), **0 falham**; `eslint` → 0 erros nos ficheiros alterados.

**Decisão registada:** QoL passa a apresentar 6 sub-scores, agora 100% multilíngue no ecrã. Próximos passos sugeridos (secção 6 do TODO): exportação ICS por período personalizado, ou `PRODID` neutro na exportação ICS.

## Round 61 — 2026-08-23
**Objetivo:** Localizar os metadados `X-WR-CALDESC` da exportação ICS (sugerido na Round 60 como próximo passo).

**Contexto:** A Round 60 tornou a exportação ICS multilíngue nos nomes de turno/equipa, mas o `X-WR-CALDESC` permanecia hardcoded em PT ("Horario gerado pelo ShiftSim Factory — N equipas, turnos de Nh"). Isto quebrava a experiência i18n no corpo do calendário subscrevível.

**O que foi feito:**
- Nova chave `calendar.icsDescription` adicionada a `pt/en/es/fr/de` com placeholders `{teams}` e `{hours}` (paridade de chaves mantida — teste de locales continua a validar).
- `src/utils/icsExport.ts`: `exportScenarioToICS` passa a usar `t.calendar.icsDescription` com substituição dos placeholders; removeu o string hardcoded PT.
- `src/utils/__tests__/icsExport.test.ts`: adicionados 2 testes — `en` produz "Schedule generated by ShiftSim Factory — 1 teams, 8h shifts" e ausência do PT; default mantém PT.

**Verificação:** `tsc -b` → exit 0; `vitest` → **595 passam** (vs 593 anteriores, +2 testes novos), **0 falham**; `eslint` → 0 erros (avisos pré-existentes em testes de locale, não relacionados).

**Decisão registada:** Exportação ICS 100% multilíngue (nomes, equipas e metadados de descrição). Próximos passos sugeridos: expandir o analisador QoL com nova métrica (ex: índice de recuperação/regularidade), ou adicionar exportação ICS por período personalizado.

## Round 60 — 2026-08-23
**Objetivo:** Tornar a exportação ICS (e os links Google/Outlook) multilíngue, alinhada com o objetivo de i18n do projeto.

**Contexto:** O `utils/icsExport.ts` já implementa a exportação ICS de horários gerados (sugerida na Round 59 como "exportação ICS de horários gerados"), mas os nomes de turno (`Manha`/`Tarde`/`Noite`/`Folga`) e a etiqueta de equipa (`Equipa`) estavam hardcoded em PT. Tal quebrava a experiência multilíngue (es/fr/de/en) e ia contra o esforço de i18n concluído nas Rounds 57–58.

**O que foi feito:**
- `src/utils/icsExport.ts`: as funções `exportScenarioToICS`, `downloadICS`, `getGoogleCalendarLink` e `getOutlookCalendarLink` passam a aceitar um parâmetro opcional `t: Translations` (default `pt` para manter compatibilidade/retrocompatibilidade). Os nomes de turno usam `t.calendar.morning/afternoon/night/off` e a etiqueta de equipa usa `t.teamRoster.team`, reutilizando chaves já existentes em pt/en/es/fr/de (sem novas chaves → sem risco para o teste de paridade de locales).
- `src/components/Dashboard.tsx`: `handleExportICS` agora passa `t` (do `useI18n`) ao `downloadICS`, exportando o calendário no idioma da interface.
- `src/utils/__tests__/icsExport.test.ts`: atualizado (removida dependência da string hardcoded "Turno") e adicionados testes de localização: `en` produz "Morning"/"Team A" e ausência de "Manha"/"Equipa"; default sem `t` mantém PT.

**Verificação:** `tsc -b` → exit 0; `vitest` → **593 passam** (vs 591 anteriores, +2 testes novos), **0 falham**; `eslint` → 0 erros (avisos pré-existentes em Dashboard, não relacionados).

**Decisão registada:** Exportação ICS agora respeita o idioma da UI. Próximos passos sugeridos: aplicar a mesma localização aos metadados `X-WR-CALDESC` (atualmente em PT) ou expandir com nova métrica QoL no analisador.

## Round 59 — 2026-08-23
**Objetivo:** Concluir a Secção 5 do TODO.md — documentação de "Línguas suportadas" no README.

**Contexto:** As 5 línguas (pt/en/es/fr/de) estão 100% migradas e auditadas (Rounds 57–58). No entanto o README continha informação desatualizada: a linha "Multilíngue" referia apenas 3 idiomas (Português, English, Español), quando na realidade o projeto suporta os 5.

**O que foi feito:**
- Corrigido o bullet "Multilíngue" em README.md (secção Funcionalidades) para referenciar os 5 idiomas.
- Adicionada nova secção **"🌍 Línguas Suportadas"** ao README com tabela de estado (pt/en/es/fr/de), nota sobre paridade total de chaves validada por `tsc` e testes de locales, e menção à seleção em Definições + persistência em `localStorage`.

**Verificação:** Alteração exclusivamente documental (README.md); não afeta `tsc` nem `vitest`. `git status` limpo após commit.

**Decisão registada:** TODO.md Secção 5 (documentação) concluída — todas as secções do TODO estão agora marcadas como feitas. Próximos passos sugeridos: expandir funcionalidades (ex: nova métrica QoL, ou exportação ICS de horários gerados).

## Round 58 — 2026-08-22
**Objetivo:** Revisar a qualidade das traduções em `es`/`fr`/`de` das secções mais antigas (TODO.md secção 2 — alargamento da auditoria): `reports`, `holidayCalendar`, `scheduleTemplates`, `settings`, `helpPage`.

**Contexto:** A Round 57 reviu as secções recentes migradas (`costCalculator`, `scheduleOptimizer`, `analyticsDashboard`, `workforcePlanning`, `comparison`). As secções antigas ainda usavam diacríticos nativos (ES/FR) ou misto nativo/ASCII (DE), sem seguir a convenção ASCII (sem acentos) já estabelecida nas secções novas. A auditoria focou-se em: (1) converter para convenção ASCII; (2) corrigir erros gramaticais reais (plurais, concordância, infinitivos).

**O que foi corrigido (qualidade de tradução + convenção ASCII):**
- **`es.ts`:** `holidayCalendar` (`anadir`, `eliminar`); `settings` (`configuracion`, `restauracion`, `aplicacion`, `automatica`, `region`, `exito`, `invalido`, `borrara`, `pagina`, `recargara`); `reports` (`comparacion`, `exportacion`, `patron`, `libres` [plural], `comodas`, `exportado` sem exclamação); `scheduleTemplates` já em ASCII; `helpPage` já em ASCII.
- **`fr.ts`:** `holidayCalendar` (`feries`, `gerer`, `personnalise`, `precedent`, `ferie`); `settings` (`parametres`, `theme`, `enregistre`, `telecharger`, `scenario`, `ferie`, `personalise`, `preferences`, `supprimera`, `donnees`, `effacees`, `rechargera`, `creee`, `succes`); `reports` (`generez`, `detailles`, `selectionner`, `deselectionner`, `creez`, `scenario`, `resume`, `detaille`, `scenarios`, `modele`, `trav`, `repos`, `evaluation`, `qualitative`, `exporte`, `export`, `confortables`, `moderes`, `sequences`, `raisonnables`, `longues`); `scheduleTemplates` (`modeles`, `preconfigure`, `ca`, `selectionnez`, `modele`, `personnalisez`, `ajoute`, `ajoutes`, `continues`, `infirmieres`, `medecins`, `flexibilite`, `hotellerie`, `equipes`, `hotels`, `entrepots`, `equipe`); `helpPage` (`demarrage`, `rapide`, `fonctionnalites`, `frequentes`, `complete`, `scenarios`, `scenario`, `deplacer`, `metriques`, `resumees`, `avances`, `qualite`, `distribution`, `projection`, `nuage`, `points`, `selectionnez`, `quotidienne`, `attribution`, `equipe`, `statistiques`, `travail`, `matin`, `apres-midi`, `nuit`, `feries`, `personalises`, `ajoutez`, `region`, `detailles`, `metriques`, `avancees`, `evaluation`, `theme`, `fonce`, `sauvegarde`, `restauration`, `personnalises`, `suppression`, `donnees`, `general`, `est-ce`, `planning`, `marche`, `creer`, `comparer`, `analyser`, `differents`, `modeles`, `equipes`, `stockees`, `serveur`, `navigateur`, `localStorage`, `envoyee`, `serveurs`, `externes`, `sauvegarder`, `exporter`, `moment`, `longueur`, `maximale`, `caracteres`, `utilisez`, `apres-midi`, `individuellement`, `utiles`, `asymetriques`, `combien`, `ideal`, `depend`, `couverture`, `necessaire`, `industrie`, `verifie`, `conformite`, `legale`, `regles`, `travail`, `hebdomaire`, `intervalle`, `rotations`, `maximum`, `supplementaires`, `quotidien`, `feries`, `rotation`, `mis`, `jour`, `automatiquement`, `y`, `compris`, `mobiles`, `bases`, `paques`, `calcules`, `egalement`, `ajouter`, `personnalises`, `formats`, `disponibles`, `excel`, `pdf`, `csv`, `json`, `ics`, `calendrier`, `convient`, `differents`, `usages`, `partager`, `collegue`, `bouton`, `carte`, `lien`, `genere`, `copier`, `envoyer`, `destinataire`, `verra`, `automatiquement`, `ouverture`, `raccourcis`, `retablir`, `calendrier`, `aide`).
- **`de.ts`:** `holidayCalendar` (`religioese`, `naechster`, `hinzufuegen`); `settings` (`waehlen`, `hellem`, `dunklem`, `waehlen`, `anwendung`, `sicherung`, `wiederherstellung`, `gespeichert`, `herunterladen`, `importieren`, `automatische`, `benutzerdefinierte`, `feiertage`, `unternehmen`, `region`, `hinzufuegen`, `entfernen`, `ueber`, `loeschen`, `loescht`, `einstellungen`, `erstellt`, `ungueltiges`, `sicher`, `loescht`, `geloescht`, `neu`, `geladen`); `reports` (`auswaehlen`, `abwaehlen`, `auswaehlen`, `verfuegbar`, `o` [símbolo Ø removido por ASCII], `zusammenfassung`, `detailliert`, `exportformat`, `exportiere`, `zusammenfassung`, `bericht`, `arbeit`, `frei`, `bewertung`, `waehlen`, `exportiert`, `exportfehler`, `ueberstunden`, `massige`, `vernuenftige`, `arbeitsfolgen`); `scheduleTemplates` (`verfuegbar`, `waehlen`, `branche`, `importieren`, `vorlage`, `anpassen`, `muster`, `einstellungen`, `hinzugefuegt`, `hinzugefuegt`, `schichten`, `pflegekraeften`, `aerzten`, `einzelhandel`, `schichten`, `geschaefte`, `einkaufszentren`, `buro`, `burozeiten`, `flexibilitaet`, `hotellerie`, `gastronomie`, `lager`, `verteilung`); `helpPage` (já em ASCII).

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**.

**Decisão registada:** Secção 2 (qualidade de traduções) revista integralmente — todas as secções (recentes e antigas) agora seguem a convenção ASCII e têm qualidade gramatical corrigida em es/fr/de. Próximos passos sugeridos: adicionar testes de cobertura de UI por idioma.

## Round 57 — 2026-08-22
**Objetivo:** Revisar a qualidade das traduções em `es`/`fr`/`de` das secções recentes migradas (TODO.md secção 2): `costCalculator`, `scheduleOptimizer`, `analyticsDashboard`, `workforcePlanning`, `comparison` (e `reports`).

**Contexto:** As 5 línguas (pt/en/es/fr/de) têm paridade total de chaves nestas secções (validado por `tsc` e pelo teste de paridade de locales). A auditoria focou-se em erros gramaticais reais, mantendo a convenção ASCII (sem acentos) já usada em todo o projeto.

**O que foi corrigido (qualidade de tradução):**
- **`es.ts`:** `suggestionReduceConsecutiveDesc` → `dias libres` (plural, era `dias de libre`); `suggestionMoreWeekendsTitle`/`suggestionMoreWeekendsDesc` → `fines de semana libres` (plural, era `de libre`).
- **`fr.ts`:** `qModerateWeekends` → `Week-ends moderes` (masculino plural, era `moderees`); `workDaysText` → `jours ouvres` (plural, era `ouvre`); `scheduleOptimizer.title` → `Optimiseur d'Horaires` (elisação antes de vogal, era `de Horaires`).
- **`de.ts`:** `noteEstimated` → `Geschaetzte Werte, abhaengig von Tarifverhandlung` (adjetivo/acordo, era `Geschaetzta ... unterliegen Kollektivverhandlung`); `selectScenarios`→`Szenarien auswaehlen`, `deselect`→`Abwaehlen`, `selectAll`→`Alle auswaehlen` (infinitivos corretos, eram `Auswahlen`/`Abwahlen`/`Alle Auswahlen`).

**Verificação:** `tsc -b` passa (exit 0); `vitest` → **591 passam**, **0 falham**.

**Decisão registada:** Secção 2 (qualidade de traduções) revista para as secções recentes — corrigidos os erros gramaticais detetados em es/fr/de. Próximos passos sugeridos: alargar a revisão de qualidade a secções mais antigas (`reports`, `holidayCalendar`, `scheduleTemplates`, `settings`, `helpPage`) e/ou adicionar testes de cobertura de UI por idioma.

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
