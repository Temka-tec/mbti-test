import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { mbti, summary } = await req.json();

  if (!mbti || !summary) {
    return NextResponse.json(
      { error: "mbti болон summary шаардлагатай." },
      { status: 400 },
    );
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      max_tokens: 600,
      messages: [
        {
          role: "system",
          content: `Та MBTI мэргэжилтэн юм. Монгол хэлээр хариулна уу.
Хэрэглэгчийн ${mbti} төрлийг 3 хэсэгт тайлбарла:
1. 💪 Хүчтэй талууд
2. 🌱 Хөгжих боломжтой чиглэлүүд
3. 🎯 Карьер ба харилцааны зөвлөмж
Тус бүрт 2-3 өгүүлбэр. Дулаан, урамшуулалтай өнгө аясаар.`,
        },
        {
          role: "user",
          content: `Миний MBTI: ${mbti}\n\n${summary}`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    return NextResponse.json(
      { error: err.error?.message ?? "OpenAI алдаа." },
      { status: 502 },
    );
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content ?? "Хариу ирсэнгүй.";
  return NextResponse.json({ text });
}
