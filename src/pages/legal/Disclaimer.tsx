import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function Disclaimer() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-slate">
      <Helmet>
        <title>Disclaimer - DocToolHubPK</title>
        <meta name="description" content="Read the disclaimer for DocToolHubPK. We provide tools for informational and productivity purposes." />
      </Helmet>
      <h1>Disclaimer</h1>
      <p className="text-slate-500 italic">Last Updated: April 4, 2026</p>

      <p>This disclaimer applies to the website located at <a href="https://www.doctoolhubpk.com/">https://www.doctoolhubpk.com/</a> and is governed by the laws of Pakistan.</p>

      <h2>GENERAL INFORMATION DISCLAIMER</h2>
      <p>The information provided by <a href="https://www.doctoolhubpk.com/">https://www.doctoolhubpk.com/</a> (“we,” “us,” or “our”) on <a href="https://www.doctoolhubpk.com/">https://www.doctoolhubpk.com/</a> (the “Site”) is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.</p>
      
      <p>Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Site or reliance on any information provided on the Site. Your use of the Site and your reliance on any information on the Site is solely at your own risk.</p>

      <h2>CHANGES TO THIS DISCLAIMER</h2>
      <p>We may update this disclaimer from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this disclaimer periodically for any updates or changes.</p>

      <div className="mt-12 pt-8 border-t border-slate-200 text-slate-500 text-sm">
        <p>© 2026 <a href="https://www.doctoolhubpk.com/">https://www.doctoolhubpk.com/</a>. All rights reserved.</p>
      </div>
    </div>
  );
}
