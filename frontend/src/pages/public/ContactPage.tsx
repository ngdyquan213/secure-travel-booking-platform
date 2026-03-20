import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { SectionHero } from '../components/SectionHero';
import { ContactForm } from '../components/ContactForm';

export function ContactPage() {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'For general inquiries and support',
      value: 'support@travelbook.com',
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Available 24/7 for emergencies',
      value: '+1 (555) 123-4567',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      description: 'Our headquarters',
      value: '123 Travel Street, NYC, NY 10001',
    },
    {
      icon: MessageSquare,
      title: 'Live Chat',
      description: 'Real-time support',
      value: 'Available 24/7 on our website',
    },
  ];

  const faqs = [
    {
      question: 'What is your refund policy?',
      answer:
        'We offer full refunds for canceled bookings if made at least 48 hours before your travel date. Some bookings may have different terms - check your confirmation email.',
    },
    {
      question: 'Can I modify my booking?',
      answer:
        'Yes, you can modify flights, hotels, and tours through your account. Changes depend on your booking terms and availability. Some modifications may incur additional fees.',
    },
    {
      question: 'Do you offer travel insurance?',
      answer:
        'Yes, we offer comprehensive travel insurance covering flights, hotels, medical emergencies, and baggage. You can add it during checkout.',
    },
    {
      question: 'Is my payment secure?',
      answer:
        'Absolutely. We use industry-standard encryption and PCI DSS compliance to protect your payment information. All transactions are secure.',
    },
    {
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards, debit cards, PayPal, Apple Pay, and Google Pay. Many countries also have local payment options available.',
    },
    {
      question: 'How do I contact customer support?',
      answer:
        'You can reach our 24/7 support team via email, phone, live chat, or contact form. Average response time is less than 1 hour.',
    },
  ];

  return (
    <>
      <SectionHero
        title="Get In Touch"
        subtitle="We're here to help. Reach out to us anytime."
      />

      {/* Contact Information Cards */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <div key={info.title} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{info.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{info.description}</p>
                  <p className="font-medium text-gray-900">{info.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              <ContactForm />
            </div>

            {/* Info */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Quick Info</h2>
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Business Hours</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Monday - Friday: 8:00 AM - 10:00 PM (EST)</p>
                    <p>Saturday: 9:00 AM - 8:00 PM (EST)</p>
                    <p>Sunday: 10:00 AM - 6:00 PM (EST)</p>
                    <p className="font-medium text-blue-600 mt-3">24/7 Emergency Support Available</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Response Times</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>Email: Within 2 hours</p>
                    <p>Live Chat: Immediate</p>
                    <p>Phone: Within 5 minutes</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Languages Supported</h3>
                  <div className="space-y-2 text-gray-600">
                    <p>English, Spanish, French, German, Chinese, Japanese, and more.</p>
                    <p className="text-sm">Ask for a translator if your language isn't listed.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 text-center mb-12">Find answers to common questions</p>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-white rounded-lg border border-gray-200 p-6 group">
                <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900">
                  {faq.question}
                  <span className="text-blue-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
