import { useEffect, useState } from "react";
import { mergeRegister } from "@lexical/utils";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { $getSelection, isHTMLAnchorElement } from "lexical";
import { PopoverAnchor } from "@radix-ui/react-popover";
import { EditMode } from "./edit-mode";
import { ViewMode } from "./view-mode";

export function FloatingLinkMenu() {
  const [editedLinkUrl, setEditedLinkUrl] = useState("");

  const [open, setOpen] = useState(false);
  const [anchorElement, setAnchorElement] = useState<HTMLAnchorElement | null>(
    null
  );
  const [isLinkEditMode, setIsLinkEditMode] = useState(false);
  const [editor] = useLexicalComposerContext();
  const linkUrl = anchorElement?.getAttribute("href");

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const _selection = $getSelection();
          const elemKey = _selection?.getNodes()[0]?.getKey();
          if (!elemKey) return;
          const elem = editor.getElementByKey(elemKey)?.parentElement;
          const isAchor = elem && isHTMLAnchorElement(elem);

          setAnchorElement(() => {
            if (isAchor) return elem;
            return null;
          });
        });
      })
    );
  }, [editor, anchorElement]);

  useEffect(() => {
    if (!anchorElement) {
      setOpen(false);
      return;
    }
    setOpen(true);
    const hasHref = anchorElement?.getAttribute("href")?.trim() !== "";
    setIsLinkEditMode(!hasHref);

    function onClick() {
      setOpen(true);
    }

    anchorElement.addEventListener("click", onClick);
    return () => {
      anchorElement.removeEventListener("click", onClick);
    };
  }, [anchorElement]);

  return (
    <Popover open={open} onOpenChange={(open) => setOpen(open)}>
      <PopoverAnchor virtualRef={{ current: anchorElement }} />
      <PopoverContent
        className="w-96"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          editor.focus();
        }}
      >
        {isLinkEditMode ? (
          <EditMode
            setOpen={setOpen}
            setIsLinkEditMode={setIsLinkEditMode}
            editedLinkUrl={editedLinkUrl}
            setEditedLinkUrl={setEditedLinkUrl}
          />
        ) : (
          <ViewMode
            linkUrl={linkUrl}
            setIsLinkEditMode={setIsLinkEditMode}
            setEditedLinkUrl={setEditedLinkUrl}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
