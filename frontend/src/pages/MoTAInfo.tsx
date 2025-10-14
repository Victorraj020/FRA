import React from 'react';
import { FileText, Home, Info, Newspaper, PhoneCall } from 'lucide-react';

const MoTAInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header bars removed for MoTA route per request */}

      {/* About the Ministry - Top Section with Leaders */}
      <section className="container mx-auto px-4 py-8" id="about-top">
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          {/* Hon'ble Minister */}
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="w-full flex items-center justify-center">
              <img
                src="https://tribal.nic.in/images/minister_JO.png"
                alt="Hon'ble Minister"
                className="h-56 w-auto object-contain rounded-md"
              />
            </div>
            <div className="mt-3">
              <div className="font-semibold">Shri Jual Oram</div>
              <div className="text-sm text-muted-foreground">Hon'ble Minister</div>
            </div>
          </div>

          {/* About text */}
          <div className="bg-card border rounded-lg p-6 lg:col-span-1 lg:order-none order-first">
            <h2 className="text-xl font-semibold mb-3">About the Ministry</h2>
            <p className="text-sm text-muted-foreground leading-6">
              The Ministry was set up in 1999 after the bifurcation of Ministry of Social Justice and Empowerment with the objective of providing more focused approach on the integrated socio-economic development of the Scheduled Tribes (STs).
            </p>
            <p className="text-sm text-muted-foreground leading-6 mt-3">
              The programmes and schemes of the Ministry are intended to support and supplement other Central Ministries, State Governments and partly of voluntary organizations, and to fill critical gaps in institutions and programmes taking into account the situation of STs through financial assistance. These schemes comprising economic, educational and social development through institution building are administered by the Ministry and implemented mainly through the State Governments/ Union Territory Administrations. The Ministry also supplements the efforts of other Ministries by way of various developmental interventions in critical sectors through specially tailored schemes.
            </p>
          </div>

          {/* Hon'ble Minister of State */}
          <div className="bg-card border rounded-lg p-4 text-center">
            <div className="w-full flex items-center justify-center">
              <img
                src="https://tribal.nic.in/images/MoS_DU.png"
                alt="Hon'ble Minister of State"
                className="h-56 w-auto object-contain rounded-md"
              />
            </div>
            <div className="mt-3">
              <div className="font-semibold">Shri Durgadas Uikey</div>
              <div className="text-sm text-muted-foreground">Hon'ble Minister of State</div>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Banner */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-4xl">
            <h1 className="text-2xl md:text-4xl font-bold">Janjatiya Gaurav Varsh</h1>
            <p className="mt-3 text-white/90 max-w-2xl">Celebrating heritage, inclusion and empowerment. Explore schemes, dashboards, and official notifications from the Ministry of Tribal Affairs.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#schemes" className="bg-white text-blue-700 px-4 py-2 rounded font-medium hover:bg-white/90">View Schemes</a>
              <a href="#knowledge" className="bg-white/10 backdrop-blur px-4 py-2 rounded border border-white/30 hover:bg-white/15">Knowledge Hub</a>
            </div>
          </div>
        </div>
      </section>

      {/* About + Leaders */}
      <section id="about" className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          <div className="md:col-span-2 bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">About the Ministry</h2>
            <p className="text-muted-foreground">The Ministry was set up in 1999 to provide focused attention on the integrated socio-economic development of the Scheduled Tribes (STs). Programmes support State/UT Administrations in addressing critical gaps across education, health, livelihoods and digital empowerment through centrally sponsored schemes and mission-mode initiatives.</p>
            <a href="#knowledge" className="inline-block mt-4 text-primary hover:underline">Know More…</a>
          </div>
          <div className="space-y-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Hon'ble Minister</div>
              <div className="font-semibold">Shri Minister Name</div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="text-sm text-muted-foreground">Hon'ble Minister of State</div>
              <div className="font-semibold">Shri Minister of State</div>
            </div>
          </div>
        </div>
      </section>

      {/* At-a-glance statistics */}
      <section className="container mx-auto px-4 pb-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">EMRS Schools</div>
            <div className="text-2xl font-bold">400+</div>
            <div className="text-xs text-muted-foreground">Operational/under construction</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Scholarship Beneficiaries</div>
            <div className="text-2xl font-bold">1.2M</div>
            <div className="text-xs text-muted-foreground">Pre & Post Matric schemes</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">PVTG Mission Blocks</div>
            <div className="text-2xl font-bold">100+</div>
            <div className="text-xs text-muted-foreground">Holistic development focus</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Skill & Entrepreneurship</div>
            <div className="text-2xl font-bold">5,000+</div>
            <div className="text-xs text-muted-foreground">Training & livelihood units</div>
          </div>
        </div>
      </section>

      {/* Key schemes */}
      <section id="schemes" className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Flagship Schemes</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#">
            <div className="font-medium">Eklavya Model Residential Schools (EMRS)</div>
            <div className="text-sm text-muted-foreground mt-1">Residential schooling for tribal students from Class VI–XII</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#">
            <div className="font-medium">Scholarships (Pre / Post Matric)</div>
            <div className="text-sm text-muted-foreground mt-1">Financial assistance for access to quality education</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#">
            <div className="font-medium">PVTG Development Mission</div>
            <div className="text-sm text-muted-foreground mt-1">Multi-sectoral interventions for Particularly Vulnerable Tribal Groups</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#">
            <div className="font-medium">Van Dhan Vikas</div>
            <div className="text-sm text-muted-foreground mt-1">NTFP-based enterprise & value addition through SHGs</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#">
            <div className="font-medium">Aadi Adarsh Gram Yojana</div>
            <div className="text-sm text-muted-foreground mt-1">Village-level infrastructure and basic amenities in TSP areas</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#">
            <div className="font-medium">Grants-in-Aid to VOs/NGOs</div>
            <div className="text-sm text-muted-foreground mt-1">Support to eligible organizations for service delivery</div>
          </a>
        </div>
      </section>

      {/* Divisions */}
      <section id="divisions" className="container mx-auto px-4 pb-8">
        <h2 className="text-xl font-semibold mb-4">Divisions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="font-medium">Policy & Research</div>
            <div className="text-sm text-muted-foreground">Policy formulation, monitoring & evaluation, analytics</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="font-medium">Education & EMRS</div>
            <div className="text-sm text-muted-foreground">Schooling, scholarships, higher education fellowships</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="font-medium">Livelihoods & NTFP</div>
            <div className="text-sm text-muted-foreground">Entrepreneurship, value chains, TRIFED linkages</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="font-medium">PVTG Mission</div>
            <div className="text-sm text-muted-foreground">Integrated initiatives in PVTG habitations</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="font-medium">IT & Digital Platforms</div>
            <div className="text-sm text-muted-foreground">Portals, dashboards, analytics and citizen services</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="font-medium">Administration & Finance</div>
            <div className="text-sm text-muted-foreground">Grants, schemes financials and coordination</div>
          </div>
        </div>
      </section>

      {/* Contact & Downloads */}
      <section id="knowledge" className="container mx-auto px-4 pb-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="font-semibold mb-2">Key Downloads</div>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside">
              <li><a className="hover:underline" href="#">Citizen Charter (PDF)</a></li>
              <li><a className="hover:underline" href="#">EMRS Guidelines</a></li>
              <li><a className="hover:underline" href="#">Scholarship FAQs</a></li>
              <li><a className="hover:underline" href="#">PVTG Mission Handbook</a></li>
            </ul>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="font-semibold mb-2">Helpline & Contact</div>
            <div className="text-sm text-muted-foreground">For official communication and scheme-specific queries.</div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="p-3 rounded-md border bg-muted/30">
                <div className="font-medium">Citizen Helpline</div>
                <div className="text-muted-foreground">1800-123-456 (Mon–Fri)</div>
              </div>
              <div className="p-3 rounded-md border bg-muted/30">
                <div className="font-medium">Email</div>
                <div className="text-muted-foreground">support@mota.gov.in</div>
              </div>
              <div className="p-3 rounded-md border bg-muted/30">
                <div className="font-medium">Address</div>
                <div className="text-muted-foreground">Shastri Bhawan, New Delhi</div>
              </div>
              <div className="p-3 rounded-md border bg-muted/30">
                <div className="font-medium">Social</div>
                <div className="text-muted-foreground">Twitter • Facebook • YouTube</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section id="divisions" className="container mx-auto px-4 pb-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#schemes">
            <div className="font-medium">Schemes</div>
            <div className="text-sm text-muted-foreground">Scholarships, EMRS, livelihoods, health mission</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#it">
            <div className="font-medium">IT Initiatives</div>
            <div className="text-sm text-muted-foreground">Portals, dashboards and digital services</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#knowledge">
            <div className="font-medium">Knowledge Hub</div>
            <div className="text-sm text-muted-foreground">Circulars, advisories and user manuals</div>
          </a>
          <a className="bg-card border rounded-lg p-4 hover:border-primary transition-colors" href="#contact">
            <div className="font-medium">Contact</div>
            <div className="text-sm text-muted-foreground">Reach out for official information</div>
          </a>
        </div>
      </section>

      {/* Updates */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2"><Newspaper className="w-5 h-5"/> Recent Updates</h2>
          <a href="#knowledge" className="text-sm text-primary hover:underline">Explore All</a>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-card border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Posted on 30/09/2025</div>
            <div className="mt-2 font-medium">Extension of deadline for application submission — National Fellowship for Higher Education</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Posted on 31/08/2025</div>
            <div className="mt-2 font-medium">Compendium of Advisories</div>
          </div>
          <div className="bg-card border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Posted on 15/08/2025</div>
            <div className="mt-2 font-medium">EMRS operational guidelines update</div>
          </div>
        </div>
      </section>

      {/* Footer-lite */}
      <footer id="contact" className="bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
          <div>
            <div className="font-semibold mb-2">Ministry of Tribal Affairs</div>
            <p className="text-sm text-muted-foreground">For authoritative information, refer to official circulars and notifications published by the Ministry.</p>
          </div>
          <div>
            <div className="font-semibold mb-2">Key Portals</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Performance Dashboard</li>
              <li>GEET Grants Portal</li>
              <li>GOAL Program</li>
            </ul>
          </div>
          <div>
            <div className="font-semibold mb-2">Contact</div>
            <p className="text-sm text-muted-foreground">Visit the official website's Contact section for latest details.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MoTAInfo;
