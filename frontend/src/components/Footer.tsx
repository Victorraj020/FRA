import React, { useState, useEffect } from 'react';
import { MapPin, ArrowUp, ExternalLink, Heart, Github, Twitter, Linkedin, Mail, FileText, Shield, Activity } from 'lucide-react';

const Footer: React.FC = () => {
const [isVisible, setIsVisible] = useState(false);
const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
const [showScrollTop, setShowScrollTop] = useState(false);
const [email, setEmail] = useState('');

useEffect(() => {
setIsVisible(true);
}, []);

useEffect(() => {
const handleScroll = () => {
setShowScrollTop(window.scrollY > 300);
};
window.addEventListener('scroll', handleScroll);
return () => window.removeEventListener('scroll', handleScroll);
}, []);

const scrollToTop = () => {
window.scrollTo({
top: 0,
behavior: 'smooth'
});
};

const scrollToSection = (sectionId: string) => {
const element = document.getElementById(sectionId);
if (element) {
element.scrollIntoView({ behavior: 'smooth' });
}
};

const handleNewsletterSubmit = (e: React.FormEvent) => {
e.preventDefault();
if (email) {
// Here you would typically send the email to your backend
console.log('Newsletter signup:', email);
alert('Thank you for subscribing to our newsletter!');
setEmail('');
}
};

return (
<footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden">
{/* Animated Background Elements */}
<div className="absolute inset-0 opacity-5">
<div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
<div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-pulse delay-1000"></div>
<div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-pulse delay-2000"></div>
</div>

<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
{/* Main Footer Content */}
<div className={`grid grid-cols-1 md:grid-cols-4 gap-8 py-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
{/* Brand Section */}
<div className="col-span-1 md:col-span-2">
<div className="flex items-center space-x-3 mb-6 group">
<div className="w-12 h-12 bg-gradient-to-br from-white to-gray-200 rounded-xl flex items-center justify-center border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-300">
<MapPin className="w-6 h-6 text-black" />
</div>
<div>
<h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
FRA Portal
</h3>
<p className="text-gray-300 font-medium">Forest Rights Administration</p>
</div>
</div>
<p className="text-gray-300 leading-relaxed max-w-md mb-6">
Empowering forest communities through digital innovation and comprehensive forest rights management solutions.
</p>

{/* Newsletter Signup */}
<div className="mb-6">
<h5 className="text-white font-semibold mb-3">Stay Updated</h5>
<form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
<input
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Enter your email"
className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-2 focus:ring-white focus:ring-opacity-20 transition-all duration-300"
required
/>
<button
type="submit"
className="px-6 py-2 bg-gradient-to-r from-white to-gray-200 text-black font-semibold rounded-lg hover:from-gray-200 hover:to-white transition-all duration-300 hover:scale-105"
>
Subscribe
</button>
</form>
<p className="text-xs text-gray-400 mt-2">Get updates on forest rights and community initiatives</p>
</div>

{/* Social Links */}
<div className="flex space-x-4">
<a 
href="https://github.com/fra-portal" 
target="_blank" 
rel="noopener noreferrer"
className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
title="Visit our GitHub repository"
>
<Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
</a>
<a 
href="https://twitter.com/fraportal" 
target="_blank" 
rel="noopener noreferrer"
className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
title="Follow us on Twitter"
>
<Twitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
</a>
<a 
href="https://linkedin.com/company/fra-portal" 
target="_blank" 
rel="noopener noreferrer"
className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
title="Connect with us on LinkedIn"
>
<Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
</a>
<a 
href="mailto:support@fraportal.gov.in" 
className="w-10 h-10 bg-gray-800 hover:bg-white hover:text-black rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group"
title="Contact us via email"
>
<Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
</a>
</div>
</div>

{/* Explore Section */}
<div className="space-y-4">
<h4 className="text-xl font-bold text-white mb-6 relative">
Explore
<div className="absolute -bottom-2 left-0 w-8 h-1 bg-gradient-to-r from-white to-gray-400 rounded-full"></div>
</h4>
<ul className="space-y-3">
{[
{ name: 'FAQ', href: '#faq', action: () => scrollToSection('faq') },
{ name: 'Contact Us', href: '#contact', action: () => scrollToSection('contact') },
{ name: 'Back to Top', href: '#top', action: scrollToTop }
].map((item, index) => (
<li key={item.name}>
<button
onClick={item.action}
className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group text-left"
>
<span className="group-hover:text-white transition-colors duration-300">
{item.name}
</span>
{item.name === 'Back to Top' && (
<ArrowUp className="w-4 h-4 ml-2 group-hover:animate-bounce" />
)}
</button>
</li>
))}
</ul>
</div>

{/* Resources Section */}
<div className="space-y-4">
<h4 className="text-xl font-bold text-white mb-6 relative">
Resources
<div className="absolute -bottom-2 left-0 w-8 h-1 bg-gradient-to-r from-white to-gray-400 rounded-full"></div>
</h4>
<ul className="space-y-3">
{[
{ 
  name: 'Documentation', 
  href: '/docs', 
  icon: FileText,
  description: 'User guides and API documentation'
},
{ 
  name: 'Security', 
  href: '/security', 
  icon: Shield,
  description: 'Security policies and data protection'
},
{ 
  name: 'Status', 
  href: '/status', 
  icon: Activity,
  description: 'System status and uptime monitoring'
}
].map((item) => (
<li key={item.name}>
<a 
href={item.href}
className="text-gray-300 hover:text-white hover:translate-x-2 transition-all duration-300 flex items-center group"
title={item.description}
>
<item.icon className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
<span className="group-hover:text-white transition-colors duration-300">
{item.name}
</span>
<ExternalLink className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</a>
</li>
))}
</ul>
</div>
</div>

{/* Bottom Section */}
<div className={`border-t border-gray-700 py-8 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
<div className="text-gray-400 text-sm">
<p>&copy; {currentYear} FRA Portal. All rights reserved.</p>
</div>

<div className="flex items-center space-x-2 text-gray-400 text-sm">
<span>Made with</span>
<Heart className="w-4 h-4 text-red-500 animate-pulse" />
<span>for forest communities</span>
</div>
</div>
</div>
</div>

{/* Scroll to Top Button */}
{showScrollTop && (
<button
onClick={scrollToTop}
className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group animate-in slide-in-from-bottom-4"
title="Back to top"
>
<ArrowUp className="w-6 h-6 mx-auto group-hover:animate-bounce" />
</button>
)}
</footer>
);
};

export default Footer;
