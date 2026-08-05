import { NextResponse } from 'next/server';
import { INITIAL_DEALS } from '../../../../data/mockData';
import { Deal } from '../../../../types/crm';

let dealsStore: Deal[] = [...INITIAL_DEALS];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: dealsStore,
    meta: {
      total: dealsStore.length,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newDeal: Deal = {
      ...body,
      id: `deal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    dealsStore = [newDeal, ...dealsStore];

    return NextResponse.json(
      {
        success: true,
        data: newDeal,
        message: 'Deal transaksi berhasil dibuat',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal membuat deal' } },
      { status: 400 }
    );
  }
}
