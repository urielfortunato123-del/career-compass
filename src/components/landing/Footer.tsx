export function Footer() {
  return (
    <footer className="py-12 bg-foreground text-background">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">V</span>
              </div>
              <span className="font-bold text-xl text-background">
                Vaga<span className="text-primary">Justa</span>
              </span>
            </a>
            <p className="text-sm text-background/70 max-w-sm">
              IA de decisão de carreira e currículo inteligente. 
              Estratégia real para quem quer trabalhar melhor.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produto</h4>
            <ul className="space-y-2">
              <li><a href="#como-funciona" className="text-sm text-background/70 hover:text-background transition-colors">Como Funciona</a></li>
              <li><a href="#recursos" className="text-sm text-background/70 hover:text-background transition-colors">Recursos</a></li>
              <li><a href="#planos" className="text-sm text-background/70 hover:text-background transition-colors">Planos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-background/70 hover:text-background transition-colors">Central de Ajuda</a></li>
              <li><a href="#" className="text-sm text-background/70 hover:text-background transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="text-sm text-background/70 hover:text-background transition-colors">Termos de Uso</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/10 text-center">
          <p className="text-sm text-background/50">
            © 2024 VagaJusta. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
