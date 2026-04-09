-- ============================================================
-- ZPPIA Members — Schema Supabase
-- Rodar no SQL Editor do Supabase Dashboard
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES (estende auth.users do Supabase Auth)
-- ============================================================
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Aluno',
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz default now()
);

-- Auto-criar profile ao registrar usuário
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', 'Aluno'), coalesce(new.raw_user_meta_data->>'role', 'student'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- MODULES
-- ============================================================
create table if not exists modules (
  id text primary key,
  number int not null,
  title text not null,
  short_desc text default '',
  full_desc text default '',
  result text default '',
  duration text default '',
  task_count int default 1,
  progress int default 0,
  status text default 'locked' check (status in ('completed', 'in-progress', 'locked')),
  published bool default true,
  created_at timestamptz default now()
);

-- ============================================================
-- LESSONS
-- ============================================================
create table if not exists lessons (
  id text primary key,
  module_id text not null references modules(id) on delete cascade,
  number int not null,
  title text not null,
  duration text default '',
  video_url text default '',
  cover_url text default '',
  objectives jsonb default '[]',
  summary text default '',
  task text default '',
  status text default 'locked' check (status in ('completed', 'current', 'locked')),
  published bool default true,
  created_at timestamptz default now()
);

-- ============================================================
-- MATERIALS
-- ============================================================
create table if not exists materials (
  id uuid primary key default uuid_generate_v4(),
  module_id text references modules(id) on delete set null,
  name text not null,
  description text default '',
  type text default 'pdf' check (type in ('pdf', 'template', 'checklist', 'prompt')),
  url text default '',
  category text default 'Geral',
  visible bool default true,
  created_at timestamptz default now()
);

-- ============================================================
-- BONUSES
-- ============================================================
create table if not exists bonuses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text default '',
  type text default 'template' check (type in ('Aula Extra', 'Template', 'Biblioteca', 'Ferramenta')),
  url text default '',
  cta_label text default 'Acessar',
  badge text default '' check (badge in ('NOVO', 'EXCLUSIVO', '')),
  visible bool default true,
  created_at timestamptz default now()
);

-- ============================================================
-- NOTICES (Avisos e Novidades)
-- ============================================================
create table if not exists notices (
  id uuid primary key default uuid_generate_v4(),
  message text not null,
  type text default 'update' check (type in ('update', 'bonus', 'mentorship')),
  active bool default true,
  created_at timestamptz default now()
);

-- ============================================================
-- FAQS
-- ============================================================
create table if not exists faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  order_index int default 0,
  created_at timestamptz default now()
);

-- ============================================================
-- COMMUNITY LINKS
-- ============================================================
create table if not exists community_links (
  id uuid primary key default uuid_generate_v4(),
  key text unique not null,
  value text default ''
);

insert into community_links (key, value) values
  ('whatsapp', ''),
  ('email', 'contato@zppia.com'),
  ('group', '')
on conflict (key) do nothing;

-- ============================================================
-- STUDENT PROGRESS
-- ============================================================
create table if not exists student_progress (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  module_id text not null references modules(id) on delete cascade,
  lesson_id text not null references lessons(id) on delete cascade,
  completed_at timestamptz default now(),
  unique (student_id, lesson_id)
);

-- ============================================================
-- NOTES (Anotações das aulas)
-- ============================================================
create table if not exists notes (
  id uuid primary key default uuid_generate_v4(),
  student_id uuid not null references profiles(id) on delete cascade,
  lesson_id text not null references lessons(id) on delete cascade,
  content text default '',
  updated_at timestamptz default now(),
  unique (student_id, lesson_id)
);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================
alter table profiles enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table materials enable row level security;
alter table bonuses enable row level security;
alter table notices enable row level security;
alter table faqs enable row level security;
alter table community_links enable row level security;
alter table student_progress enable row level security;
alter table notes enable row level security;

-- PROFILES: usuário lê só o próprio; admin lê todos
create policy "profiles_select_own" on profiles for select using (auth.uid() = id);
create policy "profiles_select_admin" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);
create policy "profiles_admin_all" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- MODULES: todos autenticados leem; só admin escreve
create policy "modules_read" on modules for select using (auth.role() = 'authenticated');
create policy "modules_admin_write" on modules for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- LESSONS: todos autenticados leem; só admin escreve
create policy "lessons_read" on lessons for select using (auth.role() = 'authenticated');
create policy "lessons_admin_write" on lessons for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- MATERIALS: todos autenticados leem visíveis; admin gerencia
create policy "materials_read" on materials for select using (auth.role() = 'authenticated' and visible = true);
create policy "materials_admin_all" on materials for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- BONUSES: todos autenticados leem visíveis; admin gerencia
create policy "bonuses_read" on bonuses for select using (auth.role() = 'authenticated' and visible = true);
create policy "bonuses_admin_all" on bonuses for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- NOTICES: todos autenticados leem ativos; admin gerencia
create policy "notices_read" on notices for select using (auth.role() = 'authenticated' and active = true);
create policy "notices_admin_all" on notices for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- FAQS: todos leem; admin gerencia
create policy "faqs_read" on faqs for select using (auth.role() = 'authenticated');
create policy "faqs_admin_all" on faqs for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- COMMUNITY_LINKS: todos leem; admin gerencia
create policy "community_links_read" on community_links for select using (auth.role() = 'authenticated');
create policy "community_links_admin_all" on community_links for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- STUDENT_PROGRESS: aluno lê/escreve o próprio; admin lê tudo
create policy "progress_own" on student_progress for all using (auth.uid() = student_id);
create policy "progress_admin_read" on student_progress for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- NOTES: aluno lê/escreve as próprias; admin lê tudo
create policy "notes_own" on notes for all using (auth.uid() = student_id);
create policy "notes_admin_read" on notes for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ============================================================
-- SEED DATA — Módulos e Aulas (mesmos dados do course.ts)
-- ============================================================
insert into modules (id, number, title, short_desc, full_desc, result, duration, task_count, progress, status) values
('m1', 1, 'Saída do Zero', 'Destrave e entenda o jogo.', 'Destrave e compreenda o campo de jogo do digital com IA.', 'Clareza e posicionamento para começar.', '1h30', 1, 100, 'completed'),
('m2', 2, 'Escolha Certa', 'Encontre sua ideia viável.', 'Encontre e valide a ideia certa para o seu perfil e contexto.', 'Uma ideia viável escolhida e validada.', '1h10', 1, 75, 'in-progress'),
('m3', 3, 'Estrutura do Projeto', 'Projete antes de construir.', 'Projete com clareza antes de construir qualquer coisa.', 'Blueprint completo do seu projeto.', '1h45', 1, 0, 'locked'),
('m4', 4, 'Construção com IA', 'Construa com inteligência artificial.', 'Use IA para construir a primeira versão real do seu projeto.', 'Primeira versão funcional criada.', '2h20', 1, 0, 'locked'),
('m5', 5, 'Validação e Venda', 'Lance, valide e monetize.', 'Lance, valide e comece a monetizar.', 'Projeto apresentado e estratégia de monetização ativa.', '1h30', 1, 0, 'locked')
on conflict (id) do nothing;

insert into lessons (id, module_id, number, title, duration, status) values
('l1-1','m1',1,'O cenário digital com IA','18min','completed'),
('l1-2','m1',2,'O que muda com inteligência artificial','15min','completed'),
('l1-3','m1',3,'O método ZPPIA explicado','20min','completed'),
('l1-4','m1',4,'Mentalidade de construtor','17min','completed'),
('l1-5','m1',5,'Preparando seu ambiente','20min','completed'),
('l2-1','m2',1,'O que é uma ideia viável?','18min','completed'),
('l2-2','m2',2,'Como pesquisar o problema certo','22min','completed'),
('l2-3','m2',3,'Validação rápida sem produto pronto','19min','current'),
('l2-4','m2',4,'Estruturando sua ideia final','15min','locked'),
('l3-1','m3',1,'Definindo o escopo mínimo','18min','locked'),
('l3-2','m3',2,'Mapa de funcionalidades','20min','locked'),
('l3-3','m3',3,'Blueprint do projeto','22min','locked'),
('l3-4','m3',4,'Estrutura visual básica','15min','locked'),
('l3-5','m3',5,'Preparando os prompts','17min','locked'),
('l3-6','m3',6,'Revisão e ajustes finais','13min','locked'),
('l4-1','m4',1,'Escolhendo as ferramentas certas','18min','locked'),
('l4-2','m4',2,'Prompts que funcionam','22min','locked'),
('l4-3','m4',3,'Construindo a base','25min','locked'),
('l4-4','m4',4,'Iterando com IA','20min','locked'),
('l4-5','m4',5,'Refinando o produto','18min','locked'),
('l4-6','m4',6,'Testes e ajustes','15min','locked'),
('l4-7','m4',7,'Versão 1.0 pronta','22min','locked'),
('l5-1','m5',1,'Preparando o lançamento','18min','locked'),
('l5-2','m5',2,'Validação com clientes reais','22min','locked'),
('l5-3','m5',3,'Estratégia de precificação','17min','locked'),
('l5-4','m5',4,'Primeiros passos de venda','20min','locked'),
('l5-5','m5',5,'Escalando o projeto','13min','locked')
on conflict (id) do nothing;

insert into notices (message, type, active) values
('Nova aula adicionada ao Módulo 4. Acesse agora.', 'update', true),
('Bônus exclusivo disponível: Biblioteca de Prompts v2.', 'bonus', true),
('Próxima sessão de mentoria em breve. Fique ligado!', 'mentorship', true)
on conflict do nothing;

insert into faqs (question, answer, order_index) values
('Como entro em contato com o suporte?', 'Você pode enviar uma mensagem pelo WhatsApp ou e-mail diretamente pela página de suporte.', 1),
('Onde tiro dúvidas sobre o conteúdo?', 'Na comunidade exclusiva do Método ZPPIA, onde alunos e equipe estão disponíveis.', 2),
('Posso pedir revisão do meu projeto?', 'Sim! Compartilhe na comunidade ou solicite na mentoria de aceleração.', 3),
('Onde fico sabendo das novidades?', 'No painel do curso e por e-mail. Ative as notificações no seu perfil.', 4),
('Como acesso a mentoria de aceleração?', 'Acesse a página de Mentoria Premium no menu lateral para saber mais.', 5)
on conflict do nothing;

insert into bonuses (title, description, type, cta_label, badge, visible) values
('Biblioteca de Prompts Completa', 'Mais de 50 prompts organizados por etapa do método.', 'Biblioteca', 'Acessar', 'NOVO', true),
('Ferramentas para Começar Mais Rápido', 'Seleção das melhores ferramentas de IA disponíveis.', 'Template', 'Acessar', 'EXCLUSIVO', true),
('Templates de Oferta', 'Modelos prontos para apresentar seu projeto.', 'Template', 'Baixar', '', true),
('Templates de Página de Vendas', 'Estruturas prontas para criar sua página.', 'Template', 'Baixar', '', true),
('Exemplos Práticos de Projetos', 'Cases reais de projetos criados com o método.', 'Aula Extra', 'Acessar', 'NOVO', true),
('Análise de Projetos (Aula Extra)', 'Revisão ao vivo de projetos de alunos.', 'Aula Extra', 'Acessar', '', true),
('Posicionamento Digital (Aula Extra)', 'Como se apresentar como criador de projetos com IA.', 'Aula Extra', 'Acessar', '', true),
('Validação Avançada (Aula Extra)', 'Técnicas avançadas para validar antes de vender.', 'Aula Extra', 'Acessar', '', true)
on conflict do nothing;

-- ============================================================
-- CRIAR USUÁRIOS DE DEMO (rodar após configurar Auth)
-- Atenção: os usuários precisam ser criados via Supabase Auth Dashboard
-- ou via supabase.auth.signUp() na primeira execução.
-- Depois, atualizar manualmente o role na tabela profiles:
--   update profiles set role = 'admin', name = 'Ronny Oliveira' where id = '<uuid-do-ronny>';
--   update profiles set role = 'student', name = 'Aluno Demo' where id = '<uuid-do-aluno>';
-- ============================================================
