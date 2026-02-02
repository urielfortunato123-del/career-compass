import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { Mail, FileText, Clock } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useTranslation } from "react-i18next";

export default function HelpPage() {
  const { t } = useTranslation();

  const faqs = [
    {
      question: t("help.faq1Question"),
      answer: t("help.faq1Answer")
    },
    {
      question: t("help.faq2Question"),
      answer: t("help.faq2Answer")
    },
    {
      question: t("help.faq3Question"),
      answer: t("help.faq3Answer")
    },
    {
      question: t("help.faq4Question"),
      answer: t("help.faq4Answer")
    },
    {
      question: t("help.faq5Question"),
      answer: t("help.faq5Answer")
    },
    {
      question: t("help.faq6Question"),
      answer: t("help.faq6Answer")
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 pt-32">
        <div className="container max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">{t("help.title")}</h1>
            <p className="text-xl text-muted-foreground">
              {t("help.subtitle")}
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
              <h3 className="font-semibold mb-2">{t("help.emailTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {t("help.emailDesc")}
              </p>
              <p className="text-primary font-medium">contato@vagajusta.com</p>
            </a>

            <div className="glass-card p-6 rounded-2xl border border-border/50">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{t("help.responseTimeTitle")}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {t("help.responseTimeDesc")}
              </p>
              <p className="text-primary font-medium">{t("help.responseTimeValue")}</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">{t("help.faqTitle")}</h2>
            
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
            <h3 className="font-semibold mb-2">{t("help.legalDocsTitle")}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("help.legalDocsDesc")}
            </p>
            <div className="flex justify-center gap-4">
              <a href="/privacidade" className="text-primary hover:underline">
                {t("footer.privacy")}
              </a>
              <span className="text-muted-foreground">•</span>
              <a href="/termos" className="text-primary hover:underline">
                {t("footer.terms")}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}