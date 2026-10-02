import { about, contact, events, hero, projects, site, skills, skillsIntro, workIntro } from "@/content/site";
import { Decrypt, Reveal, TypeOut } from "@/components/reveal";
import { HomeMotion } from "@/components/home/home-motion";
import { CopyEmail, HeroHint } from "@/components/home/client-bits";
import { pad2 } from "@/lib/utils";

export default function Home() {
  const total = pad2(projects.length);
  return (
    <>
      <section className="hero" id="top" data-nk="">
        <div className="wrap">
          <div className="status hfade" id="hStatus">
            <i />
            {hero.status}
          </div>
          {/* Calm on purpose: no scrambling or glitching on the name. */}
          <h1 id="name" aria-label={site.name}>
            <span className="ln" aria-hidden="true">
              {[...site.name].map((c, i) => (
                <span className="ch" key={i}>
                  {c === " " ? " " : c}
                </span>
              ))}
            </span>
          </h1>
          <div className="who">
            <p id="hWho" className="hfade">
              {hero.whoBefore}
              <b>{hero.whoStrong}</b>
              {hero.whoAfter}
            </p>
            <div className="ctas hfade" id="hCtas">
              <a className="btn solid mag" href="/projects" data-cursor="Open">
                View projects <span className="ar">→</span>
              </a>
              <a className="btn mag" href={site.resume} target="_blank" rel="noopener">
                Resume
              </a>
            </div>
          </div>
          <HeroHint />
        </div>
      </section>

      <Reveal as="section" kind="sec" id="about" data-nk="about" aria-labelledby="about-h">
        <div className="wrap grid">
          <div className="side">
            <div className="sticky">
              <span className="lbl">About</span>
              <Decrypt as="h2" className="t" text="About me" id="about-h" />
            </div>
          </div>
          <div className="body">
            {about.paragraphs.map((p, i) => (
              <Reveal as="p" kind="clip" className="lead" delay={i * 200} key={i}>
                {p}
              </Reveal>
            ))}
            <Reveal as="h3" className="k">
              Education
            </Reveal>
            <Reveal as="dl" className="edu">
              {about.education.map((e) => (
                <div key={e.k}>
                  <dt>{e.k}</dt>
                  <TypeOut as="dd" text={e.v} />
                </div>
              ))}
            </Reveal>
            <Reveal as="h3" className="k">
              Currently exploring
            </Reveal>
            <Reveal as="ul" kind="stag" className="explore">
              {about.exploring.map((x, i) => (
                <li key={i}>
                  <span>{pad2(i + 1)}</span>
                  {x}
                </li>
              ))}
            </Reveal>
          </div>
        </div>
      </Reveal>

      <section className="pin work" id="work" data-nk="projects" aria-labelledby="work-h">
        <div className="pinin">
          <div className="wrap">
            <div className="whead">
              <div>
                <span className="lbl">Projects</span>
                <Decrypt as="h2" text="Projects" id="work-h" />
              </div>
              <p>{workIntro}</p>
              <div className="wright">
                <a className="btn solid mag" href="/projects" data-cursor="Open">
                  Explore all projects <span className="ar">→</span>
                </a>
                <p className="wcount" aria-hidden="true">
                  <b id="wIdx">01</b> / <span>{total}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="htrack" id="wTrack">
            {projects.map((p, i) => (
              <a className="wcard" href={`/projects/${p.slug}`} data-cursor="Read" key={p.slug}>
                <span className="bigi" aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                <div className="top">
                  <span>
                    {pad2(i + 1)} / {total}
                  </span>
                  <span className={p.status.live ? "chip" : "chip off"}>{p.status.label}</span>
                </div>
                <h3>{p.name}</h3>
                <p className="ctx">{p.ctx}</p>
                <p className="d">{p.card}</p>
                <div className="go">
                  <span>Read the full explanation</span>
                  <span className="ar" aria-hidden="true">
                    →
                  </span>
                </div>
              </a>
            ))}
          </div>
          <div className="wrap">
            <div className="hprog" aria-hidden="true">
              <i id="wBar" />
            </div>
          </div>
        </div>
      </section>

      <Reveal as="section" kind="sec" id="skills" data-nk="skills" aria-labelledby="skills-h">
        <div className="wrap">
          <div className="grid" style={{ marginBottom: "clamp(32px,5vh,56px)" }}>
            <div className="side">
              <span className="lbl">Skills</span>
              <Decrypt as="h2" className="t" text="Skills" id="skills-h" />
            </div>
            <div className="body">
              <Reveal as="p" style={{ maxWidth: "56ch", color: "#bdbdb8" }}>
                {skillsIntro}
              </Reveal>
            </div>
          </div>
          <div className="cols3">
            {skills.map((c) => (
              <Reveal className="col" key={c.h}>
                <h3>
                  {c.h}
                  {c.note && <span>{c.note}</span>}
                </h3>
                <Reveal as="ul" kind="stag">
                  {c.items.map((it) => (
                    <li key={it.name}>
                      <TypeOut as="em" text={it.name} />
                      <span>{it.note ?? ""}</span>
                    </li>
                  ))}
                </Reveal>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal as="section" kind="sec" id="events" data-nk="events" aria-labelledby="events-h">
        <div className="wrap grid">
          <div className="side">
            <div className="sticky">
              <span className="lbl">Events</span>
              <Decrypt as="h2" className="t" text="Hackathons" id="events-h" />
            </div>
          </div>
          <div className="body">
            <div className="tl" id="tl">
              <i className="tlfill" id="tlFill" aria-hidden="true" />
              <ul>
              {events.map((e) => (
                <li key={e.name}>
                  <b>{e.name}</b>
                  <div className="m">
                    <span className="chip">{e.chip}</span>
                    <span>{e.meta}</span>
                  </div>
                  <p>{e.text}</p>
                </li>
              ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal as="section" kind="sec" className="contact" id="contact" data-nk="contact" aria-labelledby="talk">
        <div className="wrap">
          <span className="lbl">Contact</span>
          <h2 className="big" id="talk">
            Let&apos;s talk
          </h2>
          <Reveal as="p" className="lead2">
            {contact.lead}
          </Reveal>
          <Reveal kind="stag" className="cgrid">
            <a href={`mailto:${contact.email}`} data-cursor="Write">
              <small>Email</small>
              <span>{contact.email}</span>
            </a>
            <a href={contact.linkedin.href} target="_blank" rel="noopener" data-cursor="Open">
              <small>LinkedIn</small>
              <span>{contact.linkedin.label}</span>
            </a>
            <a href={contact.github.href} target="_blank" rel="noopener" data-cursor="Open">
              <small>GitHub</small>
              <span>{contact.github.label}</span>
            </a>
            <a href={site.resume} target="_blank" rel="noopener" data-cursor="Open">
              <small>Resume</small>
              <span>{site.resumeFile}</span>
            </a>
            <CopyEmail />
          </Reveal>
        </div>
      </Reveal>

      <HomeMotion />
    </>
  );
}
