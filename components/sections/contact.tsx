"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { socials } from "@/data/social";
import { profile } from "@/data/profile";
import { SectionHeader } from "@/components/ui/section-header";
import { StatusDot } from "@/components/ui/status-dot";
import { cn } from "@/lib/utils";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(profile.contact.email).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-line py-24 sm:py-32 lg:py-40"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "radial-gradient(90% 60% at 50% 100%, rgba(69,212,238,0.05), transparent 65%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <SectionHeader
          index="05"
          title="Contact"
          meta="CHANNELS OPEN"
          lead="Open to internships, collaboration and anything security or systems adjacent. The fastest route is email."
        />

        <div className="mt-14 grid grid-cols-1 gap-px border border-line bg-line sm:grid-cols-2">
          {socials.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.55, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="group relative bg-base"
            >
              <a
                href={s.href}
                {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-center gap-4 p-6 transition-colors duration-500 hover:bg-accent/[0.035] sm:p-7"
              >
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-px w-0 bg-accent transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full"
                />
                <s.icon
                  className="h-4 w-4 shrink-0 text-faint transition-colors duration-300 group-hover:text-accent"
                  strokeWidth={1.5}
                />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15.5px] font-medium tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                    {s.label}
                  </span>
                  <span className="mono mt-1.5 block truncate text-[11px] tracking-wide text-ghost">
                    {s.handle}
                  </span>
                </span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 text-ghost transition-all duration-500 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-accent"
                  strokeWidth={1.6}
                />
              </a>
            </motion.div>
          ))}
          {/* The hairline grid is built from a 1px gap over a line-coloured
              background, so an odd channel count would leave that colour
              showing as a stray cell. */}
          {socials.length % 2 === 1 ? (
            <div className="hidden bg-base sm:block" aria-hidden />
          ) : null}
        </div>

        {!profile.resume.available ? (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 flex max-w-[64ch] items-center gap-2.5 text-[13px] leading-relaxed text-ghost"
          >
            <span className="label-sm shrink-0 border border-line px-1.5 py-1 text-ghost">
              RESUME
            </span>
            <span>Not published yet — ask by email and I will send it across.</span>
          </motion.p>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4"
        >
          <button
            type="button"
            onClick={copy}
            className={cn(
              "group flex items-center gap-2.5 border px-3.5 py-2.5 transition-colors duration-300",
              copied
                ? "border-signal/40 text-signal"
                : "border-line text-faint hover:border-accent/40 hover:text-accent",
            )}
          >
            {copied ? (
              <Check className="h-3 w-3" strokeWidth={2} />
            ) : (
              <Copy className="h-3 w-3" strokeWidth={1.7} />
            )}
            <span className="label-sm">{copied ? "COPIED" : "COPY EMAIL"}</span>
          </button>

          <span className="flex items-center gap-2.5">
            <StatusDot tone="accent" live />
            <span className="label-sm text-muted">
              {profile.location.toUpperCase()} · IST (UTC+5:30)
            </span>
          </span>
        </motion.div>
      </div>
    </section>
  );
}
