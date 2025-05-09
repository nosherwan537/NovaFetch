import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/DB/supabaseServerclient'; // Ensure this points to your Supabase client
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { email, password, username } = await request.json();

    if (!email || !password || !username) {
      return NextResponse.json(
        { error: 'Missing email, password, or username' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Register the user using Supabase's built-in `signUp` method
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });

    if (authError || !authData?.user) {
      console.error('Supabase signUp error:', authError);
      return NextResponse.json(
        {
          error: 'Failed to register user',
          details: authError?.message || 'Unknown error',
        },
        { status: 400 }
      );
    }

    // Insert additional user data (username) into your Supabase `user` table
    const { error: insertError } = await supabase
      .from('user')
      .insert([
        {
          user_id: authData.user.id, // Use the Supabase user ID as a reference
          email,
          username,
        },
      ]);

    if (insertError) {
      console.error('Failed to insert user profile:', insertError);
      return NextResponse.json(
        {
          error: 'Registration failed during profile creation',
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    // Generate JWT token for the user
    const token = jwt.sign(
      { userId: authData.user.id, email: authData.user.email },
      jwtSecret,
      { expiresIn: '1h' } // Set the expiration time as needed
    );

    return NextResponse.json({
      message: 'User registered successfully. Please verify your email.',
      token,
      user: {
        id: authData.user.id,
        username,
        email,
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
