const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://grvweudgzmwypfmoaepe.supabase.co',
  'sb_secret_cIVpuXaSEhte3en8JlvEjQ_HNEHHhjF'
);

const modules = [
  { id: 'm1', number: 1, title: 'Saída do Zero', short_desc: 'Destrave e entenda o jogo.', full_desc: 'Destrave e compreenda o campo de jogo do digital com IA.', result: 'Clareza e posicionamento para começar.', duration: '1h30', task_count: 1, progress: 100, status: 'completed', published: true },
  { id: 'm2', number: 2, title: 'Escolha Certa', short_desc: 'Encontre sua ideia viável.', full_desc: 'Encontre e valide a ideia certa para o seu perfil e contexto.', result: 'Uma ideia viável escolhida e validada.', duration: '1h10', task_count: 1, progress: 75, status: 'in-progress', published: true },
  { id: 'm3', number: 3, title: 'Estrutura do Projeto', short_desc: 'Projete antes de construir.', full_desc: 'Projete com clareza antes de construir qualquer coisa.', result: 'Blueprint completo do seu projeto.', duration: '1h45', task_count: 1, progress: 0, status: 'locked', published: true },
  { id: 'm4', number: 4, title: 'Construção com IA', short_desc: 'Construa com inteligência artificial.', full_desc: 'Use IA para construir a primeira versão real do seu projeto.', result: 'Primeira versão funcional criada.', duration: '2h20', task_count: 1, progress: 0, status: 'locked', published: true },
  { id: 'm5', number: 5, title: 'Validação e Venda', short_desc: 'Lance, valide e monetize.', full_desc: 'Lance, valide e comece a monetizar.', result: 'Projeto apresentado e estratégia de monetização ativa.', duration: '1h30', task_count: 1, progress: 0, status: 'locked', published: true },
];

const lessons = [
  { id: 'l1-1', module_id: 'm1', number: 1, title: 'O cenário digital com IA', duration: '18min', status: 'completed', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l1-2', module_id: 'm1', number: 2, title: 'O que muda com inteligência artificial', duration: '15min', status: 'completed', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l1-3', module_id: 'm1', number: 3, title: 'O método ZPPIA explicado', duration: '20min', status: 'completed', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l1-4', module_id: 'm1', number: 4, title: 'Mentalidade de construtor', duration: '17min', status: 'completed', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l1-5', module_id: 'm1', number: 5, title: 'Preparando seu ambiente', duration: '20min', status: 'completed', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l2-1', module_id: 'm2', number: 1, title: 'O que é uma ideia viável?', duration: '18min', status: 'completed', published: true, video_url: '', objectives: ['Entender o que torna uma ideia viável', 'Diferenciar ideia de projeto', 'Avaliar suas habilidades'], summary: 'Nesta aula, você entende o que separa uma boa ideia de uma ideia viável e como escolher com inteligência.', task: 'Liste 3 ideias de projetos que resolvam problemas reais que você já observou.' },
  { id: 'l2-2', module_id: 'm2', number: 2, title: 'Como pesquisar o problema certo', duration: '22min', status: 'completed', published: true, video_url: '', objectives: ['Técnicas de pesquisa de problemas', 'Como validar a dor do mercado', 'Ferramentas de pesquisa'], summary: 'Aprenda a pesquisar e identificar problemas reais que valem a pena resolver.', task: '' },
  { id: 'l2-3', module_id: 'm2', number: 3, title: 'Validação rápida sem produto pronto', duration: '19min', status: 'current', published: true, video_url: '', objectives: ['Como validar uma ideia sem gastar dinheiro', 'Técnicas de entrevista com potenciais clientes', 'Como interpretar o feedback que você receber', 'Critérios para decidir se segue com a ideia'], summary: 'Nesta aula, você aprende que validar não precisa custar nada.', task: 'Hoje, converse com 3 pessoas sobre o problema que você quer resolver.' },
  { id: 'l2-4', module_id: 'm2', number: 4, title: 'Estruturando sua ideia final', duration: '15min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l3-1', module_id: 'm3', number: 1, title: 'Definindo o escopo mínimo', duration: '18min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l3-2', module_id: 'm3', number: 2, title: 'Mapa de funcionalidades', duration: '20min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l3-3', module_id: 'm3', number: 3, title: 'Blueprint do projeto', duration: '22min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l3-4', module_id: 'm3', number: 4, title: 'Estrutura visual básica', duration: '15min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l3-5', module_id: 'm3', number: 5, title: 'Preparando os prompts', duration: '17min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l3-6', module_id: 'm3', number: 6, title: 'Revisão e ajustes finais', duration: '13min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l4-1', module_id: 'm4', number: 1, title: 'Escolhendo as ferramentas certas', duration: '18min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l4-2', module_id: 'm4', number: 2, title: 'Prompts que funcionam', duration: '22min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l4-3', module_id: 'm4', number: 3, title: 'Construindo a base', duration: '25min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l4-4', module_id: 'm4', number: 4, title: 'Iterando com IA', duration: '20min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l4-5', module_id: 'm4', number: 5, title: 'Refinando o produto', duration: '18min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l4-6', module_id: 'm4', number: 6, title: 'Testes e ajustes', duration: '15min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l4-7', module_id: 'm4', number: 7, title: 'Versão 1.0 pronta', duration: '22min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l5-1', module_id: 'm5', number: 1, title: 'Preparando o lançamento', duration: '18min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l5-2', module_id: 'm5', number: 2, title: 'Validação com clientes reais', duration: '22min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l5-3', module_id: 'm5', number: 3, title: 'Estratégia de precificação', duration: '17min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l5-4', module_id: 'm5', number: 4, title: 'Primeiros passos de venda', duration: '20min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
  { id: 'l5-5', module_id: 'm5', number: 5, title: 'Escalando o projeto', duration: '13min', status: 'locked', published: true, video_url: '', objectives: [], summary: '', task: '' },
];

async function seed() {
  const { error: e1 } = await supabase.from('modules').upsert(modules);
  console.log('Modules:', e1 ? 'ERRO: ' + e1.message : 'OK - ' + modules.length + ' inseridos');
  const { error: e2 } = await supabase.from('lessons').upsert(lessons);
  console.log('Lessons:', e2 ? 'ERRO: ' + e2.message : 'OK - ' + lessons.length + ' inseridas');
}
seed();
