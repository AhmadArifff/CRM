import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [deals, contacts, activities] = await Promise.all([
      prisma.deal.findMany({ include: { stage: true } }),
      prisma.contact.findMany(),
      prisma.activity.findMany(),
    ]);

    const totalPipelineValue = deals.reduce((acc, d) => acc + Number(d.value), 0);
    const totalLeads = contacts.length;
    const closedWonDeals = deals.filter((d) => d.stageId === '33333333-3333-3333-3333-000000000005');
    const closedWonValue = closedWonDeals.reduce((acc, d) => acc + Number(d.value), 0);
    const winRate = deals.length > 0 ? Math.round((closedWonDeals.length / deals.length) * 100) : 0;
    const completedTasks = activities.filter((a) => a.isCompleted).length;

    return NextResponse.json({
      success: true,
      data: {
        totalPipelineValue,
        totalLeads,
        closedWonValue,
        winRate,
        completedTasks,
        totalTasks: activities.length,
        dealCount: deals.length,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics summary from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal menghitung ringkasan analitik' } },
      { status: 500 }
    );
  }
}
