import { Button } from "@/components/ui/button";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/logo.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/30 bg-background/60 backdrop-blur-xl">
      <div className="container flex h-18 items-center justify-between py-4">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="VagaJusta" className="h-20 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Como Funciona
          </a>
          <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Recursos
          </a>
          <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Planos
          </a>
          <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Sobre
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/history">Histórico</Link>
              </Button>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/app">Nova Análise</Link>
              </Button>
              <Button variant="outline" size="sm" className="border-muted-foreground/30" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button variant="default" size="sm" className="shadow-glow" asChild>
                <Link to="/auth">Começar Grátis</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-xl">
          <nav className="container py-6 flex flex-col gap-4">
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Como Funciona
            </a>
            <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Recursos
            </a>
            <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Planos
            </a>
            <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Sobre
            </a>
            <hr className="border-border/50" />
            {user ? (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/history">Histórico</Link>
                </Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/app">Nova Análise</Link>
                </Button>
                <Button variant="outline" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/auth">Entrar</Link>
                </Button>
                <Button variant="default" className="shadow-glow">
                  <Link to="/auth">Começar Grátis</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
