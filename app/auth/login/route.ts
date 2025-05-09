import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET!;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Assuming you have a way to authenticate the user locally (e.g., check password)
    // For now, let's simulate this process with a dummy user validation.
    const user = await authenticateUser(email, password);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    // If user exists, generate a JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1h' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username || email.split('@')[0],
        email: user.email
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Dummy function to simulate user authentication (replace with real logic)
async function authenticateUser(email: string, password: string) {
  // This function should return the user object if authentication is successful
  // For example, check against a database or local store
  const dummyUser = {
    id: '123',
    email: 'test@example.com',
    password: 'password123', // hashed password should be used in real apps
    username: 'testuser'
  };

  // Here, we simulate a password match, but in production, you should hash the password and compare
  if (email === dummyUser.email && password === dummyUser.password) {
    return dummyUser;
  }
  
  return null;
}
  