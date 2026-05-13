import React from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";

type AlertVariant = "error" | "warning" | "info" | "success";

interface AlertProps {
  variant?: AlertVariant;
  /** When true, removes rounded corners for use inside containers */
  contained?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> =
  {
    error: {
      container: "bg-surface-elevated border-err/40",
      icon: "text-err",
    },
    warning: {
      container: "bg-surface-elevated border-hairline",
      icon: "text-signal",
    },
    info: {
      container: "bg-surface-elevated border-info/40",
      icon: "text-info",
    },
    success: {
      container: "bg-surface-elevated border-ok/40",
      icon: "text-ok",
    },
  };

const variantIcons: Record<AlertVariant, React.ElementType> = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

export const Alert: React.FC<AlertProps> = ({
  variant = "error",
  contained = false,
  children,
  className = "",
}) => {
  const styles = variantStyles[variant];
  const Icon = variantIcons[variant];

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 border ${styles.container} ${contained ? "" : "rounded-[8px]"} ${className}`}
    >
      <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.icon}`} />
      <p className="text-sm text-body">{children}</p>
    </div>
  );
};
