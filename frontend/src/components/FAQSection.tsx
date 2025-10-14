import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

const faqs: { 
question: string; 
answer: string; 
category: string;
popular?: boolean;
}[] = [
{
question: 'What is the FRA Portal?',
answer: 'The FRA Portal is a comprehensive digital platform designed to visualize, manage, and analyze Forest Rights Act claims and forest areas. It provides interactive maps, real-time analytics, and streamlined workflows for government administrators and community stakeholders to efficiently process and monitor forest rights applications.',
category: 'General',
popular: true
},
{
question: 'Who can use this portal?',
answer: 'The portal is designed for multiple user types: Government administrators have full access to manage and process applications, community stakeholders can submit and track their claims, and public users can explore limited information without logging in. Each user type has role-based permissions ensuring data security and appropriate access levels.',
category: 'Access',
popular: true
},
{
question: 'Is my data secure?',
answer: 'Absolutely. The platform implements enterprise-grade security measures including role-based access control, secure authentication protocols, end-to-end encryption for sensitive data, regular security audits, and compliance with data protection regulations. Your information is protected with the highest security standards.',
category: 'Security',
popular: true
},
{
question: 'How often is data updated?',
answer: 'Data is updated in real-time as new submissions and verifications are processed. The system automatically refreshes datasets, syncs with government databases, and provides live updates on application statuses. Demo content is bundled for offline trials and testing purposes.',
category: 'Data',
popular: false
},
{
question: 'How do I submit a forest rights claim?',
answer: 'To submit a forest rights claim, log into your account, navigate to the "Submit Claim" section, fill out the required information including location details, supporting documents, and community information. The system will guide you through each step and provide validation to ensure completeness.',
category: 'Process',
popular: false
},
{
question: 'What documents are required for submission?',
answer: 'Required documents include proof of residence, community membership verification, land records, traditional forest use evidence, and any relevant government-issued identification. The system provides a comprehensive checklist and accepts various file formats for easy upload.',
category: 'Process',
popular: false
},
{
question: 'How can I track my application status?',
answer: 'You can track your application status through the dashboard by logging into your account. The system provides real-time updates on processing stages, notifications for required actions, and detailed timelines. You can also receive email updates for important status changes.',
category: 'Process',
popular: true
},
{
question: 'What if I encounter technical issues?',
answer: 'If you encounter any technical issues, you can contact our support team through the help desk, email support, or phone assistance. We also provide comprehensive documentation, video tutorials, and a troubleshooting guide to help resolve common issues quickly.',
category: 'Support',
popular: false
}
];

const FAQSection: React.FC = () => {
const [openItems, setOpenItems] = useState<number[]>([]);
const [searchTerm, setSearchTerm] = useState('');
const [selectedCategory, setSelectedCategory] = useState('All');

const categories = ['All', ...Array.from(new Set(faqs.map(faq => faq.category)))];

const filteredFAQs = faqs.filter(faq => {
const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
 faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
return matchesSearch && matchesCategory;
});

const toggleItem = (index: number) => {
setOpenItems(prev => 
prev.includes(index) 
? prev.filter(item => item !== index)
: [...prev, index]
);
};

return (
  <section id="faq" className="py-12 bg-white">
    <div className="max-w-6xl mx-auto px-4">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-600 pb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-700">
          Find answers to common questions about the FRA Portal. For additional assistance, please contact our support team.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm font-medium border ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {selectedCategory === 'All' ? 'All Questions' : `${selectedCategory} Questions`}
        </h3>
        {filteredFAQs.map((faq, index) => {
          const isOpen = openItems.includes(index);
          return (
            <div
              key={index}
              className="border border-gray-200 bg-white"
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                aria-expanded={isOpen}
              >
                <div className="flex items-center space-x-3">
                  <HelpCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1">
                    {faq.category}
                  </span>
                  {faq.popular && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1">
                      Popular
                    </span>
                  )}
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {isOpen && (
                <div className="px-4 pb-3 border-t border-gray-100">
                  <div className="pt-3 pl-7">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* No Results Message */}
      {filteredFAQs.length === 0 && (
        <div className="text-center py-8">
          <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No questions found</h3>
          <p className="text-gray-500">Try adjusting your search terms or category filter.</p>
        </div>
      )}

      {/* Contact Information */}
      <div className="mt-12 bg-gray-50 p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More Help?</h3>
        <p className="text-gray-700 mb-4">
          If you cannot find the answer to your question, please contact our support team.
        </p>
        <div className="text-sm text-gray-600">
          <p>Email: support@fraportal.gov.in</p>
          <p>Phone: +91-XXX-XXXX-XXXX</p>
          <p>Office Hours: Monday to Friday, 9:00 AM to 6:00 PM</p>
        </div>
      </div>
    </div>
  </section>
);
};

export default FAQSection;
