export interface QA {
  question: string;
  answer: string;
  codeExample?: string;
  tags?: string[];
}

export interface JavaTopic {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  questions: QA[];
}

export const javaTopics: JavaTopic[] = [
  {
    id: 'core-java',
    title: 'Core Java',
    icon: '☕',
    color: '#FF8C00',
    description: 'Fundamentals: OOP, memory model, JVM internals, generics, and more.',
    questions: [
      {
        question: 'What is the difference between == and .equals() in Java?',
        answer: '== compares object references (memory addresses). .equals() compares object content/values. For primitives, == compares values. Always use .equals() for String and object comparison.',
        codeExample: `String a = new String("hello");
String b = new String("hello");
System.out.println(a == b);        // false (different refs)
System.out.println(a.equals(b));   // true (same content)`,
        tags: ['OOP', 'Strings', 'Fundamentals'],
      },
      {
        question: 'Explain the Java Memory Model: Stack vs Heap.',
        answer: 'Stack: stores local variables, method call frames, primitive values, and object references. LIFO, thread-specific, fast allocation. Heap: stores all objects and class instances. Shared across threads. Managed by GC. Static variables go to Method Area (part of Non-Heap).',
        codeExample: `void method() {
    int x = 5;           // Stack: primitive
    String s = "hi";     // Stack: reference, Heap: String object
    Object o = new Object(); // Stack: ref, Heap: object
}`,
        tags: ['JVM', 'Memory'],
      },
      {
        question: 'What is the difference between final, finally, and finalize?',
        answer: 'final: keyword to make variable constant, method non-overridable, class non-inheritable. finally: block in try-catch that always executes (cleanup). finalize(): deprecated method called by GC before object collection (unreliable, avoid).',
        tags: ['Keywords', 'GC'],
      },
      {
        question: 'What is autoboxing and unboxing? What are the gotchas?',
        answer: 'Autoboxing: automatic conversion from primitive to wrapper (int → Integer). Unboxing: wrapper to primitive. Gotcha: Integer cache only applies for -128 to 127. NullPointerException on unboxing null. Performance overhead in loops.',
        codeExample: `Integer a = 127, b = 127;
System.out.println(a == b); // true (cached)
Integer c = 128, d = 128;
System.out.println(c == d); // false (not cached)`,
        tags: ['Primitives', 'Performance'],
      },
      {
        question: 'Explain String interning and the String pool.',
        answer: 'String literals are stored in the String Pool (PermGen/Metaspace). String.intern() moves a string to the pool or returns the pooled reference. Enables reference equality for pooled strings. Reduces memory. New String() bypasses the pool.',
        codeExample: `String a = "hello";           // pool
String b = "hello";           // same pool ref
String c = new String("hello"); // heap, not pool
System.out.println(a == b);       // true
System.out.println(a == c);       // false
System.out.println(a == c.intern()); // true`,
        tags: ['Strings', 'Memory'],
      },
      {
        question: 'What is the difference between abstract class and interface? When to use each?',
        answer: 'Abstract class: can have state, constructors, concrete methods, protected/private members. Single inheritance. Interface: no state (except static/default), multiple implementation, public by default. Use abstract class for "is-a" with shared state. Use interface for "can-do" contracts and multiple behavior.',
        codeExample: `abstract class Animal {
    String name;  // state
    abstract void speak();
    void breathe() { /* concrete */ }
}
interface Flyable { void fly(); }
interface Swimmable { void swim(); }
class Duck extends Animal implements Flyable, Swimmable { ... }`,
        tags: ['OOP', 'Design'],
      },
    ],
  },
  {
    id: 'collections',
    title: 'Collections',
    icon: '📦',
    color: '#4CAF50',
    description: 'List, Set, Map internals, complexity, and choosing the right data structure.',
    questions: [
      {
        question: 'What is the internal implementation of HashMap? How does it handle collisions?',
        answer: 'HashMap uses an array of buckets (Node[]). Key\'s hashCode determines bucket index. Collisions handled by chaining (linked list). Since Java 8: linked list becomes a Red-Black Tree when bucket size > 8 (treeifyBin). Default load factor 0.75, resizes when 75% full.',
        codeExample: `// Internal bucket structure
class Node<K,V> {
    int hash;
    K key;
    V value;
    Node<K,V> next; // linked list for collisions
}
// Java 8+: converts to TreeNode when chain > 8`,
        tags: ['HashMap', 'Internals', 'Performance'],
      },
      {
        question: 'ArrayList vs LinkedList: when to use each?',
        answer: 'ArrayList: O(1) random access, O(n) insert/delete in middle, contiguous memory, better cache performance. LinkedList: O(n) access, O(1) insert/delete at ends (as Deque), more memory (2 pointers per node). Use ArrayList for most cases. LinkedList for Queue/Deque operations.',
        tags: ['List', 'Performance'],
      },
      {
        question: 'What is the difference between HashMap, LinkedHashMap, and TreeMap?',
        answer: 'HashMap: O(1) get/put, no ordering. LinkedHashMap: maintains insertion order (or access order), slightly slower. TreeMap: sorted by key (Red-Black Tree), O(log n) operations. Use LinkedHashMap for LRU caches (access-order mode). Use TreeMap for sorted iteration.',
        tags: ['Map', 'Ordering'],
      },
      {
        question: 'Explain ConcurrentHashMap vs Hashtable vs Collections.synchronizedMap.',
        answer: 'Hashtable: all methods synchronized on single lock, poor concurrency. synchronizedMap: wraps map with single lock. ConcurrentHashMap: segment locking (Java 7) / CAS + synchronized per bucket (Java 8). Best for concurrent use. No lock on reads in Java 8+. Allows null values? No for both thread-safe versions.',
        tags: ['Concurrency', 'Thread Safety'],
      },
      {
        question: 'How does HashSet work internally?',
        answer: 'HashSet is backed by a HashMap where keys are the set elements and values are a dummy PRESENT object. All HashMap mechanics apply: O(1) add/contains/remove, no duplicate keys → no duplicate elements.',
        codeExample: `// HashSet source (simplified)
private HashMap<E,Object> map;
private static final Object PRESENT = new Object();
public boolean add(E e) {
    return map.put(e, PRESENT) == null;
}`,
        tags: ['Set', 'Internals'],
      },
    ],
  },
  {
    id: 'threading',
    title: 'Threading & Concurrency',
    icon: '🧵',
    color: '#9C27B0',
    description: 'Thread lifecycle, synchronization, locks, thread pools, and common concurrency patterns.',
    questions: [
      {
        question: 'What is the difference between synchronized, volatile, and AtomicInteger?',
        answer: 'synchronized: mutual exclusion + visibility. Only one thread in block at a time. Reentrant. volatile: visibility only. Ensures reads/writes go to main memory. No atomicity for compound ops. AtomicInteger: lock-free atomic operations using CAS (compare-and-swap). Best for counters and flags.',
        codeExample: `// volatile: safe for single read/write
volatile boolean flag = true;

// AtomicInteger: safe for increment (compound op)
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet(); // atomic

// synchronized: safe for multi-step operations
synchronized (this) {
    if (condition) { doWork(); }
}`,
        tags: ['Synchronization', 'Thread Safety'],
      },
      {
        question: 'What is a deadlock? How do you prevent it?',
        answer: 'Deadlock: two threads each hold a lock the other needs. Conditions: mutual exclusion, hold and wait, no preemption, circular wait. Prevention: always acquire locks in the same order, use tryLock with timeout, use lock ordering, prefer java.util.concurrent over synchronized.',
        codeExample: `// Deadlock: Thread1 holds A, wants B
// Thread2 holds B, wants A
// Prevention: always lock A before B in both threads
ReentrantLock lockA = new ReentrantLock();
ReentrantLock lockB = new ReentrantLock();
// Use tryLock to avoid deadlock:
if (lockA.tryLock(1, SECONDS) && lockB.tryLock(1, SECONDS)) {
    try { /* work */ } finally { lockA.unlock(); lockB.unlock(); }
}`,
        tags: ['Deadlock', 'Locks'],
      },
      {
        question: 'Explain ThreadPoolExecutor parameters.',
        answer: 'corePoolSize: threads kept alive even when idle. maximumPoolSize: max threads. keepAliveTime: time idle threads (above core) wait before termination. workQueue: holds tasks when all core threads busy. rejectionPolicy: what to do when queue full (AbortPolicy, CallerRunsPolicy, DiscardPolicy).',
        codeExample: `ThreadPoolExecutor executor = new ThreadPoolExecutor(
    4,           // corePoolSize
    10,          // maximumPoolSize
    60L,         // keepAliveTime
    TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(100), // workQueue
    new ThreadPoolExecutor.CallerRunsPolicy() // rejection
);`,
        tags: ['Thread Pool', 'ExecutorService'],
      },
      {
        question: 'What is the difference between wait/notify and Condition (await/signal)?',
        answer: 'wait/notify: requires synchronized block, bound to object monitor, only one condition per lock. Condition: created from Lock, multiple conditions per lock, supports timed await, more flexible.',
        codeExample: `// wait/notify (legacy)
synchronized(lock) { lock.wait(); lock.notify(); }

// Condition (preferred)
Lock lock = new ReentrantLock();
Condition notEmpty = lock.newCondition();
Condition notFull = lock.newCondition();
lock.lock();
try {
    while (queue.isEmpty()) notEmpty.await();
    notFull.signal();
} finally { lock.unlock(); }`,
        tags: ['Locks', 'Wait/Notify'],
      },
      {
        question: 'What is CompletableFuture? How is it different from Future?',
        answer: 'Future: blocking get(), no composition, no callbacks. CompletableFuture: non-blocking callbacks (thenApply, thenAccept, thenCompose), compose multiple async tasks, exception handling (exceptionally, handle), combine with allOf/anyOf.',
        codeExample: `CompletableFuture<String> cf = CompletableFuture
    .supplyAsync(() -> fetchUser(id))
    .thenApply(user -> enrich(user))
    .thenCompose(user -> fetchOrders(user.id()))
    .exceptionally(ex -> defaultValue())
    .thenApply(result -> format(result));`,
        tags: ['Async', 'CompletableFuture'],
      },
    ],
  },
  {
    id: 'java8',
    title: 'Java 8+ Features',
    icon: '8️⃣',
    color: '#2196F3',
    description: 'Streams, lambdas, Optional, default methods, and modern Java patterns.',
    questions: [
      {
        question: 'Explain Stream pipeline: intermediate vs terminal operations.',
        answer: 'Intermediate: lazy operations that return a new Stream (filter, map, flatMap, sorted, distinct, limit, peek). Terminal: eager, trigger processing, return non-Stream (collect, forEach, reduce, count, findFirst, anyMatch). Streams are lazy — no work until terminal op.',
        codeExample: `List<String> result = employees.stream()
    .filter(e -> e.salary() > 50000)    // intermediate
    .map(Employee::name)                 // intermediate
    .sorted()                            // intermediate
    .limit(10)                           // intermediate
    .collect(Collectors.toList());       // terminal`,
        tags: ['Streams', 'Functional'],
      },
      {
        question: 'What is Optional and when should you use it?',
        answer: 'Optional<T>: container that may or may not hold a value. Use as return type when null is a valid "no result" state. Avoid: using Optional for fields, method params, or collections. Use: orElse, orElseGet (lazy), orElseThrow, map, flatMap, ifPresent.',
        codeExample: `Optional<User> user = userRepo.findById(id);
String name = user
    .filter(u -> u.isActive())
    .map(User::getName)
    .orElse("Unknown");`,
        tags: ['Optional', 'Null Safety'],
      },
      {
        question: 'Explain Collectors: groupingBy, partitioningBy, toMap.',
        answer: 'groupingBy: groups elements by classifier into Map<K, List<V>>. partitioningBy: splits into two groups (true/false) based on predicate. toMap: converts to map with key/value extractors. Careful with duplicate keys (mergeFunction needed).',
        codeExample: `// groupingBy
Map<Department, List<Employee>> byDept =
    employees.stream().collect(groupingBy(Employee::dept));

// partitioningBy
Map<Boolean, List<Employee>> seniorJunior =
    employees.stream().collect(partitioningBy(e -> e.years() >= 5));

// toMap
Map<Integer, String> idToName =
    employees.stream().collect(toMap(Employee::id, Employee::name));`,
        tags: ['Collectors', 'Streams'],
      },
      {
        question: 'What are functional interfaces? Name the key ones.',
        answer: 'Functional interface: exactly one abstract method. Key interfaces: Supplier<T> → T get(). Consumer<T> → void accept(T). Function<T,R> → R apply(T). Predicate<T> → boolean test(T). BiFunction<T,U,R>. UnaryOperator<T>. BinaryOperator<T>. All in java.util.function package.',
        tags: ['Functional', 'Lambda'],
      },
    ],
  },
  {
    id: 'spring-boot',
    title: 'Spring Boot',
    icon: '🌱',
    color: '#6DB33F',
    description: 'Auto-configuration, dependency injection, beans, actuator, and production-ready features.',
    questions: [
      {
        question: 'How does Spring Boot auto-configuration work?',
        answer: 'Auto-configuration reads META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Uses @Conditional annotations (@ConditionalOnClass, @ConditionalOnMissingBean) to only apply if conditions met. spring-boot-autoconfigure JAR contains default configs. Your beans take precedence over auto-configured ones.',
        codeExample: `@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnMissingBean(DataSource.class)
public class DataSourceAutoConfiguration {
    @Bean
    public DataSource dataSource(DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }
}`,
        tags: ['Auto-Config', 'Configuration'],
      },
      {
        question: 'Explain Spring bean scopes.',
        answer: 'singleton (default): one instance per container. prototype: new instance each injection/lookup. request: one per HTTP request. session: one per HTTP session. application: one per ServletContext. websocket: one per WebSocket session.',
        tags: ['Beans', 'Scope'],
      },
      {
        question: 'What is @Transactional? What are its pitfalls?',
        answer: 'Wraps method in a transaction: begin, commit on success, rollback on RuntimeException. Pitfalls: self-invocation bypasses proxy (call from within same class). Checked exceptions don\'t rollback by default (use rollbackFor). Protected/private methods not intercepted. Use @Transactional(readOnly=true) for read operations for performance.',
        codeExample: `@Service
public class OrderService {
    @Transactional(rollbackFor = Exception.class)
    public void placeOrder(Order order) {
        orderRepo.save(order);
        inventoryService.deduct(order); // in same transaction
    }

    // WRONG: self-invocation bypasses proxy
    public void process() { this.placeOrder(order); }
}`,
        tags: ['Transactions', 'AOP'],
      },
      {
        question: 'What is Spring AOP? How does it differ from AspectJ?',
        answer: 'Spring AOP: proxy-based, applies to Spring beans only, runtime weaving, subset of AspectJ. Supports method-level pointcuts only. AspectJ: bytecode manipulation, compile/load-time weaving, all Java constructs. Use Spring AOP for simple cross-cutting (logging, transactions). Use AspectJ for complex needs.',
        tags: ['AOP', 'Proxies'],
      },
      {
        question: 'Explain Spring Boot Actuator and key production endpoints.',
        answer: 'Actuator adds production-ready endpoints: /actuator/health (app health, custom indicators), /actuator/metrics (Micrometer metrics), /actuator/info, /actuator/env, /actuator/beans, /actuator/loggers (change log level at runtime), /actuator/threaddump, /actuator/heapdump. Secure in production!',
        tags: ['Actuator', 'Production', 'Monitoring'],
      },
    ],
  },
  {
    id: 'spring-data',
    title: 'Spring Data & JPA',
    icon: '🗄️',
    color: '#00897B',
    description: 'JPA entities, repositories, JPQL, N+1 problems, and transaction management.',
    questions: [
      {
        question: 'Explain JPA entity lifecycle states.',
        answer: 'New/Transient: not associated with persistence context, no ID. Managed: associated with persistence context, changes auto-synced. Detached: was managed, now disconnected (after session close or evict). Removed: scheduled for deletion. State transitions: persist(), merge(), remove(), detach().',
        tags: ['JPA', 'Lifecycle'],
      },
      {
        question: 'What is the N+1 problem in JPA? How do you fix it?',
        answer: 'N+1: fetching N entities triggers N additional queries for associations. Example: 100 orders → 100 queries for customer names. Fixes: 1) @EntityGraph or JOIN FETCH in JPQL. 2) @BatchSize for lazy collections. 3) @Query with explicit join. 4) Use DTO projections with single query.',
        codeExample: `// BAD: N+1
List<Order> orders = orderRepo.findAll();
orders.forEach(o -> o.getCustomer().getName()); // N queries!

// GOOD: JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.customer")
List<Order> findAllWithCustomer();

// GOOD: @EntityGraph
@EntityGraph(attributePaths = {"customer"})
List<Order> findAll();`,
        tags: ['N+1', 'Performance', 'JPA'],
      },
      {
        question: 'Explain @OneToMany mapping best practices.',
        answer: 'Always use Set over List for @ManyToMany (avoid duplicates). Use bidirectional carefully — always sync both sides. Prefer lazy loading (default for collections). Use cascade = PERSIST,MERGE sparingly. Use orphanRemoval for true composition. Avoid CascadeType.ALL with bidirectional.',
        codeExample: `@Entity
public class Author {
    @OneToMany(mappedBy = "author",
               cascade = {PERSIST, MERGE},
               orphanRemoval = true,
               fetch = LAZY)
    private Set<Book> books = new HashSet<>();

    public void addBook(Book book) {
        books.add(book);
        book.setAuthor(this); // sync both sides
    }
}`,
        tags: ['JPA', 'Relationships'],
      },
    ],
  },
  {
    id: 'spring-security',
    title: 'Spring Security',
    icon: '🔐',
    color: '#E53935',
    description: 'Authentication, authorization, JWT, OAuth2, and security configuration.',
    questions: [
      {
        question: 'Explain Spring Security filter chain.',
        answer: 'Security is a chain of filters (SecurityFilterChain) applied before the servlet. Key filters: SecurityContextPersistenceFilter, UsernamePasswordAuthenticationFilter, BasicAuthenticationFilter, ExceptionTranslationFilter, FilterSecurityInterceptor. Each filter can short-circuit the chain by committing the response.',
        tags: ['Filter Chain', 'Architecture'],
      },
      {
        question: 'How does JWT authentication work with Spring Security?',
        answer: 'Custom filter (OncePerRequestFilter) intercepts requests, extracts JWT from Authorization header, validates signature and expiry, extracts claims, creates UsernamePasswordAuthenticationToken, sets in SecurityContextHolder. No session needed (stateless). Filter placed before UsernamePasswordAuthenticationFilter.',
        codeExample: `@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain) {
        String token = extractToken(req);
        if (token != null && jwtUtil.isValid(token)) {
            UserDetails user = userService.loadByUsername(
                jwtUtil.extractUsername(token));
            var auth = new UsernamePasswordAuthenticationToken(
                user, null, user.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
        chain.doFilter(req, res);
    }
}`,
        tags: ['JWT', 'Authentication'],
      },
      {
        question: 'What is the difference between Authentication and Authorization?',
        answer: 'Authentication: who are you? (login, JWT, OAuth2). Results in Authentication object in SecurityContext. Authorization: what can you do? Checked after authentication. Method: @PreAuthorize, @Secured. URL: HttpSecurity.authorizeHttpRequests. Roles vs Authorities: roles are prefixed with ROLE_.',
        tags: ['AuthN', 'AuthZ'],
      },
    ],
  },
  {
    id: 'microservices',
    title: 'Microservices & Distributed',
    icon: '🌐',
    color: '#1565C0',
    description: 'Service mesh, resilience patterns, event-driven, distributed transactions, and observability.',
    questions: [
      {
        question: 'What is Circuit Breaker pattern? Explain Resilience4j states.',
        answer: 'Circuit Breaker prevents cascading failures. States: CLOSED (normal, tracking failures), OPEN (calls fail fast for waitDurationInOpenState), HALF_OPEN (test traffic allowed). Transitions: failure rate > threshold → OPEN. Test calls succeed → CLOSED. Test calls fail → OPEN.',
        codeExample: `@CircuitBreaker(name = "userService", fallbackMethod = "fallback")
public UserDto getUser(String id) {
    return userClient.getUser(id);
}

public UserDto fallback(String id, Exception ex) {
    return UserDto.unknown(id);
}

// application.yml
resilience4j.circuitbreaker.instances.userService:
  failureRateThreshold: 50
  waitDurationInOpenState: 30s
  slidingWindowSize: 10`,
        tags: ['Resilience', 'Circuit Breaker'],
      },
      {
        question: 'Explain Saga pattern for distributed transactions.',
        answer: 'Saga: sequence of local transactions coordinated by events/messages. No distributed 2PC. Two types: Choreography (events trigger next service, no central coordinator, harder to debug) and Orchestration (saga orchestrator tells each service what to do, central flow, easier to monitor). Compensating transactions for rollback.',
        tags: ['Distributed Transactions', 'Saga'],
      },
      {
        question: 'What is the Outbox pattern and why is it needed?',
        answer: 'Problem: writing to DB and publishing an event are two separate operations — one can fail. Outbox: write event to outbox table in same DB transaction. Separate relay process reads outbox and publishes to message broker (at-least-once delivery). Ensures DB state and events are consistent.',
        codeExample: `@Transactional
public void placeOrder(Order order) {
    orderRepo.save(order);
    // Same transaction: guaranteed consistency
    outboxRepo.save(new OutboxEvent("ORDER_PLACED", toJson(order)));
    // Relay process reads outbox → publishes to Kafka
}`,
        tags: ['Outbox', 'Event Sourcing', 'Consistency'],
      },
      {
        question: 'What is CAP theorem and how does it apply to microservices?',
        answer: 'CAP: Consistency, Availability, Partition Tolerance — can only guarantee 2 of 3 during partition. Networks always have partitions → choose CP or AP. CP (Zookeeper, etcd): consistent reads even during partition, but may reject requests. AP (Cassandra, DynamoDB): always available, but may return stale data. Most microservices prefer AP with eventual consistency.',
        tags: ['CAP', 'Distributed Systems'],
      },
    ],
  },
  {
    id: 'databases',
    title: 'Databases',
    icon: '🗃️',
    color: '#FF6F00',
    description: 'ACID, indexes, query optimization, connection pooling, and NoSQL patterns.',
    questions: [
      {
        question: 'Explain database indexes: B-Tree vs Hash. When to use each?',
        answer: 'B-Tree: sorted, supports range queries, ORDER BY, LIKE prefix. Default in most DBs. O(log n) lookup. Hash: O(1) exact lookup, no ordering, no range queries, no LIKE. Use B-Tree for most cases. Use Hash for exact equality lookups only. Covering index: index includes all needed columns (avoids table lookup).',
        tags: ['Indexes', 'Performance'],
      },
      {
        question: 'What are database isolation levels and their trade-offs?',
        answer: 'READ UNCOMMITTED: dirty reads possible. READ COMMITTED (default PG): no dirty reads, phantom/non-repeatable reads possible. REPEATABLE READ (default MySQL/InnoDB): no dirty/non-repeatable reads, phantom reads possible. SERIALIZABLE: full isolation, but slowest. Spring @Transactional(isolation=...) maps to these levels.',
        tags: ['Transactions', 'ACID', 'Isolation'],
      },
      {
        question: 'How does connection pooling work? HikariCP configuration.',
        answer: 'Pool maintains pre-created connections. Requests borrow connections, return after use. Key HikariCP settings: maximumPoolSize (default 10), minimumIdle, connectionTimeout (30s), idleTimeout (10min), maxLifetime (30min). Formula: pool size = (core_count * 2) + effective_spindle_count.',
        codeExample: `# application.yml
spring.datasource.hikari:
  maximum-pool-size: 20
  minimum-idle: 5
  connection-timeout: 30000
  idle-timeout: 600000
  max-lifetime: 1800000`,
        tags: ['Connection Pool', 'HikariCP', 'Performance'],
      },
    ],
  },
  {
    id: 'docker-k8s',
    title: 'Docker & Kubernetes',
    icon: '🐳',
    color: '#1488C6',
    description: 'Containerization, orchestration, deployments, health probes, and resource management.',
    questions: [
      {
        question: 'Explain Kubernetes liveness vs readiness vs startup probes.',
        answer: 'Liveness: is the container still running? Failure → restart container. Readiness: is the container ready to serve traffic? Failure → removed from service endpoints (no traffic). Startup: has the container started? Delays liveness/readiness checks until successful. Use startup for slow-starting Spring Boot apps.',
        codeExample: `livenessProbe:
  httpGet:
    path: /actuator/health/liveness
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /actuator/health/readiness
    port: 8080
  initialDelaySeconds: 10
  periodSeconds: 5`,
        tags: ['Kubernetes', 'Health', 'Probes'],
      },
      {
        question: 'What is the difference between Deployment, StatefulSet, and DaemonSet?',
        answer: 'Deployment: stateless apps, rolling updates, pods are interchangeable. StatefulSet: stateful apps (databases), stable network identity, ordered deployment/scaling, persistent storage per pod. DaemonSet: one pod per node (log collectors, monitoring agents). Use Deployment for Spring Boot microservices.',
        tags: ['Kubernetes', 'Workloads'],
      },
      {
        question: 'Explain Docker multi-stage builds for Spring Boot.',
        answer: 'Multi-stage: use heavy build image (JDK + Maven) in first stage, copy only the JAR to lightweight runtime image (JRE). Reduces final image size dramatically. Also use Spring Boot layered JAR for efficient Docker layer caching.',
        codeExample: `FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]`,
        tags: ['Docker', 'Multi-stage', 'Build'],
      },
    ],
  },
  {
    id: 'system-design',
    title: 'System Design',
    icon: '🏗️',
    color: '#7B1FA2',
    description: 'Scalable system design: load balancing, caching, message queues, and architectural patterns.',
    questions: [
      {
        question: 'How would you design a rate limiter?',
        answer: 'Algorithms: Token Bucket (allows bursts), Leaky Bucket (smooth rate), Fixed Window Counter (simple, boundary issues), Sliding Window Log (accurate, memory heavy), Sliding Window Counter (approximate, efficient). For distributed: Redis with Lua script for atomic operations. Store counts in Redis with TTL.',
        codeExample: `// Token Bucket with Redis
String key = "rate:" + userId;
// Lua script (atomic)
long tokens = redis.eval("""
  local tokens = tonumber(redis.call('get', KEYS[1]) or ARGV[1])
  if tokens > 0 then
    redis.call('decr', KEYS[1])
    return 1  -- allowed
  end
  return 0  -- denied
""", key, MAX_TOKENS);`,
        tags: ['Rate Limiting', 'Redis', 'Scalability'],
      },
      {
        question: 'Explain caching strategies: Cache-Aside, Write-Through, Write-Behind.',
        answer: 'Cache-Aside (Lazy): app reads cache, on miss reads DB + updates cache. Handles cache failures gracefully. Stale data possible. Write-Through: write to cache + DB synchronously on every write. Always fresh, write latency. Write-Behind (Write-Back): write to cache, async write to DB. Fast writes, risk of loss. Cache-Aside most common in Spring + Redis.',
        tags: ['Caching', 'Redis', 'Patterns'],
      },
      {
        question: 'How do you design for horizontal scalability in Spring Boot?',
        answer: 'Stateless services (no session state in memory). Externalize state to Redis/DB. Sticky sessions if necessary (but avoid). Distributed caching (Redis cluster). Externalize config (Spring Cloud Config). Service discovery (Eureka/Kubernetes service). Load balancer health checks + readiness probes. Database: read replicas, connection pool sizing per instance.',
        tags: ['Scalability', 'Architecture'],
      },
    ],
  },
  {
    id: 'design-patterns',
    title: 'Design Patterns',
    icon: '🎨',
    color: '#C2185B',
    description: 'GoF patterns, SOLID principles, and how they apply in Spring/Java backends.',
    questions: [
      {
        question: 'Explain the Strategy pattern with a real-world Java example.',
        answer: 'Strategy: define a family of algorithms, encapsulate each, make them interchangeable. Enables runtime selection of algorithm. Common in payment processing, sorting, validation.',
        codeExample: `interface PaymentStrategy {
    void pay(int amount);
}
class CreditCardPayment implements PaymentStrategy {
    public void pay(int amount) { /* charge card */ }
}
class PayPalPayment implements PaymentStrategy {
    public void pay(int amount) { /* use PayPal */ }
}
@Service
class OrderService {
    public void checkout(Cart cart, PaymentStrategy strategy) {
        strategy.pay(cart.total());
    }
}`,
        tags: ['Strategy', 'GoF', 'Design Patterns'],
      },
      {
        question: 'What is the Builder pattern and when does Spring use it?',
        answer: 'Builder: construct complex objects step by step. Avoids telescoping constructors. Ensures immutability. Spring uses it in: UriComponentsBuilder, MockMvcRequestBuilders, SecurityMockMvcRequestPostProcessors, ResponseEntity.BodyBuilder, JwtBuilder.',
        codeExample: `// Builder pattern
User user = User.builder()
    .name("Alice")
    .email("alice@example.com")
    .role(Role.ADMIN)
    .active(true)
    .build();

// Spring usage
URI uri = UriComponentsBuilder.fromHttpUrl(baseUrl)
    .path("/users/{id}")
    .queryParam("active", true)
    .buildAndExpand(userId)
    .toUri();`,
        tags: ['Builder', 'GoF', 'Spring'],
      },
      {
        question: 'Explain SOLID principles with Java examples.',
        answer: 'S - Single Responsibility: one reason to change. O - Open/Closed: open for extension, closed for modification. L - Liskov Substitution: subclasses must be substitutable. I - Interface Segregation: small focused interfaces over fat ones. D - Dependency Inversion: depend on abstractions, not concretions (core of Spring DI).',
        tags: ['SOLID', 'Design', 'OOP'],
      },
    ],
  },
];
