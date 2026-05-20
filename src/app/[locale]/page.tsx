import { useTranslations } from "next-intl";
import { ScamAnalyzer } from "@/components/ScamAnalyzer";
import { TrendingTable } from "@/components/TrendingTable";
import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleToggle } from "@/components/LocaleToggle";

export default function Home() {
  const t = useTranslations();

  return (
    <main className="min-h-screen flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full bg-background/60 backdrop-blur-xl border-b border-default-100 dark:border-default-50/10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-xl text-primary border border-primary/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold tracking-tight text-foreground">
              {t("nav.brand")}
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
      </div>

      <footer className="w-full py-8 px-6 text-center text-sm text-default-500 border-t border-default-200 bg-background/50 mt-auto">
        <p className="max-w-2xl mx-auto">
          {t("footer.text", { year: new Date().getFullYear() })}
        </p>
      </footer>
    </main>
  );
}
