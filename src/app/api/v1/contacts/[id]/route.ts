import { NextResponse } from 'next/server';
import { INITIAL_CONTACTS } from '../../../../../data/mockData';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const contact = INITIAL_CONTACTS.find((c) => c.id === id);

  if (!contact) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Contact tidak ditemukan' } },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: contact,
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const contactIndex = INITIAL_CONTACTS.findIndex((c) => c.id === id);

    if (contactIndex === -1) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Contact tidak ditemukan' } },
        { status: 404 }
      );
    }

    INITIAL_CONTACTS[contactIndex] = {
      ...INITIAL_CONTACTS[contactIndex],
      ...body,
    };

    return NextResponse.json({
      success: true,
      data: INITIAL_CONTACTS[contactIndex],
      message: 'Data contact berhasil diperbarui',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: 'UPDATE_FAILED', message: 'Gagal memperbarui data contact' } },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const index = INITIAL_CONTACTS.findIndex((c) => c.id === id);

  if (index !== -1) {
    INITIAL_CONTACTS.splice(index, 1);
  }

  return NextResponse.json({
    success: true,
    message: 'Contact berhasil dihapus',
  });
}
