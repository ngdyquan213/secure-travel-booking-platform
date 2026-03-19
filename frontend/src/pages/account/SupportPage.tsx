import { Card, Button, Input, FormField, Tabs } from '../../components'
import { MessageSquare, Mail, Phone, Clock } from 'lucide-react'
import { useState } from 'react'

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('contact')
  const [message, setMessage] = useState('')

  const faqs = [
    {
      question: 'How do I cancel a booking?',
      answer: 'You can cancel your booking from the My Bookings section. Select the booking and click Cancel. Depending on the cancellation policy, you may receive a refund.',
    },
    {
      question: 'What is your refund policy?',
      answer: 'Refunds depend on the specific booking and the cancellation policy. Most bookings can be refunded up to 48 hours before the travel date.',
    },
    {
      question: 'How do I update my profile information?',
      answer: 'Go to Account Settings and click Edit Profile. Update your information and click Save to confirm your changes.',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Support & Help</h1>

      <Tabs
        tabs={[
          { label: 'Contact Us', value: 'contact' },
          { label: 'FAQs', value: 'faqs' },
        ]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        {activeTab === 'contact' && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <div className="space-y-4">
                <FormField label="Name" required>
                  <Input placeholder="Your name" />
                </FormField>
                <FormField label="Email" required>
                  <Input type="email" placeholder="your@email.com" />
                </FormField>
                <FormField label="Subject" required>
                  <Input placeholder="How can we help?" />
                </FormField>
                <FormField label="Message" required>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more..."
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </FormField>
                <Button>Send Message</Button>
              </div>
            </Card>

            <div className="space-y-4">
              <Card>
                <div className="flex gap-3">
                  <Mail className="w-6 h-6 text-blue-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Email Support</h3>
                    <p className="text-gray-600">support@travelbook.com</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex gap-3">
                  <Phone className="w-6 h-6 text-green-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Phone Support</h3>
                    <p className="text-gray-600">+1 (234) 567-890</p>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex gap-3">
                  <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">Business Hours</h3>
                    <p className="text-gray-600">Mon-Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Sat-Sun: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  )
}
