import { PrismaClient, UserRole, ToolType, SectionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting SimplifyPDF database seed...');

  // 1. Seed Plans
  console.log('Seeding Plans...');
  const freePlan = await prisma.plan.upsert({
    where: { slug: 'FREE' },
    update: {},
    create: {
      name: 'Free Starter',
      slug: 'FREE',
      priceInrMonthly: 0,
      priceInrYearly: 0,
      priceUsdMonthly: 0,
      priceUsdYearly: 0,
      maxFileSizeMb: 50,
      dailyTasks: 10,
      batchLimit: 1,
      retentionHours: 2,
      ocrPageAllowance: 5,
      isDefault: true,
      isActive: true,
    },
  });

  const proPlan = await prisma.plan.upsert({
    where: { slug: 'PRO' },
    update: {},
    create: {
      name: 'SimplifyPDF Pro',
      slug: 'PRO',
      priceInrMonthly: 49900, // ₹499 / mo
      priceInrYearly: 478800, // ₹399/mo billed yearly = ₹4,788
      priceUsdMonthly: 700,   // $7 / mo
      priceUsdYearly: 6700,   // $67 / yr
      maxFileSizeMb: 2048,    // 2 GB limit!
      dailyTasks: 250,
      batchLimit: 100,
      retentionHours: 24,
      ocrPageAllowance: 500,
      isDefault: false,
      isActive: true,
    },
  });

  // 2. Seed Nuvexa Site Settings
  console.log('Seeding Nuvexa Site Settings...');
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      primaryColor: '#864FFE',
      primaryHover: '#6D1FE2',
      secondaryColor: '#1A1A1C',
      inkColor: '#11141D',
      accentLime: '#C6F56F',
      accentCyan: '#83E7EE',
      accentYellow: '#F9EB57',
      paperLight: '#FAF9F7',
      backgroundDark: '#0B0B10',
      borderRadius: '16px',
      fontHeading: 'Inter Tight',
      fontBody: 'Inter',
      logoUrl: '/brand/logo.svg',
      faviconUrl: '/brand/favicon.ico',
      announcementText: 'SimplifyPDF 2.0 is live! Process up to 2GB PDFs with Nuvexa high-speed engines.',
      isBannerActive: true,
      liveSyncVersion: 1,
    },
  });

  // 3. Seed Header Config
  console.log('Seeding Header Config...');
  await prisma.headerConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      logoText: 'SimplifyPDF',
      navItemsJson: [
        { label: 'All Tools', href: '/#tools', badge: '40+' },
        { label: 'Compress', href: '/tools/compress' },
        { label: 'Merge', href: '/tools/merge' },
        { label: 'Convert', href: '/tools/word-to-pdf' },
        { label: 'Pricing', href: '/pricing' },
      ],
      ctaText: 'Get Started',
      ctaLink: '/tools/compress',
      version: 1,
      isPublished: true,
    },
  });

  // 4. Seed Footer Config
  console.log('Seeding Footer Config...');
  await prisma.footerConfig.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      copyrightText: '© 2026 SimplifyPDF. All rights reserved. Zero telemetry. Automatic file shredding.',
      columnsJson: [
        {
          title: 'Optimize & Edit',
          links: [
            { label: 'Compress PDF', href: '/tools/compress' },
            { label: 'Merge PDF', href: '/tools/merge' },
            { label: 'Split PDF', href: '/tools/split' },
            { label: 'Organize Pages', href: '/tools/organize' },
            { label: 'Rotate PDF', href: '/tools/rotate' },
          ],
        },
        {
          title: 'Convert to PDF',
          links: [
            { label: 'Word to PDF', href: '/tools/word-to-pdf' },
            { label: 'JPG to PDF', href: '/tools/images-to-pdf' },
            { label: 'Excel to PDF', href: '/tools/excel-to-pdf' },
            { label: 'PowerPoint to PDF', href: '/tools/powerpoint-to-pdf' },
          ],
        },
        {
          title: 'Convert from PDF',
          links: [
            { label: 'PDF to Word', href: '/tools/pdf-to-word' },
            { label: 'PDF to JPG', href: '/tools/pdf-to-images' },
            { label: 'PDF to Text (OCR)', href: '/tools/ocr' },
          ],
        },
        {
          title: 'Security & Legal',
          links: [
            { label: 'Protect PDF', href: '/tools/protect' },
            { label: 'Unlock PDF', href: '/tools/unlock' },
            { label: 'Redact PDF', href: '/tools/redact' },
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
          ],
        },
      ],
      socialLinksJson: [
        { platform: 'Twitter', url: 'https://twitter.com/simplifypdf' },
        { platform: 'GitHub', url: 'https://github.com/simplifypdf' },
      ],
      version: 1,
      isPublished: true,
    },
  });

  // 5. Seed Notification Bar
  console.log('Seeding Notification Bar...');
  await prisma.notificationBar.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      message: '⚡ SimplifyPDF 2.0 is live! Process up to 2GB PDFs with Nuvexa high-speed engines.',
      ctaText: 'Upgrade to PRO',
      ctaLink: '/pricing',
      isActive: true,
      backgroundColor: '#864FFE',
      textColor: '#FFFFFF',
    },
  });

  // 6. Seed Tools Configuration
  console.log('Seeding Tool Configs...');
  const defaultTools = [
    { slug: 'compress', toolName: 'Compress PDF', category: 'OPTIMIZE', sortOrder: 1 },
    { slug: 'merge', toolName: 'Merge PDF', category: 'OPTIMIZE', sortOrder: 2 },
    { slug: 'split', toolName: 'Split PDF', category: 'OPTIMIZE', sortOrder: 3 },
    { slug: 'word-to-pdf', toolName: 'Word to PDF', category: 'CONVERT', sortOrder: 4 },
    { slug: 'pdf-to-word', toolName: 'PDF to Word', category: 'CONVERT', sortOrder: 5 },
    { slug: 'pdf-to-images', toolName: 'PDF to JPG', category: 'CONVERT', sortOrder: 6 },
    { slug: 'images-to-pdf', toolName: 'JPG to PDF', category: 'CONVERT', sortOrder: 7 },
    { slug: 'ocr', toolName: 'OCR PDF', category: 'CONVERT', sortOrder: 8 },
    { slug: 'protect', toolName: 'Protect PDF', category: 'SECURITY', sortOrder: 9 },
    { slug: 'unlock', toolName: 'Unlock PDF', category: 'SECURITY', sortOrder: 10 },
    { slug: 'redact', toolName: 'Redact PDF', category: 'SECURITY', sortOrder: 11 },
    { slug: 'esign', toolName: 'eSign PDF', category: 'SECURITY', sortOrder: 12 },
    { slug: 'organize', toolName: 'Organize PDF', category: 'EDIT', sortOrder: 13 },
    { slug: 'rotate', toolName: 'Rotate PDF', category: 'EDIT', sortOrder: 14 },
    { slug: 'flatten', toolName: 'Flatten PDF', category: 'EDIT', sortOrder: 15 },
    { slug: 'crop', toolName: 'Crop PDF', category: 'EDIT', sortOrder: 16 },
    { slug: 'watermark', toolName: 'Watermark PDF', category: 'EDIT', sortOrder: 17 },
  ];

  for (const tool of defaultTools) {
    await prisma.toolConfig.upsert({
      where: { slug: tool.slug },
      update: {},
      create: {
        slug: tool.slug,
        toolName: tool.toolName,
        category: tool.category,
        sortOrder: tool.sortOrder,
        isEnabled: true,
        isMaintenance: false,
      },
    });
  }

  // 7. Seed Default Super Admin User
  console.log('Seeding Super Admin user...');
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@simplifypdf.com' },
    update: {},
    create: {
      email: 'admin@simplifypdf.com',
      name: 'SimplifyPDF Administrator',
      role: UserRole.SUPER_ADMIN,
      // Default bcrypt/argon2 hash placeholder for 'AdminSimplify2026!'
      passwordHash: '$argon2id$v=19$m=65536,t=3,p=4$q+w+e+r+t+y$hashedadminsecretpass2026',
      emailVerified: new Date(),
    },
  });

  // 8. Seed Page Blocks for Home Page (16 Nuvexa sections)
  console.log('Seeding Home Page Blocks...');
  const homeBlocks = [
    { sectionType: SectionType.HERO, sortOrder: 1, contentJson: { title: 'Every PDF tool you will ever need, simplified.', subtitle: 'Compress, merge, convert, and sign PDF documents directly in your browser. Powered by 100% permissive open-source engines.' } },
    { sectionType: SectionType.DROPZONE, sortOrder: 2, contentJson: { title: 'Drop your files here', maxFileSizeMb: 50 } },
    { sectionType: SectionType.TRUST, sortOrder: 3, contentJson: { heading: 'Trusted by over 500,000+ engineers, students, and businesses worldwide', logos: ['Google', 'Stripe', 'Vercel', 'Meta', 'Amazon'] } },
    { sectionType: SectionType.TOOLS, sortOrder: 4, contentJson: { title: 'Popular PDF Tools', filterable: true } },
    { sectionType: SectionType.HOW_IT_WORKS, sortOrder: 5, contentJson: { title: 'How it works in 3 simple steps', steps: ['Upload document', 'Apply high-speed processing', 'Download instantly'] } },
    { sectionType: SectionType.STATS, sortOrder: 6, contentJson: { stats: [{ label: 'Files Processed', value: '14.8M+' }, { label: 'Uptime SLA', value: '99.98%' }, { label: 'Avg Speed', value: '1.2s' }] } },
    { sectionType: SectionType.COMPARISON, sortOrder: 7, contentJson: { title: 'Why SimplifyPDF beats legacy converters' } },
    { sectionType: SectionType.PRICING, sortOrder: 8, contentJson: { title: 'Transparent pricing with no sneaky auto-bills' } },
    { sectionType: SectionType.FAQ, sortOrder: 9, contentJson: { title: 'Frequently Asked Questions' } },
    { sectionType: SectionType.CTA, sortOrder: 10, contentJson: { title: 'Ready to simplify your PDF workflow?', buttonText: 'Get Started for Free' } },
  ];

  for (const block of homeBlocks) {
    await prisma.pageBlock.create({
      data: {
        pageSlug: 'home',
        sectionType: block.sectionType,
        sortOrder: block.sortOrder,
        contentJson: block.contentJson,
        isVisible: true,
      },
    });
  }

  console.log('✅ SimplifyPDF Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
