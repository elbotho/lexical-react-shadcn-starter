/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { Provider } from "@lexical/yjs";
import { WebrtcProvider } from "y-webrtc";
import { WebsocketProvider } from "y-websocket";
import * as Y from "yjs";

let idSuffix = 0; // In React Strict mode "new WebrtcProvider" may be called twice

export function createWebRTCProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>
) {
  const doc = getDocFromMap(id, yjsDocMap);

  // localStorage.log = 'true' in browser console to enable logging
  const provider = new WebrtcProvider(`${id}/${idSuffix++}`, doc, {
    peerOpts: {
      reconnectTimer: 100,
    },
    signaling:
      window.location.hostname === "localhost" ? ["ws://localhost:1235"] : [],
  });

  return provider as unknown as Provider;
}

export function createWebsocketProvider(
  id: string,
  yjsDocMap: Map<string, Y.Doc>
) {
  const doc = getDocFromMap(id, yjsDocMap);

  return new WebsocketProvider("ws://localhost:1234", id, doc, {
    connect: false,
  }) as unknown as Provider;
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
