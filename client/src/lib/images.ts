/**
 * Centralized image URLs for the Sponsor Portal
 * All images are hosted on CDN and tied to the webdev project lifecycle
 */

export const IMAGES = {
  // Hero & Landing
  hero: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-hero-jumKf6mngMij2RZTr82mpQ.webp',
  
  // Expo & Events
  expoHall: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-expo-hall-KF8yTvgvVLMQbi4AKXqhKg.webp',
  networking: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-networking-event-fsaLJnjkFJboV6AwCmSY64.webp',
  calendar: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-calendar-events-CMjaTAEJi3TUJpEmGRHWDQ.webp',
  
  // Analytics & Reports
  analytics: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-analytics-dashboard-S23sSkprnMAhokvRuYStWi.webp',
  reportSuccess: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-report-success-Vs6t6GUB37fTAPP8ofXTYs.webp',
  
  // Business Operations
  contractSigning: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-contract-signing-bZYt7waPaSJTKfV2eGwuUv.webp',
  brandDisplay: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-brand-display-b5qLQv32gHCTauu66Zc4GR.webp',
  teamMeeting: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-team-meeting-TTLSPyzF255bLyGgeULaUP.webp',
  
  // AI & Technology
  aiAssistant: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-ai-assistant-HZZXDJTczNPmxkiDehfyXt.webp',
  
  // CRM & Leads
  leadsCrm: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663193442903/FphebttzuNFPinX2TsxkBd/sponsor-leads-crm-o2mq2DBuFvwahsH47uYUNU.webp',
} as const;

export type ImageKey = keyof typeof IMAGES;
