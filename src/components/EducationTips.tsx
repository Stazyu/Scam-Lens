"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@heroui/react";
import { FileWarning, Globe, Coins, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export function EducationTips() {
  const t = useTranslations("education");

  const tips = [
    {
      icon: <FileWarning className="w-6 h-6 text-danger" />,
      title: t("tip1Title"),
      desc: t("tip1Desc"),
      color: "bg-danger/10 border-danger/20 text-danger",
    },
    {
      icon: <Globe className="w-6 h-6 text-primary" />,
      title: t("tip2Title"),
      desc: t("tip2Desc"),
      color: "bg-primary/10 border-primary/20 text-primary",
    },
    {
      icon: <Coins className="w-6 h-6 text-warning" />,
      title: t("tip3Title"),
      desc: t("tip3Desc"),
      color: "bg-warning/10 border-warning/20 text-warning",
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-success" />,
      title: t("tip4Title"),
      desc: t("tip4Desc"),
      color: "bg-success/10 border-success/20 text-success",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="text-center md:text-left flex flex-col gap-2">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-foreground">
            {t("title")}
          </h3>
          <div className="h-1 w-16 bg-primary rounded-full mt-2.5 mx-auto md:mx-0" />
        </div>
        <p className="text-sm text-default-500 dark:text-default-400 mt-1 max-w-xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="flex"
          >
            <Card className="flex-1 bg-background/40 dark:bg-default-50/5 backdrop-blur-xl border border-default-200 dark:border-default-100/10 shadow-xl rounded-3xl p-6 flex gap-4 hover:shadow-2xl hover:border-default-300 dark:hover:border-default-100/30 transition-all duration-300">
              <div className="flex items-start gap-4">
                <div className={`p-3.5 rounded-2xl border ${tip.color} shrink-0`}>
                  {tip.icon}
                </div>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-extrabold text-base text-default-800 dark:text-default-100">
                    {tip.title}
                  </h4>
                  <p className="text-sm text-default-500 dark:text-default-400 leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
