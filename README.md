# Gestão PROMAJ Digital - MVP

Sistema web responsivo, mobile-first, para lançamento e consolidação mensal da frequência dos jovens bolsistas do Novo PROMAJ em Teresópolis/RJ.

## Protótipo navegável

O protótipo estático da validação funcional está em `/prototipo`:

- `prototipo/index.html` - entrada e seleção de perfil
- `prototipo/tela2_frequencia.html` - lançamento mensal por jovem
- `prototipo/tela3_painel.html` - consolidação da coordenação

## Executar localmente

Por segurança de navegação e disponibilidade dos caminhos relativos, use um servidor HTTP local:

```bash
python -m http.server 8080
```

Depois, acesse `http://localhost:8080/prototipo/index.html`.