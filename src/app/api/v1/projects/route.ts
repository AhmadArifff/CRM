import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        deal: {
          include: {
            company: true,
          },
        },
        tasks: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = projects.map((p) => {
      const totalTasks = p.tasks.length;
      const completedTasks = p.tasks.filter((t) => t.status === 'DONE').length;
      const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: p.id,
        name: p.name,
        description: p.description,
        status: p.status,
        companyName: p.deal?.company?.name || 'Enterprise Client',
        dealTitle: p.deal?.title || 'Closed Deal',
        totalTasks,
        completedTasks,
        progressPct,
        createdAt: p.createdAt.toISOString().split('T')[0],
      };
    });

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching projects from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data proyek' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, dealId } = body;

    const newProject = await prisma.project.create({
      data: {
        tenantId: '00000000-0000-0000-0000-000000000001',
        name: name || 'Proyek Development Baru',
        description: description || 'Proyek tahap implementasi & development',
        dealId: dealId && dealId.includes('-') ? dealId : undefined,
        status: 'IN_DEVELOPMENT',
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newProject.id,
          name: newProject.name,
          description: newProject.description,
          status: newProject.status,
          companyName: 'Enterprise Client',
          dealTitle: 'Development Project',
          totalTasks: 0,
          completedTasks: 0,
          progressPct: 0,
          createdAt: newProject.createdAt.toISOString().split('T')[0],
        },
        message: 'Proyek baru berhasil disimpan ke database Supabase',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal membuat proyek baru' } },
      { status: 400 }
    );
  }
}
