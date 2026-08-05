import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const STAGE_NAME_TO_UUID: Record<string, string> = {
  QUALIFICATION: '33333333-3333-3333-3333-000000000001',
  'stage-1': '33333333-3333-3333-3333-000000000001',
  Qualification: '33333333-3333-3333-3333-000000000001',
  DISCOVERY: '33333333-3333-3333-3333-000000000002',
  'stage-2': '33333333-3333-3333-3333-000000000002',
  Discovery: '33333333-3333-3333-3333-000000000002',
  PROPOSAL: '33333333-3333-3333-3333-000000000003',
  'stage-3': '33333333-3333-3333-3333-000000000003',
  Proposal: '33333333-3333-3333-3333-000000000003',
  NEGOTIATION: '33333333-3333-3333-3333-000000000004',
  'stage-4': '33333333-3333-3333-3333-000000000004',
  Negotiation: '33333333-3333-3333-3333-000000000004',
  CLOSED_WON: '33333333-3333-3333-3333-000000000005',
  'stage-5': '33333333-3333-3333-3333-000000000005',
  'Closed Won': '33333333-3333-3333-3333-000000000005',
};

function resolveStageUuid(stageInput: string): string {
  if (!stageInput) return '33333333-3333-3333-3333-000000000001';
  if (STAGE_NAME_TO_UUID[stageInput]) {
    return STAGE_NAME_TO_UUID[stageInput];
  }
  if (stageInput.includes('-') && stageInput.length === 36) {
    return stageInput;
  }
  return '33333333-3333-3333-3333-000000000001';
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { targetStage } = body;

    const validStageUuid = resolveStageUuid(targetStage);

    const updated = await prisma.deal.update({
      where: { id },
      data: {
        stageId: validStageUuid,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updated,
        value: Number(updated.value),
      },
      message: 'Stage deal berhasil diperbarui di Supabase database (tabel: deals)',
    });
  } catch (error) {
    console.error('Error updating deal stage in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal memperbarui stage deal' } },
      { status: 400 }
    );
  }
}
