import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getUserByEmail, createUser, generateId } from '@/lib/db';
import { User } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const existingUser = getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user: User = {
      id: generateId(),
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      isAdmin: false,
      subscriptionTier: 'free',
      subscriptionExpiry: null,
      createdAt: new Date().toISOString(),
    };

    createUser(user);

    return NextResponse.json(
      { message: 'Account created successfully', userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
