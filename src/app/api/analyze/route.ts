import { NextResponse } from "next/server";
import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({
  // Will automatically use process.env.GEMINI_API_KEY
});

function buildResponseSchema(locale: string): Schema {
  const isId = locale === "id";

  return {
    type: Type.OBJECT,
    properties: {
      riskScore: {
        type: Type.INTEGER,
        description: "Risk score representing the probability of the text being a scam/fraud (0-100)",
      },
      status: {
        type: Type.STRING,
        description: isId
          ? "The safety status. Must be exactly one of: 'Aman', 'Waspada', atau 'Bahaya'"
          : "The safety status. Must be exactly one of: 'Safe', 'Caution', or 'Danger'",
      },
      technicalExplanation: {
        type: Type.STRING,
        description: isId
          ? "Penjelasan teknis yang detail tentang mengapa teks ini ditandai, mengidentifikasi pola penipuan spesifik atau indikator aman."
          : "A detailed technical explanation of why the text is flagged, identifying specific fraud patterns or safe indicators.",
      },
      simpleExplanation: {
        type: Type.STRING,
        description: isId
          ? "Penjelasan sederhana yang mudah dipahami untuk orang awam tanpa jargon teknis."
          : "A simple, easy-to-understand explanation for non-technical users without any jargon.",
      },
      highlightedKeywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: isId
          ? "Array kata-kata mencurigakan persis seperti yang tertulis di teks asli pengguna. Kosongkan jika aman."
          : "An array of exact suspicious keywords or phrases found in the original text. Empty if safe.",
      },
      scannedUrl: {
        type: Type.STRING,
        description: isId
          ? "URL utama yang ditemukan atau dianalisis dalam teks atau gambar. Kosongkan dengan string kosong jika tidak ada URL."
          : "The primary URL found or analyzed in the text or image. Return an empty string if no URL is present.",
      },
    },
    required: [
      "riskScore",
      "status",
      "technicalExplanation",
      "simpleExplanation",
      "highlightedKeywords",
      "scannedUrl",
    ],
  };
}

function buildSystemPrompt(locale: string, text: string, hasImage: boolean): string {
  const isId = locale === "id";
  const inputSection = text
    ? (isId ? `Teks: "${text}"` : `Text: "${text}"`)
    : (isId ? "Analisis gambar yang diberikan." : "Analyze the provided image.");

  if (isId) {
    return `
Kamu adalah seorang Senior Cybersecurity Analyst dan Spesialis Anti-Fraud yang sangat berpengalaman, khususnya dalam membedah modus kejahatan siber di Indonesia (seperti phising APK kurir, undangan pernikahan palsu, rekayasa sosial WhatsApp, penipuan loker freelance, dan investasi bodong). Kamu juga memiliki empati tinggi dan mampu menjelaskan hal teknis yang rumit menjadi sangat sederhana kepada orang awam.

INSTRUKSI BAHASA:
- Deteksi bahasa yang digunakan dalam teks input.
- Seluruh respons (technicalExplanation, simpleExplanation) HARUS dalam Bahasa Indonesia yang natural dan merakyat.
- Gunakan "Aman", "Waspada", atau "Bahaya" untuk field status.

Tugas utamamu adalah menganalisis teks, pesan, atau URL yang diberikan oleh pengguna, lalu membongkar apakah ada indikasi penipuan, manipulasi psikologis (FOMO/urgensi), atau tautan berbahaya di dalamnya.

ATURAN ANALISIS DAN PENILAIAN:
1. "riskScore" (0-100):
   - 0-20: Sangat aman, teks percakapan normal.
   - 21-50: Ada elemen mencurigakan (misal: penawaran terlalu bagus untuk menjadi kenyataan) tapi belum ada tautan/aksi berbahaya.
   - 51-79: Terindikasi kuat rekayasa sosial, meminta data pribadi, atau tautan tidak resmi.
   - 80-100: Jelas berbahaya! Mengandung malware (APK), URL phising, atau modus penipuan yang sudah diketahui secara umum.

2. "status":
   - Gunakan "Aman" untuk skor 0-20.
   - Gunakan "Waspada" untuk skor 21-79.
   - Gunakan "Bahaya" untuk skor 80-100.

3. "technicalExplanation":
   - Jelaskan vektor serangannya secara profesional. Sebutkan istilah teknis jika relevan (misal: Credential Harvesting, Spear Phishing, Malicious APK payload, Social Engineering, Spoofing). Jelaskan mengapa URL atau pola kalimat tersebut berbahaya secara teknikal.

4. "simpleExplanation":
   - Jelaskan dengan bahasa sehari-hari yang sangat merakyat, seolah-olah kamu sedang memperingatkan orang tua atau kerabat yang gaptek. Gunakan analogi sederhana. JANGAN gunakan istilah IT sama sekali. Contoh: "Ini penipu yang nyamar jadi kurir paket. Kalau link-nya diklik, ibaratnya kita ngasih kunci rumah kita ke maling."

5. "highlightedKeywords":
   - Ekstrak kata-kata pasti, frasa manipulatif, atau URL spesifik dari teks asli pengguna yang menjadi pemicu utama kecurigaan. Output harus berupa array string persis seperti yang tertulis di teks asli agar sistem bisa memberikan highlight warna. Jika aman, kosongkan array.

6. "scannedUrl":
   - Ekstrak URL utama yang Anda temukan/analisis dari teks atau gambar (menggunakan OCR/pembacaan teks dari gambar). Jika tidak ada URL sama sekali, wajib kembalikan string kosong "". Jangan menebak atau membuat-buat link palsu.

PENTING: Jangan pernah berasumsi. Jika teksnya hanya "halo, ini Budi", berikan skor rendah. Fokus pada deteksi urgensi palsu, tata bahasa yang aneh dari institusi resmi, dan tautan yang disamarkan.

INPUT UNTUK DIANALISIS:
${inputSection}
`;
  }

  // English locale prompt
  return `
You are a highly experienced Senior Cybersecurity Analyst and Anti-Fraud Specialist, with deep expertise in dissecting cybercrime tactics targeting users in Indonesia and Southeast Asia (e.g., fake delivery APK phishing, fake wedding invitations, WhatsApp social engineering, fake job listings, and investment scams). You also have a strong ability to explain complex technical concepts in plain, accessible language for non-technical users.

LANGUAGE INSTRUCTIONS:
- Detect the language used in the input text.
- Respond to the user in the same language as the input when possible, but structure all explanations in clear English.
- All response fields (technicalExplanation, simpleExplanation) MUST be written in English.
- Use "Safe", "Caution", or "Danger" for the status field.

Your primary task is to analyze the provided text, message, or URL for signs of fraud, scams, psychological manipulation (FOMO/urgency), or malicious links.

ANALYSIS AND SCORING RULES:
1. "riskScore" (0-100):
   - 0-20: Very safe — normal conversation or legitimate content.
   - 21-50: Some suspicious elements (e.g., too-good-to-be-true offers) but no direct harmful links or actions.
   - 51-79: Strong indicators of social engineering, requests for personal data, or unofficial/suspicious links.
   - 80-100: Clearly dangerous! Contains malware (APK), phishing URLs, or well-known scam patterns.

2. "status":
   - Use "Safe" for score 0-20.
   - Use "Caution" for score 21-79.
   - Use "Danger" for score 80-100.

3. "technicalExplanation":
   - Provide a professional analysis of the attack vector. Use relevant technical terms where appropriate (e.g., Credential Harvesting, Spear Phishing, Malicious APK Payload, Social Engineering, URL Spoofing). Explain why specific URLs or sentence patterns are technically dangerous.

4. "simpleExplanation":
   - Explain in very plain, everyday language as if you are warning a non-tech-savvy friend or family member. Use simple analogies. AVOID all IT jargon. Example: "This is a scammer pretending to be a delivery company. If you click the link, it's like handing your house keys to a thief."

5. "highlightedKeywords":
   - Extract exact words, manipulative phrases, or specific URLs from the original input text that are the main triggers of suspicion. Output must be an array of strings exactly as they appear in the original text so the system can highlight them. If safe, return an empty array.

6. "scannedUrl":
   - Extract the primary URL found or analyzed in the text or image (using OCR/text extraction on the image). If there is no URL at all, you must return an empty string "". Do not guess or make up a fake link.

IMPORTANT: Do not assume malicious intent. If the text is simply "Hello, I'm John", give it a low score. Focus on detecting false urgency, grammatical anomalies from official institutions, and disguised or shortened links.

INPUT TO ANALYZE:
${inputSection}
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, image, imageMimeType, locale = "id" } = body;

    if (!text && !image) {
      return NextResponse.json(
        { error: "Text or Image is required." },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const promptText = buildSystemPrompt(locale, text, !!image);
    const responseSchema = buildResponseSchema(locale);

    const contents: any[] = [{ text: promptText }];

    if (image && imageMimeType) {
      contents.push({
        inlineData: {
          mimeType: imageMimeType,
          data: image,
        },
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const resultText = response.text;

    if (!resultText) {
      throw new Error("No response generated from the AI model.");
    }

    const parsedResult = JSON.parse(resultText);

    return NextResponse.json(parsedResult);
  } catch (error: any) {
    console.error("Error analyzing input:", error);
    return NextResponse.json(
      { error: "Failed to analyze the input. Please try again later." },
      { status: 500 }
    );
  }
}
