import { ArrowUpRight, Clock, ShieldCheck } from "lucide-react";
import { Suspense } from "react";
import {
  contactChannels,
  enquiryFormAnchor,
  type ContactChannelId,
} from "@/lib/contact-channels";
import EnquiryForm from "./EnquiryForm";
import SectionReveal from "./SectionReveal";
import styles from "./ContactSection.module.css";

const channelStyle: Record<ContactChannelId, string> = {
  whatsapp: styles.channelWhatsapp,
  email: styles.channelEmail,
  linkedin: styles.channelLinkedin,
};

function ChannelCard({
  id,
  title,
  description,
  icon: Icon,
  primaryHref,
  ready,
  primaryLabel,
  pendingLabel,
}: {
  id: ContactChannelId;
  title: string;
  description: string;
  icon: (typeof contactChannels)[number]["icon"];
  primaryHref: string | null;
  ready: boolean;
  primaryLabel: string;
  pendingLabel: string;
}) {
  const external = Boolean(primaryHref?.startsWith("http"));

  return (
    <article className={`${styles.channel} ${channelStyle[id]}`}>
      <div className={styles.channelMain}>
        <div className={styles.iconCircle} aria-hidden>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className={styles.channelCopy}>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>

      <div className={styles.channelActions}>
        {ready && primaryHref ? (
          <>
            <a
              href={primaryHref}
              className={styles.btnPrimary}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              {primaryLabel}
              {external ? (
                <ArrowUpRight size={14} strokeWidth={2} aria-hidden />
              ) : null}
            </a>
            <a href={enquiryFormAnchor} className={styles.btnSecondary}>
              Use quote form
            </a>
          </>
        ) : (
          <>
            <a href={enquiryFormAnchor} className={styles.btnPrimary}>
              {pendingLabel}
            </a>
            <p className={styles.pendingNote}>
              Direct {title} link coming soon — use the quote form for now.
            </p>
          </>
        )}
      </div>
    </article>
  );
}

export default function ContactSection() {
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
            {contactChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                id={channel.id}
                title={channel.title}
                description={channel.description}
                icon={channel.icon}
                ready={channel.isReady()}
                primaryHref={channel.getPrimaryHref()}
                primaryLabel={channel.primaryLabel}
                pendingLabel={channel.pendingLabel}
              />
            ))}
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
