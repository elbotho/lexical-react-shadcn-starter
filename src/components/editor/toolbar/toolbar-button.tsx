import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isMac } from "@/utils/client-detection";

export function ToolbarButton({
  tooltipText,
  ariaLabel,
  icon,
  onClick,
  toggleState,
  disabled,
}: {
  tooltipText: string;
  ariaLabel: string;
  icon: JSX.Element;
  onClick: () => void;
  toggleState?: boolean;
  disabled?: boolean;
}) {
  function replaceCtrl(text: string) {
    return isMac ? text.replace("Ctrl", "⌘") : text;
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            aria-pressed={toggleState}
            aria-label={replaceCtrl(ariaLabel)}
            disabled={disabled}
            data-disabled={disabled ? "" : undefined}
            onClick={onClick}
            variant={toggleState ? "secondary" : "ghost"}
          >
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{replaceCtrl(tooltipText)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
