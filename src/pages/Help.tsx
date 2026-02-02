import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Mail, MessageCircle, FileText, Clock, ChevronDown } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  {
    question: "Como funciona a análise de currículo?",
    answer: "Nossa IA analisa seu currículo comparando com as melhores práticas de mercado e, quando você informa uma vaga, compara suas qualificações com os requisitos específicos para calcular seu score de compatibilidade."
  },
  {
    question: "Meus dados estão seguros?",
    answer: "Sim! Utilizamos criptografia de ponta a ponta e não compartilhamos seus dados com terceiros. Seus currículos são processados de forma segura e você pode excluí-los a qualquer momento."
  },
  {
    question: "O que é o currículo ATS?",
    answer: "ATS (Applicant Tracking System) são sistemas usados por empresas para filtrar currículos automaticamente. Nosso currículo ATS é otimizado para passar por esses filtros, usando palavras-chave e formatação adequadas."
  },
  {
    question: "Como funciona o plano gratuito?",
    answer: "O plano gratuito permite 3 análises por mês, acesso ao currículo ATS base e plano de ação de 14 dias. Você pode fazer upgrade para o plano Pro a qualquer momento para recursos ilimitados."
  },
  {
    question: "Posso cancelar a assinatura a qualquer momento?",
    answer: "Sim! Você pode cancelar sua assinatura Pro a qualquer momento. Seu acesso continua até o final do período já pago."
  },
  {
    question: "Como funciona o modo transição de carreira?",
    answer: "Este modo adapta seu currículo para destacar habilidades transferíveis, projetos pessoais e experiências relevantes para sua nova área desejada, mesmo que você não tenha experiência direta nela."
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 pt-32">
        <div className="container max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Central de Ajuda</h1>
            <p className="text-xl text-muted-foreground">
              Encontre respostas para suas dúvidas ou entre em contato conosco
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <a 
              href="mailto:contato@vagajusta.com"
              className="glass-card p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">E-mail</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Envie sua dúvida por e-mail
              </p>
              <p className="text-primary font-medium">contato@vagajusta.com</p>
            </a>

            <div className="glass-card p-6 rounded-2xl border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Tempo de Resposta</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Respondemos em até
              </p>
              <p className="text-primary font-medium">24 horas úteis</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Perguntas Frequentes</h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="glass-card rounded-xl border border-border/50 px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Links */}
          <div className="text-center p-8 glass-card rounded-2xl border border-border/50">
            <FileText className="w-10 h-10 text-primary mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Documentos Legais</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Consulte nossa política de privacidade e termos de uso
            </p>
            <div className="flex justify-center gap-4">
              <a href="/privacidade" className="text-primary hover:underline">
                Política de Privacidade
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="/termos" className="text-primary hover:underline">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
