"use client";

import { Mail, Send } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
  formatEnquiryMessage,
  type EnquiryPayload,
} from "@/lib/contact";
import {
  formatEnquiryCategoryValue,
  getCatalog,
} from "@/lib/catalog";
import { getProductBySeoSlug } from "@/lib/product-routes";
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

  const catalog = useMemo(() => getCatalog(), []);

  useEffect(() => {
    const styleSlug = searchParams.get("style");
    const fromStyle = styleSlug ? getProductBySeoSlug(styleSlug) : null;
    const fromUrl = searchParams.get("category");
    const category = fromStyle
      ? formatEnquiryCategoryValue(fromStyle)
      : fromUrl;
    if (category) {
      setForm((prev) => ({ ...prev, footwearCategory: category }));
    }
  }, [searchParams]);

  const progress = useMemo(() => {
    let score = 0;
    if (form.fullName.trim()) score += 25;
    if (form.businessEmail.trim()) score += 25;
    if (form.destinationCountry.trim()) score += 25;
    if (form.footwearCategory.trim()) score += 25;
    return score;
  }, [form]);

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
      return;
    }

    const message = formatEnquiryMessage(payload());
    const subject = "OVIRON — Quote Request";

    if (channel === "whatsapp") {
      if (!isContactConfigured("whatsapp")) {
        setNotice("Configure NEXT_PUBLIC_WHATSAPP_NUMBER or use email.");
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
      setNotice("Configure NEXT_PUBLIC_BUSINESS_EMAIL to draft email.");
      return;
    }
    const mailto = buildMailtoUrl(subject, message);
    if (mailto) window.location.href = mailto;
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
      <div className={styles.head}>
        <div>
          <h3 className={styles.title}>Quick quote brief</h3>
          <p className={styles.sub}>Lite form — sends via WhatsApp or email</p>
        </div>
        <span className={styles.badge}>{progress}%</span>
      </div>

      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          submit("whatsapp");
        }}
        noValidate
      >
        <p className={styles.sectionLabel}>You</p>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="fullName">Full name *</label>
            <input
              id="fullName"
              value={form.fullName}
              onChange={update("fullName")}
              placeholder="Name"
              className={errors.fullName ? styles.err : undefined}
            />
            {errors.fullName && <span className={styles.error}>{errors.fullName}</span>}
          </div>
          <div className={styles.field}>
            <label htmlFor="businessEmail">Email *</label>
            <input
              id="businessEmail"
              type="email"
              value={form.businessEmail}
              onChange={update("businessEmail")}
              placeholder="you@company.com"
              className={errors.businessEmail ? styles.err : undefined}
            />
            {errors.businessEmail && (
              <span className={styles.error}>{errors.businessEmail}</span>
            )}
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="companyName">Company</label>
            <input
              id="companyName"
              value={form.companyName}
              onChange={update("companyName")}
              placeholder="Optional"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="destinationCountry">Destination *</label>
            <input
              id="destinationCountry"
              value={form.destinationCountry}
              onChange={update("destinationCountry")}
              placeholder="Country"
              className={errors.destinationCountry ? styles.err : undefined}
            />
            {errors.destinationCountry && (
              <span className={styles.error}>{errors.destinationCountry}</span>
            )}
          </div>
        </div>

        <p className={styles.sectionLabel}>Product</p>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="footwearCategory">Product category *</label>
            <select
              id="footwearCategory"
              value={form.footwearCategory}
              onChange={update("footwearCategory")}
              className={errors.footwearCategory ? styles.err : undefined}
            >
              <option value="">Select</option>
              {catalog.mainCategories.map((main) => (
                <optgroup key={main.id} label={main.label}>
                  {main.subcategories.flatMap((sub) =>
                    sub.products.map((product) => {
                      const value = formatEnquiryCategoryValue({
                        mainCategoryLabel: main.label,
                        subCategoryLabel: sub.label,
                        name: product.name,
                      });
                      return (
                        <option key={product.id} value={value}>
                          {sub.label} — {product.name}
                        </option>
                      );
                    })
                  )}
                </optgroup>
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
              value={form.preferredGrade}
              onChange={update("preferredGrade")}
            >
              {gradeOptions.map((g) => (
                <option key={g || "none"} value={g}>
                  {g || "Any"}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="estimatedQuantity">Quantity</label>
            <input
              id="estimatedQuantity"
              value={form.estimatedQuantity}
              onChange={update("estimatedQuantity")}
              placeholder="e.g. 500 pairs"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="privateLabel">Private label</label>
            <select
              id="privateLabel"
              value={form.privateLabel}
              onChange={update("privateLabel")}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
              <option value="To be discussed">To be discussed</option>
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="targetPrice">Target price</label>
          <input
            id="targetPrice"
            value={form.targetPrice}
            onChange={update("targetPrice")}
            placeholder="Optional"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="additionalRequirements">Notes</label>
          <textarea
            id="additionalRequirements"
            rows={3}
            value={form.additionalRequirements}
            onChange={update("additionalRequirements")}
            placeholder="Specs, timeline, packaging…"
          />
        </div>

        {notice && (
          <p className={styles.notice} role="status">
            {notice}
          </p>
        )}

        <div className={styles.actions}>
          <button type="submit" className={styles.primary}>
            <Send size={17} aria-hidden />
            WhatsApp quote
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => submit("email")}
          >
            <Mail size={16} aria-hidden />
            Email
          </button>
          <button
            type="button"
            className={styles.ghost}
            onClick={() => submit("linkedin")}
          >
            LinkedIn
          </button>
        </div>

        <p className={styles.privacy}>
          Not stored on this site — opens your messaging app with a draft.
        </p>
      </form>
    </div>
  );
}
