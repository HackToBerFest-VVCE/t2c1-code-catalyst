import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("receipt") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No receipt file provided" }, { status: 400 });
    }

    const mimeType = file.type;
    if (!mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "File must be an image" }, { status: 400 });
    }

    // Try OpenAI Vision if key is configured
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString("base64");
        const dataUrl = `data:${mimeType};base64,${base64}`;

        const aiRes = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text: `Extract the following from this receipt image and return ONLY valid JSON (no markdown):
{
  "merchant": "business name or null",
  "amount": "total amount as string with currency symbol if visible, or null",
  "date": "date in YYYY-MM-DD format or null",
  "category": "one of: Food, Transport, Accommodation, Activities, Shopping, Other"
}`,
                  },
                  { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
                ],
              },
            ],
            max_tokens: 200,
          }),
        });

        if (aiRes.ok) {
          const data = await aiRes.json() as { choices?: Array<{ message?: { content?: string } }> };
          const content = data.choices?.[0]?.message?.content?.trim() ?? "";
          const match = content.match(/\{[\s\S]*\}/);
          if (match) {
            const extracted = JSON.parse(match[0]);
            return NextResponse.json({ extracted, source: "vision-ai" });
          }
        }
      } catch {
        // Fall through to basic response
      }
    }

    // Tesseract is browser-side only — return a helpful fallback
    return NextResponse.json({
      extracted: {
        merchant: null,
        amount: null,
        date: new Date().toISOString().split("T")[0],
        category: "Other",
      },
      source: "manual",
      message: "OCR requires an OPENAI_API_KEY configured on the server. Please enter receipt details manually.",
    });
  } catch (e) {
    return NextResponse.json(
      { error: `Receipt processing failed: ${e instanceof Error ? e.message : String(e)}` },
      { status: 400 }
    );
  }
}
