import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request) {
  const { prompt } = await request.json()

  if (!prompt || !prompt.trim()) {
    return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt.trim(),
            },
          ],
        },
      ],
    })

    const imageUrl = response.choices?.[0]?.message?.content?.[0]?.image_url?.url

    if (!imageUrl) {
      return NextResponse.json({ error: 'No image URL found' }, { status: 500 })
    }

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
