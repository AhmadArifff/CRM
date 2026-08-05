import { NextResponse } from 'next/server';
import { INITIAL_ACTIVITIES } from '../../../../data/mockData';
import { Activity } from '../../../../types/crm';

let activitiesStore: Activity[] = [...INITIAL_ACTIVITIES];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: activitiesStore,
    meta: {
      total: activitiesStore.length,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newActivity: Activity = {
      ...body,
      id: `act-${Date.now()}`,
    };
    activitiesStore = [newActivity, ...activitiesStore];

    return NextResponse.json(
      {
        success: true,
        data: newActivity,
        message: 'Aktivitas berhasil dicatat',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal mencatat aktivitas' } },
      { status: 400 }
    );
  }
}
