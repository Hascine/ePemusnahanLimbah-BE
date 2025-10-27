const {
  GolonganLimbah,
  JenisLimbahB3,
  ApprovalWorkflow,
  ApprovalWorkflowStep,
  SigningWorkflow,
  SigningWorkflowStep,
  sequelize
} = require('../../models');

const seedDatabase = async () => {
  const transaction = await sequelize.transaction();
  try {
    console.log('Starting the complete seeding process...');

    // --- 1. Seed Lookup Tables ---
    const golonganData = [
        { nama: 'Prekursor & OOT' }, { nama: 'Recall' }, { nama: 'Hormon' },
        { nama: 'Sefalosporin' }, { nama: 'Probiotik' }, { nama: 'Non Betalaktam' },
        { nama: 'Betalaktam' }, { nama: 'Limbah mikrobiologi' }, { nama: 'Sisa Analisa Lab' },
        { nama: 'Recall & Prekursor' }, { nama: 'Lain-lain' },
    ];
    await GolonganLimbah.bulkCreate(golonganData, { transaction, ignoreDuplicates: true });
    console.log('Golongan Limbah seeded successfully.');

    const jenisData = [
        { nama: 'A336-1 Bahan Baku', sifat_limbah: 'Beracun, Campuran' }, { nama: 'A336-1 Produk antara', sifat_limbah: 'Beracun, Campuran' },
        { nama: 'A336-1 Produk ruahan', sifat_limbah: 'Beracun, Campuran' }, { nama: 'A336-1 Produk setengah jadi', sifat_limbah: 'Beracun, Campuran' },
        { nama: 'A336-1 Produk jadi', sifat_limbah: 'Beracun, Campuran' }, { nama: 'A336-1 Produk kembalian', sifat_limbah: 'Beracun, Campuran' },
        { nama: 'A336-1 Bahan Kimia kadaluwarsa', sifat_limbah: 'Beracun, Campuran' }, { nama: 'A336-2 Residu proses produksi dan formulasi', sifat_limbah: 'Beracun' },
        { nama: 'A336-2 Residu Non Betalaktam', sifat_limbah: 'Beracun' }, { nama: 'B336-2 Sludge dari IPAL', sifat_limbah: 'Beracun' },
        { nama: 'A102d Aki/Baterai bekas', sifat_limbah: 'Beracun' }, { nama: 'A106d Limbah laboratorium (HPLC)', sifat_limbah: 'Beracun, Mudah Menyala' },
        { nama: 'A106d Sisa destruksi', sifat_limbah: 'Beracun, Mudah Menyala' }, { nama: 'B110d Kain Majun dan sejenisnya', sifat_limbah: 'Mudah Terbakar' },
        { nama: 'A108d Limbah terkontaminasi B3', sifat_limbah: 'Mudah Menyala' }, { nama: 'B105d Minyak Pelumas/Oli bekas', sifat_limbah: 'Beracun, Mudah Menyala' },
        { nama: 'B353-1 Cartridge', sifat_limbah: 'Beracun' }, { nama: 'B109d Filter dan Prefilter', sifat_limbah: 'Beracun, Mudah Terbakar' },
        { nama: 'B107d Lampu TL', sifat_limbah: 'Beracun, Mudah Menyala, Mudah Meledak' }, { nama: 'B107d Elektronik', sifat_limbah: 'Beracun, Mudah Menyala, Mudah Meledak' },
        { nama: 'B104d Kemasan bekas B3', sifat_limbah: 'Beracun, Mudah Menyala' }, { nama: 'Lain-lain' },
    ];
    await JenisLimbahB3.bulkCreate(jenisData, { transaction, ignoreDuplicates: true });
    console.log('Jenis Limbah B3 seeded successfully.');

    // --- 2. Seed Workflow Structures ---
    const approvalWorkflows = [
      { approval_workflow_id: 1, workflow_name: 'Precursor & OOT', is_active: true },
      { approval_workflow_id: 2, workflow_name: 'Recall', is_active: true },
      { approval_workflow_id: 3, workflow_name: 'Standard (Non Precursor/Recall)', is_active: true },
      { approval_workflow_id: 4, workflow_name: 'Recall & Precursor', is_active: true },
      { approval_workflow_id: 5, workflow_name: 'Recall (Produk Pangan)', is_active: true }
    ];
    await ApprovalWorkflow.bulkCreate(approvalWorkflows, { transaction, ignoreDuplicates: true });

    // Align approval steps with external API schema (ePengelolaan_Limbah)
    // External API uses Appr_No values: 1=Manager, 2=APJ (conditional), 3=Verifikasi Lapangan (group roles), 4=HSE Manager
    // We'll seed each workflow with these step levels so the application logic (which expects step 3 as verification)
    // works consistently whether data comes from external API or DB.
    const approvalSteps = [
      // Workflow 1 (Precursor & OOT)
      { step_id: 1, approval_workflow_id: 1, step_level: 1, step_name: 'Manager Approval', required_approvals: 1 },
      { step_id: 2, approval_workflow_id: 1, step_level: 2, step_name: 'APJ Approval', required_approvals: 1 },
      { step_id: 3, approval_workflow_id: 1, step_level: 3, step_name: 'Verifikasi Lapangan', required_approvals: 4 },
      { step_id: 4, approval_workflow_id: 1, step_level: 4, step_name: 'HSE Manager', required_approvals: 1 },

      // Workflow 2 (Recall)
      { step_id: 5, approval_workflow_id: 2, step_level: 1, step_name: 'Manager Approval', required_approvals: 1 },
      { step_id: 6, approval_workflow_id: 2, step_level: 2, step_name: 'APJ Approval', required_approvals: 1 },
      { step_id: 7, approval_workflow_id: 2, step_level: 3, step_name: 'Verifikasi Lapangan', required_approvals: 4 },
      { step_id: 8, approval_workflow_id: 2, step_level: 4, step_name: 'HSE Manager', required_approvals: 1 },

      // Workflow 3 (Standard)
      { step_id: 9, approval_workflow_id: 3, step_level: 1, step_name: 'Manager Approval', required_approvals: 1 },
      { step_id: 10, approval_workflow_id: 3, step_level: 3, step_name: 'Verifikasi Lapangan', required_approvals: 4 },
      { step_id: 11, approval_workflow_id: 3, step_level: 4, step_name: 'HSE Manager', required_approvals: 1 },

      // Workflow 4 (Recall & Precursor)
      { step_id: 12, approval_workflow_id: 4, step_level: 1, step_name: 'Manager Approval', required_approvals: 1 },
      { step_id: 13, approval_workflow_id: 4, step_level: 2, step_name: 'APJ Approval', required_approvals: 2 },
      { step_id: 14, approval_workflow_id: 4, step_level: 3, step_name: 'Verifikasi Lapangan', required_approvals: 4 },
      { step_id: 15, approval_workflow_id: 4, step_level: 4, step_name: 'HSE Manager', required_approvals: 1 },

      // Workflow 5 (Recall - Produk Pangan)
      { step_id: 16, approval_workflow_id: 5, step_level: 1, step_name: 'Manager Approval', required_approvals: 1 },
      { step_id: 17, approval_workflow_id: 5, step_level: 2, step_name: 'APJ Approval', required_approvals: 2 },
      { step_id: 18, approval_workflow_id: 5, step_level: 3, step_name: 'Verifikasi Lapangan', required_approvals: 4 },
      { step_id: 21, approval_workflow_id: 5, step_level: 4, step_name: 'HSE Manager', required_approvals: 1 }
    ];
    await ApprovalWorkflowStep.bulkCreate(approvalSteps, { transaction, ignoreDuplicates: true });
    console.log('Approval workflows seeded successfully.');
    
    const signingWorkflows = [
      { signing_workflow_id: 1, workflow_name: 'Precursor & OOT', is_active: true },
      { signing_workflow_id: 2, workflow_name: 'Recall', is_active: true },
      { signing_workflow_id: 3, workflow_name: 'Standard', is_active: true },
      { signing_workflow_id: 4, workflow_name: 'Recall & Precursor', is_active: true },
      { signing_workflow_id: 5, workflow_name: 'Recall (Produk Pangan)', is_active: true }
    ];
    await SigningWorkflow.bulkCreate(signingWorkflows, { transaction, ignoreDuplicates: true });

    // Align signing steps with external API schema (ePengelolaan_Limbah_Berita_Acara)
    // External API uses Appr_No ordering (1..4) for berita acara signers. We'll seed signing steps per signing workflow
    // using the same step_level numbers so signing logic can map external items to DB steps predictably.
    // Following approval workflow concept: APJ step (step_level 3) shows all 3 APJ positions with conditional requirements
    const signingSteps = [
      // Signing Workflow 1 (Precursor & OOT)
      { step_id: 1, signing_workflow_id: 1, step_level: 2, step_name: 'HSE Manager Signature', required_signatures: 1 },
      { step_id: 2, signing_workflow_id: 1, step_level: 3, step_name: 'APJ Signature', required_signatures: 1 },
      { step_id: 3, signing_workflow_id: 1, step_level: 4, step_name: 'Head of Plant Signature', required_signatures: 1 },

      // Signing Workflow 2 (Recall)
      { step_id: 4, signing_workflow_id: 2, step_level: 2, step_name: 'HSE Manager Signature', required_signatures: 1 },
      { step_id: 5, signing_workflow_id: 2, step_level: 3, step_name: 'APJ Signature', required_signatures: 1 },
      { step_id: 6, signing_workflow_id: 2, step_level: 4, step_name: 'Head of Plant Signature', required_signatures: 1 },

      // Signing Workflow 3 (Standard)
      { step_id: 7, signing_workflow_id: 3, step_level: 2, step_name: 'HSE Manager Signature', required_signatures: 1 },
      { step_id: 8, signing_workflow_id: 3, step_level: 3, step_name: 'Department Manager Signature', required_signatures: 1 },

      // Signing Workflow 4 (Recall & Precursor)
      { step_id: 9, signing_workflow_id: 4, step_level: 2, step_name: 'HSE Manager Signature', required_signatures: 1 },
      { step_id: 10, signing_workflow_id: 4, step_level: 3, step_name: 'APJ Signature', required_signatures: 2 },
      { step_id: 11, signing_workflow_id: 4, step_level: 4, step_name: 'Head of Plant Signature', required_signatures: 1 },

      // Signing Workflow 5 (Recall - Produk Pangan)
      { step_id: 12, signing_workflow_id: 5, step_level: 2, step_name: 'HSE Manager Signature', required_signatures: 1 },
      { step_id: 13, signing_workflow_id: 5, step_level: 3, step_name: 'APJ Signature', required_signatures: 2 },
      { step_id: 14, signing_workflow_id: 5, step_level: 4, step_name: 'Head of Plant Signature', required_signatures: 1 }
    ];
    await SigningWorkflowStep.bulkCreate(signingSteps, { transaction, ignoreDuplicates: true });
    console.log('Signing workflows seeded successfully.');

    await transaction.commit();
    console.log('Database seeding completed successfully.');
  } catch (error) {
    await transaction.rollback();
    console.error('Failed to seed database:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

seedDatabase();