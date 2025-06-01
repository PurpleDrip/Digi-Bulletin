import { Socket } from "socket.io";
import cookie from 'cookie';
import { DefaultEventsMap } from "socket.io/dist/typed-events";

// export const authMiddleware = (
//   socket: Socket<DefaultEventsMap, DefaultEventsMap>,
//   next: (err?: Error) => void
// ) => {
//   const token = socket.handshake.headers.cookie;
//   if (!token || token !== "valid_token") {
//     const err = new Error("Unauthorized");
//     (err as any).data = { content: "Please log in" };
//     return next(err);
//   }
//   console.log("Token:", token);
//   const newToken=cookie.parse(token || '');
//   console.log("Cookie:", newToken);
//   next();
// };
