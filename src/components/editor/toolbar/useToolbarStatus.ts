import { $setBlocksType } from "@lexical/selection";
import { $createQuoteNode, $isHeadingNode } from "@lexical/rich-text";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  KEY_MODIFIER_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { $createCodeNode } from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useCallback, useEffect, useState } from "react";
import {
  $isListNode,
  ListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import { getSelectedNode } from "@/utils/getSelectedNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const blockTypes = [
  "ol",
  "ul",
  "code",
  "h1",
  "h2",
  "h3",
  "paragraph",
  "quote",
] as const;
export type BlockType = (typeof blockTypes)[number];

export function useToolbarStatus() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<BlockType>("paragraph");

  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // update text format state
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsSubscript(selection.hasFormat("subscript"));
      setIsSuperscript(selection.hasFormat("superscript"));
      setIsCode(selection.hasFormat("code"));

      // update links state
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));

      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const listType = parentList
            ? parentList.getListType()
            : element.getListType();
          const type = listType === "bullet" ? "ul" : "ol";
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();

          if (blockTypes.includes(type as BlockType)) {
            setBlockType(type as BlockType);
          }
        }
      }
    }
  }, [activeEditor]);

  // refresh activeEditor when selection changes
  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        setActiveEditor(newEditor);
        updateToolbar();
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, updateToolbar]);

  useEffect(() => {
    activeEditor.getEditorState().read(() => {
      updateToolbar();
    });
  }, [activeEditor, updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      // editor.registerEditableListener((editable) => {
      //   setIsEditable(editable);
      // }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [updateToolbar, activeEditor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          const url = isLink ? null : "";
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink]);

  const insertLink = useCallback(() => {
    const url = isLink ? null : "";
    setTimeout(() => {
      document.getElementById("floating-link-menu-input")?.focus();
    }, 10);
    return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  }, [activeEditor, isLink]);

  const formatParagraph = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const toggleQuote = () => {
    activeEditor.update(() => {
      const selection = $getSelection();
      const isQuote = blockType === "quote";
      const block = isQuote ? $createParagraphNode() : $createQuoteNode();
      $setBlocksType(selection, () => block);
    });
  };

  const toggleUnorderedList = () => {
    if (blockType === "ul") {
      formatParagraph();
    } else {
      activeEditor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const toggleOrderedList = () => {
    if (blockType === "ol") {
      formatParagraph();
    } else {
      activeEditor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const insertTable = () => {
    activeEditor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: "4",
      rows: "4",
    });
  };

  const insertCodeHighlight = () => {
    editor.update(() => {
      const selection = $getSelection();

      if ($isRangeSelection(selection)) {
        if (selection.isCollapsed()) {
          $setBlocksType(selection, () => $createCodeNode());
        } else {
          const textContent = selection.getTextContent();
          const codeNode = $createCodeNode();
          selection.insertNodes([codeNode]);
          selection.insertRawText(textContent);
        }
      }
    });
  };

  return {
    editor,
    isLink,
    isBold,
    isItalic,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    isCode,
    blockType,
    canUndo,
    canRedo,
    toggleQuote,
    toggleUnorderedList,
    toggleOrderedList,
    insertLink,
    insertTable,
    insertCodeHighlight,
  };
}
// );
