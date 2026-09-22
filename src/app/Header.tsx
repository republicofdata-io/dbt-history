import { Moon, Presentation, Sun, SunMoon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Theme } from "./theme";

const THEME_ICON = { system: SunMoon, light: Sun, dark: Moon };
const THEME_LABEL = { system: "Theme: system", light: "Theme: light", dark: "Theme: dark" };

/** The masthead from the concept: title, date range, presentation and theme controls. */
export default function Header({ presentation, onTogglePresentation, theme, onCycleTheme }: { presentation: boolean; onTogglePresentation: () => void; theme: Theme; onCycleTheme: () => void }) {
  const ThemeIcon = THEME_ICON[theme];
  return (
    <header className="flex items-center justify-between gap-5 px-7 py-4">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-1 focus:text-accent-foreground">
        Skip to content
      </a>
      <div className="min-w-0">
        <h1 className="truncate text-[26px] leading-tight tracking-[-1px]">dbt, version by version.</h1>
        <p className="mt-1 text-xs text-muted-foreground">
          2016–2026 &nbsp;/&nbsp; One shop. Ten years of dbt. &nbsp;/&nbsp;{" "}
          <a href="https://republicofdata.io" className="text-accent underline-offset-2 hover:underline">
            RepublicOfData.io
          </a>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="outline" size="sm" onClick={onCycleTheme} aria-label={THEME_LABEL[theme]} title={THEME_LABEL[theme]}>
          <ThemeIcon />
        </Button>
        <Button variant={presentation ? "default" : "outline"} size="sm" onClick={onTogglePresentation} aria-pressed={presentation} title="Presentation mode (P)">
          <Presentation />
          <span className="hidden sm:inline">Presentation mode</span>
        </Button>
      </div>
    </header>
  );
}
