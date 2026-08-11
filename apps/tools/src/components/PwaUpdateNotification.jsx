import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { useServiceWorkerUpdate } from "@/hooks/use-sw-update";
import { RefreshCw } from "lucide-react";
import SvgLoading from "./loading";

export default function PwaUpdateNotification({ forceShow = false }) {
  const { hasUpdate, isUpdating, updateProgress, applyUpdate, dismissUpdate } =
    useServiceWorkerUpdate();

  const [testUpdating, setTestUpdating] = React.useState(false);
  const [testProgress, setTestProgress] = React.useState(0);
  const [testDismissed, setTestDismissed] = React.useState(false);

  const activeHasUpdate = forceShow ? !testDismissed : hasUpdate;
  const activeIsUpdating = forceShow ? testUpdating : isUpdating;
  const activeProgress = forceShow ? testProgress : updateProgress;

  const handleApplyUpdate = () => {
    if (forceShow) {
      setTestUpdating(true);
      let p = 0;
      const interval = setInterval(() => {
        p += 10;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setTimeout(() => {
            setTestUpdating(false);
            setTestProgress(0);
            setTestDismissed(true);
          }, 1000);
        }
        setTestProgress(p);
      }, 300);
    } else {
      applyUpdate();
    }
  };

  const handleDismiss = () => {
    if (forceShow) {
      setTestDismissed(true);
    } else {
      dismissUpdate();
    }
  };

  if (!activeHasUpdate) return null;

  return (
    <Dialog open={activeHasUpdate} modal>
      <DialogContent
        showCloseButton={false}
        className="overflow-hidden sm:max-w-sm"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="items-center text-center">
          {/* GIF illustration */}
          <div className="bg-muted/30 mx-auto flex min-h-50 w-full items-center justify-center overflow-hidden rounded-lg dark:bg-white">
            {/* <img
              src="./Update-img.gif"
              alt="Update available"
              className="h-auto w-full object-cover"
              draggable={false}
            /> */}
            <SvgLoading />
          </div>

          <DialogTitle className="text-lg">Có bản cập nhật mới!</DialogTitle>
          <DialogDescription className="text-balance">
            Phiên bản mới với các cải tiến và sửa lỗi đã sẵn sàng. Cập nhật ngay
            để trải nghiệm tốt nhất.
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar — shown during update */}
        {activeIsUpdating && (
          <div className="mt-4 space-y-2 px-1">
            <Progress
              cnTrack="h-2"
              value={activeProgress}
              className="w-full max-w-sm"
            >
              <ProgressLabel className="text-muted-foreground animate-pulse">
                Đang cập nhật...
              </ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>
        )}

        {/* Action buttons — hidden during update */}
        {!activeIsUpdating && (
          <DialogFooter className="flex-row gap-2 sm:justify-center">
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Để sau
            </Button>
            <Button onClick={handleApplyUpdate} className="flex-1">
              <RefreshCw className="size-3.5" data-icon="inline-start" />
              Cập nhật ngay
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
