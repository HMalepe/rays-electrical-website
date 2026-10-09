import { createFileRoute } from '@tanstack/react-router';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import { ContactBand } from '@/components/site/SiteShell';
import { pageHead } from '@/data/site';
export const Route = createFileRoute('/services')({ head: () => pageHead('Electrical services', 'Explore Ray’s distribution board wiring, circuit breaker repairs, lighting installation, and socket repairs in Fourways and Sandton.'), component: ServicesPage });
function ServicesPage() { return <main><section className="page-intro"><span className="eyebrow">OUR EXPERTISE</span><h1>Good connections.<br /><em>Better living.</em></h1><p>Electrical solutions for homes and businesses. From the everyday fix to the bigger project.</p></section><section className="light-section"><ServiceGrid /></section><ContactBand /></main>; }