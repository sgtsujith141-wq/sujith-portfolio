import { projectsIntro } from "@/content/site";
import { Decrypt } from "@/components/reveal";
import { Explorer } from "@/components/projects/explorer";

/* Shared by /projects and /projects/[slug], so switching projects keeps
 * the list mounted and only the explanation animates. */
export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="wrap">
      <div className="phead">
        <a className="btn pback mag" href="/#work" data-cursor="Back">
          ← Back to home
        </a>
        <p className="crumb">
          <a href="/">Home</a> / Projects
        </p>
        <Decrypt as="h1" className="ptitle" text="Projects" id="pTitle" dur={800} delay={120} onMount tabIndex={-1} />
        <p className="pintro">{projectsIntro}</p>
      </div>
      <Explorer />
      {children}
    </div>
  );
}
