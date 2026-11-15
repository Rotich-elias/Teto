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
  url: string | null;
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
  mission: env(
    'TETO_MISSION',
    'To build dependable software and network infrastructure that helps Kenyan organisations serve their customers, students and communities better.',
  ),
  vision: env(
    'TETO_VISION',
    'To be the technology partner Kenyan organisations trust to run the systems they depend on every day.',
  ),
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
        slug: "business-email",
        name: "Business Email Hosting",
        short: "Professional email on your own domain, with mailboxes, aliases and SPF, DKIM and DMARC that pass.",
        icon: "mail",
        metaTitle: "Business Email Hosting in Kenya — Your Own Domain | Teto Technologies",
        metaDescription: "Business email hosting in Kenya on your own domain: mailboxes, aliases, webmail and IMAP/SMTP, with SPF, DKIM and DMARC configured so your mail reaches the inbox.",
        intro: [
            "Give every person and team an address at your own domain — info@, sales@ and support@ — instead of a free webmail account that customers do not quite trust.",
            "We set up the mailboxes and the DNS records behind them, including SPF, DKIM and DMARC, which is usually the single biggest fix for mail that lands in spam.",
        ],
        features: [
            {title: "Your own domain", text: "Mailboxes and shared addresses at your company domain, owned by the business rather than a personal account."},
            {title: "Mailboxes and aliases", text: "Individual mailboxes with storage you choose, plus aliases like info@ or sales@ that forward to one or more people."},
            {title: "SPF, DKIM and DMARC", text: "Sender records generated for your domain and checked until they pass, so your mail is signed and delivered."},
            {title: "Any device", text: "Webmail in the browser, plus Outlook, Apple Mail, Thunderbird and phone apps over IMAP and SMTP with TLS."},
            {title: "Forwarding and auto-reply", text: "Catch-all addresses, forwarding to a colleague, and out-of-office replies with an end date."},
            {title: "Migration and handover", text: "We move existing mail across and change the MX record last, so nothing is lost during the switch."},
        ],
        deliverables: [
            "Mailboxes and aliases created on your domain",
            "SPF, DKIM and DMARC records, checked and passing",
            "Connection settings for webmail and every mail app",
            "Migration of existing mail and a short setup guide",
        ],
        tech: ["IMAP/SMTP", "Webmail", "SPF", "DKIM", "DMARC"],
    },
    {
        slug: "cloud-hosting",
        name: "Managed Cloud Hosting",
        short: "Deploy web apps from GitHub with HTTPS, managed databases, workers and monitoring — servers run for you.",
        icon: "server",
        metaTitle: "Managed Cloud Hosting in Kenya — Deploy from GitHub | Teto Technologies",
        metaDescription: "Managed cloud hosting in Kenya: deploy Laravel, Node.js, Next.js, Python and Django apps from GitHub, with HTTPS, managed PostgreSQL, MySQL, MariaDB and Redis, workers, scheduled tasks, logs and metrics.",
        intro: [
            "We host web applications the way modern teams expect: connect a GitHub repository and every push builds and releases automatically, with HTTPS already on.",
            "The routine work of running servers — updates, monitoring, backups and capacity — is handled for you, so your team spends its time on the product instead of the infrastructure.",
        ],
        features: [
            {title: "Deploy on push", text: "Link a GitHub repository and branch; each push builds a new release and switches traffic to it, with the full build log."},
            {title: "HTTPS on every domain", text: "Point your domain and a TLS certificate is issued and renewed automatically."},
            {title: "Managed databases", text: "PostgreSQL, MySQL, MariaDB or Redis created for you and linked to your app with credentials set in its environment."},
            {title: "Workers and scheduled tasks", text: "Run queue workers next to the web process and add cron-style jobs with a history of every run and its output."},
            {title: "Metrics and logs", text: "CPU, memory and request charts plus live application logs, with persistent storage that survives every deploy."},
            {title: "Virtual and managed servers", text: "Need more control? We provision Linux virtual servers with root access, or manage servers you already run."},
        ],
        deliverables: [
            "Application deployed from your repository",
            "Databases, storage, domains and HTTPS configured",
            "Workers, scheduled tasks, backups and monitoring in place",
            "Access, environment setup and a deployment runbook",
        ],
        tech: ["GitHub", "Docker", "PostgreSQL", "MySQL", "MariaDB", "Redis", "nginx", "Let's Encrypt"],
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

export type TsoFeature = { icon: IconName; title: string; text: string };
export type TsoStep = { step: string; title: string; text: string; duration: string };
export type TsoPlan = {
  name: string;
  tagline: string;
  price: string | null; // null renders a TODO(owner) badge
  priceNote: string;
  features: string[];
  cta: string;
};

/**
 * TSO — Take Schools Online. A flagship initiative Teto is building for
 * schools, with a focus on senior secondary schools. The price is
 * owner-confirmed; the surrounding copy is a first draft to confirm.
 */
export const tso = {
  name: 'TSO',
  fullName: 'Take Schools Online',
  status: 'In development',
  lead: 'A flagship Teto initiative that gives schools a proper home online — a professionally built website, digital communication with parents and students, and the systems behind admissions, records and fees.',
  why: [
    'Parents and students look a school up online before they ever visit. A school with no website is easy to overlook.',
    'Notices, fee reminders and results still travel by phone calls, SMS chains and paper, which is slow and easy to lose.',
    'Schools run on records that should be searchable, backed up and safe — not scattered across exercise books and spreadsheets.',
  ],
  steps: [
    { step: '01', title: 'Tell us about your school', text: 'Send us your school details and what you want online. We reply with a short scope and the next steps.', duration: 'Reply within 2 business days' },
    { step: '02', title: 'We build it for you', text: 'Our team designs and builds the website and the systems behind it. No technical knowledge is needed from your side.', duration: 'Typically 2–3 weeks' },
    { step: '03', title: 'Go live and stay supported', text: 'Your school goes live, and we stay on for hosting, fixes and improvements as the school grows.', duration: 'Ongoing support' },
  ],
  features: [
    { icon: 'web', title: 'School website', text: 'A fast, mobile-first website that presents the school, its programmes, staff, news and contacts.' },
    { icon: 'mail', title: 'Online admissions & enquiries', text: 'A clear enquiry and application path that reaches the right office instead of a personal phone number.' },
    { icon: 'phone', title: 'Parent & student communication', text: 'Announcements, reminders and updates published where parents and students can find them.' },
    { icon: 'layers', title: 'Digital student records', text: 'Student, class and staff records kept in one place, with role-based access for the people who need them.' },
    { icon: 'check-circle', title: 'Results & reporting', text: 'Internal assessments and reports captured digitally and shared with the right people, when they need them.' },
    { icon: 'payments', title: 'M-Pesa fee payments', text: 'Fee and activity payments collected through M-Pesa Daraja, with records reconciled against the student.' },
  ],
  plan: {
    name: 'Standard',
    tagline: 'A professionally built school website, fully managed.',
    price: 'KES 10,000',
    priceNote: 'per year, all-in',
    features: [
      'A custom-built school website',
      'Your own domain and hosting, set up for you',
      'Pages for admissions, news, staff and contacts',
      'Parent and student communication',
      'M-Pesa fee payments',
      'Ongoing maintenance and support',
    ],
    cta: 'Enquire about the Standard package',
  },
  audiences: ['Senior secondary schools', 'Boarding and day schools', 'School groups and academies'],
} satisfies {
  name: string;
  fullName: string;
  status: string;
  lead: string;
  why: string[];
  steps: TsoStep[];
  features: TsoFeature[];
  plan: TsoPlan;
  audiences: string[];
};

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
 * Client work and in-house products. `problem` and `solution` describe what was
 * built; `result` stays null until the owner supplies a verified outcome. Never
 * invent clients, metrics or results.
 */
export const portfolio: Project[] = [
  {
    title: 'Bhilzak Construction and Supplies',
    client: 'Bhilzak Construction and Supplies Limited',
    sector: 'Construction',
    summary: 'A Kenyan building contractor and supplier of precast concrete, steel and paving products.',
    problem:
      'Bhilzak needed one credible online home to win construction contracts and sell its own precast, steel and paving products.',
    solution:
      'A Next.js website with service and project pages, an online supplies catalogue and quote-request flows, built to load quickly on mobile.',
    result: 'Site, supplies catalogue and quote form delivered and live at bhilzak.vercel.app.',
    tech: ['Next.js', 'React'],
    image: '/images/work-bhilzak.png',
    url: 'https://bhilzak.vercel.app',
  },
  {
    title: 'UkweliTally',
    client: 'Teto Technologies',
    sector: 'Civic technology',
    summary: 'Independent election results tallying for candidates, agents and observers.',
    problem:
      'Results are captured at tens of thousands of polling stations and have to be aggregated and trusted quickly, often on poor networks.',
    solution:
      'An offline-first Next.js PWA that captures Form 34A photos with GPS, extracts numbers with OCR, applies role-based access and tallies results in real time from station to county.',
    result: 'Platform delivered and live at ukwelitally.teto.co.ke, tallying from polling station to county.',
    tech: ['Next.js', 'React', 'Tailwind CSS'],
    image: '/images/work-ukwelitally.png',
    url: 'https://ukwelitally.teto.co.ke/',
  },
  {
    title: 'Techlup',
    client: 'Techlup',
    sector: 'Cloud & IT services',
    summary: 'Business email, managed cloud hosting and custom software development.',
    problem:
      'Techlup needed to present business email, managed hosting and custom software to a non-technical audience in one place.',
    solution:
      'A fast React single-page site with light and dark theming that explains the email, hosting and software services and routes enquiries.',
    result: 'Site delivered and live at techlup.co.ke, presenting email, hosting and software services in one place.',
    tech: ['React', 'Vite', 'Tailwind CSS'],
    image: '/images/work-techlup.png',
    url: 'https://techlup.co.ke/',
  },
  {
    title: 'CAFHED',
    client: 'Community Alliance for Health and Development',
    sector: 'Health & development',
    summary: 'Community health and development programmes across Kenya, built around the EMPOWER360 model.',
    problem:
      'A community health organisation needed to present its programmes, impact and donation options to partners and the public.',
    solution:
      'A Laravel website with programme, impact, gallery, news and donation pages, including M-Pesa and bank donation details.',
    result: 'Site delivered and live at cafhedkenya.org, publishing programmes, impact and donation options.',
    tech: ['Laravel', 'Bootstrap'],
    image: '/images/work-cafhed.png',
    url: 'http://cafhedkenya.org/',
  },
];

/**
 * Products — apps for download and website links. Add entries with verified
 * names, descriptions and URLs. Leave fields null/empty to show a
 * TODO(owner) placeholder.
 */
export const products: Product[] = [
  {
    name: 'UkweliTally',
    kind: 'app',
    summary: 'Independent election results tallying for candidates, agents and observers.',
    description:
      'Photo and GPS evidence on every result, offline-first capture, role-based access and real-time tallying from polling station to county.',
    image: '/images/work-ukwelitally.png',
    downloadUrl: null,
    websiteUrl: 'https://ukwelitally.teto.co.ke/',
    platforms: ['Web (PWA)'],
    status: 'Available',
  },
  {
    // Owner will supply the product name, screenshot and share link.
    name: null,
    kind: 'app',
    summary: "Teto's own notes and to-do list app.",
    description: null,
    image: null,
    downloadUrl: null,
    websiteUrl: null,
    platforms: [],
    status: 'Coming soon',
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
    'business email hosting Kenya',
    'managed cloud hosting Kenya',
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
