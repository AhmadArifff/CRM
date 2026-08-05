import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const currentActivity = await prisma.activity.findUnique({ where: { id } });

    if (!currentActivity) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Aktivitas tidak ditemukan' } },
        { status: 404 }
      );
    }

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        isCompleted: !currentActivity.isCompleted,
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: `Aktivitas ditandai ${updated.isCompleted ? 'selesai' : 'belum selesai'}`,
    });
  } catch (error) {
    console.error('Error toggling activity complete state in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal memperbarui status aktivitas' } },
      { status: 400 }
    );
  }
}
