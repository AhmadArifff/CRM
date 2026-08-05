import { NextResponse } from 'next/server';
import { INITIAL_USERS } from '../../../../../data/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, role, companyName } = body;

    if (!email || !name) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Nama dan email wajib diisi' } },
        { status: 400 }
      );
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: role || 'SALES_REP',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      dealsClosedThisMonth: 0,
    };

    INITIAL_USERS.push(newUser);

    return NextResponse.json(
      {
        success: true,
        data: {
          token: 'mock-jwt-register-token-987654321',
          user: newUser,
          tenant: {
            id: `tenant-${Date.now()}`,
            name: companyName || 'PT Enterprise Indonesia',
          },
        },
        message: 'Registrasi tenant & akun admin berhasil',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal memproses registrasi' } },
      { status: 500 }
    );
  }
}
