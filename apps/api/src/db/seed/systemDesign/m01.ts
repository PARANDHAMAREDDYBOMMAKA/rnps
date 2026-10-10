import type { SeedModule } from "../types.ts";

export const m01: SeedModule = {
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
          prompt: "Adding more identical servers behind a load balancer primarily increases which metric?",
          type: "mcq",
          difficulty: "easy",
          options: ["Throughput", "Per-request latency", "Replication lag", "Cache hit ratio"],
          answer: "Throughput",
          explanation: "More servers handle more requests per second, but each individual request still takes the same amount of time."
        },
        {
          title: "Cross-Continent Floor",
          prompt: "A user in London calls a server in Sydney. Which number best approximates the minimum round-trip network latency, before any server work?",
          type: "mcq",
          difficulty: "easy",
          options: ["About 0.5 ms", "About 5 ms", "About 150 to 300 ms", "About 2 seconds"],
          answer: "About 150 to 300 ms",
          explanation: "Intercontinental round trips are bounded by the speed of light in fiber and routing, which puts them in the hundreds of milliseconds."
        },
        {
          title: "Why Percentiles",
          prompt: "Why do engineers report p99 latency rather than the average?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "Averages are harder to compute",
            "The average hides the slow tail that a meaningful share of users experience",
            "p99 is always lower than the average",
            "Dashboards cannot plot averages"
          ],
          answer: "The average hides the slow tail that a meaningful share of users experience",
          explanation: "A handful of multi-second requests barely move the mean but represent real users waiting."
        },
        {
          title: "Reduce Latency",
          prompt: "Which change reduces the latency of a single request rather than only increasing capacity?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Doubling the number of application servers",
            "Serving the response from a cache in the same datacenter instead of a cross-region database call",
            "Adding a second load balancer",
            "Increasing the queue size in front of the service"
          ],
          answer: "Serving the response from a cache in the same datacenter instead of a cross-region database call",
          explanation: "Eliminating a long round trip shortens the request itself, whereas more servers only let more requests run in parallel."
        },
        {
          title: "Memory vs Disk",
          prompt: "Roughly how much slower is an SSD random read than a main memory read?",
          type: "mcq",
          difficulty: "medium",
          options: ["About 10 times", "About 1,000 times", "About 1,000,000 times", "They are about the same"],
          answer: "About 1,000 times",
          explanation: "Memory is around 100 nanoseconds and an SSD random read around 100 microseconds, a factor of roughly a thousand."
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
        },
        {
          title: "Parallel Redundancy",
          prompt: "Two independent replicas each have 99% availability and either can serve a request. What is the approximate availability of the pair?",
          type: "mcq",
          difficulty: "medium",
          options: ["98%", "99%", "99.5%", "99.99%"],
          answer: "99.99%",
          explanation: "Both must fail at once, which is 0.01 times 0.01, so the pair is unavailable only 0.01% of the time."
        },
        {
          title: "SLO vs SLA",
          prompt: "Which statement correctly distinguishes an SLO from an SLA?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "An SLO is the external contract and an SLA is the internal target",
            "An SLO is the internal target and an SLA is the external contract, usually with penalties",
            "They are the same thing with different names",
            "An SLA only applies to databases"
          ],
          answer: "An SLO is the internal target and an SLA is the external contract, usually with penalties",
          explanation: "Teams set the SLO tighter than the SLA to keep a safety margin before penalties apply."
        },
        {
          title: "Availability Ceiling",
          prompt: "A web tier is deployed with full redundancy, but every request depends on a single database with 99.9% availability. What is the best availability the overall system can achieve?",
          type: "mcq",
          difficulty: "medium",
          options: ["99.999%", "99.99%", "99.9%", "100%"],
          answer: "99.9%",
          explanation: "A mandatory serial dependency caps the whole path at its own availability no matter how redundant everything else is."
        },
        {
          title: "Cost of Another Nine",
          prompt: "Why does going from 99.9% to 99.99% availability cost disproportionately more than going from 99% to 99.9%?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "Cloud providers charge per nine",
            "The remaining downtime budget drops below the time humans need to detect and fix incidents, forcing automated failover and redundancy everywhere",
            "Monitoring tools cannot measure beyond three nines",
            "It requires rewriting the application in a faster language"
          ],
          answer: "The remaining downtime budget drops below the time humans need to detect and fix incidents, forcing automated failover and redundancy everywhere",
          explanation: "With 53 minutes a year, a single manually handled incident can blow the budget, so every failure mode needs automated handling."
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
          prompt: "During a partition, a system keeps accepting writes on both sides and reconciles the conflicts afterward. Which CAP property is it prioritizing?",
          type: "mcq",
          difficulty: "easy",
          options: ["Consistency", "Availability", "Durability", "Isolation"],
          answer: "Availability",
          explanation: "Continuing to answer every request during a partition at the cost of possible divergence is the AP choice."
        },
        {
          title: "Why Not CA",
          prompt: "Why is a CA system not a practical option for a distributed database?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Consistency and availability are the same property",
            "Network partitions cannot be prevented, so a system must decide how to behave during one",
            "CA systems are too expensive to license",
            "Availability requires at least five nodes"
          ],
          answer: "Network partitions cannot be prevented, so a system must decide how to behave during one",
          explanation: "Giving up partition tolerance is not a choice you get to make; the network will partition regardless."
        },
        {
          title: "Shopping Cart",
          prompt: "An e-commerce shopping cart should remain usable even if a datacenter is cut off, and occasional merging of cart contents is acceptable. Which bias is appropriate?",
          type: "mcq",
          difficulty: "easy",
          options: ["CP", "AP", "CA", "Neither, carts must be single-node"],
          answer: "AP",
          explanation: "Carts tolerate temporary divergence and merge well, so availability is worth more than strict consistency."
        },
        {
          title: "PACELC Addition",
          prompt: "What does PACELC add to the CAP theorem?",
          type: "mcq",
          difficulty: "hard",
          options: [
            "A fourth property called elasticity",
            "That even without a partition, a system trades latency against consistency",
            "That partitions never happen in cloud networks",
            "A proof that AP systems are always faster"
          ],
          answer: "That even without a partition, a system trades latency against consistency",
          explanation: "Else, when the network is healthy, waiting for replicas to acknowledge costs latency, so the trade-off never disappears."
        },
        {
          title: "Meaning of C",
          prompt: "What does the C in CAP actually mean?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Database constraints always hold, as in ACID",
            "Every read returns the most recent write, as if there were one copy of the data",
            "Data is compressed on every node",
            "The cluster has a consistent number of nodes"
          ],
          answer: "Every read returns the most recent write, as if there were one copy of the data",
          explanation: "CAP consistency is linearizability, which is much stronger than the integrity constraints meant by consistency in ACID."
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
        },
        {
          title: "Peak Planning",
          prompt: "Average traffic is 2,300 requests per second. Using the usual rule of thumb, what peak should you plan capacity for?",
          type: "mcq",
          difficulty: "easy",
          options: ["About 2,300", "About 5,000 to 7,000", "About 50,000", "About 230,000"],
          answer: "About 5,000 to 7,000",
          explanation: "Peak is typically 2 to 3 times the daily average."
        },
        {
          title: "Record Storage",
          prompt: "A service writes 5 million records per day at 200 bytes each. Approximately how much storage is added per year?",
          type: "mcq",
          difficulty: "medium",
          options: ["About 1 GB", "About 365 GB", "About 3.65 TB", "About 36 TB"],
          answer: "About 365 GB",
          explanation: "5 million times 200 bytes is 1 GB per day, and 365 days gives about 365 GB."
        },
        {
          title: "Bandwidth Estimate",
          prompt: "A video service serves 1,000 concurrent streams at 5 Mbps each. What is the required egress bandwidth?",
          type: "mcq",
          difficulty: "easy",
          options: ["About 5 Mbps", "About 500 Mbps", "About 5 Gbps", "About 5 Tbps"],
          answer: "About 5 Gbps",
          explanation: "1,000 streams times 5 Mbps is 5,000 Mbps, which is 5 Gbps."
        },
        {
          title: "What the Estimate Decides",
          prompt: "Your estimate shows 300 writes per second and 2 TB of data after five years. What design decision does this most directly support?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Shard the database across 50 nodes from day one",
            "A single primary database with replicas is sufficient; sharding can wait",
            "Store all data in a CDN",
            "Use a graph database"
          ],
          answer: "A single primary database with replicas is sufficient; sharding can wait",
          explanation: "Hundreds of writes per second and a few terabytes are well within a single well-provisioned database."
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
          prompt: "Adding more machines rather than upgrading to a bigger machine is called what?",
          type: "mcq",
          difficulty: "easy",
          options: ["Vertical scaling", "Horizontal scaling", "Diagonal scaling", "Elastic replication"],
          answer: "Horizontal scaling",
          explanation: "Horizontal scaling (scaling out) adds nodes, while vertical scaling (scaling up) adds resources to one node."
        },
        {
          title: "Vertical Ceiling",
          prompt: "What is the fundamental limitation of vertical scaling?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "It requires rewriting the application",
            "There is a hard ceiling on how large one machine can be and it remains a single point of failure",
            "It only works for NoSQL databases",
            "It cannot be done in the cloud"
          ],
          answer: "There is a hard ceiling on how large one machine can be and it remains a single point of failure",
          explanation: "Even the largest instance has finite resources, and it still goes down on every reboot or hardware fault."
        },
        {
          title: "Duplicate Cron Job",
          prompt: "A nightly job that sends invoice emails ran once on a single server. After scaling to four servers, customers receive four copies. Why?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "The load balancer multiplied the email",
            "Each server runs the scheduled job independently with no coordination",
            "The database replicated the emails",
            "Emails are cached in memory"
          ],
          answer: "Each server runs the scheduled job independently with no coordination",
          explanation: "A scheduled job needs a distributed lock or a dedicated runner once more than one instance exists."
        },
        {
          title: "Database First Move",
          prompt: "A PostgreSQL database is hitting CPU limits at 5,000 queries per second, mostly reads. What is the usual next step?",
          type: "mcq",
          difficulty: "medium",
          options: [
            "Shard across 20 nodes immediately",
            "Scale vertically and add read replicas and caching before considering sharding",
            "Switch to a graph database",
            "Move the data into the application's memory"
          ],
          answer: "Scale vertically and add read replicas and caching before considering sharding",
          explanation: "Sharding is the most invasive step and is deferred until cheaper options are exhausted."
        },
        {
          title: "Horizontal Prerequisite",
          prompt: "Which property makes a service easy to scale horizontally?",
          type: "mcq",
          difficulty: "easy",
          options: [
            "It keeps user state in process memory",
            "It is stateless and stores shared state in external systems",
            "It writes uploads to local disk",
            "It runs a single long-lived process"
          ],
          answer: "It is stateless and stores shared state in external systems",
          explanation: "When any instance can serve any request, adding instances is purely additive."
        }
      ]
    }
  ]
};
