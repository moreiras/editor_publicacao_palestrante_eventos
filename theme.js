window.EVENT_THEMES = [
   {
    id: 'gter-gts-2024',
    name: 'GTER 54 GTS 40',
    site: 'https://gtergts.nic.br/',
    hashtags: '#gter #engenharia #redes #gts #seguranca #comunidade #semanainfra #nicbr #cgibr #internet',
    bgUrl: './templates/gter-54-gts-40.png',
    textOnDark: '#FFFFFF',
    overlayOpacity: 0,
    layout: {
      photo: {
        x: 60,
        y: 160,
        size: 429,
        shape: 'circle'
      },
      text: {
        x: 60,
        y: 680,
        width: 960,
        linespace: 18,
        align: 'center'
      }
    },
    typography: {
      family: 'Elza, system-ui, sans-serif',
      textStyles: {
        name: { size: 60, color: '#fee08b' },
        cargo: { size: 40, color: '#ffffff' },
        empresa: { size: 40, color: '#fee08b' },
        palestra: { size: 50, color: '#FFFFFF' },
        dia: { size: 40, color: '#fee08b' },
        horario: { size: 40, color: '#fee08b' },
        social: { size: 30, color: '#FFFFFF' }
      }
    }
  },
  {
    id: 'ix-forum-19',
    name: 'IX Fórum 19',
    site: 'https://forum.ix.br/',
    hashtags: '#ixforum #ixforum19 #nicbr #cgibr #semanainfra #tecnologia #peering #ixp #ptt #trocadetráfego #provedores #isps #internet',
    bgUrl: './templates/ixforum-19.png',
    textOnDark: '#FFFFFF',
    overlayOpacity: 0,
    layout: {
      photo: {
        x: 60,
        y: 160,
        size: 429,
        shape: 'circle'
      },
      text: {
        x: 60,
        y: 700,
        width: 960,
        linespace: 18,
        align: 'center'
      }
    },
    typography: {
      family: 'Elza, system-ui, sans-serif',
      textStyles: {
        name: { size: 60, color: '#f2cb05' },
        cargo: { size: 40, color: '#ffffff' },
        empresa: { size: 40, color: '#f2cb05' },
        palestra: { size: 50, color: '#FFFFFF' },
        dia: { size: 40, color: '#f2cb05' },
        horario: { size: 40, color: '#f2cb05' },
        social: { size: 30, color: '#FFFFFF' }
      }
    }
  },
    {
    id: 'forum-bcop',
    name: 'Fórum BCOP 2025',
    site: 'https://forumbcop.nic.br',
    hashtags: '#semanainfrabr #nicbr #cgibr #forumbcop #internet #bcop #icann #dns #segurança',
    bgUrl: './templates/forum-bcop.png',
    textOnDark: '#FFFFFF',
    overlayOpacity: 0,
    layout: {
      photo: {
        x: 60,
        y: 160,
        size: 429,
        shape: 'circle'
      },
      text: {
        x: 60,
        y: 680,
        width: 960,
        linespace: 18,
        align: 'center'
      }
    },
    typography: {
      family: 'Elza, system-ui, sans-serif',
      textStyles: {
        name: { size: 60, color: '#113758' },
        cargo: { size: 40, color: '#ffffff' },
        empresa: { size: 40, color: '#113758' },
        palestra: { size: 50, color: '#FFFFFF' },
        dia: { size: 40, color: '#113758' },
        horario: { size: 40, color: '#113758' },
        social: { size: 30, color: '#FFFFFF' }
      }
    }
  }
];

window.TEXT_TEMPLATE = `Olá. Estarei presente no {{evento}}, evento promovido pelo NIC.br. Minha atividade será: {{palestra}}! Saiba mais, inscreva-se para participar presencialmente ou online! {{site}} {{hashtags}}`;
