import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CHANNELS } from "./constants";

export default function RS2ChannelCard({ selectedChannel, onSelectChannel }) {
  return (
    <Card className="border-primary/20 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          Chọn Cổng Giao Tiếp (Channel / Port)
        </CardTitle>
        <CardDescription>
          Mỗi cổng giao tiếp của lệnh RS2 sẽ lưu thông số cấu hình vào một thanh
          ghi tương ứng.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedChannel}
          onValueChange={onSelectChannel}
          className="grid grid-cols-1 gap-3 sm:grid-cols-3"
        >
          {CHANNELS.map((ch) => {
            const isSelected = selectedChannel === ch.id;
            return (
              <div
                key={ch.id}
                onClick={() => onSelectChannel(ch.id)}
                className={`hover:border-primary/50 relative flex cursor-pointer flex-col justify-between rounded-lg border p-3 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-primary/30 ring-1"
                    : "border-border bg-background/50"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value={ch.id} id={ch.id} />
                    <Label
                      htmlFor={ch.id}
                      className="cursor-pointer font-semibold"
                    >
                      {ch.name}
                    </Label>
                  </div>
                  <Badge
                    variant={isSelected ? "default" : "outline"}
                    className="font-mono text-xs"
                  >
                    {ch.register}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-2 text-xs">
                  {ch.description}
                </p>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
