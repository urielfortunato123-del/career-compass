import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 pt-32">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Termos de Uso</h1>
          <p className="text-muted-foreground mb-12">Última atualização: Fevereiro de 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Ao acessar ou usar a plataforma VagaJusta, você concorda em cumprir estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não poderá acessar ou usar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Descrição do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                A VagaJusta é uma plataforma de análise de currículos e carreira que utiliza inteligência artificial para:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Analisar currículos e identificar pontos de melhoria</li>
                <li>Comparar perfis profissionais com vagas de emprego</li>
                <li>Gerar currículos otimizados para sistemas ATS</li>
                <li>Criar planos de ação personalizados para desenvolvimento profissional</li>
                <li>Analisar descrições de vagas e identificar requisitos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para usar nossos serviços, você deve criar uma conta fornecendo informações precisas e atualizadas. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Uso Aceitável</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Ao usar nossa plataforma, você concorda em:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fornecer informações verdadeiras em seu currículo</li>
                <li>Não usar o serviço para fins ilegais ou não autorizados</li>
                <li>Não tentar acessar contas de outros usuários</li>
                <li>Não interferir no funcionamento da plataforma</li>
                <li>Não usar automação não autorizada para acessar o serviço</li>
                <li>Não revender ou redistribuir nossos serviços</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Propriedade Intelectual</h2>
              <p className="text-muted-foreground leading-relaxed">
                A VagaJusta e todos os seus componentes (software, design, marca, algoritmos) são propriedade da empresa. Você mantém a propriedade de seus currículos e dados pessoais. Ao usar nosso serviço, você nos concede uma licença limitada para processar seus documentos exclusivamente para fornecer os serviços contratados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Limitações do Serviço</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Importante:</strong> A VagaJusta é uma ferramenta de auxílio e orientação profissional. Nossos serviços:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Não garantem contratação ou aprovação em processos seletivos</li>
                <li>Fornecem sugestões baseadas em análise de IA, que podem não ser perfeitas</li>
                <li>São ferramentas de apoio, não substituem orientação profissional especializada</li>
                <li>Dependem da qualidade das informações fornecidas pelo usuário</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Planos e Pagamentos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Oferecemos planos gratuitos e pagos. Os planos pagos são cobrados conforme o ciclo escolhido (mensal ou anual). Você pode cancelar sua assinatura a qualquer momento, mantendo o acesso até o final do período pago. Reembolsos são avaliados caso a caso conforme nossa política de reembolso.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
              <p className="text-muted-foreground leading-relaxed">
                A VagaJusta não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Resultados de processos seletivos</li>
                <li>Decisões de carreira tomadas com base em nossas análises</li>
                <li>Interrupções temporárias do serviço</li>
                <li>Danos indiretos decorrentes do uso da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Rescisão</h2>
              <p className="text-muted-foreground leading-relaxed">
                Podemos suspender ou encerrar sua conta se você violar estes termos. Você pode encerrar sua conta a qualquer momento através das configurações. Após o encerramento, seus dados serão tratados conforme nossa Política de Privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Alterações nos Termos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas por e-mail ou através da plataforma. O uso continuado após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Lei Aplicável</h2>
              <p className="text-muted-foreground leading-relaxed">
                Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para dúvidas sobre estes termos:
              </p>
              <p className="text-primary mt-2">contato@vagajusta.com</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
