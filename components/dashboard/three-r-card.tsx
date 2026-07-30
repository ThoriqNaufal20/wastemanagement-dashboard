import { Recycle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { threeR } from "@/lib/mock-data";

function StatBox({
  label,
  done,
  total,
  highlight = false,
}: {
  label: string;
  done: number;
  total: number;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="mb-1 text-xs text-muted-foreground">{label}</p>
      <div
        className={`rounded-lg px-3 py-2 text-sm font-semibold ${
          highlight
            ? "bg-status-warning/15 text-status-warning"
            : "bg-muted text-foreground"
        }`}
      >
        {done} <span className="text-muted-foreground">/</span> {total}
      </div>
    </div>
  );
}

export function ThreeRCard() {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center gap-2 space-y-0">
        <Recycle className="h-4 w-4 text-primary" />
        <CardTitle className="text-sm font-semibold">3R</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatBox
            label="Permintaan Glove Active"
            done={threeR.permintaanGloveActive.done}
            total={threeR.permintaanGloveActive.total}
          />

          <div>
            <p className="mb-1 text-xs text-muted-foreground">
              Glove Pending
            </p>
            <div className="rounded-lg bg-status-warning/15 px-3 py-2 text-sm font-semibold text-status-warning">
              {threeR.glovePending}
            </div>
          </div>

          <div>
            <p className="mb-1 text-xs text-muted-foreground">WIP Pending</p>
            <div className="rounded-lg bg-muted px-3 py-2 text-sm font-semibold text-foreground">
              {threeR.wipPending}
            </div>
          </div>

          <StatBox
            label="WIP Logo"
            done={threeR.wipLogo.done}
            total={threeR.wipLogo.total}
          />
          <StatBox
            label="WIP Kulit"
            done={threeR.wipKulit.done}
            total={threeR.wipKulit.total}
          />
          <StatBox
            label="WIP Glove"
            done={threeR.wipGlove.done}
            total={threeR.wipGlove.total}
          />
          <StatBox
            label="WIP Pola"
            done={threeR.wipPola.done}
            total={threeR.wipPola.total}
          />
        </div>
      </CardContent>
    </Card>
  );
}
