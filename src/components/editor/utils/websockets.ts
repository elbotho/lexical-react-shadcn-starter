import { Provider } from "@lexical/yjs";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>
) {
  const doc = getDocFromMap(id, yjsDocMap);

  const wsProtocol = window.location.protocol == "https:" ? "wss" : "ws";

  return new WebsocketProvider(
    `${wsProtocol}://y-websocket-experiment.glitch.me:80`,
    id,
    doc,
    {
      connect: false,
    }
  ) as unknown as Provider;
}

function getDocFromMap(id: string, yjsDocMap: Map<string, Y.Doc>): Y.Doc {
  const existingDoc = yjsDocMap.get(id);
  if (existingDoc) {
    existingDoc.load();
    return existingDoc;
  }

  const newDoc = new Y.Doc();
  yjsDocMap.set(id, newDoc);
  return newDoc;
}
