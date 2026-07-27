import SiteHeader from "@/components/site/SiteHeader";


const TOC: [string, string][] = [
  ["1", "Definitions"],
  ["2", "Eligibility"],
  ["3", "Scope of the Services"],
  ["4", "Use of the Services"],
  ["5", "Accounts; Authorized Users"],
  ["6", "Customer Obligations"],
  ["6A", "Generative AI Services"],
  ["7", "Suspension of Access to Services"],
  ["8", "Third-Party Services"],
  ["9", "Intellectual Property"],
  ["10", "Subscriptions & Payment"],
  ["11", "Confidential Information"],
  ["12", "Data Privacy & Security"],
  ["13", "Standard Virtual Machines"],
  ["14", "Confidential Virtual Machines"],
  ["15", "AI Agent Hosting and Inference"],
  ["16", "AI Agent Software"],
  ["17", "Representations & Warranties"],
  ["18", "Disclaimers"],
  ["19", "Indemnification"],
  ["20", "Limitation of Liability"],
  ["21", "Term & Termination"],
  ["22", "Updates to these Terms"],
  ["23", "Dispute Resolution; Governing Law"],
  ["24", "Miscellaneous"],
  ["A", "Appendix A — Agent Hosting Staking"],
  ["B", "Appendix B — Cloud Staking"],
];

const DEFINITIONS = [
  ["Account", "Customer's account with NEAR AI associated with Customer's use of the Services."],
  ["Affiliate", "Any entity that directly or indirectly controls, is controlled by, or is under common control with a Party."],
  ["Acceptable Use Policy (or \"AUP\")", "The then-current acceptable use policy applicable to the Cloud Service located at: https://near.ai/acceptable-use-policy."],
  ["Agent Hosting or Agent Hosting Services", "The Services through which NEAR AI provisions and operates single-tenant and multi-tenant compute infrastructure platforms for the continuous execution of Customer-deployed AI Agents, together with integrated AI inference capabilities made available by NEAR AI as part of Standard Virtual Machine environments."],
  ["AI Agent", "Any software process deployed by or on behalf of Customer that is capable of independently initiating actions, making decisions, calling external APIs, initiating subordinate task processes, or executing multi-step tasks without per-action human authorization or review."],
  ["AI Agent Software", "Collectively, Third-Party AI Agent Software and IronClaw."],
  ["Authorized Account Users", "The employees, contractors, or vendors authorized by Customer to use the Services under the Customer's Account."],
  ["Authorized User", "Authorized Account Users and End Users."],
  ["Business Contact Information", "The business contact information of a Party (including, without limitation, business addresses, phone numbers, and email addresses, including a Party's contact persons' names used solely to facilitate the Parties' communications for administration of these Terms)."],
  ["Confidential Virtual Machine (or \"CVM\")", "A reserved, confidential compute environment utilizing hardware-based isolation and memory encryption technologies designed to allow Customers to run their workloads inside TEEs and reduce the risk of unauthorized access to data in use."],
  ["Customer Application", "Customer's applications, products or services in which Customer may integrate the Services, or host within the NEAR AI Cloud, as permitted by these Terms."],
  ["Customer Data", "Data provided to the Services by Customer and its Authorized Users, including Inputs; and data that Customer or Authorized Users derive or generate from that data through their use of the Services, including Outputs."],
  ["Deployment Type", "The configuration under which Customer workloads are executed on the Platform, which may include (a) deployment in a Standard VM (\"Standard VM Deployment\") or (b) deployment in a CVM (\"CVM Deployment\"), as specified in the applicable Order Form or user interface at the time of provisioning."],
  ["Documentation", "The user guides, technical specifications, API documentation, manuals, help files, and other written or electronic materials provided by NEAR AI that describe the features, functionality, operation, and use of the Services."],
  ["End Users", "The entities or individuals who are customers of Customer who have a written agreement with Customer and have access to the Services through a Customer Application and who have entered into an End User Agreement."],
  ["End User Agreement", "The legally binding terms and conditions between Customer and each End User governing the End User's access to and use of the Customer Application, which include the obligations, restrictions, and limitations (including those in the AUP) applicable to End Users under these Terms."],
  ["Input", "Any and all instructions, queries, visual or textual cues given by Customer or End Users to the Third-Party Generative AI Servicesin order to generate an Output."],
  ["Intellectual Property Rights", "Current and future worldwide rights under patent, copyright, trade secret, trademark, and moral rights laws, and other similar rights."],
  ["IronClaw", "The NEAR AI-developed open-source AI Agent offering, available at https://github.com/nearai/ironclaw."],
  ["NEAR AI Cloud", "A hosted confidential cloud computing platform that provides cloud-based AI services and infrastructure, including but not limited to AI model hosting and inference APIs running inside TEEs and CVMs."],
  ["NEAR AI Cloud API", "The OpenAI-compatible inference API that provides programmatic access to AI models hosted on NEAR AI Cloud. The NEAR AI Cloud API supports both open-source models (executed within TEE environments) and premium closed-source models (proxied to third-party providers via a shared NEAR AI API key, without TEE-based privacy or attestation)."],
  ["Non-Custodial", "That Customer at all times retains exclusive ownership and control of its Staked NEAR and the private keys to its Wallet Address, and that NEAR AI does not take custody or control of Customer's Staked NEAR or private keys, has no ability under the applicable staking pool contract as deployed to withdraw or transfer Customer's Staked NEAR."],
  ["Non-Staking Subscription", "Any subscription or Plan (defined below) to the Agent Hosting Services that is not a Staking Subscription, under which Customer pays the applicable fees using a supported payment method (such as a credit card processed by our third-party payment processor, or payment in NEAR Tokens)."],
  ["Order Form", "A transactional ordering document or confirmation information upon purchase of Usage Credits for Customer's purchase of Services, including an online registration page."],
  ["Order Term", "The duration for access to the Services specified in the Order Form, unless terminated earlier in accordance with these Terms."],
  ["Output", "Any and all content generated by the Third-Party Generative AI Services or IronClaw in response to Customer's or End User's Input."],
  ["Personal Data", "Has the meaning given such term in the Data Processing Agreement."],
  ["Protected Health Information (or \"PHI\")", "Individually identifiable health information that is protected under the Health Insurance Portability and Accountability Act of 1996 (\"HIPAA\") and its implementing regulations."],
  ["Staked NEAR", "The NEAR tokens that Customer commits (stakes) through the applicable Validator in connection with a Staking Subscription or pursuant to Appendix B. Staked NEAR remains the property of Customer at all times and is returnable to Customer in accordance with Appendix A or Appendix B, as applicable."],
  ["Staking Rewards", "The network staking rewards generated at the protocol level in respect of Staked NEAR and routed, protocol-direct, to NEAR AI as consideration for the Services in accordance with Appendix A or Appendix B, as applicable. For the avoidance of doubt, Staking Rewards are not paid, credited, or otherwise made available to Customer as income, yield, or return."],
  ["Staking Subscription", "A subscription to the Agent Hosting Service, offered separately from and in parallel to a Non-Staking Subscription and any Plan, under which Customer obtains access by staking NEAR through a Validator, with Staking Rewards routed to NEAR AI and Usage Credits made available as a function of the amount of Staked NEAR, as described in Section 10.8 and Appendix A."],
  ["Standard Virtual Machine (or \"Standard VM\")", "A virtualized compute environment provisioned by NEAR AI through the Platform that provides dedicated processing, memory, and storage resources for the deployment and execution of Customer workloads, without the application of confidential computing protections such as hardware-based TEEs or memory encryption."],
  ["Subscription Tier", "A tier of the Staking Subscription (e.g., Starter, Basic, Pro), each defined by a range of Staked NEAR, a permitted number of AI Agents, and a monthly Usage Credit entitlement, as set out in the table in Appendix A."],
  ["Subscription Type", "Whether a subscription to the Agent Hosting Services is a Non-Staking Subscription or a Staking Subscription, as described in Section 10.2."],
  ["Third-Party AI Agent Software", "OpenClaw and any open-source or third-party alternatives thereto developed by a third party, but expressly excluding IronClaw."],
  ["Third-Party Channel Provider", "Any third-party messaging, communication or collaboration platform through which a Customer or its Authorized Users configures an AI Agent to send or receive Inputs or Outputs, including without limitation Slack, Telegram, Discord and WhatsApp, and for the avoidance of doubt, excluding any NEAR AI-operated infrastructure or services."],
  ["Third-Party Generative AI Services", "The generative AI models obtained from third-party providers and made available to Customer through the Services."],
  ["Trusted Executive Environments (or \"TEEs\")", "A hardware-supported secure execution environment that provides isolation and memory protection for designated workloads, such that code and data processed within the TEE are protected from access by other applications, virtual machines, operating systems or infrastructure components, subject to inherent technical limitations."],
  ["Unlock Period", "The period, following initiation of the applicable unstaking/unlock process for Staked NEAR, before such Staked NEAR becomes withdrawable by Customer, as described in Appendix A or Appendix B, as applicable."],
  ["Usage Credits", "The prepaid units for metered use of the Services that Customer may purchase on the Website."],
  ["Usage Data", "Operational and meta data collected by NEAR AI while providing the Services to Customer, such as usage details (e.g., information about usage including token count per Input and Output), operational status, authentication details, quality and performance metrics, and other technical details necessary for NEAR AI to operate and maintain the Services. For clarity, Usage Data excludes Customer Data."],
  ["Validator", "The NEAR protocol validator through which Customer stakes NEAR in connection with a Staking Subscription or pursuant to Appendix B, and to which Customer delegates its Staked NEAR, operated by NEAR AI or by a third party under a validator services agreement."],
  ["Wallet Address", "The NEAR blockchain wallet address used by Customer to create an Account, stake NEAR, and access the Services under a Staking Subscription or pursuant to Appendix B."],
];

const TIER_BASICS: [string, string][] = [
  ["Subscription period", "Monthly."],
  ["Withdrawal delay", "After cancellation, Customer must complete the unstaking/unlock process; Staked NEAR becomes withdrawable only after the Unlock Period (see Section A.6) and our FAQ page for further information."],
];

const TIER_TABLE: [string, string, string, string][] = [
  ["Starter", "50 – 500 NEAR", "1", "USD $5 per month (flat, regardless of Staked NEAR amount)"],
  ["Basic", "500 – 2,000 NEAR", "2", "USD $5 – $20 per month"],
  ["Pro", "2,000 – 20,000 NEAR", "5", "USD $20 – $200 per month"],
];

export default function TermsOfServicePage() {
  return (
    <div className="relative w-full font-sans bg-[#ECECEC] text-[#101010]">
      <div className="relative w-full flex flex-col">

        {/* ─── HERO ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[36vh] flex flex-col bg-gradient-to-b from-[#525252] from-[35%] to-[#ECECEC]">
          <div className="absolute inset-0 z-[1] bg-[#101010]/40 pointer-events-none" />
          <div className="relative z-10 flex flex-col flex-1 mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <SiteHeader />
            <div className="flex flex-col flex-1 justify-end pb-12 lg:pb-16 pt-8">
              <h1 className="text-white font-medium leading-[1.05] tracking-tight" style={{ fontSize: "var(--font-size-h1)" }}>
                NEAR AI Terms of Service
              </h1>
              <p className="mt-3 font-mono text-[0.75rem] uppercase tracking-[0.25em] text-white/50">
                Last Updated — July 27, 2026
              </p>
            </div>
          </div>
        </section>

        {/* ─── CONTENT ───────────────────────────────────────────────────────── */}
        <section className="bg-[#ECECEC] py-16 lg:py-24">
          <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-10 lg:px-20">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 lg:gap-24 items-start">

              {/* Sticky TOC */}
              <aside className="hidden lg:block sticky top-12">
                <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted mb-6">Contents</p>
                <nav className="flex flex-col gap-2">
                  {TOC.map(([num, item]) => (
                    <a key={item} href={`#section-${num}`} className="text-pretty text-muted hover:text-[#101010] transition-colors [font-size:var(--font-size-body)] leading-snug">
                      <span className="font-mono text-[0.7rem] mr-2 opacity-50">{num}.</span>
                      {item}
                    </a>
                  ))}
                </nav>
              </aside>

              {/* Body */}
              <div className="flex flex-col gap-1 max-w-[860px]">

                {/* Intro */}
                <div className="mb-12 flex flex-col gap-4 text-muted leading-[1.8]" style={{ fontSize: "var(--font-size-body)" }}>
                  <p>Welcome to NEAR AI. These Terms of Service (the &ldquo;Terms&rdquo;) are a legally binding agreement between Jasnah, Inc. d/b/a NEAR AI (&ldquo;NEAR AI&rdquo;, &ldquo;we&rdquo;, or &ldquo;us&rdquo;) and the person or entity agreeing to the Terms (&ldquo;Customer&rdquo; or &ldquo;you&rdquo;). If you are agreeing to these Terms on behalf of an organization, &ldquo;Customer&rdquo; shall also mean that organization. These Terms govern your access to and use of the Agent Hosting platform, NEAR AI Cloud, including the NEAR AI Cloud API, and related developer services we make available (such products and services, the &ldquo;Services&rdquo;) on or through our website currently located at https://near.ai/, https://cloud.near.ai/, and https://agent.near.ai (the &ldquo;NEAR AI Hosting Platform&rdquo;) (each, a &ldquo;Website&rdquo;, and collectively, the &ldquo;Platform&rdquo;).</p>
                  <p>Please read these Terms carefully as they affect your legal rights. These Terms are effective on the earlier of when you click to accept the Terms and your first use of the Services (the &ldquo;Effective Date&rdquo;). By accepting these Terms, using the Services, or creating an Account, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our Services. The date on which the Terms first become effective is the &ldquo;Effective Date.&rdquo;</p>

                  {/* Mobile TOC */}
                  <div className="lg:hidden mt-4 border border-[#CAC8C8] rounded-2xl p-6 flex flex-col gap-2">
                    <p className="font-mono text-[0.7rem] uppercase tracking-[0.3em] text-muted mb-2">Contents</p>
                    {TOC.map(([num, item]) => (
                      <a key={item} href={`#section-${num}`} className="text-pretty text-muted [font-size:var(--font-size-body)] leading-snug">
                        <span className="font-mono text-[0.7rem] mr-2 opacity-50">{num}.</span>{item}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Section 1 */}
                <Section id="section-1" number="1" title="Definitions.">
                  <div className="flex flex-col gap-4">
                    {DEFINITIONS.map(([term, def]) => (
                      <p key={term}><strong>&ldquo;{term}&rdquo;</strong> means {def}</p>
                    ))}
                  </div>
                </Section>

                {/* Section 2 */}
                <Section id="section-2" number="2" title="Eligibility.">
                  <p>You may use the Services only if you can form a binding contract with NEAR AI, and only in compliance with these Terms and all applicable local, state, national, and international laws, rules and regulations. Any use or access to the Services by anyone under 18 is strictly prohibited and in violation of these Terms. The Services are not available to Customers previously removed from the Services by NEAR AI. By registering for an Account, you represent and warrant that (i) you are at least 18 years of age, (ii) you will use the Services in accordance with these Terms and all applicable local, state, national and international laws, rules and regulations, (iii) if registering on behalf of a company, organization or other entity, you are an authorized representative of the entity and have the authority to bind such entity to these Terms, (iv) you are not located in, under the control of, or a national/resident of any country or region subject to comprehensive U.S. embargoes or sanctions (including Cuba, Iran, North Korea, Syria, or the Crimea, Donetsk, or Luhansk regions of Ukraine), (v) are not identified on, and are not owned or controlled by any person or entity identified on, any U.S. government restricted party lists (including the Specially Designated Nationals List, Denied Persons List, or Entity List), and (vi) are otherwise eligible to receive the Services under applicable laws and regulations, including U.S. export-control laws and international trade restrictions. We may require identity or compliance information (including &ldquo;know your customer&rdquo; checks) to verify eligibility.</p>
                  <p>Where Customer accesses the Services under a Staking Subscription or stakes NEAR in connection with NEAR AI Cloud services under Appendix B using a Wallet Address, Customer&apos;s continued eligibility and access are additionally subject to sanctions screening and, where required by NEAR AI based on applicable law, compliance risk, or usage thresholds specified in the product, Documentation, Appendix A or Appendix B, identity verification, as described in Section 10.8 and Appendix A (Section A.12) or Appendix B (Section B.10), as applicable. Customer consents to such screening and verification as a condition of using such features, and access may be denied, suspended, restricted, or permanently terminated where NEAR AI determines it is required to do so to comply with applicable law.</p>
                </Section>

                {/* Section 3 */}
                <Section id="section-3" number="3" title="Scope of the Services.">
                  <p>These Terms, which incorporate by reference NEAR AI&apos;s Acceptable Use Policy, govern your use of the Services. The Services consist solely of NEAR AI&apos;s AI Agent framework(s) and related tooling made available by NEAR AI, and do not include any specific AI Agent configurations, instructions, parameters, behaviors, or Outputs configured, defined or deployed by you. You are solely responsible for configuring, operating and deploying any AI Agents using the Services, including all instructions, parameters, integrations and use cases, and for any resulting Outputs or actions of such agents. For the avoidance of doubt, the Services do not include (i) the Third-Party Generative AI Services that NEAR AI makes available through the NEAR AI Cloud API, or (ii) any third-party or custom-built agents, integrations, or models not expressly provided by NEAR AI as part of the Services.</p>
                </Section>

                {/* Section 4 */}
                <Section id="section-4" number="4" title="Use of the Services.">
                  <SubSection number="4.1" title="Use of Services.">
                    <p>During the Term, NEAR AI will make the Services available to Customer in accordance with these Terms, the Documentation, and any applicable Order Form(s). Subject to the terms and conditions herein, Customer may use the Services to (i) generate Outputs based on its Inputs through Third-Party Generative AI Models made available within the NEAR AI Cloud, and (ii) make the Services available to its End Users as integrated into or through the Customer Application.</p>
                  </SubSection>
                  <SubSection number="4.2" title="Use Restrictions.">
                    <p>Customer will only use the Services for its legitimate purposes in accordance with these Terms, including the AUP. Customer&apos;s use of the Services will at all times comply with all applicable laws. Customer will not:</p>
                    <ul>
                      <li>(i) use, copy, modify or otherwise prepare derivative works of the Services, or any portion thereof, unless expressly authorized in these Terms;</li>
                      <li>(ii) use the Services to develop any product or artificial intelligence model that competes with the Services or any Third-Party Generative AI Services;</li>
                      <li>(iii) reverse engineer, disassemble, alter or decompile the Services, or otherwise attempt to derive or modify the source code of, or any processes, techniques, methods, specifications, protocols, algorithms, interfaces, data structures, or other information embodied or used in the Services;</li>
                      <li>(iv) interfere with or disrupt the Services, bypass or disable rate limits, security, or attestation/verification mechanisms, or falsify or tamper with attestation/verification data;</li>
                      <li>(v) automatically or programmatically extract data and/or outputs (e.g., via scraping or automated crawling of output interfaces), except via our published NEAR AI Cloud APIs under applicable rate limits;</li>
                      <li>(vi) misrepresent AI-generated content as human-created;</li>
                      <li>(vii) use Outputs to develop or train competing AI models, unless expressly permitted in a separate written agreement;</li>
                      <li>(viii) run cryptocurrency mining, proof-of-work/stake computations, or similar high-risk workloads without our prior written authorization;</li>
                      <li>(ix) use free-tier resources as a proxy/VPN or for workloads earning third-party financial rewards;</li>
                      <li>(x) sell, resell, sublicense, transfer, or distribute any or all of the Services;</li>
                      <li>(xi) use the Services to create, collect, transmit, store, use, or process any data that violates any applicable laws, or infringes, violates or otherwise misappropriates the intellectual property or other rights of any third party (including any moral right, privacy right or right of publicity);</li>
                      <li>(xii) use the Services, or allow the transfer, transmission, export, or re-export of the Services or portion thereof, in violation of any economic sanctions, export control laws or regulations administered by the U.S. Commerce Department or any other government agency (collectively, &ldquo;Trade Restrictions&rdquo;);</li>
                      <li>(xiii) remove any copyright, trademark, proprietary rights, disclaimer, or warning notice included on or embedded in any part of the Services or any other materials provided by NEAR AI or any copies thereof;</li>
                      <li>(xiv) use the Services or any Output in violation of the AUP; or</li>
                      <li>(xv) transmit, store, or process Protected Health Information except as permitted by an executed Business Associate Agreement (or &ldquo;BAA&rdquo;).</li>
                    </ul>
                  </SubSection>
                  <SubSection number="4.3" title="API Usage.">
                    <p>Customer shall not exceed the API usage limits, quotas, or thresholds set forth in the applicable Order Form, Documentation, or otherwise communicated by NEAR AI. Any use beyond such limits may result in account throttling, suspension, or additional fees, at NEAR AI&apos;s discretion.</p>
                  </SubSection>
                  <SubSection number="4.4" title="Virtual Machine Deployment.">
                    <p>The Services support multiple Deployment Types, including: (a) Standard VM Deployment, or (b) CVM Deployment, which may be offered as a Dedicated CVM or Shared CVM Instance (both of which are defined below), as further described in the applicable Documentation or Order Form. The applicable Deployment Type will be identified at the time of provisioning or in the Order Form at the time of contracting, and governs the technical, security and access characteristics of the Services. Standard VM Deployment is governed by Section 13 (Standard Virtual Machines), and CVM Deployment is governed by Section 14 (Confidential Virtual Machines). In the event of any conflict between provisions applicable to different Deployment Types, the provisions applicable to the selected Deployment Type shall control. A change in Deployment Type constitutes a material change to the Services and may require Customer action or an amendment to the applicable Order Form.</p>
                  </SubSection>
                  <SubSection number="4.5" title="Updates to the Services.">
                    <p>NEAR AI may make changes to the Services from time to time, including by adding or removing features, increasing or decreasing capacity limits, offering new services or discontinuing certain services. Except to the extent that Customer has prepaid for certain Services, NEAR AI will not be liable for any change to or any suspension or discontinuation of the Services or Customer&apos;s access to them.</p>
                  </SubSection>
                  <SubSection number="4.6" title="Beta Services.">
                    <p>From time to time, NEAR AI may make available to Customer services or functionality that are not generally made available to NEAR AI&apos;s customers and/or are designated as alpha, beta, pilot, preview, or similar designation (&ldquo;Beta Services&rdquo;). The purpose of Beta Services is to test and evaluate the functionality, performance, and usability of the features and capabilities within the Beta Services. Beta Services are not considered &ldquo;Services&rdquo; under these Terms. By accessing or using the Beta Services, Customer understands, acknowledges and agrees that the Beta Services (a) are not a final product and may contain defects, bugs, and other issues; and (b) are being provided solely on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis without any warranty of any kind, and may be modified or discontinued in our sole discretion. YOU ASSUME ALL RISKS AND COSTS ASSOCIATED WITH YOUR USE OF THE BETA SERVICES. Additionally, NEAR AI is not obligated to provide any maintenance, technical or other support for the Beta Services.</p>
                  </SubSection>
                  <SubSection number="4.7" title="Usage Data.">
                    <p>Customer acknowledges that NEAR AI uses Usage Data (excluding Customer Content or Personal Data) for legitimate business purposes related to the ongoing operation, development, security and improvement of the Services. NEAR AI will not disclose Usage Data externally except in de-identified and/or aggregated form (including across customers)that it does not reasonably identify Customer, its Authorized Users or any other person,.</p>
                  </SubSection>
                </Section>

                {/* Section 5 */}
                <Section id="section-5" number="5" title="Accounts; Authorized Users.">
                  <SubSection number="5.1" title="Accounts.">
                    <p>Customer must create an Account to use the Services and is responsible for the information it provides to create the Account, the security of its passwords for the Account (including any keys for the NEAR AI Cloud API), and for any use of its Account. Customer agrees that it will only make its Account available to Authorized Account Users. Customer is responsible for all activity that occurs under its Account, and shall immediately notify NEAR AI upon becoming aware of any unauthorized access to, or security breach involving, its login credentials or Account.</p>
                  </SubSection>
                  <SubSection number="5.2" title="Authorized Users.">
                    <p>Only Customer&apos;s Authorized Users may access and use the Services, provided, that (i) End Users may only access the Services through the Customer Application, and (ii) only Authorized Account Users may access the Services through the Customer&apos;s Account. Customer is responsible for the compliance with the terms of these Terms by its Authorized Account Users and for compliance of the End User Agreement by the End Users. Any act or omission that if committed by Customer that would constitute a breach of these Terms will be deemed to constitute a breach of these Terms if committed by Customer&apos;s Authorized Users.</p>
                  </SubSection>
                </Section>

                {/* Section 6 */}
                <Section id="section-6" number="6" title="Customer Obligations.">
                  <SubSection number="6.1" title="Compliance.">
                    <p>Customer will (a) ensure that Customer&apos;s, and its Authorized Users&apos;, use of the Services complies with these Terms, (b) ensure End Users enter into an End User Agreement and terminate access to the Services for any End User that violates the terms of such End User Agreement if it adversely affects NEAR AI, (c) use commercially reasonable efforts to prevent and terminate any unauthorized use of, or access to, the Services, and (d) immediately notify NEAR AI of any unauthorized use of, or access to, the Services, Account, or Customer&apos;s password of which Customer becomes aware.</p>
                  </SubSection>
                  <SubSection number="6.2" title="Input.">
                    <p>Customer is responsible for all Input it and its End Users submit to the Services. By submitting Input to the Services (on its own or its End Users&apos; behalf), Customer represents and warrants that it has all rights, licenses, and permissions that are necessary for NEAR AI to process the Input under these Terms. Customer also represents and warrants that any Input submitted to the Services under Customer&apos;s Account will not violate these Terms, NEAR AI&apos;s Acceptable Use Policy, or any laws or regulations applicable to the Input.</p>
                  </SubSection>
                  <SubSection number="6.3" title="Output.">
                    <p>Customer is responsible for all Output it creates. Subject to your compliance with these Terms, we assign you all of our right, title and interest, if any, in and to Outputs. Where required by law or regulation, you must disclose that Output was AI-generated and comply with applicable transparency obligations (e.g., EU AI Act, FTC guidance).</p>
                  </SubSection>
                </Section>

                {/* Section 6A */}
                <Section id="section-6A" number="6A" title="Generative AI Services.">
                  <p>Customer acknowledges and agrees that its use of and access to the Third-Party Generative AI Services made available to Customer with the Services are subject to terms and conditions specified by the owner of such services, and that it will abide by such terms and conditions at all times.</p>
                </Section>

                {/* Section 7 */}
                <Section id="section-7" number="7" title="Suspension of Access to Services.">
                  <SubSection number="7.1" title="Violations of Use Restrictions and AUP.">
                    <p>If NEAR AI becomes aware that Customer&apos;s or Customer&apos;s End Users use of the Services violates Section 4.2 (Use Restrictions) or the Acceptable Use Policy, then NEAR AI may suspend all or part of Customer&apos;s use of the Services until the violation is corrected.</p>
                  </SubSection>
                  <SubSection number="7.2" title="Other Suspensions.">
                    <p>In addition to its other rights of suspension, NEAR AI may also suspend all or part of Customer&apos;s use of the Services without prior notice if (a) NEAR AI reasonably believes suspension is needed to protect the Services, NEAR AI&apos;s infrastructure supporting the Services, or any other customer of the Services (or its authorized users); (b) there is suspected unauthorized third-party access to the Services; (c) NEAR AI reasonably believes that immediate suspension is required to comply with any applicable law; or (d) Customer, or its Authorized Users, are in breach of Section 4.2 (Restrictions). NEAR AI will reinstate Customer&apos;s access to the Services when the circumstances giving rise to the suspension have been resolved. At Customer&apos;s request, NEAR AI will, unless prohibited by applicable law, notify Customer of the basis for the suspension as soon as is reasonably possible.</p>
                  </SubSection>
                  <SubSection number="7.3" title="Exhaustion of Usage Credits.">
                    <p>See Appendix A, Section A.8 for consequences of exhaustion of Usage Credits under a Staking Subscription, and Appendix B, Section B.7 for consequences of exhaustion of Usage Credits under Appendix B.</p>
                  </SubSection>
                </Section>

                {/* Section 8 */}
                <Section id="section-8" number="8" title="Third-Party Services.">
                  <p>The Services may contain links to or integrations with third-party websites, platforms, applications, or services (collectively, &ldquo;Third-Party Services&rdquo;) that are subject to different terms and privacy practices. Customer&apos;s use of and interactions with Third-Party Services are governed by the third party&apos;s terms and not by these Terms. NEAR AI does not own or control Third-Party Services and is not responsible or liable for any aspect of such Third-Party Services, including but not limited to any harm or damages related to any interactions or transactions Customer may have with Third-Party Services (such as any information, content, or materials provided by Third-Party Services).</p>
                </Section>

                {/* Section 9 */}
                <Section id="section-9" number="9" title="Intellectual Property.">
                  <SubSection number="9.1" title="Services.">
                    <p>The Services, and all materials contained therein, and all Intellectual Property Rights related thereto are the exclusive property of NEAR AI and its licensors. NEAR AI reserves all rights not expressly granted herein in the Services.</p>
                  </SubSection>
                  <SubSection number="9.2" title="Customer Data.">
                    <p>As between Customer and NEAR AI, Customer (and its licensors or End Users, as applicable) retains all right, title, and interest in and to Customer Data, including Inputs that Customer submits to the Services and Output. Customer grants NEAR AI a limited license in Customer Data solely for the purpose of providing the Services to Customer and its End Users, as applicable. NEAR AI will not use Customer Data to train any generative AI models. NEAR AI also maintains written agreements with the providers of the Third-Party Generative AI Services prohibiting third parties from using Customer Data to train their AI models.</p>
                  </SubSection>
                  <SubSection number="9.3" title="Feedback.">
                    <p>At its option, Customer may provide feedback or suggestions about the Services to NEAR AI (&ldquo;Feedback&rdquo;). If Customer provides Feedback, then NEAR AI may use such Feedback without restriction and without obligation to Customer.</p>
                  </SubSection>
                </Section>

                {/* Section 10 */}
                <Section id="section-10" number="10" title="Subscriptions & Payment.">
                  <SubSection number="10.1" title="Usage Credits; Self-Serve:">
                    <p>Customer may access Services, including Third Party Generative AI Models hosted by NEAR AI and/or Agent Hosting Services, by purchasing prepaid usage credits (&ldquo;Usage Credits&rdquo;) using the payment methods or supported digital assets made available on the applicable NEAR AI Websites. Usage will reduce the available credit balance, and Customer may purchase additional Usage Credits at any time. If Customer exhausts available Usage Credits, access to the applicable Services will be suspended until additional Usage Credits are purchased. Usage Credits are non-transferable, non-refundable, and may expire as stated at the time of purchase.</p>
                  </SubSection>
                  <SubSection number="10.2" title="Subscription Types.">
                    <p>A subscription to the Agent Hosting Services is offered as one of two subscription types (each, a &ldquo;Subscription Type&rdquo;); a Plan (defined below) or Non-Staking Subscription, under which Customer pays the applicable fees using a supported payment method (such as a credit card via our third-party payment processor or payment in NEAR Tokens); or a Staking Subscription, under which Customer stakes NEAR as described in Appendix A. A Staking Subscription is offered in parallel to, and is not a Plan for the purposes of, the Subscription Plans and Recurring Billing provisions of this Section 10. This Section 10.2 applies to Agent Hosting subscriptions only and does not affect (i) the self-serve purchase of Usage Credits under Section 10.1, or (ii) staking-based accrual of Usage Credits for eligible NEAR AI Cloud services under Appendix B, each of which is available independently of any Subscription Type. Customer may not mix or switch Subscription Types during a subscription period; a change requires cancellation of the then-current subscription under Section 10.5 (Cancellation) and enrollment under the other Subscription Type.</p>
                  </SubSection>
                  <SubSection number="10.3" title="Subscription Plans.">
                    <p>We may offer one or more subscription plans, each with different available features, functionalities or length of subscription (each, a &ldquo;Plan&rdquo;). The fees for each Plan are as set forth on our Websites. We reserve the right to change our available Plans, or the fees for a Plan, at any time provided that such changes will only apply on a go-forward basis to any renewal of your subscription. We will charge your credit card as of the date you enroll in the Plan for the monthly amount associated with the Plan. Any use of the Services in excess of the usage limits set forth in a Plan will be billed in arrears.</p>
                  </SubSection>
                  <SubSection number="10.4" title="Recurring Billing.">
                    <p>By enrolling in one of our automatically renewing Plans, you authorize us and/or our third-party payment processor to charge your credit card at the beginning of your subscription term, and on a recurring basis, for the applicable charge and any and all taxes or possible transaction fees, and any other charges incurred in connection with your subscription. Your credit card will automatically be charged the applicable charge on the applicable renewal processing date unless you cancel before that date. Your Plan will continue for the period of time of the subscription period that you selected and will automatically renew until terminated. You must cancel your Plan before it renews in order to avoid billing of the subscription fees for the next billing cycle.</p>
                    <p>We may receive updated credit card information (new credit card number or updated expiration date) from your credit card issuer. We may use these new details to help prevent any interruption to your subscription. If you would like to use a different payment method or if there is a change in payment method, please visit the settings area of your account to update your billing information. If any subscription fee is not paid in a timely manner, or your transaction cannot be processed, we reserve the right to suspend, disable, cancel or terminate your access to the Services or cancel your subscription. You will be responsible for paying all past due amounts. Some credit card issuers may charge you certain fees, such as foreign transaction fees or other fees relating to the processing of your credit card. Check with your credit card provider for details. If your credit card cannot be processed for some reason, we may contact you via auto-generated email, text, or phone if you are opted-in to receive such forms of communication.</p>
                  </SubSection>
                  <SubSection number="10.5" title="Cancellation.">
                    <p>When you cancel a subscription, you cancel only future charges associated with your subscription. You may initiate your cancellation at any time, but the cancellation will become effective at the end of your then-current subscription period. In order to avoid future charges, you must cancel your subscription at least 24 hours prior to the end of your current subscription period. To cancel, please use the cancelation functions in your Customer Account or contact us at <a href="/mailto:hello@near.ai" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">hello@near.ai</a>. If you cancel, your right to use the Services under your Plan will continue until the end of your then-current subscription period (unless we provide you with a refund or otherwise allow you to use the unused portion towards another service or subscription) and will then terminate without further charges).</p>
                  </SubSection>
                  <SubSection number="10.6" title="No Refunds.">
                    <p className="uppercase text-sm leading-relaxed">All payments (including subscription fees, overage charges, and amounts paid for usage credits) are nonrefundable and not redeemable for cash, in whole or in part. For clarity, usage credits are nonrefundable.</p>
                    <p>If you cancel your subscription, you will not receive any refund and you will continue to have access to your Plan through the end of the subscription period. We reserve the right to issue refunds, credits, or discounts at our sole discretion. If we issue a refund, credit, or discount, we are under no obligation to issue the same or similar refund in the future and we may terminate your Plan and access to the Services.</p>
                  </SubSection>
                  <SubSection number="10.7" title="Free Trials & Promotions.">
                    <p>We may offer promotional trial subscriptions for free or at special discounted prices. If you sign up for a trial subscription, your rights to use the applicable portion of the Service are limited by the terms of such trial and will terminate or renew according to the terms of your trial arrangement and/or any applicable additional terms. You may cancel your subscription during your promotional period to avoid being charged the full applicable subscription fee using the procedures described in the &ldquo;Cancellation&rdquo; section above.</p>
                  </SubSection>
                  <SubSection number="10.8" title="Alternative Payment Methods.">
                    <p>In addition to the self-serve purchase of Usage Credits under Section 10.1 and the Agent Hosting subscription types under Section 10.2, NEAR AI may permit Customer to access certain Services using NEAR-based payment and staking mechanisms. For Agent Hosting Services, Customer may access the Services under a Staking Subscription governed by Appendix A. For eligible NEAR AI Cloud services designated by NEAR AI in the product or Documentation, including private inference and related cloud services, Customer may stake NEAR on a Non-Custodial basis through a Validator to accrue Usage Credits over time in accordance with Appendix B. In each case, Staking Rewards generated in respect of Customer&apos;s Staked NEAR are routed, protocol-direct, to NEAR AI as consideration for the applicable Services, and are not paid, credited, or otherwise made available to Customer as income, yield, or return. The operational mechanics, repricing policies, tax disclosures, and limitations applicable to Agent Hosting staking and NEAR AI Cloud staking are set forth in Appendix A and Appendix B, respectively.</p>
                  </SubSection>
                </Section>

                {/* Section 11 */}
                <Section id="section-11" number="11" title="Confidential Information.">
                  <SubSection number="11.1" title="Definition.">
                    <p>&ldquo;Confidential Information&rdquo; means information that one Party (or an Affiliate) discloses to the other Party under or in connection with these Terms, and which is marked as confidential or, under the circumstances surrounding the disclosure, would reasonably be considered confidential. Confidential Information does not include information that is independently developed by the Recipient, is rightfully given to the Recipient by a third party without confidentiality obligations or becomes public through no fault of the Recipient. Subject to the preceding sentence, Customer Data is considered Customer&apos;s Confidential Information.</p>
                  </SubSection>
                  <SubSection number="11.2" title="Obligations.">
                    <p>The Parties acknowledge that in connection with these Terms, each may receive (as the &ldquo;Recipient&rdquo;) and disclose (as the &ldquo;Discloser&rdquo;) certain Confidential Information. The Recipient will only use the Discloser&apos;s Confidential Information to exercise the Recipient&apos;s rights and fulfill its obligations under these Terms and will use reasonable care to protect against the disclosure of the Discloser&apos;s Confidential Information. The Recipient may disclose Confidential Information only to its and its Affiliates&apos; employees, agents, subcontractors, or professional advisors (&ldquo;Representatives&rdquo;) who need to know it and who have agreed in writing (or in the case of professional advisors are otherwise bound) to keep it confidential. The Recipient will ensure that its Representatives use the received Confidential Information only to exercise rights and fulfill obligations under these Terms.</p>
                  </SubSection>
                  <SubSection number="11.3" title="Required Disclosure.">
                    <p>In the event that Recipient or any of its Representatives is required to disclose Confidential Information to the extent necessary to comply with the requirements of law, legal process (including deposition, interrogatory, request for documents, subpoena, civil investigative demand or similar process) or valid order of a court of competent jurisdiction, the recipient shall (a) notify the Discloser prior to making such disclosure in order to permit Discloser to seek confidential treatment of such Confidential Information, and (b) in any event disclose only that portion of Discloser&apos;s Confidential Information that is legally required to be disclosed.</p>
                  </SubSection>
                </Section>

                {/* Section 12 */}
                <Section id="section-12" number="12" title="Data Privacy & Security.">
                  <SubSection number="12.1" title="Data Privacy.">
                    <p>NEAR AI will process any Personal Data contained in Business Contact Information in accordance with NEAR AI&apos;s <a href="/privacy-policy" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">Privacy Policy</a>; and to the extent NEAR processes any Personal Data contained in the Customer Data, it will do so in accordance with the <a href="/near-ai-data-processing-agreement-for-customers" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">Data Processing Agreement</a> which is incorporated by reference herein.</p>
                  </SubSection>
                  <SubSection number="12.2" title="Security.">
                    <p>NEAR has implemented and will maintain technical, organizational, and physical measures consistent with recognized industry standards and practices designed to ensure the confidentiality, integrity and availability of Customer Data.</p>
                  </SubSection>
                </Section>

                {/* Section 13 */}
                <Section id="section-13" number="13" title="Standard Virtual Machines.">
                  <SubSection number="13.1" title="Scope.">
                    <p>This Section 13 solely applies to Services deployed using Standard VM Deployment.</p>
                  </SubSection>
                  <SubSection number="13.2" title="Nature of Standard VM Deployment.">
                    <p>Standard VM Deployment provides a virtualized compute environment without hardware-based TEEs, memory encryption or equivalent confidential computing protections.</p>
                  </SubSection>
                  <SubSection number="13.3" title="NEAR AI Access and Observability.">
                    <p>In contrast to CVM Deployments, Customer acknowledges and agrees that, in Standard VM environments, NEAR AI may have access to Customer workloads and associated data, including without limitation: (i) prompts, Inputs, and Outputs; (ii) application data and files stored within the environment; (iii) logs, telemetry, and execution metadata; (iv) API calls, connectors, and external interactions; and (v) credentials, tokens, and keys stored or used within the environment. In each of (i) - (v), NEAR AI&apos;s access shall be solely for the purposes of (a) providing, maintaining and securing the Services, (b) debugging, diagnostics and technical support, (c) performance optimization and system improvement; and (d) enforcing these Terms and its applicable policies.</p>
                  </SubSection>
                  <SubSection number="13.4" title="No Model Training.">
                    <p>NEAR AI will not use Customer Data from Standard VM environments for training or fine-tuning machine learning models, except as expressly agreed.</p>
                  </SubSection>
                  <SubSection number="13.5" title="Customer Responsibility for Security Configuration.">
                    <p>Customer is responsible for implementing appropriate safeguards within Standard VM environments, including encryption, credential management, and access controls. Customer acknowledges that Standard VM environments do not provide the hardware-level isolation guarantees of CVMs.</p>
                  </SubSection>
                  <SubSection number="13.6" title="Shared Responsibility Model.">
                    <p>NEAR AI is responsible for the underlying infrastructure,including virtualization, networking and physical security. Customer is responsible for workload-level security, including applications, data handling, identity management and credential usage.</p>
                  </SubSection>
                  <SubSection number="13.7" title="No Confidential Compute Guarantees.">
                    <p>NEAR AI makes no representation that Standard VM Deployments provide protection against access to data in use, memory inspection or similar risks addressed by confidential computing technologies.</p>
                  </SubSection>
                  <SubSection number="13.8" title="Data Handling and Visibility.">
                    <p>Customer acknowledges that NEAR AI&apos;s operational access to Standard VM environments may result in the access to and processing of Customer Data as necessary to provide the Services, subject to these Terms and its applicable privacy obligations herein.</p>
                  </SubSection>
                </Section>

                {/* Section 14 */}
                <Section id="section-14" number="14" title="Confidential Virtual Machines.">
                  <SubSection number="14.1" title="Scope.">
                    <p>This Section 14 applies solely to Services deployed using Confidential Virtual Machines (CVMs).</p>
                  </SubSection>
                  <SubSection number="14.2" title="CVM Deployment Offerings.">
                    <p>NEAR AI offers CVM-based deployment in two distinct configurations, each as described in the applicable Documentation or Order Form, as follows: (i) <strong>&ldquo;Dedicated CVM&rdquo;</strong>, which means a CVM deployment in which Customer is allocated an entire physical hardware stack, including the processor, memory and storage, reserved exclusively for Customer&apos;s workloads, with no co-tenancy at the hardware level; and (ii) <strong>&ldquo;Shared CVM Instance&rdquo;</strong>, which means a logically isolated CVM instance deployed within a physical hardware environment that is shared among multiple customers, with isolation enforced through hardware-based memory encryption and TEE partitioning. The provisions of this Section 14 apply to both Dedicated CVMs and Shared CVM Instances, unless expressly stated otherwise. Where a provision is identified as applying to a specific deployment configuration, that provision governs Customer&apos;s rights and obligations with respect to that configuration only. The applicable deployment configuration shall be identified in the Order Form at the time of contracting. A change from one deployment tier to another constitutes a material change to the Services and requires a written amendment to the applicable Order Form.</p>
                  </SubSection>
                  <SubSection number="14.3" title="Availability.">
                    <p>Where NEAR AI makes CVM-based deployment available as part of the Services, Customer may elect to deploy workloads within CVM environments subject to this Section. NEAR AI does not warrant that CVM-based deployment will be available in all regions, configurations or service tiers, and reserves the right to modify, suspend or discontinue CVM availability upon reasonable notice to Customer in a manner consistent with the Customer&apos;s method of creating an Account.</p>
                  </SubSection>
                  <SubSection number="14.4" title="Attestation.">
                    <p>For purposes of this Section, &ldquo;Attestation&rdquo; means the cryptographic process by which the integrity and configuration of a CVM environment, including its TEE, can be verified by Customer prior to submitting workloads. Where NEAR AI makes Attestation available in connection with CVM environments, Customer is solely responsible for independently verifying Attestation prior to submitting sensitive workloads to a CVM. NEAR AI makes no representation that Attestation reports constitute a warranty that the underlying hardware is free of undisclosed vulnerabilities.</p>
                    <p><strong>14.4.1 Dedicated CVMs.</strong> Attestation, when available as a feature, covers the integrity and configuration of the entire allocated hardware stack and its TEE, as further described in the applicable Documentation.</p>
                    <p><strong>14.4.2 Shared CVM Instances.</strong> Attestation, when available as a feature, verifies the integrity and configuration of Customer&apos;s logical instance and its TEE partition only. Attestation does not extend to verifying the absence of co-tenant workloads on the underlying shared physical hardware, and Customer acknowledges that the physical hardware may simultaneously host other customers&apos; instances.</p>
                  </SubSection>
                  <SubSection number="14.5" title="Shared Responsibility.">
                    <p>Customer is solely responsible for securely configuring workloads, encryption, managing cryptographic keys used within the TEE (including generating, rotating, safeguarding and, upon termination, destroying such keys), identity and access controls, and secure application design within CVM environments. Customer further acknowledges that NEAR AI does not have access to cryptographic keys managed by Customer within the TEE and accordingly cannot recover Customer workloads, data or configurations in the event of Customer&apos;s loss or destruction of such keys. Notwithstanding the foregoing, NEAR AI is responsible for maintaining the logical isolated between Customer&apos;s Shared CVM Instance and other tenants&apos; instances through hardware-enforced memory encryption and TEE partitioning.</p>
                  </SubSection>
                  <SubSection number="14.6" title="NEAR AI Access Limitations.">
                    <p>NEAR AI will make available, upon reasonable written request and subject to confidentiality obligations herein, a summary of the security controls applicable to its CVM infrastructure. Consistent with the design of CVM environments and the isolation properties of TEEs as defined herein, NEAR AI does not have access to the contents of Customer workloads, memory or data processed within a running TEE during normal operations. Notwithstanding the foregoing, with respect to Shared CVM Instances, NEAR AI retains access to share physical infrastructure components underlying Customer&apos;s instance; however, NEAR AI&apos;s infrastructure-level access does not extend to the contents of Customer&apos;s encrypted TEE.</p>
                    <p>Customer acknowledges that the foregoing architectural limitation may affect NEAR AI&apos;s ability to provide technical support, perform diagnostics or respond to incidents that require workload-level information, and Customers agrees to provide reasonable cooperation (including workload-level access or information) where Customer determines it is appropriate to do so in connection with a Customer support request.</p>
                    <p className="uppercase text-sm leading-relaxed">Notwithstanding any other provision of these Terms or the nature of the applicable Deployment Configuration, the use of a CVM (whether as a Dedicated CVM or Shared CVM Instance) does not grant Customer, and Customer hereby expressly waives, any right of physical access to, or physical possession of, any NEAR AI servers, hardware, equipment, real or personal property, or other assets used in connection with the provision of the Services. For the avoidance of doubt, designation of a deployment as a &ldquo;Dedicated CVM&rdquo; refers exclusively to the logical and hardware-level isolation of Customer&apos;s allocated resources and does not confer any proprietary, possessory, or access right in or to the underlying physical infrastructure.</p>
                  </SubSection>
                  <SubSection number="14.7" title="Customer Acknowledgements.">
                    <p>Customer acknowledges that CVMs and TEEs are intended to reduce the risk of unauthorized access, but do not eliminate all security risks. In particular, Customer acknowledges that (i) hardware-level vulnerabilities, including side-channel attacks, firmware weaknesses, and microcode deficiencies in the underlying TEE hardware, may exist and may not be known to NEAR AI at the time of deployment; (ii) the security properties of CVMs depend in part on the integrity of hardware manufacturer attestation infrastructure outside of NEAR AI&apos;s control; (iii) the protections afforded by TEEs, as noted in the definition thereof, are subject to inherent technical limitations and do not extend to threats originating from within Customer&apos;s own workloads, applications, or identity and access management configurations; and (iv) with respect to Shared CVM Instances only, Shared CVM Instances are deployed on physical hardware that simultaneously hosts other customers&apos; workloads, and that while hardware-enforced memory encryption and TEE partitioning are designed to prevent cross-tenant access, side-channel vulnerabilities or other advanced hardware-level attack vectors may theoretically exploit the shared physical environment in ways that are outside NEAR AI&apos;s control and that are not present in a Dedicated CVM deployment.</p>
                  </SubSection>
                  <SubSection number="14.8" title="Disclaimers.">
                    <p>NEAR AI makes no representations or warranties that the use of CVMs will prevent all unauthorized access, hardware-level vulnerabilities, side-channel attacks or other advanced threats. NEAR AI further makes no representation that the use of CVMs or TEEs in connection with Customer&apos;s use of the Services satisfies any specific regulatory, compliance or contractual requirement applicable to Customer, or any applicable laws or regulations. Customer&apos;s compliance with applicable regulatory obligations remains solely Customer&apos;s responsibility, including, without limitation.</p>
                  </SubSection>
                  <SubSection number="14.9" title="Termination and Data Destruction.">
                    <p>Upon expiration or termination of CVM-based Services, or upon Customer&apos;s written request, NEAR AI will decommission the applicable CVM environments in accordance with its standard decommissioning processes. Where Customer manages the cryptographic keys within the TEE, Customer&apos;s deletion of those keys constitutes Customer&apos;s primary mechanism for rendering associated data irrevocable. NEAR AI disclaims any and all responsibility for data that remains in encrypted form solely because Customer has not exercised its key destruction capabilities.</p>
                    <p><strong>14.9.1 Dedicated CVMs.</strong> NEAR AI&apos;s decommissioning procedures for Dedicated CVMs are designed to render encrypted CVM memory, storage, and host-level data irrecoverable across the entire allocated physical hardware stack, in accordance with NEAR AI&apos;s documented data destruction standards. Upon Customer&apos;s written request, NEAR AI will provide a written confirmation that decommissioning of the applicable Dedicated CVM hardware has been completed in accordance with such standards.</p>
                    <p><strong>14.9.2 Shared CVM Instances.</strong> NEAR AI&apos;s decommissioning procedures for Shared CVM Instances are designed to render the logical instance and its encrypted TEE partition irrecoverable. Customer acknowledges that the underlying physical hardware on which the Shared CVM Instance was hosted will continue to be used to host other customers&apos; workloads following decommissioning of Customer&apos;s instance, and that NEAR AI&apos;s host-level decommissioning commitment is scoped to Customer&apos;s logical instance and encrypted partitions. Customer&apos;s deletion of its cryptographic keys is the primary mechanism for rendering data within the TEE irrecoverable, and is not dependent on NEAR AI&apos;s decommissioning of the physical hardware.</p>
                  </SubSection>
                </Section>

                {/* Section 15 */}
                <Section id="section-15" number="15" title="AI Agent Hosting Services and Inference.">
                  <SubSection number="15.1" title="Default Inference Routing (Agent Hosting).">
                    <p>For Agent Hosting deployments, inference requests are by default processed using NEAR AI-operated AI models within NEAR AI infrastructure, and Customer Data does not leave NEAR AI-controlled systems in this default configuration, except where (i) Customer or its Authorized Users select or enable third-party models or inference routing providers, (ii) a Customer routes inference requests through its own third-party API keys (e.g., OpenAI or Anthropic), or (iii) Customer or its Authorized Users configure third-party Channel Integrations (defined below) with Third-Party Channel Providers (defined below), in each case where Customer Data may be transmitted to and processed by the applicable third-party provider&apos;s systems.</p>
                  </SubSection>
                  <SubSection number="15.2" title="Bring Your Own Model; API Keys.">
                    <p>Customer may configure AI Agents to used third-party AI models via Customer-provided API keys or credentials. In such cases: (i) inference requests are sent directly from Customer&apos;s AI Agent to the third-party model provider; (ii) NEAR AI does not process, route or transmit such requests; and (iii) Customer is solely responsible for compliance with the third-party model provider&apos;s terms and policies, and all laws and regulations applicable to use of such model. NEAR AI disclaims all responsibility and liability for third-party inference services access in the foregoing manner.</p>
                  </SubSection>
                  <SubSection number="15.3" title="Third-Party Channel Integrations.">
                    <p>Customer or its Authorized Users may initiate and configure AI Agents under its control to transmit Customer Data via third-party messaging and communication platforms (including but not limited to Slack, Telegram, Discord and WhatsApp) (&ldquo;Channel Integrations&rdquo; and any such individual third-party channel, a &ldquo;Third-Party Channel Provider&rdquo;). Where such Customer-controlled AI Agent has access to or transmission of Customer Data via a Third-Party Channel Provider as part of completing a task, such action is deemed to occur at Customer&apos;s direction and under Customer&apos;s authorization. In such cases: (i) Customer Data, including Input and Output, is transmitted directly to the relevant Third-Party Channel Providers; (ii) NEAR AI does not control, filter or process Customer Data once transmitted to such Third-Party Channel Providers; and (iii) Customer is solely responsible for compliance with the applicable Third-Party Channel Provider&apos;s terms and policies, and all laws and regulations applicable to the transmission of Customer Data via such channels, and acknowledges that it has independently reviewed and agreed to such terms. For purposes of applicable data protection laws, Customer acts as the controller (or equivalent) with respect to any Customer Data transmitted via Channel Integrations, and the applicable Third-Party Channel Provider acts as an independent controller or processor to Customer (and not as a sub-processor to NEAR AI). NEAR AI disclaims all responsibility and liability for Customer Data processed by Third-Party Channel Providers in the foregoing manner, and such Third-Party Channel Providers are not deemed sub-processors of NEAR AI by virtue of such integrations.</p>
                  </SubSection>
                  <SubSection number="15.4" title="Agentic Operations and Third-Party Service Interactions.">
                    <p>NEAR AI may enable AI Agents to interact with third-party services, APIs, and other external systems using credentials, tokens, keys, or other authentication materials provided or authorized by Customer or its Authorized Users (&ldquo;Customer-Provided Credentials&rdquo;). Where Customer configures an AI Agent to use Customer-Provided Credentials to access or transmit Customer Data to a third party in the course of completing a task, such interaction occurs at Customer&apos;s direction and under Customer&apos;s authorization, and Customer is solely responsible for (i) the security, scoping, rotation, and revocation of such Customer-Provided Credentials, and (ii) compliance with the applicable third party&apos;s terms, policies, and applicable laws and regulations. NEAR AI does not control, and is not responsible for, the third party&apos;s processing of Customer Data after such data is transmitted to or accessed by that third party using Customer-Provided Credentials, and such third party is not deemed a sub-processor of NEAR AI by virtue of such interaction.</p>
                  </SubSection>
                  <SubSection number="15.5" title="No Training Use.">
                    <p>NEAR AI does not use Customer Data from AI Agent Hosting environments to train or fine-tune machine learning models, unless expressly agreed to in writing.</p>
                  </SubSection>
                  <SubSection number="15.6" title="Deployment Type Differences.">
                    <p>Customer acknowledges that data visibility, access, and security characteristics differ materially between Standard VM Deployment and CVM Deployment, as described in Section 13 and 14, respectively.</p>
                  </SubSection>
                </Section>

                {/* Section 16 */}
                <Section id="section-16" number="16" title="AI Agent Software.">
                  <SubSection number="16.1" title="Scope.">
                    <p>This Section 16 applies to all AI Agent Software deployed by Customer within the NEAR AI Hosting Platform.</p>
                  </SubSection>
                  <SubSection number="16.2" title="Customer Responsibility for AI Agent Conduct.">
                    <p>Customer is solely and exclusively responsible for all actions taken by any AI Agent deployed under Customer&apos;s Account, regardless of whether such actions were explicitly authorized, foreseeable or intended by Customer. Customer agrees that the foregoing responsibility is not diminished by the autonomous nature of the AI Agent, or the fact that the AI Agent was developed by a third party. Without limiting the foregoing, Customer shall be responsible for:</p>
                    <ul>
                      <li><strong>16.2.1</strong> all actions taken by sub-agents, delegated processes, or additional agent instances initiated by an AI Agent originally deployed by Customer, which shall be attributed to Customer for all purposes under these Terms;</li>
                      <li><strong>16.2.2</strong> all effects and results of AI Agent actions, including API calls and use of other connectors (e.g., APIs, SDKs, CLIs, plugins, Model Context Protocol (MCP) tools/servers, webhooks), data submissions, communications, content generation, financial transactions, and any other actions taken by an AI Agent in the course of executing its assigned tasks;</li>
                      <li><strong>16.2.3</strong> ensuring that each AI Agent is configured with appropriate scope limitations, permission boundaries, and intervention mechanisms prior to deployment; and</li>
                      <li><strong>16.2.4</strong> implementing and maintaining human oversight mechanisms sufficient to monitor AI Agent behavior, detect anomalous or unintended actions, and intervene where necessary, including where such monitoring must be implemented by Customer within its CVM, given NEAR AI&apos;s inability to access AI Agent activity within a TEE.</li>
                    </ul>
                  </SubSection>
                  <SubSection number="16.3" title="Deployment Type and NEAR AI Visibility.">
                    <p>The scope of NEAR AI&apos;s visibility into AI Agent behavior depends on the applicable Deployment Type:</p>
                    <p><strong>16.3.1 AI Agents in Standard VM Environments.</strong> Where Customer deploys AI Agents within Standard VM environment, Customer acknowledges that: (i) NEAR AI may have visibility into and access to AI Agent behavior, including prompts, Outputs, logs and interactions, for the purposes described in Section 13.3; (ii) NEAR AI may use such access to provide debugging, support, security monitoring and performance optimization; (iii) notwithstanding such access, NEAR AI does not assume, and disclaims all, responsibility for monitoring, controlling or intervening in AI Agent behavior, and Customer remains solely responsible for AI Agent configurations, actions and outcomes; and (iv) NEAR AI does not undertake to review AI Agent outputs or actions for accuracy, legality or compliance, except as required to enforce these Terms or pursuant to applicable law. Customer should not rely on NEAR AI access as a substitute for implementing appropriate safeguards, monitoring and controls over AI Agent behavior.</p>
                    <p><strong>16.3.2 AI Agents in CVM Environments.</strong> This Section 16.3.2 applies only to AI Agents deployed within CVM environments. Where Customer deploys AI Agents within its CVM, Customer acknowledges that the architecture of the TEE is designed such that NEAR AI has limited or no ability to observe, access, audit, log, intervene in, or otherwise monitor AI Agent behavior, decisions, outputs, data processing or credential use within the TEE. Customer acknowledges that this limitation is inherent to the confidential computing architecture described above in Section 14 and is not a deficiency in the NEAR AI Cloud. Customer further and expressly acknowledges that as a direct result of the CVM architecture: (i) NEAR AI cannot detect or prevent unauthorized, anomalous, or harmful AI Agent behavior occurring within a CVM in real time; (ii) NEAR AI cannot recover, reconstruct, or provide access to any AI Agent outputs, decisions, logs, processed data, or other information generated within a CVM, whether for Customer&apos;s benefit, in response to a legal process, or otherwise; and (iii) NEAR AI cannot provide any audit trail, activity log, or compliance record of AI Agent actions occurring within a CVM, and Customer is solely responsible for implementing any logging, monitoring, or audit capability it requires within its own CVM environment. For the avoidance of doubt, Customer&apos;s responsibility for AI Agent conduct is not contingent on any monitoring, oversight or intervention capability that NEAR AI might otherwise provide to Customer in a non-CVM deployment.</p>
                  </SubSection>
                  <SubSection number="16.4" title="Persistent Compute Lifecycle.">
                    <p>AI Agents deployed on the NEAR AI Cloud may operate as persistent compute processes across extended periods. Customer acknowledges and agrees to the following with respect to the lifecycle of such persistent AI Agent deployments:</p>
                    <ul>
                      <li><strong>16.4.1 No Backup.</strong> NEAR AI does not provide backup services for AI Agent processes or in-enclave AI Agent state. Customer is solely responsible for implementing any state persistence, checkpointing, or recovery mechanisms it requires within its CVM environment. NEAR AI shall have no responsibility for loss of AI Agent state, in-progress task data, or intermediate outputs resulting from suspension, interruption, or termination of Customer&apos;s CVM instance.</li>
                      <li><strong>16.4.2 Suspension.</strong> NEAR AI may suspend a CVM instance hosting an AI Agent in accordance with Section 16.2, or for maintenance, resource management, or operational reasons, upon notice to Customer, if the Customer&apos;s Account supports notification. Customers creating Accounts with NEAR wallets acknowledge and accept that they will not receive notice under this Section or these Terms in general since we do not hold email addresses for Accounts created with a NEAR wallet. Suspension may interrupt AI Agent execution mid-task. Customer acknowledges that suspended Agent instances may not resume from the point of interruption, and that any in-progress Agent tasks, queued actions, or pending external API calls may be abandoned or lost upon suspension. Customer is solely responsible for designing AI Agents to handle such suspension and interruption, including implementing controls designed to prevent unintended duplicate execution of actions, task queuing, and external state management where required.</li>
                      <li><strong>16.4.3 Termination.</strong> Upon termination of Customer&apos;s CVM-based Services, whether by Customer or NEAR AI, all AI Agent processes operating within the CVM will be terminated. Section 14.9 above governs the decommissioning and data destruction obligations applicable to a CVM upon such termination. Customer acknowledges that any AI Agent tasks in progress at the time of termination will not be completed by NEAR AI, and that NEAR AI shall have no responsibility for the consequences of mid-task AI Agent termination, including any third-party effects of uncompleted AI Agent actions.</li>
                      <li><strong>16.4.4 No Recovery of In-TEE State.</strong> Consistent with the architecture design described in Section 14.5 and Section 16.3.2, NEAR AI cannot access, recover, or reconstruct any AI Agent state, memory, task history, or processed data that existed within a TEE at the time of suspension or termination. Customer&apos;s sole mechanism for preserving AI Agent state is to implement state externalization or data persistence mechanisms within its own CVM environment prior to suspension or termination.</li>
                      <li><strong>16.4.5 Backup and Recovery for Non-Confidential Environments.</strong> For AI Agent deployments in Standard VM environments, NEAR AI may maintain encrypted backup copies of AI Agent state, memory, task history, or processed data for recovery purposes. Such backup data is encrypted using Customer-provided keys, and any decryption occurs only within the applicable execution environment, with decrypted data not leaving such environment. Customer may render such backup data permanently inaccessible by destroying the applicable encryption keys.</li>
                    </ul>
                  </SubSection>
                  <SubSection number="16.5" title="AI Agent Credentials.">
                    <p>AI Agents frequently require third-party credentials, including API keys, OAuth tokens, service account credentials, access tokens, and similar authentication materials (collectively, &ldquo;AI Agent Credentials&rdquo;), to execute their assigned tasks. Customer is solely responsible for all AI Agent Credentials stored within or provided to any AI Agent operating within Customer&apos;s CVM environment, including the security, appropriate scoping, rotation and revocation thereof, and for all actions taken by an AI Agent using such credentials. Additionally, in the event that AI Agent Credentials are compromised, misused, or used by an AI Agent in a manner that exceeds the intended scope, whether as a result of AI Agent behavior, a security vulnerability in the AI Agent Software, or otherwise, Customer shall have sole responsibility for all resulting losses, damages, and third-party claims related thereto. Furthermore, Customer is solely responsible for ensuring that its storage and use of AI Agent Credentials within its CVM complies with the terms and conditions of the applicable third-party credential provider.</p>
                  </SubSection>
                  <SubSection number="16.6" title="Third-Party AI Agent Software Disclaimer.">
                    <p>This Section 16.6 applies only to Third-Party AI Agent Software deployed by Customer on the NEAR AI Cloud. Customer acknowledges that NEAR AI is not the developer, maintainer, licensor, or distributor of any Third-Party AI Agent Software. Notwithstanding anything to the contrary in these Terms, NEAR AI makes no representation or warranty of any kind with respect to any Third-Party Agent Software. Customer is solely responsible for evaluating, testing and validating any Third-Party AI Agent Software prior to deployment in the NEAR AI Cloud, including within Customer&apos;s CVM. NEAR AI shall have no responsibility, and disclaims any and all liability for, any loss, damage or claim arising from Third-Party Agent Software.</p>
                  </SubSection>
                  <SubSection number="16.7" title="IronClaw Framework.">
                    <p>Customer acknowledges that the IronClaw framework is open source software made available under a dual MIT/Apache-2.0 license (the &ldquo;IronClaw License&rdquo;) and agrees to abide by the IronClaw License in its use of IronClaw. Notwithstanding anything to the contrary in these Terms, NEAR AI&apos;s rights, obligations, and liability with respect to IronClaw&apos;s source code, framework architecture, and inherent functionality, in its capacity as open source software, are governed exclusively by the IronClaw License and not by these Terms. NEAR AI makes no representation or warranty of any kind, whether express or implied, as to the suitability of IronClaw&apos;s source code or inherent framework design for any particular deployment configuration, use case, or integration with Customer AI Agents or any Third-Party AI Agent Software. Customer is solely responsible for evaluating IronClaw&apos;s source code and inherent functionality and determining its suitability for Customer&apos;s intended use, including any configuration or modification thereof. For the avoidance of doubt, this Section 17.7 does not limit or modify NEAR AI&apos;s obligations under these Terms with respect to NEAR AI&apos;s operation of the Platform, including any applicable Platform warranties, service levels, and security commitments, where IronClaw is deployed as a hosted component thereof.</p>
                  </SubSection>
                  <SubSection number="16.8" title="AI Agent Indemnification.">
                    <p>In addition to any other indemnification obligations set forth in these Terms, to the extent Customer deploys an AI Agent in connection with its use of the Services, Customer agrees that it will defend, indemnify and hold harmless NEAR AI Indemnitees (defined below) from and against any and all Losses incurred by a NEAR AI Indemnitee arising out of or relating to a Claim to the extent arising from (a) any action taken by an AI Agent deployed under Customer&apos;s Account, including any actions taken by sub-agents or delegated processes attributable to Customer; (b) any misuse, unauthorized use, compromise, or excessive use of AI Agent Credentials stored within or provided to an AI Agent operating within Customer&apos;s CVM; (c) any failure by Customer to comply with the terms and conditions of any API provider in connection with AI Agent-driven API usage; (d) any claim by a data subject, regulatory authority, or third party arising from AI Agent-driven data processing, including claims relating to automated decision-making, unlawful processing, or failure to honor data subject rights; and (e) an allegation that content generated by an AI Agent, or an AI Agent&apos;s use third-party materials, models or outputs, infringes upon, or misappropriates, such third party&apos;s Intellectual Property Rights.</p>
                  </SubSection>
                  <SubSection number="16.9" title="AI Agent-Specific Prohibited Uses.">
                    <p>Without limiting the restrictions set forth in Section 4.2 (Use Restrictions) and the AUP, the following uses of AI Agents within the Platform are prohibited. Customer agrees that it shall not, and shall not permit any third party to, deploy, operation or permit the operation of any AI Agent that: (a) operates without adequate human oversight; (b) engages in unlawful, unauthorized or harmful automated interactions with third parties, including, without limitation, unlawful or unauthorized web scraping, credential stuffing, account enumeration, vulnerability scanning, human impersonation, or failure to identify itself as an automated system where such disclosure is required by applicable law or regulation; (c) evades external monitoring capabilities or bypasses safety controls, content filters or usage restrictions; (d) processes personal data unlawfully or generates, distributes or amplifies content that violates NEAR AI&apos;s AUP; and (e) provides or facilitates advice, determinations or outputs in regulated domains (e.g., medical diagnoses or treatment, legal advice, financial advice) without legally-required authorizations, licenses and human oversight mechanisms.</p>
                  </SubSection>
                </Section>

                {/* Section 17 */}
                <Section id="section-17" number="17" title="Representations & Warranties.">
                  <SubSection number="17.1" title="Mutual Representations & Warranties.">
                    <p>Each Party represents and warrants that (a) it has full power and authority to enter into these Terms, and (b) it will comply with all laws applicable to its obligations under these Terms.</p>
                  </SubSection>
                  <SubSection number="17.2" title="Customer Representations & Warranties.">
                    <p>In addition to the warranties set forth in Section 17.1 above, Customer represents and warrants that (a) it has obtained, and will maintain, all necessary rights, licenses and consents to use, host and deploy any Customer Application; (b) it has obtained, and will maintain, all rights, licenses, consents, and authorizations required by applicable law, and has provided all notices required by applicable law, to allow Customer to upload, use, transmit and grant NEAR AI the rights to access, use and process Customer Data, including any Personal Data contained therein, in connection with the Services; (c) its use of the Services, will comply with all applicable laws, regulations and NEAR AI&apos;s Acceptable Use Policy; (d) it will not, and will not permit any Authorized User to, use the Services, or any Customer Application in connection with the Services, in connection with content or activities that are unlawful, obscene, deceptive, defamatory, harassing, discriminatory or otherwise violate applicable law; and (e) it is solely responsible for reviewing, evaluating, and determining the appropriateness of any Outputs, whether generated through Third-Party Generative AI Services, and for any reliance by Customer and its Authorized Users on such Outputs.</p>
                  </SubSection>
                  <SubSection number="17.3" title="Limited NEAR AI Warranty.">
                    <p>NEAR AI warrants that the Services will substantially comply with any applicable Documentation. In the event of a breach of the foregoing warranty, Customer&apos;s exclusive remedy, and NEAR AI&apos;s sole obligation, will be to use commercially reasonable efforts to provide an error-correction or work-around that corrects the non-conformity within a reasonable time after such nonconformity is identified and reported by Customer to NEAR AI in writing. This warranty will not apply if errors are caused by events outside of NEAR AI&apos;s control or if the Services are not used in accordance with these Terms or the Documentation.</p>
                  </SubSection>
                </Section>

                {/* Section 18 */}
                <Section id="section-18" number="18" title="Disclaimers.">
                  <p className="uppercase text-sm leading-relaxed">Except as expressly provided for in these Terms, NEAR AI makes no warranty and expressly disclaims, to the fullest extent permitted by applicable law any warranties of any kind, whether express, implied, statutory, or otherwise, including warranties of merchantability, fitness for a particular use, title, noninfringement, or uninterrupted or error-free operation of the Services.</p>
                  <p className="uppercase text-sm leading-relaxed">In addition, to the maximum extent permitted by law, NEAR AI disclaims all liability arising from or related to Customer Applications, Third-Party Generative AI Services, and any Outputs generated by Third-Party Generative AI Services, including any use of or reliance on such Outputs by Customer or its Authorized Users. Customer acknowledges that (a) Outputs may be inaccurate, incomplete, misleading, offensive, or otherwise unsuitable for any particular purpose; (b) NEAR does not warrant the accuracy, reliability, quality, or suitability of any Outputs; and (c) Customer uses the Services, Customer Applications, Third-Party Generative AI Services and Outputs at its own risk.</p>
                </Section>

                {/* Section 19 */}
                <Section id="section-19" number="19" title="Indemnification.">
                  <SubSection number="19.1" title="By NEAR AI.">
                    <p>NEAR AI will defend, indemnify and hold harmless Customer, its Affiliates, and its employees, officers and directors (each, a &ldquo;Customer Indemnitee&rdquo;) from and against any and all damages, liabilities, costs, and expenses (including reasonable attorney&apos;s fees) (jointly, &ldquo;Losses&rdquo;) incurred by a Customer Indemnitee arising out of or relating to any claim, action, demand, inquiry, audit, proceeding, or investigation of any nature, civil, criminal, administrative, regulatory, or other, whether at law, in equity or otherwise by a third party other than Affiliate of a Customer Indemnitee (collectively, a &ldquo;Claim&rdquo;) alleging that the Services or any part thereof infringes upon such third party&apos;s Intellectual Property Rights.</p>
                  </SubSection>
                  <SubSection number="19.2" title="By Customer.">
                    <p>Customer will defend, indemnify and hold harmless NEAR AI, its Affiliates, and its employees, officers and directors (each, a &ldquo;NEAR AI Indemnitee&rdquo;) from and against any and all Losses incurred by a NEAR AI Indemnitee arising out of or relating to a Claim to the extent arising from (a) any Customer Application or Customer Data; (b) Customer&apos;s or an Authorized User&apos;s use of the Services in breach of these Terms, including the Acceptable Use Policy; (c) Customer&apos;s or an Authorized User&apos;s violation of applicable law, including without limitation data privacy laws and Trade Restrictions, in connection with its use of the Services (including submission of Inputs); and (d) any dispute between Customer and its End Users.</p>
                  </SubSection>
                  <SubSection number="19.3" title="Exclusions.">
                    <p>Notwithstanding any of the foregoing, NEAR AI will have no obligations under this Section 19 with respect to any Claim to the extent that the Claim relates to or arises from: (i) Customer&apos;s continuation of an activity after being notified of such activity&apos;s alleged or actual infringement, misappropriation, or other violation of a third party&apos;s rights; (ii) the combination or use of the Services with hardware, software, data or other materials not provided, or approved, by NEAR AI; or (iii) use of the Services other than in accordance with these Terms.</p>
                  </SubSection>
                  <SubSection number="19.4" title="Indemnification Procedure.">
                    <p>Each Party will promptly notify the other Party in writing of any Claim for which such Party believes it is entitled to be indemnified pursuant to this Section 19. The party seeking indemnification (the &ldquo;Indemnitee&rdquo;) will cooperate with the other Party (the &ldquo;Indemnitor&rdquo;) at the Indemnitor&apos;s sole cost and expense. The Indemnitor will promptly take control of the defense and investigation of such Claim and will employ counsel of its choice to handle and defend the same, at the Indemnitor&apos;s sole cost and expense. The Indemnitee&apos;s failure to perform any obligations under this Section 19.4 will not relieve the Indemnitor of its indemnity obligations under this Section 19, except to the extent that the Indemnitor can demonstrate that it has been materially prejudiced as a result of such failure. The Indemnitee may participate in and observe the proceedings at its own cost and expense with counsel of its own choosing. Neither Party shall have authority to settle and shall not settle any Claim that results in the Indemnitee&apos;s obligation, liability, and/or admission of liability without the Indemnitee&apos;s prior written consent.</p>
                  </SubSection>
                  <SubSection number="19.5" title="Remedies.">
                    <p>If NEAR AI reasonably believes the Services might infringe a third party&apos;s Intellectual Property Rights, then NEAR AI may, at its sole option and expense (i) procure the right for Customer to continue using the Services; (ii) modify the Services to make them non-infringing without materially reducing their functionality; or (iii) replace the Services with a non-infringing alternative that has materially equivalent functionality. If NEAR AI does not believe the remedies in (i)-(iii) are commercially reasonable, then NEAR AI may suspend or terminate Customer&apos;s use of the impacted Services.</p>
                  </SubSection>
                  <SubSection number="19.6" title="Sole Rights & Obligations.">
                    <p>Without affecting either Party&apos;s termination rights and to the extent permitted by applicable law, this Section 19 states the Parties&apos; sole and exclusive remedy under these Terms for any third-party allegations of Intellectual Property Rights infringement covered by this Section 19.</p>
                  </SubSection>
                </Section>

                {/* Section 20 */}
                <Section id="section-20" number="20" title="Limitation of Liability.">
                  <p className="uppercase text-sm leading-relaxed">20.1 In no event will either party be liable for lost profits or special, incidental, or consequential damages arising out of or related to this agreement (whether from breach of contract, breach of warranty, or from negligence, strict liability, or any other form of action), even if such party has been advised of the possibility of such damages. This limitation of liability shall apply notwithstanding the failure of essential purpose of any limited remedy herein.</p>
                  <p className="uppercase text-sm leading-relaxed">20.2 In no event will either party&apos;s aggregate, cumulative liability exceed the amount paid or payable to NEAR AI by Customer during the twelve (12) month period preceding the relevant claim.</p>
                  <p className="uppercase text-sm leading-relaxed">20.2.1 For purposes of Section 20.2, in the case of a Staking Subscription or staking under Appendix B, &ldquo;the amount paid or payable to NEAR AI by Customer&rdquo; (a) includes the Staking Rewards routed to NEAR AI as consideration for the Services during the relevant twelve (12) month period, and (b) excludes Customer&apos;s Staked NEAR principal, which remains Customer&apos;s property, is Non-Custodial, and does not constitute an amount paid or payable to NEAR AI. NEAR AI has no recourse against, and no recovery under these Terms extends to, Customer&apos;s Staked NEAR principal.</p>
                  <p className="uppercase text-sm leading-relaxed">20.3 Notwithstanding anything to the contrary in this Section 20, nothing in these Terms excludes or limits (a) either party&apos;s liability for: (i) its fraud, gross negligence or willful misconduct, (ii) its indemnification and defense obligations under Section 19 (Indemnification), (iii) its infringement of the other party&apos;s intellectual property rights; (b) Customer&apos;s (i) payment obligations under these Terms, and (ii) express representations and warranties under this Agreement; or (c) matters for which liability cannot be excluded or limited under applicable law.</p>
                </Section>

                {/* Section 21 */}
                <Section id="section-21" number="21" title="Term & Termination.">
                  <SubSection number="21.1" title="Term.">
                    <p>The term of these Terms will commence on the Effective Date and continue until the earlier of such time as (i) Customer closes its Account, and (ii) a party terminates these Terms as set forth herein.</p>
                  </SubSection>
                  <SubSection number="21.2" title="Termination for Breach or Insolvency.">
                    <p>In addition to any other remedy available under these Terms or otherwise, either party will be entitled to terminate these Terms (i) in the event the other party commits a material breach of these Terms and fails to cure such breach within thirty (30) days of written notification thereof from the non-breaching party and (ii) upon written notice to the other party if the other party should enter into liquidation or become insolvent, or enter into receivership or bankruptcy.</p>
                  </SubSection>
                  <SubSection number="21.3" title="Termination by NEAR AI.">
                    <p>NEAR AI reserves the right to terminate these Terms and close your Account upon notice to you in the event that we determine we are required to do so by law, in which case we will refund to you any prepaid fees covering the remainder of your payment period as of the effective date of such termination.</p>
                  </SubSection>
                  <SubSection number="21.4" title="Effect of Termination.">
                    <p>Upon any expiration or termination of these Terms, except as otherwise permitted herein, (a) Customer&apos;s rights and access to the Services will terminate unless otherwise described in these Terms, and (b) all fees will become due and owing. For clarity, unless these Terms are terminated by Customer for NEAR AI&apos;s breach, Customer will remain liable to pay all fees outstanding on the effective date of termination of these Terms, including any unpaid fees covering the remainder of the term of these Terms had it not been terminated.</p>
                  </SubSection>
                  <SubSection number="21.5" title="Survival.">
                    <p>Upon any expiration or termination of these Terms, the rights and obligations of the parties will terminate, except for sections that by their nature and context are intended to survive completion of performance, expiration, termination, or cancellation of these Terms, including: Section 9 (Intellectual Property), Section 10 (Subscriptions &amp; Payment), Section 11 (Confidential Information), Section 12 (Data Privacy &amp; Security), Section 17 (Representations and Warranties), Section 18 (Disclaimers), Section 19 (Indemnification), Section 20 (Limitation of Liability), Section 21.4 (Effect of Termination), Section 23 (Dispute Resolution; Governing Law), and Section 24 (Miscellaneous), and, to the extent applicable, Appendix A (Agent Hosting Staking) (in particular Sections A.2 (Non-Custodial Nature; Responsibility for Keys), A.3 (Staking Rewards as Consideration), A.11 (Taxes), A.12 (Sanctions Screening), and A.14 (No Securities; No Investment)) and Appendix B (Cloud Staking) (in particular Sections B.2 (Non-Custodial Nature; Responsibility for Keys), B.3 (Staking Rewards as Consideration), B.9 (Taxes), B.10 (Sanctions Screening; Verification; Compliance Controls), and B.12 (No Securities; No Investment)). Customer&apos;s liability and obligation to pay any fees or other amounts that have accrued prior to such expiration or termination will also survive such expiration or termination.</p>
                  </SubSection>
                </Section>

                {/* Section 22 */}
                <Section id="section-22" number="22" title="Updates to these Terms.">
                  <p>NEAR AI reserves the right to change or update these Terms from time to time at our sole discretion. We reserve the right, at our discretion, to change, modify, add, or remove portions of the Terms any time by posting the amended Terms here with an updated &ldquo;Last Updated&rdquo; date above. Please review the Terms frequently for any changes. If the changes include material changes that affect your rights or obligations, we will notify you of the changes by reasonable means, which could include notification through the Services or via email. Customer&apos;s continued use of the Services following the effective date of any changes to these Terms constitutes acceptance of those changes.</p>
                </Section>

                {/* Section 23 */}
                <Section id="section-23" number="23" title="Dispute Resolution; Governing Law.">
                  <SubSection number="23.1" title="Governing Law.">
                    <p>All claims arising out of or relating to Terms or the App (including any Dispute regarding the interpretation or performance of these Terms) will be governed by the laws of the State of Delaware, USA, excluding Delaware&apos;s conflicts of laws rules.</p>
                  </SubSection>
                  <SubSection number="23.2" title="Informal Resolution.">
                    <p>Before commencing any action, the parties will attempt in good faith to resolve any dispute, controversy, or claim arising out of or relating to these Terms (a &ldquo;Dispute&rdquo;) through discussions between persons with decision-making authority. If a Dispute is not resolved within sixty (60) days after written notice of the Dispute, either party may bring an action in accordance with Section 23.3.</p>
                  </SubSection>
                  <SubSection number="23.3" title="Jurisdiction and Venue.">
                    <p>The parties agree that any action arising out of or relating to these Terms or the Services shall be brought exclusively in the state or federal courts located in the State of Delaware, and each party irrevocably submits to the personal jurisdiction and venue of such courts.</p>
                  </SubSection>
                  <SubSection number="23.4" title="Jury Trial Waiver.">
                    <p className="uppercase text-sm leading-relaxed">Each party irrevocably waives any right to a jury trial in any action arising out of or relating to these Terms or the Services.</p>
                  </SubSection>
                </Section>

                {/* Section 24 */}
                <Section id="section-24" number="24" title="Miscellaneous.">
                  <SubSection number="24.1" title="Notices.">
                    <p>Under these Terms, notices to Customer must be sent to the email address associated with Customer&apos;s Account and notices to NEAR AI must be sent to <a href="/mailto:legal@near.ai" className="text-[#101010] underline decoration-[#CAC8C8] underline-offset-2">legal@near.ai</a>. Notice will be treated as received when the email is sent. Customer is responsible for keeping its email address current throughout the Term.</p>
                  </SubSection>
                  <SubSection number="24.2" title="Assignment.">
                    <p>Neither Party may assign any part of these Terms without the written consent of the other, except to an Affiliate where (a) the assignee has agreed in writing to be bound by the terms of these Terms, and (b) the assigning Party has notified the other Party of the assignment. Any other attempt to assign is void.</p>
                  </SubSection>
                  <SubSection number="24.3" title="Force Majeure.">
                    <p>Neither Party will be liable for failure or delay in performance to the extent caused by circumstances beyond its reasonable control, including acts of God, natural disasters, terrorism, riots, or war.</p>
                  </SubSection>
                  <SubSection number="24.4" title="No Agency.">
                    <p>These Terms do not create any agency, partnership, or joint venture between the Parties.</p>
                  </SubSection>
                  <SubSection number="24.5" title="No Waiver.">
                    <p>Neither Party will be treated as having waived any rights by not exercising (or delaying the exercise of) any rights under these Terms.</p>
                  </SubSection>
                  <SubSection number="24.6" title="Severability.">
                    <p>If any part of these Terms is invalid, illegal, or unenforceable, the rest of these Terms will remain in effect.</p>
                  </SubSection>
                  <SubSection number="24.7" title="No Third-Party Beneficiaries.">
                    <p>These Terms do not confer any benefits on any third party unless it expressly states that it does.</p>
                  </SubSection>
                  <SubSection number="24.8" title="Equitable Relief.">
                    <p>Each Party acknowledges that a material breach of these Terms adversely affecting a Party&apos;s Intellectual Property Rights or the Confidential Information of either Party may cause irreparable harm to such Party for which monetary damages would be inadequate. In such event, the non-breaching Party will be entitled to seek equitable or injunctive relief, in addition to any other remedies available at law or in equity.</p>
                  </SubSection>
                  <SubSection number="24.9" title="Entire Agreement.">
                    <p>These Terms sets out all terms agreed between the Parties and supersedes all other agreements between the Parties relating to its subject matter. In entering into these Terms, neither Party has relied on, and neither Party will have any right or remedy based on, any statement, representation, or warranty (whether made negligently or innocently), except those expressly stated in these Terms.</p>
                  </SubSection>
                  <SubSection number="24.10" title="Headers.">
                    <p>Headings and captions used in these Terms are for reference purposes only and will not have any effect on the interpretation of these Terms.</p>
                  </SubSection>
                </Section>

                {/* Appendix A */}
                <Section id="section-A" number="A" title="Appendix A — Agent Hosting Staking.">
                  <p className="italic">Please consult our FAQs for more information.</p>
                  <SubSection number="A.1" title="Scope.">
                    <p>This Appendix A applies where Customer accesses the Services under a Staking Subscription (as defined in Section 1). In the event of a conflict between this Appendix A and the main body of these Terms with respect to the Staking Subscription, this Appendix A controls. Capitalized terms used but not defined in this Appendix A have the meanings given in Section 1. References to FAQs or similar help materials are for convenience only and do not form part of these Terms.</p>
                  </SubSection>
                  <SubSection number="A.2" title="Non-Custodial Nature; Responsibility for Keys.">
                    <p>The Staking Subscription is Non-Custodial. Customer at all times retains exclusive ownership and control of its Staked NEAR and of the private keys to its Wallet Address. NEAR AI does not take custody or control of Customer&apos;s Staked NEAR or private keys, has no ability under the applicable staking pool contract as deployed to withdraw or transfer Customer&apos;s Staked NEAR, and cannot access or recover Customer&apos;s private keys. Suspension or termination of Customer&apos;s access to the Services does not affect Customer&apos;s ability to unstake and withdraw its Staked NEAR through the NEAR protocol, subject to the Unlock Period. Customer is solely responsible for the security, backup, and management of its Wallet Address and private keys. Customer acknowledges and agrees that: (a) if Customer loses access to its private keys or Wallet Address, NEAR AI cannot restore access to, or recover, Customer&apos;s Staked NEAR; (b) Staked NEAR that becomes inaccessible or abandoned as a result of lost keys is not recoverable by NEAR AI and remains subject to the NEAR protocol; and (c) NEAR AI has no responsibility or liability for any loss of Staked NEAR, Staking Rewards, or access to the Services arising from Customer&apos;s loss, compromise, or mismanagement of its keys or Wallet Address; and (d) Staked NEAR remains subject to the NEAR protocol at all times, and NEAR AI has no responsibility or liability for any reduction or loss of Staked NEAR or Staking Rewards arising from protocol-level events (including slashing, penalties, forks, halts, or changes to protocol parameters) or the performance of any validator or staking pool, except to the extent caused by NEAR AI&apos;s fraud, gross negligence, or willful misconduct.</p>
                  </SubSection>
                  <SubSection number="A.3" title="Staking Rewards as Consideration.">
                    <p>Staking Rewards generated in respect of Customer&apos;s Staked NEAR are routed, protocol-direct, to NEAR AI as consideration for the Services. Customer authorizes such routing as a condition of the Staking Subscription. Staking Rewards are not paid, credited, distributed, or otherwise made available to Customer as interest, yield, income, or an investment return. Customer has no right, title, or interest in or to Staking Rewards, which accrue to NEAR AI at the protocol level.</p>
                  </SubSection>
                  <SubSection number="A.4" title="Subscription Tiers and Parameters.">
                    <p>The Staking Subscription is offered in the Subscription Tiers set out below. The following parameters apply:</p>
                    <div className="overflow-x-auto mt-2">
                      <table className="w-full border-collapse text-left" style={{ fontSize: "var(--font-size-body)" }}>
                        <tbody className="divide-y divide-[#CAC8C8]">
                          <tr className="border-b border-[#CAC8C8]">
                            <td className="py-3 pr-8 align-top font-medium text-[#101010] w-[220px]">Minimum stake</td>
                            <td className="py-3 text-muted leading-[1.7]">50 NEAR</td>
                          </tr>
                          {TIER_BASICS.map(([label, desc]) => (
                            <tr key={label}>
                              <td className="py-3 pr-8 align-top font-medium text-[#101010]">{label}</td>
                              <td className="py-3 text-muted leading-[1.7]">{desc}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="overflow-x-auto mt-6">
                      <table className="w-full border-collapse text-left" style={{ fontSize: "var(--font-size-body)" }}>
                        <thead>
                          <tr className="border-b border-[#CAC8C8]">
                            <th className="pb-3 pr-8 font-medium text-[#101010]">Subscription Tier</th>
                            <th className="pb-3 pr-8 font-medium text-[#101010]">Staked NEAR range</th>
                            <th className="pb-3 pr-8 font-medium text-[#101010]">Max. number of AI Agents</th>
                            <th className="pb-3 font-medium text-[#101010]">Monthly Usage Credits (USD)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#CAC8C8]">
                          {TIER_TABLE.map(([tier, range, agents, credits]) => (
                            <tr key={tier}>
                              <td className="py-4 pr-8 align-top font-medium text-[#101010]">{tier}</td>
                              <td className="py-4 pr-8 align-top text-muted leading-[1.7]">{range}</td>
                              <td className="py-4 pr-8 align-top text-muted leading-[1.7]">{agents}</td>
                              <td className="py-4 align-top text-muted leading-[1.7]">{credits}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p>Where an amount of Staked NEAR falls on a Subscription Tier boundary, the higher Subscription Tier applies. NEAR AI may accept Staked NEAR in excess of 20,000 NEAR on the Pro tier terms or as otherwise agreed with Customer; unless otherwise stated in the product, Usage Credits do not increase beyond the Pro tier maximum.</p>
                  </SubSection>
                  <SubSection number="A.5" title="Usage Credits.">
                    <p>Usage Credits under a Staking Subscription are allocated based on the applicable subscription terms, the amount of NEAR staked, and the credit allocation displayed in the product at the time of subscription. Monthly subscription Usage Credits expire at the end of the relevant monthly period and do not roll over. Customer may also purchase one-off Usage Credits through the payment methods made available in the product. The applicable price, payment currency, and any conversion rate will be displayed before the purchase is confirmed. One-off Usage Credits do not expire, unless otherwise stated at the time of purchase or required by applicable law. Where one-off Usage Credits are purchased using NEAR, the NEAR used for that purchase is treated as payment for the purchased Usage Credits, not as staked NEAR, and is not available for unstaking or withdrawal. Usage Credits are non-transferable and non-refundable as set out in Sections 10.1 and 10.6. Unless otherwise stated in the product, Usage Credits are consumed in the order in which they expire, such that expiring monthly Usage Credits are consumed before one-off Usage Credits that do not expire.</p>
                  </SubSection>
                  <SubSection number="A.6" title="Cancellation, Unstaking, and the Unlock Period.">
                    <p>Customer may cancel a Staking Subscription at any time in accordance with Section 10.5. On cancellation, Customer initiates the unstaking/unlock process through the Validator. Staked NEAR becomes withdrawable by Customer only after the Unlock Period has elapsed. Access to the Services under the Staking Subscription continues until the end of the then-current monthly period as provided in Section 10.5.</p>
                  </SubSection>
                  <SubSection number="A.7" title="Downgrade and Agent Quota.">
                    <p>If Customer downgrades a Subscription Tier or reduces Staked NEAR and, as a result, the number of AI Agents deployed under Customer&apos;s Account exceeds the applicable quota, NEAR AI may prevent the downgrade, require Customer to reduce the number of AI Agents, or stop, suspend, or delete AI Agents that exceed the applicable quota. For Non-Staking Subscriptions, a downgrade may be blocked while Customer remains over quota. For Staking Subscriptions, the downgrade may take effect at the end of the then-current subscription period, and over-quota AI Agents may be stopped, suspended, or deleted after any applicable notice or grace period described in Appendix A or the product. Where Customer uses a NEAR wallet-based Account or has not provided contact details, NEAR AI may be unable to provide off-platform notice, as described in Section 16.4.2. Customer is responsible for managing its AI Agents before any downgrade or reduction takes effect. NEAR AI is not responsible for AI Agent state, in-progress tasks, data loss, third-party effects, or other consequences arising from the stopping, suspension, or deletion of over-quota AI Agents.</p>
                  </SubSection>
                  <SubSection number="A.8" title="Exhaustion of Usage Credits (Staking Subscription).">
                    <p>If Customer exhausts its monthly Usage Credits under a Staking Subscription during a monthly period, inference provided through NEAR AI will be suspended until additional Usage Credits are purchased or the next monthly allocation becomes available. While monthly Usage Credits are exhausted, NEAR AI will not terminate Customer&apos;s AI Agents solely because those Usage Credits have been exhausted, and will continue to host those AI Agents and preserve their state in accordance with the applicable product functionality and these Terms. Customer&apos;s AI Agents may continue to run using an alternative inference provider where Customer has configured one. Usage Credits reset at the start of each applicable monthly period, and Customer may also restore NEAR AI inference by purchasing one-off Usage Credits. NEAR AI may change the features, services, or costs to which Usage Credits apply on notice in accordance with Sections 4.5 and A.10.</p>
                  </SubSection>
                  <SubSection number="A.9" title="No Mixing of Subscription Types.">
                    <p>Customer may not mix or switch between a non-Staking Subscription and Staking Subscription during a subscription period. A change of subscription type requires cancellation of the then-current subscription and enrollment in the other subscription type, effective in accordance with Sections 10.3 and 10.5.</p>
                  </SubSection>
                  <SubSection number="A.10" title="Changes to Subscription Tiers and Credit Ratios.">
                    <p>NEAR AI may revise Subscription Tier ranges, the credit denomination ratio, and one-off credit rates, including in response to movements in the NEAR Token price. Any such revision will apply on a go-forward basis only and will not reduce the Usage Credits already made available to Customer for the then-current monthly period. A revised Subscription Tier range or credit ratio will take effect for Customer at the commencement of Customer&apos;s next monthly period following notice of the change given in accordance with Section 22.</p>
                  </SubSection>
                  <SubSection number="A.11" title="Taxes.">
                    <p>All amounts payable by Customer in connection with a Staking Subscription, including Staking Rewards routed to NEAR AI as consideration for the Services, are exclusive of any taxes, levies, duties, or similar governmental assessments, including value-added, goods and services, sales, use, or withholding taxes (collectively, &ldquo;Taxes&rdquo;). Customer is responsible for all Taxes arising in connection with its Staking Subscription, other than Taxes based on NEAR AI&apos;s net income. Customer acknowledges that NEAR AI may be unable to determine Customer&apos;s status as an entity or an individual, or Customer&apos;s jurisdiction of residence, and that Customer remains solely responsible for determining, reporting, and satisfying any Tax obligations arising from its Staked NEAR, the routing of Staking Rewards to NEAR AI as consideration for the Services, and its use of the Services.</p>
                  </SubSection>
                  <SubSection number="A.12" title="Sanctions Screening:">
                    <p>Customer&apos;s access to and continued use of the Services under a Staking Subscription is subject to transaction screening of Customer&apos;s Wallet Address against applicable sanctions lists and such identity or compliance verification as NEAR AI may require. NEAR AI may decline, suspend, or permanently terminate access for any Wallet Address that fails screening, that is or becomes associated with a person or entity targeted by applicable sanctions or Trade Restrictions, or that NEAR AI determines it must block to comply with applicable law or take any other action NEAR AI determines is required to comply with applicable law, sanctions, or Trade Restrictions. Customer consents to this screening as a condition of using a Staking Subscription.</p>
                  </SubSection>
                  <SubSection number="A.13" title="EU/UK Consumer Provisions.">
                    <p>Where Customer is a &ldquo;consumer&rdquo; within the meaning of applicable EU or UK consumer-protection law, the following apply to the extent required by, and are to be construed consistently with, such law: (a) nothing in these Terms excludes or limits Customer&apos;s mandatory statutory rights, including any statutory rights of withdrawal or cancellation and any non-excludable warranties or guarantees; (b) any statutory cooling-off/withdrawal right applies as required by law, provided that, where Customer expressly requests that the Services begin during the withdrawal period and acknowledges that the right of withdrawal is lost once the Services are fully performed, the right of withdrawal ceases upon full performance; and (c) the governing law and forum provisions in Section 23 do not deprive Customer of the protection of the mandatory laws of Customer&apos;s country of habitual residence.</p>
                  </SubSection>
                  <SubSection number="A.14" title="No Securities; No Investment.">
                    <p>The Staking Subscription is a means of paying for the Services and is not an investment product. Usage Credits are a function of the amount of Staked NEAR and are consumed for metered use of the Services; they are not, and shall not be represented as, interest, yield, income, dividends, or a return on investment. Customer&apos;s Staked NEAR principal is returnable to Customer in full (subject to the Unlock Period to protocol-level slashing, penalties, or other network conditions outside NEAR AI&apos;s control) and is not lent, rehypothecated, or otherwise deployedby NEAR AI for its own account. NEAR AI does not solicit Staked NEAR as an investment and makes no representation as to any increase in value of NEAR.</p>
                  </SubSection>
                  <SubSection number="A.15" title="Acceptable Use Policy.">
                    <p>Customer&apos;s use of the Staking Subscription remains subject to the AUP. NEAR AI may update the AUP from time to time; notices relating to the Staking Subscription and AUP changes are handled in accordance with Section 22 and Section 24.1.</p>
                  </SubSection>
                </Section>

                {/* Appendix B */}
                <Section id="section-B" number="B" title="Appendix B — Cloud Staking.">
                  <p className="italic">Please consult our FAQs for more information.</p>
                  <SubSection number="B.1" title="Scope.">
                    <p>This Appendix B applies where Customer stakes NEAR to accrue Usage Credits for eligible NEAR AI Cloud services designated by NEAR AI in the product or Documentation, including private inference and related cloud services (&ldquo;Eligible NEAR AI Cloud Services&rdquo;). In the event of a conflict between this Appendix B and the main body of these Terms with respect to staking under this Appendix B, this Appendix B controls. Capitalized terms used but not defined in this Appendix B have the meanings given in Section 1. References to FAQs or similar help materials are for convenience only and do not form part of these Terms.</p>
                  </SubSection>
                  <SubSection number="B.2" title="Non-Custodial Nature; Responsibility for Keys.">
                    <p>Staking under this Appendix B is Non-Custodial. Customer at all times retains exclusive ownership and control of its Staked NEAR and of the private keys to its Wallet Address. NEAR AI does not take custody or control of Customer&apos;s Staked NEAR or private keys, has no ability under the applicable staking pool contract as deployed to withdraw or transfer Customer&apos;s Staked NEAR, and cannot access or recover Customer&apos;s private keys. Suspension or termination of Customer&apos;s access to the Services does not affect Customer&apos;s ability to unstake and withdraw its Staked NEAR through the NEAR protocol, subject to the Unlock Period. Customer is solely responsible for the security, backup, and management of its Wallet Address and private keys. Customer acknowledges and agrees that: (a) if Customer loses access to its private keys or Wallet Address, NEAR AI cannot restore access to, or recover, Customer&apos;s Staked NEAR; (b) Staked NEAR that becomes inaccessible or abandoned as a result of lost keys is not recoverable by NEAR AI and remains subject to the NEAR protocol; and (c) NEAR AI has no responsibility or liability for any loss of Staked NEAR, Staking Rewards, or access to the Services arising from Customer&apos;s loss, compromise, or mismanagement of its keys or Wallet Address; and (d) Staked NEAR remains subject to the NEAR protocol at all times, and NEAR AI has no responsibility or liability for any reduction or loss of Staked NEAR or Staking Rewards arising from protocol-level events (including slashing, penalties, forks, halts, or changes to protocol parameters) or the performance of any validator or staking pool, except to the extent caused by NEAR AI&apos;s fraud, gross negligence, or willful misconduct.</p>
                  </SubSection>
                  <SubSection number="B.3" title="Staking Rewards as Consideration.">
                    <p>Staking Rewards generated in respect of Customer&apos;s Staked NEAR are routed, protocol-direct, to NEAR AI as consideration for Eligible NEAR AI Cloud Services. Customer authorizes such routing as a condition of staking under this Appendix B. Staking Rewards are not paid, credited, distributed, or otherwise made available to Customer as interest, yield, income, or an investment return. Customer has no right, title, or interest in or to Staking Rewards, which accrue to NEAR AI at the protocol level.</p>
                  </SubSection>
                  <SubSection number="B.4" title="Accrual of Usage Credits.">
                    <p>Customer may stake NEAR through the Validator to accrue Usage Credits for Eligible NEAR AI Cloud Services over time. Usage Credits accrued under this Appendix B are Usage Credits for all purposes under these Terms and do not constitute a separate digital asset, token, stored-value balance, or other property right. The applicable accrual rate, any applicable crediting cadence, and any usage parameters for Eligible NEAR AI Cloud Services will be displayed in the product or Documentation and may be updated by NEAR AI on a prospective basis in accordance with Section 22. Usage Credits may accrue continuously or near-continuously and may be reflected in the product on a delayed or periodic basis.</p>
                  </SubSection>
                  <SubSection number="B.5" title="Organization Balance; Purchased and Accrued Credits.">
                    <p>Where NEAR AI Cloud is organization-scoped, Usage Credits purchased under Section 10.1, accrued under this Appendix B, or granted by NEAR AI may be associated with the applicable organization designated in the product rather than an individual user, and may be shared across the members, workspaces, and API keys of that organization as made available by NEAR AI Cloud. The person initiating a stake, stake adjustment, or unstaking request represents that it is authorized to do so for the applicable organization. NEAR AI may display purchased, accrued, granted, used, and remaining balances separately or as a unified spendable total, and may permit such balances to be consumed on an aggregate basis without any required depletion order. Unless otherwise stated in the product or required by applicable law or a compliance restriction under these Terms, Usage Credits accrued under this Appendix B do not expire.</p>
                  </SubSection>
                  <SubSection number="B.6" title="Adjustments, Unstaking, and the Unlock Period.">
                    <p>Customer may increase, reduce, or initiate unstaking of Staked NEAR under this Appendix B at any time through the Validator or applicable product workflow. Changes to the amount of Staked NEAR affect future accrual only. Usage Credits already accrued under this Appendix B remain available for use in accordance with these Terms. Accrual stops when the unstaking or stake reduction becomes effective in the applicable staking workflow. Staked NEAR becomes withdrawable only after the applicable Unlock Period and any required protocol or validator process have elapsed or been completed.</p>
                  </SubSection>
                  <SubSection number="B.7" title="Exhaustion of Usage Credits (Cloud Staking).">
                    <p>If Customer exhausts the available Usage Credits applicable to Eligible NEAR AI Cloud Services, NEAR AI may reject, throttle, suspend, or otherwise prevent additional requests for those services, including private inference API calls and related requests, until additional Usage Credits become available through purchase, grant, or further accrual. NEAR AI may surface insufficient-credit notices or similar error messages in the product, APIs, or related interfaces.</p>
                  </SubSection>
                  <SubSection number="B.8" title="Changes to Accrual Rates and Credit Policies.">
                    <p>NEAR AI may revise the accrual rate, NEAR-denominated pricing assumptions, credit denomination ratios, and eligible-service designations applicable to this Appendix B, including in response to movements in the NEAR Token price, changes in service costs, or product changes. Any such revision will apply on a go-forward basis only and will not reduce Usage Credits already accrued or purchased before the effective date of the change, except as required by applicable law or to comply with these Terms. Revised rates or policies will take effect after notice given in accordance with Section 22.</p>
                  </SubSection>
                  <SubSection number="B.9" title="Taxes.">
                    <p>All amounts payable by Customer in connection with staking under this Appendix B, including Staking Rewards routed to NEAR AI as consideration for Eligible NEAR AI Cloud Services, are exclusive of any taxes, levies, duties, or similar governmental assessments, including value-added, goods and services, sales, use, or withholding taxes (collectively, &ldquo;Taxes&rdquo;). Customer is responsible for all Taxes arising in connection with staking under this Appendix B, other than Taxes based on NEAR AI&apos;s net income. Customer acknowledges that NEAR AI may be unable to determine Customer&apos;s status as an entity or an individual, or Customer&apos;s jurisdiction of residence, and that Customer remains solely responsible for determining, reporting, and satisfying any Tax obligations arising from its Staked NEAR, the routing of Staking Rewards to NEAR AI as consideration for the Services, and its use of the Services.</p>
                  </SubSection>
                  <SubSection number="B.10" title="Sanctions Screening; Verification; Compliance Controls.">
                    <p>Customer&apos;s access to and continued use of Eligible NEAR AI Cloud Services under this Appendix B is subject to transaction screening of Customer&apos;s Wallet Address against applicable sanctions lists and such identity or compliance verification as NEAR AI may require. NEAR AI may decline, suspend, restrict, or permanently terminate access; refuse or de-link Wallet Addresses; stop further accrual; or take any other action NEAR AI determines it must take to comply with applicable law, sanctions, Trade Restrictions, or reasonable compliance requirements. Customer consents to such screening and verification as a condition of using this Appendix B.</p>
                  </SubSection>
                  <SubSection number="B.11" title="EU/UK Consumer Provisions.">
                    <p>Where Customer is a &ldquo;consumer&rdquo; within the meaning of applicable EU or UK consumer-protection law, the following apply to the extent required by, and are to be construed consistently with, such law: (a) nothing in these Terms excludes or limits Customer&apos;s mandatory statutory rights, including any statutory rights of withdrawal or cancellation and any non-excludable warranties or guarantees; (b) any statutory cooling-off/withdrawal right applies as required by law, provided that, where Customer expressly requests that the Services begin during the withdrawal period and acknowledges that the right of withdrawal is lost once the Services are fully performed, the right of withdrawal ceases upon full performance; and (c) the governing law and forum provisions in Section 23 do not deprive Customer of the protection of the mandatory laws of Customer&apos;s country of habitual residence.</p>
                  </SubSection>
                  <SubSection number="B.12" title="No Securities; No Investment.">
                    <p>Staking under this Appendix B is a means of paying for and accessing Eligible NEAR AI Cloud Services and is not an investment product. Usage Credits accrued or made available under this Appendix B are consumed for metered use of the Services; they are not, and shall not be represented as, interest, yield, income, dividends, or a return on investment. Customer&apos;s Staked NEAR principal is returnable to Customer in full (subject to the Unlock Period and to protocol-level slashing, penalties, or other network conditions outside NEAR AI&apos;s control) and is not lent, rehypothecated, or otherwise deployed by NEAR AI for its own account. NEAR AI does not solicit Staked NEAR as an investment and makes no representation as to any increase in value of NEAR.</p>
                  </SubSection>
                  <SubSection number="B.13" title="Acceptable Use Policy.">
                    <p>Customer&apos;s use of staking under this Appendix B remains subject to the AUP. NEAR AI may update the AUP from time to time; notices relating to staking under this Appendix B and AUP changes are handled in accordance with Section 22 and Section 24.1.</p>
                  </SubSection>
                </Section>

              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─── Local layout helpers ─────────────────────────────────────────────────── */

function Section({ id, number, title, children }: { id: string; number: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="pt-12 first:pt-0 flex flex-col gap-5">
      <div className="flex items-baseline gap-3 pb-4 border-b border-[#CAC8C8]">
        <span className="font-mono text-[0.75rem] text-muted shrink-0">{number}.</span>
        <h2 className="text-pretty font-medium leading-[1.1] tracking-tight text-[#101010]" style={{ fontSize: "var(--font-size-h3)" }}>
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 text-muted leading-[1.8] [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_strong]:font-medium [&_strong]:text-[#101010]" style={{ fontSize: "var(--font-size-body)" }}>
        {children}
      </div>
    </div>
  );
}

function SubSection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 flex flex-col gap-3">
      <h3 className="font-medium text-[#101010]" style={{ fontSize: "var(--font-size-body)" }}>
        {number && <span className="font-mono text-[0.7rem] text-muted mr-2">{number}</span>}
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
