"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { Button } from "@heroui/react";

export function LocaleToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const nextLocale = locale === "id" ? "id" : "en";

  const toggleLocale = () => {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    const nextPath = segments.join("/");
    startTransition(() => {
      router.push(nextPath);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onPress={toggleLocale}
      isDisabled={isPending}
      className="rounded-full font-bold text-xs tracking-wider px-3 h-8 min-w-0 border border-default-200 dark:border-default-100/20 hover:border-primary/40 hover:bg-primary/5 transition-all uppercase"
      aria-label={`Switch to ${nextLocale}`}
    >
      {nextLocale}
    </Button>
  );
}
