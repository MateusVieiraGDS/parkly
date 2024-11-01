import { Button } from "@/components/ui/button";
import { AlignJustify, Grid2X2 } from "lucide-react";
import { useState } from "react";

export const LayoutSwitch = () => {
    const [activeView, setActiveView] = useState<"list" | "card">("list");
    return (
        <div>
            <Button
                variant={activeView === "list" ? "default" : "outline"}
                size="icon"
                className="rounded-r-none border-r-0"
                onClick={() => setActiveView("list")}
            >
                <AlignJustify className="size-4" />
            </Button>
            <Button
                variant={activeView === "card" ? "default" : "outline"}
                size="icon"
                className="rounded-l-none border-l-0"
                onClick={() => setActiveView("card")}
            >
                <Grid2X2 className="size-4" />
            </Button>
        </div>
    );
};
