import type { ReactNode } from "react";

type PageBackgroundVariant = "landing" | "kid" | "parent" | "login";

interface PageBackgroundProps {
  children: ReactNode;
  className?: string;
  variant: PageBackgroundVariant;
}

const clouds = {
  landing: [
    "far cloud-1",
    "far cloud-2",
    "far cloud-3",
    "mid cloud-4",
    "mid cloud-5",
    "mid cloud-6",
    "front cloud-7",
    "front cloud-8",
    "front cloud-9",
  ],
  kid: [
    "far cloud-1",
    "far cloud-2",
    "mid cloud-3",
    "mid cloud-4",
    "front cloud-5",
    "mid cloud-6",
    "front cloud-7",
    "far cloud-8",
    "front cloud-9",
  ],
  parent: [
    "far cloud-1",
    "far cloud-2",
    "mid cloud-3",
    "mid cloud-4",
    "front cloud-5",
    "far cloud-6",
    "front cloud-7",
    "mid cloud-8",
    "front cloud-9",
  ],
  login: [
    "far cloud-1",
    "far cloud-2",
    "mid cloud-3",
    "mid cloud-4",
    "front cloud-5",
    "mid cloud-6",
    "front cloud-7",
    "front cloud-8",
    "far cloud-9",
  ],
} satisfies Record<PageBackgroundVariant, string[]>;

const kidDecorations = [
  "star decor-1",
  "sparkle decor-2",
  "blob decor-3",
  "circle decor-4",
  "sparkle decor-5",
  "blob decor-6",
];

export function PageBackground({ children, className = "", variant }: PageBackgroundProps) {
  return (
    <div className={`page-background page-background-${variant} ${className}`}>
      <div className="page-background-art" aria-hidden="true">
        <div className="page-bg-glow page-bg-glow-one" />
        <div className="page-bg-glow page-bg-glow-two" />
        <div className="page-bg-clouds page-bg-clouds-far">
          {clouds[variant]
            .filter((cloud) => cloud.startsWith("far"))
            .map((cloud) => (
              <span key={cloud} className={`page-bg-cloud page-bg-cloud-${cloud}`} />
            ))}
        </div>
        <div className="page-bg-clouds page-bg-clouds-mid">
          {clouds[variant]
            .filter((cloud) => cloud.startsWith("mid"))
            .map((cloud) => (
              <span key={cloud} className={`page-bg-cloud page-bg-cloud-${cloud}`} />
            ))}
        </div>
        <div className="page-bg-clouds page-bg-clouds-front">
          {clouds[variant]
            .filter((cloud) => cloud.startsWith("front"))
            .map((cloud) => (
              <span key={cloud} className={`page-bg-cloud page-bg-cloud-${cloud}`} />
            ))}
        </div>
        {variant === "kid" && (
          <div className="page-bg-decorations">
            {kidDecorations.map((decoration) => (
              <span key={decoration} className={`page-bg-decoration page-bg-decoration-${decoration}`} />
            ))}
          </div>
        )}
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
