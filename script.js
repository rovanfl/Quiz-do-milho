// --- SELEÇÃO DE ELEMENTOS DO DOM ---
const telaInicial = document.getElementById('tela-inicial');
const telaEditor = document.getElementById('tela-editor');
const telaJogo = document.getElementById('tela-jogo');
const telaFinal = document.getElementById('tela-final');

const btnModoJogador = document.getElementById('btn-modo-jogador');
const btnModoEditor = document.getElementById('btn-modo-editor');
const btnCarregarPerguntas = document.getElementById('btn-carregar-perguntas');
const btnCarregarSomAcerto = document.getElementById('btn-carregar-som-acerto');
const btnCarregarSomErro = document.getElementById('btn-carregar-som-erro');
const btnVoltarInicio = document.getElementById('btn-voltar-inicio');

const inputPerguntas = document.getElementById('input-perguntas');
const inputSomAcerto = document.getElementById('input-som-acerto');
const inputSomErro = document.getElementById('input-som-erro');

const statusPerguntas = document.getElementById('status-perguntas');
const statusSons = document.getElementById('status-sons');

const btnParar = document.getElementById('btn-parar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const btnPular = document.getElementById('btn-pular');
const btnCartas = document.getElementById('btn-cartas');
const btnUniversitarios = document.getElementById('btn-universitarios');

const perguntaTexto = document.getElementById('pergunta-texto');
const opcoesContainer = document.getElementById('opcoes-container');
const premioFinalTexto = document.getElementById('premio-final');

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

// --- CONFIGURAÇÃO DE SOM ---
let sonsAcertoCarregados = [];
let sonsErroCarregados = [];
const sonsAcertoPadrao = [ { note: 'C5', duration: '8n' }, { note: 'E5', duration: '8n' }, { note: 'G5', duration: '8n' } ];
const sonsErroPadrao = [ { note: 'C3', duration: '4n' }, { note: 'B2', duration: '4n' } ];

function tocarSom(tipo) {
    const listaSons = tipo === 'acerto' ? sonsAcertoCarregados : sonsErroCarregados;
    if (listaSons.length > 0) {
        // Toca um som carregado pelo usuário
        const somUrl = listaSons[Math.floor(Math.random() * listaSons.length)];
        const audio = new Audio(somUrl);
        audio.play();
    } else {
        // Toca o som padrão gerado pelo Tone.js
        try {
            if (typeof Tone === 'undefined' || Tone.context.state !== 'running') { return; }
            const synth = new Tone.Synth().toDestination();
            const somPadrao = tipo === 'acerto'
                ? sonsAcertoPadrao[Math.floor(Math.random() * sonsAcertoPadrao.length)]
                : sonsErroPadrao[Math.floor(Math.random() * sonsErroPadrao.length)];
            synth.triggerAttackRelease(somPadrao.note, somPadrao.duration);
        } catch (error) { console.error("Erro ao tocar som padrão:", error); }
    }
}

// --- ESTADO DO JOGO ---
let perguntasOriginais = []; 
let perguntas = [];
let perguntaAtualIndex = 0;
let pulosRestantes = 3;
let jogoAtivo = false;

const niveisPremio = {
    acertar: [1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000, 500000, 1000000],
    parar: [0, 500, 1000, 1500, 2500, 5000, 10000, 15000, 25000, 50000, 500000],
    errar: [0, 250, 500, 750, 1250, 2500, 5000, 7500, 12500, 25000, 0]
};
const totalPerguntasJogo = niveisPremio.acertar.length;

// --- FUNÇÕES PRINCIPAIS DO JOGO ---
function iniciarJogo() {
    if (perguntasOriginais.length < totalPerguntasJogo) {
        alert(`Não há perguntas suficientes para iniciar!\n\nPerguntas necessárias: ${totalPerguntasJogo}\nPerguntas disponíveis: ${perguntasOriginais.length}`);
        voltarParaTelaInicial();
        return;
    }

    perguntas = [...perguntasOriginais].sort(() => Math.random() - 0.5).slice(0, totalPerguntasJogo);
    perguntaAtualIndex = 0;
    pulosRestantes = 3;
    jogoAtivo = true;

    [btnPular, btnCartas, btnUniversitarios].forEach(btn => btn.disabled = false);
    btnPular.textContent = `Pular (${pulosRestantes})`;
    
    // Esconde todas as telas de configuração
    telaInicial.classList.add('escondido');
    telaEditor.classList.add('escondido');
    telaFinal.classList.add('escondido');
    // Mostra a tela de jogo
    telaJogo.classList.remove('escondido');
    
    mostrarProximaPergunta();
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
    const todasAsOpcoes = opcoesContainer.querySelectorAll('.opcao');
    if (opcaoElemento.textContent === respostaCorreta) {
        tocarSom('acerto');
        opcaoElemento.classList.add('correta');
        setTimeout(() => {
            perguntaAtualIndex++;
            jogoAtivo = true;
            mostrarProximaPergunta();
        }, 2500);
    } else {
        tocarSom('erro');
        opcaoElemento.classList.add('errada');
        todasAsOpcoes.forEach(opt => {
            if (opt.textContent === respostaCorreta) { opt.classList.add('revelada'); }
        });
        setTimeout(() => fimDeJogo(false), 3000);
    }
}

// --- FUNÇÕES DE AJUDA ---
function pularPergunta() {
    if (pulosRestantes > 0 && jogoAtivo) {
        pulosRestantes--;
        perguntaAtualIndex++;
        btnPular.textContent = `Pular (${pulosRestantes})`;
        if (pulosRestantes === 0) { btnPular.disabled = true; }
        mostrarProximaPergunta();
    }
}

function usarCartas() {
    if (!jogoAtivo || btnCartas.disabled) return;
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
    const pergunta = perguntas[perguntaAtualIndex];
    const chanceAcerto = Math.random() < 0.85; 
    let sugestao = chanceAcerto ? pergunta.resposta : pergunta.opcoes.filter(opt => opt !== pergunta.resposta)[0];
    alert(`Um universitário acha que a resposta correta é: ${sugestao}`);
    btnUniversitarios.disabled = true;
}

// --- FINALIZAÇÃO DO JOGO E NAVEGAÇÃO ---
function pararJogo() {
    if (!jogoAtivo) return;
    const premio = niveisPremio.parar[perguntaAtualIndex] || 0;
    fimDeJogo(false, premio);
}

function fimDeJogo(ganhou, premioParada = -1) {
    telaJogo.classList.add('escondido');
    telaFinal.classList.remove('escondido');
    jogoAtivo = false;
    let premioFinal = 0;
    if (premioParada > -1) { premioFinal = premioParada; }
    else if (ganhou) { premioFinal = niveisPremio.acertar[totalPerguntasJogo - 1]; }
    else { premioFinal = niveisPremio.errar[perguntaAtualIndex]; }
    premioFinalTexto.textContent = `R$ ${premioFinal.toLocaleString('pt-BR')}`;
}

function voltarParaTelaInicial() {
    telaEditor.classList.add('escondido');
    telaFinal.classList.add('escondido');
    telaJogo.classList.add('escondido');
    telaInicial.classList.remove('escondido');
    // Reseta o status do editor
    perguntasOriginais = [];
    sonsAcertoCarregados = [];
    sonsErroCarregados = [];
    statusPerguntas.textContent = "Nenhum arquivo de perguntas carregado.";
    statusSons.textContent = "Usando sons padrão.";
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
            statusPerguntas.textContent = `Arquivo "${arquivo.name}" carregado.`;
            iniciarJogo();
        } catch (error) {
            alert(`Erro ao ler o arquivo de perguntas: ${error.message}`);
        }
    };
    leitor.readAsText(arquivo);
}

function lerArquivosDeSom(evento, tipo) {
    const arquivos = evento.target.files;
    if (!arquivos.length) return;

    const listaSons = tipo === 'acerto' ? sonsAcertoCarregados : sonsErroCarregados;
    // Limpa a lista anterior antes de adicionar novos sons
    listaSons.length = 0; 
    
    for (const arquivo of arquivos) {
        const urlSom = URL.createObjectURL(arquivo);
        listaSons.push(urlSom);
    }
    
    statusSons.textContent = `Sons personalizados carregados! (${sonsAcertoCarregados.length} acerto, ${sonsErroCarregados.length} erro).`;
    alert(`${arquivos.length} arquivo(s) de som de ${tipo} carregado(s) com sucesso!`);
}


// --- EVENT LISTENERS ---
function iniciarContextoDeAudio() {
    if (typeof Tone !== 'undefined' && Tone.context.state !== 'running') {
        Tone.start();
    }
}

btnModoJogador.addEventListener('click', () => {
    iniciarContextoDeAudio();
    perguntasOriginais = perguntasPadrao;
    iniciarJogo();
});

btnModoEditor.addEventListener('click', () => {
    iniciarContextoDeAudio();
    telaInicial.classList.add('escondido');
    telaEditor.classList.remove('escondido');
});

btnCarregarPerguntas.addEventListener('click', () => inputPerguntas.click());
btnCarregarSomAcerto.addEventListener('click', () => inputSomAcerto.click());
btnCarregarSomErro.addEventListener('click', () => inputSomErro.click());
btnVoltarInicio.addEventListener('click', voltarParaTelaInicial);

inputPerguntas.addEventListener('change', lerArquivoDePerguntas);
inputSomAcerto.addEventListener('change', (e) => lerArquivosDeSom(e, 'acerto'));
inputSomErro.addEventListener('change', (e) => lerArquivosDeSom(e, 'erro'));

btnReiniciar.addEventListener('click', voltarParaTelaInicial);
btnParar.addEventListener('click', pararJogo);
btnPular.addEventListener('click', pularPergunta);
btnCartas.addEventListener('click', usarCartas);
btnUniversitarios.addEventListener('click', usarUniversitarios);