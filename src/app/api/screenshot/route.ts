import mql from "@microlink/mql";
import { NextResponse } from "next/server";

function cleanUrl(urlStr: string): string {
  let url = urlStr.trim();
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL query parameter is required" },
        { status: 400 }
      );
    }

    const formattedUrl = cleanUrl(url);

    // Call Microlink with screenshot: true
    const { data } = await mql(formattedUrl, {
      screenshot: true,
    });

    const screenshotUrl = data?.screenshot?.url;

    if (!screenshotUrl) {
      return NextResponse.json(
        { error: "No screenshot returned from Microlink" },
        { status: 500 }
      );
    }

    return NextResponse.json({ image: screenshotUrl, url: formattedUrl });
  } catch (error: any) {
    console.error("Screenshot API Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to capture screenshot" },
      { status: 500 }
    );
  }
}
