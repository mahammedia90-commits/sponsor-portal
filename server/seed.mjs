/**
 * Seed script — adds realistic demo data for Maham Expo Sponsor Portal
 * Run: node server/seed.mjs
 */
import { createConnection } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function main() {
  const connection = await createConnection(DATABASE_URL);
  console.log("🌱 Seeding Maham Expo Sponsor Portal...\n");

  // ─── EVENTS ───
  const eventsData = [
    ["مؤتمر ليب 2026", "LEAP 2026", "أكبر حدث تقني في المنطقة — يجمع أكثر من 170,000 زائر و 1,000 متحدث من 180 دولة.", "The largest tech event in the region — 170,000+ visitors and 1,000 speakers from 180 countries.", "مركز الرياض للمعارض والمؤتمرات", "الرياض", "Saudi Arabia", "2026-09-08", "2026-09-11", "2026-08-01", 170000, 800, JSON.stringify(["Technology", "AI", "Fintech", "Cybersecurity"]), "active", 1, 30, 12],
    ["ديب فيست 2026", "DeepFest 2026", "أكبر مهرجان للذكاء الاصطناعي في العالم.", "The world's largest AI festival.", "مركز الرياض الدولي للمؤتمرات", "الرياض", "Saudi Arabia", "2026-11-15", "2026-11-17", "2026-10-15", 50000, 300, JSON.stringify(["AI", "Machine Learning", "Robotics"]), "active", 1, 20, 5],
    ["معرض البناء السعودي 2026", "Saudi Build 2026", "المعرض الأكبر لقطاع البناء والتشييد في المملكة.", "The largest construction exhibition in the Kingdom.", "مركز جدة للمعارض", "جدة", "Saudi Arabia", "2026-10-20", "2026-10-23", "2026-09-20", 35000, 400, JSON.stringify(["Construction", "Real Estate", "Architecture"]), "active", 1, 15, 3],
    ["مؤتمر الصحة الرقمية 2026", "Digital Health Summit 2026", "مؤتمر متخصص في التحول الرقمي لقطاع الرعاية الصحية.", "A specialized conference on digital transformation in healthcare.", "فندق الفيصلية", "الرياض", "Saudi Arabia", "2027-01-12", "2027-01-14", "2026-12-15", 15000, 150, JSON.stringify(["Healthcare", "MedTech", "Pharma"]), "approved", 1, 12, 0],
    ["معرض الأغذية والمشروبات 2026", "Saudi Food & Beverage Expo 2026", "المعرض الرائد لصناعة الأغذية والمشروبات في المملكة.", "The leading food & beverage industry exhibition in the Kingdom.", "مركز الرياض للمعارض", "الرياض", "Saudi Arabia", "2026-12-05", "2026-12-08", "2026-11-01", 40000, 500, JSON.stringify(["Food", "Beverage", "FMCG", "Hospitality"]), "active", 1, 18, 7],
  ];

  for (const e of eventsData) {
    await connection.execute(
      `INSERT INTO events (titleAr, titleEn, descriptionAr, descriptionEn, venue, city, country, startDate, endDate, registrationDeadline, expectedVisitors, expectedExhibitors, sectors, status, sponsorshipEnabled, totalSponsorSlots, filledSponsorSlots) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      e
    );
  }
  console.log(`✅ ${eventsData.length} events inserted`);

  // ─── SPONSOR PACKAGES ───
  const [eventRows] = await connection.execute("SELECT id FROM events ORDER BY id");
  const eventIds = eventRows.map((r) => r.id);

  const tiers = [
    {
      tier: "platinum", nameAr: "بلاتيني", nameEn: "Platinum", price: "300000.00",
      descAr: "الحزمة الأعلى — حقوق تسمية، كلمة افتتاحية، تغطية إعلامية حصرية، منصة عرض رئيسية 100م²",
      descEn: "Top-tier — naming rights, opening speech, exclusive media coverage, premium 100m² booth",
      maxSponsors: 1, boothSizeM2: 100, vipTickets: 30, media: 1, speech: 1, exclusivity: 1, digital: 1, sortOrder: 1,
      benefits: JSON.stringify({ ar: ["شعار رئيسي على جميع المواد والشاشات", "كلمة افتتاحية في الفعالية", "منصة عرض رئيسية 100م²", "تغطية إعلامية حصرية كاملة", "حضور VIP لـ 30 شخص", "تقرير تحليلي بالذكاء الاصطناعي", "أولوية في توليد العملاء المحتملين", "حق حصري للقطاع"], en: ["Main logo on all materials & screens", "Opening speech at event", "Premium 100m² booth", "Full exclusive media coverage", "30 VIP passes", "AI analytics report", "Priority lead generation", "Category exclusivity rights"] }),
      assets: JSON.stringify(["naming_rights", "main_entrance", "registration_zone", "stage", "led_screens", "hanging_banners", "media_wall", "digital_platform"]),
    },
    {
      tier: "gold", nameAr: "ذهبي", nameEn: "Gold", price: "150000.00",
      descAr: "حزمة متقدمة — منصة عرض 50م²، تغطية إعلامية، ترويج رقمي",
      descEn: "Advanced — 50m² booth, media coverage, digital promotion",
      maxSponsors: 3, boothSizeM2: 50, vipTickets: 15, media: 1, speech: 0, exclusivity: 0, digital: 1, sortOrder: 2,
      benefits: JSON.stringify({ ar: ["شعار على المواد الرئيسية", "منصة عرض 50م²", "تغطية إعلامية", "حضور VIP لـ 15 شخص", "تقرير أداء مفصل", "ترويج رقمي"], en: ["Logo on main materials", "50m² booth", "Media coverage", "15 VIP passes", "Detailed performance report", "Digital promotion"] }),
      assets: JSON.stringify(["led_screens", "hanging_banners", "activation_booth", "digital_platform"]),
    },
    {
      tier: "silver", nameAr: "فضي", nameEn: "Silver", price: "70000.00",
      descAr: "حزمة أساسية — منصة عرض 25م²، ظهور رقمي، تقرير أداء أساسي",
      descEn: "Basic — 25m² booth, digital visibility, basic performance report",
      maxSponsors: 5, boothSizeM2: 25, vipTickets: 5, media: 0, speech: 0, exclusivity: 0, digital: 1, sortOrder: 3,
      benefits: JSON.stringify({ ar: ["شعار على موقع الفعالية", "منصة عرض 25م²", "حضور VIP لـ 5 أشخاص", "تقرير أداء أساسي"], en: ["Logo on event website", "25m² booth", "5 VIP passes", "Basic performance report"] }),
      assets: JSON.stringify(["digital_platform", "floor_stickers"]),
    },
    {
      tier: "bronze", nameAr: "شريك رسمي", nameEn: "Official Partner", price: "35000.00",
      descAr: "حزمة الشريك — ظهور على صفحة الفعالية، حضور VIP لشخصين",
      descEn: "Partner — visibility on event page, 2 VIP passes",
      maxSponsors: 10, boothSizeM2: 0, vipTickets: 2, media: 0, speech: 0, exclusivity: 0, digital: 0, sortOrder: 4,
      benefits: JSON.stringify({ ar: ["شعار على صفحة الفعالية", "حضور VIP لشخصين", "ذكر في منشورات التواصل"], en: ["Logo on event page", "2 VIP passes", "Social media mention"] }),
      assets: JSON.stringify(["digital_platform"]),
    },
  ];

  let pkgCount = 0;
  for (const eventId of eventIds) {
    for (const t of tiers) {
      await connection.execute(
        `INSERT INTO sponsor_packages (eventId, nameAr, nameEn, tier, descriptionAr, descriptionEn, price, currency, maxSponsors, currentSponsors, benefits, assets, boothSizeM2, vipTickets, mediaCovarage, openingSpeech, categoryExclusivity, digitalPromotion, isActive, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, 'SAR', ?, 0, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)`,
        [eventId, t.nameAr, t.nameEn, t.tier, t.descAr, t.descEn, t.price, t.maxSponsors, t.benefits, t.assets, t.boothSizeM2, t.vipTickets, t.media, t.speech, t.exclusivity, t.digital, t.sortOrder]
      );
      pkgCount++;
    }
  }
  console.log(`✅ ${pkgCount} sponsor packages inserted (${tiers.length} tiers × ${eventIds.length} events)`);

  console.log("\n🎉 Seed complete!");
  await connection.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
