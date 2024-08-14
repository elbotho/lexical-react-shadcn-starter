import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { Input } from "@/components/ui/input";
import { useRef } from "react";
import { sanitizeUrl } from "@/utils/url";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function EditMode({
  setOpen,
  setIsLinkEditMode,
  editedLinkUrl,
  setEditedLinkUrl,
}: {
  setOpen: (value: boolean) => void;
  setIsLinkEditMode: (value: boolean) => void;
  editedLinkUrl: string;
  setEditedLinkUrl: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [editor] = useLexicalComposerContext();

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      onConfirm();
    } else if (event.key === "Escape") {
      event.preventDefault();
      setIsLinkEditMode(false);
    }
  }

  const onConfirm = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl(editedLinkUrl));

    // reset after dispatch
    setEditedLinkUrl("");
    setIsLinkEditMode(false);
    setTimeout(() => setOpen(true));
  };

  return (
    <div className="grid gap-3">
      <div className="flex mt-0.5 gap-x-1">
        <Input
          ref={inputRef}
          id="floating-link-menu-input"
          className="w-full h-10 !text-base grow"
          placeholder="https://.."
          value={editedLinkUrl}
          onChange={({ target }) => setEditedLinkUrl(target.value)}
          onKeyDown={onKeyDown}
        />
        <Button
          variant="ghost"
          className="!rounded-full block w-11 h-10 !p-1"
          onClick={onConfirm}
        >
          <CheckIcon className="w-5 h-5" strokeWidth={3} />
        </Button>
      </div>
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Insert a link</p>
      </div>
    </div>
  );
}
