import { useCallback, useEffect, useState } from "react";
import type { Provider } from "@lexical/yjs";
import * as Y from "yjs";
import { createWebsocketProvider } from "./websockets";
import { getRandomAnimal } from "./animal-data";

export interface UserData {
  name: string;
  color: string;
  emoji: string;
  userId?: number;
}

const randomAnimal = getRandomAnimal();

export function useCollaboration() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);

  // update active user data
  useEffect(() => {
    if (!provider?.awareness) return;

    function handleAwarenessUpdate() {
      const userArray = Array.from(
        provider?.awareness.getStates().entries() ?? []
      );

      const activeUsers = userArray.map(
        ([userId, { color, name, awarenessData }]) => {
          const { emoji } = awarenessData as UserData;
          return { color, name, userId, emoji };
        }
      );
      setUsers(activeUsers);
    }

    provider.awareness.on("update", handleAwarenessUpdate);

    return () => provider.awareness.off("update", handleAwarenessUpdate);
  }, [provider?.awareness]);

  const providerFactory = useCallback(
    (id: string, yjsDocMap: Map<string, Y.Doc>) => {
      const provider = createWebsocketProvider(id, yjsDocMap);

      setTimeout(() => setProvider(provider));

      return provider;
    },
    []
  );

  return {
    user: randomAnimal,
    providerFactory,
    users,
  };
}
