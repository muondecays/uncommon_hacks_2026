import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.together.xyz/v1",
  apiKey: process.env.TOGETHER_API_KEY,
});

export async function POST(req: NextRequest) {
  const { illness } = await req.json();

  if (!illness || typeof illness !== "string") {
    return NextResponse.json({ error: "Missing illness" }, { status: 400 });
  }

  const completion = await client.chat.completions.create({
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
    messages: [
      {
        role: "system",
        content:
          "You are playing a character who lives with a specific mental health condition. " +
          "Describe your inner daily experience in first person, as if journaling or speaking candidly to a close friend. " +
          "Do NOT name the condition, disorder, or diagnosis anywhere in your response. " +
          "Do NOT use clinical terminology that directly names the condition. " +
          "Instead, describe the feelings, intrusive thoughts, behaviors, fears, and patterns you experience. " +
          "Keep the description vivid, personal, and between 150 and 200 words.",
      },
      {
        role: "user",
        content: `Describe the experience of living with ${illness}.`,
      },
    ],
    max_tokens: 350,
    temperature: 0.9,
  });

  const text = completion.choices[0]?.message?.content ?? "";
  return NextResponse.json({ text });
}
