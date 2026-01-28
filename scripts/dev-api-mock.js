// Simple Express mock for /api/blog and /api/users/me
const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/blog', (req, res) => {
  res.json([
    { id: 1, title: 'Como negociar dívidas', date: '2026-01-01', image: '/assets/avatar1.png', slug: 'negociar-dividas' },
    { id: 2, title: 'Direitos do consumidor', date: '2026-01-10', image: '/assets/avatar2.png', slug: 'direitos-consumidor' }
  ]);
});

app.get('/api/users/me', (req, res) => {
  res.json({ id: 1, name: 'Usuário Teste', email: 'teste@exemplo.com' });
});

app.listen(3333, () => console.log('Mock API running on http://localhost:3333'));
