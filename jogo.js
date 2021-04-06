let jogo;

const elementos = {
  telaInicial: document.getElementById(`inicial`),
  telaJogo: document.getElementById(`jogo`),
  telaCadastro: document.getElementById(`cadastro`),
  telaMensagem: document.querySelector(`.mensagem`),
  textoMensagem: document.querySelector(`#texto`),
  telaDica: document.querySelector(`.dica`),
  textoDica: document.querySelector(`#texto-dica`),
  teclado: document.querySelector(`.teclado`),
  palavra: document.querySelector(`.palavra`),
  palavraCadastrada: document.querySelector(`#palavraCadastrada`),
  dicaCadastrada: document.querySelector(`#dicaCadastrada`),
  botoes: {
    facil: document.querySelector('.botao-facil'),
    medio: document.querySelector('.botao-medio'),
    dificil: document.querySelector('.botao-dificil'),
    reiniciar: document.querySelector('.reiniciar'),
    irParaCadastro: document.querySelector('#cadastrar-palavra'),
    cadastrar: document.querySelector('#botao-cadastro'),
    dica: document.querySelector('#dica'),
  },
  boneco: [
    document.querySelector('.boneco-cabeca'),
    document.querySelector('.boneco-corpo'),
    document.querySelector('.boneco-braco-esquerdo'),
    document.querySelector('.boneco-braco-direito'),
    document.querySelector('.boneco-perna-esquerda'),
    document.querySelector('.boneco-perna-direita'),
  ],
  radioButton: {
    facil: document.querySelector(`#facil`),
    medio: document.querySelector(`#medio`),
    dificil: document.querySelector(`#dificil`),
  },
};

const palavras = {
  facil: {
    palavra: ['anciã', 'série', 'avaro', 'maior', 'noite', 'ímpar', 'poder', 'vetor', 'prado', 'pecha'],
    dica: [
      'Que ou quem tem idade avançada',
      'Sequência sem interrupção',
      'Que revela zelo ou ciúme',
      'Que supera outro em número',
      'Horário em que está escuro',
      'O que não é divisível por dois',
      'Sinônimo de domínio',
      'Elemento de um espaço vetorial',
      'Pista para corridas de cavalo',
      'Defeito moral, vício',
    ],
  },
  medio: {
    palavra: ['cônjuge', 'exceção', 'efêmero', 'refutar', 'escória', 'análogo', 'caráter', 'genuíno', 'estória', 'sublime'],
    dica: [
      'relação da pessoa a quem está matrimonialmente vinculado',
      'desvio de uma regra ou padrão',
      'É passageiro, temporário',
      'O que afirma o contrário',
      'Resíduo silicoso proveniente da fusão de certas matérias',
      'função semelhante mas de origem embriologicamente distinta',
      'Qualidade distinta, índole, gênio e dignidade',
      'O mesmo que legítimo, verdadeiro',
      'Narrativa de cunho popular e tradicional',
      'Apresenta inexcedível perfeição material, moral ou intelectual',
    ],
  },
  dificil: {
    palavra: ['concepção', 'plenitude', 'essencial', 'hipócrita', 'corolário', 'paradigma', 'dicotomia', 'hegemonia', 'ratificar', 'propósito'],
    dica: [
      'Ação de gerar um ser vivo',
      'Estado do que é inteiro, completo',
      'Que é inerente a algo ou alguém',
      'Que ou aquele que demonstra uma coisa, quando pensa outra',
      'Coroa de folhas de ouro ou de outro metal',
      'Um exemplo que serve como modelo',
      'Aspecto que tem um planeta ao se apresentar dividido ao meio',
      'Supremacia, influência preponderante exercida por cidade, povo ou país',
      'Patentear a verdade de: comprovar, corroborar',
      'intenção (de fazer algo); projeto, desígnio',
    ],
  },
};

const novoJogo = () => {
  jogo = {
    dificuldade: undefined,
    palavra: {
      original: undefined,
      semAcentos: undefined,
      tamanho: undefined,
      dica: undefined,
    },
    acertos: undefined,
    jogadas: [],
    chances: 6,
    definirPalavra: function (palavra, dica) {
      this.palavra.original = palavra;
      this.palavra.tamanho = palavra.length;
      this.acertos = '';
      this.palavra.dica = dica;
      this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      for (let i = 0; i < this.palavra.tamanho; i++) {
        this.acertos += ' ';
      }
    },
    jogar: function (letraJogada) {
      let acertou = false;

      for (let i = 0; i < this.palavra.tamanho; i++) {
        const letra = this.palavra.semAcentos[i].toLowerCase();

        if (letra === letraJogada.toLowerCase()) {
          acertou = true;
          this.acertos = replace(this.acertos, i, this.palavra.original[i]);
        }
      }
      if (!acertou) {
        this.chances--;
      }
      return acertou;
    },
    ganhou: function () {
      return !this.acertos.includes(' ');
    },
    perdeu: function () {
      return this.chances <= 0;
    },
    acabou: function () {
      return this.ganhou() || this.perdeu();
    },
  };

  elementos.telaDica.style.display = 'none';
  elementos.textoDica.style.display = 'none';
  elementos.telaInicial.style.display = 'flex';
  elementos.telaJogo.style.display = 'none';
  elementos.telaMensagem.style.display = 'none';
  elementos.telaMensagem.classList.remove('mensagem-vitoria');
  elementos.telaMensagem.classList.remove('mensagem-derrota');
  elementos.telaDica.classList.remove('mensagem-dica');
  for (const parte of elementos.boneco) {
    parte.classList.remove('escondido');
    parte.classList.add('escondido');
  }
  criarTeclado();
};

const criarTeclado = () => {
  const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  elementos.teclado.textContent = '';
  for (const letra of letras) {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(letra.toUpperCase()));
    button.classList.add(`botao-${letra}`);

    elementos.teclado.appendChild(button);

    button.addEventListener('click', () => {
      if (!jogo.jogadas.includes(letra) && !jogo.acabou()) {
        const acertou = jogo.jogar(letra);
        jogo.jogadas.push(letra);
        button.classList.add(acertou ? 'certo' : 'errado');
        mostrarPalavra();

        if (!acertou) {
          mostrarErro();
        }

        if (jogo.ganhou()) {
          mostrarMensagem(true);
        } else if (jogo.perdeu()) {
          mostrarMensagem(false);
        }
      }
    });
  }
};

const mostrarErro = () => {
  const parte = elementos.boneco[5 - jogo.chances];
  parte.classList.remove('escondido');
};

const mostrarMensagem = vitoria => {
  const mensagem = vitoria ? '<p>Parabèns!</p><p>Você GANHOU</p>' : `<p>Que Pena! Você PERDEU!</p><p>A palavra era "${jogo.palavra.original.toUpperCase()}"</p>`;
  elementos.textoMensagem.innerHTML = mensagem;
  elementos.telaMensagem.style.display = 'flex';
  elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);
  elementos.telaDica.style.display = 'none';
};

const mostrarDica = () => {
  elementos.textoDica.innerHTML = `<p>${jogo.palavra.dica}</p>`;
  elementos.telaDica.classList.add('mensagem-dica');
  elementos.botoes.dica.style.display = 'none';
};

const mostrarTelaDica = () => {
  elementos.botoes.dica.style.display = 'flex';
  elementos.textoDica.style.display = 'flex';
  elementos.textoDica.innerHTML = ``;
  elementos.telaDica.style.display = 'flex';
};

const mostrarTelaCadastro = () => {
  elementos.telaCadastro.style.display = 'flex';
  elementos.telaInicial.style.display = 'none';
  elementos.telaJogo.style.display = 'none';
};

const sortearPalavra = () => {
  const i = Math.floor(Math.random() * palavras[jogo.dificuldade].palavra.length);
  jogo.definirPalavra(palavras[jogo.dificuldade].palavra[i], palavras[jogo.dificuldade].dica[i]);
};

const mostrarPalavra = () => {
  elementos.palavra.textContent = '';
  for (let i = 0; i < jogo.acertos.length; i++) {
    const letra = jogo.acertos[i].toUpperCase();
    elementos.palavra.innerHTML += `<div class="letra-${i}">${letra}</div>`;
  }
};

const iniciarJogo = dificuldade => {
  jogo.dificuldade = dificuldade;
  elementos.telaInicial.style.display = 'none';
  elementos.telaCadastro.style.display = 'none';
  elementos.telaJogo.style.display = 'flex';

  mostrarTelaDica();
  sortearPalavra();
  mostrarPalavra();
};

const cadastrarPalavra = () => {
  for (const i in elementos.radioButton) {
    if (elementos.radioButton[i].checked) {
      if (
        !palavras[`${i}`].palavra.includes(elementos.palavraCadastrada.value) &&
        elementos.palavraCadastrada.value != '' &&
        elementos.dicaCadastrada.value != ''
      ) {
        palavras[`${i}`].palavra.push(elementos.palavraCadastrada.value);
        palavras[`${i}`].dica.push(elementos.dicaCadastrada.value);
        elementos.telaInicial.style.display = 'flex';
        elementos.telaCadastro.style.display = 'none';
        elementos.telaJogo.style.display = 'none';
        alert('Palavra cadastrada!');
      } else {
        alert('Palavra já cadastrada!');
      }
    }
  }
};

const replace = (str, i, newChar) => str.substring(0, i) + newChar + str.substring(i + 1);

elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'));
elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'));
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'));
elementos.botoes.reiniciar.addEventListener('click', () => novoJogo());
elementos.botoes.dica.addEventListener('click', () => mostrarDica());
elementos.botoes.irParaCadastro.addEventListener('click', () => mostrarTelaCadastro());
elementos.botoes.cadastrar.addEventListener('click', () => cadastrarPalavra());

novoJogo();
