// SimplifyPDF Core TypeScript Types & DTOs

export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  PRO = 'PRO',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum ToolType {
  COMPRESS = 'COMPRESS',
  MERGE = 'MERGE',
  SPLIT = 'SPLIT',
  WORD_TO_PDF = 'WORD_TO_PDF',
  PDF_TO_WORD = 'PDF_TO_WORD',
  PDF_TO_IMAGES = 'PDF_TO_IMAGES',
  IMAGES_TO_PDF = 'IMAGES_TO_PDF',
  PROTECT = 'PROTECT',
  UNLOCK = 'UNLOCK',
  OCR = 'OCR',
  ESIGN = 'ESIGN',
  REDACT = 'REDACT',
  FLATTEN = 'FLATTEN',
  CROP = 'CROP',
  WATERMARK = 'WATERMARK',
}

export enum JobStatus {
  QUEUED = 'QUEUED',
  SCANNING = 'SCANNING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface PlanLimits {
  name: string;
  slug: 'FREE' | 'PRO';
  maxFileSizeMb: number;
  dailyTasks: number;
  batchLimit: number;
  retentionHours: number;
  ocrPageAllowance: number;
  priceInrMonthly: number;
  priceInrYearly: number;
  priceUsdMonthly: number;
  priceUsdYearly: number;
}

export interface DesignTokens {
  primaryColor: string; // Defaults to Nuvexa Violet #864FFE
  primaryHover: string; // #6D1FE2
  secondaryColor: string; // Nuvexa Near-black #1A1A1C
  inkColor: string; // #11141D
  accentLime: string; // #C6F56F
  accentCyan: string; // #83E7EE
  accentYellow: string; // #F9EB57
  paperLight: string; // #FAF9F7
  backgroundDark: string; // #0B0B10
  cardDark: string; // #19191F
  borderRadius: string; // e.g. '14px' or '9999px'
  fontHeading: string; // 'Inter Tight'
  fontBody: string; // 'Inter'
  buttonStyle: 'btn-v6-roll' | 'nextsaas-slide' | 'pill-solid';
}

export interface JobProgressEvent {
  jobId: string;
  step: 'UPLOADING' | 'SCANNING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  percent: number;
  detail: string;
  outputDownloadUrl?: string;
  errorReason?: string;
}

export interface HeaderConfig {
  logoText: string;
  logoUrl?: string;
  navItems: Array<{
    label: string;
    url: string;
    badge?: string;
    target?: '_self' | '_blank';
    children?: Array<{ label: string; url: string; description?: string }>;
  }>;
  ctaText: string;
  ctaUrl: string;
  isPublished: boolean;
}

export interface FooterConfig {
  columns: Array<{
    title: string;
    links: Array<{ label: string; url: string }>;
  }>;
  copyrightText: string;
  socialLinks: Array<{ platform: string; url: string }>;
  isPublished: boolean;
}

export interface NotificationBarConfig {
  id: string;
  message: string;
  ctaText?: string;
  ctaUrl?: string;
  bgColor?: string;
  isActive: boolean;
  startAt?: string;
  endAt?: string;
}

export * from './env';
