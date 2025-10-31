# 🎃 Tabuleiro Ouija ASCII - Decifrador Místico

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-success?style=for-the-badge)

> Uma experiência interativa e mística que combina criptografia ASCII com a temática sombria do tabuleiro Ouija, perfeita para o Halloween! 👻🕷️

---


## 🎯 Sobre o Desafio

### Desafio Original Completo

**Desafio: Tabuleiro Ouija ASCII Interativo**

**Objetivo:** Crie uma página web que simula um tabuleiro Ouija inspirado na imagem fornecida. O tabuleiro deve permitir que o usuário insira códigos ASCII, decifre-os como letras e veja o movimento de uma "planchette" virtual apontando para as letras do tabuleiro, conforme o texto decifrado.

**Requisitos:**

* O tabuleiro deve ter a disposição circular das letras de A a Z, dos números de 0 a 9 e opções especiais ("SI", "NO", "¿?", "+", "-") conforme no modelo da imagem.
* Na lateral (esquerda ou direita), inclua um container com:
   * Um campo de entrada onde o usuário digita uma sequência de códigos ASCII separados por espaço (ex: 72 79 76 65).
   * Um botão "DECIFRAR" para processar a entrada.

* Ao clicar em DECIFRAR:
   * Cada código deve ser convertido para a respectiva letra.
   * A planchette virtual (um círculo ou elemento destacado) deve se mover animadamente de letra em letra no tabuleiro, "soletrando" o resultado.
   * Ao final, mostre a palavra ou frase decifrada em uma área de resultado.

**Dicas bônus:**
* Faça a animação da planchette ser fluida, simulando o movimento de um dedo.
* Use CSS para estilizar o tabuleiro de forma similar ao da imagem (cores, alinhamento circular dos caracteres).
* Inclua mensagens de erro caso o usuário digite um código ASCII inválido.
* Selecione as opções "SI", "NO", "¿?" ou símbolos se o código decifrado corresponder ao caractere específico.
* Permita reiniciar o tabuleiro para uma nova mensagem.

**Desafio extra:**
* Adapte para múltiplos idiomas (português, inglês ou espanhol).

---

## 🔮 Solução Implementada

### Função Principal: `animatePlanchette()`

A função núcleo do desafio é responsável por animar o movimento da planchette (indicador místico) através do tabuleiro Ouija, criando uma experiência visual fluida e imersiva:

```javascript
async function animatePlanchette(asciiCodes) {
    planchette.style.display = 'block';
    
    for (let i = 0; i < asciiCodes.length; i++) {
        const char = String.fromCharCode(asciiCodes[i]).toUpperCase();
        const targetElement = findBoardElement(char);
        
        if (targetElement) {
            await movePlanchetteTo(targetElement);
            highlightElement(targetElement);
            await sleep(800);
            removeHighlight(targetElement);
        }
        
        await sleep(300);
    }
    
    planchette.style.display = 'none';
}
```

---

## 🧠 Análise Técnica Aprofundada da Solução

### Arquitetura do Sistema

#### Fluxo de Dados
```
Input ASCII Codes → Parsing → Validation → Conversion → Animation → Display Result
```

### 1. **Parser de Entrada com Regex**

```javascript
const asciiCodes = input.split(/\s+/).map(code => parseInt(code));
```

**Análise Técnica:**
- **Regex `/\s+/`**: Captura qualquer sequência de whitespace (espaços, tabs, quebras de linha)
- **`split()`**: Complexidade O(n) onde n = comprimento da string
- **`map(parseInt)`**: Conversão string → number com radix implícito 10
- **Tolerância**: Aceita múltiplos espaços consecutivos sem erros

**Edge Cases Tratados:**
- Múltiplos espaços entre códigos
- Espaços no início/fim da string (via `trim()`)
- Strings vazias retornam array vazio

---

### 2. **Validação com Filter Pattern**

```javascript
const invalidCodes = asciiCodes.filter(code => 
    isNaN(code) || code < 0 || code > 127
);

if (invalidCodes.length > 0) {
    showError(`Códigos ASCII inválidos detectados. Use valores entre 0 e 127.`);
    return;
}
```

**Estratégia de Validação:**
- **Early Return Pattern**: Interrompe execução antes de processamento pesado
- **ASCII Standard Range**: 0-127 (7-bit ASCII)
- **`isNaN()` Check**: Detecta conversões falhas (ex: "abc" → NaN)
- **Complexidade**: O(n) onde n = quantidade de códigos

**Por que 0-127?**
- ASCII padrão utiliza 7 bits
- Extended ASCII (128-255) pode ter compatibilidade inconsistente
- Maior portabilidade entre sistemas

---

### 3. **Mapeamento DOM com Data Attributes**

```javascript
function findBoardElement(char) {
    if (char === ' ') return document.querySelector('[data-char=" "]');
    if (char === '?') return document.querySelector('[data-char="¿?"]');
    
    const elements = document.querySelectorAll('.board-item');
    for (let element of elements) {
        if (element.dataset.char === char) {
            return element;
        }
    }
    return null;
}
```

**Decisões Arquiteturais:**

1. **Data Attributes vs ID/Class:**
   - ✅ Semântico: Representa metadado do elemento
   - ✅ Flexível: Fácil adicionar novos caracteres
   - ✅ Consulta eficiente via `dataset` API
   - ❌ Alternativa: Map/Object seria mais performático para grandes datasets

2. **Caracteres Especiais:**
   ```javascript
   if (char === '?') return document.querySelector('[data-char="¿?"]');
   ```
   - Tratamento explícito para símbolos com representação alternativa
   - Evita ambiguidade entre '?' e '¿?'

3. **Complexidade:**
   - Worst case: O(n) onde n = elementos no tabuleiro (~40 elementos)
   - Otimização possível: Criar Map cache na inicialização

---

### 4. **Sistema de Animação Assíncrona**

```javascript
async function animatePlanchette(asciiCodes) {
    planchette.style.display = 'block';
    
    for (let i = 0; i < asciiCodes.length; i++) {
        const char = String.fromCharCode(asciiCodes[i]).toUpperCase();
        const targetElement = findBoardElement(char);
        
        if (targetElement) {
            await movePlanchetteTo(targetElement);
            highlightElement(targetElement);
            await sleep(800);
            removeHighlight(targetElement);
        }
        
        await sleep(300);
    }
    
    planchette.style.display = 'none';
}
```

**Padrão Async/Await:**
- **Sequencialidade Garantida**: Cada letra é processada antes da próxima
- **Non-blocking**: Interface permanece responsiva durante animações
- **Promise Chain**: Cada `await` espera a Promise resolver antes de continuar
- **Error Handling**: Erros podem ser capturados com try/catch

---

### 5. **Cálculo de Posicionamento Dinâmico**

```javascript
function movePlanchetteTo(element) {
    return new Promise((resolve) => {
        const rect = element.getBoundingClientRect();
        const boardRect = document.querySelector('.ouija-board').getBoundingClientRect();
        
        const x = rect.left - boardRect.left + rect.width / 2 - 40;
        const y = rect.top - boardRect.top + rect.height / 2 - 40;
        
        planchette.style.transition = 'all 1s cubic-bezier(0.4, 0.0, 0.2, 1)';
        planchette.style.left = `${x}px`;
        planchette.style.top = `${y}px`;
        
        setTimeout(resolve, 1000);
    });
}
```

**Técnicas de Posicionamento:**
- **`getBoundingClientRect()`**: Retorna dimensões e posição relativa ao viewport
- **Cálculo de Centro**: `rect.width / 2` e `rect.height / 2` encontram o ponto central
- **Offset**: `-40` compensa metade do tamanho da planchette (80px / 2)
- **Coordenadas Relativas**: Subtração das posições do tabuleiro para posicionamento absoluto interno

**Cubic-Bezier Easing:**
```css
cubic-bezier(0.4, 0.0, 0.2, 1)
```
- **0.4**: Aceleração inicial suave
- **0.0**: Ponto de controle de velocidade
- **0.2**: Desaceleração gradual
- **1.0**: Parada suave (ease-out effect)

---

### 6. **Padrão de Highlight com Classes CSS**

```javascript
function highlightElement(element) {
    element.classList.add('active');
}

function removeHighlight(element) {
    element.classList.remove('active');
}
```

**CSS Transitions:**
```css
.board-item {
    transition: all 0.3s ease;
}

.board-item.active {
    color: #fff;
    text-shadow: 0 0 25px rgba(255, 255, 255, 1);
    transform: scale(1.3);
}
```

**Benefícios:**
- **Separação de Concerns**: Lógica (JS) vs Apresentação (CSS)
- **GPU Acceleration**: Transforms são acelerados por hardware
- **Reutilizável**: Mesma classe para diferentes elementos
- **Performance**: Evita recálculos de layout (reflow)

---

### 7. **Animação de Resultado com Stagger Effect**

```javascript
decodedChars.forEach((char, index) => {
    setTimeout(() => {
        const span = document.createElement('span');
        span.className = 'letter-appear';
        span.textContent = char;
        finalOutput.appendChild(span);
    }, index * 150); // Stagger de 150ms entre letras
});
```

**CSS Keyframes:**
```css
@keyframes letterPop {
    0% {
        opacity: 0;
        transform: scale(0.5) rotateY(180deg);
    }
    50% {
        transform: scale(1.2) rotateY(90deg);
    }
    100% {
        opacity: 1;
        transform: scale(1) rotateY(0deg);
    }
}
```

**Implementação:**
- **Stagger Pattern**: Delay incremental (150ms × índice) cria efeito cascata
- **3D Transforms**: `rotateY()` cria efeito de flip em 3D
- **Scale Bounce**: Escala para 1.2 antes de estabilizar em 1.0
- **Opacity Fade**: Transição suave de invisível para visível

---

## 🚀 Aplicações em Projetos Reais

### 1. **Sistemas Educacionais**
- Ferramenta interativa para ensino de codificação ASCII/Unicode
- Gamificação do aprendizado de criptografia básica
- Visualização de conceitos abstratos de encoding
- Plataformas de e-learning com desafios interativos

### 2. **Interfaces de Segurança**
- Demonstração didática de conceitos de encoding
- Ferramentas de debugging para desenvolvedores
- Validação visual de transformações de dados
- Sistemas de treinamento em segurança da informação

### 3. **Aplicações de Entretenimento**
- Jogos de decodificação e puzzles
- Experiências interativas temáticas (Halloween, mistério)
- Escape rooms digitais
- Plataformas de gaming educacional

### 4. **Ferramentas de Desenvolvedor**
- Conversor ASCII visual para debugging
- Ferramenta de demonstração de algoritmos
- Base para tutoriais interativos
- Sandbox de experimentação com APIs

### 5. **Marketing e Engagement**
- Campanhas interativas sazonais
- Landing pages temáticas
- Experiências de brand storytelling
- Ativações digitais em eventos

### 6. **Dashboards e Visualizações**
- Painel de monitoramento com animações
- Interfaces de controle industrial
- Sistemas de notificação visual
- Feedback visual em tempo real

---

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estruturação semântica e acessível
- **CSS3**: Animações avançadas, gradientes, glassmorphism
- **JavaScript ES6+**: Async/await, Promises, DOM manipulation
- **Arquitetura**: Vanilla JS (sem dependências externas)
- **Padrões**: MVC simplificado, Event-driven programming

---

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/luizfxdev/ouija-board.git

# Navegue até o diretório
cd ouija-board

# Abra o index.html em seu navegador
# Ou use um servidor local como Live Server (VS Code)
```

---

## 🎮 Como Usar

1. **Digite códigos ASCII** no campo de entrada (separados por espaço)
2. **Clique em DECIFRAR** para iniciar a animação
3. **Observe** a planchette se mover pelo tabuleiro
4. **Veja o resultado** decodificado na seção de resultados
5. **Clique em RETORNAR** para nova tentativa

---

## 📝 Exemplos de Entrada - Palavras de Halloween

### 1. **WITCH** (Bruxa) 🧙‍♀️
```
Input: 87 73 84 67 72
Output: W, I, T, C, H
```

### 2. **GHOST** (Fantasma) 👻
```
Input: 71 72 79 83 84
Output: G, H, O, S, T
```

### 3. **SCARY** (Assustador) 😱
```
Input: 83 67 65 82 89
Output: S, C, A, R, Y
```

### 4. **DEMON** (Demônio) 👹
```
Input: 68 69 77 79 78
Output: D, E, M, O, N
```

### 5. **SPELL** (Feitiço) 🔮
```
Input: 83 80 69 76 76
Output: S, P, E, L, L
```

### 6. **BLOOD** (Sangue) 🩸
```
Input: 66 76 79 79 68
Output: B, L, O, O, D
```

---

## 🎨 Recursos Visuais

- ✨ Animações CSS3 avançadas com keyframes
- 🎭 Tema Halloween com cores vibrantes (laranja, roxo, dourado)
- 🌊 Efeitos de blur e glassmorphism
- 🎬 Vídeo background em 4K com object-fit cover
- 🎵 Controles de áudio integrados
- 📱 Design totalmente responsivo (mobile-first)
- 🎃 Emojis temáticos animados
- 👻 Efeitos de brilho e pulsação
- 🦇 Animações de elementos flutuantes

---

## 📊 Estrutura do Projeto

```
ouija-board/
├── index.html          # Estrutura HTML principal
├── styles.css          # Estilos e animações CSS
├── script.js           # Lógica JavaScript
├── assets/
│   ├── background.mp4  # Vídeo de fundo 4K
│   └── theme.mp3       # Música tema
├── README.md           # Documentação
└── LICENSE             # Licença MIT
```

---

## 🔧 Configuração de Assets

### Vídeo Background
- **Formato**: MP4
- **Resolução**: 3840x2160 (4K)
- **Codec**: H.264
- **Local**: `assets/background.mp4`

### Áudio Tema
- **Formato**: MP3
- **Bitrate**: 320kbps (recomendado)
- **Local**: `assets/theme.mp3`

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Guidelines de Contribuição

- Mantenha o código limpo e bem documentado
- Siga os padrões de código existentes
- Teste suas alterações antes de submeter
- Atualize a documentação quando necessário

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Luiz Felipe de Oliveira**

- GitHub: [@luizfxdev](https://github.com/luizfxdev)
- Linkedin: [in/luizfxdev](https://www.linkedin.com/in/luizfxdev)
- Portfólio: [luizfxdev.com.br](https://luizfxdev.com.br)

---

## ⭐ Mostre seu apoio

Se este projeto foi útil para você:
- ⭐ Dê uma estrela no GitHub
- 🔀 Faça um fork
- 📢 Compartilhe com outros desenvolvedores
- 💬 Deixe seu feedback

---

## 🙏 Agradecimentos

- Inspiração: Tabuleiros Ouija clássicos
- Comunidade open source
- Todos que testaram e deram feedback

---

<div align="center">
  <sub>Desenvolvido com 💜 e muito ☕ por Luiz FX</sub>
  <br>
  <sub>Halloween Edition 🎃 2025</sub>
</div>

***Preparado para arrepios? O Halloween chegou!***
