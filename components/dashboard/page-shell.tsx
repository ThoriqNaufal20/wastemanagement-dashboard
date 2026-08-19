import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageShellProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[900px] space-y-6 p-6 pb-28">
        <div className="border-b border-border pb-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke dashboard
          </Link>
        </div>

        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}
