import { motion } from "framer-motion";
import { Lock, ArrowLeft, ShieldCheck, Server, Key, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function SecurityPolicy() {
  return (
    <div className="min-h-screen bg-[#020617] text-gray-300 font-inter selection:bg-primary/30 pb-20">
      {/* HUD Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full grid-bg opacity-[0.05]" />
        <div className="absolute bottom-[5%] -right-[10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
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
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white uppercase leading-none">
                Política de Segurança <br />da Informação
              </h1>
              <p className="text-primary font-mono text-xs tracking-widest mt-4 uppercase">
                Última atualização: 28/04/2026
              </p>
            </div>
          </div>
          <div className="h-px w-full bg-gradient-to-r from-primary/50 via-primary/10 to-transparent" />
        </header>

        <div className="space-y-12 text-sm md:text-base leading-relaxed text-gray-400 prose prose-invert max-w-none">
          <section className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={120} className="text-primary" />
            </div>
            <p className="relative z-10">
              A <strong>Liberty Company Ads</strong> estabelece esta Política de Segurança da Informação para definir as práticas internas adotadas na proteção de dados, sistemas, integrações e credenciais. 
              Esta Política se aplica a todas as atividades digitais da empresa, incluindo aplicações web, integrações via API e ERP interno.
            </p>
            <div className="mt-6 relative z-10 p-4 bg-primary/5 border-l-2 border-primary rounded-r-xl">
              <p className="font-bold text-white text-sm mb-1">Responsável pela segurança:</p>
              <p>Ronildo de Oliveira Santos</p>
              <p>E-mail: contato@mafiaads.com</p>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <Server className="w-5 h-5 text-primary" />
                1. Objetivo e Escopo
              </h2>
              <p className="text-sm">
                Estabelecer diretrizes para proteger informações contra acesso não autorizado, uso indevido ou vazamento. 
                Aplica-se a sistemas, APIs, equipamentos e credenciais operadas pela empresa.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
                <Key className="w-5 h-5 text-primary" />
                2. Controle de Acesso
              </h2>
              <p className="text-sm">
                O acesso operacional é limitado ao responsável autorizado, seguindo o princípio do menor privilégio. 
                Acessos são removidos imediatamente quando deixam de ser necessários.
              </p>
            </section>
          </div>

          <section className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              3. Práticas de Autenticação
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                    "Uso de senhas fortes e únicas",
                    "Autenticação em duas etapas (2FA)",
                    "Revogação imediata em caso de suspeita",
                    "Armazenamento seguro de credenciais",
                    "Proteção rigorosa de tokens de API",
                    "Controle de acesso administrativo"
                ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                        <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm">{text}</span>
                    </div>
                ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              4. Segurança de Rede e Infraestrutura
            </h2>
            <p>
              Utilizamos infraestrutura de classe mundial (Vercel) para nossas aplicações web. 
              Todas as conexões são protegidas por <strong>HTTPS/TLS</strong> e adotamos práticas de separação entre ambientes pessoais e administrativos.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              5. Classificação da Informação
            </h2>
            <div className="space-y-3">
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <span className="text-primary font-black mr-2">PÚBLICAS:</span> Institucional e site oficial.
                </div>
                <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <span className="text-blue-400 font-black mr-2">INTERNAS:</span> Dados de operação cotidiana.
                </div>
                <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <span className="text-white font-black mr-2 uppercase tracking-widest">Confidenciais & Restritas:</span> 
                    Tokens, credenciais, dados de lojistas, chaves de API e informações críticas de segurança.
                </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-bold text-white uppercase tracking-tight flex items-center gap-3">
              <span className="w-1.5 h-6 bg-primary rounded-full" />
              6. Resposta a Incidentes
            </h2>
            <p>
              Mantemos protocolos rigorosos para identificação, contenção e mitigação de incidentes. 
              Qualquer violação de segurança será investigada e comunicada às partes afetadas conforme exigido pela legislação vigente.
            </p>
          </section>

          <section className="p-8 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
             <div className="flex items-center gap-3 mb-4">
                 <EyeOff className="text-amber-500" />
                 <h2 className="text-xl font-bold text-white uppercase tracking-tight">Certificações e Transparência</h2>
             </div>
             <p className="text-sm text-gray-400 italic leading-relaxed">
               A Liberty Company Ads não declara possuir certificações externas como ISO 27001 no momento, 
               mas mantém controles internos rigorosos compatíveis com as melhores práticas de segurança do mercado digital.
             </p>
          </section>

          <footer className="mt-20 pt-10 border-t border-white/10 text-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-px bg-primary/50" />
                <p className="text-xs uppercase tracking-[0.4em] text-gray-500">
                    Liberty Security Protocol
                </p>
                <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                    CNPJ: 60.355.549/0001-20 | CONTATO@MAFIAADS.COM
                </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
