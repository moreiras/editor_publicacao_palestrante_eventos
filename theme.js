window.THEME = {
  name: 'Semana de Infraestrutura 2025', // nome do evento
  site: 'https://semanainfra.nic.br/',   // URL do evento
  hashtags: '#SemanaInfra #NICbr #InfraestruturaDeInternet',

  // artes (opcionais)
  bgUrl: 'template-teste-ixforum.png',  // banner de fundo (PNG/JPG/WebP/SVG). Se vazio, usa gradiente.
  logoUrl: '', // logo do evento com transparência (PNG/SVG)

  // paleta (alto contraste)
  accent: '#0B3E91',
  accent2: '#1E88E5',
  textOnDark: '#FFFFFF',

  layout: {
    photo: {
      x: 665,   // posição X da foto (px)
      y: 259,   // posição Y da foto (px)
      size: 367 // tamanho do lado da foto (px)
    },
    text: {
      x: 48,          // posição X inicial dos textos (px)
      y: 60,          // posição Y inicial (px)
      width: 577,     // largura máxima do bloco de texto (px)
      gapAfterEvent: 42 // espaço entre o nome do evento e os demais textos (px)
    }
  },

  typography: {
    family: 'InterVar, system-ui, sans-serif',
    sizes: {
      eventName: 36,
      name: 58,
      role: 30,
      company: 28,
      talkTitle: 32,
      info: 26,
      footer: 24,
      social: 24
    }
  }
};

window.TEXT_TEMPLATE = `Olá. Estarei presente no evento {{evento}}, promovido pelo NIC.br. Minha atividade será "{{palestra}}, em {{data}}, {{horário}}! Saiba mais, se inscreva e acompanhe ao vivo em {{site}}! {{hashtags}}`;
