import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { TargetAudience } from "@/components/landing/TargetAudience";
import { Pricing } from "@/components/landing/Pricing";
import { Ethics } from "@/components/landing/Ethics";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-18">
        <Hero />
        <HowItWorks />
        <Features />
        <TargetAudience />
        <Pricing />
        <Ethics />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
