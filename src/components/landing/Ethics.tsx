import { Shield, Heart, Target } from "lucide-react";

export function Ethics() {
  return (
    <section className="py-16 bg-primary/5">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          {/* Ethics Statement */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Nosso Compromisso com a Honestidade
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              O VagaJusta não inventa experiências. Ele organiza, destaca e orienta 
              com base no que você já construiu.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Sem Falsas Promessas</h3>
              <p className="text-sm text-muted-foreground">
                Não garantimos emprego. Aumentamos suas chances com estratégia.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Respeito ao Candidato</h3>
              <p className="text-sm text-muted-foreground">
                Nunca inventamos skills ou experiências que não existem.
              </p>
            </div>

            <div className="text-center p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Foco em Resultado</h3>
              <p className="text-sm text-muted-foreground">
                Estratégia real para quem quer trabalhar melhor.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
