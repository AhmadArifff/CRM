import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { targetStage } = body;

    const updated = await prisma.deal.update({
      where: { id },
      data: {
        stageId: targetStage,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        value: Number(updated.value),
      },
      message: 'Stage deal berhasil diperbarui di Supabase database',
    });
  } catch (error) {
    console.error('Error updating deal stage in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal memperbarui stage deal' } },
      { status: 400 }
    );
  }
}
