import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Supabase Cloud PostgreSQL Database with Trello Cards & Attachments...');

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

  // 6. Create Deals
  const d1 = await prisma.deal.upsert({
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

  // 7. Create Post-Sales Projects & Trello Task Cards
  const p1 = await prisma.project.upsert({
    where: { id: '88888888-8888-8888-8888-000000000001' },
    update: {},
    create: {
      id: '88888888-8888-8888-8888-000000000001',
      tenantId: tenant.id,
      dealId: d1.id,
      name: 'Project Deploy Server & SLA Telkom Data Center',
      description: 'Pengadaan, racking, serta setup OS & Kubernetes Cluster PT Telkom Indonesia',
      status: 'IN_DEVELOPMENT',
    },
  });

  // Rich Trello Tasks
  const t1 = await prisma.projectTask.upsert({
    where: { id: '99999999-9999-9999-9999-000000000001' },
    update: {},
    create: {
      id: '99999999-9999-9999-9999-000000000001',
      projectId: p1.id,
      title: 'Setting nilai konsesi bandara',
      description: 'Konfigurasi persentase tarif konsesi bandara di modul reservasi',
      status: 'REVIEW',
      priority: 'HIGH',
      assignedTo: u1.id,
      dueDate: new Date('2026-08-10'),
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      tagText: 'Reservasi',
      tagColor: 'bg-[#C9372C]',
      isWatched: true,
    },
  });

  const t2 = await prisma.projectTask.upsert({
    where: { id: '99999999-9999-9999-9999-000000000002' },
    update: {},
    create: {
      id: '99999999-9999-9999-9999-000000000002',
      projectId: p1.id,
      title: 'Kamis 30-7-2026 (tes semua proses reservasi surjaya)',
      description: 'Pengujian end-to-end booking tiket & reservasi penerbangan',
      status: 'DONE',
      priority: 'HIGH',
      assignedTo: u2.id,
      dueDate: new Date('2026-07-30'),
      coverImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80',
      tagText: 'BAST Selesai',
      tagColor: 'bg-[#C9372C]',
      isOverdue: true,
    },
  });

  // Seed Checklists for Task 1
  await prisma.projectTaskChecklist.createMany({
    data: [
      { id: 'c1111111-1111-1111-1111-000000000001', taskId: t1.id, itemText: 'Audit kelayakan pasokan listrik 3-phase', isCompleted: true },
      { id: 'c1111111-1111-1111-1111-000000000002', taskId: t1.id, itemText: 'Setup K3s Master Nodes & Worker Nodes', isCompleted: true },
      { id: 'c1111111-1111-1111-1111-000000000003', taskId: t1.id, itemText: 'Konfigurasi Load Balancer & SSL Cert', isCompleted: true },
    ],
    skipDuplicates: true,
  });

  // Seed Attachments for Task 1
  await prisma.projectTaskAttachment.createMany({
    data: [
      {
        id: 'a1111111-1111-1111-1111-000000000001',
        taskId: t1.id,
        fileName: 'spesifikasi_server_telkom.pdf',
        fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        fileType: 'application/pdf',
        fileSize: 1024500,
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Supabase Database Seeding Complete with Attachments & Checklists!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
