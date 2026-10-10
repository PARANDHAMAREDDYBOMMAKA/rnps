import type { SeedModule } from "../types.ts";

export const m03: SeedModule = {
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
        },
        {
          title: "Mixed Hardware",
          prompt: "A pool has two 32-core servers and four 16-core servers. Which simple algorithm sends the larger servers proportionally more traffic?",
          type: "mcq",
          difficulty: "easy",
          options: ["Plain round robin", "Weighted round robin", "IP hash", "Random"],
          answer: "Weighted round robin",
          explanation: "Weights let the balancer send the 32-core boxes twice as many requests as the 16-core boxes."
        },
        {
          title: "Slow Node Under Round Robin",
          prompt: "One backend in a round-robin pool becomes slow but still responds. What happens?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Round robin automatically skips it",
            "It keeps receiving its full share and its queue of pending requests grows",
            "The load balancer restarts it",
            "Clients are redirected to a different region"
          ],
          answer: "It keeps receiving its full share and its queue of pending requests grows",
          explanation: "Round robin is oblivious to backend load, so a slow node accumulates work until health checks or a smarter algorithm intervenes."
        },
        {
          title: "Power of Two Choices",
          prompt: "What does the power of two choices algorithm do?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Sends every request to two backends and uses the first response",
            "Picks two backends at random and routes to the less loaded one",
            "Doubles the pool size when load exceeds 50%",
            "Hashes the request twice for better distribution"
          ],
          answer: "Picks two backends at random and routes to the less loaded one",
          explanation: "Comparing just two random candidates captures most of the benefit of least connections with far less global state."
        },
        {
          title: "IP Hash Weakness",
          prompt: "Why is IP hash a poor way to achieve session affinity for mobile users?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Mobile devices do not have IP addresses",
            "Many users share one IP behind carrier NAT, and a user's IP changes as they move between networks",
            "IP hashing only works with IPv6",
            "It requires HTTPS"
          ],
          answer: "Many users share one IP behind carrier NAT, and a user's IP changes as they move between networks",
          explanation: "Shared IPs create hotspots on one backend, and changing IPs break the affinity the hash was supposed to provide."
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
          title: "What L4 Sees",
          prompt: "Which information does a layer 4 load balancer use to make routing decisions?",
          type: "mcq",
          difficulty: "easy",
          options: ["HTTP path and headers", "Cookies", "IP addresses and TCP or UDP ports", "The response body"],
          answer: "IP addresses and TCP or UDP ports",
          explanation: "Layer 4 operates on transport-level metadata and never inspects application payload."
        },
        {
          title: "Canary Routing",
          prompt: "You want 5% of requests, selected by a header, to reach a new version of a service. Which tier handles this?",
          type: "mcq",
          difficulty: "medium",
          options: ["A layer 4 network load balancer", "A layer 7 proxy such as Envoy or nginx", "DNS", "The database"],
          answer: "A layer 7 proxy such as Envoy or nginx",
          explanation: "Header-based routing requires parsing HTTP, which only a layer 7 component does."
        },
        {
          title: "Raw Connection Volume",
          prompt: "Which tier is best suited to absorb millions of concurrent TCP connections with minimal per-connection cost?",
          type: "mcq",
          difficulty: "medium",
          options: ["Layer 7 with TLS termination", "Layer 4", "An application server", "A message broker"],
          answer: "Layer 4",
          explanation: "Forwarding packets without parsing or terminating them is far cheaper per connection than layer 7 processing."
        },
        {
          title: "TLS Termination Point",
          prompt: "Where is TLS most commonly terminated in a layered deployment?",
          type: "mcq",
          difficulty: "easy",
          options: ["At the DNS server", "At the layer 7 load balancer or CDN edge", "Inside the database", "At the client only"],
          answer: "At the layer 7 load balancer or CDN edge",
          explanation: "Terminating at the layer 7 tier lets it inspect HTTP for routing and offloads certificate handling from application servers."
        },
        {
          title: "Layer 7 Cost",
          prompt: "What is the main cost of using a layer 7 load balancer compared with layer 4?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "It cannot handle HTTPS",
            "Higher CPU per request and a stateful hop that must itself be scaled and secured",
            "It only supports one backend",
            "It cannot emit metrics"
          ],
          answer: "Higher CPU per request and a stateful hop that must itself be scaled and secured",
          explanation: "Parsing and terminating every connection consumes CPU and makes the balancer a component with its own capacity limits."
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
        },
        {
          title: "Client-Side State",
          prompt: "What is the main drawback of keeping session state entirely in a signed token held by the client?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Every request needs a database lookup",
            "The session cannot be revoked before the token expires without extra infrastructure",
            "Tokens cannot be sent over HTTPS",
            "It only works with sticky sessions"
          ],
          answer: "The session cannot be revoked before the token expires without extra infrastructure",
          explanation: "A self-contained token is valid until expiry, so immediate logout requires a denylist or token versioning."
        },
        {
          title: "Uploaded Files",
          prompt: "A stateless web service receives file uploads. Where should the files be written?",
          type: "mcq",
          difficulty: "easy",
          options: ["The instance's local disk", "Object storage such as S3", "Process memory", "The load balancer"],
          answer: "Object storage such as S3",
          explanation: "A file on local disk is invisible to other instances and disappears when the instance is replaced."
        },
        {
          title: "Per-Instance Counter Bug",
          prompt: "A rate limiter counts requests in a process-local map. After scaling to 10 instances, users are allowed roughly 10 times the intended limit. What is the fix?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Lower the limit by a factor of 10 on each instance",
            "Move the counters to a shared store such as Redis",
            "Use sticky sessions for all users",
            "Restart the instances hourly"
          ],
          answer: "Move the counters to a shared store such as Redis",
          explanation: "Shared state is the only way the instances can enforce one combined limit; dividing the limit breaks when instance counts change."
        },
        {
          title: "Acceptable Affinity",
          prompt: "In which case is pinning a client to one server acceptable?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Serving static images",
            "Holding an open WebSocket connection",
            "Processing stateless REST requests",
            "Reading from a cache"
          ],
          answer: "Holding an open WebSocket connection",
          explanation: "A persistent socket necessarily lives on one server; the state should still be reconstructible if that server dies."
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
          prompt: "What is the term for the fixed period after a scaling action during which the autoscaler ignores further triggers so metrics can stabilize?",
          type: "mcq",
          difficulty: "easy",
          options: ["Cooldown", "Backoff", "Drain", "Quorum"],
          answer: "Cooldown",
          explanation: "A cooldown prevents oscillation by giving new instances time to absorb load before the next decision."
        },
        {
          title: "Sudden Spike",
          prompt: "Traffic reliably doubles within one minute when a TV ad airs, and your VMs take three minutes to boot. What should you do?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Rely on CPU-based reactive autoscaling",
            "Use scheduled or predictive scaling to pre-warm capacity before the spike",
            "Lower the CPU threshold to 10%",
            "Disable autoscaling"
          ],
          answer: "Use scheduled or predictive scaling to pre-warm capacity before the spike",
          explanation: "Reactive scaling cannot add capacity faster than instances boot, so known spikes must be anticipated."
        },
        {
          title: "Simple Headcount",
          prompt: "Peak traffic is 12,000 requests per second and each server handles 400 at target utilization. Ignoring redundancy, how many servers are needed?",
          type: "mcq",
          difficulty: "easy",
          options: ["3", "30", "48", "300"],
          answer: "30",
          explanation: "12,000 divided by 400 is 30."
        },
        {
          title: "Aggressive Scale-In",
          prompt: "What is the risk of scaling in as aggressively as you scale out?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Cloud bills increase",
            "A brief dip in traffic shrinks the fleet, and the next burst hits an undersized fleet before new instances can boot",
            "Instances cannot be terminated",
            "Health checks stop working"
          ],
          answer: "A brief dip in traffic shrinks the fleet, and the next burst hits an undersized fleet before new instances can boot",
          explanation: "Scale-in is cheap to delay and expensive to get wrong, so policies remove capacity slowly."
        },
        {
          title: "Why Not Databases",
          prompt: "Why can a stateful database not be autoscaled the way a stateless web tier is?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Databases do not expose CPU metrics",
            "A new node must receive a copy of the data before it can serve, which takes far longer than booting and may need rebalancing",
            "Databases cannot run on virtual machines",
            "Load balancers do not support database ports"
          ],
          answer: "A new node must receive a copy of the data before it can serve, which takes far longer than booting and may need rebalancing",
          explanation: "Adding capacity to a stateful system means moving data, so it is planned rather than reactive."
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
        },
        {
          title: "Liveness vs Readiness",
          prompt: "What is the difference between a liveness check and a readiness check?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Liveness asks whether the process should be restarted; readiness asks whether it can take traffic right now",
            "They are identical",
            "Readiness runs only once at boot",
            "Liveness checks the database and readiness checks the disk"
          ],
          answer: "Liveness asks whether the process should be restarted; readiness asks whether it can take traffic right now",
          explanation: "A starting or draining instance is alive but not ready, so the two signals drive different actions."
        },
        {
          title: "Graceful Shutdown Order",
          prompt: "On receiving SIGTERM during a deploy, what should an instance do first?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Exit immediately",
            "Fail its readiness check and stop accepting new connections, then finish in-flight requests",
            "Open more connections to drain faster",
            "Delete its logs"
          ],
          answer: "Fail its readiness check and stop accepting new connections, then finish in-flight requests",
          explanation: "Removing itself from rotation before finishing work prevents dropped requests during the deploy."
        },
        {
          title: "Load Shedding",
          prompt: "A service is receiving twice the traffic it can handle. Which approach keeps latency acceptable for the requests it does serve?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Queue every request and process them eventually",
            "Reject excess requests quickly with 503 so accepted requests complete fast",
            "Increase timeouts to 5 minutes",
            "Disable health checks"
          ],
          answer: "Reject excess requests quickly with 503 so accepted requests complete fast",
          explanation: "Accepting everything makes every request slow; shedding load protects the requests you can actually serve."
        },
        {
          title: "Fail Open",
          prompt: "What does it mean when a load balancer fails open?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "It shuts down all traffic",
            "When every backend fails its health check, it routes to all backends anyway rather than dropping everything",
            "It opens the firewall to all ports",
            "It redirects traffic to another region"
          ],
          answer: "When every backend fails its health check, it routes to all backends anyway rather than dropping everything",
          explanation: "Failing open assumes a universal health check failure is more likely a check problem than a real total outage."
        }
      ]
    }
  ]
};
