"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Card } from "@heroui/react";
import { Link2, ShieldAlert, CreditCard, Send } from "lucide-react";
import { motion } from "framer-motion";

export function ReportChannels() {
  const t = useTranslations("reportChannels");

  const channels = [
    {
      name: t("channel1Name"),
      desc: t("channel1Desc"),
      action: t("channel1Action"),
      url: "https://aduankonten.id",
      icon: <Send className="w-6 h-6 text-primary" />,
      color: "bg-primary/10 border-primary/20",
    },
    {
      name: t("channel2Name"),
      desc: t("channel2Desc"),
      action: t("channel2Action"),
      url: "https://www.patrolisiber.id",
      icon: <ShieldAlert className="w-6 h-6 text-danger" />,
      color: "bg-danger/10 border-danger/20",
    },
    {
      name: t("channel3Name"),
      desc: t("channel3Desc"),
      action: t("channel3Action"),
      url: "https://cekrekening.id",
      icon: <CreditCard className="w-6 h-6 text-success" />,
      color: "bg-success/10 border-success/20",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="text-center md:text-left flex flex-col gap-2">
        <div>
          <h3 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-2">
            {t("title")}
          </h3>
          <div className="h-1 w-16 bg-primary rounded-full mt-2.5 mx-auto md:mx-0" />
        </div>
        <p className="text-sm text-default-500 dark:text-default-400 mt-1 max-w-xl">
          {t("subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channels.map((channel, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="flex"
          >
            <Card className="flex-1 bg-background/40 dark:bg-default-50/5 backdrop-blur-xl border border-default-200 dark:border-default-100/10 shadow-xl rounded-3xl p-6 flex flex-col justify-between gap-6 hover:shadow-2xl transition-all duration-300">
              <div className="flex flex-col gap-4">
                <div className={`p-3 w-fit rounded-2xl border ${channel.color}`}>
                  {channel.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="font-extrabold text-base text-default-800 dark:text-default-100 flex items-center gap-1.5">
                    {channel.name}
                  </h4>
                  <p className="text-sm text-default-500 dark:text-default-400 leading-relaxed">
                    {channel.desc}
                  </p>
                </div>
              </div>

              <a
                href={channel.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-xs tracking-wider uppercase border border-default-200 dark:border-default-100/20 hover:border-primary/50 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all w-full flex items-center justify-center gap-2 rounded-2xl h-11 text-default-700 dark:text-default-300"
              >
                <span>{channel.action}</span>
                <Link2 className="w-4 h-4" />
              </a>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
