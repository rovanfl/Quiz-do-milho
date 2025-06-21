// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaFinal = document.getElementById('tela-final');

const btnModoJogador = document.getElementById('btn-modo-jogador');
const btnCarregarPerguntas = document.getElementById('btn-carregar-perguntas');
const inputPerguntas = document.getElementById('input-perguntas');

const btnParar = document.getElementById('btn-parar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnPular = document.getElementById('btn-pular');
const btnCartas = document.getElementById('btn-cartas');
const btnUniversitarios = document.getElementById('btn-universitarios');

const perguntaContainer = document.getElementById('pergunta-container');
const perguntaTexto = document.getElementById('pergunta-texto');
const opcoesContainer = document.getElementById('opcoes-container');
const premioFinalTexto = document.getElementById('premio-final');
const timerBar = document.getElementById('timer-bar');

const spans = {
    nivel: document.getElementById('nivel-atual'),
    valorErrrar: document.getElementById('valor-errar'),
    valorParar: document.getElementById('valor-parar'),
    valorAcertar: document.getElementById('valor-acertar')
};

// --- BANCO DE PERGUNTAS PADRÃO ---
const perguntasPadrao = [
  { pergunta: "Qual é a capital da França?", opcoes: ["Londres", "Berlim", "Paris", "Madri"], resposta: "Paris" },
  { pergunta: "Qual empresa desenvolveu o Windows?", opcoes: ["Apple", "Microsoft", "Google", "Linux Foundation"], resposta: "Microsoft" },
  { pergunta: "Quanto é 7 x 6?", opcoes: ["42", "48", "36", "49"], resposta: "42" },
  { pergunta: "Qual o maior planeta do sistema solar?", opcoes: ["Terra", "Marte", "Júpiter", "Saturno"], resposta: "Júpiter" },
  { pergunta: "Em que ano o homem pisou na Lua?", opcoes: ["1965", "1969", "1972", "1980"], resposta: "1969" },
  { pergunta: "Qual destes animais é um mamífero?", opcoes: ["Pinguim", "Tartaruga", "Baleia", "Jacaré"], resposta: "Baleia" },
  { pergunta: "Quem pintou a Mona Lisa?", opcoes: ["Van Gogh", "Picasso", "Michelangelo", "Leonardo da Vinci"], resposta: "Leonardo da Vinci" },
  { pergunta: "Qual o metal mais abundante na crosta terrestre?", opcoes: ["Ferro", "Cobre", "Ouro", "Alumínio"], resposta: "Alumínio" },
  { pergunta: "Quantos lados tem um heptágono?", opcoes: ["5", "6", "7", "8"], resposta: "7" },
  { pergunta: "De quem é a frase “Penso, logo existo”?", opcoes: ["Platão", "Sócrates", "Aristóteles", "Descartes"], resposta: "Descartes" },
  { pergunta: "Qual o livro mais vendido no mundo depois da Bíblia?", opcoes: ["O Senhor dos Anéis", "Dom Quixote", "O Pequeno Príncipe", "Harry Potter"], resposta: "Dom Quixote" },
  { pergunta: "Qual a montanha mais alta do mundo?", opcoes: ["K2", "Monte Everest", "Aconcágua", "Makalu"], resposta: "Monte Everest" }
];

// --- CONFIGURAÇÃO DE SOM AUTOMÁTICA ---
const nomesSonsAcerto = ['A1.mp3', 'A2.mp3'];
const nomesSonsErro = ['E1.mp3', 'E2.mp3'];
const audioNovaPergunta = new Audio('audios/nova-pergunta.mp3');
const audioTema = new Audio('audios/tema.mp3');
audioTema.loop = true;
const audioFinal = new Audio('audios/final.mp3');

function tocarSom(tipo) {
    if (tipo === 'nova-pergunta') {
        audioNovaPergunta.play().catch(e => console.error("Erro ao tocar som de nova pergunta:", e));
        return;
    }
    const listaNomes = tipo === 'acerto' ? nomesSonsAcerto : nomesSonsErro;
    const pasta = tipo === 'acerto' ? 'acerto' : 'erro';
    if (listaNomes.length > 0) {
        const nomeArquivo = listaNomes[Math.floor(Math.random() * listaNomes.length)];
        const audio = new Audio(`audios/${pasta}/${nomeArquivo}`);
        audio.play().catch(e => console.error(`Erro ao tocar áudio: audios/${pasta}/${nomeArquivo}`, e));
    }
}

// --- ESTADO DO JOGO E CRONÔMETRO ---
let perguntasOriginais = []; 
let perguntas = [];
let perguntaAtualIndex = 0;
let pulosRestantes = 3;
let jogoAtivo = false;
let timerInterval = null;
const TEMPO_LIMITE = 20; // 20 segundos

const niveisPremio = {
    acertar: [1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000, 500000, 1000000],
    parar: [0, 500, 1000, 1500, 2500, 5000, 10000, 15000, 25000, 50000, 500000],
    errar: [0, 250, 500, 750, 1250, 2500, 5000, 7500, 12500, 25000, 0]
};
const totalPerguntasJogo = niveisPremio.acertar.length;

// --- GERENCIAMENTO DE TELAS ---
function mostrarTela(nomeTela) {
    [telaInicial, telaJogo, telaFinal].forEach(tela => {
        tela.id === nomeTela ? tela.classList.remove('escondido') : tela.classList.add('escondido');
    });
}

// --- LÓGICA DO CRONÔMETRO ---
function pararTimer() {
    clearInterval(timerInterval);
}

function tempoEsgotado() {
    if (!jogoAtivo) return;
    jogoAtivo = false;
    pararTimer();
    tocarSom('erro');
    alert("Tempo esgotado!");
    fimDeJogo(false);
}

function iniciarTimer() {
    pararTimer();
    let tempoRestante = TEMPO_LIMITE;
    timerBar.style.transition = 'none'; // Reseta transição para mudança de cor imediata
    timerBar.style.height = '100%';
    timerBar.style.backgroundColor = '#28a745'; // Verde
    
    // Força o navegador a aplicar o estilo antes de reativar a transição
    void timerBar.offsetWidth; 
    
    timerBar.style.transition = `height 1s linear, background-color 0.5s`;

    timerInterval = setInterval(() => {
        tempoRestante--;
        const alturaPercentual = (tempoRestante / TEMPO_LIMITE) * 100;
        timerBar.style.height = `${alturaPercentual}%`;

        if (tempoRestante <= TEMPO_LIMITE * 0.5) { // Metade do tempo
            timerBar.style.backgroundColor = '#fca311'; // Amarelo
        }
        if (tempoRestante <= TEMPO_LIMITE * 0.25) { // 1/4 do tempo
            timerBar.style.backgroundColor = '#dc3545'; // Vermelho
        }
        if (tempoRestante < 0) {
            tempoEsgotado();
        }
    }, 1000);
}

// --- FUNÇÕES PRINCIPAIS DO JOGO ---
function iniciarJogo() {
    if (perguntasOriginais.length < totalPerguntasJogo) {
        alert(`Não há perguntas suficientes!\nNecessárias: ${totalPerguntasJogo}\nDisponíveis: ${perguntasOriginais.length}`);
        voltarParaTelaInicial();
        return;
    }
    audioTema.pause(); 
    audioTema.currentTime = 0;
    perguntas = [...perguntasOriginais].sort(() => Math.random() - 0.5).slice(0, totalPerguntasJogo);
    perguntaAtualIndex = 0;
    pulosRestantes = 3;
    jogoAtivo = true;
    [btnPular, btnCartas, btnUniversitarios].forEach(btn => btn.disabled = false);
    btnPular.textContent = `Pular (${pulosRestantes})`;
    mostrarTela('tela-jogo');
    transicaoParaProximaPergunta(true);
}

function transicaoParaProximaPergunta(primeiraPergunta = false) {
    pararTimer();
    const containers = [perguntaContainer, opcoesContainer];
    containers.forEach(c => c.classList.add('fade-out'));
    
    setTimeout(() => {
        if (!primeiraPergunta) {
            perguntaAtualIndex++;
        }
        mostrarProximaPergunta();
        tocarSom('nova-pergunta');
        containers.forEach(c => c.classList.remove('fade-out'));
    }, 450);
}

function mostrarProximaPergunta() {
    if (perguntaAtualIndex >= totalPerguntasJogo) { fimDeJogo(true); return; }
    opcoesContainer.innerHTML = ''; 
    const pergunta = perguntas[perguntaAtualIndex];
    perguntaTexto.textContent = pergunta.pergunta;
    pergunta.opcoes.forEach(opcao => {
        const divOpcao = document.createElement('div');
        divOpcao.textContent = opcao;
        divOpcao.classList.add('opcao');
        divOpcao.addEventListener('click', () => selecionarResposta(divOpcao, pergunta.resposta), { once: true });
        opcoesContainer.appendChild(divOpcao);
    });
    atualizarPlacar();
    jogoAtivo = true;
    iniciarTimer();
}

function atualizarPlacar() {
    const nivel = perguntaAtualIndex;
    spans.nivel.textContent = nivel + 1;
    spans.valorAcertar.textContent = (niveisPremio.acertar[nivel] || 0).toLocaleString('pt-BR');
    spans.valorParar.textContent = (niveisPremio.parar[nivel] || 0).toLocaleString('pt-BR');
    spans.valorErrrar.textContent = (niveisPremio.errar[nivel + 1] || 0).toLocaleString('pt-BR');
}

function selecionarResposta(opcaoElemento, respostaCorreta) {
    if (!jogoAtivo) return;
    jogoAtivo = false; 
    pararTimer();
    const todasAsOpcoes = opcoesContainer.querySelectorAll('.opcao');
    if (opcaoElemento.textContent === respostaCorreta) {
        tocarSom('acerto');
        opcaoElemento.classList.add('correta');
        setTimeout(() => transicaoParaProximaPergunta(), 2500);
    } else {
        tocarSom('erro');
        opcaoElemento.classList.add('errada');
        todasAsOpcoes.forEach(opt => { if (opt.textContent === respostaCorreta) { opt.classList.add('revelada'); } });
        setTimeout(() => fimDeJogo(false), 3000);
    }
}

// --- FUNÇÕES DE AJUDA ---
function pularPergunta() {
    if (pulosRestantes > 0 && jogoAtivo) {
        pararTimer();
        pulosRestantes--;
        btnPular.textContent = `Pular (${pulosRestantes})`;
        if (pulosRestantes === 0) { btnPular.disabled = true; }
        jogoAtivo = false; 
        transicaoParaProximaPergunta();
    }
}

function usarCartas() {
    if (!jogoAtivo || btnCartas.disabled) return;
    // O timer continua rodando enquanto o jogador pensa
    const pergunta = perguntas[perguntaAtualIndex];
    const opcoes = Array.from(opcoesContainer.children);
    const opcoesErradas = opcoes.filter(opt => opt.textContent !== pergunta.resposta);
    opcoesErradas.sort(() => Math.random() - 0.5);
    for (let i = 0; i < 2; i++) {
        if (opcoesErradas[i]) {
            opcoesErradas[i].style.visibility = 'hidden';
            opcoesErradas[i].style.pointerEvents = 'none';
        }
    }
    btnCartas.disabled = true;
}

function usarUniversitarios() {
    if (!jogoAtivo || btnUniversitarios.disabled) return;
    // O timer continua rodando
    const pergunta = perguntas[perguntaAtualIndex];
    const chanceAcerto = Math.random() < 0.85; 
    let sugestao = chanceAcerto ? pergunta.resposta : pergunta.opcoes.filter(opt => opt !== pergunta.resposta)[0];
    alert(`Um universitário acha que a resposta correta é: ${sugestao}`);
    btnUniversitarios.disabled = true;
}

// --- FINALIZAÇÃO DO JOGO E NAVEGAÇÃO ---
function pararJogo() {
    if (!jogoAtivo) return;
    pararTimer();
    const premio = niveisPremio.parar[perguntaAtualIndex] || 0;
    fimDeJogo(false, premio);
}

function fimDeJogo(ganhou, premioParada = -1) {
    pararTimer();
    audioTema.pause();
    audioFinal.play().catch(e => console.error("Erro ao tocar áudio final:", e));
    mostrarTela('tela-final');
    jogoAtivo = false;
    let premioFinal = 0;
    if (premioParada > -1) { premioFinal = premioParada; }
    else if (ganhou) { premioFinal = niveisPremio.acertar[totalPerguntasJogo - 1]; }
    else { premioFinal = niveisPremio.errar[perguntaAtualIndex]; }
    premioFinalTexto.textContent = `R$ ${premioFinal.toLocaleString('pt-BR')}`;
}

function voltarParaTelaInicial() {
    pararTimer();
    audioFinal.pause();
    audioFinal.currentTime = 0;
    audioTema.play().catch(e => console.error("Erro ao tocar áudio de tema:", e));
    mostrarTela('tela-inicial');
    perguntasOriginais = [];
}

// --- LÓGICA DO MODO EDITOR ---
function lerArquivoDePerguntas(evento) {
    const arquivo = evento.target.files[0];
    if (!arquivo) return;
    const leitor = new FileReader();
    leitor.onload = function(e) {
        try {
            const perguntasDoArquivo = JSON.parse(e.target.result);
            if (!Array.isArray(perguntasDoArquivo) || !perguntasDoArquivo[0]?.pergunta) {
                 throw new Error("Estrutura do arquivo JSON inválida.");
            }
            perguntasOriginais = perguntasDoArquivo;
            iniciarJogo();
        } catch (error) {
            alert(`Erro ao ler o arquivo de perguntas: ${error.message}`);
        }
    };
    leitor.readAsText(arquivo);
}

// --- EVENT LISTENERS ---
function iniciarContextoDeAudio() {
    audioTema.play().catch(e => {
        // Silencia o erro de autoplay bloqueado
    });
}

btnModoJogador.addEventListener('click', () => {
    iniciarContextoDeAudio();
    perguntasOriginais = perguntasPadrao;
    iniciarJogo();
});

btnCarregarPerguntas.addEventListener('click', () => {
    iniciarContextoDeAudio();
    inputPerguntas.click();
});

inputPerguntas.addEventListener('change', lerArquivoDePerguntas);
btnReiniciar.addEventListener('click', voltarParaTelaInicial);
btnParar.addEventListener('click', pararJogo);
btnPular.addEventListener('click', pularPergunta);
btnCartas.addEventListener('click', usarCartas);
btnUniversitarios.addEventListener('click', usarUniversitarios);

window.addEventListener('load', iniciarContextoDeAudio);
