import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function CookiePolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-slate">
      <Helmet>
        <title>Cookie Policy - DocToolHubPK</title>
        <meta name="description" content="Learn how DocToolHubPK uses cookies to improve your experience. Our tools are browser-based and secure." />
      </Helmet>
      <h1>Cookie Policy</h1>
      <p className="text-slate-500 italic">Last Updated: April 4, 2026</p>

      <p>This Cookies Policy explains what Cookies are and how We use them. You should read this policy so You can understand what type of cookies We use, or the information We collect using Cookies and how that information is used.</p>
      
      <p>Cookies do not typically contain any information that personally identifies a user, but personal information that We store about You may be linked to the information stored in and obtained from Cookies. For further information on how We use, store and keep your personal data secure, see our Privacy Policy, if and when We make it available within the Website or on our website.</p>
      
      <p>We do not store sensitive personal information, such as mailing addresses, account passwords, etc. in the Cookies We use.</p>

      <h2>Interpretation and Definitions</h2>
      <h3>Interpretation</h3>
      <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>

      <h3>Definitions</h3>
      <p>For the purposes of this Cookies Policy:</p>
      <ul>
        <li><strong>Company</strong> (referred to as either “the Company”, “We”, “Us” or “Our” in this Cookies Policy) refers to <a href="https://www.doctoolhubpk.com">https://www.doctoolhubpk.com</a>.</li>
        <li><strong>Cookies</strong> means small files that are placed on Your computer, mobile device or any other device by a website, containing details of your browsing history on that website among its many uses.</li>
        <li><strong>Website</strong> refers to <a href="https://www.doctoolhubpk.com/">https://www.doctoolhubpk.com/</a>, accessible from <a href="https://www.doctoolhubpk.com/">https://www.doctoolhubpk.com/</a>.</li>
        <li><strong>You</strong> means the individual accessing or using the Website, or a company, or any legal entity on behalf of which such individual is accessing or using the Website, as applicable.</li>
      </ul>

      <h2>The use of the Cookies</h2>
      <h3>Type of Cookies We Use</h3>
      <p>Cookies can be “Persistent” or “Session” Cookies. Persistent Cookies remain on your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close your web browser.</p>
      
      <p>Where required by law, We will request your consent before using Cookies that are not strictly necessary. Strictly necessary Cookies are used to provide the Website and cannot be switched off in our systems.</p>
      
      <p>We use both session and persistent Cookies for the purposes set out below:</p>
      <ul>
        <li>
          <strong>Necessary / Essential Cookies</strong>
          <br />Type: Session Cookies
          <br />Administered by: Us
          <br />Purpose: These Cookies are essential to provide You with services available through the Website and to enable You to use some of its features. They help to authenticate users and prevent fraudulent use of user accounts. Without these Cookies, the services that You have asked for cannot be provided, and We only use these Cookies to provide You with those services.
        </li>
        <li>
          <strong>Functionality Cookies</strong>
          <br />Type: Persistent Cookies
          <br />Administered by: Us
          <br />Purpose: These Cookies allow Us to remember choices You make when You use the Website, such as remembering your login details or language preference. The purpose of these Cookies is to provide You with a more personal experience and to avoid You having to re-enter your preferences every time You use the Website.
        </li>
      </ul>

      <h2>Your Choices Regarding Cookies</h2>
      <p>If You prefer to avoid the use of Cookies on the Website, first You must disable the use of Cookies in your browser and then delete the Cookies saved in your browser associated with the Website. You may use this option for preventing the use of Cookies at any time.</p>
      
      <p>If You do not accept Our Cookies, You may experience some inconvenience in your use of the Website and some features may not function properly.</p>
      
      <p>If You’d like to delete Cookies or instruct your web browser to delete or refuse Cookies, please visit the help pages of your web browser.</p>
      <ul>
        <li>For the Chrome web browser, please visit this page from Google: <a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener noreferrer">https://support.google.com/accounts/answer/32050</a></li>
        <li>For the Microsoft Edge browser, please visit this page from Microsoft: <a href="https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer">https://support.microsoft.com/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09</a></li>
        <li>For the Firefox web browser, please visit this page from Mozilla: <a href="https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored" target="_blank" rel="noopener noreferrer">https://support.mozilla.org/en-US/kb/delete-cookies-remove-info-websites-stored</a></li>
        <li>For the Safari web browser, please visit this page from Apple: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a></li>
      </ul>
      <p>For any other web browser, please visit your web browser’s official web pages.</p>

      <h2>Changes to this Cookies Policy</h2>
      <p>We may update this Cookies Policy from time to time. The “Last updated” date at the top indicates when it was last revised.</p>

      <h2>Contact Us</h2>
      <p>If you have any questions about this Cookies Policy, You can contact us:</p>
      <ul>
        <li>By visiting this page on our website: <Link to="/contact">https://www.doctoolhubpk.com/contact</Link></li>
      </ul>
    </div>
  );
}
