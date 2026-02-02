import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";
import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 py-20 pt-32">
        <div className="container max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">{t("terms.title")}</h1>
          <p className="text-muted-foreground mb-12">{t("terms.lastUpdated")}</p>

          <div className="prose prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section1Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section1Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section2Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section2Text")}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>{t("terms.section2Item1")}</li>
                <li>{t("terms.section2Item2")}</li>
                <li>{t("terms.section2Item3")}</li>
                <li>{t("terms.section2Item4")}</li>
                <li>{t("terms.section2Item5")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section3Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section3Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section4Title")}</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{t("terms.section4Text")}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>{t("terms.section4Item1")}</li>
                <li>{t("terms.section4Item2")}</li>
                <li>{t("terms.section4Item3")}</li>
                <li>{t("terms.section4Item4")}</li>
                <li>{t("terms.section4Item5")}</li>
                <li>{t("terms.section4Item6")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section5Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section5Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section6Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">{t("terms.section6Text")}</strong>
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>{t("terms.section6Item1")}</li>
                <li>{t("terms.section6Item2")}</li>
                <li>{t("terms.section6Item3")}</li>
                <li>{t("terms.section6Item4")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section7Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section7Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section8Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section8Text")}
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2 mt-4">
                <li>{t("terms.section8Item1")}</li>
                <li>{t("terms.section8Item2")}</li>
                <li>{t("terms.section8Item3")}</li>
                <li>{t("terms.section8Item4")}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section9Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section9Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section10Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section10Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section11Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section11Text")}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">{t("terms.section12Title")}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t("terms.section12Text")}
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