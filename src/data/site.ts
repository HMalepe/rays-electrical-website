import board from '@/assets/svc-db-board.asset.json';
import breaker from '@/assets/svc-breaker-panel.asset.json';
import lighting from '@/assets/svc-lighting.asset.json';
import sockets from '@/assets/svc-sockets.asset.json';

export const site = { phone: '067 686 7657', tel: '+27676867657', whatsapp: '27676867657', email: 'rayelectrical25@gmail.com' };
export const services = [
  { number: '01', title: 'DB board wiring', category: 'SAFE. ORGANISED. RELIABLE.', description: 'Distribution board wiring, upgrades and fault-finding. The foundation of a safer, more reliable electrical system.', image: board.url },
  { number: '02', title: 'Circuit breaker repairs', category: 'GET YOUR POWER BACK.', description: 'Tripping breakers or a faulty panel? Get the problem identified and your power running reliably again.', image: breaker.url },
  { number: '03', title: 'Lighting installation', category: 'A BETTER LIGHT ON LIFE.', description: 'From a single fitting to a full renovation. Thoughtful lighting installations and repairs for your space.', image: lighting.url },
  { number: '04', title: 'Plugs & socket repairs', category: 'THE SMALL THINGS MATTER.', description: 'Dead, loose or damaged sockets repaired or replaced. Practical attention to the details you use every day.', image: sockets.url },
];
export const steps = [
  { title: 'Let’s talk.', text: 'Tell Ray what you need. A quick call, WhatsApp message or photo is a great place to start.' },
  { title: 'Get a free estimate.', text: 'Your requirements are considered before you receive an initial estimate. Clear information, without the pressure.' },
  { title: 'Agree the plan.', text: 'The work, materials and price are agreed before getting started. You know what to expect.' },
  { title: 'Back to life.', text: 'Your electrical work is completed with care, so you can get back to the things that matter.' },
];
export function pageHead(title: string, description: string) { return { meta: [{ title: `${title} — Ray Electrical` }, { name: 'description', content: description }, { property: 'og:title', content: `${title} — Ray Electrical` }, { property: 'og:description', content: description }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' }] }; }