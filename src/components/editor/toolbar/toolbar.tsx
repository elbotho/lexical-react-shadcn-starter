import {
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RotateCcwIcon,
  RotateCwIcon,
} from "lucide-react";
import { useToolbarStatus } from "./useToolbarStatus";
import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from "lexical";
import { Separator } from "@/components/ui/separator";
import {
  Toolbar as RadixToolbar,
  ToolbarSeparator,
  ToolbarToggleGroup,
} from "@/components/ui/toolbar";
import { ToolbarItem } from "./toolbar-item";

export function Toolbar() {
  const {
    editor,
    isBold,
    isItalic,
    isLink,
    blockType,
    canUndo,
    canRedo,
    toggleQuote,
    toggleUnorderedList,
    toggleOrderedList,
    insertLink,
  } = useToolbarStatus();

  return (
    <RadixToolbar
      className="sticky left-0 right-0 top-0 pt-2 z-40 bg-background"
      aria-label="Formatting options"
    >
      <div className="flex h-10 items-center space-x-1 rounded-md shadow-md p-2 border border-stone-100">
        <ToolbarItem
          tooltipText="Undo (Ctrl+Z)"
          ariaLabel="Undo. Shortcut: Ctrl+Z"
          disabled={!canUndo}
          icon={<RotateCcwIcon />}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        />
        <ToolbarItem
          disabled={!canRedo}
          tooltipText="Redo (Ctrl+Y)"
          ariaLabel="Redo. Shortcut: Ctrl+Y"
          icon={<RotateCwIcon />}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        />

        <Separator orientation="vertical" />
        <ToolbarToggleGroup
          type="multiple"
          aria-label="Text formatting"
          className="flex items-center justify-center gap-1"
        >
          <ToolbarItem
            value="bold"
            toggleState={isBold}
            tooltipText="Bold (Ctrl+B)"
            ariaLabel="Format text as bold. Shortcut: Ctrl+B"
            icon={<BoldIcon />}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
          />
          <ToolbarItem
            value="italic"
            toggleState={isItalic}
            tooltipText="Italic (Ctrl+I)"
            ariaLabel="Format text as italic. Shortcut: Ctrl+I"
            icon={<ItalicIcon />}
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
          />
          <ToolbarItem
            toggleState={isLink}
            tooltipText="Link (Ctrl+K)"
            ariaLabel="Insert or edit a link. Shortcut: Ctrl+K"
            icon={<LinkIcon />}
            onClick={() => insertLink()}
          />
        </ToolbarToggleGroup>
        <Separator orientation="vertical" />
        <ToolbarToggleGroup type="single" aria-label="Lists and Quote">
          <ToolbarItem
            toggleState={blockType === "quote"}
            tooltipText="Quote"
            ariaLabel="Insert a Quote"
            icon={<QuoteIcon />}
            onClick={toggleQuote}
            value="quote"
          />
          <ToolbarItem
            toggleState={blockType === "ul"}
            tooltipText='List (Start line with "-")'
            ariaLabel="Add List"
            icon={<ListIcon />}
            onClick={toggleUnorderedList}
            value="ul"
          />
          <ToolbarItem
            toggleState={blockType === "ol"}
            tooltipText="Numbered List (Start line with '1.')"
            ariaLabel="Add Numbered List"
            icon={<ListOrderedIcon />}
            onClick={toggleOrderedList}
            value="ol"
          />
        </ToolbarToggleGroup>
        <ToolbarSeparator className="w-[1px] bg-mauve6 mx-[10px]" />
      </div>
    </RadixToolbar>
  );
}
