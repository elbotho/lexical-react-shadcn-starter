import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { allNodes } from "./all-nodes";
import { theme } from "./theme";
import { Toolbar } from "./toolbar/toolbar";
import { MarkdownShortcutsPlugin } from "@/plugins/markdown-shortcuts";
import { useRef } from "react";
import { useCollaboration } from "./utils/use-collaboration";
import { AvatarStack } from "@/plugins/avatar-stack";

const placeholder = "Enter some rich text...";

const editorConfig = {
  namespace: "Serlo Editor Lexical",
  nodes: [...allNodes],
  editorState: null,
  onError(error: Error) {
    console.error(error);
  },
  theme,
};

export function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="max-w-2xl mx-auto overflow mt-16">
        <EditorPlugins />
      </div>
    </LexicalComposer>
  );
}

function EditorPlugins() {
  const { providerFactory, user, users } = useCollaboration({});
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Toolbar />
      <div
        className="editor-inner relative prose md:prose-lg"
        ref={containerRef}
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
        <MarkdownShortcutsPlugin />
        <CollaborationPlugin
          id="1"
          providerFactory={providerFactory}
          shouldBootstrap={true}
          cursorsContainerRef={containerRef}
          username={user.name}
          cursorColor={user.color}
          awarenessData={user}
        />
        <AutoFocusPlugin />
      </div>
      <AvatarStack users={users} />
    </>
  );
}
