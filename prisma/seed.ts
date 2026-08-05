import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Supabase Cloud PostgreSQL Database...');

  // 1. Create Default Tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'PT Enterprise Indonesia',
      domain: 'enterprise-id.com',
      plan: 'GROWTH',
    },
  });

  // 2. Create Core Users
  const u1 = await prisma.user.upsert({
    where: { id: '11111111-1111-1111-1111-111111111111' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-111111111111',
      tenantId: tenant.id,
      name: 'Ahmad Ariff',
      email: 'ahmad@enterprise.co.id',
      passwordHash: '$2a$10$hashedpasswordstringforsecurity1234567890',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  });

  const u2 = await prisma.user.upsert({
    where: { id: '11111111-1111-1111-1111-222222222222' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-222222222222',
      tenantId: tenant.id,
      name: 'Siti Nurhaliza',
      email: 'siti@enterprise.co.id',
      passwordHash: '$2a$10$hashedpasswordstringforsecurity1234567890',
      role: 'MANAGER',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    },
  });

  const u3 = await prisma.user.upsert({
    where: { id: '11111111-1111-1111-1111-333333333333' },
    update: {},
    create: {
      id: '11111111-1111-1111-1111-333333333333',
      tenantId: tenant.id,
      name: 'Rudi Hermawan',
      email: 'rudi@enterprise.co.id',
      passwordHash: '$2a$10$hashedpasswordstringforsecurity1234567890',
      role: 'SALES_REP',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
  });

  // 3. Create Pipeline & Stages
  const pipeline = await prisma.pipeline.upsert({
    where: { id: '22222222-2222-2222-2222-111111111111' },
    update: {},
    create: {
      id: '22222222-2222-2222-2222-111111111111',
      tenantId: tenant.id,
      name: 'Standard B2B Sales Pipeline',
    },
  });

  const stages = [
    { id: '33333333-3333-3333-3333-000000000001', name: 'Qualification', order: 1, color: '#6366f1' },
    { id: '33333333-3333-3333-3333-000000000002', name: 'Discovery', order: 2, color: '#a855f7' },
    { id: '33333333-3333-3333-3333-000000000003', name: 'Proposal', order: 3, color: '#ec4899' },
    { id: '33333333-3333-3333-3333-000000000004', name: 'Negotiation', order: 4, color: '#f59e0b' },
    { id: '33333333-3333-3333-3333-000000000005', name: 'Closed Won', order: 5, color: '#10b981' },
  ];

  for (const s of stages) {
    await prisma.pipelineStage.upsert({
      where: { id: s.id },
      update: {},
      create: {
        id: s.id,
        pipelineId: pipeline.id,
        name: s.name,
        stageOrder: s.order,
        color: s.color,
      },
    });
  }

  // 4. Create Companies
  const c1 = await prisma.company.upsert({
    where: { id: '44444444-4444-4444-4444-000000000001' },
    update: {},
    create: {
      id: '44444444-4444-4444-4444-000000000001',
      tenantId: tenant.id,
      name: 'PT Telkom Indonesia',
      industry: 'Telecommunications',
      domain: 'telkom.co.id',
    },
  });

  const c2 = await prisma.company.upsert({
    where: { id: '44444444-4444-4444-4444-000000000002' },
    update: {},
    create: {
      id: '44444444-4444-4444-4444-000000000002',
      tenantId: tenant.id,
      name: 'Bank Mandiri',
      industry: 'Banking & Financial Services',
      domain: 'bankmandiri.co.id',
    },
  });

  const c3 = await prisma.company.upsert({
    where: { id: '44444444-4444-4444-4444-000000000003' },
    update: {},
    create: {
      id: '44444444-4444-4444-4444-000000000003',
      tenantId: tenant.id,
      name: 'Shopee Indonesia',
      industry: 'E-Commerce',
      domain: 'shopee.co.id',
    },
  });

  // 5. Create Contacts / Leads
  const cnt1 = await prisma.contact.upsert({
    where: { id: '55555555-5555-5555-5555-000000000001' },
    update: {},
    create: {
      id: '55555555-5555-5555-5555-000000000001',
      tenantId: tenant.id,
      companyId: c1.id,
      assignedTo: u1.id,
      name: 'Ir. Budi Santoso',
      email: 'budi.santoso@telkom.co.id',
      phone: '+62 812-3456-7890',
      role: 'VP Infrastructure',
      status: 'QUALIFIED',
      value: 750000000,
    },
  });

  const cnt2 = await prisma.contact.upsert({
    where: { id: '55555555-5555-5555-5555-000000000002' },
    update: {},
    create: {
      id: '55555555-5555-5555-5555-000000000002',
      tenantId: tenant.id,
      companyId: c2.id,
      assignedTo: u2.id,
      name: 'Dewi Lestari',
      email: 'dewi.lestari@bankmandiri.co.id',
      phone: '+62 811-9876-5432',
      role: 'Head of Enterprise IT',
      status: 'CONTACTED',
      value: 1200000000,
    },
  });

  const cnt3 = await prisma.contact.upsert({
    where: { id: '55555555-5555-5555-5555-000000000003' },
    update: {},
    create: {
      id: '55555555-5555-5555-5555-000000000003',
      tenantId: tenant.id,
      companyId: c3.id,
      assignedTo: u3.id,
      name: 'Bambang Wijaya',
      email: 'bambang.w@shopee.com',
      phone: '+62 813-1122-3344',
      role: 'Procurement Manager',
      status: 'NEW',
      value: 450000000,
    },
  });

  // 6. Create Deals
  await prisma.deal.upsert({
    where: { id: '66666666-6666-6666-6666-000000000001' },
    update: {},
    create: {
      id: '66666666-6666-6666-6666-000000000001',
      tenantId: tenant.id,
      stageId: '33333333-3333-3333-3333-000000000004',
      companyId: c1.id,
      contactId: cnt1.id,
      ownerId: u1.id,
      title: 'Pengadaan Server Data Center PT Telkom',
      value: 750000000,
      expectedCloseDate: new Date('2026-08-30'),
    },
  });

  await prisma.deal.upsert({
    where: { id: '66666666-6666-6666-6666-000000000002' },
    update: {},
    create: {
      id: '66666666-6666-6666-6666-000000000002',
      tenantId: tenant.id,
      stageId: '33333333-3333-3333-3333-000000000003',
      companyId: c2.id,
      contactId: cnt2.id,
      ownerId: u2.id,
      title: 'Implementasi Core Banking System',
      value: 1200000000,
      expectedCloseDate: new Date('2026-09-15'),
    },
  });

  await prisma.deal.upsert({
    where: { id: '66666666-6666-6666-6666-000000000003' },
    update: {},
    create: {
      id: '66666666-6666-6666-6666-000000000003',
      tenantId: tenant.id,
      stageId: '33333333-3333-3333-3333-000000000001',
      companyId: c3.id,
      contactId: cnt3.id,
      ownerId: u3.id,
      title: 'Enterprise Cloud Migration Shopee',
      value: 450000000,
      expectedCloseDate: new Date('2026-10-01'),
    },
  });

  await prisma.deal.upsert({
    where: { id: '66666666-6666-6666-6666-000000000004' },
    update: {},
    create: {
      id: '66666666-6666-6666-6666-000000000004',
      tenantId: tenant.id,
      stageId: '33333333-3333-3333-3333-000000000005',
      companyId: c1.id,
      contactId: cnt1.id,
      ownerId: u1.id,
      title: 'Lisensi Software CRM 500 User',
      value: 350000000,
      expectedCloseDate: new Date('2026-07-28'),
    },
  });

  // 7. Create Activities
  await prisma.activity.upsert({
    where: { id: '77777777-7777-7777-7777-000000000001' },
    update: {},
    create: {
      id: '77777777-7777-7777-7777-000000000001',
      tenantId: tenant.id,
      userId: u1.id,
      contactId: cnt1.id,
      type: 'MEETING',
      subject: 'Meeting Presentasi Final Proposal & SLA Server',
      description: 'Diskusi detail spesifikasi teknis dan jaminan uptime 99.99%',
      dueDate: new Date('2026-08-06'),
      isCompleted: false,
    },
  });

  await prisma.activity.upsert({
    where: { id: '77777777-7777-7777-7777-000000000002' },
    update: {},
    create: {
      id: '77777777-7777-7777-7777-000000000002',
      tenantId: tenant.id,
      userId: u2.id,
      contactId: cnt2.id,
      type: 'CALL',
      subject: 'Telepon Konfirmasi Penawaran Harga Core Banking',
      description: 'Follow-up persetujuan jajaran direksi Bank Mandiri',
      dueDate: new Date('2026-08-05'),
      isCompleted: true,
    },
  });

  await prisma.activity.upsert({
    where: { id: '77777777-7777-7777-7777-000000000003' },
    update: {},
    create: {
      id: '77777777-7777-7777-7777-000000000003',
      tenantId: tenant.id,
      userId: u3.id,
      contactId: cnt3.id,
      type: 'EMAIL',
      subject: 'Kirim Dokumen Profil Perusahaan & Portofolio Cloud',
      description: 'Mengirimkan pitch deck dan studi kasus Shopee IT Architecture',
      dueDate: new Date('2026-08-04'),
      isCompleted: true,
    },
  });

  console.log('✅ Supabase Database Seeding Complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
