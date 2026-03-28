import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const sponsorshipsRouter = router({
  // List my sponsorships
  list: protectedProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          eventId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return db.listSponsorships(ctx.user.id, input ?? {});
    }),

  // Get single sponsorship
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getSponsorshipById(input.id);
    }),

  // Create new sponsorship application
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        packageId: z.number(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get package to determine totalAmount
      const pkg = await db.getPackageById(input.packageId);
      const sponsorship = await db.createSponsorship({
        sponsorId: ctx.user.id,
        eventId: input.eventId,
        packageId: input.packageId,
        totalAmount: pkg?.price ?? "0",
        notes: input.notes,
        status: "lead",
      });

      // Create notification
      if (sponsorship) {
        await db.createNotification({
          userId: ctx.user.id,
          titleAr: "تم تقديم طلب رعاية جديد",
          titleEn: "New Sponsorship Application Submitted",
          messageAr: `تم تقديم طلبك للرعاية بنجاح. رقم الطلب: #${sponsorship.id}`,
          messageEn: `Your sponsorship application has been submitted successfully. Application #${sponsorship.id}`,
          type: "success",
          category: "sponsorship",
          relatedId: sponsorship.id,
          relatedType: "sponsorship",
        });
      }

      return sponsorship;
    }),

  // Update sponsorship status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return db.updateSponsorshipStatus(input.id, input.status);
    }),

  // Get sponsorship statistics
  stats: protectedProcedure.query(async ({ ctx }) => {
    return db.getSponsorshipStats(ctx.user.id);
  }),
});
