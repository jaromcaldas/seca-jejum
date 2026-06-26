const QUIZ_DATA = {
  settings: {
    seoTitle: "Seca Jejum",
    seoDescription: "",
    faviconUrl: "https://cakto-quiz-br01.b-cdn.net/uploads/00b8f142-f957-473d-b1dc-af8e8f9b5327.png",
    checkoutUrl: "https://pay.kiwify.com.br/ajXNVtj",
    backRedirectUrl: "https://seguro-adquiragora.shop/back/",
    utmifyPixelId: "69fcc36fcf116a8432ce8ba5"
  },
  designSettings: {
    general: { width: "small", spacing: "default", roundness: "default" },
    header: { logoUrl: "https://i.ibb.co/qhVP4F5/7256d4ac-8760-45ab-a41e-40dae2445557.webp" },
    colors: { primary: "#00a36a", background: "#FFFFFF", text: "#2d2d33", title: "#000000", interactive: "#FFFFFF" },
    typography: { primaryFont: "Montserrat", secondaryFont: "Montserrat" },
    animation: { type: "fade", duration: 1, delay: 0 }
  },
  steps: [
    // ===== STEP 0 — Abertura (mecanismo + idade) =====
    {
      id: 0,
      title: "Janela Metabólica de acordo com a sua idade",
      showLogo: true,
      showProgress: true,
      components: [
        { type: "spacer" },
        {
          type: "paragraph",
          content: '<h1 class="ql-align-center">Quantas horas de jejum o SEU corpo precisa pra secar?</h1><p class="ql-align-center">Descubra a sua Janela Metabólica de acordo com a sua idade</p>'
        },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "18 a 25 anos", icon: "https://i.ibb.co/jvy7XmSL/1.webp", next: 1 },
            { text: "26 a 35 anos", icon: "https://i.ibb.co/8DXkg6N7/faca618d-5574-44ea-a30c-045460638fdf.webp", next: 1 },
            { text: "36 a 45 anos", icon: "https://i.ibb.co/0Pq8FK4/c2f506ba-599f-449c-b87b-a651a70ad591.webp", next: 1 },
            { text: "+46 anos", icon: "https://i.ibb.co/jPQnZgpZ/8334d8e8-5f6a-42b8-9cbb-5462ff2a49eb.webp", next: 1 }
          ]
        },
        { type: "spacer" },
        {
          type: "alert",
          variant: "warning",
          title: "Atenção:",
          description: "Este plano é gerado uma única vez, exclusivo pro seu perfil. Se você sair agora, ele se perde."
        }
      ]
    },

    // ===== STEP 1 — Objetivo =====
    {
      id: 1,
      title: "Qual é o seu objetivo principal?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Qual é o seu objetivo principal?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Perder peso", icon: "https://i.ibb.co/nFhNQcD/1.webp", next: 2 },
            { text: "Ficar em forma", icon: "https://i.ibb.co/bgDptcmH/2.webp", next: 2 },
            { text: "Melhorar a saúde", icon: "https://i.ibb.co/Q33dp46T/3.webp", next: 2 },
            { text: "Aliviar o estresse", icon: "https://i.ibb.co/jvwzmfLj/4.webp", next: 2 }
          ]
        }
      ]
    },

    // ===== STEP 2 — Tamanho atual =====
    {
      id: 2,
      title: "Escolha o tamanho da sua roupa",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Escolha o tamanho da sua roupa</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "grid-2",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "PP", icon: "https://i.ibb.co/x8ghqW77/1.webp", next: 3 },
            { text: "P", icon: "https://i.ibb.co/Tq2ChLzV/2.webp", next: 3 },
            { text: "M", icon: "https://i.ibb.co/VWLd7ZZN/3.webp", next: 3 },
            { text: "G", icon: "https://i.ibb.co/bMxfmRxh/4.webp", next: 3 },
            { text: "GG", icon: "https://i.ibb.co/84KRKdnx/5.webp", next: 3 },
            { text: "XGG", icon: "https://i.ibb.co/hvdx3qY/6.webp", next: 3 }
          ]
        }
      ]
    },

    // ===== STEP 3 — Tamanho desejado =====
    {
      id: 3,
      title: "Escolha o tamanho que você quer usar",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Escolha o tamanho que você quer usar</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "grid-2",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "PP", icon: "https://i.ibb.co/x8ghqW77/1.webp", next: 4 },
            { text: "P", icon: "https://i.ibb.co/Tq2ChLzV/2.webp", next: 4 },
            { text: "M", icon: "https://i.ibb.co/VWLd7ZZN/3.webp", next: 4 },
            { text: "G", icon: "https://i.ibb.co/bMxfmRxh/4.webp", next: 4 },
            { text: "GG", icon: "https://i.ibb.co/84KRKdnx/5.webp", next: 4 },
            { text: "XGG", icon: "https://i.ibb.co/hvdx3qY/6.webp", next: 4 }
          ]
        }
      ]
    },

    // ===== STEP 4 — Dor da roupa =====
    {
      id: 4,
      title: "Você já deixou de comprar uma roupa por causa do seu peso?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você já deixou de comprar uma roupa (ou de tirar uma foto) por causa do seu peso?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "vertical",
          disposition: "noImage",
          items: [
            { text: "Quase sempre", next: 5 },
            { text: "Às vezes", next: 5 },
            { text: "Raramente", next: 5 },
            { text: "Nunca", next: 5 }
          ]
        },
        { type: "image", url: "https://i.ibb.co/Q3fJjcTL/a.webp", width: "small" }
      ]
    },

    // ===== STEP 5 — Prova social Carol (amarrada ao mecanismo) =====
    {
      id: 5,
      title: "Ela descobriu a janela certa",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Ela descobriu a janela certa e voltou a usar as roupas de antes</h2>' },
        { type: "image", url: "https://i.ibb.co/CKv9jRvN/10a56da9-9f88-48f2-879e-66fdd81927ee.webp", width: "full" },
        { type: "spacer" },
        {
          type: "paragraph",
          content: '<p class="ql-align-center"><strong>Carol</strong> tentou de tudo: dieta, academia, contar caloria. Nada durava. Quando ela passou a fazer o jejum na <strong>janela certa pro corpo dela</strong>, perdeu <strong>12 kg em 4 semanas</strong>, comendo, sem passar fome.</p><p class="ql-align-center"><br></p><p class="ql-align-center"><em>"Eu não acreditava que ia funcionar. Já tinha tentado de tudo. A diferença foi descobrir a minha janela. Voltei a usar roupas que estavam guardadas há anos!"</em></p><p class="ql-align-center"><br></p><p class="ql-align-center">Carol Santana, 34 anos</p>'
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 6 }
      ]
    },

    // ===== STEP 6 — Áreas do corpo =====
    {
      id: 6,
      title: "Quais áreas do corpo você quer focar?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Quais áreas do corpo você quer focar?</h2>' },
        {
          type: "options",
          multiple: true,
          autoProceed: false,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Barriga", icon: "https://i.ibb.co/KgnsXDf/1.webp" },
            { text: "Bunda", icon: "https://i.ibb.co/0SjJLgS/2.webp" },
            { text: "Peito", icon: "https://i.ibb.co/tPK7s2SB/3.webp" },
            { text: "Pernas", icon: "https://i.ibb.co/Lz0j23MM/4.webp" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 7 }
      ]
    },

    // ===== STEP 7 — O que te descreve =====
    {
      id: 7,
      title: "O que mais te descreve?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">O que mais te descreve?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Tenho dificuldade em ganhar músculos", icon: "🙄", next: 8 },
            { text: "Eu ganho e perco peso sem esforço", icon: "💪", next: 8 },
            { text: "Eu ganho peso facilmente, mas tenho dificuldade para perder", icon: "😬", next: 8 }
          ]
        }
      ]
    },

    // ===== STEP 8 — Nostalgia =====
    {
      id: 8,
      title: "Faz quanto tempo que você se sentiu bem com o seu corpo?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Faz quanto tempo que você se sentiu bem com o seu corpo?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "noImage",
          items: [
            { text: "0 a 6 meses atrás", next: 9 },
            { text: "7 a 12 meses atrás", next: 9 },
            { text: "1 a 3 anos atrás", next: 9 },
            { text: "Mais de 3 anos atrás", next: 9 }
          ]
        },
        { type: "image", url: "https://i.ibb.co/PZ6gxFVM/71c71a60-cefe-4ccb-8f0c-6d2dc81b6c59.webp", width: "small" }
      ]
    },

    // ===== STEP 9 — O que sabe sobre jejum =====
    {
      id: 9,
      title: "O que você sabe sobre o jejum intermitente?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">O que você sabe sobre o jejum intermitente?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Não sei nada", icon: "🤔", next: 10 },
            { text: "Já ouvi falar um pouco", icon: "💁‍♀️", next: 10 },
            { text: "Entendo bastante", icon: "😎", next: 10 }
          ]
        }
      ]
    },

    // ===== STEP 10 — REVELAÇÃO DO MECANISMO (NOVO) =====
    {
      id: 10,
      title: "Por que o jejum não funcionou pra você",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Por que o jejum (sozinho) não funcionou pra você</h2>' },
        {
          type: "paragraph",
          content: '<p class="ql-align-center">A maioria das mulheres copia horários de jejum da internet, a <strong>mesma janela pra todo mundo</strong>. Só que cada corpo tem uma <strong>Janela Metabólica</strong> diferente, que muda com a sua idade, o seu peso e a sua rotina.</p><p class="ql-align-center"><br></p><p class="ql-align-center">Na janela errada, você sente fome à toa e a queima de gordura <strong>trava</strong>. Na <strong>janela certa</strong>, o seu corpo entra em modo de queima sozinho, sem passar fome e sem cortar o que você ama.</p><p class="ql-align-center"><br></p><p class="ql-align-center">É exatamente a <strong>sua janela</strong> que vamos calcular aqui.</p>'
        },
        { type: "image", url: "https://i.ibb.co/PZ6gxFVM/71c71a60-cefe-4ccb-8f0c-6d2dc81b6c59.webp", width: "small" },
        { type: "spacer" },
        { type: "button", text: "Quero descobrir a minha janela", next: 11 }
      ]
    },

    // ===== STEP 11 — Última vez desejada =====
    {
      id: 11,
      title: "Quando foi a última vez que você se sentiu desejada?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Quando foi a última vez que você se sentiu desejada?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "noImage",
          items: [
            { text: "Eu me sinto desejada o tempo todo", next: 12 },
            { text: "De vez em quando, eu me sinto desejada", next: 12 },
            { text: "Já faz alguns anos, quando eu era mais magra", next: 12 },
            { text: "Não me lembro da última vez que me senti assim", next: 12 }
          ]
        },
        { type: "image", url: "https://i.ibb.co/LXJ0rBZX/Captura-de-tela-2025-07-23-003458.png", width: "medium" }
      ]
    },

    // ===== STEP 12 — Libido =====
    {
      id: 12,
      title: "Aumente a sua libido",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Aumente a sua libido,<br>melhore a sua autoestima<br>e transforme a sua vida</h2>' },
        {
          type: "paragraph",
          content: '<p class="ql-align-center">Estudos mostram que a perda de peso pode aumentar significativamente a libido e melhorar a vida íntima. Ao eliminar o excesso de gordura, seu corpo regula melhor os hormônios, aumentando o desejo e a disposição.</p><p class="ql-align-center"><br></p><p class="ql-align-center">Mulheres que perderam peso relatam se sentir mais confiantes, desejadas e satisfeitas com sua vida íntima.</p>'
        },
        { type: "image", url: "https://i.ibb.co/Gf9psL6H/1f175fc1-526f-40e0-9c9f-7b29bb6454fb.webp", width: "full" },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 13 }
      ]
    },

    // ===== STEP 13 — Café da manhã (intro de rotina/janela) =====
    {
      id: 13,
      title: "Quando você costuma tomar seu café da manhã?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Pra calcular a sua janela, preciso conhecer a sua rotina. Quando você costuma tomar o café da manhã?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Entre 6 e 8 da manhã", icon: "https://i.ibb.co/cc5Cybt1/1.webp", next: 14 },
            { text: "Entre 8 e 10 da manhã", icon: "https://i.ibb.co/sdhP2Dzy/2.webp", next: 14 },
            { text: "Entre 10h e meio-dia", icon: "https://i.ibb.co/d0KPS6Q2/3.webp", next: 14 },
            { text: "Eu costumo pular o café da manhã", icon: "https://i.ibb.co/W4JDnQYP/4.webp", next: 14 }
          ]
        }
      ]
    },

    // ===== STEP 14 — Almoço =====
    {
      id: 14,
      title: "Quando você costuma almoçar?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Quando você costuma almoçar?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Entre 10h e meio-dia", icon: "https://i.ibb.co/PvqmpgnX/1.webp", next: 15 },
            { text: "Entre meio-dia e 14h", icon: "https://i.ibb.co/JwNpCNp2/2.webp", next: 15 },
            { text: "Entre 14h e 16h", icon: "https://i.ibb.co/dsMwSfwD/3.webp", next: 15 },
            { text: "Eu costumo pular o almoço", icon: "https://i.ibb.co/8DMwWTTF/4.webp", next: 15 }
          ]
        }
      ]
    },

    // ===== STEP 15 — Janta =====
    {
      id: 15,
      title: "Quando você janta?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Quando você janta?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Entre 16h e 18h", icon: "https://i.ibb.co/RkpxbJJ0/1.webp", next: 16 },
            { text: "Entre 18h e 20h", icon: "https://i.ibb.co/21qpdvgK/2.webp", next: 16 },
            { text: "Entre 20h e 22h", icon: "https://i.ibb.co/VhfdZJh/3.webp", next: 16 },
            { text: "Eu costumo pular o jantar", icon: "https://i.ibb.co/8DMwWTTF/4.webp", next: 16 }
          ]
        }
      ]
    },

    // ===== STEP 16 — Restrição alimentar =====
    {
      id: 16,
      title: "Você tem alguma restrição alimentar?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você tem alguma restrição alimentar?</h2>' },
        {
          type: "options",
          multiple: true,
          autoProceed: false,
          layout: "list",
          orientation: "horizontal",
          disposition: "imageFirst",
          items: [
            { text: "Sem lactose", description: "Eu não consumo alimentos com lactose", icon: "🍼" },
            { text: "Sem glúten", description: "Eu evito grãos com glúten", icon: "🍪" },
            { text: "Vegetariano", description: "Eu não como carne", icon: "🥦" },
            { text: "Vegano", description: "Eu não consumo produto de origem animal", icon: "🪴" },
            { text: "Nenhum peixe", description: "Não como nenhum tipo de peixe", icon: "🐟" },
            { text: "Nenhuma das acima", description: "Eu como quase tudo", icon: "❌" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 17 }
      ]
    },

    // ===== STEP 17 — Comidas que gosta (enxugado: 4 blocos) =====
    {
      id: 17,
      title: "Escolha as comidas que você gosta",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Escolha as comidas que você gosta</h2>' },
        { type: "spacer" },
        { type: "paragraph", content: '<p><strong>🥦 Vegetais</strong></p>' },
        {
          type: "options",
          multiple: true, autoProceed: false, required: false, layout: "grid-2", disposition: "noImage",
          items: [
            { text: "Tomate" }, { text: "Cebola" }, { text: "Cenoura" },
            { text: "Alface" }, { text: "Espinafre" }, { text: "Abobrinha" }
          ]
        },
        { type: "spacer" },
        { type: "paragraph", content: '<p><strong>🍞 Grãos e Pães</strong></p>' },
        {
          type: "options",
          multiple: true, autoProceed: false, required: false, layout: "grid-2", disposition: "noImage",
          items: [
            { text: "Arroz" }, { text: "Pão Integral" }, { text: "Cuscuz" },
            { text: "Aveia" }, { text: "Macarrão" }
          ]
        },
        { type: "spacer" },
        { type: "paragraph", content: '<p><strong>🥩 Carnes e ovos</strong></p>' },
        {
          type: "options",
          multiple: true, autoProceed: false, required: false, layout: "grid-2", disposition: "noImage",
          items: [
            { text: "Ovo" }, { text: "Frango" }, { text: "Carne de boi" },
            { text: "Peito de peru" }, { text: "Peixe" }
          ]
        },
        { type: "spacer" },
        { type: "paragraph", content: '<p><strong>🍎 Frutas</strong></p>' },
        {
          type: "options",
          multiple: true, autoProceed: false, required: false, layout: "grid-2", disposition: "noImage",
          items: [
            { text: "Banana" }, { text: "Maçã" }, { text: "Morango" },
            { text: "Laranja" }, { text: "Abacate" }, { text: "Manga" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 18 }
      ]
    },

    // ===== STEP 18 — Cozinhar / comer fora =====
    {
      id: 18,
      title: "Você prefere cozinhar, comer fora ou pedir comida?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você prefere cozinhar, comer fora ou pedir comida?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Cozinhar em casa", icon: "🍛", next: 19 },
            { text: "Eu prefiro ir a um restaurante", icon: "🍴", next: 19 },
            { text: "Gosto de pedir comida", icon: "🛵", next: 19 },
            { text: "Eu faço um pouco de tudo", icon: "🙂", next: 19 }
          ]
        }
      ]
    },

    // ===== STEP 19 — Pausa no fim de semana =====
    {
      id: 19,
      title: "Você precisa de uma pausa no Jejum para o final de semana?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você precisa de uma pausa no Jejum para o final de semana?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Claro que sim! Final de semana é para curtir", icon: "👌", next: 20 },
            { text: "Não paro nem no fim de semana!", icon: "💪", next: 20 }
          ]
        }
      ]
    },

    // ===== STEP 20 — Exercício (índice usado no diagnóstico — ordem das opções preservada) =====
    {
      id: 20,
      title: "Com que frequência você se exercita?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Com que frequência você se exercita?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "noImage",
          items: [
            { text: "1 a 3x na semana", next: 21 },
            { text: "4 a 5x na semana", next: 21 },
            { text: "6 a 7x na semana", next: 21 },
            { text: "Raramente", next: 21 },
            { text: "Não costumo me exercitar", next: 21 }
          ]
        },
        { type: "image", url: "https://i.ibb.co/Q2g89qC/Captura-de-tela-2025-07-23-003649.png", width: "full" }
      ]
    },

    // ===== STEP 21 — Apoio família =====
    {
      id: 21,
      title: "Sua família e amigos apoiam você para manter a forma?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Sua família e amigos apoiam você para manter a forma?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Eu sempre me sinto apoiado pela minha família e amigos", icon: "🥰", next: 22 },
            { text: "Às vezes me sinto apoiado, mas nem sempre", icon: "😔", next: 22 },
            { text: "Não sinto muito apoio deles", icon: "💔", next: 22 }
          ]
        },
        { type: "spacer" },
        {
          type: "alert",
          variant: "error",
          title: "68% das pessoas que tentam perder peso não têm apoio da família e amigos",
          description: "Estamos aqui para te apoiar em cada passo da sua jornada. Nossa equipe estará do seu lado sempre que você precisar, tornando o processo de perder peso mais fácil, simples e confortável."
        }
      ]
    },

    // ===== STEP 22 — Rotina de trabalho =====
    {
      id: 22,
      title: "Como é a sua rotina de trabalho?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Como é a sua rotina de trabalho?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "noImage",
          items: [
            { text: "Horário comercial", next: 23 },
            { text: "Turnos noturnos", next: 23 },
            { text: "Meu horário é flexível", next: 23 },
            { text: "Estou aposentada", next: 23 }
          ]
        },
        { type: "image", url: "https://i.ibb.co/xtbJmxgG/Captura-de-tela-2025-07-23-003858.png", width: "full" }
      ]
    },

    // ===== STEP 23 — Dia a dia (índice usado no diagnóstico — ordem preservada) =====
    {
      id: 23,
      title: "Como você descreve o seu dia a dia?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Como você descreve o seu dia a dia?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Eu passo a maior parte do dia sentado", icon: "💻", next: 24 },
            { text: "Um pouco sentado e um pouco caminhando", icon: "🧘‍♀️", next: 24 },
            { text: "Fico em pé o dia todo", icon: "🏃‍♀️", next: 24 }
          ]
        }
      ]
    },

    // ===== STEP 24 — Dinheiro e carreira =====
    {
      id: 24,
      title: "Dinheiro e peso: um impacto inesperado na sua carreira",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "image", url: "https://i.ibb.co/Z1NDFSgL/980e0f99-2a77-47d0-bab1-e13de8afe2ce.webp", width: "full" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Dinheiro e peso: um impacto inesperado na sua carreira</h2>' },
        {
          type: "paragraph",
          content: '<p class="ql-align-center">Pesquisas mostram que o excesso de peso pode impactar diretamente a sua carreira e a sua renda. Pessoas com sobrepeso tendem a ter menos oportunidades de promoção e ganham, em média, menos do que colegas com peso saudável.</p><p class="ql-align-center"><br></p><p class="ql-align-center">Ao investir na sua saúde e perder peso, você não está apenas melhorando sua aparência, está investindo no seu futuro profissional e financeiro.</p>'
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 25 }
      ]
    },

    // ===== STEP 25 — Sem fôlego escada =====
    {
      id: 25,
      title: "Você fica sem fôlego depois de subir um lance de escadas?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você fica sem fôlego depois de subir um lance de escadas?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Fico tão sem fôlego que não consigo falar", icon: "🥵", next: 26 },
            { text: "Fico um pouco sem fôlego, mas consigo falar", icon: "🌬️", next: 26 },
            { text: "Fico bem depois de um lance de escadas", icon: "🙂", next: 26 },
            { text: "Eu consigo subir alguns lances de escada facilmente", icon: "🚀", next: 26 }
          ]
        }
      ]
    },

    // ===== STEP 26 — Sono (índice usado no diagnóstico — ordem preservada) =====
    {
      id: 26,
      title: "Quantas horas você costuma dormir?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Quantas horas você costuma dormir?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "noImage",
          items: [
            { text: "Durmo pouco (menos de 5 horas)", next: 27 },
            { text: "Eu consigo dormir um pouco (5 a 6 horas)", next: 27 },
            { text: "Eu durmo muito e bem (7 a 8 horas)", next: 27 },
            { text: "Gosto de dormir até mais tarde (mais de 8 horas)", next: 27 }
          ]
        },
        { type: "image", url: "https://i.ibb.co/JjbBMFHW/Captura-de-tela-2025-07-23-004104.png", width: "full" }
      ]
    },

    // ===== STEP 27 — Água (índice usado no diagnóstico — ordem preservada) =====
    {
      id: 27,
      title: "Qual é a sua ingestão diária de água?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Qual é a sua ingestão diária de água?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "noImage",
          items: [
            { text: "Eu só tomo café ou chá", next: 28 },
            { text: "Cerca de 2 copos", next: 28 },
            { text: "2 a 6 copos", next: 28 },
            { text: "Mais de 6 copos", next: 28 }
          ]
        },
        { type: "image", url: "https://i.ibb.co/ZrkfFQL/Captura-de-tela-2025-07-23-004143.png", width: "full" }
      ]
    },

    // ===== STEP 28 — Comorbidades =====
    {
      id: 28,
      title: "Você tem algum desses problemas?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você tem algum desses problemas?</h2>' },
        {
          type: "options",
          multiple: true,
          autoProceed: false,
          layout: "grid-2",
          orientation: "horizontal",
          disposition: "imageFirst",
          items: [
            { text: "Dores nas articulações", icon: "🤕" },
            { text: "Hérnia de disco", icon: "🦴" },
            { text: "Hipertensão", icon: "🫀" },
            { text: "Diabetes", icon: "🩸" },
            { text: "Osteoporose", icon: "🦵" },
            { text: "Nenhuma das acima", icon: "❌" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 29 }
      ]
    },

    // ===== STEP 29 — Hábitos =====
    {
      id: 29,
      title: "Você tem algum desses hábitos que podem estar atrapalhando sua vida?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você tem algum desses hábitos que podem estar atrapalhando sua vida?</h2>' },
        {
          type: "options",
          multiple: true,
          autoProceed: false,
          layout: "list",
          orientation: "horizontal",
          disposition: "imageFirst",
          items: [
            { text: "Eu como tarde da noite", icon: "💤" },
            { text: "Não consigo parar de comer doces", icon: "🍫" },
            { text: "Eu amo refrigerantes", icon: "🥤" },
            { text: "Eu adoro alimentos gordurosos ou salgados", icon: "🧂" },
            { text: "Nenhuma das acima", icon: "❌" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 30 }
      ]
    },

    // ===== STEP 30 — Eventos de ganho de peso =====
    {
      id: 30,
      title: "Algum desses acontecimentos fez você ganhar peso nos últimos anos?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Algum desses acontecimentos fez você ganhar peso nos últimos anos?</h2>' },
        {
          type: "options",
          multiple: true,
          autoProceed: false,
          layout: "list",
          orientation: "horizontal",
          disposition: "imageFirst",
          items: [
            { text: "Casamento ou relacionamento", icon: "👰‍♀️" },
            { text: "Rotina corrida com trabalho ou família", icon: "😓" },
            { text: "Dificuldades financeiras", icon: "💰" },
            { text: "Lesão ou incapacidade", icon: "🏥" },
            { text: "Estresse ou problemas de saúde mental", icon: "😖" },
            { text: "Metabolismo mais lento devido a idade", icon: "👵" },
            { text: "Complicações pós-tratamentos", icon: "🩺" },
            { text: "Nenhuma das acima", icon: "❌" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 31 }
      ]
    },

    // ===== STEP 31 — Motivação =====
    {
      id: 31,
      title: "Quão motivado você está para perder peso?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Quão motivado você está para perder peso?</h2>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Estou tentando fazer o jejum apenas por curiosidade", icon: "🤔", next: 32 },
            { text: "Estou determinado a diminuir um ou dois tamanhos", icon: "🤟", next: 32 },
            { text: "Eu não vou parar até atingir meu peso ideal", icon: "🔥", next: 32 }
          ]
        }
      ]
    },

    // ===== STEP 32 — Altura =====
    {
      id: 32,
      title: "Qual é a sua altura exata?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Qual é a sua altura exata?</h2>' },
        { type: "input", inputType: "number", placeholder: "cm", label: "Altura" },
        { type: "spacer" },
        {
          type: "alert",
          variant: "info",
          title: "Calculando o seu índice de massa corporal",
          description: "O IMC é amplamente utilizado como um indicador de risco à saúde relacionado ao peso. Ele ajuda a identificar se uma pessoa está abaixo do peso, no peso normal, com sobrepeso ou obesa."
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 33 }
      ]
    },

    // ===== STEP 33 — Peso atual =====
    {
      id: 33,
      title: "Qual é o seu peso atual exato?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Qual é o seu peso atual exato?</h2>' },
        { type: "input", inputType: "number", placeholder: "kg", label: "Peso atual" },
        { type: "spacer" },
        {
          type: "alert",
          variant: "info",
          title: "Calculando o seu IMC e a sua Janela Metabólica...",
          description: "Com o seu peso e a sua altura, conseguimos definir a janela exata que faz o seu corpo entrar em modo de queima de gordura."
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 34 }
      ]
    },

    // ===== STEP 34 — Peso desejado =====
    {
      id: 34,
      title: "Qual é o seu peso desejado?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Qual é o seu peso desejado?</h2>' },
        { type: "input", inputType: "number", placeholder: "kg", label: "Peso desejado" },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 35 }
      ]
    },

    // ===== STEP 35 — Idade exata =====
    {
      id: 35,
      title: "Qual é a sua idade?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Qual é a sua idade?</h2>' },
        { type: "input", inputType: "number", placeholder: "anos", label: "Idade" },
        { type: "spacer" },
        {
          type: "alert",
          variant: "info",
          title: "Vamos usar essas informações para criar seu plano personalizado!",
          description: "Pessoas mais velhas tendem a ter mais gordura corporal do que pessoas mais jovens com o mesmo IMC. Da mesma forma, as mulheres tendem a ter mais gordura corporal do que os homens com o mesmo IMC."
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 36 }
      ]
    },

    // ===== STEP 36 — Resumo + diagnóstico (IMC real via dynamicLevel) =====
    {
      id: 36,
      title: "Resumo do seu perfil metabólico",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Resumo do seu perfil metabólico</h2>' },
        { type: "spacer" },
        {
          type: "dynamicLevel",
          variant: "green-to-red",
          indicator: "Você está aqui",
          title: "Índice de massa corporal (IMC)",
          legends: ["Abaixo", "Normal", "Acima"]
        },
        { type: "spacer" },
        { type: "dynamicBullets" },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 37 },
        {
          type: "alert",
          variant: "warning",
          title: "A sua Janela Metabólica já está sendo calculada",
          description: "Com o seu plano personalizado, você terá tudo pra destravar a queima de gordura nas próximas 4 semanas, respeitando a sua rotina e o que você gosta de comer."
        }
      ]
    },

    // ===== STEP 37 — Evento importante =====
    {
      id: 37,
      title: "Você tem algum evento importante chegando?",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Você tem algum evento importante chegando?</h2>' },
        { type: "paragraph", content: '<p class="ql-align-center">Ter algo para esperar pode ser uma grande motivação para alcançar o seu objetivo!</p>' },
        {
          type: "options",
          multiple: false,
          autoProceed: true,
          layout: "list",
          orientation: "horizontal",
          disposition: "textFirst",
          items: [
            { text: "Férias", icon: "✈️", next: 38 },
            { text: "Casamento", icon: "👰‍♀️", next: 38 },
            { text: "Feriado", icon: "🏖️", next: 38 },
            { text: "Evento esportivo", icon: "🏆", next: 38 },
            { text: "Encontro de amigos", icon: "🎂", next: 38 },
            { text: "Aniversário", icon: "🎉", next: 38 },
            { text: "Outro", icon: "💁‍♀️", next: 38 },
            { text: "Não tenho nenhum evento especial chegando", icon: "🙅‍♀️", next: 38 }
          ]
        }
      ]
    },

    // ===== STEP 38 — Projeção na Janela Metabólica =====
    {
      id: 38,
      title: "A sua projeção na Janela Metabólica",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">A sua projeção na Janela Metabólica</h2>' },
        { type: "paragraph", content: '<p class="ql-align-center">Com base nas suas respostas, esta é a projeção do seu corpo nas próximas 4 semanas fazendo o jejum na janela certa pra você.</p>' },
        {
          type: "linechart",
          title: "KG em 4 semanas",
          dynamicTitle: "weightLoss4Weeks",
          gradient: "horizontal",
          items: [
            { label: "Hoje",      value: 90, topLabel: "Você" },
            { label: "",          value: 82 },
            { label: "",          value: 86 },
            { label: "1ª semana", value: 76, topLabel: "Perdendo peso", topHighlight: true },
            { label: "",          value: 67 },
            { label: "",          value: 71 },
            { label: "2ª semana", value: 58, calloutLabel: "Evolução",  calloutDir: "right" },
            { label: "",          value: 47 },
            { label: "",          value: 51 },
            { label: "4ª semana", value: 28, calloutLabel: "Objetivo",  calloutDir: "right" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 39 }
      ]
    },

    // ===== STEP 39 — Loader + prova =====
    {
      id: 39,
      title: "Criando o seu Plano Personalizado de Jejum",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">Criando o seu Plano Personalizado de Jejum</h2>' },
        {
          type: "loader",
          target: 100,
          duration: 7,
          label: "Calculando a sua Janela Metabólica...",
          description: "Estamos preparando o seu plano exclusivo e personalizado..",
          showProgress: true,
          autoProceed: true,
          next: 40
        },
        { type: "spacer" },
        { type: "paragraph", content: '<h1 class="ql-align-center">+45 mil pessoas</h1><p class="ql-align-center">já transformaram seus corpos com o nosso plano de jejum intermitente personalizado</p>' },
        { type: "carousel", images: ["https://i.ibb.co/nqCFp8JS/Captura-de-tela-2025-04-24-164202.png"] }
      ]
    },

    // ===== STEP 40 — Plano pronto =====
    {
      id: 40,
      title: "O seu Plano Personalizado de Jejum está pronto!",
      showProgress: true,
      components: [
        { type: "spacer" },
        { type: "paragraph", content: '<h2 class="ql-align-center">O seu Plano Personalizado de Jejum está pronto!</h2>' },
        {
          type: "linechart",
          title: "KG em 4 semanas",
          dynamicTitle: "weightLoss4Weeks",
          items: [
            { label: "Seu peso", value: 90, topLabel: "Você" },
            { label: "",         value: 52 },
            { label: "Objetivo", value: 15, calloutLabel: "4 semanas depois" }
          ]
        },
        { type: "spacer" },
        { type: "button", text: "Continuar", next: 41 }
      ]
    },

    // ===== STEP 41 — PÁGINA DE OFERTA (reescrita, forte) =====
    {
      id: 41,
      title: "Página de Vendas Final",
      showProgress: false,
      components: [
        { type: "spacer" },

        // --- HERO ---
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">A sua <span style="color: #00a36a;">Janela Metabólica</span> está pronta. Agora é decisão sua.</h2>'
        },
        {
          type: "paragraph",
          content: '<h3 class="ql-align-center">Calculamos a janela exata pro seu corpo queimar gordura, sem passar fome e sem cortar o que você ama. Seu plano personalizado está liberado abaixo.</h3>'
        },
        { type: "image", url: "https://i.ibb.co/39bbySCT/Captura-de-tela-2025-07-23-005307.png", width: "full" },
        { type: "spacer" },

        // --- ESCASSEZ ---
        {
          type: "alert",
          variant: "error",
          title: "Atenção: seu plano não fica guardado pra sempre",
          description: "Este diagnóstico foi gerado uma única vez pro seu perfil. Se você sair desta página, ele se perde, e você terá que começar tudo de novo."
        },
        { type: "spacer" },

        // --- STACK DE VALOR ---
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">Tudo isso vem no seu plano hoje:</h2>'
        },
        {
          type: "paragraph",
          content: '<p>✅ <strong>Plano Seca Jejum personalizado</strong> com a SUA Janela Metabólica calculada (no app)</p><p>✅ <strong>Cardápio de 7 dias</strong> montado com as comidas que VOCÊ escolheu</p><p>✅ <strong>Guia "Matando a Fome":</strong> o que comer e beber pra nunca sentir fome no jejum</p><p>✅ <strong>Protocolo Detox 3 Dias</strong> pra desinchar e acelerar a primeira semana</p><p>✅ <strong>Doces Fit Sem Culpa:</strong> mate a vontade de doce sem sair da janela</p><p>✅ <strong>Lista de Compras Inteligente</strong> pra facilitar o seu dia a dia</p><p>✅ <strong>Acesso imediato</strong> + todas as atualizações futuras</p>'
        },
        { type: "spacer" },

        // --- ANCORAGEM DE PREÇO ---
        {
          type: "paragraph",
          content: '<h3 class="ql-align-center">Montar tudo isso com nutricionista passaria de <span style="text-decoration: line-through;">R$300</span>.</h3><p class="ql-align-center">O valor de tudo junto seria <span style="text-decoration: line-through;">R$97</span>. Mas porque você chegou até aqui e fez o seu diagnóstico, hoje sai por:</p><h1 class="ql-align-center" style="color: #00a36a;">R$19,90</h1><p class="ql-align-center">pagamento único · acesso imediato</p>'
        },
        { type: "image", url: "https://i.ibb.co/6JW71xZJ/pagamento.png", width: "full" },
        { type: "button", text: "QUERO MEU PLANO AGORA", action: "checkout" },
        { type: "image", url: "https://i.ibb.co/99GTLkt9/46609c7e-a86f-4d6c-a0ac-976ec1a532b9.webp", width: "big" },
        { type: "spacer" },

        // --- COMO FUNCIONA O MECANISMO ---
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">Como funciona a Janela Metabólica?</h2>'
        },
        {
          type: "paragraph",
          content: '<p class="ql-align-center">A partir das suas respostas (idade, peso, rotina e o que você gosta de comer), nós calculamos o intervalo exato de horas em que o seu corpo queima gordura com mais facilidade.</p><p class="ql-align-center"><br></p><p class="ql-align-center">Você não corta o que ama, não conta caloria e não passa fome. Só passa a comer na <strong>janela certa pro seu corpo</strong>. É por isso que funciona quando todas as dietas falharam.</p>'
        },
        { type: "button", text: "QUERO MEU PLANO AGORA", action: "checkout" },
        { type: "image", url: "https://i.ibb.co/99GTLkt9/46609c7e-a86f-4d6c-a0ac-976ec1a532b9.webp", width: "big" },
        { type: "spacer" },

        // --- PROVA SOCIAL ---
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">Veja as histórias de sucesso das nossas alunas</h2>'
        },
        {
          type: "carousel",
          autoplay: 5000,
          images: [
            "https://i.ibb.co/84PQ5zWP/1.webp",
            "https://i.ibb.co/0pvww1dY/2.webp",
            "https://i.ibb.co/1wBf7qV/3.webp",
            "https://i.ibb.co/4wmYq1t9/4.webp"
          ]
        },
        { type: "spacer" },
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center"><span style="color: #00a36a;">Quem descobre a janela TEM RESULTADO 😉👇</span></h2>'
        },
        {
          type: "carousel",
          autoplay: 5000,
          images: [
            "https://i.ibb.co/C5SHwD7g/5.jpg",
            "https://i.ibb.co/Q394djsh/1.jpg",
            "https://i.ibb.co/rfmqcWMj/2.jpg",
            "https://i.ibb.co/HLnRHRH5/3.jpg",
            "https://i.ibb.co/bSPSgFT/4.jpg"
          ]
        },
        { type: "spacer" },

        // --- CTA INTERMEDIÁRIO COM URGÊNCIA ---
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">Você tem duas escolhas agora</h2><p class="ql-align-center">Continuar tentando do jeito que <strong>nunca</strong> funcionou... ou descobrir a janela certa pro seu corpo e começar a secar ainda esta semana.</p>'
        },
        { type: "image", url: "https://i.ibb.co/6JW71xZJ/pagamento.png", width: "full" },
        { type: "button", text: "QUERO MEU PLANO AGORA", action: "checkout" },
        { type: "image", url: "https://i.ibb.co/99GTLkt9/46609c7e-a86f-4d6c-a0ac-976ec1a532b9.webp", width: "big" },
        { type: "spacer" },

        // --- GARANTIA ---
        { type: "image", url: "https://i.ibb.co/cSSF4x68/a.png", width: "small" },
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">Risco zero: 30 dias de garantia</h2><p class="ql-align-center">Faça o seu plano na sua janela por 30 dias. Se não ver resultado, é só pedir e devolvemos <strong>100% do seu dinheiro</strong>. Sem perguntas e sem burocracia. O risco é todo nosso. A única coisa que você pode perder é o peso.</p>'
        },
        { type: "spacer" },

        // --- FAQ ---
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">Ainda está com alguma dúvida? 👇</h2>'
        },
        { type: "spacer" },
        {
          type: "faq",
          items: [
            {
              question: "Vou passar fome?",
              answer: "Não. O segredo da Janela Metabólica é justamente comer na hora certa pro seu corpo. E com o Guia Matando a Fome você aprende exatamente o que consumir pra atravessar o jejum tranquila, sem aquela vontade descontrolada."
            },
            {
              question: "Isso realmente funciona ou é só mais uma promessa falsa?",
              answer: "O nosso método é baseado em estudos sobre jejum intermitente e já ajudou mais de 45 mil pessoas a transformarem seus corpos. A diferença é a personalização da janela: em vez de copiar horário da internet, você segue a janela calculada pro seu corpo."
            },
            {
              question: "Em quanto tempo eu começo a ver resultado?",
              answer: "A maioria das nossas alunas começa a notar diferença já nas primeiras 2 semanas. O protocolo completo é de 4 semanas, com resultados progressivos e consistentes."
            },
            {
              question: "Mesmo comigo que já tentei de tudo?",
              answer: "Sim, especialmente você. Se as dietas falharam, é bem provável que você estivesse fazendo o jejum na janela errada pro seu corpo. Ao acertar a janela, tudo muda."
            },
            {
              question: "Preciso ir pra academia?",
              answer: "Não. O plano funciona com a sua rotina atual. Exercício acelera os resultados, mas não é obrigatório pra você emagrecer com a sua Janela Metabólica."
            },
            {
              question: "Isso faz mal pra saúde? Tem efeito colateral?",
              answer: "Não. O jejum intermitente é seguro e recomendado por profissionais de saúde no mundo todo. O plano é 100% natural, sem remédio e sem substância, apenas o ajuste dos horários das suas refeições."
            },
            {
              question: "Tem base científica?",
              answer: "Sim. O jejum intermitente é estudado por instituições renomadas como Harvard, e seus benefícios para perda de peso, saúde cardiovascular e longevidade são amplamente documentados."
            },
            {
              question: "Como funciona a entrega?",
              answer: "É 100% digital. Assim que finalizar a compra, você recebe acesso imediato. Dá pra acessar do celular, tablet ou computador, a qualquer hora e de qualquer lugar."
            },
            {
              question: "E se eu não gostar?",
              answer: "Você tem 30 dias de garantia total. Se não estiver satisfeita por qualquer motivo, devolvemos 100% do valor. Sem perguntas e sem burocracia."
            }
          ]
        },
        { type: "spacer" },

        // --- CTA FINAL ---
        {
          type: "paragraph",
          content: '<h2 class="ql-align-center">A sua janela está calculada. Falta só você dar o primeiro passo.</h2>'
        },
        { type: "button", text: "QUERO MEU PLANO AGORA", action: "checkout" },
        { type: "image", url: "https://i.ibb.co/99GTLkt9/46609c7e-a86f-4d6c-a0ac-976ec1a532b9.webp", width: "big" },
        { type: "terms", content: "" }
      ]
    }
  ]
};
