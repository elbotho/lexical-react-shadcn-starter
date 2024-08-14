import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  EditorHistoryStateContext,
  useEditorHistoryState,
} from "./utils/external-history";
import { allNodes } from "./all-nodes";
import { theme } from "./theme";
import { Toolbar } from "./toolbar/toolbar";
import { MarkdownShortcutsPlugin } from "@/plugins/markdown-shortcuts";
import { useState } from "react";
import DraggableBlockPlugin from "@/plugins/draggable-blocks";
import { FloatingLinkMenu } from "@/plugins/floating-link-menu";

const placeholder = "Enter some rich text...";

const editorState =
  '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Howdy ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Lexical.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

const editorConfig = {
  namespace: "Serlo Editor Lexical",
  nodes: [...allNodes],
  editorState: window.localStorage.getItem("editorState") ?? editorState,
  onError(error: Error) {
    console.error(error);
  },
  theme,
};

export function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <EditorHistoryStateContext>
        <div className="max-w-2xl mx-auto overflow mt-16">
          <EditorPlugins />
        </div>
      </EditorHistoryStateContext>
    </LexicalComposer>
  );
}

function EditorPlugins() {
  const { historyState } = useEditorHistoryState();

  const [wrappingElement, setWrappingElement] = useState<HTMLDivElement | null>(
    null
  );

  return (
    <>
      <Toolbar />
      <div
        className="editor-inner relative prose md:prose-lg"
        ref={(elem) => setWrappingElement(elem)}
      >
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="editor-input bg-white block relative outline-none p-10 pb-10 min-h-36"
              aria-placeholder={placeholder}
              placeholder={
                <div className="text-neutral-500 overflow-hidden absolute overflow-ellipsis top-10 left-10 right-7 select-none whitespace-nowrap inline-block pointer-events-none">
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <ListPlugin />
        <LinkPlugin />
        <TablePlugin hasCellMerge={false} hasCellBackgroundColor={false} />

        {wrappingElement && (
          <>
            <FloatingLinkMenu />
            <DraggableBlockPlugin wrappingElement={wrappingElement} />
          </>
        )}

        <OnChangePlugin
          ignoreSelectionChange
          onChange={(editorState) => {
            const stateString = JSON.stringify(editorState.toJSON());
            window.localStorage.setItem("editorState", stateString);
          }}
        />
        <MarkdownShortcutsPlugin />
        <HistoryPlugin externalHistoryState={historyState} />
        <AutoFocusPlugin />
      </div>
    </>
  );
}
