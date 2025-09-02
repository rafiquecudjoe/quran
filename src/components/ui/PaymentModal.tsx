import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import { Input } from './Input';
import { Session, Payment } from '../../types';

interface PaymentModalProps {
  session: Session;
  onClose: () => void;
  onPaymentComplete: (payment: Payment) => void;
  isOpen: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  session,
  onClose,
  onPaymentComplete,
  isOpen
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    billingAddress: ''
  });

  if (!isOpen) return null;

  const handlePayment = async () => {
    setStep('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const payment: Payment = {
        id: `pay_${Date.now()}`,
        userId: 'current-user',
        sessionId: session.id,
        amount: session.price,
        currency: 'USD',
        status: 'completed',
        paymentMethod,
        transactionId: `txn_${Date.now()}`,
        createdAt: new Date().toISOString(),
        completedAt: new Date().toISOString()
      };
      
      setStep('success');
      setTimeout(() => {
        onPaymentComplete(payment);
        onClose();
      }, 2000);
    }, 3000);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'details':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Enroll in Session
              </h3>
              <p className="text-slate-600">
                You're about to enroll in this Quran learning session
              </p>
            </div>

            <Card className="bg-emerald-50 border-emerald-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{session.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{session.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Schedule:</span>
                    <p className="font-medium">{session.schedule.day} at {session.schedule.startTime}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Region:</span>
                    <p className="font-medium">{session.region}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Duration:</span>
                    <p className="font-medium">1 hour</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Price:</span>
                    <p className="font-bold text-emerald-600">${session.price}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={() => setStep('payment')} className="flex-1">
                Continue to Payment
              </Button>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Payment Details
              </h3>
              <p className="text-slate-600">
                Secure payment for ${session.price}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                      paymentMethod === 'card'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Credit Card</span>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-3 border rounded-lg flex items-center justify-center space-x-2 ${
                      paymentMethod === 'paypal'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <span className="font-bold text-blue-600">PayPal</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <Input
                    label="Cardholder Name"
                    value={formData.cardholderName}
                    onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
                    placeholder="John Doe"
                  />
                  <Input
                    label="Card Number"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({...formData, cardNumber: e.target.value})}
                    placeholder="1234 5678 9012 3456"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Expiry Date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                      placeholder="MM/YY"
                    />
                    <Input
                      label="CVV"
                      value={formData.cvv}
                      onChange={(e) => setFormData({...formData, cvv: e.target.value})}
                      placeholder="123"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Lock className="w-4 h-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1">
                Back
              </Button>
              <Button onClick={handlePayment} className="flex-1">
                Pay ${session.price}
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center py-8">
            <div className="animate-spin w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Processing Payment
            </h3>
            <p className="text-slate-600">
              Please wait while we process your payment securely...
            </p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Payment Successful!
            </h3>
            <p className="text-slate-600 mb-4">
              You've successfully enrolled in the session. You'll receive an email with the Zoom link shortly.
            </p>
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-emerald-800 text-sm">
                <strong>Next Steps:</strong> Check your email for session details and join instructions.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-slate-900">Session Enrollment</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="px-6 py-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};
