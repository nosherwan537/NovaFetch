import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/DB/db';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);


export async function GET(req: NextRequest) {
 const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  

  if (!userId) {
    return NextResponse.json({ error: 'Missing user_id' }, { status: 400 });
  }

  // Fetch recent search queries by user
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('search_query')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10);

  if (error || !reviews) {
    return NextResponse.json({ error: 'Failed to fetch user queries' }, { status: 500 });
  }

  const queries = reviews.map(r => r.search_query).filter(Boolean);

 if (queries.length === 0) {
  const defaultPrompt = `
    You are a tech product recommendation engine.

    Recommend 3 popular tech products for a new user. Respond in **valid JSON** only in this format:

    {
      "recommendations": [
        {
          "product": "Product Name",
          "specs": "Key specs",
          "reason": "Why it's recommended"
        }
      ]
    }

    Do not include any explanation or markdown, only valid JSON.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(defaultPrompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const json = JSON.parse(jsonMatch[0]);
      return NextResponse.json(json);
    } else {
      throw new Error('No valid JSON found');
    }
  } catch (err) {
    console.error('Gemini error (default):', err);
    return NextResponse.json({ error: 'Failed to generate default recommendations' }, { status: 500 });
  }
}


  // Create Gemini prompt
  const prompt = `
  You are a tech product recommendation engine.

  A user has searched for the following tech products:
  ${queries.map((q, i) => `${i + 1}. ${q}`).join('\n')}

  Based on their interests, recommend 3 tech products. Respond in **valid JSON** only in this format:

  {
    "recommendations": [
      {
        "product": "Product Name",
        "specs": "Key specs",
        "reason": "Why it's recommended"
      }
    ]
  }

  Do not include any explanation or markdown, only valid JSON.
  `;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const json = JSON.parse(jsonMatch[0]);
      return NextResponse.json(json);
    } else {
      throw new Error('No valid JSON found');
    }
  } catch (err) {
    console.error('Gemini error:', err);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}
