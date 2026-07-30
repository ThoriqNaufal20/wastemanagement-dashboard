import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auditSupportiveDept } from "@/lib/mock-data";

export function AuditSupportiveDeptCard() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-sm font-semibold">
          Internal Audit Supportive Dept
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="mb-1 text-xs text-muted-foreground">Pending</p>
          <div className="rounded-lg bg-muted px-4 py-2 text-lg font-semibold text-foreground">
            {auditSupportiveDept.pending}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {auditSupportiveDept.items.map((item) => (
            <div key={item.label}>
              <p className="mb-1 text-xs text-muted-foreground">
                {item.label}
              </p>
              <div className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-foreground">
                {item.done}{" "}
                <span className="text-muted-foreground">/</span> {item.total}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
