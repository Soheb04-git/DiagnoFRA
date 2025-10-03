import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} DiagnoFRA. All rights reserved.
          </p>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Docs
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              Terms
            </Link>
            <div className="flex items-center gap-4">
              <Link aria-label="GitHub" href="#" className="text-muted-foreground hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.74.08-.72.08-.72 1.22.09 1.87 1.25 1.87 1.25 1.08 1.86 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.63-2.67-.31-5.47-1.34-5.47-5.98 0-1.32.47-2.39 1.25-3.23-.13-.31-.54-1.57.12-3.27 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.7.25 2.96.12 3.27.78.84 1.25 1.91 1.25 3.23 0 4.65-2.81 5.66-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z" />
                </svg>
              </Link>
              <Link aria-label="Twitter" href="#" className="text-muted-foreground hover:text-foreground">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26L22.5 21.75h-6.84l-5.358-6.996-6.126 6.996H.868l7.73-8.83L1.5 2.25H8.5l4.84 6.356 4.904-6.356ZM17.3 19.65h1.833L7.8 4.2H5.846L17.3 19.65Z" />
                </svg>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  )
}
