import { and, desc, eq, gte, lte, sql, like, or, inArray, count, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  sponsorProfiles,
  events,
  sponsorPackages,
  sponsorships,
  contracts,
  invoices,
  payments,
  leads,
  notifications,
  files,
  campaigns,
  brandExposureMetrics,
  type InsertSponsorProfile,
  type InsertSponsorship,
  type InsertContract,
  type InsertInvoice,
  type InsertPayment,
  type InsertLead,
  type InsertNotification,
  type InsertFile,
  type InsertCampaign,
  type InsertBrandExposureMetric,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ─────────────────────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────────────────────
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};

  const textFields = ["name", "email", "loginMethod"] as const;
  type TextField = (typeof textFields)[number];
  const assignNullable = (field: TextField) => {
    const value = user[field];
    if (value === undefined) return;
    const normalized = value ?? null;
    values[field] = normalized;
    updateSet[field] = normalized;
  };
  textFields.forEach(assignNullable);

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }
  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ─────────────────────────────────────────────────────────────
// SPONSOR PROFILES
// ─────────────────────────────────────────────────────────────
export async function getSponsorProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, userId)).limit(1);
  return rows[0] ?? null;
}

export async function upsertSponsorProfile(data: InsertSponsorProfile) {
  const db = await getDb();
  if (!db) return null;
  const existing = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, data.userId)).limit(1);
  if (existing.length > 0) {
    await db.update(sponsorProfiles).set(data).where(eq(sponsorProfiles.userId, data.userId));
    const updated = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, data.userId)).limit(1);
    return updated[0];
  }
  const result = await db.insert(sponsorProfiles).values(data);
  const inserted = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.id, result[0].insertId)).limit(1);
  return inserted[0];
}

// ─────────────────────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────────────────────
export async function listEvents(opts?: { status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.status) conditions.push(eq(events.status, opts.status as any));
  const query = db.select().from(events);
  if (conditions.length > 0) {
    return query.where(and(...conditions)).orderBy(desc(events.startDate)).limit(opts?.limit ?? 50).offset(opts?.offset ?? 0);
  }
  return query.orderBy(desc(events.startDate)).limit(opts?.limit ?? 50).offset(opts?.offset ?? 0);
}

export async function getEventById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getActiveEventsCount() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ count: count() }).from(events).where(eq(events.status, "active"));
  return rows[0]?.count ?? 0;
}

// ─────────────────────────────────────────────────────────────
// SPONSOR PACKAGES
// ─────────────────────────────────────────────────────────────
export async function listPackagesByEvent(eventId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(sponsorPackages).where(and(eq(sponsorPackages.eventId, eventId), eq(sponsorPackages.isActive, true))).orderBy(sponsorPackages.sortOrder);
}

export async function getPackageById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(sponsorPackages).where(eq(sponsorPackages.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function listAllPackages(opts?: { tier?: string; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(sponsorPackages.isActive, true)];
  if (opts?.tier) conditions.push(eq(sponsorPackages.tier, opts.tier as any));
  return db.select().from(sponsorPackages).where(and(...conditions)).orderBy(sponsorPackages.sortOrder).limit(opts?.limit ?? 100);
}

// ─────────────────────────────────────────────────────────────
// SPONSORSHIPS
// ─────────────────────────────────────────────────────────────
export async function listSponsorships(sponsorId: number, opts?: { status?: string; eventId?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(sponsorships.sponsorId, sponsorId)];
  if (opts?.status) conditions.push(eq(sponsorships.status, opts.status as any));
  if (opts?.eventId) conditions.push(eq(sponsorships.eventId, opts.eventId));
  return db.select().from(sponsorships).where(and(...conditions)).orderBy(desc(sponsorships.createdAt));
}

export async function getSponsorshipById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(sponsorships).where(eq(sponsorships.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createSponsorship(data: InsertSponsorship) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(sponsorships).values(data);
  const inserted = await db.select().from(sponsorships).where(eq(sponsorships.id, result[0].insertId)).limit(1);
  return inserted[0];
}

export async function updateSponsorshipStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return null;
  await db.update(sponsorships).set({ status: status as any }).where(eq(sponsorships.id, id));
  return getSponsorshipById(id);
}

export async function getSponsorshipStats(sponsorId: number) {
  const db = await getDb();
  if (!db) return { total: 0, active: 0, completed: 0, totalInvested: "0" };
  const all = await db.select({ count: count() }).from(sponsorships).where(eq(sponsorships.sponsorId, sponsorId));
  const active = await db.select({ count: count() }).from(sponsorships).where(and(eq(sponsorships.sponsorId, sponsorId), eq(sponsorships.status, "active")));
  const completed = await db.select({ count: count() }).from(sponsorships).where(and(eq(sponsorships.sponsorId, sponsorId), eq(sponsorships.status, "completed")));
  const invested = await db.select({ total: sum(sponsorships.totalAmount) }).from(sponsorships).where(eq(sponsorships.sponsorId, sponsorId));
  return {
    total: all[0]?.count ?? 0,
    active: active[0]?.count ?? 0,
    completed: completed[0]?.count ?? 0,
    totalInvested: invested[0]?.total ?? "0",
  };
}

// ─────────────────────────────────────────────────────────────
// CONTRACTS
// ─────────────────────────────────────────────────────────────
export async function listContracts(sponsorId: number, opts?: { status?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(contracts.sponsorId, sponsorId)];
  if (opts?.status) conditions.push(eq(contracts.status, opts.status as any));
  return db.select().from(contracts).where(and(...conditions)).orderBy(desc(contracts.createdAt));
}

export async function getContractById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(contracts).where(eq(contracts.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createContract(data: InsertContract) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(contracts).values(data);
  const inserted = await db.select().from(contracts).where(eq(contracts.id, result[0].insertId)).limit(1);
  return inserted[0];
}

export async function updateContractStatus(id: number, status: string, signatureData?: string) {
  const db = await getDb();
  if (!db) return null;
  const updateData: Record<string, any> = { status: status as any };
  if (status === "signed") {
    updateData.signedAt = new Date();
    if (signatureData) updateData.signatureData = signatureData;
  }
  await db.update(contracts).set(updateData).where(eq(contracts.id, id));
  return getContractById(id);
}

// ─────────────────────────────────────────────────────────────
// INVOICES
// ─────────────────────────────────────────────────────────────
export async function listInvoices(sponsorId: number, opts?: { status?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(invoices.sponsorId, sponsorId)];
  if (opts?.status) conditions.push(eq(invoices.status, opts.status as any));
  return db.select().from(invoices).where(and(...conditions)).orderBy(desc(invoices.createdAt));
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function createInvoice(data: InsertInvoice) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(invoices).values(data);
  const inserted = await db.select().from(invoices).where(eq(invoices.id, result[0].insertId)).limit(1);
  return inserted[0];
}

// ─────────────────────────────────────────────────────────────
// PAYMENTS
// ─────────────────────────────────────────────────────────────
export async function listPayments(sponsorId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.sponsorId, sponsorId)).orderBy(desc(payments.createdAt));
}

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(payments).values(data);
  const inserted = await db.select().from(payments).where(eq(payments.id, result[0].insertId)).limit(1);
  return inserted[0];
}

export async function getPaymentStats(sponsorId: number) {
  const db = await getDb();
  if (!db) return { totalPaid: "0", pendingPayments: 0 };
  const paid = await db.select({ total: sum(payments.amount) }).from(payments).where(and(eq(payments.sponsorId, sponsorId), eq(payments.status, "completed")));
  const pending = await db.select({ count: count() }).from(payments).where(and(eq(payments.sponsorId, sponsorId), eq(payments.status, "pending")));
  return {
    totalPaid: paid[0]?.total ?? "0",
    pendingPayments: pending[0]?.count ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────
// LEADS
// ─────────────────────────────────────────────────────────────
export async function listLeads(sponsorId: number, opts?: { status?: string; eventId?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(leads.sponsorId, sponsorId)];
  if (opts?.status) conditions.push(eq(leads.status, opts.status as any));
  if (opts?.eventId) conditions.push(eq(leads.eventId, opts.eventId));
  return db.select().from(leads).where(and(...conditions)).orderBy(desc(leads.createdAt));
}

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(leads).values(data);
  const inserted = await db.select().from(leads).where(eq(leads.id, result[0].insertId)).limit(1);
  return inserted[0];
}

export async function updateLeadStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) return null;
  await db.update(leads).set({ status: status as any }).where(eq(leads.id, id));
  const rows = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return rows[0] ?? null;
}

export async function getLeadStats(sponsorId: number) {
  const db = await getDb();
  if (!db) return { total: 0, newLeads: 0, qualified: 0, converted: 0 };
  const all = await db.select({ count: count() }).from(leads).where(eq(leads.sponsorId, sponsorId));
  const newL = await db.select({ count: count() }).from(leads).where(and(eq(leads.sponsorId, sponsorId), eq(leads.status, "new")));
  const qual = await db.select({ count: count() }).from(leads).where(and(eq(leads.sponsorId, sponsorId), eq(leads.status, "qualified")));
  const conv = await db.select({ count: count() }).from(leads).where(and(eq(leads.sponsorId, sponsorId), eq(leads.status, "converted")));
  return {
    total: all[0]?.count ?? 0,
    newLeads: newL[0]?.count ?? 0,
    qualified: qual[0]?.count ?? 0,
    converted: conv[0]?.count ?? 0,
  };
}

// ─────────────────────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────────────────────
export async function listNotifications(userId: number, opts?: { unreadOnly?: boolean; limit?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(notifications.userId, userId)];
  if (opts?.unreadOnly) conditions.push(eq(notifications.isRead, false));
  return db.select().from(notifications).where(and(...conditions)).orderBy(desc(notifications.createdAt)).limit(opts?.limit ?? 50);
}

export async function markNotificationRead(id: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true, readAt: new Date() }).where(eq(notifications.id, id));
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db.update(notifications).set({ isRead: true, readAt: new Date() }).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
}

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(notifications).values(data);
  return result[0].insertId;
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db.select({ count: count() }).from(notifications).where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return rows[0]?.count ?? 0;
}

// ─────────────────────────────────────────────────────────────
// CAMPAIGNS
// ─────────────────────────────────────────────────────────────
export async function listCampaigns(sponsorId: number, opts?: { status?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(campaigns.sponsorId, sponsorId)];
  if (opts?.status) conditions.push(eq(campaigns.status, opts.status as any));
  return db.select().from(campaigns).where(and(...conditions)).orderBy(desc(campaigns.createdAt));
}

export async function createCampaign(data: InsertCampaign) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(campaigns).values(data);
  const inserted = await db.select().from(campaigns).where(eq(campaigns.id, result[0].insertId)).limit(1);
  return inserted[0];
}

export async function getCampaignStats(sponsorId: number) {
  const db = await getDb();
  if (!db) return { total: 0, active: 0, totalImpressions: 0, totalClicks: 0 };
  const all = await db.select({ count: count() }).from(campaigns).where(eq(campaigns.sponsorId, sponsorId));
  const active = await db.select({ count: count() }).from(campaigns).where(and(eq(campaigns.sponsorId, sponsorId), eq(campaigns.status, "active")));
  const metrics = await db.select({ impressions: sum(campaigns.impressions), clicks: sum(campaigns.clicks) }).from(campaigns).where(eq(campaigns.sponsorId, sponsorId));
  return {
    total: all[0]?.count ?? 0,
    active: active[0]?.count ?? 0,
    totalImpressions: Number(metrics[0]?.impressions ?? 0),
    totalClicks: Number(metrics[0]?.clicks ?? 0),
  };
}

// ─────────────────────────────────────────────────────────────
// BRAND EXPOSURE
// ─────────────────────────────────────────────────────────────
export async function listBrandExposure(sponsorId: number, opts?: { eventId?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(brandExposureMetrics.sponsorId, sponsorId)];
  if (opts?.eventId) conditions.push(eq(brandExposureMetrics.eventId, opts.eventId));
  return db.select().from(brandExposureMetrics).where(and(...conditions)).orderBy(desc(brandExposureMetrics.date));
}

export async function getBrandExposureStats(sponsorId: number) {
  const db = await getDb();
  if (!db) return { totalImpressions: 0, totalFootTraffic: 0, totalSocialMentions: 0, totalWebsiteClicks: 0 };
  const metrics = await db
    .select({
      logoImpressions: sum(brandExposureMetrics.logoImpressions),
      digitalImpressions: sum(brandExposureMetrics.digitalImpressions),
      footTraffic: sum(brandExposureMetrics.footTraffic),
      socialMentions: sum(brandExposureMetrics.socialMentions),
      websiteClicks: sum(brandExposureMetrics.websiteClicks),
    })
    .from(brandExposureMetrics)
    .where(eq(brandExposureMetrics.sponsorId, sponsorId));
  return {
    totalImpressions: Number(metrics[0]?.logoImpressions ?? 0) + Number(metrics[0]?.digitalImpressions ?? 0),
    totalFootTraffic: Number(metrics[0]?.footTraffic ?? 0),
    totalSocialMentions: Number(metrics[0]?.socialMentions ?? 0),
    totalWebsiteClicks: Number(metrics[0]?.websiteClicks ?? 0),
  };
}

// ─────────────────────────────────────────────────────────────
// FILES
// ─────────────────────────────────────────────────────────────
export async function listFiles(userId: number, opts?: { category?: string }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [eq(files.userId, userId)];
  if (opts?.category) conditions.push(eq(files.category, opts.category));
  return db.select().from(files).where(and(...conditions)).orderBy(desc(files.createdAt));
}

export async function createFile(data: InsertFile) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.insert(files).values(data);
  const inserted = await db.select().from(files).where(eq(files.id, result[0].insertId)).limit(1);
  return inserted[0];
}

// ─────────────────────────────────────────────────────────────
// DASHBOARD AGGREGATES
// ─────────────────────────────────────────────────────────────
export async function getDashboardData(sponsorId: number) {
  const [sponsorStats, payStats, leadStats, campaignStats, exposureStats] = await Promise.all([
    getSponsorshipStats(sponsorId),
    getPaymentStats(sponsorId),
    getLeadStats(sponsorId),
    getCampaignStats(sponsorId),
    getBrandExposureStats(sponsorId),
  ]);

  return {
    sponsorships: sponsorStats,
    payments: payStats,
    leads: leadStats,
    campaigns: campaignStats,
    brandExposure: exposureStats,
  };
}
