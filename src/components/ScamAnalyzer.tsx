"use client";

import React, { useState, useEffect } from "react";
import {
  Button,
  Chip,
  Switch,
  ProgressBar,
  Label,
  TextField,
  TextArea,
  FieldError,
  Card,
  Tabs,
} from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ShieldAlert,
  ShieldCheck,
  Shield,
  Image as ImageIcon,
  X,
  Upload,
  Search,
  Cpu,
  FileText,
  Loader2,
  RotateCcw,
  Globe,
  Lock,
  ExternalLink,
} from "lucide-react";
import { HighlightText } from "./HighlightText";
import { useTranslations, useLocale } from "next-intl";
import { motion } from "framer-motion";

// Status values are locale-specific:
// ID → "Aman" | "Waspada" | "Bahaya"
// EN → "Safe" | "Caution" | "Danger"
type ScamStatus = "Aman" | "Waspada" | "Bahaya" | "Safe" | "Caution" | "Danger";

interface AnalyzeResponse {
  riskScore: number;
  status: ScamStatus;
  technicalExplanation: string;
  simpleExplanation: string;
  highlightedKeywords: string[];
  scannedUrl?: string;
}

const statusColorMap: Record<ScamStatus, "success" | "warning" | "danger"> = {
  Aman: "success",
  Safe: "success",
  Waspada: "warning",
  Caution: "warning",
  Bahaya: "danger",
  Danger: "danger",
};

const statusIconMap: Record<ScamStatus, React.ReactNode> = {
  Aman: <ShieldCheck className="w-5 h-5" />,
  Safe: <ShieldCheck className="w-5 h-5" />,
  Waspada: <Shield className="w-5 h-5" />,
  Caution: <Shield className="w-5 h-5" />,
  Bahaya: <ShieldAlert className="w-5 h-5" />,
  Danger: <ShieldAlert className="w-5 h-5" />,
};

function extractUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const match = text.match(urlRegex);
  if (match) return match[0];

  const noProtocolRegex = /(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(?:\/[^\s]*)?/gi;
  const matchNoProtocol = text.match(noProtocolRegex);
  if (matchNoProtocol) {
    const candidate = matchNoProtocol[0];
    if (candidate.includes(".") && !candidate.includes("@")) {
      return candidate;
    }
  }
  return null;
}

interface WebsitePreviewProps {
  url: string;
  onZoom: (imgUrl: string) => void;
}

function WebsitePreview({ url, onZoom }: WebsitePreviewProps) {
  const t = useTranslations("analyzer");
  const locale = useLocale();

  const { data, isLoading, error } = useQuery({
    queryKey: ["screenshot", url],
    queryFn: async () => {
      const res = await fetch(`/api/screenshot?url=${encodeURIComponent(url)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch screenshot");
      }
      return res.json() as Promise<{ image: string; url: string }>;
    },
    enabled: !!url,
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });

  return (
    <div className="flex flex-col gap-3 w-full">
      <h4 className="font-extrabold text-default-800 dark:text-default-200 flex items-center gap-2 text-base">
        <Globe className="w-5 h-5 text-primary" />
        {t("screenshotTitle")}
      </h4>

      <div className="relative aspect-video md:aspect-[3/4] max-h-[300px] w-full rounded-2xl overflow-hidden border border-default-200 dark:border-default-100/10 bg-default-50 dark:bg-default-100/5 shadow-md cursor-zoom-in group">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 bg-default-50/40 dark:bg-default-50/5 animate-pulse">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-bold text-default-500 text-center">
              {t("screenshotLoading")}
            </p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center gap-3.5 p-8 text-center max-w-md w-full h-full bg-default-100/20 dark:bg-default-900/10">
            <div className="p-3 bg-danger/10 text-danger rounded-2xl border border-danger/25">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <p className="text-sm font-extrabold text-danger leading-tight">{t("screenshotError")}</p>
            <p className="text-xs text-default-500 truncate max-w-full px-4">
              URL: <span className="font-mono text-default-500 break-all select-all">{url}</span>
            </p>
          </div>
        )}

        {data?.image && (
          <div
            onClick={(e) => {
              e.preventDefault();
              onZoom(data.image);
            }}
            className="relative w-full h-full overflow-hidden group cursor-zoom-in"
          >
            <img
              src={data.image}
              alt="Website screenshot"
              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
              <div className="bg-black/75 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-primary" />
                <span>{t("clickToEnlarge")}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ScanningOverlay({ type }: { type: "text" | "image" }) {
  return (
    <div className="absolute inset-0 bg-default-900/10 dark:bg-default-900/40 backdrop-blur-[2px] rounded-2xl overflow-hidden pointer-events-none flex flex-col items-center justify-center border border-primary/20 z-20">
      {/* Laser Scanning Line */}
      <motion.div
        className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_rgba(59,130,246,0.8)]"
        initial={{ top: "0%" }}
        animate={{ top: ["0%", "100%", "0%"] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {/* Digital Tech Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] opacity-40" />

      {/* Corner Bracket Widgets */}
      <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-primary rounded-tl" />
      <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-primary rounded-tr" />
      <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-primary rounded-bl" />
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-primary rounded-br" />

      {/* Pulsing Scan Indicator */}
      <div className="flex flex-col items-center gap-2 bg-background/80 dark:bg-background/90 px-4 py-2.5 rounded-full border border-primary/20 shadow-xl backdrop-blur-md animate-pulse">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
        </span>
      </div>
    </div>
  );
}

export function ScamAnalyzer() {
  const t = useTranslations("analyzer");
  const locale = useLocale();

  const [text, setText] = useState("");
  const [image, setImage] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("text");
  const [useSimpleMode, setUseSimpleMode] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isAnalyzedImageZoomed, setIsAnalyzedImageZoomed] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isAnalyzedImageZoomed) return;

    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsAnalyzedImageZoomed(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isAnalyzedImageZoomed]);

  useEffect(() => {
    if (!zoomedImageUrl) return;

    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoomedImageUrl(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [zoomedImageUrl]);

  const mutation = useMutation({
    mutationFn: async (payload: { text: string; image?: string; imageMimeType?: string; locale: string }) => {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t("analyzeTextError"));
      }

      return res.json() as Promise<AnalyzeResponse>;
    },
  });

  const scannedUrl = mutation.data
    ? mutation.data.scannedUrl || extractUrl(text)
    : null;

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!mutation.isPending) {
      setCurrentStep(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < 3) return prev + 1;
        return prev;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [mutation.isPending]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert(t("imageMaxSize"));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(",")[1];
      setImage({
        data: base64,
        mimeType: file.type,
        preview: URL.createObjectURL(file),
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleReset = () => {
    mutation.reset();
    setText("");
    setImage(null);
    setIsAnalyzedImageZoomed(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    mutation.mutate({
      text,
      image: image?.data,
      imageMimeType: image?.mimeType,
      locale,
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto">
      {!mutation.isSuccess ? (
        <motion.div
          key="input-form"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          className="w-full"
        >
            <Card className="bg-background/40 dark:bg-default-50/5 backdrop-blur-xl border border-default-200 dark:border-default-100/10 shadow-2xl shadow-primary/5 overflow-hidden">
              <Card.Content className="p-0">
                <Tabs
                  selectedKey={activeTab}
                  onSelectionChange={(key) => setActiveTab(key as string)}
                  variant="secondary"
                  className="w-full"
                >
                  <Tabs.ListContainer className="border-b border-default-100 dark:border-default-100/10 bg-default-50/30 dark:bg-default-100/5">
                    <Tabs.List aria-label="Analysis Options" className="px-4 sm:px-6 h-14">
                      <Tabs.Tab id="text" className="flex items-center gap-2 font-bold px-4">
                        {t("tabText")}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                      <Tabs.Tab id="image" className="flex items-center gap-2 font-bold px-4">
                        <Tabs.Separator />
                        {t("tabImage")}
                        <Tabs.Indicator />
                      </Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>

                  <form onSubmit={handleSubmit} className="p-4 sm:p-8 flex flex-col gap-6">
                    <Tabs.Panel id="text" className="outline-none">
                      <TextField isRequired isInvalid={mutation.isError && activeTab === "text"}>
                        <Label className="text-sm font-bold text-default-700 dark:text-default-300 mb-3 block">
                          {t("textLabel")}
                        </Label>
                        <div className="relative">
                          <TextArea
                            placeholder={t("textPlaceholder")}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={6}
                            disabled={mutation.isPending}
                            className="w-full p-4 rounded-2xl border border-default-200 dark:border-default-100/20 bg-default-50/50 dark:bg-default-100/5 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none disabled:opacity-50 text-base"
                          />
                          {mutation.isPending && <ScanningOverlay type="text" />}
                        </div>
                      </TextField>
                    </Tabs.Panel>

                    <Tabs.Panel id="image" className="outline-none">
                      <div className="flex flex-col gap-4">
                        <Label className="text-sm font-bold text-default-700 dark:text-default-300 block">
                          {t("imageLabel")}
                        </Label>

                        {!image ? (
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-default-300 dark:border-default-100/20 rounded-3xl p-6 sm:p-12 flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group bg-default-50/30 dark:bg-default-100/5"
                          >
                            <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                              <ImageIcon className="w-8 h-8" />
                            </div>
                            <div className="text-center">
                              <p className="font-bold text-base text-default-800 dark:text-default-200">
                                {t("imageClickPrompt")}
                              </p>
                              <p className="text-sm text-default-500">{t("imageSupport")}</p>
                            </div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileChange}
                              accept="image/*"
                              className="hidden"
                            />
                          </div>
                        ) : (
                          <div className="relative w-full aspect-video md:aspect-21/9 rounded-3xl overflow-hidden border-2 border-primary/20 group">
                            <img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
                            {!mutation.isPending && (
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                <Button
                                  size="sm"
                                  variant="danger"
                                  onPress={clearImage}
                                  className="font-bold px-4"
                                >
                                  <X className="w-4 h-4 mr-1" /> {t("changeImage")}
                                </Button>
                              </div>
                            )}
                            {mutation.isPending && <ScanningOverlay type="image" />}
                          </div>
                        )}

                        <TextField>
                          <Label className="text-sm font-bold text-default-600 dark:text-default-400 mt-2 block">
                            {t("contextLabel")}
                          </Label>
                          <TextArea
                            placeholder={t("contextPlaceholder")}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={2}
                            disabled={mutation.isPending}
                            className="w-full p-3 rounded-xl border border-default-200 dark:border-default-100/20 bg-default-50/50 dark:bg-default-100/5 focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
                          />
                        </TextField>
                      </div>
                    </Tabs.Panel>

                    {mutation.isError && (
                      <div className="bg-danger/10 border border-danger/20 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                        <ShieldAlert className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-bold text-danger">{t("errorTitle")}</p>
                          <p className="text-xs text-danger/80 leading-relaxed">
                            {mutation.error.message.includes("API_KEY")
                              ? t("errorApiKey")
                              : mutation.error.message.includes("high_demand") || mutation.error.message.includes("503") || mutation.error.message.includes("UNAVAILABLE")
                                ? t("errorHighDemand")
                                : mutation.error.message.includes("fetch")
                                  ? t("errorFetch")
                                  : t("errorGeneral")}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-center pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        isPending={mutation.isPending}
                        isDisabled={
                          (activeTab === "text" && !text.trim()) ||
                          (activeTab === "image" && !image)
                        }
                        className="font-bold px-12 py-5 text-lg rounded-2xl shadow-2xl shadow-primary/30 w-full md:w-auto min-w-[240px] tracking-tight"
                      >
                        {mutation.isPending ? t("submitPending") : t("submitIdle")}
                      </Button>
                    </div>

                    {mutation.isPending && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 15 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="w-full mt-4 p-4 sm:p-6 rounded-2xl bg-default-50/50 dark:bg-default-100/5 border border-default-200 dark:border-default-100/10 backdrop-blur-xl shadow-inner flex flex-col gap-4 sm:gap-5 overflow-hidden"
                      >
                          <div className="flex items-center justify-between border-b border-default-200/50 dark:border-default-100/5 pb-3">
                            <div className="flex items-center gap-2.5">
                              <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                              </span>
                              <h4 className="font-extrabold text-sm tracking-tight text-foreground/90 uppercase">
                                {t("analyzingTitle")}
                              </h4>
                            </div>
                            <span className="text-xs font-mono font-bold bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                              {Math.round(((currentStep + 1) / 4) * 100)}%
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                              {
                                id: "scan",
                                label: activeTab === "text" ? t("scanningText") : t("scanningImage"),
                                icon: <Search className="w-4 h-4" />,
                              },
                              {
                                id: "extract",
                                label: t("extractingKeywords"),
                                icon: <Cpu className="w-4 h-4" />,
                              },
                              {
                                id: "analyze",
                                label: t("analyzingPatterns"),
                                icon: <ShieldAlert className="w-4 h-4" />,
                              },
                              {
                                id: "report",
                                label: t("generatingReport"),
                                icon: <FileText className="w-4 h-4" />,
                              },
                            ].map((step, idx) => {
                              const isCompleted = idx < currentStep;
                              const isActive = idx === currentStep;
                              const isUpcoming = idx > currentStep;

                              return (
                                <div
                                  key={step.id}
                                  className={`flex items-center gap-3.5 p-3 rounded-xl border transition-all duration-300 ${isActive
                                      ? "bg-primary/5 border-primary/30 shadow-sm shadow-primary/5 translate-x-1"
                                      : isCompleted
                                        ? "bg-success/5 border-success/20 opacity-80"
                                        : "bg-default-500/5 border-transparent opacity-40"
                                    }`}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 animate-pulse"
                                        : isCompleted
                                          ? "bg-success/15 text-success"
                                          : "bg-default-100 text-default-400 dark:bg-default-100/10"
                                      }`}
                                  >
                                    {isCompleted ? (
                                      <ShieldCheck className="w-5 h-5" />
                                    ) : isActive ? (
                                      <div className="animate-spin text-primary-foreground">
                                        <Loader2 className="w-4 h-4" />
                                      </div>
                                    ) : (
                                      step.icon
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-0.5">
                                    <p
                                      className={`text-sm font-bold tracking-tight transition-colors ${isActive
                                          ? "text-primary"
                                          : isCompleted
                                            ? "text-success"
                                            : "text-default-500"
                                        }`}
                                    >
                                      {step.label}
                                    </p>
                                    <p className="text-[10px] uppercase font-bold tracking-wider text-default-400">
                                      {isCompleted
                                        ? locale === "id"
                                          ? "Selesai"
                                          : "Done"
                                        : isActive
                                          ? locale === "id"
                                            ? "Memproses..."
                                            : "Processing..."
                                          : locale === "id"
                                            ? "Menunggu"
                                            : "Waiting"}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                  </form>
                </Tabs>
              </Card.Content>
            </Card>
          </motion.div>
        ) : (
          mutation.data && (
            <motion.div
              key="result-view"
              initial={{ opacity: 0, scale: 0.98, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Card className="bg-background/40 dark:bg-default-50/5 backdrop-blur-xl border border-default-200 dark:border-default-100/10 shadow-2xl overflow-hidden">
                <Card.Header className="flex flex-col items-start gap-4 p-4 sm:p-8 pb-0">
                  <h3 className="text-xl font-extrabold tracking-tight">{t("resultTitle")}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                    <Chip
                      color={statusColorMap[mutation.data.status]}
                      variant="soft"
                      size="lg"
                      className="font-bold px-2 py-1 w-fit"
                    >
                      <div className="flex items-center gap-2">
                        {statusIconMap[mutation.data.status]}
                        <span>{mutation.data.status}</span>
                      </div>
                    </Chip>

                    <div className="flex-1 w-full sm:max-w-md sm:ml-auto">
                      <ProgressBar value={mutation.data.riskScore} color={statusColorMap[mutation.data.status]}>
                        <div className="flex justify-between w-full mb-1">
                          <Label className="text-xs font-medium text-default-600">{t("riskLevel")}</Label>
                          <ProgressBar.Output className="text-xs font-bold" />
                        </div>
                        <ProgressBar.Track className="h-2 rounded-full bg-default-200 overflow-hidden">
                          <ProgressBar.Fill className="h-full rounded-full transition-all duration-500 ease-in-out" />
                        </ProgressBar.Track>
                      </ProgressBar>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content className="p-4 sm:p-6 flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h4 className="font-semibold text-default-800 dark:text-default-200">{t("explanationLabel")}</h4>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-default-500">{t("technicalMode")}</span>
                        <Switch
                          isSelected={useSimpleMode}
                          onChange={setUseSimpleMode}
                          size="sm"
                        >
                          <Switch.Control className="data-[selected=true]:bg-primary">
                            <Switch.Thumb />
                          </Switch.Control>
                        </Switch>
                        <span className="text-sm font-medium">{t("simpleMode")}</span>
                      </div>
                    </div>
                    <div className="bg-default-100/50 dark:bg-default-100/10 p-6 rounded-2xl text-default-700 dark:text-default-300 leading-relaxed border border-default-200/50 dark:border-default-100/5 w-full">
                      {useSimpleMode
                        ? mutation.data.simpleExplanation
                        : mutation.data.technicalExplanation}
                    </div>

                    {(image || scannedUrl) && (
                      <div className={`grid grid-cols-1 ${image && scannedUrl ? "sm:grid-cols-2" : "max-w-md"} gap-6 mt-2`}>
                        {image && (
                          <div className="flex flex-col gap-3 w-full">
                            <h4 className="font-extrabold text-default-800 dark:text-default-200 flex items-center gap-2 text-base">
                              <ImageIcon className="w-5 h-5 text-primary" />
                              {t("analyzedImageTitle")}
                            </h4>
                            <div 
                              onClick={(e) => {
                                e.preventDefault();
                                setIsAnalyzedImageZoomed(true);
                              }}
                              className="relative aspect-video md:aspect-[3/4] max-h-[300px] w-full rounded-2xl overflow-hidden border border-default-200 dark:border-default-100/10 bg-default-50 dark:bg-default-100/5 shadow-md cursor-zoom-in group"
                            >
                              <img
                                src={image.preview}
                                alt="Analyzed screenshot"
                                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex items-center justify-center">
                                <div className="bg-black/75 backdrop-blur-md text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl border border-white/10 shadow-lg flex items-center gap-1.5">
                                  <Search className="w-3.5 h-3.5 text-primary" />
                                  <span>{t("clickToEnlarge")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {scannedUrl && (
                          <WebsitePreview url={scannedUrl} onZoom={setZoomedImageUrl} />
                        )}
                      </div>
                    )}
                  </div>

                  {mutation.data.highlightedKeywords.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h4 className="font-semibold text-default-800 dark:text-default-200">
                        {t("keywordsLabel")}
                      </h4>
                      <div className="bg-danger/5 dark:bg-danger/10 p-6 rounded-2xl border border-danger/20 text-default-700 dark:text-default-300 leading-relaxed">
                        {text ? (
                          <HighlightText
                            text={text}
                            keywords={mutation.data.highlightedKeywords}
                          />
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {mutation.data.highlightedKeywords.map((kw, i) => (
                              <Chip key={i} color="danger" variant="soft" size="sm" className="font-bold">
                                {kw}
                              </Chip>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Reset/Scan Again Button */}
                  <div className="flex justify-center pt-6 border-t border-default-200/50 dark:border-default-100/5 mt-4">
                    <Button
                      onPress={handleReset}
                      variant="primary"
                      className="font-bold px-8 py-5 text-lg rounded-2xl shadow-2xl shadow-primary/30 w-full md:w-auto min-w-[240px] flex items-center justify-center gap-2.5 tracking-tight"
                    >
                      <RotateCcw className="w-5 h-5" />
                      {t("scanAgain")}
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          )
        )}

      {/* Lightbox / Enlarged Analyzed Image Modal */}
      {isAnalyzedImageZoomed && image?.preview && (
        <div
          onClick={() => setIsAnalyzedImageZoomed(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8 cursor-zoom-out select-none"
        >
          {/* Close Button at top right */}
          <button
            onClick={() => setIsAnalyzedImageZoomed(false)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Floating Image Container with scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking image container
          >
            <img
              src={image.preview}
              alt="Full analyzed screenshot"
              className="w-full h-auto object-contain cursor-zoom-out rounded-2xl"
              onClick={() => setIsAnalyzedImageZoomed(false)}
            />
          </motion.div>
        </div>
      )}

      {/* Lightbox / Enlarged URL Screenshot Modal */}
      {zoomedImageUrl && (
        <div
          onClick={() => setZoomedImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 md:p-8 cursor-zoom-out select-none"
        >
          {/* Close Button at top right */}
          <button
            onClick={() => setZoomedImageUrl(null)}
            className="absolute top-4 right-4 z-50 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all hover:scale-105 active:scale-95 border border-white/10"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Floating Image Container with scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-[95vw] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking image container
          >
            <img
              src={zoomedImageUrl}
              alt="Full website screenshot"
              className="w-full h-auto object-contain cursor-zoom-out rounded-2xl"
              onClick={() => setZoomedImageUrl(null)}
            />
          </motion.div>
        </div>
      )}
    </div>
  );
}
