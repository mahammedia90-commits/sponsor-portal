import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const contractsRouter = router({
  // List my contracts
  list: protectedProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return db.listContracts(ctx.user.id, input ?? {});
    }),

  // Get single contract
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getContractById(input.id);
    }),

  // Sign contract digitally
  sign: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        signatureData: z.string(), // Base64 signature image
      })
    )
    .mutation(async ({ ctx, input }) => {
      const contract = await db.updateContractStatus(input.id, "signed", input.signatureData);

      // Update sponsorship status to "signed"
      if (contract) {
        await db.updateSponsorshipStatus(contract.sponsorshipId, "signed");
        // Notify sponsor
        await db.createNotification({
          userId: ctx.user.id,
          titleAr: "تم توقيع العقد بنجاح",
          titleEn: "Contract Signed Successfully",
          messageAr: `تم توقيع العقد رقم ${contract.contractNumber} بنجاح`,
          messageEn: `Contract ${contract.contractNumber} has been signed successfully`,
          type: "success",
          category: "contract",
          relatedId: contract.id,
          relatedType: "contract",
        });
      }

      return contract;
    }),

  // Cancel contract
  cancel: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return db.updateContractStatus(input.id, "cancelled");
    }),
});
