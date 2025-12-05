# 🏭 ShiftSim Factory

**ShiftSim Factory** é uma ferramenta avançada de simulação e análise de horários por turnos, desenhada para otimizar a gestão de escalas industriais, promover a equidade entre equipas e melhorar a qualidade de vida dos trabalhadores.

![Status](https://img.shields.io/badge/Status-Production-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Tech](https://img.shields.io/badge/Tech-React%20%7C%20TypeScript%20%7C%20Tailwind-blueviolet)

---

## 🚀 Funcionalidades Principais

### 1. 📅 Simulação de Horários Flexível
*   Suporte para **3 a 6 equipas** rotativas.
*   Definição personalizada de padrões de turnos (Manhã, Tarde, Noite, Folga).
*   Configuração de data de início e duração dos turnos.
*   **Presets Inteligentes:** Carregamento automático de cenários comuns na primeira visita (ex: 5x3, 4x2, Continental).

### 2. 📊 Análise de Qualidade de Vida (QoL)
Um sistema exclusivo de pontuação que avalia o impacto do horário na vida do colaborador:
*   **Score Global (0-100%):** Classificação do horário (A+ a F).
*   **Métricas Detalhadas:**
    *   Cobertura de Fins de Semana (Sábados/Domingos).
    *   Equilíbrio Trabalho-Vida (Rácio dias de trabalho/folga).
    *   Qualidade do Descanso (Dias consecutivos de folga).
    *   Impacto do Turno da Noite.
*   **Deteção de Períodos Críticos:** Alerta automático e visual para sequências perigosas (ex: "5 noites consecutivas" ou "10 dias sem folga").

### 3. ⚖️ Equidade da Equipa
Garanta que todas as equipas são tratadas de forma justa ao final do ano:
*   **Comparação Anual:** Tabela detalhada com fins de semana livres, feriados trabalhados e total de dias de folga por equipa.
*   **Análise de Horas Reais:** Cálculo preciso das horas anuais trabalhadas por cada turno, com indicação exata de desvios.
*   **Indicadores de Diferença:** Destaque visual para equipas que trabalham horas ou fins de semana a mais/menos que a média.

### 4. 📈 Visualizações Avançadas
*   **Calendário Multi-Equipa:** Visão global de todas as equipas em simultâneo.
*   **Heatmap de Carga de Trabalho:** Visualização de intensidade de trabalho por mês.
*   **Gráficos Comparativos:** Barras e linhas para analisar distribuição de turnos.

### 5. 🛠️ Ferramentas de Gestão
*   **Backup e Restore:** Guarde e recupere todos os seus cenários via ficheiro JSON.
*   **Exportação:** Exporte dados para Excel (CSV/XLS) ou integre com calendários pessoais (iCal).
*   **Temas:** Suporte nativo para **Modo Escuro (Dark Mode)** (padrão) e Claro.

---

## 💻 Stack Tecnológico

Este projeto foi construído com foco em performance e experiência de utilizador moderna:

*   **Core:** [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
*   **Ícones:** [Lucide React](https://lucide.dev/)
*   **Gráficos:** [Recharts](https://recharts.org/)

---

## 📥 Como Utilizar

### Instalação Local
1.  Clone o repositório:
    ```bash
    git clone [https://github.com/khwx/Factory-schedules.git](https://github.com/khwx/Factory-schedules.git)
    ```
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

### Deployment
O projeto está configurado para deploy automático na Vercel.
Basta fazer push para o branch `main`.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir **Issues** ou enviar **Pull Requests** com melhorias, novos padrões de turnos ou correções de bugs.

---

Desenvolvido com ❤️ para melhorar a vida de quem trabalha por turnos.
