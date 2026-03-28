/**
 * Admin Router — Supervisor Panel API
 * Provides admin-only procedures for managing events, sponsorships,
 * contracts, payments, sponsors, and platform analytics.
 */
import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import {
  events,
  sponsorPackages,
  sponsorships,
  contracts,
  invoices,
  payments,
  leads,
  notifications,
  users,
  sponsorProfiles,
  campaigns,
  brandExposureMetrics,
} from "../../drizzle/schema";
import { and, count, desc, eq, gte, like, lte, or, sql, sum, ne } from "drizzle-orm";

// ─────────────────────────────────────────────────────────────
// ADMIN: Executive Dashboard
// ─────────────────────────────────────────────────────────────
const dashboardRouter = router({
  /** KPI strip — top-level metrics */
  kpis: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalRevenue: "0", activeEvents: 0, activeSponsorships: 0, pendingApprovals: 0, totalSponsors: 0, totalLeads: 0 };

    const [rev, activeEv, activeSp, pendingSp, totalSp, totalLd] = await Promise.all([
      db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, "completed")),
      db.select({ count: count() }).from(events).where(eq(events.status, "active")),
      db.select({ count: count() }).from(sponsorships).where(eq(sponsorships.status, "active")),
      db.select({ count: count() }).from(sponsorships).where(eq(sponsorships.status, "lead")),
      db.select({ count: count() }).from(users).where(eq(users.role, "user")),
      db.select({ count: count() }).from(leads),
    ]);

    return {
      totalRevenue: rev[0]?.total ?? "0",
      activeEvents: activeEv[0]?.count ?? 0,
      activeSponsorships: activeSp[0]?.count ?? 0,
      pendingApprovals: pendingSp[0]?.count ?? 0,
      totalSponsors: totalSp[0]?.count ?? 0,
      totalLeads: totalLd[0]?.count ?? 0,
    };
  }),

  /** Revenue chart data — monthly breakdown */
  revenueChart: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    try {
      const monthExpr = sql`DATE_FORMAT(${payments.paidAt}, '%Y-%m')`;
      const rows = await db
        .select({
          month: sql<string>`DATE_FORMAT(${payments.paidAt}, '%Y-%m')`.as('rev_month'),
          total: sum(payments.amount),
        })
        .from(payments)
        .where(eq(payments.status, "completed"))
        .groupBy(sql`rev_month`)
        .orderBy(sql`rev_month`);
      return rows.map((r) => ({ month: r.month ?? "", total: Number(r.total ?? 0) }));
    } catch {
      return [];
    }
  }),

  /** Smart alerts — expiring contracts, late payments, pending approvals */
  alerts: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const alerts: { type: string; titleAr: string; titleEn: string; severity: string; relatedId?: number }[] = [];

    // Pending sponsorship requests
    const pendingReqs = await db.select({ count: count() }).from(sponsorships).where(eq(sponsorships.status, "lead"));
    if ((pendingReqs[0]?.count ?? 0) > 0) {
      alerts.push({
        type: "pending_approval",
        titleAr: `${pendingReqs[0]?.count} طلب رعاية بانتظار الموافقة`,
        titleEn: `${pendingReqs[0]?.count} sponsorship requests pending approval`,
        severity: "warning",
      });
    }

    // Overdue invoices
    const overdueInv = await db.select({ count: count() }).from(invoices).where(eq(invoices.status, "overdue"));
    if ((overdueInv[0]?.count ?? 0) > 0) {
      alerts.push({
        type: "overdue_payment",
        titleAr: `${overdueInv[0]?.count} فاتورة متأخرة`,
        titleEn: `${overdueInv[0]?.count} overdue invoices`,
        severity: "error",
      });
    }

    // Contracts expiring soon (within 30 days)
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const expiringContracts = await db
      .select({ count: count() })
      .from(contracts)
      .where(and(eq(contracts.status, "active"), lte(contracts.expiresAt, thirtyDaysFromNow)));
    if ((expiringContracts[0]?.count ?? 0) > 0) {
      alerts.push({
        type: "expiring_contract",
        titleAr: `${expiringContracts[0]?.count} عقد ينتهي خلال 30 يوماً`,
        titleEn: `${expiringContracts[0]?.count} contracts expiring within 30 days`,
        severity: "warning",
      });
    }

    return alerts;
  }),

  /** Recent activity — latest sponsorship requests */
  recentActivity: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const rows = await db
      .select({
        id: sponsorships.id,
        sponsorId: sponsorships.sponsorId,
        eventId: sponsorships.eventId,
        packageId: sponsorships.packageId,
        status: sponsorships.status,
        totalAmount: sponsorships.totalAmount,
        createdAt: sponsorships.createdAt,
      })
      .from(sponsorships)
      .orderBy(desc(sponsorships.createdAt))
      .limit(10);
    return rows;
  }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Event Management
// ─────────────────────────────────────────────────────────────
const eventManagementRouter = router({
  /** List all events (with filters) */
  list: adminProcedure
    .input(z.object({ status: z.string().optional(), search: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.status) conditions.push(eq(events.status, input.status as any));
      if (input?.search) {
        conditions.push(or(like(events.titleAr, `%${input.search}%`), like(events.titleEn, `%${input.search}%`)));
      }
      const query = db.select().from(events);
      if (conditions.length > 0) {
        return query.where(and(...conditions)).orderBy(desc(events.startDate));
      }
      return query.orderBy(desc(events.startDate));
    }),

  /** Get single event with packages */
  get: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [event] = await db.select().from(events).where(eq(events.id, input.id)).limit(1);
    if (!event) return null;
    const pkgs = await db.select().from(sponsorPackages).where(eq(sponsorPackages.eventId, input.id)).orderBy(sponsorPackages.sortOrder);
    const spons = await db
      .select({ count: count() })
      .from(sponsorships)
      .where(and(eq(sponsorships.eventId, input.id), ne(sponsorships.status, "lost")));
    return { ...event, packages: pkgs, sponsorCount: spons[0]?.count ?? 0 };
  }),

  /** Create event */
  create: adminProcedure
    .input(
      z.object({
        titleAr: z.string().min(1),
        titleEn: z.string().min(1),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        venue: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        startDate: z.date(),
        endDate: z.date(),
        registrationDeadline: z.date().optional(),
        expectedVisitors: z.number().optional(),
        expectedExhibitors: z.number().optional(),
        sectors: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        status: z.string().optional(),
        totalSponsorSlots: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.insert(events).values({
        ...input,
        status: (input.status as any) ?? "draft",
      });
      const [created] = await db.select().from(events).where(eq(events.id, result[0].insertId)).limit(1);
      return created;
    }),

  /** Update event */
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        titleAr: z.string().optional(),
        titleEn: z.string().optional(),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        venue: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        registrationDeadline: z.date().optional(),
        expectedVisitors: z.number().optional(),
        expectedExhibitors: z.number().optional(),
        sectors: z.array(z.string()).optional(),
        imageUrl: z.string().optional(),
        status: z.string().optional(),
        totalSponsorSlots: z.number().optional(),
        sponsorshipEnabled: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const { id, ...data } = input;
      await db.update(events).set(data as any).where(eq(events.id, id));
      const [updated] = await db.select().from(events).where(eq(events.id, id)).limit(1);
      return updated;
    }),

  /** Update event status */
  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      await db.update(events).set({ status: input.status as any }).where(eq(events.id, input.id));
      const [updated] = await db.select().from(events).where(eq(events.id, input.id)).limit(1);
      return updated;
    }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Package Management
// ─────────────────────────────────────────────────────────────
const packageManagementRouter = router({
  /** List packages for an event */
  listByEvent: adminProcedure.input(z.object({ eventId: z.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(sponsorPackages).where(eq(sponsorPackages.eventId, input.eventId)).orderBy(sponsorPackages.sortOrder);
  }),

  /** Create package */
  create: adminProcedure
    .input(
      z.object({
        eventId: z.number(),
        nameAr: z.string().min(1),
        nameEn: z.string().min(1),
        tier: z.enum(["platinum", "gold", "silver", "bronze", "custom"]),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        price: z.string(),
        maxSponsors: z.number().optional(),
        benefits: z.object({ ar: z.array(z.string()), en: z.array(z.string()) }).optional(),
        assets: z.array(z.string()).optional(),
        boothSizeM2: z.number().optional(),
        vipTickets: z.number().optional(),
        mediaCovarage: z.boolean().optional(),
        openingSpeech: z.boolean().optional(),
        categoryExclusivity: z.boolean().optional(),
        digitalPromotion: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.insert(sponsorPackages).values(input);
      const [created] = await db.select().from(sponsorPackages).where(eq(sponsorPackages.id, result[0].insertId)).limit(1);
      return created;
    }),

  /** Update package */
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        nameAr: z.string().optional(),
        nameEn: z.string().optional(),
        tier: z.enum(["platinum", "gold", "silver", "bronze", "custom"]).optional(),
        descriptionAr: z.string().optional(),
        descriptionEn: z.string().optional(),
        price: z.string().optional(),
        maxSponsors: z.number().optional(),
        benefits: z.object({ ar: z.array(z.string()), en: z.array(z.string()) }).optional(),
        assets: z.array(z.string()).optional(),
        boothSizeM2: z.number().optional(),
        vipTickets: z.number().optional(),
        mediaCovarage: z.boolean().optional(),
        openingSpeech: z.boolean().optional(),
        categoryExclusivity: z.boolean().optional(),
        digitalPromotion: z.boolean().optional(),
        isActive: z.boolean().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const { id, ...data } = input;
      await db.update(sponsorPackages).set(data as any).where(eq(sponsorPackages.id, id));
      const [updated] = await db.select().from(sponsorPackages).where(eq(sponsorPackages.id, id)).limit(1);
      return updated;
    }),

  /** Toggle package active status */
  toggleActive: adminProcedure.input(z.object({ id: z.number(), isActive: z.boolean() })).mutation(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    await db.update(sponsorPackages).set({ isActive: input.isActive }).where(eq(sponsorPackages.id, input.id));
    const [updated] = await db.select().from(sponsorPackages).where(eq(sponsorPackages.id, input.id)).limit(1);
    return updated;
  }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Sponsorship Approvals
// ─────────────────────────────────────────────────────────────
const sponsorshipManagementRouter = router({
  /** List all sponsorships with filters */
  list: adminProcedure
    .input(z.object({ status: z.string().optional(), eventId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.status) conditions.push(eq(sponsorships.status, input.status as any));
      if (input?.eventId) conditions.push(eq(sponsorships.eventId, input.eventId));
      const query = db.select().from(sponsorships);
      if (conditions.length > 0) {
        return query.where(and(...conditions)).orderBy(desc(sponsorships.createdAt));
      }
      return query.orderBy(desc(sponsorships.createdAt));
    }),

  /** Get sponsorship detail with related data */
  get: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [sp] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.id)).limit(1);
    if (!sp) return null;

    const [event] = await db.select().from(events).where(eq(events.id, sp.eventId)).limit(1);
    const [pkg] = await db.select().from(sponsorPackages).where(eq(sponsorPackages.id, sp.packageId)).limit(1);
    const [sponsor] = await db.select().from(users).where(eq(users.id, sp.sponsorId)).limit(1);
    const [profile] = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, sp.sponsorId)).limit(1);
    const spContracts = await db.select().from(contracts).where(eq(contracts.sponsorshipId, sp.id));
    const spInvoices = await db.select().from(invoices).where(eq(invoices.sponsorshipId, sp.id));

    return {
      ...sp,
      event: event ?? null,
      package: pkg ?? null,
      sponsor: sponsor ?? null,
      sponsorProfile: profile ?? null,
      contracts: spContracts,
      invoices: spInvoices,
    };
  }),

  /** Approve sponsorship request */
  approve: adminProcedure
    .input(z.object({ id: z.number(), notes: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      await db.update(sponsorships).set({ status: "qualified", notes: input.notes ?? null }).where(eq(sponsorships.id, input.id));

      // Get sponsorship to send notification
      const [sp] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.id)).limit(1);
      if (sp) {
        await db.insert(notifications).values({
          userId: sp.sponsorId,
          titleAr: "تمت الموافقة على طلب الرعاية",
          titleEn: "Sponsorship Request Approved",
          messageAr: "تمت الموافقة على طلب الرعاية الخاص بك. يمكنك الآن متابعة إجراءات العقد والدفع.",
          messageEn: "Your sponsorship request has been approved. You can now proceed with contract and payment.",
          type: "success",
          category: "sponsorship",
          relatedId: sp.id,
          relatedType: "sponsorship",
        });
      }

      const [updated] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.id)).limit(1);
      return updated;
    }),

  /** Reject sponsorship request */
  reject: adminProcedure
    .input(z.object({ id: z.number(), reason: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      await db.update(sponsorships).set({ status: "lost", lostReason: input.reason }).where(eq(sponsorships.id, input.id));

      const [sp] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.id)).limit(1);
      if (sp) {
        await db.insert(notifications).values({
          userId: sp.sponsorId,
          titleAr: "تم رفض طلب الرعاية",
          titleEn: "Sponsorship Request Rejected",
          messageAr: `تم رفض طلب الرعاية. السبب: ${input.reason}`,
          messageEn: `Your sponsorship request was rejected. Reason: ${input.reason}`,
          type: "error",
          category: "sponsorship",
          relatedId: sp.id,
          relatedType: "sponsorship",
        });
      }

      const [updated] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.id)).limit(1);
      return updated;
    }),

  /** Update sponsorship status */
  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.string(), notes: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const updateData: Record<string, any> = { status: input.status as any };
      if (input.notes) updateData.notes = input.notes;
      await db.update(sponsorships).set(updateData).where(eq(sponsorships.id, input.id));
      const [updated] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.id)).limit(1);
      return updated;
    }),

  /** Pipeline stats */
  pipelineStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const statuses = ["lead", "qualified", "proposal_sent", "negotiation", "contract_sent", "signed", "paid", "active", "completed", "lost"];
    const results = await Promise.all(
      statuses.map(async (s) => {
        const [row] = await db.select({ count: count() }).from(sponsorships).where(eq(sponsorships.status, s as any));
        return { status: s, count: row?.count ?? 0 };
      })
    );
    return results;
  }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Contract Management
// ─────────────────────────────────────────────────────────────
const contractManagementRouter = router({
  /** List all contracts */
  list: adminProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.status) conditions.push(eq(contracts.status, input.status as any));
      const query = db.select().from(contracts);
      if (conditions.length > 0) {
        return query.where(and(...conditions)).orderBy(desc(contracts.createdAt));
      }
      return query.orderBy(desc(contracts.createdAt));
    }),

  /** Update contract status */
  updateStatus: adminProcedure
    .input(z.object({ id: z.number(), status: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      await db.update(contracts).set({ status: input.status as any }).where(eq(contracts.id, input.id));
      const [updated] = await db.select().from(contracts).where(eq(contracts.id, input.id)).limit(1);
      return updated;
    }),

  /** Generate contract for sponsorship */
  generate: adminProcedure
    .input(z.object({ sponsorshipId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [sp] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.sponsorshipId)).limit(1);
      if (!sp) return null;

      const [event] = await db.select().from(events).where(eq(events.id, sp.eventId)).limit(1);
      const [pkg] = await db.select().from(sponsorPackages).where(eq(sponsorPackages.id, sp.packageId)).limit(1);

      const contractNumber = `SP-${new Date().getFullYear()}-${String(sp.id).padStart(5, "0")}`;
      const result = await db.insert(contracts).values({
        sponsorshipId: sp.id,
        sponsorId: sp.sponsorId,
        contractNumber,
        titleAr: `عقد رعاية — ${event?.titleAr ?? ""} — ${pkg?.nameAr ?? ""}`,
        titleEn: `Sponsorship Contract — ${event?.titleEn ?? ""} — ${pkg?.nameEn ?? ""}`,
        totalAmount: sp.totalAmount ?? pkg?.price ?? "0",
        currency: "SAR",
        status: "draft",
        expiresAt: event?.endDate ?? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      });

      const [created] = await db.select().from(contracts).where(eq(contracts.id, result[0].insertId)).limit(1);

      // Update sponsorship status
      await db.update(sponsorships).set({ status: "contract_sent" }).where(eq(sponsorships.id, sp.id));

      // Notify sponsor
      await db.insert(notifications).values({
        userId: sp.sponsorId,
        titleAr: "تم إنشاء عقد الرعاية",
        titleEn: "Sponsorship Contract Generated",
        messageAr: `تم إنشاء عقد الرعاية رقم ${contractNumber}. يرجى مراجعته وتوقيعه.`,
        messageEn: `Contract ${contractNumber} has been generated. Please review and sign it.`,
        type: "info",
        category: "contract",
        relatedId: created?.id,
        relatedType: "contract",
      });

      return created;
    }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Payment & Invoice Management
// ─────────────────────────────────────────────────────────────
const paymentManagementRouter = router({
  /** List all invoices */
  invoices: adminProcedure
    .input(z.object({ status: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.status) conditions.push(eq(invoices.status, input.status as any));
      const query = db.select().from(invoices);
      if (conditions.length > 0) {
        return query.where(and(...conditions)).orderBy(desc(invoices.createdAt));
      }
      return query.orderBy(desc(invoices.createdAt));
    }),

  /** List all payments */
  payments: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }),

  /** Generate invoice for sponsorship */
  generateInvoice: adminProcedure
    .input(
      z.object({
        sponsorshipId: z.number(),
        description: z.string().optional(),
        subtotal: z.string(),
        isAdvance: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [sp] = await db.select().from(sponsorships).where(eq(sponsorships.id, input.sponsorshipId)).limit(1);
      if (!sp) return null;

      // Find contract if exists
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.sponsorshipId, sp.id))
        .limit(1);

      const subtotal = parseFloat(input.subtotal);
      const vatRate = 15;
      const vatAmount = subtotal * (vatRate / 100);
      const totalAmount = subtotal + vatAmount;

      const invoiceNumber = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;

      const result = await db.insert(invoices).values({
        sponsorshipId: sp.id,
        sponsorId: sp.sponsorId,
        contractId: contract?.id ?? null,
        invoiceNumber,
        description: input.description ?? (input.isAdvance ? "دفعة مقدمة 50%" : "المبلغ المتبقي"),
        subtotal: subtotal.toFixed(2),
        vatRate: vatRate.toFixed(2),
        vatAmount: vatAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        status: "sent",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        zatcaCompliant: true,
      });

      const [created] = await db.select().from(invoices).where(eq(invoices.id, result[0].insertId)).limit(1);

      // Notify sponsor
      await db.insert(notifications).values({
        userId: sp.sponsorId,
        titleAr: `فاتورة جديدة — ${invoiceNumber}`,
        titleEn: `New Invoice — ${invoiceNumber}`,
        messageAr: `تم إصدار فاتورة بمبلغ ${totalAmount.toFixed(2)} ر.س. يرجى المراجعة والدفع.`,
        messageEn: `Invoice issued for ${totalAmount.toFixed(2)} SAR. Please review and pay.`,
        type: "info",
        category: "payment",
        relatedId: created?.id,
        relatedType: "invoice",
      });

      return created;
    }),

  /** Mark payment as received */
  markPaid: adminProcedure
    .input(z.object({ invoiceId: z.number(), method: z.string().optional(), transactionId: z.string().optional() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const [inv] = await db.select().from(invoices).where(eq(invoices.id, input.invoiceId)).limit(1);
      if (!inv) return null;

      // Update invoice
      await db.update(invoices).set({ status: "paid", paidAt: new Date() }).where(eq(invoices.id, input.invoiceId));

      // Create payment record
      const result = await db.insert(payments).values({
        invoiceId: inv.id,
        sponsorId: inv.sponsorId,
        amount: inv.totalAmount,
        method: (input.method as any) ?? "bank_transfer",
        status: "completed",
        transactionId: input.transactionId ?? null,
        paidAt: new Date(),
      });

      // Update sponsorship paid amount
      await db
        .update(sponsorships)
        .set({
          paidAmount: sql`COALESCE(${sponsorships.paidAmount}, 0) + ${inv.totalAmount}`,
        })
        .where(eq(sponsorships.id, inv.sponsorshipId));

      // Notify sponsor
      await db.insert(notifications).values({
        userId: inv.sponsorId,
        titleAr: "تم تأكيد الدفع",
        titleEn: "Payment Confirmed",
        messageAr: `تم تأكيد دفع الفاتورة ${inv.invoiceNumber} بمبلغ ${inv.totalAmount} ر.س.`,
        messageEn: `Payment confirmed for invoice ${inv.invoiceNumber} — ${inv.totalAmount} SAR.`,
        type: "success",
        category: "payment",
        relatedId: inv.id,
        relatedType: "invoice",
      });

      return { success: true };
    }),

  /** Collection stats */
  collectionStats: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return { totalDue: "0", totalCollected: "0", totalOverdue: "0", collectionRate: 0 };

    const [due] = await db.select({ total: sum(invoices.totalAmount) }).from(invoices).where(ne(invoices.status, "cancelled"));
    const [collected] = await db.select({ total: sum(invoices.totalAmount) }).from(invoices).where(eq(invoices.status, "paid"));
    const [overdue] = await db.select({ total: sum(invoices.totalAmount) }).from(invoices).where(eq(invoices.status, "overdue"));

    const totalDue = Number(due?.total ?? 0);
    const totalCollected = Number(collected?.total ?? 0);

    return {
      totalDue: due?.total ?? "0",
      totalCollected: collected?.total ?? "0",
      totalOverdue: overdue?.total ?? "0",
      collectionRate: totalDue > 0 ? Math.round((totalCollected / totalDue) * 100) : 0,
    };
  }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Sponsor Management
// ─────────────────────────────────────────────────────────────
const sponsorManagementRouter = router({
  /** List all sponsors (users with profiles) */
  list: adminProcedure
    .input(z.object({ search: z.string().optional(), verificationStatus: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      // Get all non-admin users with their profiles
      const allUsers = await db
        .select({
          id: users.id,
          openId: users.openId,
          name: users.name,
          email: users.email,
          role: users.role,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users)
        .where(eq(users.role, "user"))
        .orderBy(desc(users.createdAt));

      // Get profiles for all users
      const profiles = await db.select().from(sponsorProfiles);
      const profileMap = new Map(profiles.map((p) => [p.userId, p]));

      let results = allUsers.map((u) => ({
        ...u,
        profile: profileMap.get(u.id) ?? null,
      }));

      // Filter by search
      if (input?.search) {
        const s = input.search.toLowerCase();
        results = results.filter(
          (r) =>
            r.name?.toLowerCase().includes(s) ||
            r.email?.toLowerCase().includes(s) ||
            r.profile?.companyNameAr?.toLowerCase().includes(s) ||
            r.profile?.companyNameEn?.toLowerCase().includes(s)
        );
      }

      // Filter by verification status
      if (input?.verificationStatus) {
        results = results.filter((r) => r.profile?.verificationStatus === input.verificationStatus);
      }

      return results;
    }),

  /** Get sponsor detail */
  get: adminProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
    const db = await getDb();
    if (!db) return null;
    const [user] = await db.select().from(users).where(eq(users.id, input.id)).limit(1);
    if (!user) return null;
    const [profile] = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, input.id)).limit(1);
    const spons = await db.select().from(sponsorships).where(eq(sponsorships.sponsorId, input.id)).orderBy(desc(sponsorships.createdAt));
    const conts = await db.select().from(contracts).where(eq(contracts.sponsorId, input.id)).orderBy(desc(contracts.createdAt));
    const invs = await db.select().from(invoices).where(eq(invoices.sponsorId, input.id)).orderBy(desc(invoices.createdAt));

    return {
      ...user,
      profile: profile ?? null,
      sponsorships: spons,
      contracts: conts,
      invoices: invs,
    };
  }),

  /** Update KYC verification status */
  updateVerification: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        status: z.enum(["pending", "submitted", "under_review", "verified", "rejected"]),
        rejectionReason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const updateData: Record<string, any> = { verificationStatus: input.status };
      if (input.status === "verified") updateData.kycVerifiedAt = new Date();
      if (input.status === "rejected" && input.rejectionReason) updateData.kycRejectionReason = input.rejectionReason;

      await db.update(sponsorProfiles).set(updateData).where(eq(sponsorProfiles.userId, input.userId));

      // Notify sponsor
      const statusMessages: Record<string, { ar: string; en: string }> = {
        verified: { ar: "تم التحقق من حسابك بنجاح", en: "Your account has been verified successfully" },
        rejected: { ar: `تم رفض التحقق: ${input.rejectionReason ?? ""}`, en: `Verification rejected: ${input.rejectionReason ?? ""}` },
        under_review: { ar: "حسابك قيد المراجعة", en: "Your account is under review" },
      };

      const msg = statusMessages[input.status];
      if (msg) {
        await db.insert(notifications).values({
          userId: input.userId,
          titleAr: msg.ar,
          titleEn: msg.en,
          messageAr: msg.ar,
          messageEn: msg.en,
          type: input.status === "verified" ? "success" : input.status === "rejected" ? "error" : "info",
          category: "kyc",
        });
      }

      const [updated] = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, input.userId)).limit(1);
      return updated;
    }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Reports & Analytics
// ─────────────────────────────────────────────────────────────
const reportsRouter = router({
  /** Event performance report */
  eventPerformance: adminProcedure
    .input(z.object({ eventId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const eventsList = input?.eventId
        ? await db.select().from(events).where(eq(events.id, input.eventId))
        : await db.select().from(events).orderBy(desc(events.startDate));

      const results = await Promise.all(
        eventsList.map(async (event) => {
          const [spCount] = await db
            .select({ count: count() })
            .from(sponsorships)
            .where(and(eq(sponsorships.eventId, event.id), ne(sponsorships.status, "lost")));
          const [revenue] = await db
            .select({ total: sum(payments.amount) })
            .from(payments)
            .innerJoin(invoices, eq(payments.invoiceId, invoices.id))
            .where(and(eq(invoices.sponsorshipId, event.id), eq(payments.status, "completed")));
          const [pkgCount] = await db
            .select({ count: count() })
            .from(sponsorPackages)
            .where(eq(sponsorPackages.eventId, event.id));
          const [leadCount] = await db
            .select({ count: count() })
            .from(leads)
            .where(eq(leads.eventId, event.id));

          return {
            eventId: event.id,
            titleAr: event.titleAr,
            titleEn: event.titleEn,
            status: event.status,
            startDate: event.startDate,
            endDate: event.endDate,
            sponsorCount: spCount?.count ?? 0,
            packageCount: pkgCount?.count ?? 0,
            leadCount: leadCount?.count ?? 0,
            revenue: Number(revenue?.total ?? 0),
            expectedVisitors: event.expectedVisitors,
            expectedExhibitors: event.expectedExhibitors,
          };
        })
      );
      return results;
    }),

  /** Sponsor performance report */
  sponsorPerformance: adminProcedure
    .input(z.object({ sponsorId: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const sponsorList = input?.sponsorId
        ? await db.select().from(users).where(eq(users.id, input.sponsorId))
        : await db.select().from(users).where(eq(users.role, "user")).orderBy(desc(users.createdAt)).limit(50);

      const results = await Promise.all(
        sponsorList.map(async (user) => {
          const [profile] = await db.select().from(sponsorProfiles).where(eq(sponsorProfiles.userId, user.id)).limit(1);
          const [spCount] = await db.select({ count: count() }).from(sponsorships).where(eq(sponsorships.sponsorId, user.id));
          const [totalSpent] = await db
            .select({ total: sum(payments.amount) })
            .from(payments)
            .where(and(eq(payments.sponsorId, user.id), eq(payments.status, "completed")));
          const [activeContracts] = await db
            .select({ count: count() })
            .from(contracts)
            .where(and(eq(contracts.sponsorId, user.id), eq(contracts.status, "active")));

          return {
            userId: user.id,
            name: user.name,
            email: user.email,
            companyNameAr: profile?.companyNameAr ?? null,
            companyNameEn: profile?.companyNameEn ?? null,
            verificationStatus: profile?.verificationStatus ?? "pending",
            totalSponsorships: spCount?.count ?? 0,
            totalSpent: Number(totalSpent?.total ?? 0),
            activeContracts: activeContracts?.count ?? 0,
            joinedAt: user.createdAt,
          };
        })
      );
      return results;
    }),

  /** Platform overview stats */
  platformOverview: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db)
      return {
        totalEvents: 0,
        totalSponsors: 0,
        totalSponsorships: 0,
        totalRevenue: "0",
        avgDealSize: "0",
        conversionRate: 0,
      };

    const [evCount] = await db.select({ count: count() }).from(events);
    const [spCount] = await db.select({ count: count() }).from(users).where(eq(users.role, "user"));
    const [shipCount] = await db.select({ count: count() }).from(sponsorships);
    const [rev] = await db.select({ total: sum(payments.amount) }).from(payments).where(eq(payments.status, "completed"));
    const [wonCount] = await db
      .select({ count: count() })
      .from(sponsorships)
      .where(or(eq(sponsorships.status, "active"), eq(sponsorships.status, "completed")));
    const totalShips = shipCount?.count ?? 0;
    const wonShips = wonCount?.count ?? 0;

    return {
      totalEvents: evCount?.count ?? 0,
      totalSponsors: spCount?.count ?? 0,
      totalSponsorships: totalShips,
      totalRevenue: rev?.total ?? "0",
      avgDealSize: totalShips > 0 ? (Number(rev?.total ?? 0) / totalShips).toFixed(2) : "0",
      conversionRate: totalShips > 0 ? Math.round((wonShips / totalShips) * 100) : 0,
    };
  }),
});

// ─────────────────────────────────────────────────────────────
// ADMIN: Notification Management
// ─────────────────────────────────────────────────────────────
const notificationManagementRouter = router({
  /** List all notifications */
  list: adminProcedure
    .input(z.object({ userId: z.number().optional(), limit: z.number().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.userId) conditions.push(eq(notifications.userId, input.userId));
      const query = db.select().from(notifications);
      if (conditions.length > 0) {
        return query.where(and(...conditions)).orderBy(desc(notifications.createdAt)).limit(input?.limit ?? 50);
      }
      return query.orderBy(desc(notifications.createdAt)).limit(input?.limit ?? 50);
    }),

  /** Send notification to a sponsor */
  send: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        titleAr: z.string(),
        titleEn: z.string(),
        messageAr: z.string(),
        messageEn: z.string(),
        type: z.enum(["info", "success", "warning", "error", "system"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.insert(notifications).values({
        userId: input.userId,
        titleAr: input.titleAr,
        titleEn: input.titleEn,
        messageAr: input.messageAr,
        messageEn: input.messageEn,
        type: input.type ?? "info",
        category: "admin",
      });
      return { id: result[0].insertId };
    }),

  /** Broadcast to all sponsors */
  broadcast: adminProcedure
    .input(
      z.object({
        titleAr: z.string(),
        titleEn: z.string(),
        messageAr: z.string(),
        messageEn: z.string(),
        type: z.enum(["info", "success", "warning", "error", "system"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) return { sent: 0 };
      const allUsers = await db.select({ id: users.id }).from(users).where(eq(users.role, "user"));
      for (const u of allUsers) {
        await db.insert(notifications).values({
          userId: u.id,
          titleAr: input.titleAr,
          titleEn: input.titleEn,
          messageAr: input.messageAr,
          messageEn: input.messageEn,
          type: input.type ?? "info",
          category: "broadcast",
        });
      }
      return { sent: allUsers.length };
    }),
});

// ─────────────────────────────────────────────────────────────
// COMBINED ADMIN ROUTER
// ─────────────────────────────────────────────────────────────
export const adminRouter = router({
  dashboard: dashboardRouter,
  events: eventManagementRouter,
  packages: packageManagementRouter,
  sponsorships: sponsorshipManagementRouter,
  contracts: contractManagementRouter,
  payments: paymentManagementRouter,
  sponsors: sponsorManagementRouter,
  notifications: notificationManagementRouter,
  reports: reportsRouter,
});
