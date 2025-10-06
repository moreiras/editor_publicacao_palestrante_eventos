window.THEME = {
  name: 'IX Fórum 19', // nome do evento exibido no texto auxiliar
  site: 'https://forum.ix.br/', // URL oficial do evento
  hashtags: '#semanainfrabr #nicbr #ixforum #internet #ixps #internetexchangepoints',

  // Referências visuais opcionais
  bgUrl: './template-teste-ixforum.png', // imagem de fundo em alta resolução
  textOnDark: '#FFA500',
  overlayOpacity: 0,

  // Layout para formatação final em 1080 x 1350 (proporção 4:5)
  layout: {
    photo: {
      x: 540, // posição X da foto (px)
      y: 600, // posição Y da foto (px)
      size: 490 // tamanho do lado da foto (px)
    },
    text: {
      x: 30, // posição X inicial dos textos (px)
      y: 600, // posição Y inicial (px)
      width: 490, // largura máxima do bloco de texto (px)
      linespace: 15 // espaço extra entre os blocos de texto (px)
    }
  },

  typography: {
    family: 'InterVar, system-ui, sans-serif',
    sizes: {
      name: 66,
      role: 30,
      talkTitle: 44,
      info: 30,
      social: 30
    }
  }
};

window.TEXT_TEMPLATE = `Olá. Estarei presente no evento: "{{evento}}", promovido pelo NIC.br. Minha atividade será: "{{palestra}}"! Saiba mais, inscreva-se para participar presencialmente ou online! {{site}} {{hashtags}}`;
