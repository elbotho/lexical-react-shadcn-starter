import { Editor } from "./components/editor/editor";
import { colors } from "./components/editor/utils/animal-data";

export default function App() {
  return (
    <div className="max-w-2xl mx-auto my-12">
      <div>
        <Editor />
        <div className="flex fixed bottom-0 left-0 right-0">
          {colors.map((backgroundColor) => {
            return <div className="w-full h-1" style={{ backgroundColor }} />;
          })}
        </div>
      </div>
    </div>
  );
}
