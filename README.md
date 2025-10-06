# Criador de posts para palestrantes de eventos

Aplicação web estática que gera artes e textos de divulgação para palestrantes
de eventos do NIC.br. Tudo roda no navegador: o usuário preenche os dados do
palestrante, faz o upload e o recorte da foto e, ao final, exporta a arte em PNG
ou compartilha o conteúdo diretamente via Web Share API (quando suportada).

## Recursos principais

- Formulário completo para nome, cargo, empresa, título da palestra, data,
  horário e @social.
- Upload da foto com recorte quadrado, rotação, zoom e ajustes de brilho,
  contraste e saturação (Cropper.js + filtros do canvas).
- Pré-visualização em tempo real da arte final (1080x1350, proporção 4:5).
- Geração automática de texto para redes sociais com base em um template.
- Exportação para PNG com FileSaver.js ou compartilhamento via Web Share API.
- Layout, tipografia e fundos customizáveis através de `theme.js`.

## Estrutura do projeto

```
.
├── index.html      # Página principal com o formulário e o preview
├── scripts.js      # Lógica de recorte, renderização do canvas e exportação
├── styles.css      # Ajustes visuais complementares ao Tailwind
├── theme.js        # Configurações de tema (layout, tipografia e template)
├── template-teste-ixforum.png  # Arte base usada como fundo padrão
└── LICENSE
```

Bibliotecas externas são carregadas via CDN no `index.html`:

- Tailwind CSS (estilização da interface)
- Cropper.js (recorte da foto)
- FileSaver.js (download do PNG)

## Como executar

Não há dependências de build. Basta abrir `index.html` em um navegador
moderno (Chrome, Edge, Firefox ou Safari). Se desejar servir a partir de um
servidor local para facilitar testes, você pode usar, por exemplo, o `npx serve`:

```bash
npx serve .
```

## Personalização do tema

O arquivo `theme.js` centraliza todas as configurações do layout final:

- **Identidade do evento:** nome, site e hashtags usados no texto gerado.
- **Arte base:** URL do fundo (`bgUrl`), cor do texto e opacidade da sobreposição.
- **Posicionamento:** coordenadas e tamanhos da foto e dos blocos de texto.
- **Tipografia:** família e tamanhos dos textos para nome, cargo, título, etc.
- **Template textual:** string com placeholders (`{{evento}}`, `{{palestra}}`, ...)
  interpolados pelo `scripts.js`.

Altere esses valores para adaptar a ferramenta a outros eventos ou formatos de
arte. Caso utilize imagens hospedadas em outro domínio, garanta que elas tenham
CORS liberado; caso contrário, o script removerá o fundo automaticamente para
permitir a exportação do canvas.

## Limitações conhecidas

- Navegadores sem suporte ao elemento `<canvas>` ou ao File API não conseguem
  gerar ou baixar a arte.
- O compartilhamento direto só funciona em navegadores que implementam a Web
  Share API (nível 2). Caso contrário, o aplicativo informa para baixar a arte
  manualmente.
- Imagens remotas sem cabeçalhos CORS podem impedir a exportação/compartilhamento;
  o código tenta contornar a limitação, mas pode ser necessário usar fundos do
  mesmo domínio.

## Licença

Este projeto está licenciado sob os termos da licença MIT (veja `LICENSE`).
