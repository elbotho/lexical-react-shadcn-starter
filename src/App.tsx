import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="max-w-2xl mx-auto my-12">
      <h1 className="mb-12 font-bold text-2xl">
        Lexical Demo with react + shadcn/ui{" "}
      </h1>
      <div>
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
      </div>
    </div>
  );
}

export default App;
