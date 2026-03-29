import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  json,
  bigint,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────────────────────
// 1. USERS (Core auth table — extended for sponsor profile)
// ─────────────────────────────────────────────────────────────
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 2. SPONSOR PROFILES (Extended profile for sponsors)
// ─────────────────────────────────────────────────────────────
export const sponsorProfiles = mysqlTable("sponsor_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  companyNameAr: varchar("companyNameAr", { length: 255 }),
  companyNameEn: varchar("companyNameEn", { length: 255 }),
  brandName: varchar("brandName", { length: 255 }),
  contactPerson: varchar("contactPerson", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  country: varchar("country", { length: 100 }),
  city: varchar("city", { length: 100 }),
  industry: varchar("industry", { length: 100 }),
  companySize: varchar("companySize", { length: 50 }),
  marketingBudget: varchar("marketingBudget", { length: 100 }),
  targetMarket: varchar("targetMarket", { length: 255 }),
  website: varchar("website", { length: 500 }),
  linkedIn: varchar("linkedIn", { length: 500 }),
  logoUrl: varchar("logoUrl", { length: 1000 }),
  description: text("description"),
  commercialRegNo: varchar("commercialRegNo", { length: 50 }),
  vatNumber: varchar("vatNumber", { length: 50 }),
  verificationStatus: mysqlEnum("verificationStatus", [
    "pending",
    "submitted",
    "under_review",
    "verified",
    "rejected",
  ])
    .default("pending")
    .notNull(),
  kycSubmittedAt: timestamp("kycSubmittedAt"),
  kycVerifiedAt: timestamp("kycVerifiedAt"),
  kycRejectionReason: text("kycRejectionReason"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SponsorProfile = typeof sponsorProfiles.$inferSelect;
export type InsertSponsorProfile = typeof sponsorProfiles.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 3. EVENTS (Exhibitions & Conferences)
// ─────────────────────────────────────────────────────────────
export const events = mysqlTable("events", {
  id: int("id").autoincrement().primaryKey(),
  titleAr: varchar("titleAr", { length: 500 }).notNull(),
  titleEn: varchar("titleEn", { length: 500 }).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  venue: varchar("venue", { length: 255 }),
  city: varchar("city", { length: 100 }),
  country: varchar("country", { length: 100 }).default("Saudi Arabia"),
  startDate: timestamp("startDate").notNull(),
  endDate: timestamp("endDate").notNull(),
  registrationDeadline: timestamp("registrationDeadline"),
  expectedVisitors: int("expectedVisitors"),
  expectedExhibitors: int("expectedExhibitors"),
  sectors: json("sectors").$type<string[]>(),
  imageUrl: varchar("imageUrl", { length: 1000 }),
  mapUrl: varchar("mapUrl", { length: 1000 }),
  status: mysqlEnum("status", [
    "draft",
    "under_review",
    "approved",
    "active",
    "completed",
    "cancelled",
  ])
    .default("draft")
    .notNull(),
  sponsorshipEnabled: boolean("sponsorshipEnabled").default(true),
  totalSponsorSlots: int("totalSponsorSlots").default(20),
  filledSponsorSlots: int("filledSponsorSlots").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 4. SPONSOR PACKAGES (Platinum / Gold / Silver / Bronze / Custom)
// ─────────────────────────────────────────────────────────────
export const sponsorPackages = mysqlTable("sponsor_packages", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull(),
  nameAr: varchar("nameAr", { length: 255 }).notNull(),
  nameEn: varchar("nameEn", { length: 255 }).notNull(),
  tier: mysqlEnum("tier", [
    "platinum",
    "gold",
    "silver",
    "bronze",
    "custom",
  ]).notNull(),
  descriptionAr: text("descriptionAr"),
  descriptionEn: text("descriptionEn"),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  maxSponsors: int("maxSponsors").default(1),
  currentSponsors: int("currentSponsors").default(0),
  benefits: json("benefits").$type<{ ar: string[]; en: string[] }>(),
  assets: json("assets").$type<string[]>(),
  boothSizeM2: int("boothSizeM2"),
  vipTickets: int("vipTickets"),
  mediaCovarage: boolean("mediaCovarage").default(false),
  openingSpeech: boolean("openingSpeech").default(false),
  categoryExclusivity: boolean("categoryExclusivity").default(false),
  digitalPromotion: boolean("digitalPromotion").default(false),
  isActive: boolean("isActive").default(true),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SponsorPackage = typeof sponsorPackages.$inferSelect;
export type InsertSponsorPackage = typeof sponsorPackages.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 5. SPONSORSHIPS (Sponsor applications / active sponsorships)
// ─────────────────────────────────────────────────────────────
export const sponsorships = mysqlTable("sponsorships", {
  id: int("id").autoincrement().primaryKey(),
  sponsorId: int("sponsorId").notNull(), // -> users.id
  eventId: int("eventId").notNull(),
  packageId: int("packageId").notNull(),
  // Pipeline status (10 stages from Section 47)
  status: mysqlEnum("status", [
    "lead",
    "qualified",
    "proposal_sent",
    "negotiation",
    "contract_sent",
    "signed",
    "paid",
    "active",
    "completed",
    "lost",
  ])
    .default("lead")
    .notNull(),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }),
  paidAmount: decimal("paidAmount", { precision: 12, scale: 2 }).default("0"),
  notes: text("notes"),
  lostReason: text("lostReason"),
  // Performance metrics
  brandImpressions: bigint("brandImpressions", { mode: "number" }).default(0),
  leadsGenerated: int("leadsGenerated").default(0),
  estimatedRoi: decimal("estimatedRoi", { precision: 8, scale: 2 }),
  // Activation tracking
  logoPlaced: boolean("logoPlaced").default(false),
  boothSetup: boolean("boothSetup").default(false),
  ticketsDelivered: boolean("ticketsDelivered").default(false),
  mediaCoverageActive: boolean("mediaCoverageActive").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Sponsorship = typeof sponsorships.$inferSelect;
export type InsertSponsorship = typeof sponsorships.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 6. CONTRACTS (Digital contracts with e-signature)
// ─────────────────────────────────────────────────────────────
export const contracts = mysqlTable("contracts", {
  id: int("id").autoincrement().primaryKey(),
  sponsorshipId: int("sponsorshipId").notNull(),
  sponsorId: int("sponsorId").notNull(),
  contractNumber: varchar("contractNumber", { length: 50 }).notNull(),
  titleAr: varchar("titleAr", { length: 500 }),
  titleEn: varchar("titleEn", { length: 500 }),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  terms: json("terms").$type<{ ar: string[]; en: string[] }>(),
  status: mysqlEnum("status", [
    "draft",
    "pending_review",
    "sent",
    "signed",
    "active",
    "expired",
    "cancelled",
  ])
    .default("draft")
    .notNull(),
  signedAt: timestamp("signedAt"),
  signatureData: text("signatureData"),
  expiresAt: timestamp("expiresAt"),
  fileUrl: varchar("fileUrl", { length: 1000 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = typeof contracts.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 7. INVOICES
// ─────────────────────────────────────────────────────────────
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  sponsorshipId: int("sponsorshipId").notNull(),
  sponsorId: int("sponsorId").notNull(),
  contractId: int("contractId"),
  invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull(),
  description: text("description"),
  subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(),
  vatRate: decimal("vatRate", { precision: 5, scale: 2 }).default("15.00"),
  vatAmount: decimal("vatAmount", { precision: 12, scale: 2 }),
  totalAmount: decimal("totalAmount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  status: mysqlEnum("status", [
    "draft",
    "sent",
    "paid",
    "partially_paid",
    "overdue",
    "cancelled",
  ])
    .default("draft")
    .notNull(),
  dueDate: timestamp("dueDate"),
  paidAt: timestamp("paidAt"),
  fileUrl: varchar("fileUrl", { length: 1000 }),
  zatcaCompliant: boolean("zatcaCompliant").default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 8. PAYMENTS
// ─────────────────────────────────────────────────────────────
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  invoiceId: int("invoiceId").notNull(),
  sponsorId: int("sponsorId").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("SAR"),
  method: mysqlEnum("method", [
    "credit_card",
    "mada",
    "apple_pay",
    "bank_transfer",
    "wire",
  ]).notNull(),
  status: mysqlEnum("status", [
    "pending",
    "processing",
    "completed",
    "failed",
    "refunded",
  ])
    .default("pending")
    .notNull(),
  transactionId: varchar("transactionId", { length: 255 }),
  gatewayResponse: json("gatewayResponse"),
  paidAt: timestamp("paidAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 9. LEADS (Generated from events for sponsors)
// ─────────────────────────────────────────────────────────────
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  sponsorId: int("sponsorId").notNull(),
  eventId: int("eventId").notNull(),
  sponsorshipId: int("sponsorshipId"),
  companyName: varchar("companyName", { length: 255 }),
  contactName: varchar("contactName", { length: 255 }),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 32 }),
  industry: varchar("industry", { length: 100 }),
  interestLevel: mysqlEnum("interestLevel", ["high", "medium", "low"])
    .default("medium")
    .notNull(),
  source: varchar("source", { length: 100 }),
  notes: text("notes"),
  status: mysqlEnum("status", [
    "new",
    "contacted",
    "qualified",
    "converted",
    "lost",
  ])
    .default("new")
    .notNull(),
  score: int("score").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 10. NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  titleAr: varchar("titleAr", { length: 500 }),
  titleEn: varchar("titleEn", { length: 500 }),
  messageAr: text("messageAr"),
  messageEn: text("messageEn"),
  type: mysqlEnum("type", ["info", "success", "warning", "error", "system"])
    .default("info")
    .notNull(),
  category: varchar("category", { length: 50 }),
  relatedId: int("relatedId"),
  relatedType: varchar("relatedType", { length: 50 }),
  isRead: boolean("isRead").default(false),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 11. FILES (Brand assets, documents, etc.)
// ─────────────────────────────────────────────────────────────
export const files = mysqlTable("files", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  filename: varchar("filename", { length: 500 }).notNull(),
  mimeType: varchar("mimeType", { length: 100 }),
  sizeBytes: bigint("sizeBytes", { mode: "number" }),
  url: varchar("url", { length: 1000 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  category: varchar("category", { length: 50 }),
  relatedId: int("relatedId"),
  relatedType: varchar("relatedType", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type File = typeof files.$inferSelect;
export type InsertFile = typeof files.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 12. CAMPAIGNS (Marketing campaigns for sponsors)
// ─────────────────────────────────────────────────────────────
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  sponsorId: int("sponsorId").notNull(),
  sponsorshipId: int("sponsorshipId"),
  nameAr: varchar("nameAr", { length: 255 }),
  nameEn: varchar("nameEn", { length: 255 }),
  type: mysqlEnum("type", [
    "social_media",
    "email",
    "display",
    "video",
    "print",
    "activation",
  ]).notNull(),
  status: mysqlEnum("status", [
    "draft",
    "scheduled",
    "active",
    "paused",
    "completed",
  ])
    .default("draft")
    .notNull(),
  budget: decimal("budget", { precision: 12, scale: 2 }),
  spent: decimal("spent", { precision: 12, scale: 2 }).default("0"),
  impressions: bigint("impressions", { mode: "number" }).default(0),
  clicks: int("clicks").default(0),
  conversions: int("conversions").default(0),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

// ─────────────────────────────────────────────────────────────
// 13. BRAND EXPOSURE METRICS
// ─────────────────────────────────────────────────────────────
export const brandExposureMetrics = mysqlTable("brand_exposure_metrics", {
  id: int("id").autoincrement().primaryKey(),
  sponsorshipId: int("sponsorshipId").notNull(),
  sponsorId: int("sponsorId").notNull(),
  eventId: int("eventId").notNull(),
  date: timestamp("date").notNull(),
  logoImpressions: bigint("logoImpressions", { mode: "number" }).default(0),
  digitalImpressions: bigint("digitalImpressions", { mode: "number" }).default(0),
  footTraffic: int("footTraffic").default(0),
  socialMentions: int("socialMentions").default(0),
  mediaHits: int("mediaHits").default(0),
  websiteClicks: int("websiteClicks").default(0),
  qrScans: int("qrScans").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type BrandExposureMetric = typeof brandExposureMetrics.$inferSelect;
export type InsertBrandExposureMetric = typeof brandExposureMetrics.$inferInsert;

// ============================================================
// OTP Codes (shared table)
// ============================================================
export const otpCodes = mysqlTable("otp_codes", {
  id: int("id").autoincrement().primaryKey(),
  phone: varchar("phone", { length: 20 }).notNull(),
  code: varchar("code", { length: 10 }).notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  verified: int("verified").default(0),
  attempts: int("attempts").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
