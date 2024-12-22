import { Metadata } from 'next';
import { Footer } from '@/components/ui/layout/footer';

export const metadata: Metadata = {
  title: 'Legal Disclaimer - BARK Token',
  description: 'Legal disclaimer for the BARK Token ($BARK) and its associated services',
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Legal Disclaimer</h1>
        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-3">General Information</h2>
            <p>The information provided on this website does not constitute investment advice, financial advice, trading advice, or any other sort of advice. You should not treat any of the website's content as such. The BARK team does not recommend that any cryptocurrency should be bought, sold, or held by you. Conduct your own due diligence and consult your financial advisor before making any investment decisions.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Accuracy of Information</h2>
            <p>The BARK team will strive to ensure accuracy of information listed on this website although it will not hold any responsibility for any missing or wrong information. You understand that you are using any and all information available here at your own risk.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Non-Endorsement</h2>
            <p>The appearance of third-party advertisements and hyperlinks on this website does not constitute an endorsement, guarantee, warranty, or recommendation by BARK. Conduct your own due diligence before deciding to use any third-party services.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Risk Disclosure</h2>
            <p>Cryptocurrency trading carries a high level of risk and may not be suitable for all investors. Before deciding to trade cryptocurrency, you should carefully consider your investment objectives, level of experience, and risk appetite.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Limitation of Liability</h2>
            <p>In no event shall BARK, its team members, or its affiliates be liable for any special, incidental, indirect, or consequential damages whatsoever arising out of or in connection with your access or use or inability to access or use the website or any content on the website.</p>
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-3">Changes to the Disclaimer</h2>
            <p>BARK reserves the right to change this disclaimer at any time. We advise you to check this page periodically for any changes. The changes are effective immediately after they are posted on this page.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

