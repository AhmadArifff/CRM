import { NextResponse } from 'next/server';
import { INITIAL_CONTACTS } from '../../../../data/mockData';
import { Contact } from '../../../../types/crm';

let contactsStore: Contact[] = [...INITIAL_CONTACTS];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: contactsStore,
    meta: {
      total: contactsStore.length,
      page: 1,
      limit: 50,
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newContact: Contact = {
      ...body,
      id: `cnt-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      notesCount: 0,
    };
    contactsStore = [newContact, ...contactsStore];

    return NextResponse.json(
      {
        success: true,
        data: newContact,
        message: 'Contact lead berhasil dibuat',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'CREATE_FAILED', message: 'Gagal membuat contact' } },
      { status: 400 }
    );
  }
}
