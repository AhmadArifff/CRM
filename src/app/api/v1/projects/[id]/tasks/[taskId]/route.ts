import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { TaskStatus } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;

    const task = await prisma.projectTask.findUnique({
      where: { id: taskId },
      include: {
        assignedRep: true,
        attachments: true,
        checklists: true,
      },
    });

    if (!task) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Task tidak ditemukan' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: task.id,
        projectId: task.projectId,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedRep?.name || 'Ahmad Ariff',
        dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : '2026-08-30',
        coverImage: task.coverImage || '',
        tagText: task.tagText || 'Feature',
        tagColor: task.tagColor || 'bg-[#C9372C]',
        isWatched: task.isWatched,
        isOverdue: task.isOverdue,
        createdAt: task.createdAt.toISOString().split('T')[0],
        attachments: task.attachments.map((a) => ({
          id: a.id,
          fileName: a.fileName,
          fileUrl: a.fileUrl,
          fileType: a.fileType,
          fileSize: a.fileSize,
        })),
        checklists: task.checklists.map((c) => ({
          id: c.id,
          itemText: c.itemText,
          isCompleted: c.isCompleted,
        })),
      },
    });
  } catch (error) {
    console.error('Error fetching task details from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil detail task' } },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    const body = await request.json();
    const {
      title,
      description,
      status,
      priority,
      dueDate,
      coverImage,
      tagText,
      tagColor,
      isWatched,
      isOverdue,
      newChecklistItem,
      toggleChecklistId,
      newAttachment,
      deleteAttachmentId,
    } = body;

    // 1. Update basic fields if provided
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) {
      updateData.status = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].includes(status) ? status : 'TODO';
    }
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
    if (coverImage !== undefined) updateData.coverImage = coverImage;
    if (tagText !== undefined) updateData.tagText = tagText;
    if (tagColor !== undefined) updateData.tagColor = tagColor;
    if (isWatched !== undefined) updateData.isWatched = isWatched;
    if (isOverdue !== undefined) updateData.isOverdue = isOverdue;

    const updatedTask = await prisma.projectTask.update({
      where: { id: taskId },
      data: updateData,
    });

    // 2. Add checklist item if requested
    if (newChecklistItem) {
      await prisma.projectTaskChecklist.create({
        data: {
          taskId,
          itemText: newChecklistItem,
          isCompleted: false,
        },
      });
    }

    // 3. Toggle checklist item if requested
    if (toggleChecklistId) {
      const existing = await prisma.projectTaskChecklist.findUnique({
        where: { id: toggleChecklistId },
      });
      if (existing) {
        await prisma.projectTaskChecklist.update({
          where: { id: toggleChecklistId },
          data: { isCompleted: !existing.isCompleted },
        });
      }
    }

    // 4. Add attachment if requested
    if (newAttachment) {
      await prisma.projectTaskAttachment.create({
        data: {
          taskId,
          fileName: newAttachment.fileName || 'attachment.pdf',
          fileUrl: newAttachment.fileUrl,
          fileType: newAttachment.fileType || 'application/octet-stream',
          fileSize: newAttachment.fileSize || 0,
        },
      });
    }

    // 5. Delete attachment if requested
    if (deleteAttachmentId) {
      await prisma.projectTaskAttachment.delete({
        where: { id: deleteAttachmentId },
      });
    }

    // Fetch refreshed task
    const refreshed = await prisma.projectTask.findUnique({
      where: { id: taskId },
      include: {
        assignedRep: true,
        attachments: true,
        checklists: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: refreshed,
      message: 'Card Trello berhasil diperbarui di database Supabase',
    });
  } catch (error) {
    console.error('Error updating task in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal memperbarui task' } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string; taskId: string }> }
) {
  try {
    const { taskId } = await params;
    await prisma.projectTask.delete({
      where: { id: taskId },
    });

    return NextResponse.json({
      success: true,
      message: 'Card Trello berhasil dihapus dari Supabase database',
    });
  } catch (error) {
    console.error('Error deleting task from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'DELETE_FAILED', message: 'Gagal menghapus task' } },
      { status: 400 }
    );
  }
}
