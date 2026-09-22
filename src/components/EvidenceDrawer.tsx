import { ExternalLink } from "lucide-react";
import { Dialog, DialogTrigger, DrawerContent } from "@/components/ui/dialog";
import type { Source } from "@/content/schema";
import { formatDate } from "@/content/dates";

export function SourceList({ sources }: { sources: Source[] }) {
  if (!sources.length) return <p className="text-sm text-muted-foreground">No sources recorded.</p>;
  return (
    <ul className="flex flex-col gap-3">
      {sources.map((s, i) => (
        <li key={`${s.url}-${i}`} className="text-sm">
          <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 text-accent-bright underline-offset-4 hover:underline">
            <span>{s.title}</span>
            <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          </a>
          {s.supports && <p className="mt-0.5 text-muted-foreground">{s.supports}</p>}
          {s.retrieved && <p className="provenance">retrieved {formatDate(s.retrieved)}</p>}
        </li>
      ))}
    </ul>
  );
}

/** An unobtrusive trigger that opens a side drawer with sources and evidence details. */
export default function EvidenceDrawer({ trigger, title, description, children }: { trigger: React.ReactNode; title: string; description?: string; children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DrawerContent title={title} description={description}>
        {children}
      </DrawerContent>
    </Dialog>
  );
}
