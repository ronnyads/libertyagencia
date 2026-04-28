import { motion } from "framer-motion";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#020617] text-gray-300 font-inter selection:bg-primary/30 pb-20">
      {/* HUD Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-[0.05]" />
        <div className="absolute top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 pt-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8 group text-gray-400 hover:text-primary hover:bg-primary/10">
            <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Voltar para o Início
          </Button>
        </Link>

        <header className="mb-16">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-primary/20 rounded-xl">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase">
                Política de Privacidade
              </h1>
              <p className="text-primary font-mono text-xs tracking-widest mt-2 uppercase">
                Última atualização: 28/04/2026
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-primary/50 via-primary/10 to-transparent" />
        </header>

        <div className="space-y-12 text-sm md:text-base leading-relaxed text-gray-400 prose prose-invert max-w-none">
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm">
            <p>
              A <strong>Liberty Company Ads</strong>, inscrita no CNPJ nº 60.355.549/0001-20, com site oficial em 
              <span className="text-primary"> adsliberty.com</span>, valoriza a privacidade, a transparência e a segurança dos dados pessoais de seus clientes, parceiros, usuários, lojistas e visitantes.
            </p>
            <p className="mt-4">
              Esta Política de Privacidade explica como coletamos, utilizamos, armazenamos, protegemos e compartilhamos dados pessoais no contexto de nossas atividades, incluindo o uso de sistemas internos, integrações com plataformas de e-commerce, APIs, ERP interno e serviços relacionados à operação de lojas, produtos, pedidos, envios e devoluções.
            </p>
            <p className="mt-4">
              Em caso de dúvidas sobre esta Política ou sobre o tratamento de dados pessoais, entre em contato pelo e-mail: 
              <a href="mailto:contato@mafiaads.com" className="text-primary hover:underline ml-1">contato@mafiaads.com</a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              1. Quem somos
            </h2>
            <p>
              A Liberty Company Ads atua no desenvolvimento e operação de soluções digitais, integrações e sistemas internos para gestão operacional, incluindo aplicações conectadas a plataformas de marketplace, ERP interno e ferramentas de apoio à operação comercial.
            </p>
            <div className="p-4 bg-primary/5 border-l-2 border-primary rounded-r-xl">
              <p className="font-bold text-white text-sm mb-1">Responsável pelo contato de privacidade:</p>
              <p>Ronildo de Oliveira Santos</p>
              <p>E-mail: contato@mafiaads.com</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              2. Quais dados podemos coletar
            </h2>
            <p>Podemos coletar e tratar os seguintes tipos de dados, conforme necessário para a prestação dos nossos serviços:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li><strong>Dados de identificação e contato:</strong> Nome, e-mail, telefone, dados da empresa, CNPJ, informações de cadastro e dados fornecidos voluntariamente pelo usuário.</li>
              <li><strong>Dados relacionados à operação comercial:</strong> Informações de loja, produtos, catálogo, pedidos, status de entrega, envios, devoluções, solicitações de suporte, histórico operacional e dados necessários para integração com ERP interno.</li>
              <li><strong>Dados técnicos:</strong> Endereço IP, registros de acesso, navegador, sistema operacional, data e horário de acesso, logs de segurança, identificadores técnicos e informações necessárias para manter a segurança e funcionamento do sistema.</li>
              <li><strong>Dados de integração via API:</strong> Quando autorizado pelo usuário ou pela plataforma parceira, podemos tratar dados necessários para vincular a aplicação ao ERP interno.</li>
            </ul>
            <p className="italic text-sm text-gray-500">
              A Liberty Company Ads não solicita senhas pessoais de usuários ou lojistas para integrações via API.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              3. Finalidades do tratamento dos dados
            </h2>
            <p>Os dados pessoais e operacionais podem ser tratados para as seguintes finalidades:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Operar aplicações conectadas a ERP interno",
                "Integração com plataformas de marketplace",
                "Gerenciar produtos, pedidos e envios",
                "Prestar suporte técnico e operacional",
                "Melhorar a segurança e estabilidade",
                "Prevenir fraudes e acessos indevidos",
                "Atender obrigações legais e regulatórias"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              4. Base legal para tratamento
            </h2>
            <p>Tratamos dados pessoais de acordo com as bases legais previstas na Lei Geral de Proteção de Dados Pessoais — LGPD, incluindo execução de contrato, cumprimento de obrigação legal, legítimo interesse e consentimento.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              5. Compartilhamento de dados
            </h2>
            <p>A Liberty Company Ads poderá compartilhar dados pessoais ou operacionais apenas quando necessário:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Plataformas integradas autorizadas pelo usuário;</li>
              <li>Provedores de hospedagem e infraestrutura (ex: Vercel);</li>
              <li>Ferramentas internas ou ERP utilizados para operação;</li>
              <li>Autoridades públicas por obrigação legal.</li>
            </ul>
            <p className="font-bold text-primary italic">Não vendemos dados pessoais.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              6. Segurança e Armazenamento
            </h2>
            <p>
              Adotamos medidas técnicas, administrativas e organizacionais para proteger os dados. 
              A operação ocorre no Brasil e utilizamos infraestrutura de ponta com conexões seguras por HTTPS/TLS, 
              controle de permissões e autenticação em duas etapas.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              7. Seus Direitos (LGPD)
            </h2>
            <p>Nos termos da LGPD, o titular dos dados pessoais pode solicitar a qualquer momento:</p>
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div className="flex items-center gap-2">✓ Confirmação de tratamento</div>
              <div className="flex items-center gap-2">✓ Acesso aos dados</div>
              <div className="flex items-center gap-2">✓ Correção de dados</div>
              <div className="flex items-center gap-2">✓ Eliminação ou bloqueio</div>
              <div className="flex items-center gap-2">✓ Portabilidade</div>
              <div className="flex items-center gap-2">✓ Revogação de consentimento</div>
            </div>
            <p className="text-sm mt-4">
              Para exercer seus direitos, envie um e-mail para: <span className="text-primary">contato@mafiaads.com</span>
            </p>
          </section>

          <footer className="mt-20 pt-10 border-t border-white/10 text-center">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Liberty Company Ads © 2026
            </p>
            <p className="text-[10px] text-gray-600">
              CNPJ: 60.355.549/0001-20 | Responsável: Ronildo de Oliveira Santos
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
