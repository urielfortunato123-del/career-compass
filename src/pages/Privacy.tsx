import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 pt-32">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Política de Privacidade</h1>
          <p className="text-muted-foreground mb-12">Última atualização: Fevereiro de 2026</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introdução</h2>
              <p className="text-muted-foreground leading-relaxed">
                A VagaJusta ("nós", "nosso" ou "empresa") está comprometida em proteger a privacidade dos usuários de nossa plataforma. Esta Política de Privacidade descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nossos serviços de análise de currículos e carreira.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Informações que Coletamos</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Coletamos as seguintes categorias de informações:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">Dados de cadastro:</strong> nome, e-mail e senha criptografada</li>
                <li><strong className="text-foreground">Currículos:</strong> documentos PDF enviados para análise</li>
                <li><strong className="text-foreground">Dados de vagas:</strong> descrições de vagas informadas para comparação</li>
                <li><strong className="text-foreground">Dados de uso:</strong> interações com a plataforma, histórico de análises</li>
                <li><strong className="text-foreground">Dados técnicos:</strong> endereço IP, tipo de navegador, dispositivo</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Como Usamos Suas Informações</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">Utilizamos suas informações para:</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Fornecer análises de currículo personalizadas</li>
                <li>Gerar currículos otimizados para ATS</li>
                <li>Criar planos de ação para sua carreira</li>
                <li>Melhorar nossos algoritmos e serviços</li>
                <li>Enviar comunicações sobre sua conta (se autorizado)</li>
                <li>Garantir a segurança da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Compartilhamento de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Não vendemos seus dados.</strong> Suas informações pessoais e currículos não são compartilhados com terceiros para fins de marketing ou recrutamento. Podemos compartilhar dados apenas com:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>Provedores de infraestrutura (hospedagem, banco de dados) sob contratos de confidencialidade</li>
                <li>Autoridades legais, quando exigido por lei</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Armazenamento e Segurança</h2>
              <p className="text-muted-foreground leading-relaxed">
                Seus dados são armazenados em servidores seguros com criptografia em repouso e em trânsito. Implementamos medidas técnicas e organizacionais para proteger contra acesso não autorizado, perda ou alteração de dados. Currículos são processados e armazenados de forma segura, podendo ser excluídos a qualquer momento pelo usuário.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos (LGPD)</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a exclusão de seus dados</li>
                <li>Revogar consentimento a qualquer momento</li>
                <li>Solicitar portabilidade dos dados</li>
                <li>Obter informações sobre compartilhamento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos cookies essenciais para o funcionamento da plataforma e cookies analíticos para entender como nossos serviços são utilizados. Você pode gerenciar suas preferências de cookies nas configurações do navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Retenção de Dados</h2>
              <p className="text-muted-foreground leading-relaxed">
                Mantemos seus dados pelo tempo necessário para fornecer nossos serviços ou conforme exigido por lei. Contas inativas por mais de 2 anos podem ter dados excluídos após notificação prévia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para questões sobre privacidade ou para exercer seus direitos, entre em contato:
              </p>
              <p className="text-primary mt-2">contato@vagajusta.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Alterações</h2>
              <p className="text-muted-foreground leading-relaxed">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre alterações significativas por e-mail ou através da plataforma.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
