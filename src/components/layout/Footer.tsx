
import { Link } from 'react-router';

export function Footer() {
  const footerLinks = [
    { title: "Comics", links: [["New Releases", "/browse?sort=New"], ["Best Sellers", "/browse?sort=Popular"], ["All Titles", "/browse"], ["Plans", "/plans"]] },
    { title: "Account", links: [["My Dashboard", "/dashboard"], ["My Library", "/library"], ["Login", "/login"]] },
    { title: "Company", links: [["Contact Us", "/contact"], ["Terms & Conditions", "/terms"], ["Privacy Policy", "/privacy"]] },
  ];

  return (
    <footer className="bg-[#0D0D0D] border-t-8 border-[#C8181E] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-4 group mb-6">
              <img src="/logo.jpeg" alt="Lekhyas Studio" className="w-20 h-20 rounded-full object-cover border-[3px] border-[#F5C518] shadow-lg shadow-[#F5C518]/20 transition-transform group-hover:scale-105" />
              <div>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.08em", color: "#FFF" }}>LEKHYAS</span>
                <span style={{ fontFamily: "Bangers, cursive", fontSize: "32px", letterSpacing: "0.08em", color: "#F5C518" }}> STUDIO</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm mb-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Bringing legendary stories to life through breathtaking artwork and immersive narratives.
            </p>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white mb-6 font-bold" style={{ fontFamily: "Bangers, cursive", fontSize: "20px", letterSpacing: "0.05em" }}>{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map(([name, url]) => (
                  <li key={name}>
                    <Link to={url} className="text-white/60 hover:text-[#F5C518] text-sm font-bold transition-colors uppercase tracking-wider" style={{ fontFamily: "DM Sans, sans-serif" }}>
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t-2 border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm font-medium" style={{ fontFamily: "DM Sans, sans-serif" }}>
            &copy; {new Date().getFullYear()} Lekhyas Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
