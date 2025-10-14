import React from 'react';

const GovFooter: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-8 text-gray-800">
      {/* Top logos marquee (auto-scrolling) */}
      <div className="w-full border-b bg-white">
        <div className="container mx-auto px-0 py-6 overflow-hidden relative">
          <div className="whitespace-nowrap flex items-center">
            {/* Duplicate strips for seamless loop */}
            <div className="inline-flex items-center gap-14 pr-14 animate-[scrollX_30s_linear_infinite]">
              <img src="https://tribal.nic.in/images/Client-logo/nstfdc.png" alt="NSTFDC" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/pib_logo.png" alt="PIB" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/IndiaCode.png" alt="India Code" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/nvsp.png" alt="NVSP" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/Utsav-logo2.png" alt="Utsav" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/logo_bhuvan.png" alt="Bhuvan" className="h-14 md:h-16 object-contain" />
            </div>
            <div className="inline-flex items-center gap-14 pr-14 animate-[scrollX_30s_linear_infinite]" aria-hidden="true">
              <img src="https://tribal.nic.in/images/Client-logo/nstfdc.png" alt="NSTFDC" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/pib_logo.png" alt="PIB" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/IndiaCode.png" alt="India Code" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/nvsp.png" alt="NVSP" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/Utsav-logo2.png" alt="Utsav" className="h-14 md:h-16 object-contain" />
              <img src="https://tribal.nic.in/images/Client-logo/logo_bhuvan.png" alt="Bhuvan" className="h-14 md:h-16 object-contain" />
            </div>
          </div>
          {/* Keyframes for marquee */}
          <style>{`
            @keyframes scrollX { from { transform: translateX(0); } to { transform: translateX(-100%); } }
          `}</style>
        </div>
      </div>

      {/* Middle nav bar */}
      <div className="w-full bg-[#0e6c8f] text-white text-sm">
        <div className="container mx-auto px-4 py-3 overflow-x-auto">
          <ul className="flex gap-6 whitespace-nowrap">
            <li>Public Grievances</li>
            <li>RTI</li>
            <li>Website Policy</li>
            <li>Copyright Policy</li>
            <li>FAQ</li>
            <li>Related Websites</li>
            <li>Tenders, Vacancies & Advertisement</li>
            <li>Web Information Manager</li>
            <li>Feedback</li>
            <li>Disclaimer</li>
            <li>Help</li>
          </ul>
        </div>
      </div>

      {/* Bottom info row */}
      <div className="container mx-auto px-4 py-6 text-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p>
            Website Content Owned by <strong>Ministry Of Tribal Affairs, Government of India</strong><br/>
            Designed, Developed and Hosted by <strong>National Informatics Centre( NIC )</strong><br/>
            Last Updated: <strong>13 Oct 2025</strong>
          </p>
          <div className="md:text-right">
            <div className="font-medium">Follow Us</div>
            <div className="flex gap-4 mt-2">
              <span className="text-pink-600">IG</span>
              <span className="text-blue-500">X</span>
              <span className="text-red-500">YT</span>
              <span className="text-blue-600">FB</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GovFooter;


