# 🔔 Sistema de Senhas de Atendimento - Inst-CUTRIM

Sistema moderno de gerenciamento de filas desenvolvido por **DIEGO CUTRIM OLIVEIRA**. O projeto conta com comunicação em tempo real, painel visual com carrossel de imagens e chamadas sonoras inteligentes.

## ✨ Funcionalidades
* **Comunicação Real-time**: Utiliza Socket.io para atualização instantânea entre o atendente e o painel.
* **Chamada Sonora**: Alerta de "Ding-Dong" (2 vezes) em volume máximo antes da voz anunciar a senha.
* **Voz (TTS)**: Anúncio automático da senha e da mesa de destino.
* **Carrossel de Imagens**: Loop automático de logos e avisos (Prefeitura de Lima Campos, SEMJUV, SEMED e CCPJ).
* **Histórico e Status**: Exibição das últimas chamadas e situação das mesas ativas.

## 🚀 Como Executar o Projeto

### 1. Instalação
Clone o repositório e instale as dependências do Node.js:
```bash
git clone [https://github.com/DIEGO-CUTRIM/Inst-CUTRIM.git](https://github.com/DIEGO-CUTRIM/Inst-CUTRIM.git)
cd Inst-CUTRIM
npm install