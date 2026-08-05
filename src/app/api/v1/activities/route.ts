import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      include: {
        contact: true,
        user: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = activities.map((a) => ({
      id: a.id,
      type: a.type,
      subject: a.subject,
      contactName: a.contact?.name || 'Ir. Budi Santoso',
      assignedTo: a.user?.name || 'Ahmad Ariff',
      dueDate: a.dueDate.toISOString().split('T')[0],
      isCompleted: a.isCompleted,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching activities from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data activities dari database' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, subject, contactName, assignedTo, dueDate } = body;

    const newActivity = await prisma.activity.create({
      data: {
        tenantId: '00000000-0000-0000-0000-000000000001',
        userId: '11111111-1111-1111-1111-111111111111',
        type: type || 'TASK',
        subject: subject || 'Log Task Baru',
        description: 'Aktivitas tugas sales CRM baru',
        dueDate: dueDate ? new Date(dueDate) : new Date('2026-08-10'),
        isCompleted: false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newActivity.id,
          type: newActivity.type,
          subject: newActivity.subject,
          contactName: contactName || 'Ir. Budi Santoso',
          assignedTo: assignedTo || 'Ahmad Ariff',
          dueDate: newActivity.dueDate.toISOString().split('T')[0],
          isCompleted: newActivity.isCompleted,
        },
        message: 'Aktivitas baru berhasil disimpan ke Supabase database',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating activity in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal membuat aktivitas baru' } },
      { status: 400 }
    );
  }
}
