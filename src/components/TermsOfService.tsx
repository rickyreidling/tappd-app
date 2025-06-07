import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsOfServiceProps {
  open: boolean;
  onClose: () => void;
}

const TermsOfService: React.FC<TermsOfServiceProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Terms of Service
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
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
              <h3 className="font-semibold text-lg mb-2 text-purple-700">4. Content Ownership</h3>
              <p>You retain rights to content you upload, but grant us permission to display it in the app. We do not sell your content or personal data.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">5. Location & Data Use</h3>
              <p>We use your location to provide a better experience (e.g., nearby users). Your data is stored securely and never sold.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">6. Account Termination</h3>
              <p>We reserve the right to suspend or terminate your account if you violate our terms or community standards.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">7. Limitation of Liability</h3>
              <p>Tappd is not responsible for user behavior or third-party content. Use the app at your own discretion and risk.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-2 text-purple-700">8. Changes to Terms</h3>
              <p>We may update these terms at any time. Continued use of Tappd after changes means you accept the new terms.</p>
            </section>

            <div className="text-center mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-700">Questions? Contact us at <span className="text-purple-600 font-medium">support@tappd.app</span></p>
              <p className="text-purple-600 font-medium mt-2">Thank you for being part of the Tappd community 💜</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsOfService;