import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const campaignsRouter = router({
  // List campaigns
  list: protectedProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return db.listCampaigns(ctx.user.id, input ?? {});
    }),

  // Create campaign
  create: protectedProcedure
    .input(
      z.object({
        sponsorshipId: z.number().optional(),
        nameAr: z.string().optional(),
        nameEn: z.string().optional(),
        type: z.enum(["social_media", "email", "display", "video", "print", "activation"]),
        budget: z.string().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.createCampaign({
        sponsorId: ctx.user.id,
        ...input,
      });
    }),

  // Campaign statistics
  stats: protectedProcedure.query(async ({ ctx }) => {
    return db.getCampaignStats(ctx.user.id);
  }),
});
