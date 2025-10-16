window.THEME = {
  name: 'IX Fórum 19', // nome do evento exibido no texto auxiliar
  site: 'https://forum.ix.br/', // URL oficial do evento
  hashtags: '#semanainfrabr #nicbr #ixforum #internet #ixps #internetexchangepoints',

  // Referências visuais opcionais
  bgUrl: './instagram post - 1.png', // imagem de fundo em alta resolução
  textOnDark: '#FFFFFF',
  overlayOpacity: 0,

  // Layout para formatação final em 1080 x 1350 (proporção 4:5)
  layout: {
    photo: {
      x: 60, // posição X da foto (px)
      y: 140, // posição Y da foto (px)
      size: 363, // tamanho do lado da foto (px)
      shape: 'square' // use 'circle' para recorte circular
    },
    text: {
      x: 60, // posição X inicial dos textos (px)
      y: 600, // posição Y inicial (px)
      width: 960, // largura máxima do bloco de texto (px)
      linespace: 18 // espaço extra entre os blocos de texto (px)
    }
  },

  typography: {
    family: 'InterVar, system-ui, sans-serif',
    textStyles: {
      name: { size: 66, color: '#FFFFFF', align: 'left' },
      cargo: { size: 30, color: '#F9A826', align: 'left' },
      empresa: { size: 30, color: '#F2D024', align: 'left' },
      palestra: { size: 44, color: '#FFFFFF', align: 'left' },
      dia: { size: 30, color: '#F9A826', align: 'left' },
      horario: { size: 30, color: '#F9A826', align: 'left' },
      social: { size: 30, color: '#FFFFFF', align: 'left' }
    }
  }
};

window.TEXT_TEMPLATE = `Olá. Estarei presente no evento: "{{evento}}", promovido pelo NIC.br. Minha atividade será: "{{palestra}}"! Saiba mais, inscreva-se para participar presencialmente ou online! {{site}} {{hashtags}}`;
