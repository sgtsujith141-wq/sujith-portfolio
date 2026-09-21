import { ArrowUpRight, FileText, Mail, Phone } from "lucide-react";
import { profile } from "@/content/personal";
import { Reveal } from "@/components/animations/reveal";
import { MaskLine } from "@/components/animations/mask-reveal";

/* 07 · CONNECT — the field folds back to one point behind this. Direct
 * links only: a form that does not really send is worse than none. */
export function Connect() {
  const links = [
    {
      id: "github",
      label: "GitHub",
      handle: profile.links.githubHandle,
      href: profile.links.github,
      icon: ArrowUpRight,
      external: true,
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      handle: profile.links.linkedinHandle,
      href: profile.links.linkedin,
      icon: ArrowUpRight,
      external: true,
    },
    {
      id: "email",
      label: "Email",
      handle: profile.contact.email,
      href: `mailto:${profile.contact.email}`,
      icon: Mail,
      external: false,
    },
    ...(profile.contact.phone
      ? [
          {
            id: "phone",
            label: "Phone",
            handle: profile.contact.phone,
            href: `tel:${profile.contact.phone.replace(/\s+/g, "")}`,
            icon: Phone,
            external: false,
          },
        ]
      : []),
    ...(profile.resume.available
      ? [
          {
            id: "resume",
            label: "Resume",
            handle: profile.resume.filename,
            href: profile.resume.href,
            icon: FileText,
            external: true,
          },
        ]
      : []),
  ];

  return (
    <section
      id="connect"
      aria-labelledby="connect-title"
      className="relative flex min-h-[92dvh] flex-col justify-center px-6 py-28 lg:px-12"
    >
      <div className="mx-auto w-full max-w-6xl">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span className="text-accent">06</span>
            <span aria-hidden className="h-px w-6 bg-line-strong" />
            <span>Connect</span>
          </p>
        </Reveal>
        <h2
          id="connect-title"
          className="display mt-8 max-w-5xl text-[clamp(2.4rem,7.6vw,6.8rem)] leading-[1.02] text-ink"
        >
          <MaskLine duration={1.1}>Let&rsquo;s build</MaskLine>
          <MaskLine delay={0.12} duration={1.1}>
            something useful.
          </MaskLine>
        </h2>
        <Reveal delay={0.24}>
          <p className="mt-8 max-w-xl text-lg text-muted">
Happy to talk about networking, security, servers or anything I&rsquo;ve built. Email is
            the fastest way to reach me.
          </p>
        </Reveal>

        <ul className="mt-16 divide-y divide-line-soft border-y border-line-soft">
          {links.map((l, i) => (
            <Reveal as="li" key={l.id} delay={0.28 + i * 0.05}>
              <a
                href={l.href}
                target={l.external ? "_blank" : undefined}
                rel={l.external ? "noreferrer" : undefined}
                className="group flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5 lg:py-6"
              >
                <span className="display text-[clamp(1.5rem,4vw,2.6rem)] leading-none text-muted t-base group-hover:text-ink">
                  {l.label}
                </span>
                <span className="flex items-baseline gap-4">
                  <span className="mono break-all text-sm text-faint t-base group-hover:text-muted">
                    {l.handle}
                  </span>
                  <l.icon
                    className="h-4 w-4 shrink-0 self-center text-ghost t-base group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-soft"
                    aria-hidden
                  />
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
