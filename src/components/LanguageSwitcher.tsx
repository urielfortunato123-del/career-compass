import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "pt", name: "Português", countryCode: "br" },
  { code: "en", name: "English", countryCode: "us" },
  { code: "es", name: "Español", countryCode: "es" },
  { code: "fr", name: "Français", countryCode: "fr" },
  { code: "it", name: "Italiano", countryCode: "it" },
  { code: "de", name: "Deutsch", countryCode: "de" },
  { code: "ru", name: "Русский", countryCode: "ru" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);

  const currentLanguage = languages.find((l) => l.code === i18n.language) || languages[0];

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
          <Globe className="w-4 h-4" />
          <img 
            src={`https://flagcdn.com/w20/${currentLanguage.countryCode}.png`} 
            alt={currentLanguage.name}
            className="w-5 h-auto rounded-sm hidden sm:inline"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <img 
                src={`https://flagcdn.com/w20/${language.countryCode}.png`} 
                alt={language.name}
                className="w-5 h-auto rounded-sm"
              />
              <span>{language.name}</span>
            </div>
            {i18n.language === language.code && (
              <Check className="w-4 h-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
