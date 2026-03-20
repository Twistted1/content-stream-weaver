import { useState, useEffect } from "react";
import { Camera, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useUserPreferencesStore } from "@/stores/useUserPreferencesStore";
import { toast } from "sonner";

const timezones = [
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern Time (AET)" },
];

interface ProfileForm {
  displayName: string;
  bio: string;
  avatarUrl: string;
  companyName: string;
  // Extended fields stored locally until DB schema is extended
  phone: string;
  location: string;
  timezone: string;
}

export function ProfileSettings() {
  const { user } = useAuth();
  const { profile: localProfile, updateProfile: updateLocalProfile } = useUserPreferencesStore();

  const [formData, setFormData] = useState<ProfileForm>({
    displayName: "",
    bio: "",
    avatarUrl: "",
    companyName: "",
    phone: localProfile.phone,
    location: localProfile.location,
    timezone: localProfile.timezone,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Load profile from Supabase on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        toast.error("Failed to load profile");
      } else if (data) {
        setFormData((prev) => ({
          ...prev,
          displayName: data.display_name ?? "",
          bio: data.bio ?? "",
          avatarUrl: data.avatar_url ?? "",
          companyName: data.company_name ?? "",
        }));
      }
      setIsLoading(false);
    })();
  }, [user]);

  const handleChange = (field: keyof ProfileForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: formData.displayName,
        bio: formData.bio,
        avatar_url: formData.avatarUrl || null,
        company_name: formData.companyName || null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to save profile");
    } else {
      // Also persist local-only fields to the Zustand store
      updateLocalProfile({
        name: formData.displayName,
        phone: formData.phone,
        location: formData.location,
        timezone: formData.timezone,
        company: formData.companyName,
        bio: formData.bio,
      });
      setIsDirty(false);
      toast.success("Profile updated successfully");
    }
    setIsSaving(false);
  };

  const getInitials = () => {
    const name = formData.displayName || user?.email || "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Update your profile picture. This will be visible to your team members.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24 border-4 border-primary/20">
              <AvatarImage src={formData.avatarUrl} />
              <AvatarFallback className="text-2xl bg-primary/20 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
              onClick={() => toast.info("Avatar upload coming soon")}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <Button variant="outline" onClick={() => toast.info("Avatar upload coming soon")}>
              Upload new picture
            </Button>
            <p className="text-xs text-muted-foreground">
              Recommended: Square image, at least 200x200px
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and contact information.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleChange("displayName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="opacity-60"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.timezone}
                onValueChange={(value) => handleChange("timezone", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          onClick={async () => {
            if (!user) return;
            setIsLoading(true);
            const { data } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", user.id)
              .single();
            if (data) {
              setFormData((prev) => ({
                ...prev,
                displayName: data.display_name ?? "",
                bio: data.bio ?? "",
                avatarUrl: data.avatar_url ?? "",
                companyName: data.company_name ?? "",
              }));
            }
            setIsDirty(false);
            setIsLoading(false);
          }}
          disabled={!isDirty || isSaving}
        >
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!isDirty || isSaving}>
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>
    </div>
  );
}
