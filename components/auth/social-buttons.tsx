"use client"

import { Button } from "@/components/ui/button"

type SocialProps = {
  onGoogle?: () => void
  onGitHub?: () => void
  onLinkedIn?: () => void
}

export function SocialButtons({ onGoogle, onGitHub, onLinkedIn }: SocialProps) {
  return (
    <div className="grid gap-2">
      <Button type="button" onClick={onGoogle} className="w-full" variant="secondary">
        <span className="mr-2 inline-flex items-center">
          {/* Google "G" */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#EA4335"
              d="M12 10.2v3.7h5.2c-.2 1.3-1.6 3.7-5.2 3.7-3.1 0-5.7-2.6-5.7-5.8S8.9 6 12 6c1.8 0 3 0.8 3.7 1.5l2.5-2.5C16.7 3.6 14.5 2.7 12 2.7 6.9 2.7 2.7 6.9 2.7 12S6.9 21.3 12 21.3c6 0 9.3-4.2 9.3-8.5 0-.6-.1-1-.2-1.4H12Z"
            />
          </svg>
        </span>
        Continue with Google
      </Button>
      <Button
        type="button"
        onClick={onGitHub}
        className="w-full"
        style={{ backgroundColor: "#0f1115", color: "white" }}
      >
        <span className="mr-2 inline-flex items-center">
          {/* GitHub mark */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.35-1.76-1.35-1.76-1.1-.74.08-.72.08-.72 1.22.09 1.87 1.25 1.87 1.25 1.08 1.86 2.83 1.32 3.52 1.01.11-.78.42-1.32.76-1.63-2.67-.31-5.47-1.34-5.47-5.98 0-1.32.47-2.39 1.25-3.23-.13-.31-.54-1.57.12-3.27 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.7.25 2.96.12 3.27.78.84 1.25 1.91 1.25 3.23 0 4.65-2.81 5.66-5.49 5.96.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.82.58A12 12 0 0 0 12 .5Z" />
          </svg>
        </span>
        Continue with GitHub
      </Button>
      <Button
        type="button"
        onClick={onLinkedIn}
        className="w-full"
        style={{ backgroundColor: "#0A66C2", color: "white" }}
      >
        <span className="mr-2 inline-flex items-center">
          {/* LinkedIn icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
            <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5ZM.5 8.5h4V23h-4V8.5Zm7 0h3.8v2h.05c.53-1 1.84-2.05 3.78-2.05 4.04 0 4.79 2.66 4.79 6.12V23h-4v-5.8c0-1.38-.02-3.16-1.93-3.16-1.93 0-2.23 1.51-2.23 3.06V23h-4V8.5Z" />
          </svg>
        </span>
        Continue with LinkedIn
      </Button>
    </div>
  )
}
