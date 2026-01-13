import { Monitor, Moon, Sun, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserPreferencesStore } from "@/stores/useUserPreferencesStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "pt", label: "Português" },
  { value: "ja", label: "日本語" },
  { value: "zh", label: "中文" },
];

const dateFormats = [
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY (12/31/2024)" },
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY (31/12/2024)" },
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD (2024-12-31)" },
];

export function AppearanceSettings() {
  const { appearance, updateAppearance } = useUserPreferencesStore();

  const handleThemeChange = (theme: typeof appearance.theme) => {
    updateAppearance({ theme });
    toast.success(`Theme changed to ${theme}`);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>
            Choose your preferred color theme for the interface.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={appearance.theme}
            onValueChange={(value) =>
              handleThemeChange(value as typeof appearance.theme)
            }
            className="grid grid-cols-3 gap-4"
          >
            <Label
              htmlFor="light"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                appearance.theme === "light" && "border-primary"
              )}
            >
              <RadioGroupItem value="light" id="light" className="sr-only" />
              <Sun className="h-6 w-6 mb-3" />
              <span className="text-sm font-medium">Light</span>
            </Label>
            <Label
              htmlFor="dark"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                appearance.theme === "dark" && "border-primary"
              )}
            >
              <RadioGroupItem value="dark" id="dark" className="sr-only" />
              <Moon className="h-6 w-6 mb-3" />
              <span className="text-sm font-medium">Dark</span>
            </Label>
            <Label
              htmlFor="system"
              className={cn(
                "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                appearance.theme === "system" && "border-primary"
              )}
            >
              <RadioGroupItem value="system" id="system" className="sr-only" />
              <Monitor className="h-6 w-6 mb-3" />
              <span className="text-sm font-medium">System</span>
            </Label>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Display Preferences</CardTitle>
          <CardDescription>
            Customize how the interface looks and behaves.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Compact Mode</Label>
              <p className="text-sm text-muted-foreground">
                Reduce spacing and padding for a denser layout
              </p>
            </div>
            <Switch
              checked={appearance.compactMode}
              onCheckedChange={(checked) => {
                updateAppearance({ compactMode: checked });
                toast.success(checked ? "Compact mode enabled" : "Compact mode disabled");
              }}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Animations</Label>
              <p className="text-sm text-muted-foreground">
                Enable smooth transitions and animations
              </p>
            </div>
            <Switch
              checked={appearance.showAnimations}
              onCheckedChange={(checked) => {
                updateAppearance({ showAnimations: checked });
                toast.success(checked ? "Animations enabled" : "Animations disabled");
              }}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Language & Region</CardTitle>
          <CardDescription>
            Set your language and regional preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Language</Label>
              <Select
                value={appearance.language}
                onValueChange={(value) => {
                  updateAppearance({ language: value });
                  toast.success("Language updated");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select
                value={appearance.dateFormat}
                onValueChange={(value) => {
                  updateAppearance({ dateFormat: value });
                  toast.success("Date format updated");
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Time Format</Label>
            <RadioGroup
              value={appearance.timeFormat}
              onValueChange={(value) => {
                updateAppearance({ timeFormat: value as "12h" | "24h" });
                toast.success("Time format updated");
              }}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="12h" id="12h" />
                <Label htmlFor="12h" className="font-normal cursor-pointer">
                  12-hour (1:30 PM)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="24h" id="24h" />
                <Label htmlFor="24h" className="font-normal cursor-pointer">
                  24-hour (13:30)
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
