/**
 * Teto Technologies site content and company details.
 *
 * Company details come from environment variables (TETO_*) so the owner can
 * update them in the Vercel dashboard without touching code. Values that have
 * not been supplied are null — the pages render a clearly marked
 * TODO(owner) placeholder instead of inventing information.
 *
 * Pages are prerendered at build time, so redeploy after changing a TETO_*
 * variable in Vercel.
 */

import type { IconName } from '@/components/icon';

function env(key: string, fallback: string | null = null): string | null {
  const value = process.env[key]?.trim();
  return value ? value : fallback;
}

export type Service = {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  features: { title: string; text: string }[];
  deliverables: string[];
  tech: string[];
};

export type Value = { icon: IconName; title: string; text: string };
export type ProcessStep = { step: string; title: string; text: string };

export type Project = {
  title: string | null;
  client: string;
  sector: string | null;
  summary: string | null;
  problem: string | null;
  solution: string | null;
  result: string | null;
  tech: string[];
  image: string;
};

export type Product = {
  name: string | null;
  kind: 'app' | 'website';
  summary: string | null;
  description: string | null;
  image: string | null;
  downloadUrl: string | null; // APK / store / installer
  websiteUrl: string | null;
  platforms: string[]; // e.g. ['Android', 'iOS', 'Web']
  status: string | null; // e.g. 'Available', 'Coming soon'
};

export const company = {
  name: 'Teto Technologies',
  legalName: env('TETO_LEGAL_NAME', 'Teto Technologies'),
  registrationNumber: env('TETO_REG_NUMBER', 'Tech20261'),
  tagline: 'Software and networks that work.',
  secondaryTagline: 'Built in Kenya. Built to scale.',
  description:
    'Teto Technologies is a Kenyan technology company delivering custom software, mobile apps, M-Pesa integrations and network infrastructure.',
  email: env('TETO_EMAIL'),
  phone: env('TETO_PHONE'),
  whatsapp: env('TETO_WHATSAPP'),
  whatsappMessage: env('TETO_WHATSAPP_MESSAGE', 'Hello Teto Technologies, I would like to discuss a project.')!,
  address: env('TETO_ADDRESS'),
  hours: env('TETO_HOURS'),
  founded: env('TETO_FOUNDED', '2019'),
  founder: env('TETO_FOUNDER', 'Rotich Elias'),
  mapEmbedUrl: env('TETO_MAP_EMBED_URL'),
};

export const social: { name: string; icon: IconName; url: string | null }[] = [
  { name: 'LinkedIn', icon: 'linkedin', url: env('TETO_LINKEDIN') },
  { name: 'GitHub', icon: 'github', url: env('TETO_GITHUB') },
  { name: 'X', icon: 'x', url: env('TETO_X') },
  { name: 'Facebook', icon: 'facebook', url: env('TETO_FACEBOOK') },
  { name: 'Instagram', icon: 'instagram', url: env('TETO_INSTAGRAM') },
  { name: 'TikTok', icon: 'tiktok', url: env('TETO_TIKTOK') },
];

export const services: Service[] = [
    {
        slug: "web-development",
        name: "Web Development",
        short: "Business websites, customer portals, dashboards and custom systems built to last.",
        icon: "web",
        metaTitle: "Web Development in Kenya — Laravel & Vue | Teto Technologies",
        metaDescription: "Custom websites, web applications, dashboards and business systems built with Laravel, Vue.js and MySQL for Kenyan organisations.",
        intro: [
            "Teto Technologies builds business websites, web applications and internal systems that are fast, secure and straightforward to maintain.",
            "We work with Laravel, Vue.js and MySQL — a proven stack that keeps hosting costs predictable and makes it easy to find developers when your team grows.",
        ],
        features: [
            {title: "Business websites", text: "Clear, mobile-first marketing sites with content you can update without rebuilding the site."},
            {title: "Web applications", text: "Customer portals, booking flows, order tracking and other line-of-business tools."},
            {title: "Dashboards and reporting", text: "Bring scattered operational data into one place with role-based access and exports."},
            {title: "API integrations", text: "Connect your site to payments, SMS, accounting, CRM and other third-party services."},
            {title: "Performance and accessibility", text: "Fast page loads on mobile networks, semantic markup and WCAG-minded interfaces."},
            {title: "Deployment and handover", text: "Containerised deployment, environment configuration and documentation your team can follow."},
        ],
        deliverables: [
            "Discovery notes and a written scope",
            "Responsive UI built from reusable components",
            "Tested application and database schema",
            "Deployment setup and handover documentation",
        ],
        tech: ["Laravel", "Vue.js", "MySQL", "Tailwind CSS", "Docker"],
    },
    {
        slug: "mobile-app-development",
        name: "Mobile App Development",
        short: "Cross-platform Android and iOS apps from a single Flutter codebase.",
        icon: "mobile",
        metaTitle: "Mobile App Development in Kenya — Flutter | Teto Technologies",
        metaDescription: "Cross-platform Android and iOS apps built with Flutter for Kenyan businesses, including offline support, APIs and store release.",
        intro: [
            "We build cross-platform mobile apps with Flutter, giving you one codebase for Android and iOS without maintaining two separate teams.",
            "Apps are designed around real field conditions in Kenya: intermittent connectivity, low-end devices and data costs that matter.",
        ],
        features: [
            {title: "Android and iOS", text: "A single Flutter codebase released to both major app stores."},
            {title: "Offline-first flows", text: "Local storage and sync so staff can keep working when the network drops."},
            {title: "API and payment integration", text: "Connect to your backend, M-Pesa and other services through documented APIs."},
            {title: "Push notifications", text: "Transactional and operational notifications through Firebase Cloud Messaging."},
            {title: "Field-ready interfaces", text: "Large touch targets, clear states and layouts tested on common Android devices."},
            {title: "Release support", text: "Build signing, store listings and update guidance for your team."},
        ],
        deliverables: [
            "App prototype and screen flows",
            "Flutter application with documented API layer",
            "Android and iOS release builds",
            "Store submission and handover notes",
        ],
        tech: ["Flutter", "Dart", "Laravel", "MySQL", "Firebase"],
    },
    {
        slug: "payments-integration",
        name: "Payments Integration",
        short: "M-Pesa Daraja integrations with reliable callbacks and reconciliation.",
        icon: "payments",
        metaTitle: "M-Pesa Daraja Integration in Kenya | Teto Technologies",
        metaDescription: "M-Pesa Daraja API integration — STK Push, C2B, B2C, callbacks and reconciliation for Kenyan websites and applications.",
        intro: [
            "We integrate the official Safaricom Daraja API into websites, apps and internal systems, covering both the customer-facing payment flow and the back-office reconciliation.",
            "Payments fail in messy ways. Our integrations are built to handle retries, duplicate callbacks and mismatched amounts so your records stay accurate.",
        ],
        features: [
            {title: "STK Push (Lipa na M-Pesa)", text: "Prompt customers to pay from their phone and confirm the result in your system."},
            {title: "C2B payments", text: "Paybill and Till number collections with validation and confirmation callbacks."},
            {title: "B2C payouts", text: "Controlled disbursements with result handling and audit trails."},
            {title: "Callback processing", text: "Idempotent callback handlers that tolerate retries and out-of-order delivery."},
            {title: "Reconciliation", text: "Match payments to invoices or orders and surface exceptions for follow-up."},
            {title: "Security and audit", text: "Signed requests, protected credentials, structured logs and access controls."},
        ],
        deliverables: [
            "Daraja sandbox and production setup",
            "Payment flow integrated into your product",
            "Callback and reconciliation logic",
            "Operational runbook for payment issues",
        ],
        tech: ["M-Pesa Daraja", "Laravel", "MySQL", "Redis", "Docker"],
    },
    {
        slug: "networking-isp",
        name: "Networking & ISP Solutions",
        short: "MikroTik and Cisco networks, WiFi hotspots, billing and voucher systems.",
        icon: "network",
        metaTitle: "MikroTik Hotspot Billing in Kenya | Teto Technologies",
        metaDescription: "MikroTik and Cisco network setup, WiFi hotspot billing, voucher systems and ISP infrastructure for Kenyan businesses.",
        intro: [
            "We design, configure and support networks for offices, hotels, apartments, schools and ISPs — from the router and access points to the billing system behind the hotspot.",
            "Our work combines hands-on MikroTik and Cisco experience with software development, so the network and the customer-facing portal are built together.",
        ],
        features: [
            {title: "MikroTik setup", text: "RouterOS configuration, routing, firewalls, queues and bandwidth management."},
            {title: "Cisco networking", text: "Switching, routing and wireless configuration for office and campus networks."},
            {title: "Hotspot billing", text: "Captive portals with packages, vouchers, expiry and usage limits."},
            {title: "Voucher systems", text: "Generate, print and track vouchers, with reseller or receptionist access."},
            {title: "ISP infrastructure", text: "PPP, RADIUS, subscriber management and monitoring for small ISPs."},
            {title: "Network documentation", text: "IP plans, topology diagrams and configuration backups you can actually use."},
        ],
        deliverables: [
            "Site survey and network design",
            "Configured routers, switches and access points",
            "Hotspot portal and billing setup",
            "Monitoring, backups and handover documentation",
        ],
        tech: ["MikroTik RouterOS", "Cisco", "RADIUS", "Linux", "Laravel"],
    },
    {
        slug: "it-support-consulting",
        name: "IT Support & Consulting",
        short: "Practical ICT support, system setup and DevOps for growing teams.",
        icon: "support",
        metaTitle: "ICT Support and DevOps in Kenya | Teto Technologies",
        metaDescription: "ICT support, Linux server setup, Docker deployment, monitoring and DevOps consulting for Kenyan businesses.",
        intro: [
            "We provide hands-on ICT support and consulting for organisations that need dependable systems without a full in-house engineering team.",
            "That includes everything from setting up email, backups and staff devices to deploying and monitoring containerised applications on Linux servers.",
        ],
        features: [
            {title: "ICT support", text: "Troubleshooting, user support, device setup and day-to-day administration."},
            {title: "Linux servers", text: "Provisioning, hardening, updates and troubleshooting for Ubuntu and Debian."},
            {title: "Docker and deployment", text: "Reproducible application stacks with nginx, PHP, MySQL and scheduled jobs."},
            {title: "Backups and recovery", text: "Automated database and file backups with tested restore procedures."},
            {title: "Monitoring", text: "Uptime, resource and error monitoring with useful alerts, not noise."},
            {title: "Consulting", text: "Technical reviews, vendor evaluation and practical roadmaps for your team."},
        ],
        deliverables: [
            "Current-state review and recommendations",
            "Configured and documented infrastructure",
            "Backup and monitoring setup",
            "Support arrangement and escalation path",
        ],
        tech: ["Linux", "Docker", "nginx", "MySQL", "GitHub Actions"],
    },
];

export const values: Value[] = [
    {
        icon: "pin",
        title: "Local context, solid engineering",
        text: "We build for Kenyan users, devices and networks — and hold the work to the same standards you would expect anywhere.",
    },
    {
        icon: "payments",
        title: "Payments and networks in one team",
        text: "M-Pesa Daraja and MikroTik experience under one roof, so the software and the infrastructure are designed together.",
    },
    {
        icon: "layers",
        title: "End-to-end delivery",
        text: "Interface, backend, database, deployment and documentation — one accountable team from scope to launch.",
    },
    {
        icon: "shield",
        title: "Support after launch",
        text: "We document what we build and stay reachable for fixes, monitoring and improvements once the site is live.",
    },
];

export const processSteps: ProcessStep[] = [
    {step: "01", title: "Discover", text: "We clarify the goal, users, constraints and what success looks like before writing code."},
    {step: "02", title: "Design", text: "Flows, screens and system architecture are agreed in plain language, with room for feedback."},
    {step: "03", title: "Build", text: "Work is delivered in reviewable stages so you can see progress and change direction early."},
    {step: "04", title: "Launch", text: "We deploy, test on real devices and networks, and hand over the documentation."},
    {step: "05", title: "Support", text: "After launch we handle fixes, monitoring and improvements under an agreed arrangement."},
];

export const tech = [
  { name: 'Laravel', hint: 'PHP framework' },
  { name: 'Vue.js', hint: 'Frontend' },
  { name: 'Flutter', hint: 'Mobile apps' },
  { name: 'MySQL', hint: 'Database' },
  { name: 'MikroTik', hint: 'Networking' },
  { name: 'Cisco', hint: 'Networking' },
  { name: 'Docker', hint: 'Deployment' },
  { name: 'M-Pesa Daraja', hint: 'Payments' },
];

/**
 * Portfolio entries are placeholders until the owner supplies approved
 * project details. Never fill these with invented clients or results.
 */
const emptyProject = (image: string): Project => ({
  title: null,
  client: 'Confidential',
  sector: null,
  summary: null,
  problem: null,
  solution: null,
  result: null,
  tech: [],
  image,
});

export const portfolio: Project[] = [
  emptyProject('/images/work-1.svg'),
  emptyProject('/images/work-2.svg'),
  emptyProject('/images/work-3.svg'),
];

/**
 * Products — apps for download and website links. Add entries with verified
 * names, descriptions and URLs. Leave fields null/empty to show a
 * TODO(owner) placeholder.
 */
export const products: Product[] = [
  {
    name: null,
    kind: 'app',
    summary: null,
    description: null,
    image: '/images/work-1.svg',
    downloadUrl: null,
    websiteUrl: null,
    platforms: [],
    status: null,
  },
];

export const seo = {
  defaultTitle: 'Teto Technologies | Software and Networks That Work in Kenya',
  defaultDescription:
    'Teto Technologies builds web apps, mobile apps, M-Pesa Daraja integrations and MikroTik network solutions for Kenyan businesses.',
  shareImage: '/images/og-default.png',
  keywords: [
    'web development Kenya',
    'mobile app developers Nairobi',
    'M-Pesa Daraja integration',
    'MikroTik hotspot billing Kenya',
    'ICT support Kenya',
  ],
};

export function findService(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function serviceName(slug: string): string {
  return findService(slug)?.name ?? slug;
}

/** Canonical site origin, without a trailing slash. */
export function siteUrl(): string {
  const explicit = env('NEXT_PUBLIC_SITE_URL');
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = env('VERCEL_PROJECT_PRODUCTION_URL');
  if (vercel) return `https://${vercel}`;
  return 'http://localhost:3000';
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, '')}`;
}

export function whatsappHref(): string | null {
  const number = (company.whatsapp ?? '').replace(/\D+/g, '');
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(company.whatsappMessage)}`;
}
