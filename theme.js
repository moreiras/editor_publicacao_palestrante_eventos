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
        linespace: 18
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
        linespace: 24
      }
    },
    typography: {
      family: 'InterVar, system-ui, sans-serif',
      textStyles: {
        name: { size: 62, color: '#FDF2F8', align: 'left' },
        cargo: { size: 30, color: '#F4A259', align: 'left' },
        empresa: { size: 30, color: '#FDCB82', align: 'left' },
        palestra: { size: 40, color: '#FFFFFF', align: 'left' },
        dia: { size: 30, color: '#F4A259', align: 'left' },
        horario: { size: 30, color: '#F4A259', align: 'left' },
        social: { size: 28, color: '#FFFFFF', align: 'left' }
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
        linespace: 22
      }
    },
    typography: {
      family: 'InterVar, system-ui, sans-serif',
      textStyles: {
        name: { size: 64, color: '#FFFFFF', align: 'left' },
        cargo: { size: 32, color: '#7DD3FC', align: 'left' },
        empresa: { size: 32, color: '#38BDF8', align: 'left' },
        palestra: { size: 42, color: '#FFFFFF', align: 'left' },
        dia: { size: 32, color: '#7DD3FC', align: 'left' },
        horario: { size: 32, color: '#7DD3FC', align: 'left' },
        social: { size: 30, color: '#E0F2FE', align: 'left' }
      }
    }
  }
];

window.TEXT_TEMPLATE = `Olá. Estarei presente no evento: "{{evento}}", promovido pelo NIC.br. Minha atividade será: "{{palestra}}"! Saiba mais, inscreva-se para participar presencialmente ou online! {{site}} {{hashtags}}`;
