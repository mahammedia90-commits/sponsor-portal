import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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

  // ─── Sponsor OTP Login Flow ───
  sponsorAuth: router({
    sendOtp: publicProcedure.input(z.object({
      phone: z.string().min(9).max(15).regex(/^\+?[0-9]+$/, "Invalid phone format"),
    })).mutation(async ({ input }) => {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await db.createOtp(input.phone, code);
      return { success: true, fallbackCode: code };
    }),

    verifyOtp: publicProcedure.input(z.object({
      phone: z.string().min(9).max(15),
      code: z.string().length(6),
    })).mutation(async ({ input }) => {
      const valid = await db.verifyOtp(input.phone, input.code);
      if (!valid) return { success: false, error: 'رمز التحقق غير صحيح أو منتهي الصلاحية' };
      return { success: true };
    }),

    register: publicProcedure.input(z.object({
      phone: z.string().min(9).max(15),
      fullName: z.string().min(2).max(255),
      companyName: z.string().max(255).optional(),
      interest: z.string().max(100).optional(),
    })).mutation(async ({ input, ctx }) => {
      const openId = `sponsor_${input.phone}`;
      await db.upsertUser({
        openId,
        name: input.fullName,
        loginMethod: "otp",
        lastSignedIn: new Date(),
        role: "sponsor" as any,
      });
      const token = await sdk.createSessionToken(openId, { name: input.fullName });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      return { success: true };
    }),

    login: publicProcedure.input(z.object({
      phone: z.string().min(9).max(15),
    })).mutation(async ({ input, ctx }) => {
      const openId = `sponsor_${input.phone}`;
      const user = await db.getUserByOpenId(openId);
      if (!user) return { success: false, error: "User not found" };
      await db.upsertUser({ openId, lastSignedIn: new Date() });
      const token = await sdk.createSessionToken(openId, { name: user.name || input.phone });
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      return { success: true };
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
