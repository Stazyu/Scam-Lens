"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@heroui/react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t("q1"), a: t("a1") },
    { q: t("q2"), a: t("a2") },
    { q: t("q3"), a: t("a3") },
    { q: t("q4"), a: t("a4") },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      <div className="text-center md:text-left">
        <h3 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center justify-center md:justify-start gap-2.5">
          <HelpCircle className="w-6 h-6 text-primary shrink-0" />
          {t("title")}
        </h3>
        <div className="h-1 w-16 bg-primary rounded-full mt-2.5 mx-auto md:mx-0" />
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
            >
              <Card
                className={`border transition-all duration-300 rounded-3xl overflow-hidden cursor-pointer bg-background/40 dark:bg-default-50/5 backdrop-blur-xl ${
                  isOpen
                    ? "border-primary/30 shadow-lg shadow-primary/5"
                    : "border-default-200 dark:border-default-100/10 hover:border-default-300 dark:hover:border-default-100/30"
                }`}
                onClick={() => toggleFAQ(idx)}
              >
                {/* Accordion Header */}
                <div className="flex items-center justify-between p-6 gap-4 select-none">
                  <h4 className="font-extrabold text-sm sm:text-base text-default-800 dark:text-default-100 leading-snug">
                    {faq.q}
                  </h4>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: "spring", damping: 15, stiffness: 200 }}
                    className={`p-1.5 rounded-full shrink-0 ${
                      isOpen
                        ? "bg-primary/10 text-primary"
                        : "bg-default-100 text-default-400 dark:bg-default-100/10"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4 sm:w-5 h-5" />
                  </motion.div>
                </div>

                {/* Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-default-200/50 dark:border-default-100/5">
                        <p className="text-sm text-default-600 dark:text-default-400 leading-relaxed">
                          {faq.a}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
