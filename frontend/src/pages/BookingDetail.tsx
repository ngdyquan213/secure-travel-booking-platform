import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, CreditCard, AlertCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import toast from 'react-hot-toast';

const BookingDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'summary' | 'travelers' | 'payment'>('summary');
  const [travelers, setTravelers] = useState([
    { id: 1, firstName: '', lastName: '', email: '', phone: '' },
  ]);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  const bookingData = {
    id: id,
    type: id?.split('-')[0] || 'flight',
    price: 599,
    taxes: 120,
    fee: 25,
    title: 'New York to London',
    details: {
      date: '2024-04-15',
      time: '10:00 AM',
      from: 'New York (JFK)',
      to: 'London (LHR)',
      duration: '8 hours',
      airline: 'American Airlines',
      flightNumber: 'AA100',
    },
  };

  const total = bookingData.price + bookingData.taxes + bookingData.fee;

  const handleTravelerChange = (index: number, field: string, value: string) => {
    const updated = [...travelers];
    updated[index] = { ...updated[index], [field]: value };
    setTravelers(updated);
  };

  const addTraveler = () => {
    setTravelers([...travelers, { id: travelers.length + 1, firstName: '', lastName: '', email: '', phone: '' }]);
  };

  const handleCompleteBooking = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Booking confirmed!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 rounded-lg transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold">Complete Your Booking</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex gap-4 mb-8">
              {['summary', 'travelers', 'payment'].map((step, index) => (
                <button
                  key={step}
                  onClick={() => setCurrentStep(step as any)}
                  className={`flex-1 p-3 rounded-lg font-medium transition ${
                    currentStep === step
                      ? 'bg-primary text-white'
                      : index < ['summary', 'travelers', 'payment'].indexOf(currentStep)
                      ? 'bg-success text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </button>
              ))}
            </div>

            {/* Step: Summary */}
            {currentStep === 'summary' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Booking Summary</h2>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <MapPin className="text-primary flex-shrink-0" size={24} />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-4">{bookingData.title}</h3>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Date:</span> {bookingData.details.date}</p>
                        <p><span className="font-semibold">Time:</span> {bookingData.details.time}</p>
                        <p><span className="font-semibold">From:</span> {bookingData.details.from}</p>
                        <p><span className="font-semibold">To:</span> {bookingData.details.to}</p>
                        <p><span className="font-semibold">Duration:</span> {bookingData.details.duration}</p>
                        <p><span className="font-semibold">Provider:</span> {bookingData.details.airline}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setCurrentStep('travelers')}
                  className="w-full"
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step: Travelers */}
            {currentStep === 'travelers' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Traveler Information</h2>

                <div className="space-y-6 mb-6">
                  {travelers.map((traveler, index) => (
                    <div key={traveler.id} className="pb-6 border-b border-gray-200">
                      <h3 className="font-semibold mb-4">Traveler {index + 1}</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="First Name"
                          placeholder="John"
                          value={traveler.firstName}
                          onChange={(e) => handleTravelerChange(index, 'firstName', e.target.value)}
                        />
                        <Input
                          label="Last Name"
                          placeholder="Doe"
                          value={traveler.lastName}
                          onChange={(e) => handleTravelerChange(index, 'lastName', e.target.value)}
                        />
                        <Input
                          label="Email"
                          type="email"
                          placeholder="john@example.com"
                          value={traveler.email}
                          onChange={(e) => handleTravelerChange(index, 'email', e.target.value)}
                        />
                        <Input
                          label="Phone"
                          placeholder="+1 (555) 000-0000"
                          value={traveler.phone}
                          onChange={(e) => handleTravelerChange(index, 'phone', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button variant="outline" onClick={addTraveler} className="w-full mb-4">
                  Add Another Traveler
                </Button>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep('summary')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={() => setCurrentStep('payment')} className="flex-1">
                    Continue
                  </Button>
                </div>
              </div>
            )}

            {/* Step: Payment */}
            {currentStep === 'payment' && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Payment Details</h2>

                <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-4 mb-6 flex gap-3">
                  <AlertCircle className="text-warning flex-shrink-0" size={20} />
                  <p className="text-sm text-warning">Your payment information is encrypted and secure</p>
                </div>

                <div className="space-y-4 mb-6">
                  <Input
                    label="Cardholder Name"
                    placeholder="John Doe"
                    value={paymentData.cardholderName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                  />
                  <Input
                    label="Card Number"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
                    icon={<CreditCard size={18} />}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={paymentData.expiryDate}
                      onChange={(e) => setPaymentData({ ...paymentData, expiryDate: e.target.value })}
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      maxLength={3}
                      type="password"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setCurrentStep('travelers')} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleCompleteBooking} loading={loading} className="flex-1">
                    Complete Booking
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Price Breakdown */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h3 className="text-xl font-bold mb-6">Price Breakdown</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Price</span>
                  <span className="font-semibold">${bookingData.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees</span>
                  <span className="font-semibold">${bookingData.taxes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="font-semibold">${bookingData.fee}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold text-primary">${total}</span>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2"><strong>Booking ID:</strong></p>
                <p className="font-mono text-sm break-all">{id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;
