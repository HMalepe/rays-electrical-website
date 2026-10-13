export const site = {
  name: "Ray Electrical",
  phone: "067 686 7657",
  tel: "+27676867657",
  whatsapp: "27676867657",
  email: "rayelectrical25@gmail.com",
  address: ["Willow Ave, Fourways", "Sandton, 2191", "South Africa"],
  areas: ["Fourways", "Sandton"],
  coordinates: "26°01′ S  28°00′ E",
  tagline: "Power. Done right.",
  promise: "The handyman you can count on.",
};

export const nav = [
  { to: "/" as const, label: "Home" },
  { to: "/services" as const, label: "Services" },
  { to: "/process" as const, label: "Process" },
  { to: "/about" as const, label: "About Ray" },
  { to: "/contact" as const, label: "Contact" },
];

export type ServiceKey = "board" | "breaker" | "light" | "socket";

export const services: {
  key: ServiceKey;
  number: string;
  title: string;
  short: string;
  category: string;
  description: string;
  scope: string[];
}[] = [
  {
    key: "board",
    number: "01",
    title: "DB board wiring",
    short: "Boards",
    category: "Safe. Organised. Reliable.",
    description:
      "Distribution board wiring, upgrades and fault-finding. The foundation of a safer, more reliable electrical system.",
    scope: ["Board wiring", "Upgrades", "Fault-finding"],
  },
  {
    key: "breaker",
    number: "02",
    title: "Circuit breaker repairs",
    short: "Breakers",
    category: "Get your power back.",
    description:
      "Tripping breakers or a faulty panel? Get the problem identified and your power running reliably again.",
    scope: ["Tripping breakers", "Faulty panels", "Diagnosis"],
  },
  {
    key: "light",
    number: "03",
    title: "Lighting installation",
    short: "Lighting",
    category: "A better light on life.",
    description:
      "From a single fitting to a full renovation. Thoughtful lighting installations and repairs for your space.",
    scope: ["Single fittings", "Renovations", "Repairs"],
  },
  {
    key: "socket",
    number: "04",
    title: "Plugs & socket repairs",
    short: "Sockets",
    category: "The small things matter.",
    description:
      "Dead, loose or damaged sockets repaired or replaced. Practical attention to the details you use every day.",
    scope: ["Dead sockets", "Loose fittings", "Replacements"],
  },
];

export const steps = [
  {
    title: "Let’s talk.",
    text: "Tell Ray what you need. A quick call, WhatsApp message or photo is a great place to start.",
  },
  {
    title: "Get a free estimate.",
    text: "Your requirements are considered before you receive an initial estimate. Clear information, without the pressure.",
  },
  {
    title: "Agree the plan.",
    text: "The work, materials and price are agreed before getting started. You know what to expect.",
  },
  {
    title: "Back to life.",
    text: "Your electrical work is completed with care, so you can get back to the things that matter.",
  },
];

export const principles = [
  {
    title: "Clear communication.",
    text: "You hear what the problem is, what it takes to fix, and what it costs, before work begins.",
  },
  {
    title: "Careful workmanship.",
    text: "Every termination, every fitting, every circuit is done properly, not just quickly.",
  },
  {
    title: "Respect for your space.",
    text: "Your home or business is treated like it matters, because it does.",
  },
];

export const facts = [
  "Residential & commercial",
  "Free initial estimates",
  "Materials & labour supplied",
  "No job too small",
];

export const manifesto =
  "A home isn’t just wires and walls. It’s where life happens. Ray brings a personal approach to electrical work: clear, practical and straightforward, from the board to the last light bulb.";

export function whatsappLink(text?: string) {
  return `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — Ray Electrical` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — Ray Electrical` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
