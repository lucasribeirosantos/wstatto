# WCosta Tattoo · prévia de página única

Página para o **WCosta Estúdio de Tatuagem** (Wellington Costa, @wcosta.tattoo), Divinópolis-MG.
HTML, CSS e JavaScript puro, mobile first.

```
index.html      estrutura, SEO local e dados estruturados (TattooParlor)
style.css       visual (fundo quase preto + off-white, Big Shoulders Display 900 + Manrope, como a LP Be Happy)
script.js       config do WhatsApp, filtros, lightbox, acordeão e animações
assets/img/     fotos (Instagram do estúdio)
prints/         celular-primeira-dobra.png (390x844) e desktop-pagina-inteira.png (1440px)
prints.cjs      script Playwright que gera os prints
```

## Rodar e gerar os prints

```bash
python -m http.server 5510
```

```bash
npm i playwright && node prints.cjs
```

O script usa o Google Chrome instalado (`channel: 'chrome'`), então não precisa baixar navegador.

## Animações (no formato da LP Be Happy SJDR)

Mesmas bibliotecas por CDN (GSAP 3.12.5 + ScrollTrigger e Lenis 1.1.13) e a mesma sequência de efeitos:

* **Loader** com a assinatura "W" desenhada em traço fino, que sobe e libera o hero.
* **Hero fixo no scroll**: título letra a letra, raios em traço fino e fumaça de tinta que desvia do mouse. Ao rolar, o conteúdo sai e um **portal** abre por clip-path até a tattoo das garças em tela cheia, com "Entra. Sai com arte."
* **Faixas inclinadas** em sentidos opostos que aceleram e entortam com a velocidade do scroll.
* **Sobre**: frase grande que acende palavra por palavra, contadores e foto em arco que abre por clip-path.
* **Portfólio em trilho horizontal** fixo no desktop (arrastar no celular), com numeração, contador "01 / 12", barra de progresso, inclinação 3D no mouse, filtros e tela cheia.
* **Vitrine**: duas fileiras de fotos em loop infinito, que desaceleram no hover, e o fecho "E isso não é nem metade."
* **Estúdio**: selo giratório "Linhas finas · desde 2016" com a assinatura W e foto com parallax. (O selo LGBTQ+ friendly foi removido a pedido.)
* **Como agendar**: a linha fina é desenhada pelo scroll e um ponto percorre os 3 passos até o coração.
* Menu do celular abrindo em círculo, barra fixa de orçamento, barra de progresso, botões magnéticos e cursor próprio no desktop.

Com "reduzir movimento" ativado (ou sem as bibliotecas), a página aparece completa e estática.

## Dados coletados

* **Google Maps**: nota 4,9 com 40 avaliações, selo "Empresa que acolhe a comunidade LGBTQ+", coordenadas -20.1444505, -44.8918532.
* **Horário (Google)**: segunda fechado · terça a quinta 8h30 às 19h · sexta 8h30 às 17h30 · sábado 8h às 16h · domingo fechado.
* **Avaliações usadas** (só o primeiro nome): Maria Clara, Isabela e Rafael, trechos literais. No texto do Rafael troquei o apelido "Wetim é um" por "Ótimo profissional" para não precisar de contexto; confirme se ele prefere o original.

## Fotos (`assets/img/`)

| Arquivo | Conteúdo | Origem | Filtro |
|---|---|---|---|
| tattoo-1 | elefante com sol | post | Linhas finas |
| tattoo-2 | mãe orca e filhote | post | Linhas finas |
| tattoo-3 | garças com sol pontilhado | post | Linhas finas |
| tattoo-4 | cálice com raios | post | Linhas finas |
| tattoo-5 | ramo de flores e frutos | post | Linhas finas |
| tattoo-6 | isqueiro | post | Linhas finas |
| tattoo-7 | besouro com decalque | post | Linhas finas |
| tattoo-8 | escrita "high hopes" | destaque Escritas | Escritas |
| tattoo-9 | escrita "saudade é o amor que fica" | destaque Escritas | Escritas |
| tattoo-10 | "1936" | destaque Escritas | Escritas |
| tattoo-11 | gaivota (cicatrizada) | destaque Cicatrizadas | Cicatrizadas |
| tattoo-12 | personagem em moldura (cicatrizada) | destaque Cicatrizadas | Cicatrizadas |
| wellington / wellington-maos | Wellington tatuando (hero e Sobre) | post | |
| estudio-1 | estante e planta do estúdio (recorte de story) | post | |

Como o Chrome bloqueou os downloads em série, as fotos foram capturadas da tela em ~510 a 900 px de largura.
Bom para a web, mas para a versão final vale pedir os originais ao Wellington (principalmente a do hero e a do estúdio).

## Placeholders para confirmar com o Wellington

1. **WhatsApp**: `CONFIG.whatsapp` em `script.js` está `5537900000000`. O Google Maps mostra **(37) 93500-0564**; confirmar se é o WhatsApp.
2. **Fotos do estúdio**: só há uma foto do espaço (recorte escuro de story). Pedir 2 ou 3 fotos boas da sala.
3. **Domínio**: `https://wcosta.tattoo/` no `canonical`, `og` e JSON-LD é provisório.
4. **Link "Site por Lucas Ribeiro"** no rodapé aponta para `https://www.instagram.com/`; trocar pelo seu perfil ou site.
5. **Textos do Sobre e do estúdio** (trajetória, "material descartável", "sinal" no passo 3) são redação minha a partir da bio e das avaliações; validar com ele.
6. **Cuidados pós-tattoo**: orientações gerais; ajustar à pomada e aos prazos que ele indica.
7. **Avaliação do Rafael**: ver nota acima sobre o trecho editado.
