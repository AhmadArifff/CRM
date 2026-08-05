import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    const tasks = await prisma.projectTask.findMany({
      where: { projectId },
      include: {
        assignedRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = tasks.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      description: t.description || '',
      status: t.status,
      priority: t.priority,
      assignedTo: t.assignedRep?.name || 'Ahmad Ariff',
      dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : '2026-08-30',
      createdAt: t.createdAt.toISOString().split('T')[0],
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching project tasks from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data task proyek' } },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const body = await request.json();
    const { title, description, status, priority, assignedTo, dueDate } = body;

    const validStatus: TaskStatus = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].includes(status)
      ? status
      : 'TODO';

    const newTask = await prisma.projectTask.create({
      data: {
        projectId,
        title: title || 'Task Baru',
        description: description || 'Deskripsi pekerjaan tugas proyek',
        status: validStatus,
        priority: priority || 'MEDIUM',
        assignedTo: '11111111-1111-1111-1111-111111111111',
        dueDate: dueDate ? new Date(dueDate) : new Date('2026-08-20'),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newTask.id,
          projectId: newTask.projectId,
          title: newTask.title,
          description: newTask.description || '',
          status: newTask.status,
          priority: newTask.priority,
          assignedTo: assignedTo || 'Ahmad Ariff',
          dueDate: newTask.dueDate ? newTask.dueDate.toISOString().split('T')[0] : '2026-08-20',
          createdAt: newTask.createdAt.toISOString().split('T')[0],
        },
        message: 'Task Trello baru berhasil disimpan ke Supabase database',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project task in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal membuat task baru' } },
      { status: 400 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { taskId, status } = body;

    if (!taskId) {
      return NextResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: 'taskId diperlukan' } },
        { status: 400 }
      );
    }

    const validStatus: TaskStatus = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].includes(status)
      ? status
      : 'TODO';

    const updated = await prisma.projectTask.update({
      where: { id: taskId },
      data: { status: validStatus },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Status Trello task berhasil diperbarui di Supabase database',
    });
  } catch (error) {
    console.error('Error updating task status in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal memperbarui status task' } },
      { status: 400 }
    );
  }
}
