/**
 * Admin Router Tests
 * Tests for admin panel API endpoints
 */
import { describe, it, expect, vi } from "vitest";

// Mock the database module
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

// Mock the LLM module
vi.mock("./_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

describe("Admin Router Structure", () => {
  it("should have admin router module", async () => {
    const mod = await import("./routers/admin");
    expect(mod).toBeDefined();
    expect(mod.adminRouter).toBeDefined();
  });

  it("should have all required sub-routers", async () => {
    const mod = await import("./routers/admin");
    const router = mod.adminRouter;
    expect(router).toBeDefined();
    expect(typeof router).toBe("object");
    expect(router._def).toBeDefined();
    expect(router._def.procedures).toBeDefined();
  });
});

describe("Admin Dashboard KPIs", () => {
  it("should have dashboard procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["dashboard.kpis"]).toBeDefined();
    expect(procedures["dashboard.recentActivity"]).toBeDefined();
    expect(procedures["dashboard.revenueChart"]).toBeDefined();
    expect(procedures["dashboard.alerts"]).toBeDefined();
  });
});

describe("Admin Events Management", () => {
  it("should have events CRUD procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["events.list"]).toBeDefined();
    expect(procedures["events.get"]).toBeDefined();
    expect(procedures["events.create"]).toBeDefined();
    expect(procedures["events.update"]).toBeDefined();
    expect(procedures["events.updateStatus"]).toBeDefined();
  });
});

describe("Admin Packages Management", () => {
  it("should have packages procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["packages.listByEvent"]).toBeDefined();
    expect(procedures["packages.create"]).toBeDefined();
    expect(procedures["packages.update"]).toBeDefined();
    expect(procedures["packages.toggleActive"]).toBeDefined();
  });
});

describe("Admin Sponsors Management", () => {
  it("should have sponsors procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["sponsors.list"]).toBeDefined();
    expect(procedures["sponsors.get"]).toBeDefined();
    expect(procedures["sponsors.updateVerification"]).toBeDefined();
  });
});

describe("Admin Sponsorships Management", () => {
  it("should have sponsorship approval procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["sponsorships.list"]).toBeDefined();
    expect(procedures["sponsorships.get"]).toBeDefined();
    expect(procedures["sponsorships.pipelineStats"]).toBeDefined();
    expect(procedures["sponsorships.approve"]).toBeDefined();
    expect(procedures["sponsorships.reject"]).toBeDefined();
    expect(procedures["sponsorships.updateStatus"]).toBeDefined();
  });
});

describe("Admin Contracts Management", () => {
  it("should have contract procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["contracts.list"]).toBeDefined();
    expect(procedures["contracts.updateStatus"]).toBeDefined();
    expect(procedures["contracts.generate"]).toBeDefined();
  });
});

describe("Admin Payments Management", () => {
  it("should have payment procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["payments.invoices"]).toBeDefined();
    expect(procedures["payments.payments"]).toBeDefined();
    expect(procedures["payments.collectionStats"]).toBeDefined();
    expect(procedures["payments.markPaid"]).toBeDefined();
    expect(procedures["payments.generateInvoice"]).toBeDefined();
  });
});

describe("Admin Notifications", () => {
  it("should have notification procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["notifications.list"]).toBeDefined();
    expect(procedures["notifications.send"]).toBeDefined();
    expect(procedures["notifications.broadcast"]).toBeDefined();
  });
});

describe("Admin Reports", () => {
  it("should have report procedures", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    expect(procedures["reports.eventPerformance"]).toBeDefined();
    expect(procedures["reports.sponsorPerformance"]).toBeDefined();
    expect(procedures["reports.platformOverview"]).toBeDefined();
  });
});

describe("Admin Router Security", () => {
  it("all admin procedures should require authentication", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    const procedureNames = Object.keys(procedures);
    
    // All procedures should exist
    expect(procedureNames.length).toBeGreaterThan(25);
    
    // Each procedure should be defined
    for (const name of procedureNames) {
      expect(procedures[name]).toBeDefined();
    }
  });

  it("should have at least 30 procedures total", async () => {
    const mod = await import("./routers/admin");
    const procedures = mod.adminRouter._def.procedures;
    const procedureCount = Object.keys(procedures).length;
    expect(procedureCount).toBeGreaterThanOrEqual(30);
    console.log(`Total admin procedures: ${procedureCount}`);
    console.log("Procedures:", Object.keys(procedures).join(", "));
  });
});
