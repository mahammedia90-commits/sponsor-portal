import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const analyticsRouter = router({
  // Dashboard overview data
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    return db.getDashboardData(ctx.user.id);
  }),

  // Brand exposure metrics
  brandExposure: protectedProcedure
    .input(
      z
        .object({
          eventId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return db.listBrandExposure(ctx.user.id, input ?? {});
    }),

  // Brand exposure stats
  brandExposureStats: protectedProcedure.query(async ({ ctx }) => {
    return db.getBrandExposureStats(ctx.user.id);
  }),

  // ROI Calculator
  calculateRoi: protectedProcedure
    .input(
      z.object({
        investmentAmount: z.number(),
        brandImpressions: z.number(),
        leadsGenerated: z.number(),
        conversionRate: z.number(), // percentage
        averageDealValue: z.number(),
      })
    )
    .query(({ input }) => {
      const estimatedRevenue =
        input.leadsGenerated * (input.conversionRate / 100) * input.averageDealValue;
      const roi = ((estimatedRevenue - input.investmentAmount) / input.investmentAmount) * 100;
      const costPerImpression =
        input.brandImpressions > 0 ? input.investmentAmount / input.brandImpressions : 0;
      const costPerLead =
        input.leadsGenerated > 0 ? input.investmentAmount / input.leadsGenerated : 0;

      return {
        estimatedRevenue: Math.round(estimatedRevenue),
        roi: Math.round(roi * 100) / 100,
        costPerImpression: Math.round(costPerImpression * 100) / 100,
        costPerLead: Math.round(costPerLead * 100) / 100,
        breakEvenLeads: input.averageDealValue > 0
          ? Math.ceil(input.investmentAmount / (input.averageDealValue * (input.conversionRate / 100)))
          : 0,
      };
    }),
});
