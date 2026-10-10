import type { SeedTrack } from "./types.ts";

export const systemDesign: SeedTrack = {
  slug: "system-design",
  title: "System Design",
  description: "Scalability, data, and the trade-offs behind every design interview.",
  icon: "layers",
  modules: [
    {
      title: "Foundations",
      description: "The vocabulary and numbers every design conversation is built on.",
      lessons: [
        {
          title: "Latency vs Throughput",
          durationMin: 8,
          content: "Latency is the time a single operation takes from request to response, usually measured in milliseconds. Throughput is how many operations a system completes per unit of time, such as requests per second. They are related but independent: a batch pipeline can have enormous throughput while each item waits minutes, and a tiny service can answer in 2 ms but fall over at 50 requests per second.\n\nKeep a few reference numbers in your head. A main memory read is about 100 nanoseconds, an SSD random read about 100 microseconds, a round trip inside one datacenter about 0.5 ms, and a round trip between continents about 150 ms. These tell you that a request crossing the Atlantic can never finish in under 100 ms no matter how fast your code is, so geography is a design input.\n\nAlways describe latency with percentiles, never averages. A p50 of 20 ms with a p99 of 2 seconds means one user in a hundred waits two seconds, and a page that fans out to 100 backend calls will hit that slow tail almost every time. This is tail latency amplification, and it is why large fan-out services obsess over p99.\n\nInterviewers probe whether you know which lever you are pulling. Adding servers raises throughput but does not make a single request faster. Caching, fewer round trips, and locality reduce latency.",
          problems: [
            {
              title: "Tail Latency Fan-Out",
              prompt: "A backend has p99 latency of 900 ms. A page load makes 50 parallel calls to it. Roughly what fraction of page loads will contain at least one 900 ms call?",
              type: "mcq",
              difficulty: "medium",
              options: ["About 1%", "About 10%", "About 40%", "About 99%"],
              answer: "About 40%",
              explanation: "The chance that all 50 calls avoid the slow 1% is 0.99 to the power of 50, which is about 0.6, so about 40% of pages hit at least one slow call."
            },
            {
              title: "Which Lever",
              prompt: "Adding more identical servers behind a load balancer primarily increases which metric: latency or throughput? Answer with one word.",
              type: "coding",
              difficulty: "easy",
              answer: "throughput",
              explanation: "More servers handle more requests per second, but each individual request still takes the same amount of time."
            }
          ]
        },
        {
          title: "Availability and the Nines",
          durationMin: 8,
          content: "Availability is the fraction of time a system correctly serves requests, usually quoted in nines. Three nines (99.9%) allows about 8.8 hours of downtime per year, four nines about 53 minutes, and five nines about 5 minutes. Each extra nine is roughly ten times harder and more expensive, because it removes the time humans need to notice and fix a problem.\n\nAvailability composes in two ways. Components in series multiply: a request that depends on three services each at 99.9% has an end-to-end availability of about 99.7%. Components in parallel with failover compound in your favor: two independent 99.9% replicas where either can serve gives about 99.9999%. This is why redundancy is the standard tool and why long dependency chains quietly destroy availability budgets.\n\nDistinguish the related terms. An SLI is a measured indicator such as the fraction of successful requests. An SLO is the internal target, say 99.95% over 30 days. An SLA is the external contract with penalties, usually looser than the SLO. The gap between them is your safety margin.\n\nInterviewers probe whether you compute the availability of the whole path rather than of one box. If your design has a single database with 99.9% uptime, nothing upstream can exceed it.",
          problems: [
            {
              title: "Serial Dependencies",
              prompt: "A request path calls three services in series, each with 99.9% availability. What is the approximate availability of the full path?",
              type: "mcq",
              difficulty: "easy",
              options: ["99.9%", "99.7%", "99.99%", "99.3%"],
              answer: "99.7%",
              explanation: "Serial availability multiplies: 0.999 cubed is about 0.997."
            },
            {
              title: "Downtime Budget",
              prompt: "A service promises 99.99% availability. Approximately how much downtime does that allow per year?",
              type: "mcq",
              difficulty: "easy",
              options: ["About 5 minutes", "About 53 minutes", "About 8.8 hours", "About 3.65 days"],
              answer: "About 53 minutes",
              explanation: "There are about 525,600 minutes in a year and 0.01% of that is roughly 52.6 minutes."
            }
          ]
        },
        {
          title: "CAP Theorem in Practice",
          durationMin: 9,
          content: "The CAP theorem says a distributed data store cannot simultaneously guarantee consistency (every read sees the latest write), availability (every request gets a non-error response), and partition tolerance (the system keeps working when the network splits). Because network partitions do happen in any real deployment, partition tolerance is not optional. The real choice is what you do during a partition: refuse some requests to stay consistent, or keep answering and risk staleness.\n\nCP systems such as ZooKeeper, etcd, and HBase stop serving writes on the minority side of a partition so that no two sides diverge. AP systems such as Cassandra at consistency level ONE, DynamoDB with eventually consistent reads, and DNS keep answering from whatever replica is reachable and reconcile later. A bank ledger or an inventory reservation leans CP; a like counter, a shopping cart, or a presence indicator leans AP.\n\nPACELC extends the idea: even without a partition, you trade latency against consistency, because strongly consistent writes must wait for remote replicas to acknowledge.\n\nInterviewers probe two misconceptions. First, there is no practical CA system at scale, because you cannot opt out of partitions. Second, the C in CAP means linearizability, a much stronger guarantee than the C in ACID.",
          problems: [
            {
              title: "Pick the CP System",
              prompt: "Which of these systems refuses writes on the minority side of a network partition rather than risk divergent data?",
              type: "mcq",
              difficulty: "medium",
              options: ["Cassandra at consistency level ONE", "DNS", "ZooKeeper", "A CDN edge cache"],
              answer: "ZooKeeper",
              explanation: "ZooKeeper requires a majority quorum to commit and will stop serving writes when it cannot reach one, which is CP behavior."
            },
            {
              title: "Name the Priority",
              prompt: "During a partition, a system keeps accepting writes on both sides and reconciles the conflicts afterward. Which CAP property is it prioritizing? Answer with one word.",
              type: "coding",
              difficulty: "easy",
              answer: "availability",
              explanation: "Continuing to answer every request during a partition at the cost of possible divergence is the AP choice."
            }
          ]
        },
        {
          title: "Back-of-Envelope Estimation",
          durationMin: 10,
          content: "Interviewers expect you to size a system in two minutes with rounded numbers. Start with the anchors: a day has 86,400 seconds, which you round to 100,000. A kilobyte is about a thousand bytes, a megabyte a million, a gigabyte a billion, a terabyte a trillion, and a petabyte a thousand terabytes.\n\nTraffic comes first. If 10 million daily active users each make 20 requests, that is 200 million requests per day, or roughly 2,300 requests per second on average. Peak traffic is usually 2 to 3 times the average, so plan for about 7,000. Then separate reads from writes, because a 100 to 1 read ratio pushes you toward caches and replicas while a write-heavy system pushes you toward partitioning.\n\nStorage follows from writes. If 1 million new records per day each take 1 KB, that is 1 GB per day and about 365 GB per year, which fits easily on one database. If you store 2 MB photos at 2 million uploads a day, that is 4 TB per day and about 1.5 PB per year, which forces object storage and a CDN.\n\nThe point of the estimate is not the number but the decision it drives. State your assumptions out loud, round aggressively, and then say what the result implies: one server or many, one database or shards.",
          problems: [
            {
              title: "Photo Storage Per Year",
              prompt: "A photo service receives 2 million uploads per day with an average size of 2 MB. Roughly how much storage does one year of uploads require?",
              type: "mcq",
              difficulty: "medium",
              options: ["About 4 TB", "About 150 TB", "About 1.5 PB", "About 15 PB"],
              answer: "About 1.5 PB",
              explanation: "2 million times 2 MB is 4 TB per day, and 4 TB times 365 days is about 1,460 TB, or 1.5 PB."
            },
            {
              title: "Average QPS",
              prompt: "10 million daily active users each make 20 requests per day. What is the approximate average requests per second?",
              type: "mcq",
              difficulty: "easy",
              options: ["About 230", "About 2,300", "About 23,000", "About 230,000"],
              answer: "About 2,300",
              explanation: "200 million requests divided by 86,400 seconds is about 2,315."
            }
          ]
        },
        {
          title: "Vertical vs Horizontal Scaling",
          durationMin: 8,
          content: "Vertical scaling means a bigger machine: more cores, more RAM, faster disks. It requires no code changes and keeps everything in one place, which is why it is usually the right first move for a database. The limits are a hard ceiling (the largest cloud instances top out at a few hundred vCPUs and a few terabytes of RAM), steeply non-linear pricing, and a single point of failure that goes down during every reboot.\n\nHorizontal scaling means more machines behind a load balancer. There is no ceiling in principle and failures are partial rather than total, but it demands that your service be stateless or that data be partitioned, and it introduces coordination problems such as distributed locks, unique ID generation, and cross-node transactions.\n\nIn practice teams scale vertically until the cost curve bends, add read replicas and caches, and only then shard. A single well-tuned PostgreSQL instance handles tens of thousands of simple queries per second, which exceeds the needs of most products.\n\nInterviewers probe what breaks when you go from one server to many. The usual culprits are in-memory sessions, files written to local disk, in-process caches and counters, and scheduled jobs that assume they are the only runner.",
          problems: [
            {
              title: "First Thing to Break",
              prompt: "A monolith that worked on one server is deployed to five identical servers behind a round-robin load balancer. Which of these breaks first?",
              type: "mcq",
              difficulty: "easy",
              options: ["SQL joins", "In-memory user sessions", "HTTPS termination", "Log rotation"],
              answer: "In-memory user sessions",
              explanation: "Each request may land on a different server, so sessions held in one process's memory are missing on the others."
            },
            {
              title: "Name the Direction",
              prompt: "Adding more machines rather than upgrading to a bigger machine is called what kind of scaling? Answer with the single word that precedes the word scaling.",
              type: "coding",
              difficulty: "easy",
              answer: "horizontal",
              explanation: "Horizontal scaling (scaling out) adds nodes, while vertical scaling (scaling up) adds resources to one node."
            }
          ]
        }
      ]
    },
    {
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
              prompt: "What is the client-supplied unique value sent with a POST so that a retried request does not create a duplicate? Answer with the two-word term ending in key.",
              type: "coding",
              difficulty: "easy",
              answer: "idempotency key",
              explanation: "The server stores the result under the idempotency key and returns the same result when the key is seen again."
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
              prompt: "Which component caches static assets at edge locations geographically close to users? Answer with the three-letter acronym.",
              type: "coding",
              difficulty: "easy",
              answer: "cdn",
              explanation: "A content delivery network serves cached content from the nearest edge point of presence."
            }
          ]
        }
      ]
    },
    {
      title: "Load Balancing & Scaling",
      description: "Spreading traffic across machines without losing requests or users.",
      lessons: [
        {
          title: "Load Balancer Algorithms",
          durationMin: 8,
          content: "A load balancer chooses which backend serves each request, and the algorithm determines how evenly work spreads. Round robin cycles through backends in order and is the default because it needs no state, but it assumes every request costs the same and every server is equally capable. Weighted round robin fixes the second assumption by sending a 32-core box twice the traffic of a 16-core box.\n\nLeast connections routes each new request to the backend with the fewest in-flight requests, which adapts automatically when request durations vary from 50 ms to 30 seconds or when one node slows down. Least response time goes further by also tracking measured latency. A simpler trick with most of the benefit is power of two choices: pick two backends at random and send to the less loaded one.\n\nHash-based algorithms route the same key to the same server. IP hash gives crude session affinity. Consistent hashing on a user or cache key keeps affinity even as servers join or leave, remapping only about 1/N of keys, which is what you want in front of caches.\n\nInterviewers probe failure scenarios. With round robin, a backend that is up but slow keeps receiving its full share and its queue grows; least connections naturally sends it less.",
          problems: [
            {
              title: "Variable Request Cost",
              prompt: "Backends handle requests whose durations vary from 50 ms to 30 seconds. Which algorithm best avoids piling work onto a node that is currently busy with slow requests?",
              type: "mcq",
              difficulty: "easy",
              options: ["Round robin", "Least connections", "IP hash", "Random"],
              answer: "Least connections",
              explanation: "Least connections sends new work to the node with the fewest in-flight requests, which reflects actual load rather than request count."
            },
            {
              title: "Stable Affinity",
              prompt: "You want requests for the same cache key to land on the same backend, and adding a backend should remap as few keys as possible. Which algorithm?",
              type: "mcq",
              difficulty: "medium",
              options: ["Weighted round robin", "Least response time", "Consistent hashing", "Power of two choices"],
              answer: "Consistent hashing",
              explanation: "Consistent hashing maps keys and servers onto a ring so adding a server moves only roughly 1/N of keys."
            }
          ]
        },
        {
          title: "Layer 4 vs Layer 7 Balancing",
          durationMin: 8,
          content: "A layer 4 load balancer works at the transport level. It sees source and destination IP addresses and TCP or UDP ports, picks a backend, and forwards packets, often by rewriting addresses or using direct server return. Because it never inspects payload it is extremely fast and cheap per connection, handles millions of concurrent connections, and works for any protocol, but it cannot make decisions based on URLs, headers, or cookies.\n\nA layer 7 load balancer terminates the connection, parses HTTP, and routes on content: /api to one pool, /static to another, a canary header to the new version, a cookie to a specific server. It can terminate TLS, compress responses, apply a web application firewall, retry failed requests, and emit per-route metrics. The cost is CPU per request and the fact that it becomes a stateful hop you must scale and secure.\n\nLarge deployments layer them: DNS or anycast spreads traffic across regions, a layer 4 tier such as a cloud network load balancer absorbs raw connections, and a layer 7 tier such as nginx, Envoy, or an application load balancer does the routing.\n\nInterviewers probe where TLS is terminated, where sticky sessions live, and whether gRPC or WebSocket traffic needs special handling at layer 7.",
          problems: [
            {
              title: "Path-Based Routing",
              prompt: "You need to send requests for /api/* to one server pool and /static/* to another. Which type of load balancer is required?",
              type: "mcq",
              difficulty: "easy",
              options: ["Layer 4", "Layer 7", "DNS round robin", "Anycast"],
              answer: "Layer 7",
              explanation: "Only a layer 7 balancer parses HTTP and can route on the request path."
            },
            {
              title: "Abbreviate the Tier",
              prompt: "What is the common two-character abbreviation for a load balancer that terminates TLS and routes on HTTP paths and headers? Answer with the letter L followed by the layer digit.",
              type: "coding",
              difficulty: "easy",
              answer: "l7",
              explanation: "Layer 7 of the OSI model is the application layer, where HTTP lives."
            }
          ]
        },
        {
          title: "Stateless Services and Session Handling",
          durationMin: 8,
          content: "A stateless service can handle any request on any instance because nothing about a user lives in process memory between requests. That property is what makes horizontal scaling, rolling deploys, and autoscaling painless: the load balancer can send traffic anywhere and kill instances at will.\n\nState does not disappear; it moves. Session data goes to a shared store such as Redis keyed by session ID with a TTL, where a lookup in the same availability zone takes well under a millisecond. Alternatively the state moves to the client in a signed token or cookie, which costs no server lookup but is harder to revoke. Uploaded files go to object storage, not local disk. Rate limit counters and caches go to Redis or Memcached, not a process-local map.\n\nSticky sessions, where the balancer pins a user to one server via cookie or IP hash, are the tempting shortcut. They produce uneven load, lose every user's session when a server dies or deploys, and make autoscaling down dangerous. They are acceptable only for temporary affinity like WebSocket connections.\n\nInterviewers probe what else hides state: an in-memory job scheduler that must run once, a local file cache, or a counter that is accidentally per-instance.",
          problems: [
            {
              title: "Zero Session Loss",
              prompt: "You are scaling from 2 to 50 web servers and deploy several times a day. Which approach lets you do this with no user session loss?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Sticky sessions keyed on client IP",
                "Store sessions in Redis keyed by session ID",
                "Keep sessions in server memory and replicate between servers",
                "Extend the cookie expiry to 30 days"
              ],
              answer: "Store sessions in Redis keyed by session ID",
              explanation: "A shared session store makes every server interchangeable so instances can be added or replaced freely."
            },
            {
              title: "Sticky Session Drawback",
              prompt: "What is the main operational drawback of sticky sessions?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "They require HTTPS",
                "Load becomes uneven and sessions are lost when a pinned server fails or deploys",
                "They prevent the use of a CDN",
                "They double the number of database connections"
              ],
              answer: "Load becomes uneven and sessions are lost when a pinned server fails or deploys",
              explanation: "Pinning users to servers ties their session to that server's lifetime and defeats even distribution."
            }
          ]
        },
        {
          title: "Autoscaling and Capacity Planning",
          durationMin: 9,
          content: "Autoscaling adds or removes instances in response to signals. The common triggers are average CPU above a target such as 60 to 70 percent, request queue depth, or p95 latency. Scheduled scaling pre-warms capacity before a known daily peak, and predictive scaling fits a model to history. Good policies scale out aggressively and scale in slowly, with a cooldown period of a few minutes after each action so the system settles before being measured again.\n\nStartup time bounds how fast you can react. A virtual machine takes one to three minutes to join a pool, a container 10 to 30 seconds, and a serverless function a few hundred milliseconds to a few seconds. If traffic can double in a minute, reactive scaling alone will not save you and you need headroom.\n\nCapacity planning is simple arithmetic. If peak traffic is 30,000 requests per second and one server sustains 500 at target utilization, you need 60 servers. To survive losing one of three availability zones you need the remaining two to carry the full load, so provision 90. This is N+1 or N+2 thinking applied to zones.\n\nInterviewers probe why databases cannot autoscale this way, and what happens when scale-in is too aggressive and a traffic burst hits a half-size fleet.",
          problems: [
            {
              title: "Zone Failure Capacity",
              prompt: "Peak traffic is 30,000 requests per second. One server handles 500 requests per second at target utilization. You deploy evenly across three availability zones and must survive losing one zone. How many servers?",
              type: "mcq",
              difficulty: "medium",
              options: ["60", "75", "90", "180"],
              answer: "90",
              explanation: "60 servers carry the peak, but with one zone gone only two thirds remain, so you need 60 times 3/2, which is 90."
            },
            {
              title: "Name the Pause",
              prompt: "What is the term for the fixed period after a scaling action during which the autoscaler ignores further triggers so metrics can stabilize? Answer with one word.",
              type: "coding",
              difficulty: "easy",
              answer: "cooldown",
              explanation: "A cooldown prevents oscillation by giving new instances time to absorb load before the next decision."
            }
          ]
        },
        {
          title: "Health Checks and Graceful Degradation",
          durationMin: 9,
          content: "A load balancer only sends traffic to instances that pass health checks. A liveness check answers whether the process should be restarted; a readiness check answers whether it can take traffic right now. A shallow check returns 200 if the process is up. A deep check also tests dependencies like the database. Deep checks are seductive and dangerous: if the database blips for 30 seconds, every instance fails its check simultaneously and the balancer removes all of them, converting a partial slowdown into a total outage. Prefer shallow readiness checks and surface dependency health through metrics instead.\n\nGraceful shutdown matters during deploys. On SIGTERM an instance should fail its readiness check, stop accepting new connections, finish in-flight requests within a deadline of around 30 seconds, and only then exit.\n\nGraceful degradation means the product keeps working with reduced features when a dependency fails. A product page renders without recommendations, search returns cached results, checkout disables a coupon service. Feature flags and sensible fallbacks make this possible. Load shedding is the related technique of rejecting excess requests quickly with 503 so that the requests you do accept finish fast.\n\nInterviewers probe what happens when every instance fails a health check; some balancers then route to all instances anyway, which is called failing open.",
          problems: [
            {
              title: "Deep Check Cascade",
              prompt: "Every web server's readiness check runs a query against the primary database. The database becomes unreachable for 30 seconds. What most likely happens?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Only requests that need the database fail while static pages keep working",
                "All instances are marked unhealthy and the load balancer drops all traffic, including requests that did not need the database",
                "The load balancer automatically promotes a replica",
                "Nothing, because health checks are cached for five minutes"
              ],
              answer: "All instances are marked unhealthy and the load balancer drops all traffic, including requests that did not need the database",
              explanation: "A deep check ties every instance's health to one dependency, so a dependency blip removes the entire fleet from rotation."
            },
            {
              title: "Degrade Gracefully",
              prompt: "The recommendation service behind a product page is down. Which response is an example of graceful degradation?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Return a 500 error for the product page",
                "Render the product page without the recommendations section",
                "Retry the recommendation call until it succeeds",
                "Redirect the user to the home page"
              ],
              answer: "Render the product page without the recommendations section",
              explanation: "The core function survives while a non-essential feature is silently omitted."
            }
          ]
        }
      ]
    },
    {
      title: "Caching",
      description: "Trading freshness for speed at every layer of the stack.",
      lessons: [
        {
          title: "Cache-Aside and Read-Through",
          durationMin: 9,
          content: "Cache-aside is the pattern most applications use. On a read, the application checks the cache; on a miss it reads the database, writes the value into the cache with a TTL, and returns it. The cache holds only data that was actually requested, so memory is spent on the working set, and a cache failure degrades to slower reads rather than errors. The downside is that application code owns the logic, and a database update leaves the cached copy stale until it expires or is explicitly invalidated.\n\nRead-through moves the loading logic into the cache layer: the application only talks to the cache, which fetches from the database on a miss. The behavior is the same but the code is simpler and consistent across services.\n\nThe arithmetic is what makes caching worth it. If a cache hit costs 0.5 ms and a database read costs 20 ms, a 90 percent hit ratio gives an average of about 2.5 ms, an eight-fold improvement. At 99 percent it is 0.7 ms. Measure hit ratio continuously, because a drop from 95 to 80 percent quadruples database load.\n\nInterviewers probe the thundering herd: when a popular key expires, thousands of requests miss at once and hit the database together. Mitigations are request coalescing with a lock, refreshing hot keys before expiry, and adding jitter to TTLs.",
          problems: [
            {
              title: "Effective Read Latency",
              prompt: "A cache hit takes 0.5 ms and a database read takes 20 ms. With a 90% hit ratio, what is the average read latency?",
              type: "mcq",
              difficulty: "easy",
              options: ["About 0.5 ms", "About 2.5 ms", "About 10 ms", "About 18 ms"],
              answer: "About 2.5 ms",
              explanation: "0.9 times 0.5 plus 0.1 times 20 equals 0.45 plus 2, which is 2.45 ms."
            },
            {
              title: "Name the Stampede",
              prompt: "A popular key expires and thousands of concurrent requests all miss the cache and hit the database at once. Give the two-word name for this problem that begins with the word thundering.",
              type: "coding",
              difficulty: "easy",
              answer: "thundering herd",
              explanation: "The thundering herd, also called a cache stampede, is mitigated by request coalescing and early refresh of hot keys."
            }
          ]
        },
        {
          title: "Write-Through and Write-Back",
          durationMin: 8,
          content: "Write policies decide what happens to the cache when data changes. With write-through, every write goes to the cache and the database synchronously before the client gets a response. The cache is never stale with respect to writes that passed through it, and reads immediately after a write hit. The costs are higher write latency, because two systems must acknowledge, and wasted memory on written data that is never read.\n\nWrite-back, also called write-behind, acknowledges the write as soon as the cache has it and flushes to the database asynchronously, often batching many updates into one. Write latency drops to sub-millisecond and the database sees far fewer operations, which is ideal for counters, view tallies, and other high-frequency updates where losing a few seconds of data is tolerable. The risk is exactly that: if the cache node dies before flushing, those writes are gone. Replicating the cache or persisting its log reduces but does not eliminate the window.\n\nWrite-around writes only to the database and deletes or bypasses the cache entry, so the next read repopulates it. It avoids polluting the cache with write-once data such as logs.\n\nInterviewers probe the durability of write-back and which write policy you pair with which read policy for a given workload.",
          problems: [
            {
              title: "High-Frequency Counter",
              prompt: "A likes counter receives 50,000 increments per second and losing a few seconds of counts during a rare failure is acceptable. Which policy fits best?",
              type: "mcq",
              difficulty: "medium",
              options: ["Write-through", "Write-back", "Write-around", "No cache, write directly to the database"],
              answer: "Write-back",
              explanation: "Write-back absorbs the increments in memory and flushes batched totals, trading a small loss window for enormous write reduction."
            },
            {
              title: "Write-Back Risk",
              prompt: "What is the primary risk of write-back caching?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Reads become slower",
                "Data is lost if the cache node fails before it flushes to the database",
                "The database receives duplicate writes",
                "Cache memory usage drops too low"
              ],
              answer: "Data is lost if the cache node fails before it flushes to the database",
              explanation: "Acknowledged writes exist only in cache memory until the asynchronous flush completes."
            }
          ]
        },
        {
          title: "Cache Eviction Policies",
          durationMin: 8,
          content: "A cache is finite, so when memory fills something must go. Least recently used (LRU) evicts the entry untouched for the longest time and works well for most request streams because recent access predicts future access. Redis approximates it by sampling five random keys and evicting the least recently used among them, which is far cheaper than maintaining an exact list and nearly as effective.\n\nLRU has a weakness: a one-time scan over many keys, such as a nightly batch reading every product, pushes the genuinely hot entries out. Least frequently used (LFU) evicts the entry with the lowest access count and resists scans, but it adapts slowly when popularity shifts unless counts decay over time. Modern designs such as W-TinyLFU combine a small LRU window with a frequency filter and achieve higher hit ratios than either alone.\n\nTTL expiry is orthogonal to eviction: it bounds staleness rather than memory. Redis policies include allkeys-lru, volatile-lru which only evicts keys with a TTL, volatile-ttl, and noeviction, which returns an error on writes when memory is full.\n\nInterviewers probe which policy suits a workload: a session store where every entry has a TTL versus a product catalog where a few items receive most traffic.",
          problems: [
            {
              title: "Scan Resistance",
              prompt: "A nightly batch job reads every product exactly once, and each morning the hot products are missing from the LRU cache. Which policy resists this pattern?",
              type: "mcq",
              difficulty: "medium",
              options: ["FIFO", "LFU", "Random eviction", "Shorter TTLs"],
              answer: "LFU",
              explanation: "A single scan touches each key once, so frequently used entries keep higher counts and survive under LFU."
            },
            {
              title: "Memory Full",
              prompt: "Redis is configured with the noeviction policy and reaches its maxmemory limit. What happens on the next write?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "The oldest key is silently removed",
                "The write returns an error",
                "Redis restarts and clears memory",
                "The write is queued until memory frees"
              ],
              answer: "The write returns an error",
              explanation: "noeviction never discards data, so writes fail while reads continue to work."
            }
          ]
        },
        {
          title: "Distributed Caches and Hot Keys",
          durationMin: 9,
          content: "A single Redis node serves roughly 100,000 simple operations per second and holds whatever fits in memory, so beyond that you shard. Clients can hash keys to nodes themselves, or Redis Cluster does it with 16,384 hash slots spread across masters, each with replicas for failover. Memcached is simpler and purely a cache; Redis adds data structures, persistence, and pub/sub.\n\nSharding creates the hot key problem. A celebrity's profile or a viral post maps to exactly one node, and if it receives two million reads per second that node saturates while the others idle. Adding shards does not help because the key still lives on one of them. The fixes are to replicate the key under suffixes (key#1 through key#N) and have clients read a random copy, to add a small in-process cache on each application server for the hottest few hundred keys with a short TTL, and to coalesce concurrent misses. Large values are a related problem; a 5 MB value blocks the single-threaded Redis event loop for every reader.\n\nWhen a node dies, consistent hashing limits the damage to about 1/N of keys, which repopulate from the database. Pre-warming or rate limiting during recovery protects the database from the sudden miss burst.\n\nInterviewers probe how you detect hot keys in the first place: sampling access logs or using the cache's built-in key frequency stats.",
          problems: [
            {
              title: "Saturated Shard",
              prompt: "A celebrity's profile key receives 2 million reads per second and saturates one Redis shard while the others are idle. What is the most effective fix?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Add more Redis shards",
                "Replicate the key under N suffixes and have clients read a random copy",
                "Increase the key's TTL",
                "Move the profile to a SQL database"
              ],
              answer: "Replicate the key under N suffixes and have clients read a random copy",
              explanation: "Copies of the key hash to different shards, so the read load spreads across N nodes instead of one."
            },
            {
              title: "Remap Fraction",
              prompt: "With consistent hashing across N nodes, roughly what fraction of keys must move when one node is removed? Answer as a fraction in the form 1/n.",
              type: "coding",
              difficulty: "easy",
              answer: "1/n",
              explanation: "Only the keys that mapped to the removed node move to their next neighbor on the ring, which is about one Nth of all keys."
            }
          ]
        },
        {
          title: "Cache Invalidation Strategies",
          durationMin: 9,
          content: "Invalidation decides how stale a cached value may become. The simplest tool is a TTL: a five-second TTL guarantees staleness is bounded at five seconds with no coordination at all, at the cost of a miss every five seconds per key. Explicit invalidation on write removes the entry when the underlying row changes, so readers see fresh data on the next request. Event-driven invalidation subscribes to database change events through a message bus or change data capture and deletes affected keys, which works across many services that cannot call each other.\n\nDelete, do not update. If two writers overwrite a cached value out of order, the cache ends up holding the older one indefinitely. Deleting forces the next reader to fetch the current truth. Even then a race remains: reader A misses, writer B updates the database and deletes the key, then A populates the cache with its stale read. Facebook's memcache solved this with leases, a token issued on a miss that is invalidated by any delete so the stale fill is rejected. Short TTLs are the pragmatic backstop.\n\nVersioned keys sidestep invalidation entirely: user:42:v7 changes name when the user changes, and old entries simply expire.\n\nInterviewers probe multi-layer caches, where a CDN, an application cache, and a browser cache must all be invalidated consistently.",
          problems: [
            {
              title: "Delete Not Update",
              prompt: "When a record changes, why is it safer to delete the cache key than to overwrite it with the new value?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Deletes are faster than sets in every cache",
                "Two concurrent writers can overwrite the cache out of order, leaving the older value in place indefinitely",
                "Overwriting resets the TTL to zero",
                "The cache cannot store values larger than the old one"
              ],
              answer: "Two concurrent writers can overwrite the cache out of order, leaving the older value in place indefinitely",
              explanation: "Deleting forces the next reader to load the current value from the database instead of trusting a possibly stale write."
            },
            {
              title: "Bounded Staleness",
              prompt: "Product prices change rarely but must never be shown more than 5 seconds stale. Which approach guarantees this bound with no additional infrastructure?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "A 5-second TTL on each cached price",
                "Change data capture into a message bus",
                "Write-back caching",
                "Sticky sessions"
              ],
              answer: "A 5-second TTL on each cached price",
              explanation: "A TTL bounds staleness unconditionally, and since prices rarely change the extra misses are negligible."
            }
          ]
        }
      ]
    },
    {
      title: "Databases & Storage",
      description: "Choosing, indexing, replicating, and partitioning the system of record.",
      lessons: [
        {
          title: "SQL vs NoSQL Selection",
          durationMin: 10,
          content: "Relational databases such as PostgreSQL and MySQL give you a schema, joins, secondary indexes, and ACID transactions across rows. They scale vertically very far and horizontally for reads with replicas, but sharding writes across machines is manual and loses cross-shard joins and transactions. A single well-provisioned instance handles tens of thousands of transactions per second, which covers most products.\n\nNoSQL is a family, not a single thing. Key-value stores (Redis, DynamoDB) give constant-time lookups by key. Document stores (MongoDB) hold nested JSON and index inside it. Wide-column stores (Cassandra, HBase, Bigtable) partition rows by key and order them by a clustering column, which makes them excellent for append-heavy time series and feeds at millions of writes per second. Graph databases (Neo4j) make multi-hop traversals cheap.\n\nChoose NoSQL when you know the access patterns up front, need horizontal write scale beyond a single machine, or want schema flexibility. The price is denormalization, no ad hoc joins, and weaker or single-partition transactions, so changing access patterns later is painful.\n\nInterviewers want justification by access pattern, consistency needs, and scale, not by fashion. A reasonable answer is often relational for the core transactional data plus a specialized store for one hot path.",
          problems: [
            {
              title: "IoT Time Series",
              prompt: "Sensors write 1 million append-only readings per second, and queries always ask for one device over a time range. Which store fits best?",
              type: "mcq",
              difficulty: "medium",
              options: ["A single PostgreSQL instance", "A wide-column store like Cassandra", "A graph database", "An in-memory key-value cache"],
              answer: "A wide-column store like Cassandra",
              explanation: "Partitioning by device and clustering by timestamp makes both the write path and the range read path sequential and horizontally scalable."
            },
            {
              title: "What You Give Up",
              prompt: "Moving a service from PostgreSQL to Cassandra, which capability do you lose first?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Ad hoc joins and multi-row transactions",
                "The ability to store strings",
                "Replication",
                "Primary key lookups"
              ],
              answer: "Ad hoc joins and multi-row transactions",
              explanation: "Wide-column stores require you to model data for each query up front and offer transactions only within a partition."
            }
          ]
        },
        {
          title: "Indexing Fundamentals",
          durationMin: 10,
          content: "An index is a separate structure that lets the database find rows without scanning the table. The default B-tree index keeps keys sorted, so equality lookups, range queries, and ordered scans all cost O(log n) page reads, typically three or four for a table with hundreds of millions of rows. Hash indexes answer equality only. Every index slows writes, because each insert or update must also modify the index, and consumes disk, so a table with ten indexes may write five times slower than one with two.\n\nComposite indexes follow the leftmost prefix rule. An index on (user_id, created_at) serves queries filtering on user_id alone or on user_id plus a created_at range, but not on created_at alone. A covering index includes every column a query needs so the table is never touched. Selectivity matters: an index on a boolean column rarely helps because half the table still qualifies.\n\nWrite-heavy stores such as Cassandra and RocksDB use log-structured merge trees instead. Writes go to an in-memory table and are flushed as sorted files, which makes writes sequential and fast; reads may check several files, mitigated by bloom filters and compaction.\n\nInterviewers probe why a query is slow despite an index: a function wrapped around the column, a leading wildcard, wrong column order, or low selectivity.",
          problems: [
            {
              title: "Leftmost Prefix",
              prompt: "A table has a composite index on (user_id, created_at). Which query cannot use this index efficiently?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "WHERE user_id = 42",
                "WHERE user_id = 42 AND created_at > '2025-01-01'",
                "WHERE created_at > '2025-01-01'",
                "WHERE user_id = 42 ORDER BY created_at DESC"
              ],
              answer: "WHERE created_at > '2025-01-01'",
              explanation: "The index is sorted by user_id first, so a filter on created_at alone cannot narrow the search without the leading column."
            },
            {
              title: "Write-Optimized Structure",
              prompt: "Which data structure do write-optimized storage engines such as RocksDB and Cassandra use instead of B-trees? Answer with the three-letter acronym only.",
              type: "coding",
              difficulty: "easy",
              answer: "lsm",
              explanation: "A log-structured merge tree batches writes in memory and flushes sorted runs to disk, trading read amplification for sequential writes."
            }
          ]
        },
        {
          title: "Database Replication",
          durationMin: 10,
          content: "Replication keeps copies of data on several nodes for availability and read scaling. In single-leader replication all writes go to one node and are shipped to followers as a log. Asynchronous replication acknowledges the client as soon as the leader commits; followers typically lag by a few milliseconds, but under heavy load or during a long transaction lag can reach seconds or minutes, and a leader crash loses any unreplicated writes. Synchronous replication waits for at least one follower, guaranteeing durability at the cost of write latency and availability if that follower is slow. Semi-synchronous is the usual compromise.\n\nRead replicas scale reads, not writes, and introduce the classic bug: a user updates their profile, the page reloads from a lagging replica, and the old name reappears. The fix is read-your-writes consistency, implemented by routing a user's reads to the leader for a few seconds after they write, or by tracking the last write position and only reading from replicas that have caught up.\n\nFailover means detecting leader death, promoting a follower, and repointing clients. Done carelessly it causes split brain, where two nodes accept writes. Multi-leader setups accept writes in several regions but must resolve conflicts; leaderless systems like Cassandra use quorums instead.\n\nInterviewers probe replication lag symptoms and how you choose sync versus async per workload.",
          problems: [
            {
              title: "Vanishing Update",
              prompt: "A user changes their display name, the page refreshes, and the old name is shown for a few seconds. What is the most likely cause?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "The write failed silently",
                "The refresh read from an asynchronous replica that had not yet applied the write",
                "The browser cached the HTML",
                "The database rolled back the transaction"
              ],
              answer: "The refresh read from an asynchronous replica that had not yet applied the write",
              explanation: "Replication lag means a follower can serve a read before the leader's change arrives, which read-your-writes routing prevents."
            },
            {
              title: "No Committed Data Loss",
              prompt: "Which replication mode guarantees that a committed write survives an immediate leader failure, at the cost of higher write latency?",
              type: "mcq",
              difficulty: "easy",
              options: ["Asynchronous", "Synchronous", "Snapshot-based", "Log shipping every minute"],
              answer: "Synchronous",
              explanation: "The leader does not acknowledge until a follower has durably received the write, so promotion loses nothing."
            }
          ]
        },
        {
          title: "Sharding and Partitioning",
          durationMin: 10,
          content: "Sharding splits one logical dataset across many database nodes, each holding a subset of rows, so that writes and storage scale horizontally. The shard key decides which node owns a row, and choosing it is the whole design problem.\n\nRange partitioning assigns contiguous key ranges to shards. It supports range scans but creates hotspots: sharding an event log by timestamp means every write lands on the newest shard. Hash partitioning spreads keys evenly and kills hotspots but destroys range queries across shards. A directory or lookup service maps keys to shards explicitly, giving flexibility at the cost of an extra hop and a component to keep available. Consistent hashing with virtual nodes lets you add shards while moving only a fraction of the data.\n\nA good shard key has high cardinality, distributes load evenly, and matches the dominant access pattern so most queries touch one shard. User-owned data such as messages, orders, or settings usually shards by user ID. Multi-tenant systems shard by tenant, with the known risk of one tenant outgrowing a shard.\n\nCross-shard joins, transactions, and unique constraints become application problems, which is why teams shard as late as possible.\n\nInterviewers probe your handling of celebrity keys, resharding without downtime, and queries that do not include the shard key, which must fan out to every shard.",
          problems: [
            {
              title: "Timestamp Shard Key",
              prompt: "An event log is range-sharded by timestamp. What problem does this create?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Range queries become impossible",
                "All new writes land on the shard holding the latest range, creating a hotspot",
                "Events cannot have duplicate timestamps",
                "Each shard needs its own schema"
              ],
              answer: "All new writes land on the shard holding the latest range, creating a hotspot",
              explanation: "Time is monotonically increasing, so the newest range receives every write while older shards sit idle."
            },
            {
              title: "Messages Shard Key",
              prompt: "A messaging app stores each user's private inbox and always reads an inbox by its owner. What is the best shard key?",
              type: "mcq",
              difficulty: "medium",
              options: ["Message timestamp", "Owner user ID", "Message ID", "Sender's country"],
              answer: "Owner user ID",
              explanation: "Every inbox read touches a single shard and load spreads across many users."
            }
          ]
        },
        {
          title: "Object Storage and Blob Handling",
          durationMin: 9,
          content: "Object storage such as Amazon S3, Google Cloud Storage, or MinIO stores files as immutable objects in a flat namespace addressed by key. It offers eleven nines of durability by replicating across zones, near-unlimited capacity, very high aggregate throughput, and low cost around two cents per gigabyte per month. The trade-offs are time to first byte in the tens of milliseconds, no partial updates (you replace the whole object), and no transactions. It is the right home for images, videos, backups, and logs, and the wrong home for anything you query by field.\n\nThe standard pattern stores the blob in object storage and its metadata (owner, size, content type, key) in a database. Never store large blobs in a relational table; they bloat backups and replication.\n\nUploads and downloads should bypass your application servers. The server issues a presigned URL, a time-limited signed link granting one specific operation on one key, and the client talks directly to the object store. Files above about 100 MB use multipart upload, which splits them into parallel parts that can be retried individually and resumed after a disconnect. A CDN in front serves hot objects from the edge, and lifecycle rules move cold objects to cheaper tiers after 30 or 90 days.\n\nInterviewers probe the upload flow for a 1 GB video and how you deliver it globally.",
          problems: [
            {
              title: "Large Mobile Uploads",
              prompt: "A mobile app lets users upload 500 MB videos over unreliable connections. Which flow is best?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Upload through the API server, which streams to object storage",
                "Client requests a presigned URL and performs a multipart upload directly to object storage",
                "Base64-encode the video into a JSON POST",
                "Store the video in a database BLOB column"
              ],
              answer: "Client requests a presigned URL and performs a multipart upload directly to object storage",
              explanation: "Direct multipart upload keeps application servers out of the data path and lets individual parts retry after a disconnect."
            },
            {
              title: "Time-Limited Link",
              prompt: "What is the name for a time-limited URL that grants a client direct upload or download access to one private object? Answer with the two-word term ending in url.",
              type: "coding",
              difficulty: "easy",
              answer: "presigned url",
              explanation: "A presigned URL embeds a signature over the key, operation, and expiry so the object store can authorize the request without your server."
            }
          ]
        }
      ]
    },
    {
      title: "Consistency & Transactions",
      description: "What guarantees data gives you, and what they cost.",
      lessons: [
        {
          title: "Strong vs Eventual Consistency",
          durationMin: 9,
          content: "Consistency models describe what a read may return after writes. Linearizability, the strongest practical model, makes the system behave as if there were one copy of the data: once a write completes, every subsequent read anywhere sees it. It requires coordination, which means cross-replica round trips and refusal to answer when a quorum is unreachable.\n\nEventual consistency promises only that replicas converge once writes stop, usually within milliseconds but sometimes seconds. It is cheap and highly available, and it is fine for like counts, view tallies, and search indexes where nobody notices a brief lag.\n\nBetween the extremes are the session guarantees that users actually feel. Read-your-writes means a user sees their own updates immediately. Monotonic reads mean a user never sees data go backward in time across refreshes. Causal consistency means a reply never appears before the comment it answers. Many systems offer these per request: DynamoDB serves eventually consistent reads by default and strongly consistent reads on request at twice the capacity cost.\n\nInterviewers probe whether you can name the precise guarantee a feature needs rather than asking for strong consistency everywhere. A bank balance needs linearizable reads; a profile edit needs read-your-writes; a feed needs little more than causal ordering.",
          problems: [
            {
              title: "Missing Own Comment",
              prompt: "A user posts a comment, immediately reloads the page, and does not see it; it appears two seconds later. Which guarantee was violated?",
              type: "mcq",
              difficulty: "easy",
              options: ["Linearizability of the whole system", "Read-your-writes", "Durability", "Atomicity"],
              answer: "Read-your-writes",
              explanation: "The user's own write was not visible to their subsequent read, which is exactly the session guarantee read-your-writes provides."
            },
            {
              title: "Needs Linearizability",
              prompt: "Which of these most clearly requires linearizable reads?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "A distributed lock service deciding which node holds a lease",
                "A video view counter",
                "A product search index",
                "A trending hashtags list"
              ],
              answer: "A distributed lock service deciding which node holds a lease",
              explanation: "If two nodes could both read that the lock is free, both would acquire it, so the lock service must behave as a single copy."
            }
          ]
        },
        {
          title: "ACID Transactions and Isolation Levels",
          durationMin: 10,
          content: "A transaction groups operations so they are atomic (all or nothing), consistent (constraints hold), isolated (concurrent transactions do not interfere), and durable (committed data survives crashes, via a write-ahead log flushed to disk). Isolation is the subtle one, because full isolation is expensive and databases offer weaker levels by default.\n\nRead uncommitted allows dirty reads of uncommitted data. Read committed, the PostgreSQL default, prevents dirty reads but a row can change between two reads in one transaction. Repeatable read or snapshot isolation, the MySQL InnoDB default, gives each transaction a consistent snapshot, so reads are stable, but it still allows write skew: two transactions each read a condition, both find it true, and both write, producing a state neither would have allowed alone. The classic case is two on-call doctors each removing themselves because they saw the other still on call. Serializable isolation prevents it at the cost of more aborts or locking.\n\nMulti-version concurrency control lets readers proceed without blocking writers by keeping old row versions. For explicit control, SELECT FOR UPDATE locks rows pessimistically, while optimistic locking compares a version column at write time and retries on mismatch.\n\nInterviewers probe double-booking: reserving the last seat under snapshot isolation needs serializable mode, a row lock, or a unique constraint to be safe.",
          problems: [
            {
              title: "Both Doctors Leave",
              prompt: "Two on-call doctors each run a transaction that checks at least one other doctor is on call and then removes themselves. Under snapshot isolation both commit and nobody is on call. What is this anomaly called?",
              type: "mcq",
              difficulty: "hard",
              options: ["Dirty read", "Phantom read", "Write skew", "Lost update"],
              answer: "Write skew",
              explanation: "Each transaction read a consistent snapshot and wrote a different row, so no row conflict was detected even though the combined result violates the invariant."
            },
            {
              title: "Lowest Isolation",
              prompt: "Which isolation level allows a transaction to see data that another transaction has written but not yet committed?",
              type: "mcq",
              difficulty: "easy",
              options: ["Read uncommitted", "Read committed", "Repeatable read", "Serializable"],
              answer: "Read uncommitted",
              explanation: "Read uncommitted permits dirty reads; every higher level prevents them."
            }
          ]
        },
        {
          title: "Distributed Transactions and Sagas",
          durationMin: 10,
          content: "When an operation spans several databases or services, no single transaction covers it. Two-phase commit solves this with a coordinator: in the prepare phase every participant locks its resources and votes, and in the commit phase the coordinator tells everyone to commit or abort. It gives atomicity but participants hold locks while waiting, and if the coordinator crashes between phases they are stuck until it recovers. The latency and the blocking make 2PC rare across microservices.\n\nA saga replaces one distributed transaction with a sequence of local transactions, each followed by a published event or a call to the next step. If a later step fails, the saga runs compensating transactions in reverse: refund the payment, release the inventory, cancel the order. Choreography has each service react to events; orchestration has a central saga coordinator drive the steps, which is easier to reason about for long flows. Sagas are eventually consistent, so the system briefly shows an order that is paid but not yet reserved.\n\nThe dual-write problem lurks here: writing to the database and then publishing an event is not atomic. The transactional outbox pattern writes the event to an outbox table in the same local transaction, and a relay publishes it afterward.\n\nInterviewers probe what happens when a compensation itself fails, which demands idempotent retries and a manual intervention queue.",
          problems: [
            {
              title: "Order Across Services",
              prompt: "Placing an order touches the order, payment, and inventory services, each with its own database. You want to avoid holding locks across services. Which pattern?",
              type: "mcq",
              difficulty: "medium",
              options: ["Two-phase commit", "Saga with compensating transactions", "A single shared database table", "Optimistic locking on the order row"],
              answer: "Saga with compensating transactions",
              explanation: "A saga chains local transactions and undoes completed steps on failure, so no cross-service locks are held."
            },
            {
              title: "Atomic Event Publishing",
              prompt: "Which pattern writes an event into a table within the same local transaction as the business data so a relay can publish it reliably? Answer with the single word that precedes the word pattern.",
              type: "coding",
              difficulty: "medium",
              answer: "outbox",
              explanation: "The transactional outbox makes the database the source of truth for events and eliminates the dual-write race."
            }
          ]
        },
        {
          title: "Consensus with Raft and Paxos",
          durationMin: 10,
          content: "Consensus lets a cluster of nodes agree on a sequence of values, such as who the leader is or the next entry in a replicated log, even when some nodes crash or messages are delayed. Paxos was first and underlies Google's Chubby and Spanner. Raft was designed to be understandable and powers etcd, Consul, CockroachDB, TiKV, and Kafka's KRaft mode.\n\nRaft elects a leader for a numbered term; followers that miss heartbeats start an election and a candidate wins with a majority of votes. Clients send writes to the leader, which appends them to its log and replicates to followers; an entry is committed once a majority has stored it. A cluster of 2f+1 nodes tolerates f failures, so three nodes survive one failure and five survive two, while four nodes still only survive one, which is why clusters are sized odd.\n\nThe cost is a majority round trip for every write, about one millisecond in a datacenter and 100 ms or more across regions, so consensus is used for small, critical state: configuration, leader election, locks, and metadata, not high-volume user data.\n\nInterviewers probe partition behavior. If five nodes split three against two, the three-node side keeps or elects a leader and makes progress; the two-node side cannot form a majority and rejects writes, which is what prevents split brain.",
          problems: [
            {
              title: "Three Against Two",
              prompt: "A five-node Raft cluster partitions into a group of three and a group of two. What happens?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Both groups elect leaders and accept writes",
                "The three-node group keeps or elects a leader and accepts writes; the two-node group cannot commit anything",
                "The whole cluster stops until the partition heals",
                "The two-node group becomes read-only and the three-node group stops"
              ],
              answer: "The three-node group keeps or elects a leader and accepts writes; the two-node group cannot commit anything",
              explanation: "Three of five is a majority, so only that side can commit entries, which prevents divergent histories."
            },
            {
              title: "Tolerate Two Failures",
              prompt: "What is the minimum number of nodes in a Raft cluster that can keep committing writes with two nodes down simultaneously?",
              type: "mcq",
              difficulty: "easy",
              options: ["3", "4", "5", "7"],
              answer: "5",
              explanation: "Tolerating f failures requires 2f+1 nodes, so f equals 2 needs 5."
            }
          ]
        },
        {
          title: "Quorums and Tunable Consistency",
          durationMin: 9,
          content: "Leaderless stores in the Dynamo family (Cassandra, Riak, DynamoDB internally) replicate each key to N nodes and let the client choose how many must acknowledge a write (W) and how many must answer a read (R). If W plus R is greater than N, every read set overlaps every write set in at least one node, so a read is guaranteed to include the latest acknowledged write.\n\nWith N of 3, the common setting W of 2 and R of 2 gives that overlap while tolerating one node down for both reads and writes. W of 1 and R of 1 is fastest and most available but may return stale data. W of 3 guarantees every replica has the write but any single node failure blocks writes. Cassandra exposes these as consistency levels: ONE, QUORUM, LOCAL_QUORUM for one datacenter, and ALL.\n\nQuorum overlap does not resolve conflicts. Two concurrent writes to the same key both succeed, and the system uses last-write-wins timestamps or version vectors to pick or merge. Read repair fixes stale replicas when a read notices disagreement, and anti-entropy processes compare Merkle trees in the background. Sloppy quorums with hinted handoff let writes succeed on temporary substitute nodes during outages.\n\nInterviewers probe the arithmetic: given N and W, what R is needed, and what happens to each setting when one node is down.",
          problems: [
            {
              title: "Required Read Quorum",
              prompt: "A key is replicated to N = 3 nodes and writes are acknowledged by W = 1 node. What is the minimum R that guarantees a read includes the latest acknowledged write?",
              type: "mcq",
              difficulty: "medium",
              options: ["1", "2", "3", "No value of R can guarantee it"],
              answer: "3",
              explanation: "W plus R must exceed N, so 1 plus R greater than 3 means R must be 3."
            },
            {
              title: "One Node Down",
              prompt: "Cassandra with replication factor 3, writes and reads at QUORUM. One of the three replicas for a key is down. What happens?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Both reads and writes succeed because two of three nodes form a quorum",
                "Writes fail but reads succeed",
                "Reads fail but writes succeed",
                "Both reads and writes fail until the node returns"
              ],
              answer: "Both reads and writes succeed because two of three nodes form a quorum",
              explanation: "QUORUM for N = 3 is 2, and two replicas remain available."
            }
          ]
        }
      ]
    },
    {
      title: "Messaging & Async",
      description: "Decoupling producers from consumers and surviving duplicates.",
      lessons: [
        {
          title: "Message Queues",
          durationMin: 9,
          content: "A message queue sits between a producer and a consumer so they do not need to be available or fast at the same time. The web tier enqueues an email request in a millisecond and moves on; a pool of workers drains the queue at whatever rate the email provider allows. Queues absorb bursts, let you retry failures without involving the user, and let producer and consumer scale independently.\n\nIn a point-to-point queue each message is delivered to one consumer. The consumer receives a message, processes it, and acknowledges it. In SQS the message becomes invisible to others for a visibility timeout, 30 seconds by default, and if the consumer crashes before acknowledging it reappears and is redelivered. That is at-least-once delivery, the default almost everywhere, and it means every handler must tolerate duplicates.\n\nOrdering is a trade-off against throughput. A FIFO queue preserves order within a message group at reduced rate; Kafka preserves order only within a partition. Most systems need ordering per entity, not globally, so they key by that entity.\n\nThe key health metric is consumer lag or queue depth. If it grows for an hour you are producing faster than consuming and latency is quietly turning into hours.\n\nInterviewers probe what happens when a worker dies mid-task and how idempotent handlers make redelivery safe.",
          problems: [
            {
              title: "Crash Before Ack",
              prompt: "A worker receives a message from SQS, processes half of it, and crashes before acknowledging. What happens to the message?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "It is permanently lost",
                "It becomes visible again after the visibility timeout and is delivered to another worker",
                "It is moved immediately to a dead letter queue",
                "SQS waits for the same worker to restart"
              ],
              answer: "It becomes visible again after the visibility timeout and is delivered to another worker",
              explanation: "Unacknowledged messages are redelivered, which is why consumers must be idempotent."
            },
            {
              title: "Why Queue Emails",
              prompt: "Which is the strongest reason to put a queue between the signup endpoint and the welcome-email sender?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Queues encrypt the email content",
                "The signup request returns quickly and bursts and provider failures are absorbed and retried by workers",
                "Queues guarantee exactly-once email delivery",
                "It removes the need for a database"
              ],
              answer: "The signup request returns quickly and bursts and provider failures are absorbed and retried by workers",
              explanation: "Decoupling lets the user-facing path stay fast while slow or flaky downstream work happens asynchronously."
            }
          ]
        },
        {
          title: "Pub/Sub and Fan-Out",
          durationMin: 9,
          content: "Publish-subscribe delivers each message on a topic to every subscriber, unlike a queue where one consumer takes it. An order-placed event can be consumed independently by billing, analytics, inventory, and notifications, and adding a fifth consumer requires no change to the producer. Managed services implement this as a topic that fans out into per-subscriber queues, such as SNS feeding several SQS queues.\n\nKafka generalizes the idea with a durable, partitioned log. Each consumer group reads the entire topic, and within a group partitions are divided among the group's consumers, so the number of partitions caps parallelism. Messages are retained for days regardless of consumption, which allows replay for reprocessing and lets new consumers start from the beginning. A single broker sustains hundreds of thousands of messages per second, and ordering is guaranteed only within a partition, so the partition key must be the entity whose events must stay ordered, such as a customer ID.\n\nPush delivery (the broker calls your endpoint) is simple but can overwhelm a slow subscriber. Pull delivery lets consumers control pace and is what Kafka uses.\n\nInterviewers probe key choice: a bad key like country creates a few giant partitions, while a good key like customer ID spreads load and keeps a customer's events in order.",
          problems: [
            {
              title: "Ordered Per Customer",
              prompt: "Order events must be processed in order for each customer, but 50 consumer instances should share the load. How do you configure Kafka?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "One partition with 50 consumers",
                "Partition the topic with customer ID as the key and run 50 consumers in one consumer group over at least 50 partitions",
                "Fifty topics, one per consumer",
                "Partition by event timestamp"
              ],
              answer: "Partition the topic with customer ID as the key and run 50 consumers in one consumer group over at least 50 partitions",
              explanation: "Keying by customer ID keeps one customer's events in one partition and therefore in order, while partitions spread across consumers."
            },
            {
              title: "Unit of Parallelism",
              prompt: "In Kafka, what is the unit of both parallelism and ordering within a topic? Answer with one word.",
              type: "coding",
              difficulty: "easy",
              answer: "partition",
              explanation: "Each partition is an ordered log consumed by exactly one consumer in a group at a time."
            }
          ]
        },
        {
          title: "Event-Driven Architecture",
          durationMin: 9,
          content: "In an event-driven architecture services publish facts about what happened, such as OrderPlaced or UserEmailChanged, and other services react. Producers do not know who listens, which keeps coupling low and lets teams add behavior without touching the originating service. Events are named in the past tense and are immutable.\n\nThere are three flavors. Event notification carries only an ID and the subscriber fetches details. Event-carried state transfer includes the full data so subscribers can keep their own copy and never call back. Event sourcing stores the events themselves as the system of record and rebuilds state by replaying them, often paired with CQRS, where writes and reads use different models.\n\nThe dual-write problem is the classic failure: a service commits to its database and then crashes before publishing, or publishes and then fails to commit. Two-phase commit between a database and a broker is impractical, so you use the transactional outbox or change data capture, where a tool like Debezium tails the database's replication log and emits events for every committed change. CDC is also the standard way to keep a search index or cache in sync with the primary database without application code.\n\nInterviewers probe debuggability: tracing one request across six asynchronous hops requires a correlation ID carried in every event, and schema changes require a registry and backward-compatible evolution.",
          problems: [
            {
              title: "Crash Between Write and Publish",
              prompt: "A service writes an order to its database and then publishes an OrderPlaced event, but may crash between the two steps. Which approach fixes the inconsistency?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Two-phase commit between the database and the message broker",
                "Transactional outbox with a relay that publishes committed rows",
                "Publish the event first, then write to the database",
                "Retry the publish in a loop until it succeeds"
              ],
              answer: "Transactional outbox with a relay that publishes committed rows",
              explanation: "The event is written atomically with the order, and the relay guarantees it is eventually published."
            },
            {
              title: "Keep the Index in Sync",
              prompt: "You need Elasticsearch to reflect every committed change in PostgreSQL with minimal application code. Which approach fits?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Change data capture tailing the database replication log",
                "A nightly full re-index",
                "Having every API endpoint also write to Elasticsearch",
                "Sticky sessions"
              ],
              answer: "Change data capture tailing the database replication log",
              explanation: "CDC turns committed changes into a stream without touching application code and avoids the dual-write problem."
            }
          ]
        },
        {
          title: "Idempotency and Exactly-Once Delivery",
          durationMin: 10,
          content: "Delivery guarantees come in three flavors. At-most-once fires and forgets, so messages can be lost. At-least-once retries until acknowledged, so messages can be duplicated. Exactly-once delivery across a network is impossible in general, because an acknowledgment can be lost after a message was processed and the sender cannot tell the difference. What you can achieve is exactly-once processing: at-least-once delivery combined with consumers that make duplicates harmless.\n\nAn operation is idempotent if applying it many times has the same effect as applying it once. Setting a balance to 100 is idempotent; adding 10 is not. Many operations can be rewritten this way, but for the rest you deduplicate: the producer attaches a unique idempotency key, the consumer records processed keys in a store with a TTL, and a repeated key is acknowledged without re-executing. Storing the key and the result in the same database transaction as the side effect closes the gap, and a unique constraint on the key protects against two duplicates arriving concurrently.\n\nPayments are the canonical case. A charge request carries an idempotency key; the server stores the response under that key and returns it unchanged on any retry.\n\nInterviewers probe the dedup store: how large it grows, how long keys must live, and what happens if a duplicate arrives after the key expires.",
          problems: [
            {
              title: "Naturally Idempotent",
              prompt: "Which of these operations is naturally idempotent without any deduplication?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Add 10 to the account balance",
                "Set the account balance to 100",
                "Append a line to the audit log",
                "Send a welcome email"
              ],
              answer: "Set the account balance to 100",
              explanation: "Repeating an absolute set produces the same end state, while the others accumulate side effects on each repeat."
            },
            {
              title: "Name the Property",
              prompt: "What property guarantees that applying the same request multiple times has the same effect as applying it once? Answer with the one-word noun ending in -ency.",
              type: "coding",
              difficulty: "easy",
              answer: "idempotency",
              explanation: "Idempotency makes at-least-once delivery safe because duplicates do not change the outcome."
            }
          ]
        },
        {
          title: "Dead Letter Queues and Backpressure",
          durationMin: 9,
          content: "A poison message is one that fails every time it is processed, perhaps because its JSON is malformed or it references a deleted record. Without special handling it is redelivered forever, blocking the queue and burning worker time. The standard answer is a maximum receive count, typically three to five, after which the broker moves the message to a dead letter queue. Alert on the DLQ, inspect messages there, fix the bug, and replay them. A DLQ is not a trash can; it is a queue of work you still owe.\n\nBackpressure is the problem of producers outrunning consumers. A queue hides the mismatch briefly, but an unbounded queue just converts overload into growing latency, and in memory it eventually crashes the broker. Durable logs like Kafka buffer for days, so the symptom is consumer lag climbing steadily. The responses are to scale consumers, make each consumer faster through batching, shed low-priority work, or push back on producers with bounded queues that block or reject when full, which is how TCP flow control works.\n\nA related trap is retrying failures without backoff inside the consumer, which turns a downstream slowdown into a storm.\n\nInterviewers probe how you notice the problem, which is a lag or queue-age alert, and whether you choose to drop, delay, or scale when it fires.",
          problems: [
            {
              title: "Poison Message",
              prompt: "A message with malformed JSON crashes the consumer every time it is delivered, and other messages behind it are delayed. What is the right fix?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Increase the visibility timeout",
                "Set a maximum receive count and route the message to a dead letter queue after that many failures",
                "Delete the queue and recreate it",
                "Retry the message with no limit"
              ],
              answer: "Set a maximum receive count and route the message to a dead letter queue after that many failures",
              explanation: "The DLQ isolates the bad message for inspection while the rest of the queue continues to flow."
            },
            {
              title: "Lag Keeps Growing",
              prompt: "Consumer lag on a Kafka topic has been rising steadily for an hour while the producer rate is normal. What is the most appropriate first response?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Reduce the topic retention period",
                "Add consumers up to the partition count or speed up per-message processing",
                "Increase the number of producers",
                "Delete the oldest messages"
              ],
              answer: "Add consumers up to the partition count or speed up per-message processing",
              explanation: "Steadily rising lag means consumption throughput is below production, so you must raise consumer capacity."
            }
          ]
        }
      ]
    },
    {
      title: "Reliability & Observability",
      description: "Surviving failures and seeing what the system is actually doing.",
      lessons: [
        {
          title: "Retries with Exponential Backoff",
          durationMin: 9,
          content: "Many failures are transient: a dropped packet, a node mid-restart, a brief overload. A retry turns a visible error into a short delay. But naive retries are dangerous: if a dependency slows down and every client retries three times immediately, the dependency now faces four times its normal load exactly when it can least handle it, and the retry storm keeps it down.\n\nExponential backoff waits longer after each failure, for example 100 ms, then 200, 400, 800, capped at a few seconds. Jitter randomizes each wait so thousands of clients that failed at the same moment do not retry in synchronized waves; full jitter picks a random delay between zero and the backoff value. A retry budget caps retries at, say, 10 percent of normal traffic so a bad period cannot amplify load.\n\nOnly retry what is safe and sensible. Idempotent operations and errors that signal transience (timeouts, 503, 429, connection resets) qualify; a 400 or a 404 will fail identically every time. Give each attempt its own timeout and propagate an overall deadline so a request does not retry past the point where the user has given up.\n\nInterviewers probe retries stacked across layers. If the client, the gateway, and the service each make up to three attempts, the database can see 27 attempts for one user action.",
          problems: [
            {
              title: "Stacked Retries",
              prompt: "The mobile client, the API gateway, and the backend service each make up to 3 attempts for a request. In the worst case, how many attempts can the database see for one user action?",
              type: "mcq",
              difficulty: "medium",
              options: ["3", "9", "27", "81"],
              answer: "27",
              explanation: "Attempts multiply across layers: 3 times 3 times 3 equals 27."
            },
            {
              title: "Why Jitter",
              prompt: "Why is random jitter added to exponential backoff?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "To make requests arrive faster",
                "To prevent many clients that failed at the same moment from retrying in synchronized waves",
                "To make backoff times easier to log",
                "To reduce the total number of retries to one"
              ],
              answer: "To prevent many clients that failed at the same moment from retrying in synchronized waves",
              explanation: "Without jitter, a mass failure produces mass simultaneous retries that re-trigger the overload."
            }
          ]
        },
        {
          title: "Circuit Breakers and Bulkheads",
          durationMin: 9,
          content: "A circuit breaker protects a caller from a failing dependency. In the closed state calls flow normally while the breaker tracks outcomes over a sliding window. If failures exceed a threshold, say 50 percent of at least 20 requests in the last 10 seconds, it opens: calls fail immediately without touching the dependency, returning an error or a fallback such as cached data or a default. After a cooldown of around 30 seconds it enters half-open and lets a small number of trial requests through; if they succeed it closes, if they fail it opens again.\n\nThe benefit is twofold. The dependency gets breathing room to recover instead of being hammered, and the caller stops burning threads and connections waiting on timeouts, which is what otherwise cascades the failure upstream.\n\nA bulkhead isolates resources per dependency, named after the compartments that keep a ship afloat. If calls to the recommendation service use their own thread pool and connection pool of fixed size, a hang in recommendations exhausts only that pool, and calls to payments continue. Without bulkheads one slow dependency consumes every thread in the server.\n\nTimeouts underpin both patterns: a call without a timeout can hang forever and no breaker will ever observe a failure.\n\nInterviewers probe what the fallback is, because failing fast with nothing to show the user is only slightly better than hanging.",
          problems: [
            {
              title: "Half-Open Behavior",
              prompt: "What does a circuit breaker do in the half-open state?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Rejects all calls indefinitely",
                "Lets a limited number of trial calls through to test whether the dependency has recovered",
                "Doubles the timeout for every call",
                "Routes calls to a different data center"
              ],
              answer: "Lets a limited number of trial calls through to test whether the dependency has recovered",
              explanation: "Trial success closes the breaker; trial failure reopens it for another cooldown."
            },
            {
              title: "Isolate the Pools",
              prompt: "Which pattern gives each dependency its own thread or connection pool so one hanging dependency cannot exhaust resources shared with the others? Answer with one word.",
              type: "coding",
              difficulty: "medium",
              answer: "bulkhead",
              explanation: "Bulkheads compartmentalize resources so a failure stays contained to one dependency's pool."
            }
          ]
        },
        {
          title: "Rate Limiting Algorithms",
          durationMin: 10,
          content: "Rate limiting protects a service from abuse, runaway clients, and unfair usage by capping requests per client per time window. Exceeded requests receive 429 with a Retry-After header. The algorithm determines how bursts are handled.\n\nToken bucket holds up to a capacity of tokens and refills at a fixed rate; each request takes one token. It permits short bursts up to the bucket size while enforcing the average rate, which matches how real clients behave, and it is the most common choice. Leaky bucket drains at a constant rate regardless of input and is used when the downstream needs perfectly smooth traffic.\n\nFixed window counts requests per calendar minute. It is trivial but allows a client to send the full limit at 12:00:59 and again at 12:01:00, twice the intended rate across a 60-second span. Sliding window log stores every request timestamp for exact enforcement at high memory cost. Sliding window counter weights the previous window's count by how much of it overlaps the current one, giving a close approximation with two integers per client.\n\nDistributed limiters keep counters in Redis using atomic INCR with EXPIRE or a Lua script, since a separate read then write lets two gateway nodes both admit the last request.\n\nInterviewers probe the fixed-window burst arithmetic and where the limiter lives: at the edge, per service, or both.",
          problems: [
            {
              title: "Fixed Window Burst",
              prompt: "A fixed-window limiter allows 100 requests per minute. What is the maximum number of requests a client can get accepted within some 60-second span?",
              type: "mcq",
              difficulty: "medium",
              options: ["100", "150", "200", "300"],
              answer: "200",
              explanation: "The client can send 100 at the end of one window and 100 at the start of the next, 200 within about a second."
            },
            {
              title: "Bursty but Fair",
              prompt: "Which algorithm permits short bursts above the steady rate while still enforcing the long-term average?",
              type: "mcq",
              difficulty: "easy",
              options: ["Leaky bucket", "Token bucket", "Fixed window", "Round robin"],
              answer: "Token bucket",
              explanation: "Accumulated tokens allow a burst up to the bucket capacity, and the refill rate bounds the average."
            }
          ]
        },
        {
          title: "Structured Logging and Distributed Tracing",
          durationMin: 9,
          content: "Logs are the record of discrete events. Structured logging emits each event as JSON with named fields such as level, service, user_id, and latency_ms, so a central system like Elasticsearch, Loki, or a cloud log service can filter and aggregate instead of regex-matching prose. Levels keep volume manageable, and at high traffic you sample debug and info logs because log storage can cost more than the compute it describes. Never log secrets, tokens, or full card numbers.\n\nThe single most valuable field is a correlation ID, generated at the edge for each incoming request and passed through every downstream call in a header and every log line. With it you can pull the complete story of one user's request across six services in one query.\n\nDistributed tracing formalizes this. A trace represents one request; it is made of spans, each a timed operation with a parent, so you see that checkout spent 40 ms in the gateway, 1,800 ms waiting on the inventory service, and 30 ms in the database. OpenTelemetry is the standard instrumentation and the W3C traceparent header carries trace context between services. Because tracing every request is expensive, you sample, typically 1 to 10 percent, while always keeping traces for errors and slow requests.\n\nInterviewers probe how you would find why 1 percent of checkouts take five seconds: trace those requests and compare span durations.",
          problems: [
            {
              title: "Find the Slow Hop",
              prompt: "p99 checkout latency is 5 seconds and the request passes through 8 services. What is the fastest way to find which hop is slow?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Read each service's log files by hand",
                "Distributed tracing showing per-span durations for slow requests",
                "Add more servers to every service",
                "Increase the request timeout"
              ],
              answer: "Distributed tracing showing per-span durations for slow requests",
              explanation: "A trace breaks one slow request into timed spans, pointing directly at the hop that consumed the time."
            },
            {
              title: "Join the Logs",
              prompt: "What lets you query all log lines produced by six different services for a single user request?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Matching on timestamps within a second",
                "A correlation ID generated at the edge and propagated through every call and log line",
                "Using the same log level everywhere",
                "Writing all services to one log file"
              ],
              answer: "A correlation ID generated at the edge and propagated through every call and log line",
              explanation: "A shared identifier is the only reliable way to stitch events from independent services into one story."
            }
          ]
        },
        {
          title: "Metrics, SLOs, and Alerting",
          durationMin: 10,
          content: "Metrics are numeric time series that are cheap to store and fast to query, which makes them the backbone of dashboards and alerts. The three types are counters that only increase (requests served), gauges that go up and down (queue depth, memory), and histograms that record a distribution (latency) so you can compute p50, p95, and p99. For any service, track the RED signals: rate, errors, and duration. For any resource, track USE: utilization, saturation, and errors. Prometheus-style systems scrape metrics on a pull basis; keep label cardinality low, because a user ID label creates millions of series and melts the server.\n\nAn SLI is a measured indicator such as the fraction of requests under 300 ms. An SLO is a target over a window, like 99.9 percent over 30 days. The error budget is what the SLO allows you to fail: at 99.9 percent that is about 43 minutes of full outage per 30-day month, or a lot more partial degradation. Teams spend the budget on risky deploys and freeze releases when it runs out.\n\nAlert on symptoms the user feels, such as elevated error rate or latency, not on causes like CPU at 80 percent. Burn-rate alerts page when the budget is being consumed much faster than the window allows.\n\nInterviewers probe whether you can write a concrete SLO for the system you just designed.",
          problems: [
            {
              title: "Monthly Error Budget",
              prompt: "A service has an availability SLO of 99.9% over a 30-day window. Approximately how much total downtime does the error budget allow in that month?",
              type: "mcq",
              difficulty: "easy",
              options: ["About 4 minutes", "About 43 minutes", "About 7 hours", "About 3 days"],
              answer: "About 43 minutes",
              explanation: "A 30-day month has 43,200 minutes and 0.1% of that is 43.2 minutes."
            },
            {
              title: "Distribution Metric",
              prompt: "Which metric type records a distribution of observed values, such as request latencies, so percentiles can be computed? Answer with one word.",
              type: "coding",
              difficulty: "easy",
              answer: "histogram",
              explanation: "A histogram buckets observations by value, which is what makes p95 and p99 queries possible."
            }
          ]
        }
      ]
    },
    {
      title: "Security & Auth",
      description: "Identity, tokens, and the basics interviewers expect you to get right.",
      lessons: [
        {
          title: "Authentication vs Authorization",
          durationMin: 8,
          content: "Authentication establishes who the caller is: a password, a one-time code, a signed token, a client certificate. Authorization decides what that identity may do: read this order, delete that project, call this admin endpoint. The HTTP codes reflect the split: 401 means credentials are missing or invalid, 403 means the identity is known but not permitted.\n\nAuthorization models scale differently. Access control lists attach permissions to each resource and suit sharing a document with specific people. Role-based access control assigns users to roles such as viewer, editor, and admin, and is the default for internal tools. Attribute-based access control evaluates policies over attributes of the user, resource, and context, which handles rules like managers may approve expenses under 5,000 in their own department.\n\nPlace the checks deliberately. An API gateway can authenticate every request once and attach the identity, but authorization must happen in the service that understands the resource. The most common real-world bug is a missing object-level check: a logged-in user requests /orders/12345, the server verifies the token, and returns someone else's order. This is called an insecure direct object reference or broken object level authorization.\n\nInterviewers probe service-to-service identity, usually mutual TLS or short-lived signed tokens, and the principle of least privilege for every component.",
          problems: [
            {
              title: "Someone Else's Order",
              prompt: "A logged-in user requests /orders/12345, which belongs to a different user, and the API returns it. Which category of failure is this?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Authentication failure",
                "Authorization failure (missing object-level check)",
                "Transport encryption failure",
                "Rate limiting failure"
              ],
              answer: "Authorization failure (missing object-level check)",
              explanation: "The user was correctly identified but the service never verified they were allowed to see that specific resource."
            },
            {
              title: "Known but Forbidden",
              prompt: "A request carries a valid token but the user lacks permission for the action. Which status code is correct?",
              type: "mcq",
              difficulty: "easy",
              options: ["401", "403", "404", "422"],
              answer: "403",
              explanation: "403 Forbidden signals a recognized identity that is not permitted; 401 is for missing or invalid credentials."
            }
          ]
        },
        {
          title: "Sessions, JWTs, and Token Storage",
          durationMin: 10,
          content: "After login the server must recognize the user on later requests. A server-side session stores user state in Redis or a database under a random opaque ID placed in a cookie. Each request costs one sub-millisecond lookup, and revocation is trivial: delete the row. Logging a user out everywhere, or responding to a stolen laptop, is one command.\n\nA JSON Web Token is self-contained: the server signs a payload with claims such as user ID, roles, and expiry, and any service with the public key verifies it without a lookup. The payload is base64-encoded, not encrypted, so never put secrets in it. The drawback is revocation: a valid JWT works until it expires. The standard mitigation is a short-lived access token of about 15 minutes paired with a longer-lived refresh token stored server-side, which can be revoked and should be rotated on each use. A denylist or a per-user token version in the database provides immediate revocation when needed.\n\nWhere the client keeps the token matters. A cookie with HttpOnly, Secure, and SameSite attributes is unreadable by JavaScript, which blocks XSS theft, but needs CSRF protection. A token in localStorage avoids CSRF but is exposed to any injected script.\n\nInterviewers probe how you log out a user everywhere with stateless JWTs and why 15 minutes is a common access token lifetime.",
          problems: [
            {
              title: "Revoke Everything Now",
              prompt: "A user reports a stolen laptop and every active session must be invalidated immediately. Which design makes this a single trivial operation?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Stateless JWTs with a 24-hour expiry",
                "Server-side sessions stored in Redis keyed by session ID",
                "Tokens stored in the browser's localStorage",
                "Basic authentication on every request"
              ],
              answer: "Server-side sessions stored in Redis keyed by session ID",
              explanation: "Deleting the user's session records ends every session instantly, whereas a stateless JWT stays valid until it expires."
            },
            {
              title: "Block Script Access",
              prompt: "Which cookie attribute prevents JavaScript on the page from reading the session cookie?",
              type: "mcq",
              difficulty: "easy",
              options: ["Secure", "HttpOnly", "SameSite", "Path"],
              answer: "HttpOnly",
              explanation: "HttpOnly cookies are sent with requests but are invisible to document.cookie, which blunts XSS token theft."
            }
          ]
        },
        {
          title: "OAuth 2.0 and OpenID Connect",
          durationMin: 10,
          content: "OAuth 2.0 is a delegation protocol: it lets an application act on a user's behalf against another service without ever seeing the user's password. The roles are the resource owner (the user), the client (your app), the authorization server (which issues tokens), and the resource server (the API being accessed). Scopes such as read:calendar limit what the token can do.\n\nThe authorization code flow is the one to know. The client redirects the user to the authorization server, the user consents, the server redirects back with a short-lived code, and the client exchanges that code for an access token over a back channel. PKCE adds a one-time secret so a public client such as a mobile app or single-page app cannot have its code intercepted and exchanged by an attacker; it is now recommended for every client, and the older implicit flow that returned tokens in the URL fragment is deprecated. The client credentials flow covers service-to-service calls with no user involved.\n\nOAuth alone does not tell you who the user is; an access token is an opaque capability. OpenID Connect layers an identity token, a signed JWT with claims like subject and email, plus a userinfo endpoint on top of OAuth. Sign in with Google is OIDC.\n\nInterviewers probe why tokens must not travel in URLs, which leak through logs and referrers, and why refresh tokens must be stored securely.",
          problems: [
            {
              title: "Mobile Sign-In Flow",
              prompt: "A native mobile app implements Sign in with Google. Which flow should it use?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Implicit flow",
                "Authorization code flow with PKCE",
                "Resource owner password credentials",
                "Client credentials flow"
              ],
              answer: "Authorization code flow with PKCE",
              explanation: "PKCE protects public clients that cannot keep a secret, and the implicit flow is deprecated because it exposes tokens in the URL."
            },
            {
              title: "Identity Layer",
              prompt: "Which standard adds an ID token and a standardized way to learn who the user is on top of OAuth 2.0? Answer with its four-letter acronym.",
              type: "coding",
              difficulty: "easy",
              answer: "oidc",
              explanation: "OpenID Connect turns OAuth's delegation into an authentication protocol with signed identity claims."
            }
          ]
        },
        {
          title: "TLS, Hashing, and Secrets Management",
          durationMin: 9,
          content: "Data in transit is protected by TLS. Clients verify the server's certificate against a chain of trust, and the handshake establishes a session key; TLS 1.3 does this in one round trip. TLS is usually terminated at the load balancer or CDN, and traffic inside the network is increasingly re-encrypted with mutual TLS so services authenticate each other with certificates.\n\nPasswords are never encrypted, because anything encrypted can be decrypted. They are hashed with an algorithm designed to be slow: bcrypt, scrypt, or Argon2, tuned so one hash costs around 100 ms, with a unique random salt per user so identical passwords produce different hashes and precomputed tables are useless. General-purpose hashes like SHA-256 are the wrong tool because a GPU computes billions per second.\n\nData at rest is encrypted with AES-256, and the keys live in a key management service, not alongside the data. Envelope encryption is the standard pattern: each object is encrypted with its own data key, and that data key is encrypted with a master key held in the KMS, so rotating the master key never requires re-encrypting the data.\n\nApplication secrets such as database passwords and API keys belong in a secrets manager with audit logs and rotation, injected at runtime, never committed to source control.\n\nInterviewers probe the difference between hashing and encryption and where exactly the keys are stored.",
          problems: [
            {
              title: "Store the Password",
              prompt: "Which approach is appropriate for storing user passwords?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "AES-256 encryption with a key in the application config",
                "A single unsalted SHA-256 hash",
                "bcrypt or Argon2 with a unique salt per user and a tuned work factor",
                "Base64 encoding"
              ],
              answer: "bcrypt or Argon2 with a unique salt per user and a tuned work factor",
              explanation: "A slow salted hash makes offline guessing expensive and ensures identical passwords do not share a hash."
            },
            {
              title: "Envelope Encryption",
              prompt: "In envelope encryption, what does the master key held in the KMS actually encrypt?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Every object directly",
                "The per-object data keys",
                "The TLS certificate",
                "The user's password hash"
              ],
              answer: "The per-object data keys",
              explanation: "Data is encrypted with data keys, and only those small keys are wrapped by the master key, so rotation is cheap."
            }
          ]
        },
        {
          title: "API Security and Input Validation",
          durationMin: 9,
          content: "Every byte that crosses the trust boundary is hostile until validated. Enforce types, lengths, ranges, and allowed values at the edge with a schema, and reject the rest with a 400. SQL injection is defeated by parameterized queries, which send the query and the data separately so input can never become code; string concatenation is never acceptable. Cross-site scripting is defeated by encoding output for the context it is rendered in and by a content security policy. Cross-site request forgery is defeated by SameSite cookies and anti-CSRF tokens on state-changing requests.\n\nProtect the endpoints attackers love. Login and password reset need aggressive rate limiting and lockouts to stop credential stuffing. Enumeration leaks are subtle: a message saying that email is already registered tells an attacker which accounts exist.\n\nWebhooks that partners send to you need authenticity checks. The standard is an HMAC signature: the sender computes a hash of the body with a shared secret and sends it in a header, and you recompute and compare in constant time. Including a timestamp in the signed payload and rejecting messages older than five minutes prevents replay.\n\nRun services and database users with least privilege, keep secrets out of logs and URLs, and put a web application firewall in front of public endpoints for known attack patterns.\n\nInterviewers probe how you would secure an incoming webhook and how you prevent injection at the data layer.",
          problems: [
            {
              title: "Verify the Webhook",
              prompt: "A payment provider sends webhooks to your public endpoint. How do you verify each one is genuine and not replayed?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Check that the request came over HTTPS",
                "Verify an HMAC signature of the body computed with a shared secret and reject timestamps older than a few minutes",
                "Check the User-Agent header matches the provider",
                "Accept only requests containing valid JSON"
              ],
              answer: "Verify an HMAC signature of the body computed with a shared secret and reject timestamps older than a few minutes",
              explanation: "Only the holder of the shared secret can produce a valid signature, and the timestamp bound defeats replay of captured requests."
            },
            {
              title: "Stop SQL Injection",
              prompt: "Which technique most reliably prevents SQL injection?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "Escaping single quotes in user input",
                "Parameterized queries that send data separately from the query text",
                "A web application firewall alone",
                "Limiting input length to 255 characters"
              ],
              answer: "Parameterized queries that send data separately from the query text",
              explanation: "When data is bound as parameters it can never be parsed as SQL, regardless of its content."
            }
          ]
        }
      ]
    },
    {
      title: "Classic Interview Designs",
      description: "Putting the building blocks together on the problems interviewers actually ask.",
      lessons: [
        {
          title: "Designing a URL Shortener",
          durationMin: 11,
          content: "Start with numbers. Assume 100 million new URLs per month, about 40 writes per second, and a 100 to 1 read ratio giving 4,000 redirects per second. At roughly 500 bytes per record, five years of data is 100 million times 60 months times 500 bytes, about 3 TB, which fits a single key-value store or a modestly sharded relational table.\n\nThe core question is how to generate short keys. Seven base62 characters give 62 to the power of 7, about 3.5 trillion combinations, far more than you will ever need. Hashing the long URL with MD5 and truncating to seven characters is tempting but produces collisions you must detect and retry. The cleaner approach is a unique integer ID encoded in base62: a database auto-increment, a Snowflake-style generator combining timestamp, machine ID, and sequence, or a ticket server that hands out ranges of IDs to each application node so no request waits on a central counter.\n\nRedirects use 301 if you want browsers to cache and never return, or 302 if you want every click to reach your servers for analytics. Reads are heavily skewed, so cache the hottest keys in Redis with a hit ratio well above 90 percent. Custom aliases, expiry times, and rate limiting on creation round out the design.\n\nInterviewers probe collisions, distributed ID generation, and why analytics changes your redirect status code.",
          problems: [
            {
              title: "301 or 302",
              prompt: "Why would a URL shortener choose a 302 redirect over a 301?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "302 is faster for the browser",
                "302 is not cached by browsers, so every click reaches the server and can be counted",
                "301 is not supported on mobile",
                "302 shortens the URL further"
              ],
              answer: "302 is not cached by browsers, so every click reaches the server and can be counted",
              explanation: "A 301 is cached permanently, so repeat clicks bypass your servers and are invisible to analytics."
            },
            {
              title: "Key Space Size",
              prompt: "How many unique keys can six base62 characters represent?",
              type: "mcq",
              difficulty: "medium",
              options: ["About 2 billion", "About 57 billion", "About 3.5 trillion", "About 1 million"],
              answer: "About 57 billion",
              explanation: "62 to the power of 6 is about 56.8 billion; seven characters gives about 3.5 trillion."
            }
          ]
        },
        {
          title: "Designing a Chat System",
          durationMin: 12,
          content: "A chat system needs low-latency delivery, durable history, and correct ordering. Clients hold a WebSocket to a chat server, which makes those servers stateful: a connection registry in Redis maps each user ID to the server holding their socket, with entries refreshed by heartbeats and expired after about 30 seconds so presence is also derived from it.\n\nThe send path is: client sends to its chat server, the server persists the message, then looks up the recipient's server in the registry and forwards it, or publishes to a pub/sub channel the recipient's server subscribes to. If the recipient is offline the message waits in storage and a push notification is sent. Delivery and read receipts are small messages flowing the other way.\n\nStorage is write-heavy and read by conversation in time order, so a wide-column store keyed by conversation ID with a time-ordered message ID as the clustering column fits well. Assigning message IDs on the server, for example with Snowflake, gives a consistent order per conversation across devices. Each device keeps a cursor of the last message it has seen so multi-device sync is a range read since that cursor.\n\nGroup chats fan out one message to every member's server, which is why groups cap membership at a few hundred to a few thousand.\n\nInterviewers probe end-to-end encryption, ordering guarantees across devices, and what happens when a chat server crashes with 200,000 open connections.",
          problems: [
            {
              title: "Message Storage",
              prompt: "You must store one billion chat messages per day and always read them by conversation in time order. Which storage design fits best?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "A single relational table indexed on message text",
                "A wide-column store partitioned by conversation ID with a time-ordered message ID as the clustering key",
                "Object storage with one file per message",
                "An in-memory cache with no persistence"
              ],
              answer: "A wide-column store partitioned by conversation ID with a time-ordered message ID as the clustering key",
              explanation: "Writes append to one partition and reads are a sequential range scan, which matches the access pattern exactly."
            },
            {
              title: "Chat Transport",
              prompt: "Which protocol provides a persistent full-duplex connection over a single TCP socket and is the standard transport for real-time chat? Answer with the singular protocol name as one word.",
              type: "coding",
              difficulty: "easy",
              answer: "websocket",
              explanation: "A WebSocket is upgraded from an HTTP request and then carries bidirectional frames with minimal overhead."
            }
          ]
        },
        {
          title: "Designing a News Feed",
          durationMin: 12,
          content: "A feed shows a user recent posts from the accounts they follow, ranked. The design hinges on when you do the work. With fan-out on write, the moment someone posts, a worker writes the post ID into the feed cache of every follower, typically a Redis list capped at a few hundred to a thousand entries. Reading a feed is then one cache read, extremely fast. The cost is write amplification: a user with 20 million followers triggers 20 million cache writes per post, which takes minutes and wastes effort on followers who never log in.\n\nWith fan-out on read, nothing happens at post time. When a user opens the app, the service fetches the recent posts of everyone they follow and merges them. Writes are free but reads are slow and scale with the number of followees.\n\nProduction systems use a hybrid: push for ordinary accounts and pull for celebrities above a threshold such as 10,000 followers, merging the celebrity posts in at read time. Skip fan-out entirely for users inactive for 30 days and rebuild their feed on demand.\n\nThe feed cache stores only post IDs and timestamps. A separate post cache holds the content, and a ranking service scores the candidates before hydration.\n\nInterviewers probe the celebrity problem, consistency when a post is deleted after fan-out, and how you estimate the cache memory for 100 million users.",
          problems: [
            {
              title: "Celebrity Post",
              prompt: "An account with 20 million followers publishes a post. Which strategy handles this efficiently?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Pure fan-out on write to all 20 million feed caches",
                "A hybrid: fan-out on write for ordinary accounts and fan-out on read for high-follower accounts, merged at read time",
                "Disable posting for accounts over 1 million followers",
                "Store the post in every follower's database row"
              ],
              answer: "A hybrid: fan-out on write for ordinary accounts and fan-out on read for high-follower accounts, merged at read time",
              explanation: "Pulling celebrity posts at read time avoids tens of millions of writes per post while keeping normal feeds precomputed."
            },
            {
              title: "What the Feed Cache Holds",
              prompt: "What should each user's precomputed feed cache contain?",
              type: "mcq",
              difficulty: "easy",
              options: [
                "The full rendered HTML of the feed",
                "Post IDs with timestamps, hydrated from a separate post cache at read time",
                "Copies of every follower's profile",
                "The user's password hash"
              ],
              answer: "Post IDs with timestamps, hydrated from a separate post cache at read time",
              explanation: "Storing only IDs keeps the per-user list tiny and ensures edits or deletions of a post are reflected everywhere."
            }
          ]
        },
        {
          title: "Designing a Distributed Rate Limiter",
          durationMin: 11,
          content: "The requirement is to limit each user or API key to, say, 1,000 requests per minute across a fleet of 20 API gateway nodes, with low added latency and accurate enforcement. If each node kept its own counters, a client spread across all nodes could get 20 times the intended limit, so the counters must be shared.\n\nRedis is the usual home. A sliding window counter needs two integers per client per rule, so 10 million active clients cost well under a few gigabytes. The check-and-increment must be atomic: if two gateway nodes both read 999, both admit the request, and both write 1,000, the limit is silently exceeded. Use INCR followed by EXPIRE on first creation, or a Lua script that reads, decides, and increments in one step. The Redis round trip adds about a millisecond, and the keyspace shards naturally by client ID across a Redis Cluster.\n\nDecide what happens when Redis is unreachable. Failing open keeps the product available but unprotected; failing closed protects the backend but turns a cache outage into a user-facing outage. Many teams fail open with a local fallback limiter. For very high throughput, each node can keep a local token bucket and sync with Redis every 100 ms, trading a little accuracy for a cheaper hot path.\n\nRejected requests get 429, Retry-After, and headers reporting the limit and remaining quota.\n\nInterviewers probe the race condition, the failure mode, and clock skew between nodes.",
          problems: [
            {
              title: "Both Nodes Admit",
              prompt: "Two gateway nodes read a client's counter as 999 at the same moment, both admit the request, and both write 1000, exceeding a limit of 1000. What is the fix?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Use a longer TTL on the counter",
                "Perform the read, decision, and increment atomically with INCR or a Lua script in Redis",
                "Run only one gateway node",
                "Store the counter in each node's local memory"
              ],
              answer: "Perform the read, decision, and increment atomically with INCR or a Lua script in Redis",
              explanation: "An atomic operation ensures the two requests are serialized so the second one sees the first's increment."
            },
            {
              title: "Local Counters Only",
              prompt: "A per-user limit of 100 requests per minute is enforced using only local in-memory counters on each of 20 gateway nodes. What is the effective limit a client can achieve?",
              type: "mcq",
              difficulty: "easy",
              options: ["100 per minute", "Up to 2,000 per minute", "5 per minute", "Unlimited"],
              answer: "Up to 2,000 per minute",
              explanation: "Each node independently allows 100, so a client whose requests spread across all 20 nodes gets 20 times the intended limit."
            }
          ]
        },
        {
          title: "Designing a Notification System",
          durationMin: 11,
          content: "A notification system takes events from many producers and delivers them to users through push (APNs for iOS, FCM for Android), SMS via a provider like Twilio, and email via a provider like SES, while respecting preferences and never spamming. At 10 million notifications a day the average is about 115 per second, but a marketing campaign can inject a million in a minute, so the design must absorb bursts.\n\nThe pipeline is: a producer calls the notification service with an event, the service checks the user's preferences and opt-outs, applies per-user rate limits such as no more than five promotional messages per day and quiet hours, renders the template, and enqueues one message per channel. Channel-specific workers consume their queue, call the third-party provider with its own rate limits and retries, and record delivery status. A device token registry maps users to their current push tokens and prunes tokens the provider reports as invalid.\n\nReliability comes from the queues. Workers retry transient provider errors with backoff, and messages that exhaust retries land in a dead letter queue for inspection and replay. Because delivery is at-least-once, each notification carries an idempotency key derived from the event, user, and channel, and workers check it before sending so a crash after sending but before acknowledging does not produce a duplicate text message.\n\nInterviewers probe deduplication, priority queues so a security alert is not stuck behind a marketing blast, and analytics on open rates.",
          problems: [
            {
              title: "Duplicate Text Message",
              prompt: "A worker sends an SMS, then crashes before acknowledging the queue message. On redelivery another worker sends the same SMS again. How do you prevent this?",
              type: "mcq",
              difficulty: "medium",
              options: [
                "Increase the visibility timeout to one hour",
                "Record a per-notification idempotency key in a shared store and skip sending when the key already exists",
                "Send all SMS messages synchronously from the API server",
                "Lower the retry limit to zero"
              ],
              answer: "Record a per-notification idempotency key in a shared store and skip sending when the key already exists",
              explanation: "Checking and recording the key around the send makes at-least-once delivery safe for a side effect that cannot be undone."
            },
            {
              title: "Failed After Retries",
              prompt: "Which queue holds notifications that failed after all retries so they can be inspected and replayed? Answer with the common three-letter abbreviation.",
              type: "coding",
              difficulty: "easy",
              answer: "dlq",
              explanation: "A dead letter queue isolates permanently failing messages without losing them."
            }
          ]
        }
      ]
    }
  ]
};
