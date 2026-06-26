# Tracking — Seca Jejum

Camada de rastreamento do funil para Meta Ads + análise de respostas no Supabase.

## Visão geral

| Camada | O quê | Onde |
|---|---|---|
| **Meta Pixel** | PageView, ViewContent, QuizStart, QuizStep (resposta), Lead, InitiateCheckout | `js/tracking.js` |
| **Purchase** | Compra | **Kiwify** (integração nativa Pixel + CAPI) |
| **Utmify** | Captura de UTMs + atribuição da venda | já instalado no `index.html` |
| **Supabase** | Cada etapa e resposta do lead | tabela `seca_jejum_quiz_events` (projeto Horus OS) |

O quiz é single-page, então cada etapa dispara eventos manualmente via `window.SJTrack` (chamado pelo `quiz.js`).

## ⚠️ O que VOCÊ precisa fazer

### 1. Colocar o Meta Pixel ID
No arquivo `js/tracking.js`, troque o placeholder:
```js
META_PIXEL_ID: '__META_PIXEL_ID__',   // <<< coloque aqui o ID do seu Pixel
```
O ID está em **Gerenciador de Eventos → Fontes de dados → seu Pixel** (número de ~15-16 dígitos).
Enquanto não preencher, o Meta fica desativado, mas o Supabase já grava tudo.

### 2. Configurar a Kiwify (Purchase)
No painel da Kiwify → **Apps / Integrações → Facebook (Meta)**:
- Cole o **mesmo Pixel ID**
- Gere e cole o **token da Conversions API (CAPI)** (em Gerenciador de Eventos → Configurações → CAPI)
- Ative o evento **Purchase**

Assim a compra é enviada server-side pela Kiwify, com a melhor qualidade de dado.

### 3. (Opcional) Capturar e-mail/telefone no quiz
Hoje o quiz não pede contato, então o *Advanced Matching* usa só `fbp/fbc`.
Adicionar uma etapa de e-mail/telefone melhora MUITO o match com o Meta. Posso montar quando quiser.

## Eventos disparados

| Evento Meta | Quando |
|---|---|
| `PageView` | carregamento da página |
| `ViewContent` + `QuizStart` | início do quiz |
| `QuizStep` (custom) | a cada resposta — params: `step_index`, `step_title`, `question`, `answer` |
| `Lead` | ao chegar na página de oferta |
| `InitiateCheckout` | clique em "QUERO MEU PLANO AGORA" |
| `Purchase` | na Kiwify (não aqui) |

Todos os eventos enviam `eventID` (deduplicação pronta pra CAPI futura) e repassam `fbp/fbc/fbclid` + UTMs para a URL da Kiwify.

## Como acompanhar as respostas (Supabase → Horus OS)

No **SQL Editor** do projeto Horus OS:

```sql
-- Funil de abandono por etapa
select * from seca_jejum_funnel;

-- Ranking de respostas por pergunta
select * from seca_jejum_respostas;

-- Conversão por evento-chave
select * from seca_jejum_resumo;

-- Jornada de um lead específico
select * from seca_jejum_quiz_events
where session_id = 'XXXX' order by created_at;
```

A tabela tem RLS: o site só **insere** (chave pública), a leitura é só pelo dashboard.
