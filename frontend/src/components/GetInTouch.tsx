import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle,
  Phone,
  MapPin,
  Clock
} from 'lucide-react';

const GetInTouch: React.FC = () => {
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
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Have questions or feedback about the FRA Portal? We'd love to hear from you. 
            Send us a message and we'll get back to you as soon as possible.
          </p>
          <div className="w-24 h-1 bg-gray-800 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-blue-600" />
              <h3 className="text-2xl font-bold text-gray-900">Send us a Message</h3>
            </div>
            <p className="text-gray-600 mb-6">Fill out the form below and we'll respond within 24 hours</p>
            
            <form onSubmit={onSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-lg bg-gray-50"
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-lg bg-gray-50"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <MessageSquare className="w-4 h-4" />
                  Message
                </label>
                <Textarea 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  rows={6} 
                  required 
                  className="border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-lg resize-none bg-gray-50"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              {/* Submit Button and Success Message */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 h-12 font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
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
          </div>

          {/* Contact Information Cards */}
          <div className="space-y-6">
            {/* Support Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                  <Mail className="w-6 h-6 text-blue-600" />
                  Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-600">support@fraportal.example</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Card */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-900">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-600 mt-1" />
                  <div>
                    <p className="text-gray-600">Vidyalankar</p>
                    <p className="text-gray-600">School of Information</p>
                    <p className="text-gray-600">Technology</p>
                    <p className="text-gray-600">Mumbai, Maharashtra</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Response Card */}
            <Card className="shadow-lg bg-gray-800 text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Clock className="w-6 h-6 text-blue-400" />
                  Quick Response
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
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

export default GetInTouch;
