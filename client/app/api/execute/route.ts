import { NextResponse } from "next/server";

// Judge0 CE — free, open-source code execution engine
// Public instance at ce.judge0.com, or self-host your own
const JUDGE0_URL =
  process.env.JUDGE0_URL || "https://ce.judge0.com";

export async function POST(req: Request) {
  try {
    const { language, code, stdin } = await req.json();

    // Submit code for execution (synchronous mode with wait)
    const response = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,status,exit_code`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language_id: Number(language),
          source_code: code,
          stdin: stdin || "",
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json(
        { success: false, output: "", error: `Execution service error: ${text}` },
        { status: 502 }
      );
    }

    const data = await response.json();

    // Judge0 status IDs: 1-2 = queued/processing, 3 = accepted (success),
    // 4 = wrong answer, 5 = TLE, 6 = compile error, 7-14 = runtime errors
    const statusId = data.status?.id ?? 0;
    const isSuccess = statusId === 3;

    // Compile error
    if (statusId === 6 && data.compile_output) {
      return NextResponse.json({
        success: false,
        output: "",
        error: data.compile_output,
        exitCode: 1,
      });
    }

    // Runtime error or other failure
    if (!isSuccess && data.stderr) {
      return NextResponse.json({
        success: false,
        output: data.stdout || "",
        error: data.stderr,
        exitCode: data.exit_code ?? 1,
      });
    }

    return NextResponse.json({
      success: isSuccess,
      output: data.stdout || (isSuccess ? "Program executed successfully (no output)." : ""),
      error: data.stderr || data.compile_output || "",
      exitCode: data.exit_code ?? 0,
    });
  } catch (error) {
    console.error("Execution error:", error);
    return NextResponse.json(
      { success: false, output: "", error: "Failed to connect to execution service. Please try again later." },
      { status: 500 }
    );
  }
}
