import { ToolbarButton, ToolbarToggleItem } from "@/components/ui/toolbar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { isMac } from "@/utils/client-detection";

export function ToolbarItem({
  tooltipText,
  ariaLabel,
  icon,
  onClick,
  toggleState,
  disabled,
  value,
}: {
  tooltipText: string;
  ariaLabel: string;
  icon: JSX.Element;
  onClick: () => void;
  toggleState?: boolean;
  disabled?: boolean;
  value?: string;
}) {
  function replaceCtrl(text: string) {
    return isMac ? text.replace("Ctrl", "⌘") : text;
  }
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          {value ? (
            <ToolbarToggleItem
              value={value}
              aria-label={replaceCtrl(ariaLabel)}
              disabled={disabled}
              data-state={toggleState ? "on" : "off"}
              onClick={onClick}
            >
              {icon}
            </ToolbarToggleItem>
          ) : (
            <ToolbarButton
              size="sm"
              variant="ghost"
              aria-label={replaceCtrl(ariaLabel)}
              disabled={disabled}
              onClick={onClick}
            >
              {icon}
            </ToolbarButton>
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{replaceCtrl(tooltipText)}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
