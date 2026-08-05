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
        attachments: true,
        checklists: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = tasks.map((t) => {
      const checklistTotal = t.checklists.length;
      const checklistCompleted = t.checklists.filter((c) => c.isCompleted).length;

      return {
        id: t.id,
        projectId: t.projectId,
        title: t.title,
        description: t.description || '',
        status: t.status,
        priority: t.priority,
        assignedTo: t.assignedRep?.name || 'Ahmad Ariff',
        dueDate: t.dueDate ? t.dueDate.toISOString().split('T')[0] : '2026-08-30',
        coverImage: t.coverImage || '',
        tagText: t.tagText || 'Feature',
        tagColor: t.tagColor || 'bg-[#C9372C]',
        isWatched: t.isWatched,
        isOverdue: t.isOverdue,
        commentsCount: 1,
        attachmentsCount: t.attachments.length,
        checklistTotal,
        checklistCompleted,
        createdAt: t.createdAt.toISOString().split('T')[0],
        attachments: t.attachments.map((a) => ({
          id: a.id,
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileType: a.fileType,
          fileSize: a.fileSize,
        })),
        checklists: t.checklists.map((c) => ({
          id: c.id,
          itemText: c.itemText,
          isCompleted: c.isCompleted,
        })),
      };
    });

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
    const { title, description, status, priority, assignedTo, dueDate, coverImage, tagText, tagColor } = body;

    const validStatus: TaskStatus = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].includes(status)
      ? status
      : 'TODO';

    const newTask = await prisma.projectTask.create({
      data: {
        projectId,
        title: title || 'Task Baru',
        description: description || '',
        status: validStatus,
        priority: priority || 'MEDIUM',
        assignedTo: '11111111-1111-1111-1111-111111111111',
        dueDate: dueDate ? new Date(dueDate) : new Date('2026-08-20'),
        coverImage: coverImage || '',
        tagText: tagText || 'Feature',
        tagColor: tagColor || 'bg-blue-500',
      },
      include: {
        attachments: true,
        checklists: true,
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
          coverImage: newTask.coverImage || '',
          tagText: newTask.tagText || 'Feature',
          tagColor: newTask.tagColor || 'bg-blue-500',
          isWatched: false,
          isOverdue: false,
          commentsCount: 0,
          attachmentsCount: 0,
          checklistTotal: 0,
          checklistCompleted: 0,
          createdAt: newTask.createdAt.toISOString().split('T')[0],
          attachments: [],
          checklists: [],
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
