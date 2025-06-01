import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

export const authMiddleware = (
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  next: (err?: Error) => void
) => {
  const token = socket.handshake.auth.token;
  if (!token || token !== "valid_token") {
    const err = new Error("Unauthorized");
    (err as any).data = { content: "Please log in" };
    return next(err);
  }
  next();
};
