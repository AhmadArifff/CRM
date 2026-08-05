import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
      stageId: d.stageId,
      owner: d.owner?.name || 'Ahmad Ariff',
      contactPerson: d.contact?.name || 'Ir. Budi Santoso',
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

    const newDeal = await prisma.deal.create({
      data: {
        tenantId: '00000000-0000-0000-0000-000000000001',
        ownerId: '11111111-1111-1111-1111-111111111111',
        title: title || 'Proyek Baru',
        value: value || 100000000,
        stageId: stageId || '33333333-3333-3333-3333-000000000001',
        expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : new Date('2026-09-01'),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newDeal,
          company: company || 'Enterprise Client',
          value: Number(newDeal.value),
          owner: owner || 'Ahmad Ariff',
          contactPerson: contactPerson || 'Contact Lead',
          expectedCloseDate: newDeal.expectedCloseDate
            ? newDeal.expectedCloseDate.toISOString().split('T')[0]
            : '2026-09-01',
          createdAt: newDeal.createdAt.toISOString().split('T')[0],
        },
        message: 'Berhasil membuat deal di database Supabase',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating deal in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal membuat deal baru' } },
      { status: 400 }
    );
  }
}
