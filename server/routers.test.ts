import { describe, expect, it, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createAuthContext(userId = 1): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: `test-user-${userId}`,
    email: `test${userId}@example.com`,
    name: `Test User ${userId}`,
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

// ─── EVENTS ROUTER (Public) ───
describe("events router", () => {
  it("events.list returns an array", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.events.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("events.list returns seeded events", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const result = await caller.events.list();
    expect(result.length).toBeGreaterThanOrEqual(5);
  });

  it("events.list with status filter returns filtered results", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const active = await caller.events.list({ status: "active" });
    expect(active.every((e) => e.status === "active")).toBe(true);
  });

  it("events.getById returns a single event", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const events = await caller.events.list();
    if (events.length > 0) {
      const event = await caller.events.getById({ id: events[0].id });
      expect(event).toBeTruthy();
      expect(event?.id).toBe(events[0].id);
      expect(event?.titleAr).toBeTruthy();
      expect(event?.titleEn).toBeTruthy();
    }
  });

  it("events.activeCount returns a number", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const count = await caller.events.activeCount();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it("events.packages returns packages for an event", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const events = await caller.events.list();
    if (events.length > 0) {
      const packages = await caller.events.packages({ eventId: events[0].id });
      expect(Array.isArray(packages)).toBe(true);
      expect(packages.length).toBe(4); // platinum, gold, silver, bronze
    }
  });

  it("events.getPackage returns a single package", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const events = await caller.events.list();
    if (events.length > 0) {
      const packages = await caller.events.packages({ eventId: events[0].id });
      if (packages.length > 0) {
        const pkg = await caller.events.getPackage({ id: packages[0].id });
        expect(pkg).toBeTruthy();
        expect(pkg?.tier).toBeTruthy();
        expect(pkg?.price).toBeTruthy();
      }
    }
  });

  it("events.allPackages returns all packages", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const packages = await caller.events.allPackages();
    expect(Array.isArray(packages)).toBe(true);
    expect(packages.length).toBeGreaterThanOrEqual(20); // 4 tiers × 5 events
  });

  it("events.allPackages with tier filter works", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    const platinumPkgs = await caller.events.allPackages({ tier: "platinum" });
    expect(platinumPkgs.every((p) => p.tier === "platinum")).toBe(true);
    expect(platinumPkgs.length).toBe(5); // one per event
  });
});

// ─── SPONSORSHIPS ROUTER (Protected) ───
describe("sponsorships router", () => {
  it("sponsorships.list returns an array for authenticated user", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.sponsorships.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("sponsorships.stats returns stats object", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const stats = await caller.sponsorships.stats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("active");
    expect(stats).toHaveProperty("completed");
    expect(stats).toHaveProperty("totalInvested");
    expect(typeof stats.total).toBe("number");
  });

  it("sponsorships.list throws for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.sponsorships.list()).rejects.toThrow();
  });
});

// ─── CONTRACTS ROUTER (Protected) ───
describe("contracts router", () => {
  it("contracts.list returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.contracts.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("contracts.list throws for unauthenticated user", async () => {
    const caller = appRouter.createCaller(createPublicContext());
    await expect(caller.contracts.list()).rejects.toThrow();
  });
});

// ─── PAYMENTS ROUTER (Protected) ───
describe("payments router", () => {
  it("payments.invoices returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.payments.invoices();
    expect(Array.isArray(result)).toBe(true);
  });

  it("payments.list returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.payments.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("payments.stats returns stats object", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const stats = await caller.payments.stats();
    expect(stats).toHaveProperty("totalPaid");
    expect(stats).toHaveProperty("pendingPayments");
  });
});

// ─── LEADS ROUTER (Protected) ───
describe("leads router", () => {
  it("leads.list returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.leads.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("leads.stats returns stats object", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const stats = await caller.leads.stats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("newLeads");
    expect(stats).toHaveProperty("qualified");
    expect(stats).toHaveProperty("converted");
  });
});

// ─── NOTIFICATIONS ROUTER (Protected) ───
describe("notifications router", () => {
  it("notifications.list returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.notifications.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("notifications.unreadCount returns a number", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const count = await caller.notifications.unreadCount();
    expect(typeof count).toBe("number");
  });

  it("notifications.markAllRead returns success", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.notifications.markAllRead();
    expect(result).toEqual({ success: true });
  });
});

// ─── CAMPAIGNS ROUTER (Protected) ───
describe("campaigns router", () => {
  it("campaigns.list returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.campaigns.list();
    expect(Array.isArray(result)).toBe(true);
  });

  it("campaigns.stats returns stats object", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const stats = await caller.campaigns.stats();
    expect(stats).toHaveProperty("total");
    expect(stats).toHaveProperty("active");
    expect(stats).toHaveProperty("totalImpressions");
    expect(stats).toHaveProperty("totalClicks");
  });
});

// ─── ANALYTICS ROUTER (Protected) ───
describe("analytics router", () => {
  it("analytics.dashboard returns comprehensive data", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const data = await caller.analytics.dashboard();
    expect(data).toHaveProperty("sponsorships");
    expect(data).toHaveProperty("payments");
    expect(data).toHaveProperty("leads");
    expect(data).toHaveProperty("campaigns");
    expect(data).toHaveProperty("brandExposure");
  });

  it("analytics.brandExposureStats returns stats", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const stats = await caller.analytics.brandExposureStats();
    expect(stats).toHaveProperty("totalImpressions");
    expect(stats).toHaveProperty("totalFootTraffic");
    expect(stats).toHaveProperty("totalSocialMentions");
    expect(stats).toHaveProperty("totalWebsiteClicks");
  });

  it("analytics.calculateRoi returns ROI metrics", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const roi = await caller.analytics.calculateRoi({
      investmentAmount: 150000,
      brandImpressions: 2000000,
      leadsGenerated: 200,
      conversionRate: 10,
      averageDealValue: 50000,
    });
    expect(roi).toHaveProperty("estimatedRevenue");
    expect(roi).toHaveProperty("roi");
    expect(roi).toHaveProperty("costPerImpression");
    expect(roi).toHaveProperty("costPerLead");
    expect(roi).toHaveProperty("breakEvenLeads");
    expect(roi.estimatedRevenue).toBe(1000000); // 200 * 0.1 * 50000
    expect(roi.roi).toBeGreaterThan(0);
  });
});

// ─── PROFILE ROUTER (Protected) ───
describe("profile router", () => {
  it("profile.get returns null or profile", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.profile.get();
    // Can be null if no profile exists yet
    expect(result === null || typeof result === "object").toBe(true);
  });

  it("profile.files returns an array", async () => {
    const caller = appRouter.createCaller(createAuthContext());
    const result = await caller.profile.files();
    expect(Array.isArray(result)).toBe(true);
  });
});

// ─── AUTH PROTECTION ───
describe("auth protection", () => {
  const protectedRoutes = [
    "sponsorships.list",
    "contracts.list",
    "payments.list",
    "leads.list",
    "notifications.list",
    "campaigns.list",
    "analytics.dashboard",
    "profile.get",
  ];

  for (const route of protectedRoutes) {
    it(`${route} rejects unauthenticated requests`, async () => {
      const caller = appRouter.createCaller(createPublicContext());
      const [ns, method] = route.split(".");
      await expect((caller as any)[ns][method]()).rejects.toThrow();
    });
  }
});
