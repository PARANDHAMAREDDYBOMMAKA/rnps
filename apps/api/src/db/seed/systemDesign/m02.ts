import type { SeedModule } from "../types.ts";

export const m02: SeedModule = {
  title: "Networking & APIs",
  description: "How requests travel and how services expose themselves to clients and each other.",
  lessons: [
    {
      title: "HTTP Fundamentals for Design Interviews",
      durationMin: 9,
      content: "HTTP is a request-response protocol, and its method semantics matter in design. GET is safe and idempotent, PUT and DELETE are idempotent, and POST is neither, which is why load balancers and clients may safely retry a GET but must not blindly retry a POST. Status code families carry meaning: 2xx success, 3xx redirection, 4xx client error, 5xx server error. Specific codes interviewers expect you to use correctly include 401 for missing credentials, 403 for forbidden, 404, 409 for conflicts, 429 for rate limiting, and 503 for an overloaded or draining server.\n\nCaching headers are part of the protocol. Cache-Control with max-age tells browsers and CDNs how long a response is fresh, and ETag with If-None-Match lets a client revalidate cheaply with a 304.\n\nConnection behavior affects latency. HTTP/1.1 reuses a TCP connection but serializes requests on it, causing head-of-line blocking, so browsers open about six connections per host. HTTP/2 multiplexes many streams over one connection with header compression. HTTP/3 runs over QUIC on UDP so a lost packet stalls only its own stream. A TLS 1.3 handshake costs one round trip.\n\nInterviewers probe whether you know which operations are safe to retry and why connection reuse matters at scale.",
      problems: [
        {
          title: "Non-Idempotent Method",
          prompt: "Which HTTP method is not idempotent according to the specification?",
          type: "mcq",
          difficulty: "easy",
          options: ["GET", "PUT", "DELETE", "POST"],
          answer: "POST",
          explanation: "Repeating a POST may create a second resource, whereas repeating GET, PUT, or DELETE leaves the server in the same state."
        },
        {
          title: "Rate Limit Response",
          prompt: "A client exceeds its request quota. Which status code should the API return?",
          type: "mcq",
          difficulty: "easy",
          options: ["401", "429", "503", "409"],
          answer: "429",
          explanation: "429 Too Many Requests is the dedicated code for rate limiting and is usually paired with a Retry-After header."
        },
        {
          title: "Cheap Revalidation",
          prompt: "A client holds a cached copy of a resource and wants to check whether it changed without downloading it again. Which mechanism does this?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Send If-None-Match with the ETag and receive 304 if unchanged",
            "Send a POST with the cached body",
            "Set Cache-Control: no-store",
            "Open a WebSocket"
          ],
          answer: "Send If-None-Match with the ETag and receive 304 if unchanged",
          explanation: "A 304 Not Modified response has no body, so the client reuses its cached copy at the cost of one small round trip."
        },
        {
          title: "Head-of-Line Blocking",
          prompt: "Which HTTP version first allowed many concurrent requests to be multiplexed over a single TCP connection?",
          type: "mcq",
          difficulty: "easy",
          options: ["HTTP/1.0", "HTTP/1.1", "HTTP/2", "HTTP/3"],
          answer: "HTTP/2",
          explanation: "HTTP/2 introduced binary framing with multiple streams per connection, removing HTTP/1.1's one-request-at-a-time limit."
        },
        {
          title: "Lost Packet Impact",
          prompt: "Why does HTTP/3 over QUIC handle packet loss better than HTTP/2 over TCP?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "QUIC never loses packets",
            "A lost packet stalls only the stream it belongs to rather than every stream on the connection",
            "QUIC uses more TCP connections",
            "HTTP/3 disables encryption to save time"
          ],
          answer: "A lost packet stalls only the stream it belongs to rather than every stream on the connection",
          explanation: "TCP delivers bytes in order, so one lost segment blocks all multiplexed streams; QUIC tracks streams independently."
        },
        {
          title: "Overloaded Server",
          prompt: "A server is draining connections before a deploy and cannot accept new work. Which status code best communicates this to clients?",
          type: "mcq",
          difficulty: "medium",
          options: ["400", "404", "503", "301"],
          answer: "503",
          explanation: "503 Service Unavailable signals a temporary condition where a retry later is appropriate."
        }
      ]
    },
    {
      title: "REST API Design",
      durationMin: 9,
      content: "A REST API models resources as nouns in hierarchical paths such as /users/42/orders and maps HTTP methods to actions: GET to read, POST to create, PUT to replace, PATCH to update, DELETE to remove. Consistent error bodies with a machine-readable code and a human message save client developers hours.\n\nPagination is the detail interviewers love. Offset pagination (page=50, limit=20) is simple but the database must scan and discard the skipped rows, so page 10,000 is slow, and inserts between requests cause duplicates or skipped items. Cursor pagination returns an opaque token encoding the last seen sort key, so the next query is an indexed seek: WHERE created_at < cursor ORDER BY created_at DESC LIMIT 20. It is stable under inserts and constant time regardless of depth, which is why feeds and timelines use it.\n\nVersioning usually lives in the path (/v1/) or a header. Prefer additive changes so old clients keep working. For non-idempotent operations such as payments, accept a client-generated idempotency key in a header, store the result against that key, and return the stored result on a retry.\n\nInterviewers probe how you would paginate a table with 100 million rows, how clients discover rate limits, and how a retried POST avoids creating duplicates.",
      problems: [
        {
          title: "Cursor Beats Offset",
          prompt: "Why does cursor-based pagination outperform offset pagination when reading deep into a large table?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Cursors compress the response body",
            "The database can seek directly to the cursor using an index instead of scanning and discarding skipped rows",
            "Cursors let the client request more rows per page",
            "Offset pagination cannot be cached by a CDN"
          ],
          answer: "The database can seek directly to the cursor using an index instead of scanning and discarding skipped rows",
          explanation: "An offset of 1,000,000 forces the database to read and throw away a million rows, while a cursor becomes an indexed range condition."
        },
        {
          title: "Safe Retry Header",
          prompt: "What should a client send with a POST so that a retried request does not create a duplicate?",
          type: "mcq",
          difficulty: "easy",
          options: ["An idempotency key", "A longer timeout", "A Cache-Control header", "A smaller request body"],
          answer: "An idempotency key",
          explanation: "The server stores the result under the idempotency key and returns the same result when the key is seen again."
        },
        {
          title: "Offset Drift",
          prompt: "A client pages through a feed with offset pagination while new posts are inserted at the top. What does the client observe?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Nothing unusual",
            "Some items appear twice on consecutive pages",
            "The API returns 409",
            "Pages shrink to zero items"
          ],
          answer: "Some items appear twice on consecutive pages",
          explanation: "New inserts shift every row down, so the next offset re-reads items that were already shown."
        },
        {
          title: "Partial Update",
          prompt: "Which HTTP method is conventionally used to update only some fields of a resource?",
          type: "mcq",
          difficulty: "easy",
          options: ["PUT", "PATCH", "POST", "OPTIONS"],
          answer: "PATCH",
          explanation: "PUT replaces the whole representation, while PATCH applies a partial modification."
        },
        {
          title: "Backward Compatible Change",
          prompt: "Which API change is safe to ship without a new version?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Renaming the field user_id to userId",
            "Adding a new optional response field",
            "Changing a field from string to integer",
            "Removing a query parameter clients rely on"
          ],
          answer: "Adding a new optional response field",
          explanation: "Additive changes leave existing clients working, while renames, type changes, and removals break them."
        },
        {
          title: "Resource Naming",
          prompt: "Which path best follows REST conventions for listing the orders of user 42?",
          type: "mcq",
          difficulty: "easy",
          options: ["/getOrdersForUser?id=42", "/users/42/orders", "/order/list/42", "/users/orders/get/42"],
          answer: "/users/42/orders",
          explanation: "Resources are plural nouns in a hierarchy, and the HTTP method rather than the path expresses the action."
        }
      ]
    },
    {
      title: "gRPC and Protocol Buffers",
      durationMin: 8,
      content: "gRPC is a remote procedure call framework that runs over HTTP/2 and encodes messages with Protocol Buffers, a compact binary format defined in .proto files. From one contract you generate typed client and server stubs in many languages, which removes a whole class of serialization bugs. Payloads are typically 3 to 10 times smaller than equivalent JSON and parse much faster, and HTTP/2 multiplexing means one connection carries many concurrent calls.\n\nIt supports four call styles: unary, server streaming, client streaming, and bidirectional streaming. That makes it a natural fit for internal service-to-service traffic, real-time pipelines, and mobile clients that want small payloads.\n\nThe trade-offs are tooling and reach. Browsers cannot speak native gRPC, so you need grpc-web or a gateway that translates to REST. Binary payloads are harder to inspect with curl or a proxy, and public partners generally expect JSON. The usual split is gRPC inside the datacenter and REST or GraphQL at the public edge.\n\nSchema evolution is the thing interviewers probe. Fields are identified by number, not name, so you may rename a field freely and add new optional fields safely, but you must never reuse a deleted field's number for a different type or old clients will misinterpret the bytes.",
      problems: [
        {
          title: "Streaming Between Services",
          prompt: "Two internal microservices need bidirectional streaming with strictly typed contracts and minimal payload size. Which option fits best?",
          type: "mcq",
          difficulty: "easy",
          options: ["REST over HTTP/1.1", "gRPC", "SOAP", "GraphQL over HTTP"],
          answer: "gRPC",
          explanation: "gRPC provides generated typed stubs, compact binary encoding, and native bidirectional streaming over HTTP/2."
        },
        {
          title: "Schema Evolution Rule",
          prompt: "When evolving a Protocol Buffers message that is already deployed, which change is unsafe?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Adding a new optional field with a new number",
            "Renaming an existing field",
            "Reusing a deleted field's number for a new field of a different type",
            "Adding a new enum value"
          ],
          answer: "Reusing a deleted field's number for a new field of a different type",
          explanation: "Protobuf identifies fields on the wire by number, so an old binary will decode the reused number as the old type and corrupt data."
        },
        {
          title: "Browser Limitation",
          prompt: "Why is gRPC rarely used directly from browser JavaScript?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Browsers cannot parse JSON",
            "Browsers do not expose the HTTP/2 framing control that native gRPC requires, so a proxy such as grpc-web is needed",
            "gRPC only works on Linux",
            "Browsers block all binary responses"
          ],
          answer: "Browsers do not expose the HTTP/2 framing control that native gRPC requires, so a proxy such as grpc-web is needed",
          explanation: "The browser fetch API does not allow the trailer handling gRPC depends on, so a translation layer sits in between."
        },
        {
          title: "Transport Protocol",
          prompt: "Which transport does gRPC run on?",
          type: "mcq",
          difficulty: "easy",
          options: ["HTTP/1.0", "HTTP/2", "Raw UDP", "SMTP"],
          answer: "HTTP/2",
          explanation: "gRPC relies on HTTP/2 streams for multiplexing and streaming calls."
        },
        {
          title: "Public API Choice",
          prompt: "You are exposing an API to thousands of external partners with varied tooling. Which choice is most pragmatic?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "gRPC only",
            "REST with JSON at the edge, gRPC internally if needed",
            "Raw TCP sockets",
            "WebSockets for all calls"
          ],
          answer: "REST with JSON at the edge, gRPC internally if needed",
          explanation: "External consumers expect human-readable JSON and ubiquitous HTTP tooling, while internal traffic benefits from gRPC's efficiency."
        },
        {
          title: "Payload Size",
          prompt: "Compared with equivalent JSON, Protocol Buffers payloads are typically how much smaller?",
          type: "mcq",
          difficulty: "medium",
          options: ["About the same size", "3 to 10 times smaller", "1,000 times smaller", "Larger, because of type information"],
          answer: "3 to 10 times smaller",
          explanation: "Binary field tags and varint encoding remove the repeated keys, quotes, and whitespace of JSON."
        }
      ]
    },
    {
      title: "WebSockets and Long Polling",
      durationMin: 10,
      content: "There are four common ways to push data from server to client. Short polling has the client ask every few seconds; it is trivial but wastes requests and adds up to a full interval of delay. Long polling has the server hold the request open until data arrives or a timeout around 30 seconds expires, then the client immediately reconnects. It works through almost any proxy but each message still costs a full HTTP request.\n\nServer-Sent Events keep one HTTP response open and stream text events from server to client only, with automatic reconnection built into browsers. It is ideal for dashboards, tickers, and notifications where the client rarely talks back.\n\nWebSockets upgrade an HTTP connection into a persistent full-duplex TCP socket with tiny per-message overhead, which is the standard choice for chat, multiplayer games, and collaborative editing. The cost is statefulness: a user is pinned to one server, so a message for user B must be routed to whichever server holds B's socket. Production systems keep a connection registry or use a pub/sub layer such as Redis so any server can publish to any user. A tuned server holds hundreds of thousands of idle connections at roughly tens of kilobytes each.\n\nInterviewers probe how you deliver a message when sender and recipient are on different servers.",
      problems: [
        {
          title: "Cross-Server Delivery",
          prompt: "User A is connected by WebSocket to server 1 and sends a message to user B, who is connected to server 3. Which component gets the message to server 3?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "DNS round robin",
            "A pub/sub broker or connection registry shared by the chat servers",
            "The load balancer's sticky session cookie",
            "The client retries until it happens to reach server 3"
          ],
          answer: "A pub/sub broker or connection registry shared by the chat servers",
          explanation: "Server 1 publishes to a channel or looks up B's server in a registry, and server 3 pushes the message down B's socket."
        },
        {
          title: "Server-Only Updates",
          prompt: "A stock ticker page only needs server-to-client updates and must work through strict corporate HTTP proxies with minimal complexity. Which technique is the best fit?",
          type: "mcq",
          difficulty: "easy",
          options: ["WebSockets", "Server-Sent Events", "UDP multicast", "gRPC bidirectional streaming"],
          answer: "Server-Sent Events",
          explanation: "SSE is plain HTTP, streams one direction, and reconnects automatically, which matches the requirements with the least machinery."
        },
        {
          title: "Polling Delay",
          prompt: "A client short-polls every 10 seconds. What is the worst-case delay before it learns about a new event?",
          type: "mcq",
          difficulty: "easy",
          options: ["About 0 seconds", "About 5 seconds", "About 10 seconds", "About 60 seconds"],
          answer: "About 10 seconds",
          explanation: "An event occurring just after a poll waits a full interval until the next poll."
        },
        {
          title: "Long Polling Mechanics",
          prompt: "How does long polling differ from short polling?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "The server holds the request open until data is available or a timeout expires",
            "The client sends requests more frequently",
            "It uses UDP instead of TCP",
            "It requires a WebSocket upgrade"
          ],
          answer: "The server holds the request open until data is available or a timeout expires",
          explanation: "Holding the request eliminates the empty responses of short polling while remaining ordinary HTTP."
        },
        {
          title: "Connection Memory",
          prompt: "A WebSocket server holds 500,000 idle connections at roughly 20 KB each. Approximately how much memory do the connections consume?",
          type: "mcq",
          difficulty: "medium",
          options: ["About 100 MB", "About 1 GB", "About 10 GB", "About 100 GB"],
          answer: "About 10 GB",
          explanation: "500,000 times 20 KB is 10,000,000 KB, which is about 10 GB."
        },
        {
          title: "Server Crash",
          prompt: "A WebSocket server holding 200,000 connections crashes. What should the system be designed to do?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Nothing, connections migrate automatically at the TCP level",
            "Clients reconnect with backoff and jitter to other servers, and the connection registry entries expire or are refreshed",
            "The load balancer replays all in-flight messages",
            "Stop accepting new connections cluster-wide"
          ],
          answer: "Clients reconnect with backoff and jitter to other servers, and the connection registry entries expire or are refreshed",
          explanation: "TCP connections cannot be moved, so reconnection with jitter avoids a thundering herd while the registry converges to the new placement."
        }
      ]
    },
    {
      title: "DNS and CDNs",
      durationMin: 9,
      content: "DNS translates a hostname into IP addresses. A client asks a recursive resolver, which walks from the root servers to the top-level domain servers to the authoritative server for the zone, then caches the answer for the record's TTL. An uncached lookup costs 20 to 120 ms, so caching with TTLs between 60 seconds and a day is what makes DNS fast. Low TTLs enable quick failover but some resolvers ignore them, so DNS is a coarse load-balancing tool. GeoDNS returns the nearest region's address, and anycast lets many sites share one IP.\n\nA content delivery network places caching servers in hundreds of edge locations. A user in Sydney fetching an asset from a Virginia origin pays about 200 ms per round trip; served from a Sydney edge it is under 20 ms. CDNs also absorb traffic spikes and DDoS attacks and terminate TLS close to the user. For static assets hit ratios above 90% are normal.\n\nPull CDNs fetch from origin on the first miss; push CDNs require you to upload ahead of time. Freshness is controlled by Cache-Control headers. The cleanest invalidation is to put a content hash in the filename so a new deploy references a new URL and old files can cache for a year.\n\nInterviewers probe what belongs on the CDN and how you purge stale content without waiting for TTLs.",
      problems: [
        {
          title: "Invalidate a Cached Asset",
          prompt: "A CSS file is cached at the CDN edge with a one-year TTL. What is the most reliable way to ship a changed version to users immediately?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Lower the TTL to zero for all assets",
            "Include a content hash in the filename and reference the new name from the HTML",
            "Purge the entire CDN on every deploy",
            "Serve the CSS with a POST request so it is never cached"
          ],
          answer: "Include a content hash in the filename and reference the new name from the HTML",
          explanation: "A new filename is a new cache key, so the change is instant while the old file can stay cached forever harmlessly."
        },
        {
          title: "Name the Component",
          prompt: "Which component caches static assets at edge locations geographically close to users?",
          type: "mcq",
          difficulty: "easy",
          options: ["A CDN", "A DNS resolver", "A message queue", "A reverse index"],
          answer: "A CDN",
          explanation: "A content delivery network serves cached content from the nearest edge point of presence."
        },
        {
          title: "DNS Failover Limit",
          prompt: "You set a DNS TTL of 30 seconds so you can fail over quickly. Why might some users still reach the old IP minutes later?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "DNS does not support TTLs under one hour",
            "Some resolvers and client libraries ignore low TTLs and cache for longer",
            "The CDN overrides DNS",
            "TTLs only apply to IPv6"
          ],
          answer: "Some resolvers and client libraries ignore low TTLs and cache for longer",
          explanation: "DNS caching behavior is not fully under your control, which is why DNS-based failover is coarse."
        },
        {
          title: "Pull vs Push",
          prompt: "How does a pull CDN populate its edge cache?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "The operator uploads every file to every edge in advance",
            "The edge fetches the object from origin on the first miss and caches it",
            "Users upload files directly to the edge",
            "The origin broadcasts files hourly"
          ],
          answer: "The edge fetches the object from origin on the first miss and caches it",
          explanation: "Pull CDNs are lazy; the first request in each region pays the origin round trip."
        },
        {
          title: "Edge Latency Win",
          prompt: "A user in Sydney fetches a 2 MB image that needs several round trips from a Virginia origin at about 200 ms each. Serving from a Sydney edge at about 15 ms per round trip mostly improves which thing?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Origin disk space",
            "The user's perceived load time, because each round trip is more than ten times shorter",
            "The image's compression ratio",
            "DNS resolution time"
          ],
          answer: "The user's perceived load time, because each round trip is more than ten times shorter",
          explanation: "Transfer time is dominated by round trips, so moving the content close to the user cuts load time dramatically."
        },
        {
          title: "Resolution Path",
          prompt: "In an uncached DNS lookup, which server does the recursive resolver query last?",
          type: "mcq",
          difficulty: "medium",
          options: ["A root server", "A TLD server", "The authoritative server for the domain's zone", "The CDN edge"],
          answer: "The authoritative server for the domain's zone",
          explanation: "The resolver walks root, then TLD, then the authoritative nameserver, which holds the actual record."
        }
      ]
    }
  ]
};
