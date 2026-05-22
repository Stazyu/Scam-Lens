import { useTranslations } from "next-intl";
import { ScamAnalyzer } from "@/components/ScamAnalyzer";
import { TrendingTable } from "@/components/TrendingTable";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleToggle } from "@/components/LocaleToggle";
import { HowItWorks } from "@/components/HowItWorks";
import { EducationTips } from "@/components/EducationTips";
import { ReportChannels } from "@/components/ReportChannels";
import { FAQ } from "@/components/FAQ";
import { Logo } from "@/components/Logo";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-default-100 dark:border-default-50/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <Logo />
            <h1 className="text-xl tracking-tight select-none flex items-center">
              <span className="relative drop-shadow-[0_2px_8px_rgba(244,63,94,0.3)] dark:drop-shadow-[0_4px_16px_rgba(244,63,94,0.6)] group-hover:scale-[1.03] group-hover:brightness-110 transition-all duration-300 inline-block origin-left">
                <span className="bg-linear-to-r from-rose-500 via-orange-500 to-amber-400 bg-clip-text text-transparent font-black tracking-tighter">
                  Scam
                </span>
              </span>
              <span className="relative ml-1.5 px-2 py-0.5 font-bold text-foreground bg-default-100/40 dark:bg-default-50/5 border border-default-200/50 dark:border-default-50/10 rounded-md transition-all duration-300 group-hover:border-orange-500/30 group-hover:bg-orange-500/5 text-sm tracking-wide flex items-center gap-1.5">
                {/* Visual Lens focus point */}
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange-500"></span>
                </span>
                Lens
                {/* Focus Bracket Corners representing camera/scanner lens */}
                <span className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-rose-400 dark:border-rose-400 rounded-tl-md opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute -top-px -right-px w-1.5 h-1.5 border-t border-r border-rose-400 dark:border-rose-400 rounded-tr-md opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute -bottom-px -left-px w-1.5 h-1.5 border-b border-l border-amber-400 dark:border-amber-400 rounded-bl-md opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-amber-400 dark:border-amber-400 rounded-br-md opacity-40 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LocaleToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-5xl mx-auto px-6 py-12 md:py-24 flex flex-col gap-16">
        <section className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 dark:bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary animate-in fade-in zoom-in duration-1000">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2.5 animate-pulse"></span>
            {t("hero.badge")}
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1] animate-in fade-in slide-in-from-top-8 duration-1000">
            {t("hero.title")} <br className="hidden md:block" />
            <span className="bg-linear-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent italic drop-shadow-sm">
              {t("hero.titleHighlight")}
            </span>
          </h2>
          <p className="text-lg md:text-xl text-default-500 dark:text-default-400 leading-relaxed max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            {t("hero.description")}
          </p>
        </section>

        <section className="w-full">
          <ScamAnalyzer />
        </section>

        <section className="w-full mt-4">
          <TrendingTable />
        </section>

        <hr className="border-default-100 dark:border-default-50/10 w-full" />

        <section className="w-full">
          <HowItWorks />
        </section>

        <hr className="border-default-100 dark:border-default-50/10 w-full" />

        <section className="w-full">
          <EducationTips />
        </section>

        <hr className="border-default-100 dark:border-default-50/10 w-full" />

        <section className="w-full">
          <ReportChannels />
        </section>

        <hr className="border-default-100 dark:border-default-50/10 w-full" />

        <section className="w-full animate-in fade-in duration-1000">
          <FAQ />
        </section>
      </div>

      <footer className="w-full py-8 px-6 text-center text-sm text-default-500 border-t border-default-200 bg-background/50 mt-auto">
        <p className="max-w-2xl mx-auto">
          {t("footer.text", { year: new Date().getFullYear() })}
        </p>
      </footer>
    </main>
  );
}
