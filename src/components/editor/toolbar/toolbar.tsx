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
import { ToolbarButton } from "./toolbar-button";
import { Separator } from "./separator";
import { useToolbarStatus } from "./useToolbarStatus";
import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from "lexical";

export function Toolbar() {
  const {
    editor,
    isLink,
    isBold,
    isItalic,
    blockType,
    canUndo,
    canRedo,
    insertLink,
    toggleQuote,
    toggleUnorderedList,
    toggleOrderedList,
  } = useToolbarStatus();

  return (
    <nav className="toolbar fixed left-0 right-0 top-0 z-40 bg-white flex items-center p-2">
      <div className="mx-auto flex items-center gap-2">
        <ToolbarButton
          tooltipText="Undo (Ctrl+Z)"
          ariaLabel="Undo. Shortcut: Ctrl+Z"
          disabled={!canUndo}
          icon={<RotateCcwIcon />}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
        />
        <ToolbarButton
          disabled={!canRedo}
          tooltipText="Redo (Ctrl+Y)"
          ariaLabel="Redo. Shortcut: Ctrl+Y"
          icon={<RotateCwIcon />}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
        />

        <Separator />

        <ToolbarButton
          toggleState={isBold}
          tooltipText="Bold (Ctrl+B)"
          ariaLabel="Format text as bold. Shortcut: Ctrl+B"
          icon={<BoldIcon />}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
        />
        <ToolbarButton
          toggleState={isItalic}
          tooltipText="Italic (Ctrl+I)"
          ariaLabel="Format text as italic. Shortcut: Ctrl+I"
          icon={<ItalicIcon />}
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
        />

        <Separator />

        <ToolbarButton
          toggleState={blockType === "quote"}
          tooltipText="Quote"
          ariaLabel="Insert a Quote"
          icon={<QuoteIcon />}
          onClick={toggleQuote}
        />
        <ToolbarButton
          toggleState={blockType === "ul"}
          tooltipText='List (Start line with "-")'
          ariaLabel="Add List"
          icon={<ListIcon />}
          onClick={toggleUnorderedList}
        />
        <ToolbarButton
          toggleState={blockType === "ol"}
          tooltipText="Numbered List (Start line with '1.')"
          ariaLabel="Add Numbered List"
          icon={<ListOrderedIcon />}
          onClick={toggleOrderedList}
        />
      </div>
    </nav>
  );
}
