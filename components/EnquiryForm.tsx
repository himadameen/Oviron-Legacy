"use client";

import {
  Building2,
  Globe2,
  Layers,
  Mail,
  Send,
  User,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  formatEnquiryMessage,
  type EnquiryPayload,
} from "@/lib/contact";
import { collections } from "@/lib/collections";
import { isContactConfigured, siteConfig } from "@/lib/site-config";
import styles from "./EnquiryForm.module.css";

type Channel = "whatsapp" | "email" | "linkedin";

type FormState = {
  fullName: string;
  companyName: string;
  businessEmail: string;
  destinationCountry: string;
  footwearCategory: string;
  preferredGrade: string;
  estimatedQuantity: string;
  privateLabel: string;
  targetPrice: string;
  additionalRequirements: string;
};

const initialState: FormState = {
  fullName: "",
  companyName: "",
  businessEmail: "",
  destinationCountry: "",
  footwearCategory: "",
  preferredGrade: "",
  estimatedQuantity: "",
  privateLabel: "To be discussed",
  targetPrice: "",
  additionalRequirements: "",
};

const gradeOptions = ["", "A+", "A", "B+", "B", "C+", "C"];

export default function EnquiryForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>(
    {}
  );
  const [notice, setNotice] = useState<string | null>(null);

  const categoryOptions = useMemo(
    () => collections.map((c) => c.name),
    []
  );

  useEffect(() => {
    const fromUrl = searchParams.get("category");
    if (fromUrl) {
      setForm((prev) => ({ ...prev, footwearCategory: fromUrl }));
    }
  }, [searchParams]);

  const validate = (): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Required";
    if (!form.businessEmail.trim()) {
      next.businessEmail = "Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.businessEmail.trim())) {
      next.businessEmail = "Invalid email";
    }
    if (!form.destinationCountry.trim()) {
      next.destinationCountry = "Required";
    }
    if (!form.footwearCategory.trim()) {
      next.footwearCategory = "Required";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const payload = (): EnquiryPayload => ({
    fullName: form.fullName.trim(),
    companyName: form.companyName.trim() || undefined,
    businessEmail: form.businessEmail.trim(),
    destinationCountry: form.destinationCountry.trim(),
    footwearCategory: form.footwearCategory.trim(),
    preferredGrade: form.preferredGrade || undefined,
    estimatedQuantity: form.estimatedQuantity.trim() || undefined,
    privateLabel: form.privateLabel,
    targetPrice: form.targetPrice.trim() || undefined,
    additionalRequirements: form.additionalRequirements.trim() || undefined,
  });

  const submit = (channel: Channel) => {
    setNotice(null);
    if (channel !== "linkedin" && !validate()) return;

    if (channel === "linkedin") {
      if (!isContactConfigured("linkedin")) {
        setNotice("Configure NEXT_PUBLIC_LINKEDIN_URL to open LinkedIn.");
        return;
      }
      window.open(siteConfig.linkedInUrl, "_blank", "noopener,noreferrer");
      setNotice("Opens LinkedIn — your details are not stored on this site.");
      return;
    }

    const message = formatEnquiryMessage(payload());
    const subject = "OVIRON — Quote Request";

    if (channel === "whatsapp") {
      if (!isContactConfigured("whatsapp")) {
        setNotice("Configure NEXT_PUBLIC_WHATSAPP_NUMBER or use email below.");
        return;
      }
      const url = buildWhatsAppUrl(message);
      if (url) {
        window.open(url, "_blank", "noopener,noreferrer");
        setNotice("Prepared in WhatsApp — review and send when ready.");
      }
      return;
    }

    if (!isContactConfigured("email")) {
      setNotice("Configure NEXT_PUBLIC_BUSINESS_EMAIL to draft an email.");
      return;
    }
    const mailto = buildMailtoUrl(subject, message);
    if (mailto) {
      window.location.href = mailto;
      setNotice("Opens your email app with a draft — nothing sent automatically.");
    }
  };

  const update =
    (field: keyof FormState) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) {
        setErrors((prev) => {
          const copy = { ...prev };
          delete copy[field];
          return copy;
        });
      }
    };

  return (
    <div id="enquiry-form" className={styles.shell}>
      <div className={styles.shellHead}>
        <Layers size={22} strokeWidth={1.5} aria-hidden />
        <div>
          <h3 className={styles.formTitle}>Quote enquiry form</h3>
          <p className={styles.formSub}>Required fields marked *</p>
        </div>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          submit("whatsapp");
        }}
        noValidate
      >
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="fullName">
              <User size={14} aria-hidden /> Full name *
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              value={form.fullName}
              onChange={update("fullName")}
              aria-invalid={Boolean(errors.fullName)}
              placeholder="Your name"
            />
            {errors.fullName && (
              <span className={styles.error}>{errors.fullName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="companyName">
              <Building2 size={14} aria-hidden /> Company
            </label>
            <input
              id="companyName"
              name="companyName"
              autoComplete="organization"
              value={form.companyName}
              onChange={update("companyName")}
              placeholder="Optional"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="businessEmail">
              <Mail size={14} aria-hidden /> Business email *
            </label>
            <input
              id="businessEmail"
              name="businessEmail"
              type="email"
              autoComplete="email"
              value={form.businessEmail}
              onChange={update("businessEmail")}
              aria-invalid={Boolean(errors.businessEmail)}
              placeholder="you@company.com"
            />
            {errors.businessEmail && (
              <span className={styles.error}>{errors.businessEmail}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="destinationCountry">
              <Globe2 size={14} aria-hidden /> Destination *
            </label>
            <input
              id="destinationCountry"
              name="destinationCountry"
              autoComplete="country-name"
              value={form.destinationCountry}
              onChange={update("destinationCountry")}
              aria-invalid={Boolean(errors.destinationCountry)}
              placeholder="Country"
            />
            {errors.destinationCountry && (
              <span className={styles.error}>{errors.destinationCountry}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="footwearCategory">Category *</label>
            <select
              id="footwearCategory"
              name="footwearCategory"
              value={form.footwearCategory}
              onChange={update("footwearCategory")}
              aria-invalid={Boolean(errors.footwearCategory)}
            >
              <option value="">Select category</option>
              {categoryOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
            {errors.footwearCategory && (
              <span className={styles.error}>{errors.footwearCategory}</span>
            )}
          </div>

          <div className={styles.field}>
            <label htmlFor="preferredGrade">Grade</label>
            <select
              id="preferredGrade"
              name="preferredGrade"
              value={form.preferredGrade}
              onChange={update("preferredGrade")}
            >
              {gradeOptions.map((g) => (
                <option key={g || "none"} value={g}>
                  {g || "Any / TBD"}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="estimatedQuantity">Quantity</label>
            <input
              id="estimatedQuantity"
              name="estimatedQuantity"
              value={form.estimatedQuantity}
              onChange={update("estimatedQuantity")}
              placeholder="e.g. 500 pairs"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="privateLabel">Private label</label>
            <select
              id="privateLabel"
              name="privateLabel"
              value={form.privateLabel}
              onChange={update("privateLabel")}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="To be discussed">To be discussed</option>
            </select>
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label htmlFor="targetPrice">Target price</label>
            <input
              id="targetPrice"
              name="targetPrice"
              value={form.targetPrice}
              onChange={update("targetPrice")}
              placeholder="Optional"
            />
          </div>

          <div className={`${styles.field} ${styles.full}`}>
            <label htmlFor="additionalRequirements">Notes</label>
            <textarea
              id="additionalRequirements"
              name="additionalRequirements"
              rows={3}
              value={form.additionalRequirements}
              onChange={update("additionalRequirements")}
              placeholder="Specs, references, timeline…"
            />
          </div>
        </div>

        <p className={styles.privacy}>
          Prepares a message in WhatsApp or email — not stored on this website.
        </p>

        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.primaryBtn}>
            <Send size={18} strokeWidth={1.75} aria-hidden />
            Get Quote via WhatsApp
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => submit("email")}
          >
            <Mail size={16} aria-hidden />
            Email quote
          </button>
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => submit("linkedin")}
          >
            LinkedIn
          </button>
        </div>
      </form>
    </div>
  );
}
