import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const profileRouter = router({
  // Get sponsor profile
  get: protectedProcedure.query(async ({ ctx }) => {
    return db.getSponsorProfile(ctx.user.id);
  }),

  // Update or create sponsor profile
  upsert: protectedProcedure
    .input(
      z.object({
        companyNameAr: z.string().optional(),
        companyNameEn: z.string().optional(),
        brandName: z.string().optional(),
        contactPerson: z.string().optional(),
        phone: z.string().optional(),
        country: z.string().optional(),
        city: z.string().optional(),
        industry: z.string().optional(),
        companySize: z.string().optional(),
        marketingBudget: z.string().optional(),
        targetMarket: z.string().optional(),
        website: z.string().optional(),
        linkedIn: z.string().optional(),
        logoUrl: z.string().optional(),
        description: z.string().optional(),
        commercialRegNo: z.string().optional(),
        vatNumber: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.upsertSponsorProfile({
        userId: ctx.user.id,
        ...input,
      });
    }),

  // List uploaded files
  files: protectedProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return db.listFiles(ctx.user.id, input ?? {});
    }),
});
