import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrivacyPolicyProps {
  open: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg max-w-2xl max-h-[80vh] w-full relative shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-purple-600">🔒</span>
            Tappd Privacy Policy
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
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-500">
              <p className="text-base font-medium text-purple-800">
                🔒 We care about your privacy. Here's how we handle your data:
              </p>
            </div>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">What We Collect</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Account Information:</strong> Email address, encrypted password</li>
                <li><strong>Profile Data:</strong> Photos you upload, bio, and profile information</li>
                <li><strong>Location Data:</strong> Optional location sharing for nearby matches</li>
                <li><strong>Usage Data:</strong> App interactions, preferences, and analytics</li>
                <li><strong>Communication:</strong> Messages and interactions within the app</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">How We Use Your Data</h3>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide and improve our dating service</li>
                <li>Match you with compatible users</li>
                <li>Send important notifications and updates</li>
                <li>Prevent fraud and ensure platform safety</li>
                <li>Analyze usage to improve features</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">What We Don't Do</h3>
              <div className="bg-green-50 p-4 rounded-lg space-y-2">
                <p className="text-green-800 font-medium flex items-center gap-2">
                  <span>✅</span> We do not sell your personal data
                </p>
                <p className="text-green-700 text-sm">Your information is never sold to third parties or advertisers.</p>
                
                <p className="text-green-800 font-medium flex items-center gap-2">
                  <span>✅</span> We do not share data without permission
                </p>
                <p className="text-green-700 text-sm">Your data stays within Tappd unless you explicitly consent.</p>
              </div>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Data Security</h3>
              <p>We use industry-standard encryption and security measures to protect your data. However, no system is 100% secure, and we cannot guarantee absolute security.</p>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Your Rights</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Access your personal data</li>
                <li>Request data correction or deletion</li>
                <li>Opt out of non-essential communications</li>
                <li>Download your data</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg mb-3 text-purple-700">Data Retention</h3>
              <p>We retain your data as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where required by law.</p>
            </section>

            <div className="text-center mt-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-gray-700">Questions about your privacy?</p>
              <p className="text-purple-600 font-medium mt-1">Email <span className="underline">privacy@tappd.app</span></p>
              <p className="text-xs text-gray-500 mt-2">Last updated: [Insert Date]</p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t bg-gray-50 rounded-b-lg">
          <Button 
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
          >
            Got It
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;