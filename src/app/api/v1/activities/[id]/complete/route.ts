import { NextResponse } from 'next/server';
import { INITIAL_ACTIVITIES } from '../../../../../../data/mockData';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const act = INITIAL_ACTIVITIES.find((a) => a.id === id);
    if (act) {
      act.isCompleted = !act.isCompleted;
    }

    return NextResponse.json({
      success: true,
      data: act || { id, isCompleted: true },
      message: 'Status penyelesaian task diperbarui',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal memperbarui status task' } },
      { status: 400 }
    );
  }
}
