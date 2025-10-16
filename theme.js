window.EVENT_THEMES = [
  {
    id: 'ix-forum-19',
    name: 'IX Fórum 19',
    site: 'https://forum.ix.br/',
    hashtags: '#semanainfrabr #nicbr #ixforum #internet #ixps #internetexchangepoints',
    bgUrl: './Instagram post - 1.png',
    textOnDark: '#FFFFFF',
    overlayOpacity: 0,
    layout: {
      photo: {
        x: 60,
        y: 140,
        size: 363,
        shape: 'circle'
      },
      text: {
        x: 60,
        y: 600,
        width: 960,
        linespace: 18,
        align: 'left'
      }
    },
    typography: {
      family: 'InterVar, system-ui, sans-serif',
      textStyles: {
        name: { size: 66, color: '#FFFFFF' },
        cargo: { size: 30, color: '#F9A826' },
        empresa: { size: 30, color: '#F2D024' },
        palestra: { size: 44, color: '#FFFFFF' },
        dia: { size: 30, color: '#F9A826' },
        horario: { size: 30, color: '#F9A826' },
        social: { size: 30, color: '#FFFFFF' }
      }
    }
  },
  {
    id: 'semanainfra-2024',
    name: 'Semana da Infraestrutura 2024',
    site: 'https://nic.br/semanainfra/',
    hashtags: '#semanainfrabr #nicbr #infraestrutura #tecnologia',
    bgUrl: './Instagram post - 2.png',
    textOnDark: '#FFFFFF',
    overlayOpacity: 0.2,
    layout: {
      photo: {
        x: 620,
        y: 160,
        size: 360,
        shape: 'square',
        borderRadius: 32,
        margin: 40
      },
      text: {
        x: 80,
        y: 220,
        width: 460,
        linespace: 24,
        align: 'left'
      }
    },
    typography: {
      family: 'InterVar, system-ui, sans-serif',
      textStyles: {
        name: { size: 62, color: '#FDF2F8' },
        cargo: { size: 30, color: '#F4A259' },
        empresa: { size: 30, color: '#FDCB82' },
        palestra: { size: 40, color: '#FFFFFF' },
        dia: { size: 30, color: '#F4A259' },
        horario: { size: 30, color: '#F4A259' },
        social: { size: 28, color: '#FFFFFF' }
      }
    }
  },
  {
    id: 'gts-2024',
    name: 'GTS 2024',
    site: 'https://gts.nic.br/',
    hashtags: '#gts #nicbr #seguranca #comunidade',
    bgUrl: './Instagram post - 3.png',
    textOnDark: '#FFFFFF',
    overlayOpacity: 0.35,
    layout: {
      photo: {
        x: 80,
        y: 160,
        size: 380,
        shape: 'circle',
        margin: 48
      },
      text: {
        x: 520,
        y: 220,
        width: 480,
        linespace: 22,
        align: 'left'
      }
    },
    typography: {
      family: 'InterVar, system-ui, sans-serif',
      textStyles: {
        name: { size: 64, color: '#FFFFFF' },
        cargo: { size: 32, color: '#7DD3FC' },
        empresa: { size: 32, color: '#38BDF8' },
        palestra: { size: 42, color: '#FFFFFF' },
        dia: { size: 32, color: '#7DD3FC' },
        horario: { size: 32, color: '#7DD3FC' },
        social: { size: 30, color: '#E0F2FE' }
      }
    }
  }
];

window.TEXT_TEMPLATE = `Olá. Estarei presente no evento: "{{evento}}", promovido pelo NIC.br. Minha atividade será: "{{palestra}}"! Saiba mais, inscreva-se para participar presencialmente ou online! {{site}} {{hashtags}}`;
