import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { language, code } = await req.json();

    // Codex API language mapping
    const langMap: Record<string, string> = {
      "javascript": "js",
      "typescript": "ts",
      "python": "py",
      "go": "go",
    };

    const targetLang = langMap[language] || language;

    const response = await fetch("https://api.codex.one/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: targetLang,
        code: code,
        input: ""
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json({ status: 500, message: "Failed to execute code" }, { status: 500 });
  }
}
