import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin, Phone, Send, CheckCircle, User, MessageSquare } from 'lucide-react';

const ContactSection: React.FC = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [message, setMessage] = useState('');
const [submitted, setSubmitted] = useState(false);

const onSubmit = (e: React.FormEvent) => {
e.preventDefault();
try {
// In this demo, we just simulate a submit.
setSubmitted(true);
setName('');
setEmail('');
setMessage('');
// Reset success message after 3 seconds
setTimeout(() => setSubmitted(false), 3000);
} catch {}
};

return (
  <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-white scroll-mt-24 md:scroll-mt-32 z-0">
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
{/* Header Section */}
<div className="text-center mb-16">
<h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 tracking-tight">
Get In Touch
</h2>
<p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
Have questions or feedback about the FRA Portal? We'd love to hear from you. 
Send us a message and we'll get back to you as soon as possible.
</p>
<div className="w-24 h-1 bg-black mx-auto rounded-full"></div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
{/* Contact Form */}
<div className="lg:col-span-2">
<Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
<CardHeader className="pb-6">
<CardTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
<MessageSquare className="w-6 h-6 text-black" />
Send us a Message
</CardTitle>
<p className="text-muted-foreground">
Fill out the form below and we'll respond within 24 hours
</p>
</CardHeader>
<CardContent>
<form onSubmit={onSubmit} className="space-y-6">
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="flex items-center gap-2 text-sm font-semibold text-foreground">
<User className="w-4 h-4" />
Full Name
</label>
<Input 
value={name} 
onChange={(e) => setName(e.target.value)} 
required 
className="h-12 border-2 border-gray-200 focus:border-black transition-colors rounded-lg"
placeholder="Enter your full name"
/>
</div>
<div className="space-y-2">
<label className="flex items-center gap-2 text-sm font-semibold text-foreground">
<Mail className="w-4 h-4" />
Email Address
</label>
<Input 
type="email" 
value={email} 
onChange={(e) => setEmail(e.target.value)} 
required 
className="h-12 border-2 border-gray-200 focus:border-black transition-colors rounded-lg"
placeholder="Enter your email address"
/>
</div>
</div>
<div className="space-y-2">
<label className="flex items-center gap-2 text-sm font-semibold text-foreground">
<MessageSquare className="w-4 h-4" />
Message
</label>
<Textarea 
value={message} 
onChange={(e) => setMessage(e.target.value)} 
rows={6} 
required 
className="border-2 border-gray-200 focus:border-black transition-colors rounded-lg resize-none"
placeholder="Tell us how we can help you..."
/>
</div>

{/* Submit Button and Success Message */}
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
<Button 
type="submit" 
className="bg-black text-white hover:bg-gray-800 px-8 py-3 h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
>
<Send className="w-4 h-4" />
Send Message
</Button>
{submitted && (
<div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
<CheckCircle className="w-5 h-5" />
<span className="font-medium">Message sent successfully! We'll get back to you soon.</span>
</div>
)}
</div>
</form>
</CardContent>
</Card>
</div>

{/* Contact Information */}
<div className="space-y-6">
{/* Support Card */}
<Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
<CardHeader className="pb-4">
<CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
<Mail className="w-6 h-6 text-black" />
Support
</CardTitle>
</CardHeader>
<CardContent className="space-y-4">
<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
<Mail className="w-5 h-5 text-gray-600" />
<div>
<p className="text-sm font-medium text-gray-600">Email</p>
<p className="font-semibold text-foreground">support@fraportal.example</p>
</div>
</div>
<div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
<Phone className="w-5 h-5 text-gray-600" />
<div>
<p className="text-sm font-medium text-gray-600">Phone</p>
<p className="font-semibold text-foreground">+91 98765 43210</p>
</div>
</div>
</CardContent>
</Card>

{/* Address Card */}
<Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300">
<CardHeader className="pb-4">
<CardTitle className="text-xl font-bold text-foreground flex items-center gap-3">
<MapPin className="w-6 h-6 text-black" />
Address
</CardTitle>
</CardHeader>
<CardContent>
<div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
<MapPin className="w-5 h-5 text-gray-600 mt-1" />
<div>
<p className="font-semibold text-foreground leading-relaxed">
Vidyalankar School of Information Technology
</p>
<p className="text-sm text-gray-600 mt-1">
Mumbai, Maharashtra
</p>
</div>
</div>
</CardContent>
</Card>

{/* Quick Info Card */}
<Card className="shadow-xl border-0 bg-gradient-to-br from-black to-gray-800 text-white">
<CardContent className="p-6">
<h3 className="text-lg font-bold mb-3">Quick Response</h3>
<p className="text-gray-200 text-sm leading-relaxed">
We typically respond to all inquiries within 24 hours during business days. 
For urgent matters, please call our support line.
</p>
</CardContent>
</Card>
</div>
</div>
</div>
</section>
);
};

export default ContactSection;
