import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  Edit2Icon,
  Link2OffIcon,
  SquareArrowOutUpRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export function ViewMode({
  linkUrl,
  setIsLinkEditMode,
  setEditedLinkUrl,
}: {
  linkUrl?: string | null;
  setIsLinkEditMode: (value: boolean) => void;
  setEditedLinkUrl: (value: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const fullUrl = linkUrl ?? "";
  const shortUrl =
    fullUrl.length > 29 ? linkUrl?.substring(0, 28) + "…" : linkUrl;

  function onEditClick() {
    setEditedLinkUrl(fullUrl);
    setIsLinkEditMode(true);
  }

  function onRemoveClick() {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }

  return (
    <div className="flex gap-x-1">
      <a href={linkUrl ?? ""} className="p-2 grow" title={fullUrl}>
        <SquareArrowOutUpRightIcon className="inline-block w-4 h-4 -mt-0.5" />{" "}
        {shortUrl}
      </a>
      <Button
        onClick={onEditClick}
        variant="ghost"
        className="!rounded-full block w-10 h-10 !p-1"
        aria-label="Edit link"
      >
        <Edit2Icon className="w-5 h-5" strokeWidth={2.5} />
      </Button>
      <Button
        onClick={onRemoveClick}
        variant="ghost"
        className="!rounded-full block w-10 h-10 !p-1"
      >
        <Link2OffIcon className="w-5 h-5" strokeWidth={2.5} />
      </Button>
    </div>
  );
}
