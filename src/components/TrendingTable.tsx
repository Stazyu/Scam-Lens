"use client";

import React from "react";
import { Table, Chip, Spinner } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";

interface ScamData {
  id: string;
  modus: string;
  platform: string;
  status: "safe" | "caution" | "danger";
  timeKey: string;
}

const mockData: ScamData[] = [
  { id: "1", modus: "scam1", platform: "Telegram / WhatsApp", status: "danger", timeKey: "time1" },
  { id: "2", modus: "scam2", platform: "WhatsApp", status: "danger", timeKey: "time2" },
  { id: "3", modus: "scam3", platform: "Instagram", status: "caution", timeKey: "time3" },
  { id: "4", modus: "scam4", platform: "TikTok", status: "caution", timeKey: "time4" },
  { id: "5", modus: "scam5", platform: "Shopee", status: "safe", timeKey: "time5" },
];

const fetchTrendingScams = async (): Promise<ScamData[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 1500);
  });
};

const statusColorMap: Record<string, "success" | "warning" | "danger"> = {
  safe: "success",
  caution: "warning",
  danger: "danger",
};

export function TrendingTable() {
  const t = useTranslations("trending");
  const tStatus = useTranslations("status");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["trendingScams"],
    queryFn: fetchTrendingScams,
  });

  if (isError) {
    return <div className="text-danger">{t("error")}</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
        {t("title")}
      </h2>
      <Table>
        <Table.ScrollContainer className="bg-background/40 dark:bg-default-50/5 backdrop-blur-xl border border-default-200 dark:border-default-100/10 shadow-2xl rounded-3xl overflow-x-auto">
          <Table.Content
            aria-label={t("title")}
            className="min-w-[600px]"
          >
            <Table.Header className="bg-default-100/50 dark:bg-default-100/10 text-default-800 dark:text-default-200">
              <Table.Column isRowHeader>{t("colModus")}</Table.Column>
              <Table.Column>{t("colPlatform")}</Table.Column>
              <Table.Column>{t("colStatus")}</Table.Column>
              <Table.Column>{t("colTime")}</Table.Column>
            </Table.Header>
            <Table.Body
              renderEmptyState={() => (
                <div className="text-center py-12 text-default-500">
                  {isLoading ? (
                    <div className="flex justify-center items-center gap-3">
                      <Spinner size="md" />
                      <span className="font-medium">{t("loading")}</span>
                    </div>
                  ) : (
                    t("empty")
                  )}
                </div>
              )}
            >
              {(data ?? []).map((item) => (
                <Table.Row
                  key={item.id}
                  className="border-b border-default-100 dark:border-default-100/5 last:border-0 hover:bg-default-50/50 dark:hover:bg-default-100/5 transition-colors"
                >
                  <Table.Cell className="font-bold text-default-800 dark:text-default-200 py-4">
                    {t(item.modus as any)}
                  </Table.Cell>
                  <Table.Cell className="text-default-600 dark:text-default-400">
                    {item.platform}
                  </Table.Cell>
                  <Table.Cell>
                    <Chip
                      color={statusColorMap[item.status]}
                      size="sm"
                      variant="soft"
                      className="font-bold uppercase text-[10px] tracking-wider"
                    >
                      {tStatus(item.status as any)}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell className="text-default-400 dark:text-default-500 text-sm font-medium">
                    {t(item.timeKey as any)}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </div>
  );
}
