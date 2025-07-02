import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TermsOfServiceProps {
  open: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-2xl max-h-[80vh] w-full relative shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Terms of Service
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-6 text-sm text-gray-700">
            <div className="text-center text-gray-500 mb-4">
              Effective Date: [Insert Launch Date]
            </div>
            
            <p className="text-base font-medium text-gray-800">
              Welcome to Tappd! By creating an account or using the Tappd app, you agree to the following terms:
            </p>

            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">1. Eligibility</h3>
              <p>You must be at least 18 years old to use Tappd. By signing up, you confirm that you meet this requirement.</p>
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">2. User Conduct</h3>
              <p className="mb-2">You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Respect other users</li>
                <li>Not post or share illegal, hateful, or explicit content</li>
                <li>Not impersonate others or misrepresent your identity</li>
                <li>Not use the app for spam, fraud, or harassment</li>
              </ul>
              <p className="mt-2">We reserve the right to remove content or suspend accounts that violate these terms.</p>
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">3. Subscription & Billing</h3>
              <p>Tappd PRO is a premium service. By subscribing, you agree to be charged through Stripe based on your selected plan (monthly or yearly). Subscriptions renew automatically unless canceled.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">4. Privacy</h3>
              <p>Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">5. Limitation of Liability</h3>
              <p>Tappd is provided "as is" without any warranties. We are not liable for any damages arising from your use of the service.</p>
            </section>

            <div className="text-center mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-700">Questions? Contact us at <span className="text-purple-600 font-medium">support@tappd.app</span></p>
              <p className="text-purple-600 font-medium mt-2">Thank you for being part of the Tappd community 💜</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            I Understand
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;