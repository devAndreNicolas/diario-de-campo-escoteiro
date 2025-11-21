# 🧪 Dados de Exemplo para Teste

Este arquivo contém exemplos de entradas que você pode usar para testar a aplicação.

---

## Como Usar

Abra o console do navegador (F12) e execute:

```javascript
// Importar o serviço
import { createEntry } from './src/services/diaryService';

// Criar entrada de exemplo
await createEntry({
  date: '2024-01-15',
  mood: 'muito_feliz',
  weather: 'ensolarado',
  text: 'Hoje foi dia de acampamento! Montamos as barracas e fizemos uma fogueira incrível.',
  tags: ['acampamento', 'fogueira', 'patrulha'],
  location: 'Parque Nacional da Serra',
  attachments: []
});
```

---

## 📝 Exemplos de Entradas

### Acampamento de Fim de Semana

```json
{
  "date": "2024-01-15",
  "mood": "muito_feliz",
  "weather": "ensolarado",
  "text": "Acampamento de fim de semana foi incrível! Montamos as barracas em tempo recorde, fizemos uma fogueira gigante e cantamos várias canções escoteiras. A patrulha Leão ganhou a competição de pioneiria!",
  "tags": ["acampamento", "fogueira", "pioneiria", "patrulha-leao"],
  "location": "Parque Nacional da Serra",
  "attachments": []
}
```

### Caminhada na Trilha

```json
{
  "date": "2024-01-20",
  "mood": "cansado",
  "weather": "nublado",
  "text": "Caminhada de 15km hoje. Foi desafiador, mas conseguimos! Aprendemos muito sobre orientação e leitura de mapas. No final, fizemos um piquenique delicioso.",
  "tags": ["caminhada", "orientacao", "mapas", "desafio"],
  "location": "Trilha do Morro Alto",
  "attachments": []
}
```

### Reunião de Tropa

```json
{
  "date": "2024-01-22",
  "mood": "feliz",
  "weather": "chuvoso",
  "text": "Reunião de tropa na sede. Mesmo com chuva, fizemos várias atividades dentro do salão. Praticamos nós e amarras, e planejamos o próximo acampamento.",
  "tags": ["reuniao", "nos", "amarras", "planejamento"],
  "location": "Sede do Grupo Escoteiro",
  "attachments": []
}
```

### Atividade de Primeiros Socorros

```json
{
  "date": "2024-01-25",
  "mood": "inspirado",
  "weather": "ensolarado",
  "text": "Aula de primeiros socorros com o enfermeiro voluntário. Aprendemos RCP, como fazer curativos e imobilizações. Muito importante para estar sempre preparado!",
  "tags": ["primeiros-socorros", "rcp", "curativos", "seguranca"],
  "location": "Sede do Grupo Escoteiro",
  "attachments": []
}
```

### Jogo Noturno

```json
{
  "date": "2024-01-27",
  "mood": "animado",
  "weather": "nebuloso",
  "text": "Jogo noturno na floresta! Foi emocionante e um pouco assustador. Tivemos que usar lanternas e trabalhar em equipe para encontrar as pistas. Nossa patrulha ficou em segundo lugar!",
  "tags": ["jogo-noturno", "trabalho-em-equipe", "aventura"],
  "location": "Mata do Parque Municipal",
  "attachments": []
}
```

### Serviço Comunitário

```json
{
  "date": "2024-02-01",
  "mood": "feliz",
  "weather": "ensolarado",
  "text": "Mutirão de limpeza na praça do bairro. Coletamos muito lixo e plantamos algumas árvores. A comunidade agradeceu muito. Servir é nossa missão!",
  "tags": ["servico-comunitario", "meio-ambiente", "limpeza", "plantio"],
  "location": "Praça Central",
  "attachments": []
}
```

### Dia de Chuva

```json
{
  "date": "2024-02-05",
  "mood": "neutro",
  "weather": "tempestade",
  "text": "Tempestade forte durante o acampamento. Tivemos que reforçar as barracas e criar valas de drenagem. Foi um bom teste de nossas habilidades de acampamento!",
  "tags": ["acampamento", "chuva", "desafio", "habilidades"],
  "location": "Camping Beira Rio",
  "attachments": []
}
```

### Conquista de Especialidade

```json
{
  "date": "2024-02-10",
  "mood": "muito_feliz",
  "weather": "ensolarado",
  "text": "Finalmente conquistei a especialidade de Cozinheiro! Preparei um jantar completo para toda a patrulha. Todos gostaram muito do meu arroz carreteiro!",
  "tags": ["especialidade", "cozinheiro", "conquista", "patrulha"],
  "location": "Sede do Grupo Escoteiro",
  "attachments": []
}
```

### Visita ao Museu

```json
{
  "date": "2024-02-15",
  "mood": "inspirado",
  "weather": "nublado",
  "text": "Visita ao Museu de História Natural. Aprendemos sobre a fauna e flora da região. Muito interessante para nossa especialidade de Naturalista!",
  "tags": ["visita", "museu", "aprendizado", "naturalista"],
  "location": "Museu de História Natural",
  "attachments": []
}
```

### Dia Triste

```json
{
  "date": "2024-02-18",
  "mood": "triste",
  "weather": "chuvoso",
  "text": "Hoje foi o último dia do nosso chefe de tropa. Ele está se mudando para outra cidade. Foi muito emocionante, mas sabemos que ele sempre será parte da nossa família escoteira.",
  "tags": ["despedida", "chefe", "emocao"],
  "location": "Sede do Grupo Escoteiro",
  "attachments": []
}
```

---

## 🎯 Tags Sugeridas

Use essas tags para organizar melhor suas entradas:

### Atividades
- `acampamento`
- `caminhada`
- `reuniao`
- `jogo-noturno`
- `servico-comunitario`

### Habilidades
- `pioneiria`
- `nos`
- `amarras`
- `orientacao`
- `primeiros-socorros`
- `cozinha`

### Locais
- `sede`
- `parque`
- `trilha`
- `camping`
- `floresta`

### Conquistas
- `especialidade`
- `etapa`
- `insignia`
- `conquista`

### Outros
- `patrulha`
- `trabalho-em-equipe`
- `desafio`
- `aprendizado`
- `diversao`

---

## 💡 Dicas de Escrita

1. **Seja específico**: Em vez de "foi legal", descreva o que foi legal
2. **Inclua detalhes**: Quem estava? O que fizeram? Como se sentiu?
3. **Use tags consistentes**: Facilita encontrar entradas relacionadas
4. **Registre aprendizados**: O que você aprendeu hoje?
5. **Capture emoções**: Como você se sentiu durante a atividade?

---

## 🔄 Script para Popular Banco

Copie e cole no console do navegador:

```javascript
const exampleEntries = [
  {
    date: '2024-01-15',
    mood: 'muito_feliz',
    weather: 'ensolarado',
    text: 'Acampamento incrível! Montamos barracas e fizemos fogueira.',
    tags: ['acampamento', 'fogueira'],
    location: 'Parque Nacional',
    attachments: []
  },
  {
    date: '2024-01-20',
    mood: 'cansado',
    weather: 'nublado',
    text: 'Caminhada de 15km. Desafiador mas conseguimos!',
    tags: ['caminhada', 'desafio'],
    location: 'Trilha do Morro',
    attachments: []
  },
  // Adicione mais entradas aqui...
];

// Importar e criar entradas
import { createEntry } from './src/services/diaryService';
for (const entry of exampleEntries) {
  await createEntry(entry);
  console.log('✅ Entrada criada:', entry.date);
}
```

---

**Bons testes!** 🎉
