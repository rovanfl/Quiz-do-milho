// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const telaInicial = document.getElementById('tela-inicial');
const telaJogo = document.getElementById('tela-jogo');
const telaFinal = document.getElementById('tela-final');
const telaCreditos = document.getElementById('tela-creditos');

const btnModoJogador = document.getElementById('btn-modo-jogador');
const btnCarregarPerguntas = document.getElementById('btn-carregar-perguntas');
const btnCreditos = document.getElementById('btn-creditos');
const btnVoltarCreditos = document.getElementById('btn-voltar-creditos');
const inputPerguntas = document.getElementById('input-perguntas');
const btnToggleSom = document.getElementById('btn-toggle-som');

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
// Agora com 20 perguntas, divididas em fáceis e difíceis
const perguntasPadrao = [
  // 10 Perguntas Fáceis (Níveis 1-7)
  { pergunta: "Qual é a capital da França?", opcoes: ["Londres", "Berlim", "Paris", "Madri"], resposta: "Paris" },
  { pergunta: "Quanto é 7 x 6?", opcoes: ["42", "48", "36", "49"], resposta: "42" },
  { pergunta: "Qual o maior planeta do sistema solar?", opcoes: ["Terra", "Marte", "Júpiter", "Saturno"], resposta: "Júpiter" },
  { pergunta: "Qual destes animais é um mamífero?", opcoes: ["Pinguim", "Tartaruga", "Baleia", "Jacaré"], resposta: "Baleia" },
  { pergunta: "Quantos lados tem um heptágono?", opcoes: ["5", "6", "7", "8"], resposta: "7" },
  { pergunta: "Qual o plural de 'cidadão'?", opcoes: ["Cidadãos", "Cidadões", "Cidades", "Cidadãs"], resposta: "Cidadãos" },
  { pergunta: "Em que país se localiza a cidade de Machu Picchu?", opcoes: ["Bolívia", "Colômbia", "Peru", "Chile"], resposta: "Peru" },
  { pergunta: "Qual empresa desenvolveu o Windows?", opcoes: ["Apple", "Microsoft", "Google", "Linux Foundation"], resposta: "Microsoft" },
  { pergunta: "Qual o oceano mais profundo?", opcoes: ["Atlântico", "Índico", "Ártico", "Pacífico"], resposta: "Pacífico" },
  { pergunta: "Quantos continentes existem?", opcoes: ["5", "6", "7", "8"], resposta: "6" },
  // 10 Perguntas Difíceis (Níveis 8-14)
  { pergunta: "Em que ano o homem pisou na Lua?", opcoes: ["1965", "1969", "1972", "1980"], resposta: "1969" },
  { pergunta: "Quem pintou a Mona Lisa?", opcoes: ["Van Gogh", "Picasso", "Michelangelo", "Leonardo da Vinci"], resposta: "Leonardo da Vinci" },
  { pergunta: "Qual o metal mais abundante na crosta terrestre?", opcoes: ["Ferro", "Cobre", "Ouro", "Alumínio"], resposta: "Alumínio" },
  { pergunta: "De quem é a famosa frase “Penso, logo existo”?", opcoes: ["Platão", "Sócrates", "Aristóteles", "Descartes"], resposta: "Descartes" },
  { pergunta: "Qual o livro mais vendido no mundo depois da Bíblia?", opcoes: ["O Senhor dos Anéis", "Dom Quixote", "O Pequeno Príncipe", "Harry Potter"], resposta: "Dom Quixote" },
  { pergunta: "Qual a montanha mais alta do mundo?", opcoes: ["K2", "Monte Everest", "Aconcágua", "Makalu"], resposta: "Monte Everest" },
  { pergunta: "Qual é o rio mais longo do mundo?", opcoes: ["Nilo", "Amazonas", "Yangtzé", "Mississippi"], resposta: "Amazonas" },
  { pergunta: "Qual o elemento químico cujo símbolo é 'Au'?", opcoes: ["Prata", "Argônio", "Ouro", "Alumínio"], resposta: "Ouro" },
  { pergunta: "Qual foi a primeira civilização a usar a escrita?", opcoes: ["Egípcios", "Sumérios", "Gregos", "Romanos"], resposta: "Sumérios" },
  { pergunta: "Qual destes compositores é considerado um 'prodígio' da música clássica?", opcoes: ["Bach", "Beethoven", "Mozart", "Vivaldi"], resposta: "Mozart" }
];

// --- CONFIGURAÇÃO DE SOM ---
const nomesSonsAcerto = ['A1.mp3', 'A2.mp3', 'A3.mp3']; 
const nomesSonsErro = ['E1.mp3', 'E2.mp3']; 

const audioNovaPergunta = new Audio('audios/nova-pergunta.mp3');
const audioTema = new Audio('audios/tema.mp3');
const audioFinal = new Audio('audios/final.mp3');

audioTema.loop = true;
audioTema.volume = 0.2;

let sonsAtivados = true;
let audioIniciadoPeloUsuario = false;

const iconeSomLigado = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
const iconeSomDesligado = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-volume-x"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;

function toggleSom() {
    sonsAtivados = !sonsAtivados;
    btnToggleSom.innerHTML = sonsAtivados ? iconeSomLigado : iconeSomDesligado;
    const estaNoJogo = !telaJogo.classList.contains('escondido');
    if (!sonsAtivados) {
        audioTema.pause();
        audioFinal.pause();
    } else if (audioIniciadoPeloUsuario && !estaNoJogo) {
        audioTema.play().catch(e => {});
    }
}

function tocarSom(tipo) {
    if (!sonsAtivados) return;
    let audio;
    if (tipo === 'nova-pergunta') { audio = audioNovaPergunta; } 
    else {
        const listaNomes = tipo === 'acerto' ? nomesSonsAcerto : nomesSonsErro;
        const pasta = tipo === 'acerto' ? 'acerto' : 'erro';
        if (listaNomes.length > 0) {
            const nomeArquivo = listaNomes[Math.floor(Math.random() * listaNomes.length)];
            audio = new Audio(`audios/${pasta}/${nomeArquivo}`);
        }
    }
    if (audio) { audio.play().catch(e => {}); }
}

// --- ESTADO DO JOGO E CRONÔMETRO ---
let perguntasOriginais = []; 
let perguntas = [];
let perguntasReservaFaceis = [];
let perguntasReservaDificeis = [];
let perguntaAtualIndex = 0;
let pulosRestantes = 3;
let jogoAtivo = false;
let timerInterval = null;
const TEMPO_LIMITE = 20;

const niveisPremio = {
    acertar: [1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000, 100000, 250000, 500000, 1000000],
    parar: [0, 1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 80000, 150000, 400000, 500000],
    errar: [0, 500, 1000, 1500, 2000, 2500, 5000, 10000, 15000, 20000, 40000, 100000, 200000, 0]
};
const totalPerguntasJogo = niveisPremio.acertar.length;

// --- GERENCIAMENTO DE TELAS ---
function mostrarTela(nomeTela) {
    [telaInicial, telaJogo, telaFinal, telaCreditos].forEach(tela => {
        tela.id === nomeTela ? tela.classList.remove('escondido') : tela.classList.add('escondido');
    });
}

// --- LÓGICA DO CRONÔMETRO ---
function pararTimer() { clearInterval(timerInterval); }
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
    timerBar.style.transition = 'none';
    timerBar.style.height = '100%';
    timerBar.style.backgroundColor = '#28a745';
    void timerBar.offsetWidth; 
    timerBar.style.transition = `height 1s linear, background-color 0.5s`;
    timerInterval = setInterval(() => {
        tempoRestante--;
        timerBar.style.height = `${(tempoRestante / TEMPO_LIMITE) * 100}%`;
        if (tempoRestante <= TEMPO_LIMITE * 0.5) { timerBar.style.backgroundColor = '#fca311'; }
        if (tempoRestante <= TEMPO_LIMITE * 0.25) { timerBar.style.backgroundColor = '#dc3545'; }
        if (tempoRestante < 0) { tempoEsgotado(); }
    }, 1000);
}

// --- FUNÇÕES PRINCIPAIS DO JOGO ---
function iniciarJogo() {
    if (perguntasOriginais.length < 20) {
        alert(`Não há perguntas suficientes!\nNecessárias: 20\nDisponíveis: ${perguntasOriginais.length}`);
        voltarParaTelaInicial();
        return;
    }
    
    const perguntasFaceis = [...perguntasOriginais.slice(0, 10)].sort(() => Math.random() - 0.5);
    const perguntasDificeis = [...perguntasOriginais.slice(10, 20)].sort(() => Math.random() - 0.5);

    perguntas = perguntasFaceis.slice(0, 7).concat(perguntasDificeis.slice(0, 7));
    perguntasReservaFaceis = perguntasFaceis.slice(7); // 3 de reserva
    perguntasReservaDificeis = perguntasDificeis.slice(7); // 3 de reserva
    
    if (sonsAtivados) { audioTema.play().catch(e => {}); }

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
    [perguntaContainer, opcoesContainer].forEach(c => c.classList.add('fade-out'));
    setTimeout(() => {
        if (!primeiraPergunta) { perguntaAtualIndex++; }
        mostrarProximaPergunta();
        tocarSom('nova-pergunta');
        [perguntaContainer, opcoesContainer].forEach(c => c.classList.remove('fade-out'));
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
    spans.valorErrrar.textContent = (niveisPremio.errar[nivel] || 0).toLocaleString('pt-BR');
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
        const ehNivelFacil = perguntaAtualIndex < 7;
        const bancoReserva = ehNivelFacil ? perguntasReservaFaceis : perguntasReservaDificeis;

        if (bancoReserva.length > 0) {
            pararTimer();
            pulosRestantes--;
            btnPular.textContent = `Pular (${pulosRestantes})`;
            if (pulosRestantes === 0) { btnPular.disabled = true; }
            
            jogoAtivo = false; 
            perguntas[perguntaAtualIndex] = bancoReserva.shift();

            [perguntaContainer, opcoesContainer].forEach(c => c.classList.add('fade-out'));
            setTimeout(() => {
                mostrarProximaPergunta();
                tocarSom('nova-pergunta');
                [perguntaContainer, opcoesContainer].forEach(c => c.classList.remove('fade-out'));
            }, 450);
        } else {
            alert("Não há mais perguntas na reserva para este nível de dificuldade!");
        }
    }
}

function usarCartas() {
    if (!jogoAtivo || btnCartas.disabled) return;
    
    const cartas = [
        { nome: "Coringa", remove: 0 },
        { nome: "Ás", remove: 1 },
        { nome: "Dois", remove: 2 },
        { nome: "Três", remove: 3 }
    ];
    const cartaSorteada = cartas[Math.floor(Math.random() * cartas.length)];
    alert(`Você tirou a carta "${cartaSorteada.nome}"!`);

    if (cartaSorteada.remove > 0) {
        const pergunta = perguntas[perguntaAtualIndex];
        const opcoes = Array.from(opcoesContainer.children);
        const opcoesErradas = opcoes.filter(opt => opt.textContent !== pergunta.resposta);
        opcoesErradas.sort(() => Math.random() - 0.5);

        for (let i = 0; i < cartaSorteada.remove; i++) {
            if (opcoesErradas[i]) {
                opcoesErradas[i].style.visibility = 'hidden';
                opcoesErradas[i].style.pointerEvents = 'none';
            }
        }
    }
    btnCartas.disabled = true;
}

function usarUniversitarios() {
    if (!jogoAtivo || btnUniversitarios.disabled) return;
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
    if (sonsAtivados) { audioFinal.play().catch(e => {}); }
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
    if (sonsAtivados && audioIniciadoPeloUsuario) { audioTema.play().catch(e => {}); }
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
function iniciarAudioComInteracao() {
    if (!audioIniciadoPeloUsuario) {
        audioIniciadoPeloUsuario = true;
        if (sonsAtivados) {
            audioTema.play().catch(e => {});
        }
    }
}
btnModoJogador.addEventListener('click', () => {
    iniciarAudioComInteracao();
    perguntasOriginais = perguntasPadrao;
    iniciarJogo();
});
btnCarregarPerguntas.addEventListener('click', () => {
    iniciarAudioComInteracao();
    inputPerguntas.click();
});
btnCreditos.addEventListener('click', () => {
    iniciarAudioComInteracao();
    mostrarTela('tela-creditos');
});
btnVoltarCreditos.addEventListener('click', voltarParaTelaInicial);

inputPerguntas.addEventListener('change', lerArquivoDePerguntas);
btnReiniciar.addEventListener('click', voltarParaTelaInicial);
btnParar.addEventListener('click', pararJogo);
btnPular.addEventListener('click', pularPergunta);
btnCartas.addEventListener('click', usarCartas);
btnUniversitarios.addEventListener('click', usarUniversitarios);
btnToggleSom.addEventListener('click', toggleSom);
