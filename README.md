# 🏭 Factory Schedules (ShiftSim Factory)

**Factory Schedules** (agora "ShiftSim Factory" no deployment) é uma aplicação web desenvolvida para facilitar a gestão, simulação e visualização de horários, turnos e escalas em ambiente fabril.

[![Status do Projeto](https://img.shields.io/badge/status-em_desenvolvimento-orange)]() [![Licença](https://img.shields.io/badge/license-MIT-blue)]()

## 🔗 Website e Aplicação em Direto

A versão mais recente da aplicação está em produção e acessível em:

[https://shiftsim-factory.vercel.app/](https://shiftsim-factory.vercel.app/)

## 📋 Sobre o Projeto

O projeto visa simplificar a organização e visualização do trabalho na fábrica. O foco está na clareza da informação e na facilidade de gestão dos dados de escalas.

### 📁 Estrutura do Projeto

A organização de pastas reflete um projeto moderno com um processo de build:

* **`src/`**: Contém todo o código fonte original da aplicação (HTML, CSS e JavaScript).
* **`schedules/`**: Pasta dedicada a armazenar os ficheiros de dados das escalas e turnos (e.g., ficheiros JSON).
* **`dist/`**: O diretório de distribuição. Contém os ficheiros finais otimizados e prontos para o deployment (o output do processo de build).
* **`.vercelignore`**: Configuração específica para o deployment na Vercel.

### ✨ Funcionalidades Principais

* **Visualização de Escalas:** Interface clara e organizada para exibir os turnos de trabalho.
* **Gestão de Dados Simples:** Escalas facilmente configuráveis através de ficheiros de dados na pasta `schedules/`.
* **Pronto para a Web:** Aplicação otimizada para o deployment.

## 🛠️ Tecnologias Utilizadas

* **HTML5 / CSS3 / JavaScript**
* **Node.js & npm** (Gestão de dependências e Scripts de Build)
* **Vercel** (Infraestrutura de Deployment)

## 🚀 Como Executar o Projeto Localmente

### Pré-requisitos

* [Node.js](https://nodejs.org/) instalado.
* Git.

### Passos de Instalação e Execução

1.  **Clonar o repositório:**
    ```bash
    git clone [https://github.com/khwx/Factory-schedules.git](https://github.com/khwx/Factory-schedules.git)
    ```

2.  **Entrar na pasta e instalar dependências:**
    ```bash
    cd Factory-schedules
    npm install
    ```

3.  **Compilar o código (Build):**
    * Este passo gera os ficheiros finais na pasta `dist/` a partir do código fonte em `src/`.
    ```bash
    npm run build
    ```

4.  **Iniciar a aplicação:**
    * Para servir os ficheiros da pasta `dist/` no teu ambiente local:
    ```bash
    npm run start 
    # (Ou utiliza o comando de arranque específico que tens no teu package.json)
    ```

5.  Abre o teu navegador e acede ao endereço local indicado no terminal.

## ☁️ Deployment

O deployment contínuo é feito através da Vercel. Qualquer alteração feita na branch `main` é automaticamente publicada no domínio:

[https://shiftsim-factory.vercel.app/](https://shiftsim-factory.vercel.app/)

## 🤝 Como Contribuir

Contribuições são bem-vindas!
1.  Faz um **Fork** do projeto.
2.  Cria uma nova Branch.
3.  Faz o Commit das tuas alterações.
4.  Abre um **Pull Request**.

## 📝 Licença

Este projeto está sob a licença MIT. Consulta o ficheiro `LICENSE` para mais detalhes.

---
Desenvolvido por [khwx](https://github.com/khwx)
