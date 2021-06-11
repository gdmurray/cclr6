import React from 'react'

const Privacy = () => {
    return (
        <div className="page-content text-content mb-24">
            <h1 className="page-title-sm mb-5">Canada Contenders League Privacy Policy</h1>
            <div className="privacy-policy">
                <div className="text-xs text-error font-semibold leading-4 tracking-tight mb-5">
                    This Privacy Policy is a Work In Progress and is subject to change until the start of the league
                    (the &ldquo;League Start Date&rdquo;). <br />
                    If there are any significant changes to the Privacy Policy after the League Start Date, you will be
                    informed via email.
                </div>
                <p>
                    This Privacy Policy describes how your personal information is collected, used, and shared when you
                    visit or make a purchase from <a href="https://cclr6.com">https://cclr6.com</a> (the
                    &ldquo;Site&rdquo;).
                </p>
                <p className="subheader">
                    <strong>PERSONAL INFORMATION WE COLLECT</strong>
                </p>
                <p>
                    When you visit the Site, we automatically collect certain information about your device, including
                    information about your web browser, IP address, time zone, and some of the cookies that are
                    installed on your device. We refer to this automatically-collected information as &ldquo;Device
                    Information.&rdquo;
                </p>
                <p>We collect Device Information using the following technologies:</p>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;- &ldquo;Cookies&rdquo; are data files that are placed on your device or
                    computer and often include an anonymous unique identifier. For more information about cookies, and
                    how to disable cookies, visit{' '}
                    <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
                        http://www.allaboutcookies.org.
                    </a>
                </p>
                <p>
                    &nbsp;&nbsp;&nbsp;&nbsp;- &ldquo;Log files&rdquo; track actions occurring on the Site, and collect
                    data including your IP address, browser type, Internet service provider, referring/exit pages, and
                    date/time stamps.
                </p>
                <p>
                    Additionally when you create an account and register your team/players, we collect certain
                    information from you, including your email address.&nbsp; We refer to this information as
                    &ldquo;Account Information.&rdquo;
                </p>
                <p>
                    When we talk about &ldquo;Personal Information&rdquo; in this Privacy Policy, we are talking both
                    about Device Information and Order Information.
                </p>
                <p className="subheader">
                    <strong>HOW DO WE USE YOUR PERSONAL INFORMATION?</strong>
                </p>
                <p>
                    We use the Personal Information that we collect generally to match a user to a Team, and then
                    subsequently send that information to Third Party tournament management system Toornament.
                    Additionally, we use this information to:
                </p>
                <p>Confirm that teams have completed payment to play in the league.</p>
                <p>Communicate with you;</p>
                <p>
                    We use the Device Information that we collect to help us screen for potential breaches of terms (in
                    particular, your IP address).
                </p>
                <p className="subheader">
                    <strong>THIRD-PARTY PAYMENT PROCESSORS</strong>
                </p>
                <p>
                    We use third party payment processor PayPal for all payments. Canada Contenders League does not
                    store credit card details and instead relies on PayPal for this. See their privacy policy here:
                    <a
                        href="https://www.paypal.com/ca/webapps/mpp/ua/privacy-full"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        https://www.paypal.com/ca/webapps/mpp/ua/privacy-full.
                    </a>
                </p>
                <p className="subheader">
                    <strong>SHARING YOUR PERSONAL INFORMATION</strong>
                </p>
                <p>
                    We use Google Analytics to help us understand how our customers use the Site--you can read more
                    about how Google uses your Personal Information here:&nbsp;{' '}
                    <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.google.com/intl/en/policies/privacy/"
                    >
                        https://www.google.com/intl/en/policies/privacy/
                    </a>
                    .&nbsp; You can also opt-out of Google Analytics here:&nbsp;{' '}
                    <a target="_blank" rel="noopener noreferrer" href="https://tools.google.com/dlpage/gaoptout">
                        https://tools.google.com/dlpage/gaoptout.
                    </a>
                </p>
                <p>
                    We use Toornament as our league match and tournament backend, and will be using the information you
                    provide as it relates to your registration. This information will be sent to Toornament upon the
                    start of each Stage. See Toornaments Privacy Policy here:
                    <a target="_blank" rel="noopener noreferrer" href="https://www.toornament.com/en_US/privacy-policy">
                        https://www.toornament.com/en_US/privacy-policy
                    </a>
                </p>
                <p>
                    Finally, we may also share your Personal Information to comply with applicable laws and regulations,
                    to respond to a subpoena, search warrant or other lawful request for information we receive, or to
                    otherwise protect our rights.
                </p>
                <p className="subheader">
                    <strong>DO NOT TRACK</strong>
                </p>
                <p>
                    Please note that we do not alter our Site&rsquo;s data collection and use practices when we see a Do
                    Not Track signal from your browser.
                </p>
                <p className="subheader">
                    <strong>DATA RETENTION</strong>
                </p>
                <p>
                    When you place an order through the Site, we will maintain your Order Information for our records
                    unless and until you ask us to delete this information.
                </p>
                <p className="subheader">
                    <strong>MINORS</strong>
                </p>
                <p>The Site is not intended for individuals under the age of 16.</p>
                <p className="subheader">
                    <strong>CHANGES</strong>
                </p>
                <p>
                    We may update this privacy policy from time to time in order to reflect, for example, changes to our
                    practices or for other operational, legal or regulatory reasons.
                </p>
                <p className="subheader">
                    <strong>CONTACT US</strong>
                </p>
                <p>
                    For more information about our privacy practices, if you have questions, or if you would like to
                    make a complaint, please contact us by e-mail at{' '}
                    <a href="href='mailto:support@cclr6.com'">support@cclr6.com</a>
                </p>
            </div>
        </div>
    )
}

Privacy.SEO = {
    url: '/privacy',
    title: 'Privacy Policy',
    description: 'Privacy Policy of using CCLR6',
}

export default Privacy
