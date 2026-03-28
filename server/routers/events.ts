import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const eventsRouter = router({
  // List all events (public — for browsing opportunities)
  list: publicProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
          limit: z.number().min(1).max(100).optional(),
          offset: z.number().min(0).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return db.listEvents(input ?? {});
    }),

  // Get single event by ID (public)
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getEventById(input.id);
    }),

  // Get active events count (public)
  activeCount: publicProcedure.query(async () => {
    return db.getActiveEventsCount();
  }),

  // List packages for a specific event (public)
  packages: publicProcedure
    .input(z.object({ eventId: z.number() }))
    .query(async ({ input }) => {
      return db.listPackagesByEvent(input.eventId);
    }),

  // Get a specific package (public)
  getPackage: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getPackageById(input.id);
    }),

  // List all packages with optional tier filter (public)
  allPackages: publicProcedure
    .input(
      z
        .object({
          tier: z.string().optional(),
          limit: z.number().min(1).max(100).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      return db.listAllPackages(input ?? {});
    }),
});
