import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

// Feature routers
import { eventsRouter } from "./routers/events";
import { sponsorshipsRouter } from "./routers/sponsorships";
import { contractsRouter } from "./routers/contracts";
import { paymentsRouter } from "./routers/payments";
import { leadsRouter } from "./routers/leads";
import { notificationsRouter } from "./routers/notifications";
import { campaignsRouter } from "./routers/campaigns";
import { analyticsRouter } from "./routers/analytics";
import { profileRouter } from "./routers/profile";
import { aiRouter } from "./routers/ai";
import { adminRouter } from "./routers/admin";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Sponsor Portal Feature Routers ───
  events: eventsRouter,
  sponsorships: sponsorshipsRouter,
  contracts: contractsRouter,
  payments: paymentsRouter,
  leads: leadsRouter,
  notifications: notificationsRouter,
  campaigns: campaignsRouter,
  analytics: analyticsRouter,
  profile: profileRouter,
  ai: aiRouter,

  // ─── Admin Panel Router (supervisor only) ───
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
