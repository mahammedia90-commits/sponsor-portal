import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const leadsRouter = router({
  // List leads
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
      return db.listLeads(ctx.user.id, input ?? {});
    }),

  // Create a lead
  create: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        sponsorshipId: z.number().optional(),
        companyName: z.string().optional(),
        contactName: z.string().optional(),
        email: z.string().email().optional(),
        phone: z.string().optional(),
        industry: z.string().optional(),
        interestLevel: z.enum(["high", "medium", "low"]).optional(),
        source: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return db.createLead({
        sponsorId: ctx.user.id,
        ...input,
      });
    }),

  // Update lead status
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
      })
    )
    .mutation(async ({ input }) => {
      return db.updateLeadStatus(input.id, input.status);
    }),

  // Lead statistics
  stats: protectedProcedure.query(async ({ ctx }) => {
    return db.getLeadStats(ctx.user.id);
  }),
});
