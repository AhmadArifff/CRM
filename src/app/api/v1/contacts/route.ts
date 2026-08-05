import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      include: {
        company: true,
        assignedRep: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = contacts.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      company: c.company?.name || 'Enterprise Client',
      role: c.role,
      status: c.status,
      assignedTo: c.assignedRep?.name || 'Unassigned',
      value: Number(c.value),
      createdAt: c.createdAt.toISOString().split('T')[0],
      notesCount: 2,
    }));

    return NextResponse.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error('Error fetching contacts from Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Gagal mengambil data contacts dari database' } },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, role, status, assignedTo, value } = body;

    const newContact = await prisma.contact.create({
      data: {
        tenantId: '00000000-0000-0000-0000-000000000001',
        assignedTo: '11111111-1111-1111-1111-111111111111',
        name: name || 'Lead Tanpa Nama',
        email: email || 'lead@company.com',
        phone: phone || '+62 812-0000-0000',
        role: role || 'Lead',
        status: status || 'NEW',
        value: value || 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...newContact,
          company: company || 'Enterprise Client',
          assignedTo: assignedTo || 'Ahmad Ariff',
          value: Number(newContact.value),
          createdAt: newContact.createdAt.toISOString().split('T')[0],
          notesCount: 0,
        },
        message: 'Berhasil menyimpan contact ke database Supabase',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact in Supabase:', error);
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal menambah contact' } },
      { status: 400 }
    );
  }
}
