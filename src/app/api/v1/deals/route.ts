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

export async function GET() {
  try {
    const deals = await prisma.deal.findMany({
      include: {
        company: true,
        contact: true,
        owner: true,
        stage: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = deals.map((d) => ({
      id: d.id,
      title: d.title,
      company: d.company?.name || 'Enterprise Client',
      value: Number(d.value),
      stageId: d.stage?.name.toUpperCase().replace(' ', '_') || 'QUALIFICATION',
      rawStageId: d.stageId,
      owner: d.owner?.name || 'Ahmad Ariff',
      ownerName: d.owner?.name || 'Ahmad Ariff',
      ownerAvatar: d.owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      contactPerson: d.contact?.name || 'Ir. Budi Santoso',
      contactName: d.contact?.name || 'Ir. Budi Santoso',
      expectedCloseDate: d.expectedCloseDate
        ? d.expectedCloseDate.toISOString().split('T')[0]
        : '2026-08-30',
      createdAt: d.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching deals from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data deals dari database' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, company, value, stageId, owner, contactPerson, expectedCloseDate } = body;

    const validStageUuid = resolveStageUuid(stageId);

    const newDeal = await prisma.deal.create({
      data: {
        tenantId: '00000000-0000-0000-0000-000000000001',
        ownerId: '11111111-1111-1111-1111-111111111111',
        title: title || 'Proyek Baru',
        value: value || 100000000,
        stageId: validStageUuid,
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : new Date('2026-09-01'),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newDeal.id,
          title: newDeal.title,
          company: company || 'Enterprise Client',
          value: Number(newDeal.value),
          stageId: stageId || 'QUALIFICATION',
          owner: owner || 'Ahmad Ariff',
          ownerName: owner || 'Ahmad Ariff',
          ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          contactPerson: contactPerson || 'Contact Lead',
          contactName: contactPerson || 'Contact Lead',
          expectedCloseDate: newDeal.expectedCloseDate
            ? newDeal.expectedCloseDate.toISOString().split('T')[0]
            : '2026-09-01',
          createdAt: newDeal.createdAt.toISOString().split('T')[0],
        },
        message: 'Berhasil membuat deal baru di database Supabase (tabel: deals)',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deal in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal membuat deal baru di database Supabase' } },
      { status: 500 }
    );
  }
}
