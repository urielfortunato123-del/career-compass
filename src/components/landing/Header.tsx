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
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="VagaJusta" className="h-8 w-auto" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Como Funciona
          </a>
          <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Recursos
          </a>
          <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Planos
          </a>
          <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sobre
          </a>
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/history">Histórico</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/app">Nova Análise</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth">Entrar</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
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
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container py-4 flex flex-col gap-4">
            <a href="#como-funciona" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Como Funciona
            </a>
            <a href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Recursos
            </a>
            <a href="#planos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Planos
            </a>
            <a href="#sobre" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
            <hr className="border-border" />
            <Button variant="ghost" className="justify-start">
              Entrar
            </Button>
            <Button variant="default">
              Começar Grátis
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
