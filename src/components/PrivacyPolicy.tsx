import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield } from 'lucide-react';

interface PrivacyPolicyProps {
  open: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="h-6 w-6 text-purple-600" />
            Tappd Privacy Policy
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 text-sm text-gray-700">
            <div className="text-center text-gray-500 mb-4">
              Effective Date: [Insert Date]
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-base font-medium text-purple-800">
                🔒 We care about your privacy. Here's how we handle your data:
              </p>
            </div>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">What We Collect</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Email address</li>
                <li>Photos you upload</li>
                <li>Bio and profile information</li>
                <li>Location data (optional)</li>
                <li>Usage statistics and app interactions</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">What We Don't Do</h3>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-800 font-medium">✅ We do not sell your data</p>
                <p className="text-green-700 text-sm mt-1">Your personal information is never sold to third parties or advertisers.</p>
              </div>
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">How We Use Your Info</h3>
              <p>We use your information to:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Improve app features and user experience</li>
                <li>Match you with other users based on preferences</li>
                <li>Provide customer support</li>
                <li>Ensure platform safety and security</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Your Control</h3>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-blue-800 font-medium">🗑️ Delete anytime</p>
                <p className="text-blue-700 text-sm mt-1">You can delete your account at any time, which removes all your personal info from our database.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Payment Security</h3>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-yellow-800 font-medium">💳 Stripe Protection</p>
                <p className="text-yellow-700 text-sm mt-1">We use Stripe for payment processing — your card info is not stored on our servers.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Legal Compliance</h3>
              <p>We comply with applicable privacy laws including:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>GDPR (General Data Protection Regulation)</li>
                <li>CCPA (California Consumer Privacy Act)</li>
                <li>Other regional privacy regulations</li>
              </ul>
            </section>

            <div className="text-center mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-700">Questions about your privacy?</p>
              <p className="text-purple-600 font-medium mt-1">Email <span className="underline">support@tappd.app</span></p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default PrivacyPolicy;