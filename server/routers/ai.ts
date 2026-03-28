import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { invokeLLM } from "../_core/llm";
import * as db from "../db";

export const aiRouter = router({
  // AI Chat — general sponsor assistant
  chat: protectedProcedure
    .input(
      z.object({
        message: z.string().min(1).max(2000),
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await db.getSponsorProfile(ctx.user.id);
      const stats = await db.getDashboardData(ctx.user.id);

      const systemPrompt =
        input.language === "ar"
          ? `أنت مساعد ذكي لمنصة مهام إكسبو — بوابة الداعم/الراعي. تساعد الرعاة في:
- اختيار أفضل فرص الرعاية
- تحليل عائد الاستثمار
- اقتراح حزم مناسبة
- الإجابة عن أسئلة العقود والمدفوعات
- تقديم نصائح تسويقية

معلومات الداعم:
- الشركة: ${profile?.companyNameAr ?? "غير محدد"}
- القطاع: ${profile?.industry ?? "غير محدد"}
- رعايات نشطة: ${stats.sponsorships.active}
- إجمالي الاستثمار: ${stats.sponsorships.totalInvested} ر.س
- عملاء محتملون: ${stats.leads.total}

أجب بالعربية بشكل مختصر ومهني.`
          : `You are an AI assistant for Maham Expo — Sponsor Portal. You help sponsors with:
- Choosing the best sponsorship opportunities
- ROI analysis
- Package recommendations
- Contract and payment questions
- Marketing advice

Sponsor info:
- Company: ${profile?.companyNameEn ?? "Not specified"}
- Industry: ${profile?.industry ?? "Not specified"}
- Active sponsorships: ${stats.sponsorships.active}
- Total invested: ${stats.sponsorships.totalInvested} SAR
- Leads generated: ${stats.leads.total}

Reply in English, concise and professional.`;

      try {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.message },
          ],
        });

        return {
          reply: response.choices?.[0]?.message?.content ?? "...",
        };
      } catch (error) {
        return {
          reply:
            input.language === "ar"
              ? "عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى."
              : "Sorry, an error occurred. Please try again.",
        };
      }
    }),

  // AI Recommendations — suggest best events/packages
  recommendations: protectedProcedure
    .input(
      z.object({
        language: z.enum(["ar", "en"]).default("ar"),
      })
    )
    .query(async ({ ctx, input }) => {
      const profile = await db.getSponsorProfile(ctx.user.id);
      const activeEvents = await db.listEvents({ status: "active", limit: 5 });

      if (activeEvents.length === 0) {
        return {
          events: [],
          message:
            input.language === "ar"
              ? "لا توجد فعاليات نشطة حالياً"
              : "No active events currently",
        };
      }

      try {
        const prompt =
          input.language === "ar"
            ? `بناءً على ملف الداعم التالي:
- القطاع: ${profile?.industry ?? "عام"}
- السوق المستهدف: ${profile?.targetMarket ?? "السعودية"}
- ميزانية التسويق: ${profile?.marketingBudget ?? "غير محدد"}

والفعاليات المتاحة:
${activeEvents.map((e) => `- ${e.titleAr}: ${e.venue}, ${e.city} (${e.expectedVisitors} زائر متوقع)`).join("\n")}

اقترح أفضل فعالية وحزمة رعاية مناسبة. أجب بـ JSON:
{"eventId": number, "reason": "string", "suggestedTier": "platinum|gold|silver|bronze", "estimatedRoi": number}`
            : `Based on sponsor profile:
- Industry: ${profile?.industry ?? "General"}
- Target market: ${profile?.targetMarket ?? "Saudi Arabia"}
- Marketing budget: ${profile?.marketingBudget ?? "Not specified"}

Available events:
${activeEvents.map((e) => `- ${e.titleEn}: ${e.venue}, ${e.city} (${e.expectedVisitors} expected visitors)`).join("\n")}

Suggest the best event and sponsorship package. Reply in JSON:
{"eventId": number, "reason": "string", "suggestedTier": "platinum|gold|silver|bronze", "estimatedRoi": number}`;

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are a sponsorship advisor. Reply ONLY with valid JSON.",
            },
            { role: "user", content: prompt },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "recommendation",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  eventId: { type: "integer", description: "Recommended event ID" },
                  reason: { type: "string", description: "Reason for recommendation" },
                  suggestedTier: { type: "string", description: "Suggested tier" },
                  estimatedRoi: { type: "number", description: "Estimated ROI percentage" },
                },
                required: ["eventId", "reason", "suggestedTier", "estimatedRoi"],
                additionalProperties: false,
              },
            },
          },
        });

        const rawContent = response.choices?.[0]?.message?.content;
        const content = typeof rawContent === 'string' ? rawContent : Array.isArray(rawContent) ? (rawContent.find((c: any) => c.type === 'text') as any)?.text ?? '' : '';
        const recommendation = content ? JSON.parse(content) : null;

        return {
          events: activeEvents,
          recommendation,
          message: null,
        };
      } catch {
        return {
          events: activeEvents,
          recommendation: null,
          message:
            input.language === "ar"
              ? "تعذر إنشاء التوصيات حالياً"
              : "Unable to generate recommendations at this time",
        };
      }
    }),
});
