import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 pt-32">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">{t("privacy.title")}</h1>
          <p className="text-muted-foreground mb-12">{t("privacy.lastUpdated")}</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section1Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.section1Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section2Title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t("privacy.section2Text")}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li><strong className="text-foreground">{t("privacy.section2Item1")}</strong></li>
                <li><strong className="text-foreground">{t("privacy.section2Item2")}</strong></li>
                <li><strong className="text-foreground">{t("privacy.section2Item3")}</strong></li>
                <li><strong className="text-foreground">{t("privacy.section2Item4")}</strong></li>
                <li><strong className="text-foreground">{t("privacy.section2Item5")}</strong></li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section3Title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t("privacy.section3Text")}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t("privacy.section3Item1")}</li>
                <li>{t("privacy.section3Item2")}</li>
                <li>{t("privacy.section3Item3")}</li>
                <li>{t("privacy.section3Item4")}</li>
                <li>{t("privacy.section3Item5")}</li>
                <li>{t("privacy.section3Item6")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section4Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{t("privacy.section4Text")}</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>{t("privacy.section4Item1")}</li>
                <li>{t("privacy.section4Item2")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section5Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.section5Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section6Title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {t("privacy.section6Text")}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t("privacy.section6Item1")}</li>
                <li>{t("privacy.section6Item2")}</li>
                <li>{t("privacy.section6Item3")}</li>
                <li>{t("privacy.section6Item4")}</li>
                <li>{t("privacy.section6Item5")}</li>
                <li>{t("privacy.section6Item6")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section7Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.section7Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section8Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.section8Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section9Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.section9Text")}
              </p>
              <p className="text-primary mt-2">contato@vagajusta.com</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("privacy.section10Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("privacy.section10Text")}
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}