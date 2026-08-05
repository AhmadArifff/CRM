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

  const d2 = await prisma.deal.upsert({
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

  const p2 = await prisma.project.upsert({
    where: { id: '88888888-8888-8888-8888-000000000002' },
    update: {},
    create: {
      id: '88888888-8888-8888-8888-000000000002',
      tenantId: tenant.id,
      dealId: d2.id,
      name: 'Core Banking API Integration Project',
      description: 'Pengembangan ISO20022 Gateway & Open Banking API Connector Bank Mandiri',
      status: 'IN_DEVELOPMENT',
    },
  });

  // Tasks for Project 1 (Trello Cards)
  const p1Tasks = [
    {
      id: '99999999-9999-9999-9999-000000000001',
      title: 'Audit Hardware Rack Server & Spesifikasi PSU 2000W',
      description: 'Cek fisik dan kelayakan pasokan listrik 3-phase di Data Center BSD',
      status: 'DONE' as const,
      priority: 'HIGH' as const,
      assignedTo: u1.id,
    },
    {
      id: '99999999-9999-9999-9999-000000000002',
      title: 'Install Ubuntu Server 24.04 LTS & Setup K3s Cluster',
      description: 'Konfigurasi 5 Master Nodes dan 10 Worker Nodes K3s di cloud privat',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      assignedTo: u1.id,
    },
    {
      id: '99999999-9999-9999-9999-000000000003',
      title: 'Stress Test Benchmark CPU & RAM 256GB Under Full Load',
      description: 'Simulasi load 50,000 concurrent user requests selama 48 jam nonstop',
      status: 'REVIEW' as const,
      priority: 'MEDIUM' as const,
      assignedTo: u2.id,
    },
    {
      id: '99999999-9999-9999-9999-000000000004',
      title: 'Serah Terima Dokumen SLA Uptime 99.99% ke VP Infrastructure',
      description: 'Penandatanganan berita acara serah terima (BAST) bersama Pak Budi',
      status: 'TODO' as const,
      priority: 'HIGH' as const,
      assignedTo: u3.id,
    },
  ];

  for (const t of p1Tasks) {
    await prisma.projectTask.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        projectId: p1.id,
        title: t.title,
        description: t.description,
        status: t.status,
        priority: t.priority,
        assignedTo: t.assignedTo,
        dueDate: new Date('2026-08-15'),
      },
    });
  }

  // 8. Create Activities
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

  console.log('✅ Supabase Database Seeding Complete with Projects & Trello Tasks!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
