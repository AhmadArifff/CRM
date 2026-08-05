import { NextResponse } from 'next/server';
import { INITIAL_DEALS } from '../../../../../../data/mockData';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stageId } = body;

    const deal = INITIAL_DEALS.find((d) => d.id === id);
    if (deal) {
      deal.stageId = stageId;
    }

    return NextResponse.json({
      success: true,
      data: deal || { id, stageId },
      message: `Deal stage berhasil dipindahkan ke ${stageId}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal mengubah stage deal' } },
      { status: 400 }
    );
  }
}
