/**
 * Fourth batch — covering all remaining Java backend interview topics:
 * Spring Batch, Spring Cloud (Config/Sleuth/Stream/Gateway/Contract),
 * Caching (Redis/Caffeine/Hazelcast), DB migrations (Flyway/Liquibase),
 * gRPC/GraphQL/REST best practices, Security (CORS/CSRF/OAuth2/rate-limiting),
 * Distributed systems (locking, consistent hashing, JMM),
 * JVM tuning & profiling, Kubernetes deeper, AWS deeper,
 * Observability (OpenTelemetry/Prometheus/ELK), Testcontainers/WireMock,
 * ClassLoaders/Reflection/Dynamic Proxies.
 */
import { QA } from './javaTopics';

// ─── SPRING BATCH ─────────────────────────────────────────────────────────────
export const springBatchExtra: QA[] = [
  {
    question: 'What is Spring Batch? What is the Job/Step/Chunk processing model?',
    answer: 'Spring Batch is a framework for processing large volumes of records: CSV imports, database migrations, report generation, ETL pipelines. Core model: Job — the top-level unit, contains one or more Steps. Step — a single phase of a job. Two types: Chunk-oriented (read/process/write in batches) and Tasklet (arbitrary logic). Chunk processing: ItemReader reads one item, ItemProcessor transforms it, results accumulate until chunk-size is reached, then ItemWriter writes the whole chunk in one transaction. JobLauncher starts jobs. JobRepository persists job metadata (status, parameters, execution history) to a database.',
    codeExample: `@Configuration
public class ImportJobConfig {

    @Bean
    public Job importUserJob(JobRepository repo, Step importStep) {
        return new JobBuilder("importUserJob", repo)
            .start(importStep)
            .build();
    }

    @Bean
    public Step importStep(JobRepository repo, PlatformTransactionManager tx,
                           FlatFileItemReader<UserDto> reader,
                           UserItemProcessor processor,
                           JdbcBatchItemWriter<User> writer) {
        return new StepBuilder("importStep", repo)
            .<UserDto, User>chunk(100, tx) // read 100, process 100, write 100 in 1 tx
            .reader(reader)
            .processor(processor)
            .writer(writer)
            .build();
    }

    @Bean
    public FlatFileItemReader<UserDto> reader() {
        return new FlatFileItemReaderBuilder<UserDto>()
            .name("userItemReader")
            .resource(new ClassPathResource("users.csv"))
            .delimited().names("firstName", "lastName", "email")
            .targetType(UserDto.class)
            .build();
    }
}`,
    tags: ['Spring Batch', 'ETL', 'Job', 'Chunk'],
  },
  {
    question: 'How does Spring Batch handle errors? What is skip/retry/fault-tolerance?',
    answer: 'Skip: configure which exceptions can be skipped without failing the step. A skipped item is logged but not written. skipLimit controls how many skips are allowed before the step fails. Retry: on transient errors (e.g., DB deadlock), retry the chunk. retryLimit controls max retries. Both skip and retry require a SkipPolicy or RetryPolicy. FaultTolerant step: use .faultTolerant() to enable these. Listeners: SkipListener tracks what was skipped. ItemReadListener, ItemWriteListener for auditing. After skipLimit or retryLimit is exceeded, the step fails and the job records FAILED status in JobRepository.',
    codeExample: `@Bean
public Step robustStep(JobRepository repo, PlatformTransactionManager tx) {
    return new StepBuilder("robustStep", repo)
        .<UserDto, User>chunk(100, tx)
        .reader(reader())
        .processor(processor())
        .writer(writer())
        .faultTolerant()
            .skipLimit(10)                              // skip up to 10 bad records
            .skip(DataIntegrityViolationException.class) // skip these exceptions
            .skip(FlatFileParseException.class)
            .retryLimit(3)                              // retry up to 3 times
            .retry(DeadlockLoserDataAccessException.class)
        .listener(new SkipListener<UserDto, User>() {
            public void onSkipInWrite(User item, Throwable t) {
                log.warn("Skipped writing {}: {}", item, t.getMessage());
                // Could: save to error table for manual review
            }
        })
        .build();
}

// Restart: if job fails, restarting skips completed steps automatically
// JobLauncher restarts from the last failed step using persisted state`,
    tags: ['Spring Batch', 'Retry', 'Skip', 'FaultTolerance'],
  },
  {
    question: 'What is partitioning in Spring Batch? How do you run batch jobs in parallel?',
    answer: 'Partitioning: splits a large dataset into smaller partitions, each processed by a separate worker Step in parallel. Master step creates partition metadata (ExecutionContext per partition). Slave step processes each partition independently. MultiResourcePartitioner or RangePartitioner are common. Parallel steps: use split() to run Steps concurrently in a flow. Async ItemProcessor: wraps processor in AsyncItemProcessor to process items on a thread pool, write with AsyncItemWriter. Remote Partitioning (Spring Cloud Batch): master sends partitions via a message queue, workers on separate JVMs process them.',
    codeExample: `// Range-based partitioning (split users by ID range):
@Bean
public Step masterStep(JobRepository repo, Step workerStep) {
    return new StepBuilder("masterStep", repo)
        .partitioner("workerStep", partitioner())
        .step(workerStep)
        .gridSize(4)           // 4 partitions
        .taskExecutor(new SimpleAsyncTaskExecutor())
        .build();
}

@Bean
public Partitioner partitioner() {
    return gridSize -> {
        Map<String, ExecutionContext> partitions = new HashMap<>();
        long total = userRepo.count();
        long rangeSize = total / gridSize;
        for (int i = 0; i < gridSize; i++) {
            ExecutionContext ctx = new ExecutionContext();
            ctx.putLong("minId", i * rangeSize);
            ctx.putLong("maxId", (i + 1) * rangeSize);
            partitions.put("partition" + i, ctx);
        }
        return partitions;
    };
}

// Parallel steps (independent steps run concurrently):
@Bean
public Job parallelJob(JobRepository repo, Flow flow1, Flow flow2) {
    return new JobBuilder("parallelJob", repo)
        .start(new FlowBuilder<SimpleFlow>("split")
            .split(new SimpleAsyncTaskExecutor())
            .add(flow1, flow2)
            .build())
        .end().build();
}`,
    tags: ['Spring Batch', 'Partitioning', 'Parallel', 'Performance'],
  },
];

// ─── SPRING CLOUD ECOSYSTEM ───────────────────────────────────────────────────
export const springCloudDeepExtra: QA[] = [
  {
    question: 'What is Spring Cloud Config Server? How does centralized configuration work?',
    answer: 'Spring Cloud Config Server provides centralized, externalized configuration for distributed systems. Config server reads from a Git repo (or filesystem, Vault, S3). Each microservice (config client) fetches its config at startup via HTTP from the config server using its application name and profile. Supports encryption of sensitive values. @RefreshScope on beans + /actuator/refresh endpoint reloads config without restart (or with Spring Cloud Bus, broadcasts refresh to all instances at once). Key benefit: change configuration without redeploying. Store credentials in Vault, not in Git.',
    codeExample: `// Config Server setup:
@SpringBootApplication
@EnableConfigServer
public class ConfigServerApp { public static void main(String[] a) { SpringApplication.run(ConfigServerApp.class, a); } }

# application.yml (config server):
spring:
  cloud:
    config:
      server:
        git:
          uri: https://github.com/myorg/config-repo
          default-label: main
          search-paths: '{application}'  # subfolder per service

# Config repo structure:
# config-repo/
#   order-service/
#     application.yml          # defaults
#     application-prod.yml     # production overrides

// Config Client:
# bootstrap.yml (fetched BEFORE application.yml):
spring:
  application:
    name: order-service
  config:
    import: "configserver:http://config-server:8888"

// Refresh without restart:
@RestController
@RefreshScope              // bean re-created on /actuator/refresh
public class FeatureController {
    @Value("\${feature.newCheckout:false}")
    private boolean newCheckout;
}
// POST /actuator/refresh → reloads @Value and @ConfigurationProperties`,
    tags: ['Spring Cloud', 'Config', 'Externalized Configuration'],
  },
  {
    question: 'What is Spring Cloud Gateway? How do you configure routing, filters, and rate limiting?',
    answer: 'Spring Cloud Gateway: reactive API gateway built on WebFlux. Replaces Zuul. Routes requests to downstream microservices based on predicates (path, host, header, method). Filters modify requests/responses: AddRequestHeader, RewritePath, CircuitBreaker (Resilience4j), RateLimiter (Redis-based), RequestRateLimiter. Global filters apply to all routes. Supports load balancing via Spring Cloud LoadBalancer. Key difference from Zuul: non-blocking, built on Netty, handles high concurrency with fewer threads.',
    codeExample: `@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder b, RateLimiter rateLimiter) {
        return b.routes()
            // Route 1: order service
            .route("order-service", r -> r
                .path("/api/orders/**")
                .filters(f -> f
                    .rewritePath("/api/orders/(?<segment>.*)", "/orders/\${segment}")
                    .addRequestHeader("X-Gateway", "true")
                    .circuitBreaker(c -> c.setName("orderCB").setFallbackUri("forward:/fallback"))
                    .requestRateLimiter(l -> l
                        .setRateLimiter(redisRateLimiter())
                        .setKeyResolver(userKeyResolver())))
                .uri("lb://order-service"))  // lb:// = load balanced

            // Route 2: user service with JWT validation
            .route("user-service", r -> r
                .path("/api/users/**")
                .filters(f -> f.stripPrefix(1))
                .uri("lb://user-service"))
            .build();
    }

    @Bean
    public RedisRateLimiter redisRateLimiter() {
        return new RedisRateLimiter(10, 20); // 10 req/s, burst 20
    }

    @Bean
    public KeyResolver userKeyResolver() {
        return exchange -> Mono.just(
            exchange.getRequest().getHeaders().getFirst("X-User-Id") != null
                ? exchange.getRequest().getHeaders().getFirst("X-User-Id") : "anonymous");
    }
}`,
    tags: ['Spring Cloud', 'Gateway', 'Rate Limiting', 'Routing'],
  },
  {
    question: 'What is Spring Cloud Stream? How does it simplify event-driven microservices?',
    answer: 'Spring Cloud Stream: abstraction over message brokers (Kafka, RabbitMQ). Defines Binders (broker-specific adapters) and Bindings (application channels). You write plain functional beans (Function<I,O>, Consumer<I>, Supplier<O>). Spring Cloud Stream handles serialization, partitioning, error handling, consumer groups. Consumer group: only one instance in a group processes each message (competing consumers). Retry and DLQ are configurable per binding. Compared to direct Kafka/RabbitMQ use: more portable, less boilerplate, easier to test (TestBinder).',
    codeExample: `// No broker-specific code — just plain functions:
@Component
public class OrderFunctions {

    // Consumer: receive order events from Kafka
    @Bean
    public Consumer<OrderEvent> processOrder() {
        return event -> {
            log.info("Processing order {}", event.getOrderId());
            inventoryService.reserve(event);
        };
    }

    // Function: transform events (input → output)
    @Bean
    public Function<OrderEvent, PaymentEvent> orderToPayment() {
        return order -> new PaymentEvent(order.getOrderId(), order.getTotal());
    }

    // Supplier: produce events on demand
    @Bean
    public Supplier<OrderStatusEvent> orderStatus() {
        return () -> new OrderStatusEvent(fetchPendingOrders());
    }
}

# application.yml:
spring:
  cloud:
    stream:
      bindings:
        processOrder-in-0:
          destination: orders          # Kafka topic
          group: inventory-service     # consumer group
          consumer:
            max-attempts: 3
        orderToPayment-in-0:
          destination: orders
        orderToPayment-out-0:
          destination: payments
      kafka:
        binder:
          brokers: localhost:9092`,
    tags: ['Spring Cloud', 'Kafka', 'Event-Driven', 'Messaging'],
  },
  {
    question: 'What is Spring Cloud Sleuth and distributed tracing? How do you integrate with Zipkin?',
    answer: 'Spring Cloud Sleuth adds trace-id and span-id to every request, automatically propagated via HTTP headers (B3 propagation) and message headers. A trace spans the entire request chain across services; a span is one unit of work within a trace. Integrating Zipkin: add spring-cloud-starter-zipkin, configure zipkin.base-url. Sleuth sends span data to Zipkin asynchronously. In Spring Boot 3+: Micrometer Tracing replaces Sleuth. Use micrometer-tracing-bridge-brave or otel. OpenTelemetry: the CNCF standard — instruments code once, exports to Jaeger, Zipkin, Datadog, OTLP. All logs automatically include traceId for log correlation.',
    codeExample: `// build.gradle:
// implementation 'org.springframework.cloud:spring-cloud-starter-sleuth'
// implementation 'org.springframework.cloud:spring-cloud-sleuth-zipkin'

# application.yml:
spring:
  zipkin:
    base-url: http://zipkin:9411
  sleuth:
    sampler:
      probability: 1.0    # sample 100% in dev, 0.1 in prod

// Sleuth auto-instruments: RestTemplate, WebClient, Feign, Kafka, @Async
// Trace/span IDs appear in logs automatically:
// 2024-01-15 INFO [order-service,abc123,def456] OrderService - Processing order

// Custom spans:
@Autowired Tracer tracer;

public Order processOrder(Long id) {
    Span span = tracer.nextSpan().name("db-lookup").start();
    try (Tracer.SpanInScope ws = tracer.withSpan(span)) {
        span.tag("orderId", String.valueOf(id));
        return orderRepo.findById(id).orElseThrow();
    } finally {
        span.end();
    }
}

// Spring Boot 3 / Micrometer Tracing equivalent:
@Autowired ObservationRegistry registry;
// Observation.createNotStarted("db-lookup", registry).observe(() -> ...)`,
    tags: ['Spring Cloud', 'Sleuth', 'Tracing', 'Zipkin', 'Observability'],
  },
];

// ─── CACHING (Redis, Caffeine, Hazelcast) ────────────────────────────────────
export const cachingExtra: QA[] = [
  {
    question: 'How does Spring @Cacheable work? What are @CacheEvict and @CachePut?',
    answer: '@Cacheable: method result is stored in cache on first call; subsequent calls with the same key return cached value without executing the method. @CacheEvict: removes an entry (or all entries with allEntries=true) after the method executes. @CachePut: always executes the method but also updates the cache. Common mistake: calling @Cacheable from the same class bypasses the cache (Spring AOP self-invocation problem). Fix: inject the bean or use AspectJ weaving. Default key = method parameters. Custom key with SpEL: @Cacheable(key = "#userId"). Configure with CacheManager (SimpleCacheManager, RedisCacheManager, CaffeineCacheManager).',
    codeExample: `@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id")
    public Product findById(Long id) {
        // Only executed on cache MISS — result stored in "products" cache
        return productRepo.findById(id).orElseThrow();
    }

    @CachePut(value = "products", key = "#product.id")
    public Product update(Product product) {
        // Always executes AND updates the cache — keeps cache fresh
        return productRepo.save(product);
    }

    @CacheEvict(value = "products", key = "#id")
    public void delete(Long id) {
        // Removes from cache AFTER deleting from DB
        productRepo.deleteById(id);
    }

    @CacheEvict(value = "products", allEntries = true)
    @Scheduled(fixedDelay = 300_000) // clear all products cache every 5 min
    public void clearProductCache() {}
}

// Configure Redis cache with TTL:
@Bean
public RedisCacheManager cacheManager(RedisConnectionFactory factory) {
    RedisCacheConfiguration config = RedisCacheConfiguration.defaultCacheConfig()
        .entryTtl(Duration.ofMinutes(10))
        .serializeValuesWith(
            RedisSerializationContext.SerializationPair.fromSerializer(
                new GenericJackson2JsonRedisSerializer()));
    return RedisCacheManager.builder(factory)
        .cacheDefaults(config)
        .withCacheConfiguration("products", config.entryTtl(Duration.ofHours(1)))
        .build();
}`,
    tags: ['Caching', 'Redis', 'Spring', '@Cacheable'],
  },
  {
    question: 'What is Redis? How do you use RedisTemplate? What are cache-aside, write-through, and write-behind patterns?',
    answer: 'Redis: in-memory data store. Supports strings, lists, hashes, sets, sorted sets, streams. Sub-millisecond latency. Used for caching, sessions, pub/sub, rate limiting, distributed locks, leaderboards. RedisTemplate: Spring abstraction over Jedis/Lettuce clients. Cache-aside (lazy loading): app checks cache first; on miss, loads from DB and populates cache. Write-through: on write, update both DB and cache synchronously. Ensures consistency but adds write latency. Write-behind (write-back): write to cache immediately, asynchronously flush to DB later. High throughput but risk of data loss on crash. Cache-aside is most common for reads; write-through for critical data consistency.',
    codeExample: `// RedisTemplate configuration:
@Bean
public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory factory) {
    RedisTemplate<String, Object> t = new RedisTemplate<>();
    t.setConnectionFactory(factory);
    t.setKeySerializer(new StringRedisSerializer());
    t.setValueSerializer(new GenericJackson2JsonRedisSerializer());
    return t;
}

// Cache-aside pattern implementation:
@Service
public class OrderCacheService {
    @Autowired RedisTemplate<String, Object> redis;
    @Autowired OrderRepository orderRepo;

    public Order getOrder(Long id) {
        String key = "order:" + id;
        // 1. Check cache
        Order cached = (Order) redis.opsForValue().get(key);
        if (cached != null) return cached;

        // 2. Cache MISS — load from DB
        Order order = orderRepo.findById(id).orElseThrow();

        // 3. Populate cache with TTL
        redis.opsForValue().set(key, order, Duration.ofMinutes(30));
        return order;
    }

    // Write-through: update both DB and cache atomically
    public Order updateOrder(Order order) {
        Order saved = orderRepo.save(order);              // write DB
        redis.opsForValue().set("order:" + saved.getId(), saved, Duration.ofMinutes(30)); // update cache
        return saved;
    }

    // Distributed counter (atomic):
    public Long incrementViews(Long productId) {
        return redis.opsForValue().increment("views:" + productId);
    }
}`,
    tags: ['Redis', 'Caching', 'Cache-Aside', 'Write-Through'],
  },
  {
    question: 'What is Caffeine cache? When do you choose local cache vs distributed cache? What is cache stampede?',
    answer: 'Caffeine: high-performance local (in-process) cache for Java. Uses Window TinyLFU eviction (better hit rate than LRU for most workloads). Not distributed — each JVM has its own copy. Use local cache: when data is small, read-heavy, tolerable to be slightly stale, and doesn\'t need to be shared between instances (e.g., config values, reference data). Use Redis (distributed cache): when multiple instances must see the same cached values, or when the cache must survive app restarts. Cache stampede (thundering herd): when a popular cache entry expires, many threads simultaneously miss and all query the DB at once. Prevention: probabilistic early expiration, request coalescing (lock per key), background refresh.',
    codeExample: `// Caffeine (local, in-process cache):
@Bean
public CacheManager cacheManager() {
    CaffeineCacheManager manager = new CaffeineCacheManager("products");
    manager.setCaffeine(
        Caffeine.newBuilder()
            .maximumSize(1000)              // max entries
            .expireAfterWrite(5, TimeUnit.MINUTES)
            .recordStats()                 // enables metrics
    );
    return manager;
}

// Layered cache: L1=Caffeine (fast, local), L2=Redis (shared, persistent)
@Service
public class TieredCacheService {
    @Autowired CaffeineCache l1;
    @Autowired RedisTemplate<String, Object> l2;

    public Object get(String key) {
        Object v = l1.get(key, Object.class);   // L1 hit
        if (v != null) return v;
        v = l2.opsForValue().get(key);           // L2 hit
        if (v != null) l1.put(key, v);           // populate L1
        return v;
    }
}

// Cache stampede prevention using request coalescing:
// Java: use ConcurrentHashMap.computeIfAbsent to ensure one thread loads
private final ConcurrentHashMap<String, CompletableFuture<Product>> loading = new ConcurrentHashMap<>();

public Product getProduct(String id) {
    return loading.computeIfAbsent(id, k ->
        CompletableFuture.supplyAsync(() -> productRepo.findById(k))
    ).join(); // other threads wait for the same future
}`,
    tags: ['Caffeine', 'Cache', 'Redis', 'Performance', 'Stampede'],
  },
];

// ─── DATABASE MIGRATIONS ──────────────────────────────────────────────────────
export const dbMigrationsExtra: QA[] = [
  {
    question: 'What is Flyway? How does it work? When would you choose Flyway vs Liquibase?',
    answer: 'Flyway: convention-based database migration tool. Migrations are SQL files named V1__Create_users.sql (versioned), R__Refresh_view.sql (repeatable), or U1__Undo.sql (undo). Flyway tracks applied migrations in flyway_schema_history table. On app startup, it runs any unexecuted migrations in order. Liquibase: uses changesets in XML/YAML/JSON/SQL. More flexible rollback, supports database diffs, multi-environment management. Flyway: simpler, SQL-first, great for teams that prefer plain SQL. Liquibase: better for complex rollbacks, multi-database support, and when you need database-agnostic changes. Both integrate with Spring Boot via auto-configuration.',
    codeExample: `// Flyway — migration files go in db/migration/:
// V1__Create_users_table.sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

// V2__Add_status_column.sql
ALTER TABLE users ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL;

// V3__Create_orders_table.sql
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

// Spring Boot auto-configures Flyway — add dependency and it runs on startup.
// application.yml:
// spring.flyway.enabled=true
// spring.flyway.baseline-on-migrate=true  (for existing databases)

// Liquibase equivalent — db/changelog/db.changelog-master.yaml:
// databaseChangeLog:
//   - changeSet:
//       id: 1
//       author: dev-team
//       changes:
//         - createTable:
//             tableName: users
//             columns:
//               - column:
//                   name: id
//                   type: bigint
//                   autoIncrement: true
//                   constraints: { primaryKey: true }`,
    tags: ['Flyway', 'Liquibase', 'Database', 'Migrations'],
  },
  {
    question: 'How do you perform zero-downtime database migrations? What is the Expand/Contract pattern?',
    answer: 'Zero-downtime migrations: never drop or rename a column in one step. The Expand/Contract (or parallel-change) pattern: Expand phase — add new column/table, keep old one. Deploy new code that writes to BOTH old and new. Contract phase — once all instances run new code, backfill old data, then drop old column in a separate migration. Example: renaming a column: 1) Add new column, 2) Deploy code writing to both, 3) Backfill, 4) Deploy code reading new column only, 5) Drop old column. For large tables: use pt-online-schema-change (Percona) or gh-ost (GitHub) to alter without locking.',
    codeExample: `// Scenario: rename column 'name' to 'full_name' without downtime

// Phase 1 — EXPAND: add new column (V5 migration)
ALTER TABLE users ADD COLUMN full_name VARCHAR(255);

// Phase 2 — deploy app code that writes to BOTH columns:
@Entity
public class User {
    @Column(name = "name")
    private String name;            // OLD: still written for backward compat

    @Column(name = "full_name")
    private String fullName;        // NEW: also written

    @PrePersist @PreUpdate
    void sync() { this.fullName = this.name; } // keep in sync during transition
}

// Phase 3 — backfill (V6 migration):
UPDATE users SET full_name = name WHERE full_name IS NULL;

// Phase 4 — deploy code that reads from new column only:
@Entity
public class User {
    @Column(name = "full_name") // only reads/writes new column
    private String fullName;
    // old 'name' field removed from entity
}

// Phase 5 — CONTRACT: drop old column (V7 migration, deployed after all instances updated):
ALTER TABLE users DROP COLUMN name;

// For large tables (millions of rows), use LOCK=NONE:
// ALTER TABLE users ADD COLUMN full_name VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;`,
    tags: ['Database', 'Migrations', 'Zero-Downtime', 'Expand-Contract'],
  },
];

// ─── gRPC, GraphQL, REST BEST PRACTICES ──────────────────────────────────────
export const modernApisExtra: QA[] = [
  {
    question: 'What is gRPC? How does it differ from REST? When should you use it?',
    answer: 'gRPC: Google\'s RPC framework using HTTP/2 and Protocol Buffers (protobuf). Key differences: Binary protocol (smaller, faster than JSON), strongly typed contract-first (proto files), bidirectional streaming, multiplexing (many requests on one connection), code generation for all languages. REST uses text-based JSON, HTTP/1.1, no strong contract (OpenAPI is optional). Use gRPC: internal service-to-service communication, high-throughput/low-latency requirements, streaming data (e.g., real-time feeds), polyglot environments. Use REST: external/public APIs, browser clients, simple CRUD, when human-readable format matters.',
    codeExample: `// 1. Define service in proto file (order.proto):
syntax = "proto3";

service OrderService {
    rpc CreateOrder (CreateOrderRequest) returns (OrderResponse);
    rpc GetOrderStream (OrderQuery) returns (stream Order); // server streaming
    rpc ProcessOrders (stream Order) returns (Summary);    // client streaming
}

message CreateOrderRequest {
    string user_id = 1;
    repeated OrderItem items = 2;
    double total = 3;
}

// 2. Spring Boot gRPC service implementation:
@GrpcService
public class OrderGrpcService extends OrderServiceGrpc.OrderServiceImplBase {

    @Override
    public void createOrder(CreateOrderRequest req, StreamObserver<OrderResponse> observer) {
        Order order = orderService.create(req.getUserId(), req.getTotal());
        observer.onNext(OrderResponse.newBuilder()
            .setOrderId(order.getId().toString())
            .setStatus("CREATED")
            .build());
        observer.onCompleted();
    }
}

// gRPC client call (from another microservice):
@GrpcClient("order-service")
OrderServiceGrpc.OrderServiceBlockingStub orderStub;

OrderResponse response = orderStub.createOrder(
    CreateOrderRequest.newBuilder().setUserId("u1").setTotal(99.9).build());`,
    tags: ['gRPC', 'Protobuf', 'RPC', 'Microservices'],
  },
  {
    question: 'What are REST API best practices? How do you handle versioning, pagination, and HATEOAS?',
    answer: 'Versioning: URL path (/api/v1/orders), request header (Accept: application/vnd.myapi.v1+json), or query param. URL versioning is simplest. Pagination: offset-based (page=2&size=20) — simple but slow for large offsets. Cursor-based (?after=lastId) — efficient for infinite scroll. Return total count in headers. HATEOAS: Hypermedia As The Engine Of Application State — responses include links to related actions. Clients don\'t hardcode URLs. Spring HATEOAS provides EntityModel, CollectionModel. Other best practices: use nouns not verbs (GET /orders not GET /getOrders), use HTTP methods correctly (POST=create, PUT=replace, PATCH=partial update, DELETE=remove), return proper status codes, use snake_case or camelCase consistently.',
    codeExample: `// Cursor-based pagination (efficient for large datasets):
@GetMapping("/orders")
public ResponseEntity<Page<OrderDto>> getOrders(
    @RequestParam(required = false) Long after,  // cursor = last seen ID
    @RequestParam(defaultValue = "20") int size) {

    Page<Order> page = after != null
        ? orderRepo.findByIdGreaterThan(after, PageRequest.of(0, size))
        : orderRepo.findAll(PageRequest.of(0, size));

    return ResponseEntity.ok()
        .header("X-Total-Count", String.valueOf(orderRepo.count()))
        .header("X-Next-Cursor", page.hasNext()
            ? String.valueOf(page.getContent().getLast().getId()) : "")
        .body(page.map(mapper::toDto));
}

// HATEOAS with Spring HATEOAS:
@GetMapping("/orders/{id}")
public EntityModel<OrderDto> getOrder(@PathVariable Long id) {
    OrderDto dto = orderService.findById(id);
    return EntityModel.of(dto,
        linkTo(methodOn(OrderController.class).getOrder(id)).withSelfRel(),
        linkTo(methodOn(OrderController.class).cancelOrder(id)).withRel("cancel"),
        linkTo(methodOn(OrderController.class).getOrders(null, 20)).withRel("orders")
    );
}
// Response includes: { "id": 1, ..., "_links": { "self": {...}, "cancel": {...} } }

// API versioning via header:
@GetMapping(value = "/orders/{id}", headers = "API-Version=2")
public OrderDtoV2 getOrderV2(@PathVariable Long id) { ... }`,
    tags: ['REST', 'API Design', 'Pagination', 'HATEOAS', 'Versioning'],
  },
  {
    question: 'What is GraphQL? How does it differ from REST? What are resolvers and N+1 in GraphQL?',
    answer: 'GraphQL: query language for APIs. Client specifies EXACTLY what fields it needs — no over-fetching (getting too many fields) or under-fetching (needing multiple requests). Single endpoint (POST /graphql). Schema-first: define types in SDL (Schema Definition Language). Mutations = writes, Queries = reads, Subscriptions = real-time. N+1 problem in GraphQL: for each Order, fetching the User requires a separate DB call — n orders = n+1 queries. Solution: DataLoader (batching) — accumulates all user IDs from a batch of orders, then fetches them in one query. Spring for GraphQL (Spring Boot 3+) provides @SchemaMapping, @QueryMapping, @MutationMapping, DataFetcher.',
    codeExample: `// schema.graphqls:
type Query {
    orders(userId: ID): [Order]
    order(id: ID!): Order
}
type Order {
    id: ID!
    total: Float!
    status: String!
    user: User        # nested — triggers N+1 if not batched
}
type User { id: ID!, name: String!, email: String! }

// Spring for GraphQL:
@Controller
public class OrderGraphQLController {

    @QueryMapping
    public List<Order> orders(@Argument String userId) {
        return orderService.findByUserId(userId);
    }

    // DataLoader prevents N+1 — batches all user fetches:
    @SchemaMapping(typeName = "Order", field = "user")
    public CompletableFuture<User> user(Order order, DataLoader<Long, User> dataLoader) {
        return dataLoader.load(order.getUserId()); // batched!
    }
}

// Register DataLoader:
@Bean
public BatchLoaderRegistry batchLoaderRegistry(UserService userService) {
    return registrar -> registrar.forTypePair(Long.class, User.class)
        .registerMappedBatchLoader((ids, env) ->
            Mono.fromCallable(() -> userService.findByIds(ids)
                .stream().collect(Collectors.toMap(User::getId, u -> u))));
}`,
    tags: ['GraphQL', 'Spring', 'DataLoader', 'N+1'],
  },
];

// ─── SECURITY DEEPER ──────────────────────────────────────────────────────────
export const securityDeepExtra: QA[] = [
  {
    question: 'What is CORS? How do you configure it in Spring Boot? What is CSRF and how does Spring prevent it?',
    answer: 'CORS (Cross-Origin Resource Sharing): browser security mechanism that blocks web pages from making requests to a different domain than the one that served the page. Server must include Access-Control-Allow-Origin header to permit cross-origin requests. Simple solution: @CrossOrigin on controllers. Global: configure WebMvcConfigurer.addCorsMappings or SecurityFilterChain CORS config. CSRF (Cross-Site Request Forgery): attacker tricks a user\'s browser into making an authenticated request to your app. Prevented by CSRF tokens (unique per session, included in forms, validated on POST/PUT/DELETE). For stateless REST APIs (JWT auth, no sessions): disable CSRF — there\'s no session for the attacker to exploit.',
    codeExample: `// Global CORS config (Spring MVC):
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://myapp.com", "https://staging.myapp.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
    }
}

// Spring Security CORS + CSRF config:
@Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .cors(cors -> cors.configurationSource(request -> {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOrigins(List.of("https://myapp.com"));
            config.setAllowedMethods(List.of("*"));
            config.setAllowCredentials(true);
            return config;
        }))
        // CSRF: disable for stateless JWT APIs (no session to hijack)
        .csrf(csrf -> csrf.disable())
        // OR: enable with custom token repository for traditional session apps:
        // .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
        .build();
}`,
    tags: ['Security', 'CORS', 'CSRF', 'Spring Security'],
  },
  {
    question: 'Explain OAuth 2.0 flows. What is PKCE? When do you use each grant type?',
    answer: 'OAuth 2.0 grant types: Authorization Code: user → authorization server → code → exchange for token. Most secure, for web apps with backend. Implicit: deprecated, returned token in URL (insecure). Client Credentials: service-to-service, no user involved — client authenticates with client_id + client_secret. Resource Owner Password: deprecated, user sends username/password directly — only for trusted first-party apps. Device Code: smart TVs, CLI tools. PKCE (Proof Key for Code Exchange): extension to Authorization Code for public clients (SPAs, mobile apps) that cannot securely store a client_secret. Uses code_verifier (random string) and code_challenge (SHA256 hash of verifier). Prevents authorization code interception attacks.',
    codeExample: `// Spring Boot as OAuth2 Resource Server (validates JWT from any auth server):
@Bean
public SecurityFilterChain resourceServer(HttpSecurity http) throws Exception {
    return http
        .authorizeHttpRequests(a -> a
            .requestMatchers("/api/public/**").permitAll()
            .requestMatchers("/api/admin/**").hasAuthority("SCOPE_admin")
            .anyRequest().authenticated())
        .oauth2ResourceServer(oauth2 -> oauth2
            .jwt(jwt -> jwt.jwtAuthenticationConverter(jwtAuthConverter())))
        .build();
}

// Client Credentials flow (service-to-service):
@Bean
public WebClient webClient(OAuth2AuthorizedClientManager clientManager) {
    return WebClient.builder()
        .filter(new ServletOAuth2AuthorizedClientExchangeFilterFunction(clientManager))
        .build();
}

// application.yml (OAuth2 client with client_credentials):
// spring:
//   security:
//     oauth2:
//       client:
//         registration:
//           order-service:
//             client-id: order-service
//             client-secret: \${ORDER_SERVICE_SECRET}
//             authorization-grant-type: client_credentials
//             scope: inventory:read
//         provider:
//           keycloak:
//             issuer-uri: https://auth.example.com/realms/myapp

// PKCE in practice: used by Angular/React SPAs — browser generates code_verifier,
// sends code_challenge to auth server, redeems code with verifier (never exposed)`,
    tags: ['OAuth2', 'Security', 'JWT', 'PKCE'],
  },
  {
    question: 'What are rate limiting algorithms? How do you implement rate limiting in Spring Boot?',
    answer: 'Token Bucket: a bucket holds N tokens, refilled at rate R. Each request consumes 1 token. Allows bursts up to bucket size. Most common algorithm. Leaky Bucket: requests drain from bucket at fixed rate. Smooths traffic (no bursts), can drop requests if bucket is full. Fixed Window: count requests per fixed time window (e.g., 100 req/min). Prone to edge case: 200 requests in 2 seconds at window boundary. Sliding Window Log: track timestamps of each request, count within last 60s. Accurate but memory-heavy. Sliding Window Counter: approximate fixed window using weighted previous window count. Implementation options: Spring Cloud Gateway (Redis-backed RateLimiter), Bucket4j library, Resilience4j RateLimiter.',
    codeExample: `// Bucket4j rate limiter with Redis (distributed, for multiple instances):
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    @Autowired ProxyManager<String> proxyManager;

    @Override
    protected void doFilterInternal(HttpServletRequest req,
                                    HttpServletResponse res,
                                    FilterChain chain) throws IOException, ServletException {
        String clientIp = req.getRemoteAddr();
        String userId = extractUserId(req);
        String key = "ratelimit:" + (userId != null ? userId : clientIp);

        BucketConfiguration config = BucketConfiguration.builder()
            .addLimit(Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1))))
            .build();

        Bucket bucket = proxyManager.builder().build(key, () -> config);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            res.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            chain.doFilter(req, res);
        } else {
            res.setStatus(429); // Too Many Requests
            res.setHeader("X-Rate-Limit-Retry-After-Seconds",
                String.valueOf(probe.getNanosToWaitForRefill() / 1_000_000_000));
            res.getWriter().write("Rate limit exceeded");
        }
    }
}`,
    tags: ['Rate Limiting', 'Security', 'Token Bucket', 'Redis'],
  },
];

// ─── DISTRIBUTED SYSTEMS PATTERNS ────────────────────────────────────────────
export const distributedSystemsDeepExtra: QA[] = [
  {
    question: 'How do you implement distributed locking? Compare Redis SETNX, Redisson, and database locks.',
    answer: 'Distributed lock: ensures only one instance executes a critical section across multiple JVMs. Redis SETNX (SET if Not eXists): SET key value NX EX 30 — atomic, with TTL to prevent deadlock. Must generate a unique value per lock holder and only DELETE if value matches (Lua script for atomicity). Redisson: mature Java client, provides RLock with watchdog (auto-renews TTL while lock held), fair locks, read/write locks. Handles edge cases automatically. Database lock (SELECT FOR UPDATE): uses DB transaction to hold lock — simple but ties lock lifetime to DB connection. Use Redisson for production distributed locking. Database locks are fine for single-DB scenarios.',
    codeExample: `// Option 1: Redis manual lock (Lua script for atomic unlock):
@Service
public class RedisLockService {
    @Autowired StringRedisTemplate redis;

    private static final String UNLOCK_SCRIPT =
        "if redis.call('get',KEYS[1]) == ARGV[1] then " +
        "return redis.call('del',KEYS[1]) else return 0 end";

    public boolean tryLock(String key, String value, Duration ttl) {
        Boolean result = redis.opsForValue().setIfAbsent(key, value, ttl);
        return Boolean.TRUE.equals(result);
    }

    public void unlock(String key, String value) {
        redis.execute(new DefaultRedisScript<>(UNLOCK_SCRIPT, Long.class),
            List.of(key), value);
    }
}

// Option 2: Redisson (recommended for production):
@Autowired RedissonClient redisson;

public void processOrder(Long orderId) {
    RLock lock = redisson.getLock("order-lock:" + orderId);
    try {
        if (lock.tryLock(5, 30, TimeUnit.SECONDS)) { // wait 5s, TTL 30s
            // critical section — only one JVM runs this at a time
            processOrderInternal(orderId);
        }
    } catch (InterruptedException e) {
        Thread.currentThread().interrupt();
    } finally {
        if (lock.isHeldByCurrentThread()) lock.unlock();
    }
}`,
    tags: ['Distributed Systems', 'Redis', 'Locks', 'Redisson'],
  },
  {
    question: 'What is consistent hashing? Why is it used in distributed caches and load balancers?',
    answer: 'Consistent hashing: a technique to distribute keys across nodes such that adding/removing a node remaps only K/N keys (K=total keys, N=nodes), instead of remapping all keys as in modular hashing. How it works: nodes and keys are placed on a virtual ring (0..2^32). A key is assigned to the first node clockwise on the ring. Virtual nodes: each physical node gets multiple positions on the ring to improve uniformity. Used in: distributed caches (Redis Cluster, Memcached), Cassandra, DynamoDB, consistent load balancers. When a node is added: only the keys between the new node and its predecessor are remapped. Minimizes cache invalidation.',
    codeExample: `// Consistent hashing implementation sketch:
public class ConsistentHashRing<N> {
    private final TreeMap<Long, N> ring = new TreeMap<>();
    private final int virtualNodes;
    private final MessageDigest md5;

    public ConsistentHashRing(int virtualNodes) throws Exception {
        this.virtualNodes = virtualNodes;
        this.md5 = MessageDigest.getInstance("MD5");
    }

    public void addNode(N node) {
        for (int i = 0; i < virtualNodes; i++) {
            long hash = hash(node.toString() + "-vnode-" + i);
            ring.put(hash, node);
        }
    }

    public void removeNode(N node) {
        for (int i = 0; i < virtualNodes; i++) {
            ring.remove(hash(node.toString() + "-vnode-" + i));
        }
    }

    public N getNode(String key) {
        if (ring.isEmpty()) return null;
        long hash = hash(key);
        Map.Entry<Long, N> entry = ring.ceilingEntry(hash);
        return (entry != null ? entry : ring.firstEntry()).getValue(); // wrap around
    }

    private long hash(String key) { /* MD5 → long */ }
}

// Why virtual nodes matter:
// Without: with 3 nodes, one might get 80% of keys
// With 150 virtual nodes each: load spreads evenly (within ~5%)`,
    tags: ['Distributed Systems', 'Consistent Hashing', 'Cache', 'Load Balancing'],
  },
  {
    question: 'What is the Java Memory Model (JMM)? What are happens-before relationships?',
    answer: 'Java Memory Model defines the rules for memory visibility between threads. Without synchronization, a thread may read stale values from CPU cache. Happens-before (HB): if action A HB action B, A\'s effects are visible to B. Rules: Thread start: starting a thread HB all actions in that thread. Volatile write: volatile write HB any subsequent volatile read of the same variable. Monitor unlock: releasing synchronized lock HB any subsequent acquisition. Thread join: all actions in a thread HB a successful join() on that thread. Program order: within one thread, each action HB the next. If no HB relationship exists between two conflicting accesses — you have a data race. Solution: use volatile, synchronized, java.util.concurrent locks, or Atomic classes.',
    codeExample: `// Happens-before with volatile:
class Shared {
    volatile boolean ready = false;
    int value;

    void writer() {
        value = 42;           // Step 1 (regular write)
        ready = true;         // Step 2: volatile write — establishes HB
    }

    void reader() {
        while (!ready) {}     // Step 3: volatile read — sees HB write
        System.out.println(value); // Step 4: sees value=42 (HB guarantee)
    }
    // Without volatile: value=42 might not be visible to reader!
}

// Happens-before with synchronized:
class Counter {
    private int count = 0;

    synchronized void increment() { count++; } // unlock HB next lock
    synchronized int get() { return count; }
}

// Common pitfall — no HB:
class Broken {
    int flag = 0; // NOT volatile, NOT synchronized
    void write() { flag = 1; }
    void read()  {
        if (flag == 1) { /* may NEVER see this! CPU reorder, cache visibility */ }
    }
}

// JMM guarantees for final fields:
// After constructor completes, all threads see the final field values
// (no synchronization needed for reading final fields)`,
    tags: ['JMM', 'Threading', 'Happens-Before', 'Volatile'],
  },
];

// ─── JVM TUNING & PROFILING ───────────────────────────────────────────────────
export const jvmTuningExtra: QA[] = [
  {
    question: 'What are the key JVM flags for production? How do you size the heap and choose a GC?',
    answer: 'Heap sizing: -Xms and -Xmx should be equal in production (avoid resize pauses). Start with 70-75% of available RAM, leaving room for off-heap (Metaspace, native threads, NIO buffers). GC selection: G1GC (default Java 11+): balanced throughput/pause. Configure -XX:MaxGCPauseMillis=200 (target 200ms pause). ZGC (Java 15+): sub-millisecond pauses, good for latency-sensitive apps, scales to terabyte heaps. Use -XX:+UseZGC. Shenandoah: similar to ZGC, concurrent compaction. For batch/throughput apps: -XX:+UseParallelGC. GC logging: -Xlog:gc*:file=/var/log/app/gc.log:time,uptime:filecount=5,filesize=20m. Enable heap dumps: -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/.',
    codeExample: `# Production JVM flags (Java 17+, G1GC):
JAVA_OPTS="\
  -Xms2g -Xmx2g \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:G1HeapRegionSize=16m \
  -XX:+ExplicitGCInvokesConcurrent \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/dumps/ \
  -Xlog:gc*:file=/var/log/gc.log:time,uptime:filecount=5,filesize=50m \
  -XX:+UseStringDeduplication"

# ZGC for low-latency (Java 17+, sub-ms pauses):
JAVA_OPTS="-Xms4g -Xmx4g -XX:+UseZGC -XX:SoftMaxHeapSize=3g"

# Kubernetes resource-aware (container memory limits):
JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"
# Java 11+: auto-detects container memory limits (cgroups)
# -XX:MaxRAMPercentage=75 → use 75% of container RAM for heap

# Thread dump from running JVM:
# jstack <pid> > thread-dump.txt
# kill -3 <pid>   (sends SIGQUIT, prints thread dump to stdout)

# Heap dump from running JVM:
# jmap -dump:live,format=b,file=heap.hprof <pid>

# GC stats live:
# jstat -gcutil <pid> 1000   (every 1 second)
# S0  S1   E   O   M   CCS  YGC   YGCT  FGC   FGCT   GCT
# 0.0 100  73  24  97  91   3145  6.3   0     0.0    6.3`,
    tags: ['JVM', 'GC', 'Performance', 'Tuning', 'Production'],
  },
  {
    question: 'How do you analyze a heap dump? What are common memory leak patterns in Java?',
    answer: 'Tools: Eclipse MAT (Memory Analyzer), VisualVM, JProfiler, YourKit, IntelliJ Profiler. Steps: 1) Generate heap dump (-XX:+HeapDumpOnOutOfMemoryError or jmap). 2) Open in MAT. 3) Check "Leak Suspects" report. 4) Look at retained heap (memory object keeps alive). 5) Follow the dominator tree to find the GC root holding all the memory. Common leaks: Static collections that grow unboundedly (static Map<> caches). ThreadLocal not removed — leak in thread pool (thread never terminates). Event listeners/callbacks never deregistered. Inner class holding outer class reference. Open ResultSet/Connection never closed. Growing session attributes. Unclosed streams.',
    codeExample: `// Common memory leak patterns:

// 1. Static cache without eviction (LEAK):
class LeakyCache {
    private static final Map<String, byte[]> cache = new HashMap<>();
    public static void store(String key, byte[] data) {
        cache.put(key, data); // grows forever, never evicted
    }
}
// Fix: use Caffeine or LinkedHashMap with removeEldestEntry

// 2. ThreadLocal leak in thread pool:
private static ThreadLocal<UserContext> context = new ThreadLocal<>();
// In servlet filter:
context.set(new UserContext(request));
// ... process ...
// If you forget:
// context.remove(); // MUST clean up — thread is reused, keeps old context!

// 3. Non-static inner class holding outer class reference:
class OuterService {
    private byte[] bigData = new byte[10_000_000];

    class InnerJob implements Runnable {
        public void run() { /* implicitly holds reference to OuterService */ }
    }
}
// Fix: make inner class static (or use lambda/external class)

// 4. Listener never deregistered:
eventPublisher.addEventListener(myListener);  // register
// If myListener is never removed → eventPublisher holds strong reference → no GC

// MAT commands:
// OQL: SELECT * FROM java.util.HashMap WHERE size > 10000
// Leak suspects: shows objects with large retained heap
// Dominator tree: shows what's keeping objects alive`,
    tags: ['JVM', 'Memory Leak', 'Heap Dump', 'MAT', 'Profiling'],
  },
];

// ─── KUBERNETES DEEPER ────────────────────────────────────────────────────────
export const kubernetesDeepExtra: QA[] = [
  {
    question: 'What is HPA? How do you configure ConfigMap and Secrets in Kubernetes for Spring Boot?',
    answer: 'HPA (HorizontalPodAutoscaler): automatically scales the number of pods based on CPU, memory, or custom metrics (via Prometheus + KEDA). Requires metrics-server. Targets a Deployment/StatefulSet. min/max replicas, target CPU utilization. ConfigMap: stores non-secret configuration (environment variables, config files). Injected as env vars or mounted as files. Secret: like ConfigMap but base64-encoded (not truly encrypted by default — use Sealed Secrets or Vault for real encryption). Best practice: mount application.properties as a ConfigMap file, DB passwords from Secret, use Vault sidecar injector for production credentials.',
    codeExample: `# HPA: scale order-service pods when CPU > 70%
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: AverageValue
        averageValue: 512Mi

---
# ConfigMap: non-sensitive config
apiVersion: v1
kind: ConfigMap
metadata:
  name: order-service-config
data:
  application.yml: |
    spring:
      datasource:
        url: jdbc:postgresql://postgres:5432/orders
      kafka:
        bootstrap-servers: kafka:9092
    app:
      order-timeout: 30m

---
# Secret: sensitive values (use Vault in production)
apiVersion: v1
kind: Secret
metadata:
  name: order-service-secrets
type: Opaque
stringData:
  DB_PASSWORD: mypassword     # base64 encoded automatically
  JWT_SECRET: supersecretkey

---
# Deployment: mount both
spec:
  containers:
  - name: order-service
    image: myrepo/order-service:latest
    envFrom:
    - secretRef:
        name: order-service-secrets
    volumeMounts:
    - name: config
      mountPath: /config
  volumes:
  - name: config
    configMap:
      name: order-service-config`,
    tags: ['Kubernetes', 'HPA', 'ConfigMap', 'Secrets', 'Scaling'],
  },
  {
    question: 'What is the difference between StatefulSet and Deployment in Kubernetes? When do you use each for Java backends?',
    answer: 'Deployment: manages stateless pods. Pods are interchangeable — any pod can handle any request. On restart, pods get new random names. No stable storage. Use for: Spring Boot REST APIs, microservices, batch workers. StatefulSet: manages stateful pods with stable identity. Each pod has a predictable name (pod-0, pod-1), stable network identity (DNS), and its own PersistentVolumeClaim. Pods start/stop in order. Use for: databases (Postgres, MySQL), Kafka brokers, Zookeeper, Elasticsearch — anything that needs stable storage or identity. Java apps: almost always Deployment. Exception: if your Java app has local state (embedded H2, local Kafka streams store) — StatefulSet.',
    codeExample: `# Deployment (stateless Spring Boot API):
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: order-api
  template:
    metadata:
      labels: { app: order-api }
    spec:
      containers:
      - name: order-api
        image: myrepo/order-api:latest
        resources:
          requests: { cpu: "250m", memory: "512Mi" }
          limits:   { cpu: "1",    memory: "1Gi" }
        livenessProbe:
          httpGet: { path: /actuator/health/liveness, port: 8080 }
          initialDelaySeconds: 30
        readinessProbe:
          httpGet: { path: /actuator/health/readiness, port: 8080 }
          initialDelaySeconds: 10

---
# StatefulSet (Kafka Streams app with local RocksDB store):
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: order-streams
spec:
  serviceName: order-streams
  replicas: 3
  volumeClaimTemplates:        # each pod gets its OWN PVC
  - metadata: { name: kafka-streams-store }
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 10Gi
  template:
    spec:
      containers:
      - name: order-streams
        volumeMounts:
        - name: kafka-streams-store
          mountPath: /data/kafka-streams`,
    tags: ['Kubernetes', 'StatefulSet', 'Deployment', 'Microservices'],
  },
];

// ─── AWS DEEPER ───────────────────────────────────────────────────────────────
export const awsDeepExtra: QA[] = [
  {
    question: 'What is the difference between SQS and SNS? When do you use each? What is a dead letter queue?',
    answer: 'SQS (Simple Queue Service): point-to-point queue. One message, one consumer (or one competing consumer group). Pull-based. Two types: Standard (at-least-once, best-effort ordering) and FIFO (exactly-once, strict ordering, 300 TPS). SNS (Simple Notification Service): pub/sub topic. One message → multiple subscribers (SQS queues, Lambda, HTTP, email). Push-based fan-out. Pattern: SNS → multiple SQS queues (fan-out pattern). Dead Letter Queue (DLQ): if a message fails processing N times (maxReceiveCount), it is moved to the DLQ for investigation. Essential for preventing poison messages from blocking the queue. Configure via RedrivePolicy.',
    codeExample: `// Spring Boot SQS with Spring Cloud AWS:
@SqsListener(value = "order-events-queue", acknowledgementMode = SqsAcknowledgementMode.ON_SUCCESS)
public void handleOrder(OrderEvent event, Acknowledgement ack) {
    try {
        orderService.process(event);
        ack.acknowledge();    // removes from queue only on success
    } catch (RetryableException e) {
        // DON'T acknowledge — message goes back, eventually to DLQ
        throw e;
    }
}

// Sending to SNS (fan-out to multiple SQS queues):
@Autowired SnsTemplate snsTemplate;

public void publishOrderEvent(OrderEvent event) {
    snsTemplate.sendNotification(
        "arn:aws:sns:us-east-1:123456789:order-events",
        new NotificationRequest<>(event, "Order placed"),
        Map.of("eventType", MessageAttributeValue.builder()
            .stringValue("ORDER_PLACED").dataType("String").build())
    );
}

// DLQ policy (CloudFormation/CDK):
// Order queue → maxReceiveCount: 3 → DLQ
// After 3 failed attempts, message lands in order-events-dlq
// CloudWatch alarm on DLQ depth → PagerDuty alert

// FIFO queue — deduplication:
SqsClient sqs = SqsClient.create();
sqs.sendMessage(r -> r
    .queueUrl("https://sqs.us-east-1.amazonaws.com/123/orders.fifo")
    .messageBody(json)
    .messageGroupId("user-" + userId)            // ordering per user
    .messageDeduplicationId(UUID.randomUUID().toString())); // idempotent`,
    tags: ['AWS', 'SQS', 'SNS', 'DLQ', 'Messaging'],
  },
  {
    question: 'What is DynamoDB? When would you choose it over RDS? What is partition key design?',
    answer: 'DynamoDB: AWS managed NoSQL key-value/document store. Millisecond latency at any scale, serverless (no provisioning), automatic scaling. Partition key: determines which partition (physical node) holds the data. Sort key: allows range queries within a partition. Must think about access patterns upfront — DynamoDB is query-pattern-driven, not schema-first. Choose DynamoDB over RDS: need >100K writes/sec, serverless cost model, simple access patterns (key lookups, range queries). Choose RDS: complex SQL joins, strong ACID guarantees across many entities, ad-hoc queries, existing SQL expertise. Bad partition key: userId for a "hot user" — one user generates all traffic to one partition (hot partition). Good key: orderId or userId#date for distributed load.',
    codeExample: `// Spring Boot + DynamoDB with DynamoDB Enhanced Client:
@DynamoDbBean
public class Order {
    @DynamoDbPartitionKey
    String orderId;             // PK: unique, high cardinality

    @DynamoDbSortKey
    String createdAt;           // SK: allows querying orders by date

    String userId;
    Double total;
    String status;
}

// Table design for "get all orders for a user":
// GSI (Global Secondary Index): userId (PK) + createdAt (SK)
@Autowired DynamoDbEnhancedClient client;

DynamoDbTable<Order> table = client.table("Orders", TableSchema.fromBean(Order.class));

// Write:
table.putItem(order);

// Get by PK:
Order o = table.getItem(r -> r.key(k -> k.partitionValue("ORD-123")));

// Query user's orders via GSI (scan by userId, sort by date):
DynamoDbIndex<Order> userIndex = table.index("UserOrdersIndex");
QueryEnhancedRequest req = QueryEnhancedRequest.builder()
    .queryConditional(QueryConditional.keyEqualTo(k -> k.partitionValue(userId)))
    .build();
userIndex.query(req).forEach(page -> page.items().forEach(System.out::println));`,
    tags: ['AWS', 'DynamoDB', 'NoSQL', 'Database'],
  },
  {
    question: 'What is AWS Lambda? What are cold starts and how do you minimize them for Java?',
    answer: 'AWS Lambda: serverless, event-driven compute. You deploy a function, AWS handles servers, scaling, and availability. Triggers: API Gateway, SQS, SNS, S3, EventBridge, Kinesis. Cold start: when Lambda spins up a new container for your function — JVM initialization + Spring context startup can take 5-15 seconds for Java. Warm invocation: container reused, fast (<100ms). Minimize cold starts: use GraalVM native compilation (Spring Native) — produces a native binary that starts in <50ms. Use Quarkus or Micronaut (lighter frameworks). Use SnapStart (Lambda feature for Java): pre-initializes the JVM environment and snapshots it — effectively eliminates cold starts. Use Provisioned Concurrency: keeps containers warm at a cost.',
    codeExample: `// Spring Boot Lambda with AWS Lambda Adapter:
@SpringBootApplication
public class LambdaApp {
    public static void main(String[] args) { SpringApplication.run(LambdaApp.class, args); }
}

// Handler class:
public class ApiGatewayHandler extends SpringBootApiGatewayRequestHandler {
    public ApiGatewayHandler() {
        super(LambdaApp.class);
    }
}

# SnapStart (eliminates cold starts — add to function config):
# SnapStart:
#   ApplyOn: PublishedVersions
# After deploy, publish a version → Lambda snapshots the initialized JVM

# GraalVM native for fastest cold starts:
# mvn -Pnative package    (spring-native plugin)
# Lambda runtime: provided.al2
# Startup: ~50ms vs 5-15s for regular JVM

// Lambda context for utility:
public class Handler implements RequestHandler<SQSEvent, Void> {
    // Static fields initialized once per container (warm)
    private static final ObjectMapper mapper = new ObjectMapper();
    private static final AmazonDynamoDB dynamo = AmazonDynamoDBClientBuilder.defaultClient();

    public Void handleRequest(SQSEvent event, Context context) {
        event.getRecords().forEach(record -> {
            // process each SQS message
        });
        return null;
    }
}`,
    tags: ['AWS', 'Lambda', 'Serverless', 'Cold Start', 'GraalVM'],
  },
];

// ─── OBSERVABILITY ────────────────────────────────────────────────────────────
export const observabilityExtra: QA[] = [
  {
    question: 'How do you expose and collect metrics in Spring Boot? What is Micrometer and Prometheus?',
    answer: 'Micrometer: application metrics facade (like SLF4J for metrics). Vendor-neutral API, implementations for Prometheus, Datadog, CloudWatch, InfluxDB. Spring Boot Actuator auto-configures Micrometer. Key meter types: Counter (monotonically increasing), Gauge (current value), Timer (duration + count), DistributionSummary (histogram). Prometheus: open-source time-series metrics DB. Scrapes (pulls) metrics from /actuator/prometheus endpoint. Grafana: dashboards on top of Prometheus. Stack: Spring Boot (Micrometer) → Prometheus scrapes /actuator/prometheus → Grafana visualizes → AlertManager sends PagerDuty alerts.',
    codeExample: `// build.gradle:
// implementation 'io.micrometer:micrometer-registry-prometheus'

# application.yml:
management:
  endpoints:
    web:
      exposure:
        include: health,info,prometheus,metrics
  metrics:
    tags:
      application: order-service  # common tag on all metrics
      environment: production

// Custom business metrics:
@Service
public class OrderMetricsService {
    private final Counter orderCounter;
    private final Timer processTimer;
    private final AtomicInteger pendingOrders;

    public OrderMetricsService(MeterRegistry registry) {
        orderCounter = Counter.builder("orders.created")
            .tag("status", "success")
            .description("Total orders created")
            .register(registry);

        processTimer = Timer.builder("order.processing.duration")
            .description("Time to process an order")
            .register(registry);

        pendingOrders = registry.gauge("orders.pending",
            new AtomicInteger(0)); // gauge reflects current value
    }

    public Order createOrder(OrderRequest req) {
        return processTimer.record(() -> {
            Order o = doCreateOrder(req);
            orderCounter.increment();
            return o;
        });
    }
}

// Prometheus scrape config:
# prometheus.yml:
scrape_configs:
  - job_name: 'order-service'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['order-service:8080']`,
    tags: ['Observability', 'Micrometer', 'Prometheus', 'Grafana', 'Metrics'],
  },
  {
    question: 'What is structured logging? How do you set up the ELK Stack or Loki for log aggregation?',
    answer: 'Structured logging: logs as JSON objects instead of plain text strings. Machine-parseable, queryable by field. Use Logback with logstash-logback-encoder to output JSON. Include: timestamp, level, message, traceId, spanId, service name, custom fields. ELK Stack: Elasticsearch (search/store), Logstash (parse/transform), Kibana (visualize). Modern alternative: Grafana Loki (log aggregation) + Promtail (log shipper) — cheaper than ELK, integrates natively with Grafana. Pattern: App logs JSON to stdout → Fluentd/Promtail collects → sends to Loki/Elasticsearch → Grafana/Kibana dashboard. Correlation: include traceId in every log line to find all logs for one request.',
    codeExample: `// pom.xml:
// <dependency>net.logstash.logback:logstash-logback-encoder:7.4</dependency>

// logback-spring.xml — JSON output:
<configuration>
  <springProperty scope="context" name="serviceName" source="spring.application.name"/>
  <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
    <encoder class="net.logstash.logback.encoder.LogstashEncoder">
      <customFields>{"service":"\${serviceName}"}</customFields>
    </encoder>
  </appender>
  <root level="INFO"><appender-ref ref="STDOUT"/></root>
</configuration>

// Output (one JSON per line):
// {"@timestamp":"2024-01-15T10:30:00","level":"INFO","message":"Order created",
//  "traceId":"abc123","spanId":"def456","service":"order-service","orderId":42}

// Structured log with MDC (Mapped Diagnostic Context):
@Aspect @Component
public class RequestLoggingAspect {
    @Around("@annotation(org.springframework.web.bind.annotation.RequestMapping)")
    public Object logRequest(ProceedingJoinPoint pjp) throws Throwable {
        MDC.put("requestId", UUID.randomUUID().toString());
        MDC.put("userId", SecurityContextHolder.getContext()
            .getAuthentication().getName());
        try {
            return pjp.proceed();
        } finally {
            MDC.clear(); // MUST clear to avoid ThreadLocal leak in thread pools
        }
    }
}

// Grafana Loki query (LogQL):
// {service="order-service"} |= "ERROR" | json | traceId="abc123"`,
    tags: ['Observability', 'Logging', 'ELK', 'Loki', 'Structured Logging'],
  },
];

// ─── TESTING DEEPER ──────────────────────────────────────────────────────────
export const testingDeepExtra: QA[] = [
  {
    question: 'What is Testcontainers? Why use it instead of H2 in-memory database?',
    answer: 'Testcontainers: Java library that manages Docker containers during tests. Starts a real PostgreSQL, Redis, Kafka, etc. in a Docker container for each test run. Automatically cleans up after tests. Why not H2: H2 behaves differently from PostgreSQL (different SQL syntax, different JDBC behavior, missing features like JSONB, window functions, partial indexes). Tests passing with H2 but failing in production is a common source of bugs. Testcontainers gives you production-identical databases in tests. Works with Spring Boot via @ServiceConnection (Spring Boot 3.1+) or @DynamicPropertySource.',
    codeExample: `// @ServiceConnection (Spring Boot 3.1+):
@SpringBootTest
@Testcontainers
class OrderRepositoryTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:16-alpine");
    // Spring Boot auto-configures datasource from container — no @DynamicPropertySource needed

    @Container
    @ServiceConnection
    static KafkaContainer kafka =
        new KafkaContainer(DockerImageName.parse("confluentinc/cp-kafka:7.4.0"));

    @Autowired OrderRepository orderRepo;

    @Test
    void shouldFindRecentOrders() {
        // This runs against REAL PostgreSQL
        orderRepo.save(new Order("user-1", 99.0));
        List<Order> orders = orderRepo.findRecentByUser("user-1");
        assertThat(orders).hasSize(1);
    }
}

// @DynamicPropertySource (older Spring Boot):
@SpringBootTest
@Testcontainers
class ServiceTest {
    @Container
    static RedisContainer redis = new GenericContainer<>("redis:7-alpine").withExposedPorts(6379);

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry registry) {
        registry.add("spring.redis.host", redis::getHost);
        registry.add("spring.redis.port", () -> redis.getMappedPort(6379));
    }
}`,
    tags: ['Testing', 'Testcontainers', 'Integration Testing', 'Docker'],
  },
  {
    question: 'What is WireMock? How do you test external API calls in Spring Boot?',
    answer: 'WireMock: HTTP mock server for testing. Stubs HTTP endpoints with defined request matchers and response bodies. Used when your service calls external APIs (payment gateway, SMS service, third-party REST API) — you don\'t want to call real endpoints in tests. Spring Boot integration: WireMockServer started as @Rule/@RegisterExtension, or use @AutoConfigureWireMock for Spring Boot tests. Also useful for contract testing (recording real API responses and replaying them). Alternative: MockServer, Spring MockRestServiceServer (for RestTemplate), MockWebServer (OkHttp).',
    codeExample: `// WireMock with JUnit 5:
@SpringBootTest
@AutoConfigureWireMock(port = 0)  // random port, Spring auto-configures RestTemplate base URL
class PaymentServiceTest {

    @Autowired PaymentService paymentService;

    @Test
    void shouldChargeCard() {
        // Stub external payment gateway:
        stubFor(post(urlEqualTo("/payments/charge"))
            .withHeader("Authorization", matching("Bearer .*"))
            .withRequestBody(matchingJsonPath("$.amount", equalTo("99.99")))
            .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody("""
                    {"transactionId": "txn-123", "status": "SUCCESS"}
                    """)));

        PaymentResult result = paymentService.charge(new ChargeRequest("tok_123", 99.99));

        assertThat(result.getStatus()).isEqualTo("SUCCESS");
        assertThat(result.getTransactionId()).isEqualTo("txn-123");

        // Verify the outgoing request was made:
        verify(postRequestedFor(urlEqualTo("/payments/charge"))
            .withRequestBody(matchingJsonPath("$.currency", equalTo("USD"))));
    }

    @Test
    void shouldHandlePaymentFailure() {
        stubFor(post(urlEqualTo("/payments/charge"))
            .willReturn(aResponse().withStatus(402).withBody("Insufficient funds")));

        assertThrows(PaymentFailedException.class,
            () -> paymentService.charge(new ChargeRequest("tok_bad", 100.0)));
    }
}`,
    tags: ['Testing', 'WireMock', 'Integration Testing', 'HTTP Mocking'],
  },
];

// ─── CLASSLOADERS & REFLECTION ────────────────────────────────────────────────
export const classLoaderReflectionExtra: QA[] = [
  {
    question: 'What are the types of ClassLoaders in Java? What is the difference between Class.forName() and ClassLoader.loadClass()?',
    answer: 'ClassLoader hierarchy (parent-delegation model): Bootstrap ClassLoader (native, loads rt.jar/JDK core — java.lang, java.util). Extension/Platform ClassLoader (loads jre/lib/ext). Application ClassLoader (loads your classpath). Custom ClassLoader (plugin systems, OSGi, hot reload). Parent delegation: a classloader first asks its parent; loads itself only if parent fails. Prevents loading a malicious java.lang.String. Class.forName("Foo"): loads AND initializes the class (runs static initializers). Useful for JDBC drivers (loads the driver class). ClassLoader.loadClass("Foo"): loads WITHOUT initializing — no static blocks run. Used when you want deferred initialization.',
    codeExample: `// Parent delegation in action:
ClassLoader cl = MyClass.class.getClassLoader();
System.out.println(cl);               // AppClassLoader
System.out.println(cl.getParent());   // PlatformClassLoader
System.out.println(cl.getParent().getParent()); // null = Bootstrap

// Class.forName — triggers static initializer:
// JDBC driver registration uses this:
Class.forName("com.mysql.cj.jdbc.Driver"); // runs Driver's static block that registers it

// ClassLoader.loadClass — no initialization:
ClassLoader loader = Thread.currentThread().getContextClassLoader();
Class<?> clazz = loader.loadClass("com.example.MyPlugin"); // not initialized yet

// Custom ClassLoader (hot reload):
public class PluginClassLoader extends URLClassLoader {
    public PluginClassLoader(URL[] urls) { super(urls, null); } // null parent = no delegation

    public Class<?> loadPlugin(String name) throws ClassNotFoundException {
        // Load fresh copy every time (bypasses parent)
        return findClass(name);
    }
}

// Class.forName with specific ClassLoader:
Class<?> clazz = Class.forName("com.example.MyClass", true, specificClassLoader);
// true = initialize; use specific loader (important in app servers with multiple CLs)`,
    tags: ['ClassLoader', 'JVM', 'Reflection', 'Java Internals'],
  },
  {
    question: 'How does Java Reflection work? What are dynamic proxies? Compare java.lang.reflect.Proxy vs CGLIB vs ByteBuddy.',
    answer: 'Reflection: inspect and manipulate classes, fields, methods at runtime. Use setAccessible(true) to bypass access control (break encapsulation). Used by: Spring DI, JPA (entity field injection), serialization frameworks, test frameworks. Dynamic proxies: create implementations of interfaces at runtime without writing code. java.lang.reflect.Proxy: interface-only, part of JDK. Proxy.newProxyInstance() creates an object; InvocationHandler intercepts all method calls. CGLIB: creates subclasses of concrete classes at runtime (bytecode manipulation). Spring uses CGLIB for @Configuration and class-based @Transactional proxies. ByteBuddy: modern, type-safe bytecode library. Mockito uses it. Faster than reflection.',
    codeExample: `// Reflection — access private field:
class Config {
    private String secretKey = "initial";
}
Config config = new Config();
Field field = Config.class.getDeclaredField("secretKey");
field.setAccessible(true);          // bypass private
field.set(config, "modified");      // write
System.out.println(field.get(config)); // "modified"

// Invoke private method:
Method method = Config.class.getDeclaredMethod("validate", String.class);
method.setAccessible(true);
method.invoke(config, "arg");

// JDK Dynamic Proxy (interface-only):
interface OrderService { Order createOrder(String userId); }

OrderService proxy = (OrderService) Proxy.newProxyInstance(
    OrderService.class.getClassLoader(),
    new Class<?>[]{ OrderService.class },
    (proxyObj, method, args) -> {
        System.out.println("Before: " + method.getName()); // cross-cutting concern
        Object result = realOrderService.createOrder((String)args[0]);
        System.out.println("After: " + method.getName());
        return result;
    }
);
// Spring AOP uses this pattern for @Transactional on interfaces

// CGLIB proxy (concrete class — Spring @Configuration):
// Spring subclasses @Configuration classes to intercept @Bean methods
// so multiple calls to userService() return the same instance (singleton)

// ByteBuddy (Mockito internals):
Class<?> dynamicClass = new ByteBuddy()
    .subclass(Object.class)
    .method(ElementMatchers.named("toString"))
    .intercept(FixedValue.value("intercepted!"))
    .make()
    .load(getClass().getClassLoader())
    .getLoaded();
System.out.println(dynamicClass.newInstance().toString()); // "intercepted!"`,
    tags: ['Reflection', 'Dynamic Proxy', 'CGLIB', 'ByteBuddy', 'Spring AOP'],
  },
];
