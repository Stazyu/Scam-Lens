"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@heroui/react";
import { MessageSquareCode, Cpu, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export function HowItWorks() {
  const t = useTranslations("howItWorks");

  const steps = [
    {
      icon: <MessageSquareCode className="w-8 h-8 text-primary" />,
      title: t("step1Title"),
      desc: t("step1Desc"),
      color: "bg-primary/10 border-primary/20",
    },
    {
      icon: <Cpu className="w-8 h-8 text-warning" />,
      title: t("step2Title"),
      desc: t("step2Desc"),
      color: "bg-warning/10 border-warning/20",
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-success" />,
      title: t("step3Title"),
      desc: t("step3Desc"),
      color: "bg-success/10 border-success/20",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
          {t("title")}
        </h3>
        <div className="h-1 w-16 bg-primary rounded-full mt-2.5 mx-auto md:mx-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {/* Connection Line for Desktop */}
        <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t border-dashed border-default-300 dark:border-default-100/20 -z-10" />

        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.15 }}
            whileHover={{ y: -5 }}
            className="flex"
          >
            <Card className="flex-1 bg-background/40 dark:bg-default-50/5 backdrop-blur-xl border border-default-200 dark:border-default-100/10 shadow-xl overflow-hidden rounded-3xl p-6 flex flex-col items-center text-center gap-4">
              <div className={`p-4 rounded-2xl border ${step.color} shrink-0`}>
                {step.icon}
              </div>
              <h4 className="font-extrabold text-lg text-default-800 dark:text-default-100">
                {step.title}
              </h4>
              <p className="text-sm text-default-500 dark:text-default-400 leading-relaxed">
                {step.desc}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
