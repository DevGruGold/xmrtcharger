import { Check, Music, MessageCircle, Chrome, Phone, Battery, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Toggle } from "./ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface App {
  id: string;
  name: string;
  icon: React.ReactNode;
  defaultOn: boolean;
}

const defaultApps: App[] = [
  { id: "music", name: "Music Player", icon: <Music className="h-4 w-4" />, defaultOn: true },
  { id: "whatsapp", name: "WhatsApp", icon: <MessageCircle className="h-4 w-4" />, defaultOn: true },
  { id: "browser", name: "Browser", icon: <Chrome className="h-4 w-4" />, defaultOn: false },
  { id: "phone", name: "Phone", icon: <Phone className="h-4 w-4" />, defaultOn: true },
];

export function AppSelector() {
  const [selectedApps, setSelectedApps] = useState<string[]>(
    defaultApps.filter(app => app.defaultOn).map(app => app.id)
  );

  return (
    <div className="w-full max-w-md mx-auto space-y-6 p-4">
      <div className="text-center space-y-2">
        <Battery className="w-8 h-8 mx-auto text-charging animate-pulse" />
        <h2 className="text-2xl font-bold">XMRT Charger</h2>
        <p className="text-sm text-muted-foreground">Select apps to keep running while charging</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {defaultApps.map((app) => (
          <Toggle
            key={app.id}
            pressed={selectedApps.includes(app.id)}
            onPressedChange={(pressed) => {
              setSelectedApps(prev =>
                pressed ? [...prev, app.id] : prev.filter(id => id !== app.id)
              );
            }}
            className="w-full h-20 flex flex-col items-center justify-center gap-2 data-[state=on]:bg-primary/20"
          >
            {app.icon}
            <span className="text-sm">{app.name}</span>
            {selectedApps.includes(app.id) ? (
              <Check className="w-4 h-4 text-primary" />
            ) : (
              <X className="w-4 h-4 text-muted-foreground" />
            )}
          </Toggle>
        ))}
      </div>
    </div>
  );
}