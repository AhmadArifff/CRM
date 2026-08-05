import { NextResponse } from 'next/server';
import { INITIAL_USERS } from '../../../../../data/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    const user = INITIAL_USERS.find((u) => u.email === email) || INITIAL_USERS[0];

    // Mock JWT Auth Response with HTTP Envelope
    const response = NextResponse.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token: 'mock-jwt-access-token-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user,
      },
    });

    // Set Refresh Token HTTP-Only Cookie
    response.cookies.set('refresh_token', 'mock-refresh-token-uuid-12345', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 Days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'INVALID_REQUEST', message: 'Payload login tidak valid' } },
      { status: 400 }
    );
  }
}
