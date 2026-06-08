import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "../app/components/Logo";

interface KidioPageHeaderProps {
  backLabel?: string;
  backTo?: string;
  rightContent?: ReactNode;
  title?: ReactNode;
}

export function KidioPageHeader({
  backLabel,
  backTo,
  rightContent,
  title,
}: KidioPageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="kidio-page-header">
      <div className="kidio-page-header-logo">
        <Logo />
      </div>
      <div className="kidio-page-header-main">
        {backLabel && backTo ? (
          <button
            onClick={() => navigate(backTo)}
            className="kidio-page-header-back"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{backLabel}</span>
          </button>
        ) : (
          <div />
        )}
        <div className="kidio-page-header-title">{title}</div>
        <div className="kidio-page-header-right">{rightContent}</div>
      </div>
    </header>
  );
}
