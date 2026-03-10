import type { IncomingMessage, ServerResponse } from "http";
import app from "../Backend/index";

export default function handler(
  req: IncomingMessage & { url: string; method: string },
  res: ServerResponse
) {
  (app as any)(req, res);
}
