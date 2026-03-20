import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CONTENT_SCHEDULE, DAYS, getCurrentPeriod } from "@/utils/scheduling";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface ScheduleCalendarProps {
  platforms: any[];
}

export function ScheduleCalendar({ platforms }: ScheduleCalendarProps) {
  const period = getCurrentPeriod();
  const schedule = CONTENT_SCHEDULE[period];
  
  const getPlatformDisplay = (platformName: string) => {
    return platforms.find(p => p.name.toLowerCase() === platformName.toLowerCase() || p.id.toLowerCase() === platformName.toLowerCase());
  };

  // Reorder days so Monday is first
  const displayDays = [...DAYS.slice(1), DAYS[0]];

  return (
    <Card className="bg-card border-border overflow-hidden mb-6">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          Automated Weekly Schedule (Period {period})
        </CardTitle>
        <CardDescription>
          Your daily posting layout. AI content templates will be mapped to these specific slots during distribution.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {displayDays.map((day) => {
            const slots = schedule[day] || [];
            
            return (
              <div key={day} className="flex flex-col border border-border rounded-lg overflow-hidden bg-background">
                <div className="bg-muted px-3 py-2 border-b border-border text-center font-medium text-sm">
                  {day}
                </div>
                <div className="p-3 flex-grow flex flex-col gap-2 min-h-[120px]">
                  {slots.length === 0 ? (
                    <div className="text-xs text-muted-foreground text-center my-auto italic">No posts</div>
                  ) : (
                    slots.map((slot, idx) => {
                      const platformInfo = getPlatformDisplay(slot.platform);
                      return (
                        <div key={idx} className="flex flex-col gap-1.5 bg-card/50 hover:bg-muted/50 transition-colors text-xs p-2.5 rounded-md border border-border shadow-sm">
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-1.5 overflow-hidden">
                              {platformInfo && platformInfo.icon ? (
                                <platformInfo.icon className="w-3.5 h-3.5 flex-shrink-0" />
                              ) : null}
                              <span className="font-medium truncate">{platformInfo ? platformInfo.name : slot.platform}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] px-1 py-0 h-4 bg-background">
                              {slot.time}
                            </Badge>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
