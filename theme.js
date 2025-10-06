window.THEME = {
  name: 'Semana de Infraestrutura 2025', // nome do evento
  site: 'https://semanainfra.nic.br/',   // URL do evento
  hashtags: '#SemanaInfra #NICbr #InfraestruturaDeInternet',

  // artes (opcionais)
  bgUrl: './template-teste-ixforum.png',
  logoUrl: '', // logo do evento com transparência (PNG/SVG)

  // paleta (alto contraste)
  accent: '#0B3E91',
  accent2: '#1E88E5',
  textOnDark: '#E8c845',

  layout: {
    photo: {
      x: 400,   // posição X da foto (px)
      y: 600,   // posição Y da foto (px)
      size: 500 // tamanho do lado da foto (px)
    },
    text: {
      x: 20,          // posição X inicial dos textos (px)
      y: 600,         // posição Y inicial (px)
      width: 360,     // largura máxima do bloco de texto (px)
      gapAfterEvent: 52 // espaço entre o nome do evento e os demais textos (px)
    }
  },

  typography: {
    family: 'InterVar, system-ui, sans-serif',
    sizes: {
      name: 66,
      role: 32,
      company: 30,
      talkTitle: 36,
      info: 28,
      social: 30
    }
  }
};

window.TEXT_TEMPLATE = `Olá. Estarei presente no evento {{evento}}, promovido pelo NIC.br. Minha atividade será "{{palestra}}, em {{data}}, {{horário}}! Saiba mais, se inscreva e acompanhe ao vivo em {{site}}! {{hashtags}}`;
