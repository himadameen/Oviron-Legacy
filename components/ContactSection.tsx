import { Clock, Linkedin, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import { Suspense, type ReactNode } from "react";
import { isContactConfigured, siteConfig } from "@/lib/site-config";
import { buildWhatsAppUrl } from "@/lib/contact";
import EnquiryForm from "./EnquiryForm";
import SectionReveal from "./SectionReveal";
import styles from "./ContactSection.module.css";

function ChannelCard({
  title,
  desc,
  icon,
  href,
  actionLabel,
  fallbackHref,
}: {
  title: string;
  desc: string;
  icon: ReactNode;
  href: string | null;
  actionLabel: string;
  fallbackHref: string;
}) {
  const link = href ?? fallbackHref;
  const external = link.startsWith("http");

  return (
    <article className={styles.channel}>
      <div className={styles.channelTop}>
        <div className={styles.iconCircle}>{icon}</div>
        <div>
          <h3>{title}</h3>
          <p>{desc}</p>
        </div>
      </div>
      <a
        href={link}
        className={styles.channelBtn}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {href ? actionLabel : "Use quote form"}
      </a>
    </article>
  );
}

export default function ContactSection() {
  const whatsappReady = isContactConfigured("whatsapp");
  const emailReady = isContactConfigured("email");
  const linkedInReady = isContactConfigured("linkedin");

  const whatsappHref = whatsappReady
    ? buildWhatsAppUrl(
        "Hello Oviron — I would like a quote for leather footwear sourcing."
      )
    : null;

  const formAnchor = "#enquiry-form";

  return (
    <section
      id="contact"
      className={`section ${styles.section}`}
      aria-labelledby="contact-heading"
    >
      <div className={`container ${styles.layout}`}>
        <SectionReveal className={styles.sidebar}>
          <p className="eyebrow">Contact</p>
          <h2 id="contact-heading" className={styles.title}>
            Request a quote.
          </h2>
          <p className={styles.lead}>
            Reach us directly or send a structured brief — we respond to serious
            buyer enquiries.
          </p>

          <ul className={styles.trust}>
            <li>
              <ShieldCheck size={16} strokeWidth={1.5} aria-hidden />
              Specs confirmed per product
            </li>
            <li>
              <Clock size={16} strokeWidth={1.5} aria-hidden />
              B2B wholesale &amp; private label
            </li>
          </ul>

          <div className={styles.channels}>
            <ChannelCard
              title="WhatsApp"
              desc="Fast quote discussions"
              icon={<MessageCircle size={20} strokeWidth={1.5} />}
              href={whatsappHref}
              actionLabel="Open WhatsApp"
              fallbackHref={formAnchor}
            />
            <ChannelCard
              title="Email"
              desc="Formal enquiry draft"
              icon={<Mail size={20} strokeWidth={1.5} />}
              href={
                emailReady
                  ? `mailto:${siteConfig.businessEmail}?subject=${encodeURIComponent("OVIRON — Quote Request")}`
                  : null
              }
              actionLabel="Send email"
              fallbackHref={formAnchor}
            />
            <ChannelCard
              title="LinkedIn"
              desc="Professional connect"
              icon={<Linkedin size={20} strokeWidth={1.5} />}
              href={linkedInReady ? siteConfig.linkedInUrl : null}
              actionLabel="View profile"
              fallbackHref={formAnchor}
            />
          </div>
        </SectionReveal>

        <SectionReveal className={styles.formCol}>
          <Suspense
            fallback={
              <div className={styles.formSkeleton}>Loading quote form…</div>
            }
          >
            <EnquiryForm />
          </Suspense>
        </SectionReveal>
      </div>
    </section>
  );
}
