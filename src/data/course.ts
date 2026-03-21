export interface Lesson {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  duration: string;
  status: 'completed' | 'current' | 'locked';
  objectives?: string[];
  summary?: string;
  task?: string;
  materials?: { name: string; type: string }[];
}

export interface Module {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  result: string;
  lessonCount: number;
  duration: string;
  taskCount: number;
  progress: number;
  status: 'completed' | 'in-progress' | 'locked';
  lessons: Lesson[];
  materials: { name: string; desc: string; type: string }[];
}

export const modules: Module[] = [
  {
    id: 'm1', number: 1, title: 'Saída do Zero',
    shortDesc: 'Destrave e entenda o jogo.',
    fullDesc: 'Destrave e compreenda o campo de jogo do digital com IA.',
    result: 'Clareza e posicionamento para começar.',
    lessonCount: 5, duration: '1h30', taskCount: 1, progress: 100, status: 'completed',
    lessons: [
      { id: 'l1-1', moduleId: 'm1', number: 1, title: 'O cenário digital com IA', duration: '18min', status: 'completed' },
      { id: 'l1-2', moduleId: 'm1', number: 2, title: 'O que muda com inteligência artificial', duration: '15min', status: 'completed' },
      { id: 'l1-3', moduleId: 'm1', number: 3, title: 'O método ZPPIA explicado', duration: '20min', status: 'completed' },
      { id: 'l1-4', moduleId: 'm1', number: 4, title: 'Mentalidade de construtor', duration: '17min', status: 'completed' },
      { id: 'l1-5', moduleId: 'm1', number: 5, title: 'Preparando seu ambiente', duration: '20min', status: 'completed' },
    ],
    materials: [
      { name: 'Guia de Onboarding', desc: 'Seus primeiros passos no método', type: 'pdf' },
      { name: 'Checklist Primeiros Passos', desc: 'Lista de verificação inicial', type: 'checklist' },
      { name: 'Glossário de IA', desc: 'Termos essenciais explicados', type: 'pdf' },
    ],
  },
  {
    id: 'm2', number: 2, title: 'Escolha Certa',
    shortDesc: 'Encontre sua ideia viável.',
    fullDesc: 'Encontre e valide a ideia certa para o seu perfil e contexto.',
    result: 'Uma ideia viável escolhida e validada.',
    lessonCount: 4, duration: '1h10', taskCount: 1, progress: 75, status: 'in-progress',
    lessons: [
      { id: 'l2-1', moduleId: 'm2', number: 1, title: 'O que é uma ideia viável?', duration: '18min', status: 'completed',
        objectives: ['Entender o que torna uma ideia viável', 'Diferenciar ideia de projeto', 'Avaliar suas habilidades'],
        summary: 'Nesta aula, você entende o que separa uma boa ideia de uma ideia viável e como escolher com inteligência.',
        task: 'Liste 3 ideias de projetos que resolvam problemas reais que você já observou.',
        materials: [{ name: 'Template de Ideação', type: 'template' }] },
      { id: 'l2-2', moduleId: 'm2', number: 2, title: 'Como pesquisar o problema certo', duration: '22min', status: 'completed',
        objectives: ['Técnicas de pesquisa de problemas', 'Como validar a dor do mercado', 'Ferramentas de pesquisa'],
        summary: 'Aprenda a pesquisar e identificar problemas reais que valem a pena resolver.',
        materials: [{ name: 'Planilha de Pesquisa', type: 'template' }] },
      { id: 'l2-3', moduleId: 'm2', number: 3, title: 'Validação rápida sem produto pronto', duration: '19min', status: 'current',
        objectives: ['Como validar uma ideia sem gastar dinheiro', 'Técnicas de entrevista com potenciais clientes', 'Como interpretar o feedback que você receber', 'Critérios para decidir se segue com a ideia'],
        summary: 'Nesta aula, você aprende que validar não precisa custar nada. Usando conversas simples e observação, é possível descobrir se sua ideia tem potencial antes de construir qualquer coisa.',
        task: 'Hoje, converse com 3 pessoas sobre o problema que você quer resolver. Anote as respostas e traga para a comunidade.',
        materials: [{ name: 'Roteiro de Entrevista (PDF)', type: 'pdf' }, { name: 'Planilha de Feedback', type: 'template' }, { name: 'Prompt de Validação', type: 'prompt' }] },
      { id: 'l2-4', moduleId: 'm2', number: 4, title: 'Estruturando sua ideia final', duration: '15min', status: 'locked' },
    ],
    materials: [
      { name: 'Checklist de Validação', desc: 'Lista de verificação para sua ideia', type: 'checklist' },
      { name: 'Template de Pesquisa', desc: 'Modelo de entrevista com potenciais clientes', type: 'template' },
      { name: 'Prompts de Ideação', desc: 'Prompts para usar com ChatGPT e Claude', type: 'prompt' },
      { name: 'Planilha de Viabilidade', desc: 'Matriz para avaliar sua ideia', type: 'template' },
    ],
  },
  {
    id: 'm3', number: 3, title: 'Estrutura do Projeto',
    shortDesc: 'Projete antes de construir.',
    fullDesc: 'Projete com clareza antes de construir qualquer coisa.',
    result: 'Blueprint completo do seu projeto.',
    lessonCount: 6, duration: '1h45', taskCount: 1, progress: 0, status: 'locked',
    lessons: [
      { id: 'l3-1', moduleId: 'm3', number: 1, title: 'Definindo o escopo mínimo', duration: '18min', status: 'locked' },
      { id: 'l3-2', moduleId: 'm3', number: 2, title: 'Mapa de funcionalidades', duration: '20min', status: 'locked' },
      { id: 'l3-3', moduleId: 'm3', number: 3, title: 'Blueprint do projeto', duration: '22min', status: 'locked' },
      { id: 'l3-4', moduleId: 'm3', number: 4, title: 'Estrutura visual básica', duration: '15min', status: 'locked' },
      { id: 'l3-5', moduleId: 'm3', number: 5, title: 'Preparando os prompts', duration: '17min', status: 'locked' },
      { id: 'l3-6', moduleId: 'm3', number: 6, title: 'Revisão e ajustes finais', duration: '13min', status: 'locked' },
    ],
    materials: [
      { name: 'Blueprint Template', desc: 'Modelo completo de projeto', type: 'template' },
      { name: 'Mapa de Funcionalidades', desc: 'Organize as features do projeto', type: 'template' },
      { name: 'Roteiro de Escopo', desc: 'Defina limites claros', type: 'pdf' },
    ],
  },
  {
    id: 'm4', number: 4, title: 'Construção com IA',
    shortDesc: 'Construa com inteligência artificial.',
    fullDesc: 'Use IA para construir a primeira versão real do seu projeto.',
    result: 'Primeira versão funcional criada.',
    lessonCount: 7, duration: '2h20', taskCount: 1, progress: 0, status: 'locked',
    lessons: [
      { id: 'l4-1', moduleId: 'm4', number: 1, title: 'Escolhendo as ferramentas certas', duration: '18min', status: 'locked' },
      { id: 'l4-2', moduleId: 'm4', number: 2, title: 'Prompts que funcionam', duration: '22min', status: 'locked' },
      { id: 'l4-3', moduleId: 'm4', number: 3, title: 'Construindo a base', duration: '25min', status: 'locked' },
      { id: 'l4-4', moduleId: 'm4', number: 4, title: 'Iterando com IA', duration: '20min', status: 'locked' },
      { id: 'l4-5', moduleId: 'm4', number: 5, title: 'Refinando o produto', duration: '18min', status: 'locked' },
      { id: 'l4-6', moduleId: 'm4', number: 6, title: 'Testes e ajustes', duration: '15min', status: 'locked' },
      { id: 'l4-7', moduleId: 'm4', number: 7, title: 'Versão 1.0 pronta', duration: '22min', status: 'locked' },
    ],
    materials: [
      { name: 'Biblioteca de Prompts', desc: '50+ prompts organizados', type: 'prompt' },
      { name: 'Guia de Ferramentas IA', desc: 'Melhores ferramentas para cada etapa', type: 'pdf' },
      { name: 'Fluxo de Desenvolvimento', desc: 'Passo a passo de construção', type: 'template' },
    ],
  },
  {
    id: 'm5', number: 5, title: 'Validação e Venda',
    shortDesc: 'Lance, valide e monetize.',
    fullDesc: 'Lance, valide e comece a monetizar.',
    result: 'Projeto apresentado e estratégia de monetização ativa.',
    lessonCount: 5, duration: '1h30', taskCount: 1, progress: 0, status: 'locked',
    lessons: [
      { id: 'l5-1', moduleId: 'm5', number: 1, title: 'Preparando o lançamento', duration: '18min', status: 'locked' },
      { id: 'l5-2', moduleId: 'm5', number: 2, title: 'Validação com clientes reais', duration: '22min', status: 'locked' },
      { id: 'l5-3', moduleId: 'm5', number: 3, title: 'Estratégia de precificação', duration: '17min', status: 'locked' },
      { id: 'l5-4', moduleId: 'm5', number: 4, title: 'Primeiros passos de venda', duration: '20min', status: 'locked' },
      { id: 'l5-5', moduleId: 'm5', number: 5, title: 'Escalando o projeto', duration: '13min', status: 'locked' },
    ],
    materials: [
      { name: 'Roteiro de Entrevista', desc: 'Perguntas para validação', type: 'pdf' },
      { name: 'Template de Proposta', desc: 'Modelo de oferta comercial', type: 'template' },
      { name: 'Checklist de Lançamento', desc: 'Tudo pronto para lançar', type: 'checklist' },
    ],
  },
];

export const totalLessons = modules.reduce((sum, m) => sum + m.lessonCount, 0);
export const completedLessons = 9;
export const totalModules = 5;
export const completedModules = 1; // M1 fully done, M2 in progress
