
-- Inserção de dados iniciais para o blog
-- A estrutura da tabela é definida em src/shared/schemas/blog_posts-schema.json

-- Corrigido para inserir em categoria_nome (ou categoria_id se preferir usar IDs)
INSERT INTO blog_posts (titulo, slug, conteudo, resumo, imagem_capa_url, categoria_nome)
VALUES
  (
    'Lei do Superendividamento: Como sair do sufoco financeiro legalmente',
    'lei-do-superendividamento-como-sair-do-sufoco',
    '<p>A Lei 14.181/2021, conhecida como Lei do Superendividamento, trouxe um novo fôlego para milhões de brasileiros que se encontram em uma situação de insolvência. Esta legislação permite que o consumidor renegocie todas as suas dívidas de uma só vez, garantindo a preservação do chamado "mínimo existencial".</p><h2>O que é o Mínimo Existencial?</h2><p>O mínimo existencial é a quantia mínima de renda que uma pessoa precisa para suprir suas necessidades básicas, como alimentação, moradia e saúde. Com a nova lei, os bancos não podem mais descontar parcelas que comprometam essa dignidade.</p><h2>Como funciona o processo?</h2><p>O processo envolve a criação de um plano de pagamento que pode durar até 5 anos. O devedor apresenta sua situação e os credores são convocados para uma audiência de conciliação.</p>',
    'Entenda como a Lei 14.181/2021 pode ajudar você a reorganizar suas finanças e recuperar sua dignidade.',
    'https://heyboss.heeyo.ai/gemini-image-c5df3e56df0a49fdb468a4708ef7c8a8.png',
    'Direito do Consumidor'
  ),
  (
    'Justiça garante preservação do mínimo existencial para famílias endividadas',
    'justica-garante-preservacao-minimo-existencial',
    '<p>Em uma decisão recente e histórica, o Tribunal de Justiça reafirmou a importância da proteção ao consumidor superendividado. O caso envolvia uma família que tinha mais de 70% de sua renda comprometida com empréstimos consignados.</p><h2>A Decisão</h2><p>O magistrado entendeu que a manutenção da dignidade humana prevalece sobre o direito de crédito das instituições financeiras. Foi determinado o recalculo das parcelas para que não ultrapassassem 30% da renda líquida.</p>',
    'Decisões judiciais recentes reforçam a proteção ao patrimônio mínimo das famílias brasileiras.',
    'https://heyboss.heeyo.ai/gemini-image-805a2be1c3c8401c828287f865b36b4c.png',
    'Decisões Judiciais'
  ),
  (
    'Renegociação em bloco: A estratégia definitiva contra juros abusivos',
    'renegociacao-em-bloco-estrategia-contra-juros-abusivos',
    '<p>Muitas vezes, tentar negociar com um banco de cada vez é uma tarefa inglória. A renegociação em bloco surge como a ferramenta mais poderosa do consumidor moderno.</p><h2>Por que negociar em bloco?</h2><p>Ao reunir todos os credores em uma única mesa (ou processo), o consumidor demonstra sua real capacidade de pagamento e força as instituições a competirem por condições melhores, muitas vezes resultando em descontos de até 90% no valor total.</p>',
    'Saiba por que reunir todos os seus credores em uma única negociação é o caminho mais rápido para a quitação.',
    'https://heyboss.heeyo.ai/gemini-image-66fd2e2355974def87a7cb3056023985.png',
    'Educação Financeira'
  );
