import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const paymentsRouter = router({
  // List invoices
  invoices: protectedProcedure
    .input(
      z
        .object({
          status: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      return db.listInvoices(ctx.user.id, input ?? {});
    }),

  // Get single invoice
  getInvoice: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getInvoiceById(input.id);
    }),

  // List payments
  list: protectedProcedure.query(async ({ ctx }) => {
    return db.listPayments(ctx.user.id);
  }),

  // Create payment (process payment for an invoice)
  pay: protectedProcedure
    .input(
      z.object({
        invoiceId: z.number(),
        amount: z.string(),
        method: z.enum(["credit_card", "mada", "apple_pay", "bank_transfer", "wire"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const payment = await db.createPayment({
        invoiceId: input.invoiceId,
        sponsorId: ctx.user.id,
        amount: input.amount,
        method: input.method,
        status: "processing",
      });

      // Notify sponsor
      if (payment) {
        await db.createNotification({
          userId: ctx.user.id,
          titleAr: "تم استلام الدفعة",
          titleEn: "Payment Received",
          messageAr: `تم استلام دفعتك بقيمة ${input.amount} ر.س وهي قيد المعالجة`,
          messageEn: `Your payment of ${input.amount} SAR has been received and is being processed`,
          type: "info",
          category: "payment",
          relatedId: payment.id,
          relatedType: "payment",
        });
      }

      return payment;
    }),

  // Payment statistics
  stats: protectedProcedure.query(async ({ ctx }) => {
    return db.getPaymentStats(ctx.user.id);
  }),
});
