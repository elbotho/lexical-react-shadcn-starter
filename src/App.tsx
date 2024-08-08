import { Editor } from "./components/editor/editor";

export default function App() {
  return (
    <div className="max-w-2xl mx-auto my-12">
      <h1 className="mb-12 font-bold text-2xl">
        Lexical Demo with react + shadcn/ui{" "}
      </h1>
      <div>
        <Editor />
      </div>
    </div>
  );
}
