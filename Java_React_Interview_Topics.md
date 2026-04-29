# Java & React Interview Questions

## Java Topics

### Q: What is the difference between == and .equals() in Java?

**A:** == compares object references (memory addresses). .equals() compares object content/values. For primitives, == compares values. Always use .equals() for String and object comparison.

```java
String a = new String("hello");
String b = new String("hello");
System.out.println(a == b);        // false (different refs)
System.out.println(a.equals(b));   // true (same content)
```

### Q: Explain the Java Memory Model: Stack vs Heap.

**A:** Stack: stores local variables, method call frames, primitive values, and object references. LIFO, thread-specific, fast allocation. Heap: stores all objects and class instances. Shared across threads. Managed by GC. Static variables go to Method Area (part of Non-Heap).

```java
void method() {
    int x = 5;           // Stack: primitive
    String s = "hi";     // Stack: reference, Heap: String object
    Object o = new Object(); // Stack: ref, Heap: object
}
```

### Q: What is the difference between final, finally, and finalize?

**A:** final: keyword to make variable constant, method non-overridable, class non-inheritable. finally: block in try-catch that always executes (cleanup). finalize(): deprecated method called by GC before object collection (unreliable, avoid).

```java
// 1. final (keyword)
public final class User { // Class cannot be inherited
    private final int id; // Variable cannot be changed after init

    public User(int id) { this.id = id; }

    public final void showId() { // Method cannot be overridden
        System.out.println("User ID: " + id);
    }
}

// 2. finally (block)
public void process() {
    try {
        // file operations...
    } catch (IOException e) {
        e.printStackTrace();
    } finally {
        // Always executes even if Exception is thrown
        System.out.println("Closing resources...");
    }
}

// 3. finalize (deprecated method)
@Override
protected void finalize() {
    // Called by GC before destruction (unreliable)
    System.out.println("Cleaning up before GC...");
}
```

### Q: What is autoboxing and unboxing? What are the gotchas?

**A:** Autoboxing: automatic conversion from primitive to wrapper (int → Integer). Unboxing: wrapper to primitive. Gotcha: Integer cache only applies for -128 to 127. NullPointerException on unboxing null. Performance overhead in loops.

```java
// 1. Autoboxing (primitive → wrapper)
Integer a = 127, b = 127; 
System.out.println(a == b); // true (cached -128 to 127)

Integer c = 128, d = 128;
System.out.println(c == d); // false (NOT cached, new objects)
System.out.println(c.equals(d)); // true (ALWAYS use equals!)

// 2. Unboxing (wrapper → primitive)
Integer n = null;
int x = n; // throws NullPointerException!

// 3. Performance overhead (in loops)
Long sum = 0L;
for (long i = 0; i < Integer.MAX_VALUE; i++) {
    sum += i; // autoboxing: new Long object on every iteration!
}
// Solution: use primitive 'long sum = 0L;'
```

### Q: Explain String interning and the String pool.

**A:** String literals are stored in the String Pool (PermGen/Metaspace). String.intern() moves a string to the pool or returns the pooled reference. Enables reference equality for pooled strings. Reduces memory. New String() bypasses the pool.

```java
String a = "hello";           // pool
String b = "hello";           // same pool ref
String c = new String("hello"); // heap, not pool
System.out.println(a == b);       // true
System.out.println(a == c);       // false
System.out.println(a == c.intern()); // true
```

### Q: What is the difference between abstract class and interface? When to use each?

**A:** Abstract class: can have state, constructors, concrete methods, protected/private members. Single inheritance. Interface: no state (except static/default), multiple implementation, public by default. Use abstract class for 

### Q: What is the contract between equals() and hashCode()? Why must you override both?

**A:** The contract: if a.equals(b) is true, then a.hashCode() MUST equal b.hashCode(). The reverse is NOT required — same hash code does not mean equal (that is a collision). Hash-based collections (HashMap, HashSet) use hashCode() to find the bucket, then equals() to find the exact key. If you override equals() but not hashCode(), two 

### Q: Java 8 memory change: PermGen → Metaspace. What changed and why?

**A:** PermGen (Java 7 and below): fixed-size portion of Java Heap storing class metadata. Caused frequent OutOfMemoryError: PermGen space. Metaspace (Java 8+): uses native OS memory, auto-resizable by default. JVM flags changed: -XX:MaxPermSize → -XX:MaxMetaspaceSize. Static variables and String literals moved to main Heap (actually from Java 7). Metaspace stores: class metadata, bytecode, constant pool, annotations.

```java
// Old JVM flags (now ignored in Java 8+):
// -XX:PermSize=256m -XX:MaxPermSize=512m

// New Metaspace flags:
// -XX:MetaspaceSize=256m     (initial, triggers GC when reached)
// -XX:MaxMetaspaceSize=512m  (cap to prevent consuming all RAM)

// Error changed from:
// java.lang.OutOfMemoryError: PermGen space
// to:
// java.lang.OutOfMemoryError: Metaspace
```

### Q: What are Java primitive types? What is autoboxing and why avoid it in loops?

**A:** Java has 8 primitives: byte (8-bit), short (16-bit), int (32-bit), long (64-bit), float (32-bit), double (64-bit), char (16-bit Unicode), boolean. Primitives live on the Stack; they cannot be null and have default values (int=0, boolean=false). Autoboxing (int→Integer) and unboxing (Integer→int) are automatic conversions. Avoid in tight loops: each boxing creates a new Heap object, causing GC pressure.

```java
// BAD: autoboxing on every iteration → 1M heap objects
Long sum = 0L;
for (long i = 0; i < 1_000_000; i++) sum += i; // unbox + box each time

// GOOD: primitive all the way
long sum = 0L;
for (long i = 0; i < 1_000_000; i++) sum += i;

// Autoboxing gotcha with Integer cache (-128 to 127):
Integer a = 127, b = 127;
System.out.println(a == b); // true (cached)
Integer c = 128, d = 128;
System.out.println(c == d); // false (not cached)
```

### Q: What are the 5 ways to create an object in Java?

**A:** 1. new keyword — calls constructor, most common. 2. Reflection (Class.forName().getConstructor().newInstance()) — used by Spring DI and frameworks, can call private constructors. 3. clone() — shallow copy by default; class must implement Cloneable and override clone(). 4. Deserialization (ObjectInputStream.readObject()) — no constructor called, reconstructs from bytes; class must implement Serializable. 5. Factory Method — hides new, may return cached instances (e.g., Calendar.getInstance(), Boolean.valueOf()).

```java
// 1. new keyword
User u1 = new User();

// 2. Reflection
User u2 = (User) Class.forName("com.app.User").getConstructor().newInstance();

// 3. clone()
User u3 = (User) u1.clone(); // shallow copy!

// 4. Deserialization
ObjectInputStream in = new ObjectInputStream(new FileInputStream("data.obj"));
User u4 = (User) in.readObject(); // no constructor called

// 5. Factory method
Calendar cal = Calendar.getInstance();
Boolean flag = Boolean.valueOf(true); // cached, no new object
```

### Q: What is the Runnable interface? Difference between run() and start()?

**A:** Runnable is a @FunctionalInterface with one method: void run(). It defines the code a thread will execute. Since it is functional, you can implement it with a lambda. Critical distinction: calling myRunnable.run() directly is a normal method call on the current thread. Calling thread.start() creates a new OS thread and internally calls run() on it. Never call run() directly when you want parallelism.

```java
// Lambda implementation (preferred)
Runnable task = () -> System.out.println("Running on: " + Thread.currentThread().getName());

// WRONG: runs on current thread, no new thread created
task.run();

// CORRECT: JVM creates new thread, then calls run() internally
Thread t = new Thread(task);
t.start();

// Callable: like Runnable but returns a value and can throw checked exceptions
Callable<Integer> calc = () -> 42;
Future<Integer> future = executor.submit(calc);
```

### Q: Fail-Fast vs Fail-Safe iterators: what is the difference?

**A:** Fail-Fast: operates on the original collection; throws ConcurrentModificationException if collection is modified during iteration. Uses modCount counter. Collections: ArrayList, HashSet, HashMap. Fail-Safe (Weakly Consistent): works on a clone/copy of the collection; never throws. Collections: CopyOnWriteArrayList, ConcurrentHashMap. Trade-off: Fail-Safe uses more memory and may not reflect latest changes. You CAN remove during Fail-Fast iteration using iterator.remove() (updates modCount correctly).

```java
// Fail-Fast: throws ConcurrentModificationException
List<String> list = new ArrayList<>(List.of("A","B","C"));
for (String s : list) {
    list.add("D"); // THROWS!
}

// Safe removal via iterator
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    if (it.next().equals("A")) it.remove(); // OK

// Fail-Safe: no exception, works on a snapshot
List<String> safe = new CopyOnWriteArrayList<>(List.of("A","B","C"));
for (String s : safe) {
    safe.add("D"); // No exception, loop sees original snapshot
}
```

### Q: What is the internal implementation of HashMap? How does it handle collisions?

**A:** HashMap uses an array of buckets (Node[]). Key\

### Q: ArrayList vs LinkedList: when to use each?

**A:** ArrayList: O(1) random access, O(n) insert/delete in middle, contiguous memory, better cache performance. LinkedList: O(n) access, O(1) insert/delete at ends (as Deque), more memory (2 pointers per node). Use ArrayList for most cases. LinkedList for Queue/Deque operations.

```java
// 1. ArrayList (Better for searching/indexing)
List<String> list = new ArrayList<>(100); // specify capacity for performance
list.add("Java");
list.get(0); // O(1) time

// 2. LinkedList (Better for queue/stack operations)
LinkedList<String> queue = new LinkedList<>();
queue.addFirst("Priority");
queue.addLast("Normal");
queue.removeFirst(); // O(1) time - great for Deque/Queue

// 3. Immutability
List<String> immutable = List.of("A", "B"); // Java 9+ (Immutable)
List<String> sync = Collections.synchronizedList(new ArrayList<>());
```

### Q: What is the difference between HashMap, LinkedHashMap, and TreeMap?

**A:** HashMap: O(1) get/put, no ordering. LinkedHashMap: maintains insertion order (or access order), slightly slower. TreeMap: sorted by key (Red-Black Tree), O(log n) operations. Use LinkedHashMap for LRU caches (access-order mode). Use TreeMap for sorted iteration.

### Q: Explain ConcurrentHashMap vs Hashtable vs Collections.synchronizedMap.

**A:** Hashtable: all methods synchronized on single lock, poor concurrency. synchronizedMap: wraps map with single lock. ConcurrentHashMap: segment locking (Java 7) / CAS + synchronized per bucket (Java 8). Best for concurrent use. No lock on reads in Java 8+. Allows null values? No for both thread-safe versions.

### Q: How does HashSet work internally?

**A:** HashSet is backed by a HashMap where keys are the set elements and values are a dummy PRESENT object. All HashMap mechanics apply: O(1) add/contains/remove, no duplicate keys → no duplicate elements.

```java
// HashSet source (simplified)
private HashMap<E,Object> map;
private static final Object PRESENT = new Object();
public boolean add(E e) {
    return map.put(e, PRESENT) == null;
}
```

### Q: HashMap vs Hashtable: key differences?

**A:** HashMap (Java 1.2): not synchronized, allows one null key and multiple null values, uses Iterator (Fail-Fast), inherits AbstractMap — use for 99% of cases. Hashtable (Java 1.0): legacy, every method synchronized on a single lock (huge bottleneck), no null keys/values, uses Enumeration. Modern alternative for thread safety: ConcurrentHashMap — locks only individual buckets (lock stripping), not the whole map. Never use Hashtable in new code.

```java
// HashMap: fast, not thread-safe
Map<String, String> map = new HashMap<>();
map.put(null, "value"); // allowed

// Hashtable: slow, thread-safe (but outdated)
Hashtable<String, String> table = new Hashtable<>();
table.put(null, "value"); // throws NullPointerException!

// ConcurrentHashMap: fast AND thread-safe (preferred)
Map<String, String> concurrent = new ConcurrentHashMap<>();
concurrent.putIfAbsent("key", "value"); // atomic operation
```

### Q: How do HashMap buckets, load factor, and treeification work?

**A:** Buckets: HashMap is an array of nodes. hashCode() → index into array. Each bucket is a linked list (Java 7) or Red-Black Tree (Java 8+ when chain > 8 nodes). Load Factor (default 0.75): when 75% of buckets occupied, HashMap rehashes — doubles array size, redistributes all entries. Capacity (default 16). Initial capacity tip: set to expectedSize/0.75 + 1 to avoid rehashing. Treeification threshold: 8 nodes in a bucket → O(n) list becomes O(log n) tree.

```java
// Step-by-step for map.get(key):
// 1. Compute hash: hash = key.hashCode() ^ (hash >>> 16)
// 2. Find bucket: index = hash & (capacity - 1)
// 3. Look in bucket: iterate list or tree
// 4. Use .equals() on each node to find exact key

// Optimal initial capacity to avoid rehash:
int expectedEntries = 1000;
Map<String, String> map = new HashMap<>((int)(expectedEntries / 0.75) + 1);

// Java 8: bucket becomes tree at 8 nodes, reverts at 6
// Prevents O(n) worst case from hash collisions (e.g. hash DoS)
```

### Q: Comparable vs Comparator: what is the difference and when to use each?

**A:** Comparable (java.lang): implemented inside the class; defines natural/default ordering via compareTo(Object). Class 

### Q: How does Collections.sort() / Stream.sorted() work internally?

**A:** Collections.sort() uses TimSort (hybrid merge+insertion sort) — O(n log n) worst case. It repeatedly calls compare() or compareTo() with different pairs of elements to determine order; it does NOT go one by one. Stream.sorted() returns a NEW stream with sorted elements; it does NOT modify the original list. Collect with Collectors.toList() to get a List back, or Collectors.toMap() to collect into a Map with key and value extractors.

```java
// Stream sort then collect to list
List<Employee> sorted = employees.stream()
    .sorted(Comparator.comparing(Employee::getName))
    .collect(Collectors.toList());

// Collect to Map: key=id, value=whole object
Map<Integer, Employee> byId = employees.stream()
    .collect(Collectors.toMap(
        Employee::getId,   // key extractor
        e -> e             // value extractor (identity)
    ));

// Group into Map<String, List<Employee>> (like SQL GROUP BY)
Map<String, List<Employee>> byDept = employees.stream()
    .collect(Collectors.groupingBy(Employee::getDepartment));
```

### Q: What is the difference between synchronized, volatile, and AtomicInteger?

**A:** synchronized: mutual exclusion + visibility. Only one thread in block at a time. Reentrant. volatile: visibility only. Ensures reads/writes go to main memory. No atomicity for compound ops. AtomicInteger: lock-free atomic operations using CAS (compare-and-swap). Best for counters and flags.

```java
// volatile: safe for single read/write
volatile boolean flag = true;

// AtomicInteger: safe for increment (compound op)
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet(); // atomic

// synchronized: safe for multi-step operations
synchronized (this) {
    if (condition) { doWork(); }
}
```

### Q: What is a deadlock? How do you prevent it?

**A:** Deadlock: two threads each hold a lock the other needs. Conditions: mutual exclusion, hold and wait, no preemption, circular wait. Prevention: always acquire locks in the same order, use tryLock with timeout, use lock ordering, prefer java.util.concurrent over synchronized.

```java
// Deadlock: Thread1 holds A, wants B
// Thread2 holds B, wants A
// Prevention: always lock A before B in both threads
ReentrantLock lockA = new ReentrantLock();
ReentrantLock lockB = new ReentrantLock();
// Use tryLock to avoid deadlock:
if (lockA.tryLock(1, SECONDS) && lockB.tryLock(1, SECONDS)) {
    try { /* work */ } finally { lockA.unlock(); lockB.unlock(); }
}
```

### Q: Explain ThreadPoolExecutor parameters.

**A:** corePoolSize: threads kept alive even when idle. maximumPoolSize: max threads. keepAliveTime: time idle threads (above core) wait before termination. workQueue: holds tasks when all core threads busy. rejectionPolicy: what to do when queue full (AbortPolicy, CallerRunsPolicy, DiscardPolicy).

```java
ThreadPoolExecutor executor = new ThreadPoolExecutor(
    4,           // corePoolSize
    10,          // maximumPoolSize
    60L,         // keepAliveTime
    TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(100), // workQueue
    new ThreadPoolExecutor.CallerRunsPolicy() // rejection
);
```

### Q: What is the difference between wait/notify and Condition (await/signal)?

**A:** wait/notify: requires synchronized block, bound to object monitor, only one condition per lock. Condition: created from Lock, multiple conditions per lock, supports timed await, more flexible.

```java
// wait/notify (legacy)
synchronized(lock) { lock.wait(); lock.notify(); }

// Condition (preferred)
Lock lock = new ReentrantLock();
Condition notEmpty = lock.newCondition();
Condition notFull = lock.newCondition();
lock.lock();
try {
    while (queue.isEmpty()) notEmpty.await();
    notFull.signal();
} finally { lock.unlock(); }
```

### Q: What is CompletableFuture? How is it different from Future?

**A:** Future: blocking get(), no composition, no callbacks. CompletableFuture: non-blocking callbacks (thenApply, thenAccept, thenCompose), compose multiple async tasks, exception handling (exceptionally, handle), combine with allOf/anyOf.

```java
CompletableFuture<String> cf = CompletableFuture
    .supplyAsync(() -> fetchUser(id))
    .thenApply(user -> enrich(user))
    .thenCompose(user -> fetchOrders(user.id()))
    .exceptionally(ex -> defaultValue())
    .thenApply(result -> format(result));
```

### Q: How do you implement a thread-safe Singleton using Double-Checked Locking?

**A:** Double-Checked Locking (DCL): first null check avoids synchronization on every call (performance). Second null check inside synchronized block prevents two threads that both passed the first check from each creating an instance. volatile is MANDATORY: without it, JVM instruction reordering can assign the reference before the constructor finishes, allowing another thread to return a partially-constructed object. Alternative: Bill Pugh Static Holder — cleaner, JVM class-loading guarantees thread safety without explicit locking.

```java
// DCL Singleton (Java 5+)
public class DatabaseConnection {
    private static volatile DatabaseConnection instance; // volatile!

    private DatabaseConnection() {}

    public static DatabaseConnection getInstance() {
        if (instance == null) {                    // 1st check: no lock
            synchronized (DatabaseConnection.class) {
                if (instance == null) {            // 2nd check: under lock
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
}

// Preferred: Bill Pugh Static Holder (no synchronized, no volatile)
public class Singleton {
    private Singleton() {}
    private static class Holder {
        private static final Singleton INSTANCE = new Singleton();
    }
    public static Singleton getInstance() { return Holder.INSTANCE; }
}
```

### Q: Explain Stream pipeline: intermediate vs terminal operations.

**A:** Intermediate: lazy operations that return a new Stream (filter, map, flatMap, sorted, distinct, limit, peek). Terminal: eager, trigger processing, return non-Stream (collect, forEach, reduce, count, findFirst, anyMatch). map transforms each element (1:1), while flatMap transforms each element into a stream and flattens them into a single stream (1:N). Streams are lazy — no work until terminal op.

```java
// 1. map (1:1 transformation)
List<String> names = employees.stream()
    .map(Employee::name) // Employee -> String
    .collect(Collectors.toList());

// 2. flatMap (1:N transformation + flattening)
List<String> allSkills = employees.stream()
    .flatMap(e -> e.getSkills().stream()) // List<List<String>> -> List<String>
    .distinct()
    .collect(Collectors.toList());

// 3. filter & findFirst (Short-circuiting)
Optional<Employee> topEarner = employees.stream()
    .filter(e -> e.salary() > 150000)
    .findFirst(); // Stops as soon as the first match is found

// 4. peek (for debugging)
employees.stream()
    .peek(e -> System.out.println("Processing: " + e.name()))
    .limit(10)
    .count();
```

### Q: What is Optional and when should you use it?

**A:** Optional<T>: container that may or may not hold a value. Use as return type when null is a valid 

### Q: Explain Collectors: groupingBy, partitioningBy, toMap.

**A:** groupingBy: groups elements by classifier into Map<K, List<V>>. partitioningBy: splits into two groups (true/false) based on predicate. toMap: converts to map with key/value extractors. Careful with duplicate keys (mergeFunction needed).

```java
// groupingBy
Map<Department, List<Employee>> byDept =
    employees.stream().collect(groupingBy(Employee::dept));

// partitioningBy
Map<Boolean, List<Employee>> seniorJunior =
    employees.stream().collect(partitioningBy(e -> e.years() >= 5));

// toMap
Map<Integer, String> idToName =
    employees.stream().collect(toMap(Employee::id, Employee::name));
```

### Q: What are functional interfaces? Name the key ones.

**A:** Functional interface: exactly one abstract method. Key interfaces: Supplier<T> → T get(). Consumer<T> → void accept(T). Function<T,R> → R apply(T). Predicate<T> → boolean test(T). BiFunction<T,U,R>. UnaryOperator<T>. BinaryOperator<T>. All in java.util.function package.

### Q: What are the top Stream terminal operations including max(), min(), and Collectors?

**A:** Key terminal operations: collect() — converts stream to List/Set/Map; forEach() — action per element (consumes stream); reduce(identity, accumulator) — folds to single value; count() — returns long; anyMatch/allMatch/noneMatch — short-circuit boolean checks; findFirst()/findAny() — returns Optional; max()/min() — return Optional<T> using a Comparator. Key Collectors: groupingBy (SQL GROUP BY), partitioningBy (splits into true/false map), joining (concatenates strings), toMap (key+value extractors).

```java
// max / min — return Optional (stream may be empty)
Optional<User> oldest = users.stream()
    .max(Comparator.comparingInt(User::getAge));
oldest.ifPresent(u -> System.out.println(u.getName()));

// reduce: sum all ages
int totalAge = users.stream()
    .map(User::getAge)
    .reduce(0, Integer::sum);

// Collectors.groupingBy (like SQL GROUP BY)
Map<Integer, List<User>> byAge = users.stream()
    .collect(Collectors.groupingBy(User::getAge));

// Collectors.partitioningBy: split adults vs minors
Map<Boolean, List<User>> split = users.stream()
    .collect(Collectors.partitioningBy(u -> u.getAge() >= 18));

// Collectors.joining: CSV of names
String csv = users.stream()
    .map(User::getName)
    .collect(Collectors.joining(", ", "[", "]"));
```

### Q: What are the major Java 17 features? When were Records and Sealed Classes actually introduced?

**A:** Records (final in Java 16, preview in Java 14-15): immutable data carriers, auto-generates constructor, getters, equals(), hashCode(), toString(). Sealed Classes (final in Java 17, preview in Java 15-16): restrict which classes can extend/implement them using permits. Pattern Matching for switch (preview in 17, standard in 21). Helpful NullPointerExceptions: identifies exactly which variable was null. Text Blocks (standard from Java 15). Java 17 is the LTS where Records + Sealed Classes are production-ready without --enable-preview.

```java
// Record: replaces ~50 lines of boilerplate
public record User(Long id, String name, String email) {}
// Auto-generates: canonical constructor, getId(), getName(), equals(), hashCode(), toString()

// Sealed class: fixed set of subtypes
public sealed interface Shape permits Circle, Rectangle, Triangle {}
public final class Circle implements Shape { double radius; }
public final class Rectangle implements Shape { double w, h; }

// Pattern matching switch (Java 21 standard, Java 17 preview)
String describe(Object o) {
    return switch (o) {
        case Integer i -> "int: " + i;
        case String s  -> "string: " + s;
        default        -> "other";
    };
}

// Text block (Java 15+)
String json = """
    { "name": "Alice", "age": 30 }
    """;
```

### Q: How does Spring Boot auto-configuration work?

**A:** Auto-configuration reads META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports. Uses @Conditional annotations (@ConditionalOnClass, @ConditionalOnMissingBean) to only apply if conditions met. spring-boot-autoconfigure JAR contains default configs. Your beans take precedence over auto-configured ones.

```java
@Configuration
@ConditionalOnClass(DataSource.class)
@ConditionalOnMissingBean(DataSource.class)
public class DataSourceAutoConfiguration {
    @Bean
    public DataSource dataSource(DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }
}
```

### Q: Explain Spring bean scopes.

**A:** singleton (default): one instance per container. prototype: new instance each injection/lookup. request: one per HTTP request. session: one per HTTP session. application: one per ServletContext. websocket: one per WebSocket session.

### Q: What is @Transactional? What are its pitfalls?

**A:** Wraps method in a transaction: begin, commit on success, rollback on RuntimeException. Pitfalls: self-invocation bypasses proxy (call from within same class). Checked exceptions don\

### Q: What is Spring AOP? How does it differ from AspectJ?

**A:** Spring AOP: proxy-based, applies to Spring beans only, runtime weaving, subset of AspectJ. Supports method-level pointcuts only. AspectJ: bytecode manipulation, compile/load-time weaving, all Java constructs. Use Spring AOP for simple cross-cutting (logging, transactions). Use AspectJ for complex needs.

### Q: Explain Spring Boot Actuator and key production endpoints.

**A:** Actuator adds production-ready endpoints: /actuator/health (app health, custom indicators), /actuator/metrics (Micrometer metrics), /actuator/info, /actuator/env, /actuator/beans, /actuator/loggers (change log level at runtime), /actuator/threaddump, /actuator/heapdump. Secure in production!

### Q: @PathVariable vs @RequestParam: when to use each?

**A:** @PathVariable: extracts data embedded in the URL path (/users/101). Used for mandatory data that identifies a resource. Always required by default. Cleaner, RESTful URLs. @RequestParam: extracts data from query string (/users?page=2&sort=name). Used for optional filtering, sorting, or pagination. Can have required=false with defaultValue. Rule: path variable = identity (who), query param = filter (how).

```java
// @PathVariable: identifies the resource
@GetMapping("/products/{id}")
public Product getProduct(@PathVariable("id") Long productId) {
    return productService.findById(productId);
}

// @RequestParam: filters/modifies the result
@GetMapping("/products")
public List<Product> search(
    @RequestParam String category,
    @RequestParam(required = false, defaultValue = "id") String sort
) {
    return productService.findByCategory(category, sort);
}

// Combined: /users/5/orders?status=shipped
@GetMapping("/users/{userId}/orders")
public List<Order> getOrders(@PathVariable Long userId,
                              @RequestParam String status) { ... }
```

### Q: What is @Primary in Spring Boot and how does it differ from @Qualifier?

**A:** @Primary: placed on a bean definition. Tells Spring 

### Q: How do you implement a Global Exception Handler in Spring Boot?

**A:** @RestControllerAdvice (= @ControllerAdvice + @ResponseBody) is a 

### Q: What is the Spring Boot application lifecycle?

**A:** Phase 1 — Initialization: SpringApplication.run() loads properties/yml, sets up ApplicationContext. Phase 2 — Bean Lifecycle: Instantiation (constructor called), Populate Properties (@Autowired injection), Initialization (@PostConstruct methods, InitializingBean.afterPropertiesSet()). Phase 3 — Runtime: embedded Tomcat/Netty starts, app serves requests. Phase 4 — Shutdown: ApplicationContext closes, @PreDestroy methods called, DisposableBean.destroy() invoked. Hooks: ApplicationListener<ContextRefreshedEvent>, SmartLifecycle for ordered startup/shutdown.

```java
@Service
public class StartupService {

    @PostConstruct
    public void init() {
        // Runs after all beans injected — warm caches, validate config
        System.out.println("Bean ready!");
    }

    @PreDestroy
    public void cleanup() {
        // Runs before context closes — close connections, flush buffers
        System.out.println("Shutting down gracefully...");
    }
}

// ApplicationRunner: runs after context is fully started
@Component
public class DataLoader implements ApplicationRunner {
    @Override
    public void run(ApplicationArguments args) {
        // Load seed data, register services, etc.
    }
}
```

### Q: How do you debug production issues in Spring Boot?

**A:** The Observability Triad: 1) Logging — centralize with ELK/Splunk, use Spring Cloud Sleuth/Micrometer for traceId correlation across services, change log level at runtime via /actuator/loggers without restart. 2) Metrics — Spring Boot Actuator + Micrometer + Prometheus/Grafana; watch CPU, Heap, HikariCP connection pool. 3) Distributed Tracing — Zipkin/Jaeger shows which service/DB query ate the time. For OOM: jmap heap dump → Eclipse MAT. For CPU spikes/deadlocks: jstack thread dump → look for BLOCKED threads or infinite loops.

```java
# application.yml: enable key actuator endpoints
management.endpoints.web.exposure.include: health,metrics,env,loggers,threaddump

# Change log level at runtime (no restart!):
# POST /actuator/loggers/com.myapp.service
# Body: {"configuredLevel": "DEBUG"}

# JVM diagnostics:
# Heap dump:   jmap -dump:format=b,file=heap.hprof <pid>
# Thread dump: jstack <pid>
# Or set JVM flag: -XX:+HeapDumpOnOutOfMemoryError

# HikariCP monitoring via metrics:
# hikaricp.connections.pending > 0 → pool exhausted, queries too slow
# Enable slow query log:
logging.level.org.hibernate.SQL: DEBUG
logging.level.org.hibernate.type.descriptor.sql: TRACE
```

### Q: Explain JPA entity lifecycle states.

**A:** New/Transient: not associated with persistence context, no ID. Managed: associated with persistence context, changes auto-synced. Detached: was managed, now disconnected (after session close or evict). Removed: scheduled for deletion. State transitions: persist(), merge(), remove(), detach().

### Q: What is the N+1 problem in JPA? How do you fix it?

**A:** N+1: fetching N entities triggers N additional queries for associations. Example: 100 orders → 100 queries for customer names. Fixes: 1) @EntityGraph or JOIN FETCH in JPQL. 2) @BatchSize for lazy collections. 3) @Query with explicit join. 4) Use DTO projections with single query.

```java
// BAD: N+1
List<Order> orders = orderRepo.findAll();
orders.forEach(o -> o.getCustomer().getName()); // N queries!

// GOOD: JOIN FETCH
@Query("SELECT o FROM Order o JOIN FETCH o.customer")
List<Order> findAllWithCustomer();

// GOOD: @EntityGraph
@EntityGraph(attributePaths = {"customer"})
List<Order> findAll();
```

### Q: Explain @OneToMany mapping best practices.

**A:** Always use Set over List for @ManyToMany (avoid duplicates). Use bidirectional carefully — always sync both sides. Prefer lazy loading (default for collections). Use cascade = PERSIST,MERGE sparingly. Use orphanRemoval for true composition. Avoid CascadeType.ALL with bidirectional.

```java
@Entity
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
}
```

### Q: How do you configure multiple databases in Spring Boot?

**A:** Spring Boot auto-configures a single DataSource. For multiple databases: 1) Define separate properties per DB in application.properties. 2) Create a @Configuration class per DB: define DataSource @Bean, LocalContainerEntityManagerFactoryBean, and PlatformTransactionManager. 3) Use @EnableJpaRepositories with basePackages to map each repository package to its EntityManagerFactory. 4) Mark one DataSource as @Primary so auto-configured defaults still work.

```java
# application.properties
spring.datasource.db1.url=jdbc:mysql://localhost:3306/db1
spring.datasource.db1.username=root
spring.datasource.db2.url=jdbc:postgresql://localhost:5432/db2
spring.datasource.db2.username=user

@Configuration
@EnableJpaRepositories(
    basePackages = "com.app.repository.db1",
    entityManagerFactoryRef = "db1EntityManager",
    transactionManagerRef = "db1TxManager"
)
public class Db1Config {
    @Primary
    @Bean @ConfigurationProperties("spring.datasource.db1")
    public DataSource db1DataSource() {
        return DataSourceBuilder.create().build();
    }
    @Bean
    public LocalContainerEntityManagerFactoryBean db1EntityManager(
            EntityManagerFactoryBuilder builder) {
        return builder.dataSource(db1DataSource())
            .packages("com.app.entity.db1").build();
    }
}
```

### Q: Explain Spring Security filter chain.

**A:** Security is a chain of filters (SecurityFilterChain) applied before the servlet. Key filters: SecurityContextPersistenceFilter, UsernamePasswordAuthenticationFilter, BasicAuthenticationFilter, ExceptionTranslationFilter, FilterSecurityInterceptor. Each filter can short-circuit the chain by committing the response.

### Q: How does JWT authentication work with Spring Security?

**A:** Custom filter (OncePerRequestFilter) intercepts requests, extracts JWT from Authorization header, validates signature and expiry, extracts claims, creates UsernamePasswordAuthenticationToken, sets in SecurityContextHolder. No session needed (stateless). Filter placed before UsernamePasswordAuthenticationFilter.

```java
@Component
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
}
```

### Q: What is the difference between Authentication and Authorization?

**A:** Authentication: who are you? (login, JWT, OAuth2). Results in Authentication object in SecurityContext. Authorization: what can you do? Checked after authentication. Method: @PreAuthorize, @Secured. URL: HttpSecurity.authorizeHttpRequests. Roles vs Authorities: roles are prefixed with ROLE_.

### Q: How does JWT work? How is tampering detected? How does OAuth 2.0 differ?

**A:** JWT structure: Header.Payload.Signature (dot-separated, Base64URL encoded). Server signs Header+Payload with a secret (HMAC-SHA256) or private key (RSA). On verification: server re-hashes Header+Payload with the same key — if the result matches the signature, the token is valid. Tampering detection: changing any byte in Header or Payload produces a different hash that does not match the signature. Note: JWT is SIGNED not encrypted — anyone can read the payload on jwt.io; never put passwords in JWT. OAuth 2.0: authorization framework for delegated access (e.g. Login with Google). JWT is often the token format used within OAuth flows.

```java
// JWT parts (decoded):
// Header:  {"alg":"HS256","typ":"JWT"}
// Payload: {"sub":"user@email.com","roles":["ADMIN"],"exp":1714000000}
// Signature: HMACSHA256(base64(header) + "." + base64(payload), secret)

// Spring Boot: verify via JJWT library
Claims claims = Jwts.parser()
    .verifyWith(secretKey)           // <-- re-hashes and compares
    .build()
    .parseSignedClaims(token)        // throws SignatureException if tampered
    .getPayload();

// OAuth 2.0 Authorization Code flow:
// 1. User clicks "Login with Google"
// 2. Google authenticates user, returns authorization code
// 3. Your app exchanges code + client_secret for access token
// 4. Use access token to call protected APIs
// JWT is commonly used as the access token format
```

### Q: Show a complete JWT authentication filter for Spring Security 6.

**A:** Three components: 1) JwtService — verifies token signature, extracts username and expiry. 2) JwtAuthenticationFilter (OncePerRequestFilter) — intercepts every request, extracts Bearer token, validates it, sets Authentication in SecurityContextHolder. 3) SecurityConfiguration — adds the filter before UsernamePasswordAuthenticationFilter, sets session policy to STATELESS. If verification fails (tampered or expired), the filter catches the exception and does not set Authentication — Spring returns 403 automatically.

```java
@Service
public class JwtService {
    private static final String SECRET = "base64-encoded-256-bit-key";

    public Claims extractClaims(String token) {
        return Jwts.parser().verifyWith(getKey()).build()
            .parseSignedClaims(token).getPayload(); // throws on tamper
    }
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }
    public boolean isValid(String token, UserDetails user) {
        return extractUsername(token).equals(user.getUsername())
            && !extractClaims(token).getExpiration().before(new Date());
    }
    private SecretKey getKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET));
    }
}

@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(HttpServletRequest req,
            HttpServletResponse res, FilterChain chain) throws ... {
        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) {
            chain.doFilter(req, res); return;
        }
        try {
            String jwt = header.substring(7);
            String email = jwtService.extractUsername(jwt);
            if (email != null && SecurityContextHolder.getContext()
                    .getAuthentication() == null) {
                UserDetails user = userDetailsService.loadUserByUsername(email);
                if (jwtService.isValid(jwt, user)) {
                    var auth = new UsernamePasswordAuthenticationToken(
                        user, null, user.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        } catch (Exception ignored) { /* invalid token → no auth set → 403 */ }
        chain.doFilter(req, res);
    }
}
```

### Q: How do you configure Spring Security with in-memory users and method-level security?

**A:** Modern Spring Security (6.x) uses SecurityFilterChain @Bean instead of WebSecurityConfigurerAdapter. InMemoryUserDetailsManager creates users for testing. @EnableMethodSecurity enables @PreAuthorize annotations on service methods. BCryptPasswordEncoder hashes passwords. Stateless JWT APIs should disable CSRF (CSRF is for cookie-based session apps). permitAll() for public endpoints, hasRole() for restricted paths.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // enables @PreAuthorize
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/public/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
            .authenticationProvider(authProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails admin = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("admin123"))
            .roles("ADMIN").build();
        return new InMemoryUserDetailsManager(admin);
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }
}

// Method-level security
@Service
public class UserService {
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(Long id) { ... }

    @PreAuthorize("#username == authentication.principal.username")
    public void updateProfile(String username) { ... } // own profile only
}
```

### Q: What is Circuit Breaker pattern? Explain Resilience4j states.

**A:** Circuit Breaker prevents cascading failures. States: CLOSED (normal, tracking failures), OPEN (calls fail fast for waitDurationInOpenState), HALF_OPEN (test traffic allowed). Transitions: failure rate > threshold → OPEN. Test calls succeed → CLOSED. Test calls fail → OPEN.

```java
@CircuitBreaker(name = "userService", fallbackMethod = "fallback")
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
  slidingWindowSize: 10
```

### Q: Explain Saga pattern for distributed transactions.

**A:** Saga: sequence of local transactions coordinated by events/messages. No distributed 2PC. Two types: Choreography (events trigger next service, no central coordinator, harder to debug) and Orchestration (saga orchestrator tells each service what to do, central flow, easier to monitor). Compensating transactions for rollback.

### Q: What is the Outbox pattern and why is it needed?

**A:** Problem: writing to DB and publishing an event are two separate operations — one can fail. Outbox: write event to outbox table in same DB transaction. Separate relay process reads outbox and publishes to message broker (at-least-once delivery). Ensures DB state and events are consistent.

```java
@Transactional
public void placeOrder(Order order) {
    orderRepo.save(order);
    // Same transaction: guaranteed consistency
    outboxRepo.save(new OutboxEvent("ORDER_PLACED", toJson(order)));
    // Relay process reads outbox → publishes to Kafka
}
```

### Q: What is CAP theorem and how does it apply to microservices?

**A:** CAP: Consistency, Availability, Partition Tolerance — can only guarantee 2 of 3 during partition. Networks always have partitions → choose CP or AP. CP (Zookeeper, etcd): consistent reads even during partition, but may reject requests. AP (Cassandra, DynamoDB): always available, but may return stale data. Most microservices prefer AP with eventual consistency.

### Q: What are the core components of a microservice architecture?

**A:** Each microservice is a self-contained unit with: API Layer (REST/gRPC — the external contract), Business Logic (Service Layer — domain rules), Own Data Store (Database-per-Service pattern for loose coupling), Configuration Management (externalized via Spring Cloud Config), Observability (structured logging + Micrometer metrics + distributed tracing), Connectivity (FeignClient for sync calls, Kafka/RabbitMQ for async events). Infrastructure components: API Gateway (single entry point, routing, auth, rate limiting), Service Discovery (Eureka/Consul — dynamic IP lookup), Load Balancer, Circuit Breaker (Resilience4j), Config Server, Message Broker, Distributed Tracing (Zipkin/Jaeger).

```java
// Infrastructure component roles:
// API Gateway      → The Receptionist (routes + secures traffic)
// Service Discovery → The Phonebook (service A finds service B's address)
// Load Balancer    → The Traffic Cop (spreads requests across instances)
// Circuit Breaker  → The Fuse (stops calls to failing services)
// Config Server    → The Remote Control (centralized config for all services)
// Message Broker   → The Post Office (async decoupled communication)
// Distributed Tracing → The GPS (follows a request across 10+ services)

// Spring Cloud starter dependencies:
// Eureka client:     spring-cloud-starter-netflix-eureka-client
// Gateway:           spring-cloud-starter-gateway
// Config client:     spring-cloud-starter-config
// Circuit breaker:   spring-cloud-starter-circuitbreaker-resilience4j
// OpenFeign:         spring-cloud-starter-openfeign
```

### Q: RestTemplate vs RestClient vs FeignClient: when to use each?

**A:** RestTemplate (Spring 3.0): imperative, synchronous, verbose. In maintenance mode — Spring recommends migrating away. RestClient (Spring 6.1): fluent, chainable API, modern synchronous HTTP. Preferred for standalone Spring Boot apps without microservice infrastructure. FeignClient (Spring Cloud OpenFeign): declarative — define an interface with Spring MVC annotations, Spring generates the implementation. Automatically integrates with Service Discovery (Eureka) and Load Balancing. Best for microservices. Harder to debug because implementation is 

### Q: How do you call multiple services asynchronously in Spring Boot?

**A:** Option A: CompletableFuture with @Async — mark service methods with @Async, they return CompletableFuture<T>. Use CompletableFuture.allOf() to wait for all tasks. Requires @EnableAsync. Option B: WebClient (Spring WebFlux) — fully reactive, non-blocking. Use Mono.zip() to fire multiple calls simultaneously and combine results. WebClient is preferred for high-concurrency scenarios. Both approaches call services in parallel rather than sequentially, dramatically reducing total response time.

```java
// Option A: CompletableFuture + @Async
@Service
public class AggregatorService {
    @Async
    public CompletableFuture<UserDto> getUser(Long id) {
        return CompletableFuture.completedFuture(userClient.getUser(id));
    }
    @Async
    public CompletableFuture<List<Order>> getOrders(Long userId) {
        return CompletableFuture.completedFuture(orderClient.getOrders(userId));
    }
    public Dashboard getDashboard(Long userId) {
        var userFuture   = getUser(userId);
        var ordersFuture = getOrders(userId);
        CompletableFuture.allOf(userFuture, ordersFuture).join(); // wait for both
        return new Dashboard(userFuture.get(), ordersFuture.get());
    }
}

// Option B: WebClient (reactive, non-blocking)
Mono<UserDto> userMono   = webClient.get().uri("/users/{id}", id)
    .retrieve().bodyToMono(UserDto.class);
Mono<List<Order>> ordersMono = webClient.get().uri("/orders?userId={id}", id)
    .retrieve().bodyToFlux(Order.class).collectList();
// Fires BOTH simultaneously:
return Mono.zip(userMono, ordersMono)
    .map(tuple -> new Dashboard(tuple.getT1(), tuple.getT2()));
```

### Q: What is reactive/non-blocking design? When should you use it?

**A:** Traditional (blocking): one thread per request — thread sits idle waiting for DB/API responses. At 200 concurrent requests you need 200 threads. Reactive (non-blocking): Event Loop model — small fixed thread pool (= CPU cores). When I/O is needed, the thread registers a callback and handles other requests. Returns to complete when data is ready. Uses Flux<T> (0..N items) and Mono<T> (0..1 item). Full-stack: Spring WebFlux + WebClient + R2DBC (reactive DB driver). Golden rule: the ENTIRE chain must be non-blocking — one blocking call (JDBC) defeats all gains. Avoid reactive for simple CRUD or CPU-heavy work.

```java
// Traditional (blocking) Spring MVC
@GetMapping("/users/{id}")
public UserDto getUser(@PathVariable Long id) {
    return userRepository.findById(id); // thread blocks here!
}

// Reactive (non-blocking) Spring WebFlux
@GetMapping("/users/{id}")
public Mono<UserDto> getUser(@PathVariable Long id) {
    return userRepository.findById(id) // non-blocking, returns Mono
        .map(user -> toDto(user));
}

// Reactive Manifesto criteria:
// Responsive: responds timely under load
// Resilient:  failure in one component doesn't crash system
// Elastic:    scales under varying workloads
// Message-Driven: async non-blocking messages between components

// Backpressure: subscriber can signal producer to slow down
// Prevents fast producer overwhelming slow consumer (OOM prevention)
```

### Q: Explain database indexes: B-Tree vs Hash. When to use each?

**A:** B-Tree: sorted, supports range queries, ORDER BY, LIKE prefix. Default in most DBs. O(log n) lookup. Hash: O(1) exact lookup, no ordering, no range queries, no LIKE. Use B-Tree for most cases. Use Hash for exact equality lookups only. Covering index: index includes all needed columns (avoids table lookup).

### Q: What are database isolation levels and their trade-offs?

**A:** READ UNCOMMITTED: dirty reads possible. READ COMMITTED (default PG): no dirty reads, phantom/non-repeatable reads possible. REPEATABLE READ (default MySQL/InnoDB): no dirty/non-repeatable reads, phantom reads possible. SERIALIZABLE: full isolation, but slowest. Spring @Transactional(isolation=...) maps to these levels.

### Q: How does connection pooling work? HikariCP configuration.

**A:** Pool maintains pre-created connections. Requests borrow connections, return after use. Key HikariCP settings: maximumPoolSize (default 10), minimumIdle, connectionTimeout (30s), idleTimeout (10min), maxLifetime (30min). Formula: pool size = (core_count * 2) + effective_spindle_count.

```java
# application.yml
spring.datasource.hikari:
  maximum-pool-size: 20
  minimum-idle: 5
  connection-timeout: 30000
  idle-timeout: 600000
  max-lifetime: 1800000
```

### Q: Explain Kubernetes liveness vs readiness vs startup probes.

**A:** Liveness: is the container still running? Failure → restart container. Readiness: is the container ready to serve traffic? Failure → removed from service endpoints (no traffic). Startup: has the container started? Delays liveness/readiness checks until successful. Use startup for slow-starting Spring Boot apps.

```java
livenessProbe:
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
  periodSeconds: 5
```

### Q: What is the difference between Deployment, StatefulSet, and DaemonSet?

**A:** Deployment: stateless apps, rolling updates, pods are interchangeable. StatefulSet: stateful apps (databases), stable network identity, ordered deployment/scaling, persistent storage per pod. DaemonSet: one pod per node (log collectors, monitoring agents). Use Deployment for Spring Boot microservices.

### Q: Explain Docker multi-stage builds for Spring Boot.

**A:** Multi-stage: use heavy build image (JDK + Maven) in first stage, copy only the JAR to lightweight runtime image (JRE). Reduces final image size dramatically. Also use Spring Boot layered JAR for efficient Docker layer caching.

```java
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### Q: How would you design a rate limiter?

**A:** Algorithms: Token Bucket (allows bursts), Leaky Bucket (smooth rate), Fixed Window Counter (simple, boundary issues), Sliding Window Log (accurate, memory heavy), Sliding Window Counter (approximate, efficient). For distributed: Redis with Lua script for atomic operations. Store counts in Redis with TTL.

```java
// Token Bucket with Redis
String key = "rate:" + userId;
// Lua script (atomic)
long tokens = redis.eval("""
  local tokens = tonumber(redis.call('get', KEYS[1]) or ARGV[1])
  if tokens > 0 then
    redis.call('decr', KEYS[1])
    return 1  -- allowed
  end
  return 0  -- denied
""", key, MAX_TOKENS);
```

### Q: Explain caching strategies: Cache-Aside, Write-Through, Write-Behind.

**A:** Cache-Aside (Lazy): app reads cache, on miss reads DB + updates cache. Handles cache failures gracefully. Stale data possible. Write-Through: write to cache + DB synchronously on every write. Always fresh, write latency. Write-Behind (Write-Back): write to cache, async write to DB. Fast writes, risk of loss. Cache-Aside most common in Spring + Redis.

### Q: How do you design for horizontal scalability in Spring Boot?

**A:** Stateless services (no session state in memory). Externalize state to Redis/DB. Sticky sessions if necessary (but avoid). Distributed caching (Redis cluster). Externalize config (Spring Cloud Config). Service discovery (Eureka/Kubernetes service). Load balancer health checks + readiness probes. Database: read replicas, connection pool sizing per instance.

### Q: Explain the Strategy pattern with a real-world Java example.

**A:** Strategy: define a family of algorithms, encapsulate each, make them interchangeable. Enables runtime selection of algorithm. Common in payment processing, sorting, validation.

```java
interface PaymentStrategy {
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
}
```

### Q: What is the Builder pattern and when does Spring use it?

**A:** Builder: construct complex objects step by step. Avoids telescoping constructors. Ensures immutability. Spring uses it in: UriComponentsBuilder, MockMvcRequestBuilders, SecurityMockMvcRequestPostProcessors, ResponseEntity.BodyBuilder, JwtBuilder.

```java
// Builder pattern
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
    .toUri();
```

### Q: Explain SOLID principles with Java examples.

**A:** S - Single Responsibility: one reason to change. O - Open/Closed: open for extension, closed for modification. L - Liskov Substitution: subclasses must be substitutable. I - Interface Segregation: small focused interfaces over fat ones. D - Dependency Inversion: depend on abstractions, not concretions (core of Spring DI).

### Q: Strategy Pattern vs Factory Pattern: what is the difference?

**A:** Factory (Creational): answers 

### Q: What is the Spring Cloud BOM and how do you structure a multi-module microservices Maven project?

**A:** Spring Cloud BOM (Bill of Materials): added to the root parent POM\

### Q: What are the "Big 4" Spring Cloud components and what does each do?

**A:** 1. Service Discovery (Netflix Eureka): services register themselves on startup; clients ask Eureka for the current IP/port of a service by name — no hardcoded URLs. 2. API Gateway (Spring Cloud Gateway): single entry point for all clients; handles routing, rate limiting, authentication, and SSL termination. 3. Centralized Config (Spring Cloud Config): all application.properties stored in a Git repo; services pull config at startup without code changes. 4. Resilience (Resilience4j): Circuit Breaker (CLOSED→OPEN on failures), Rate Limiter, Retry, Bulkhead. Prevents one failing service from cascading across the system.

```java
// 1. Eureka: service registers itself
@SpringBootApplication
@EnableEurekaClient
public class OrderServiceApplication { ... }
# application.yml
eureka.client.service-url.defaultZone: http://localhost:8761/eureka/

// 2. Gateway routing
spring:
  cloud:
    gateway:
      routes:
        - id: order-service
          uri: lb://order-service   # lb:// = load balanced via Eureka
          predicates:
            - Path=/api/orders/**

// 3. OpenFeign: call another service by name
@FeignClient(name = "inventory-service")
public interface InventoryClient {
    @GetMapping("/api/inventory/{sku}")
    boolean checkStock(@PathVariable String sku);
}

// 4. Circuit Breaker
@CircuitBreaker(name = "inventoryService", fallbackMethod = "fallback")
public boolean checkStock(String sku) {
    return inventoryClient.checkStock(sku);
}
public boolean fallback(String sku, Exception e) { return false; }
```

### Q: How do you integrate AWS SDK 2.x in a Java/Spring Boot application?

**A:** Use AWS SDK for Java 2.x (not 1.x): built on Netty for non-blocking I/O, uses builder pattern, clients are thread-safe singletons. Add BOM to pom.xml for version management, then add only the services you need. Authentication: use DefaultCredentialsProvider — automatically checks environment variables, ~/.aws/credentials file, IAM roles (EC2/Lambda). Never hardcode Access Key/Secret Key in code. Clients should be Spring @Beans for lifecycle management and sharing.

```java
<!-- pom.xml: BOM for version management -->
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>software.amazon.awssdk</groupId>
      <artifactId>bom</artifactId>
      <version>2.20.0</version>
      <type>pom</type><scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>
<dependencies>
  <dependency>
    <groupId>software.amazon.awssdk</groupId>
    <artifactId>s3</artifactId>  <!-- no version needed -->
  </dependency>
</dependencies>

// Spring @Configuration: client as a Bean
@Configuration
public class AwsConfig {
    @Bean
    public S3Client s3Client() {
        return S3Client.builder()
            .region(Region.US_EAST_1)
            .credentialsProvider(DefaultCredentialsProvider.create())
            .build(); // auto-discovers credentials from env/IAM role
    }
}

// DefaultCredentialsProvider checks (in order):
// 1. AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY env vars
// 2. ~/.aws/credentials file (local development)
// 3. EC2 instance profile / ECS task role (production — no keys needed!)
```

### Q: How do you use AWS Secrets Manager to avoid storing credentials in application.properties?

**A:** AWS Secrets Manager stores sensitive config (DB passwords, API keys) as versioned JSON secrets. At app startup, call SecretsManagerClient to fetch the secret string, parse it as JSON, and inject values. This prevents credentials appearing in source code, logs, or container images. For Spring Boot: use aws-secretsmanager-jdbc or a @PostConstruct init in a @Configuration class to inject secrets into DataSource properties. In production, the service runs with an IAM Role — no hardcoded keys anywhere.

```java
<dependency>
  <groupId>software.amazon.awssdk</groupId>
  <artifactId>secretsmanager</artifactId>
</dependency>

@Service
public class SecretService {
    private final SecretsManagerClient client = SecretsManagerClient.create();

    public String getSecret(String secretName) {
        GetSecretValueResponse response = client.getSecretValue(
            GetSecretValueRequest.builder().secretId(secretName).build()
        );
        return response.secretString(); // JSON like {"username":"db","password":"xyz"}
    }
}

// Use in Spring @Configuration:
@Configuration
public class DbConfig {
    @Autowired SecretService secretService;

    @Bean
    public DataSource dataSource() {
        String json = secretService.getSecret("prod/myapp/db");
        // Parse JSON and build DataSource — credentials never in properties file
        ObjectMapper mapper = new ObjectMapper();
        JsonNode node = mapper.readTree(json);
        return DataSourceBuilder.create()
            .url("jdbc:mysql://..." + node.get("dbname").asText())
            .username(node.get("username").asText())
            .password(node.get("password").asText())
            .build();
    }
}
```

### Q: Why is Composition preferred over Inheritance? (Composition vs Inheritance)

**A:** Inheritance creates a rigid 

### Q: What is method hiding in Java? Can we override static methods?

**A:** Static methods cannot be overridden — they belong to the class, not the instance. If a subclass defines a static method with the same signature, it HIDES the parent method (not polymorphic). The version called depends on the reference type at compile time, not the actual object. Instance method overriding is resolved at runtime (dynamic dispatch). This is why @Override on a static method causes a compile error.

```java
class Parent {
    public static void staticMethod() { System.out.println("Parent static"); }
    public void instanceMethod()      { System.out.println("Parent instance"); }
}
class Child extends Parent {
    public static void staticMethod() { System.out.println("Child static"); }
    @Override
    public void instanceMethod()      { System.out.println("Child instance"); }
}

Parent p = new Child();
p.staticMethod();   // "Parent static" — compile-time type, method HIDING
p.instanceMethod(); // "Child instance" — runtime type, polymorphism

// Rule: static → hiding (reference type decides), instance → overriding (object type decides)
```

### Q: What is covariant return type? Can we change return type when overriding?

**A:** Yes — covariant return type allows an overriding method to return a subtype of the parent\

### Q: What are Marker Interfaces? Give examples and modern alternatives.

**A:** A marker interface has no methods — it simply 

### Q: Why use char[] instead of String for passwords?

**A:** Security reason: Strings are immutable and interned in the String Pool — a password String lives in memory until GC collects it (unpredictable). During that time a heap dump or memory scrape can expose it. char[] can be explicitly zeroed out (Arrays.fill(pwd, \

### Q: How do you create a custom annotation? What are @Retention and @Target?

**A:** @Retention controls when the annotation is available: SOURCE (discarded after compile), CLASS (stored in .class, not at runtime), RUNTIME (available via reflection at runtime — most common for frameworks). @Target restricts where the annotation can be used: TYPE, METHOD, FIELD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE, PACKAGE. Annotations are interfaces under the hood — methods define 

### Q: What are ClassLoaders in Java? What are the different types?

**A:** ClassLoader loads .class files into the JVM on demand (lazy). Types: 1) Bootstrap ClassLoader — written in native C++, loads core JDK classes (java.lang.*, java.util.*). 2) Platform/Extension ClassLoader — loads classes from ext directory / module path. 3) Application/System ClassLoader — loads classes from classpath (your app code). Delegation model: child always delegates to parent first (parent-first). This prevents rogue code replacing java.lang.String. You can create a custom ClassLoader by extending ClassLoader and overriding findClass().

```java
// Check which ClassLoader loaded a class
System.out.println(String.class.getClassLoader());     // null = Bootstrap
System.out.println(MyService.class.getClassLoader());  // AppClassLoader

// Custom ClassLoader (e.g. load from database or network)
public class NetworkClassLoader extends ClassLoader {
    @Override
    protected Class<?> findClass(String name) throws ClassNotFoundException {
        byte[] bytes = fetchBytecodeFromNetwork(name);
        return defineClass(name, bytes, 0, bytes.length);
    }
}

// Parent delegation:
// AppClassLoader → PlatformCL → BootstrapCL
// If bootstrap can load it (e.g. java.lang.String), it does.
// Your malicious String class in classpath is NEVER loaded.

// Two classes loaded by DIFFERENT ClassLoaders are NOT equal:
Class<?> c1 = loader1.loadClass("com.app.Foo");
Class<?> c2 = loader2.loadClass("com.app.Foo");
System.out.println(c1 == c2); // false
```

### Q: What is Type Erasure in Java Generics? What is the PECS principle?

**A:** Type Erasure: generic type parameters are removed by the compiler at compile time. List<String> becomes List (raw type) in bytecode. This is for backward compatibility with pre-Java-5 code. Consequence: cannot do new T[], cannot do instanceof List<String>, type info not available at runtime. PECS (Producer Extends, Consumer Super): use <? extends T> when you only READ from a collection (it produces T), use <? super T> when you only WRITE to it (it consumes T). Unbounded <?> when you do neither.

```java
// Type Erasure — these have identical bytecode:
public void print(List<String> list) { ... }
// After erasure → public void print(List list)

// Cannot use generics with arrays or instanceof:
// new T[10]; // compile error
// list instanceof List<String>; // compile error

// PECS in action:
// Producer (read from) → extends
public double sum(List<? extends Number> nums) {
    return nums.stream().mapToDouble(Number::doubleValue).sum();
    // Can read as Number, but cannot add elements
}

// Consumer (write to) → super
public void addNumbers(List<? super Integer> list) {
    list.add(1); list.add(2); // can add Integers
    // Can only read as Object
}

// List<?> vs List<Object>:
List<String> strings = new ArrayList<>();
List<?> wildcard = strings;      // OK — wildcard accepts any List
List<Object> objects = strings;  // COMPILE ERROR — not substitutable
```

### Q: What are Strong, Weak, Soft, and Phantom references in Java GC?

**A:** Strong: normal reference (Object o = new Object()). GC never collects while strong reference exists. Soft: GC collects only when JVM is low on memory — ideal for memory-sensitive caches. Weak: GC collects at next cycle regardless of memory — used in WeakHashMap for cache entries that should die when key is no longer used elsewhere. Phantom: object already finalized, reference enqueued for cleanup actions. Used for post-mortem cleanup without finalize().

```java
import java.lang.ref.*;

// Soft reference — survives until memory pressure
SoftReference<byte[]> cache = new SoftReference<>(new byte[1024 * 1024]);
byte[] data = cache.get(); // null if GC collected it

// Weak reference — collected at next GC cycle
WeakReference<User> userRef = new WeakReference<>(new User("Alice"));
User u = userRef.get(); // may be null

// WeakHashMap: entry removed when key has no strong reference
WeakHashMap<Object, String> map = new WeakHashMap<>();
Object key = new Object();
map.put(key, "value");
key = null; // key eligible for GC → entry removed from map on next GC

// Phantom reference — for cleanup
ReferenceQueue<User> queue = new ReferenceQueue<>();
PhantomReference<User> phantom = new PhantomReference<>(new User(), queue);
// When object is collected, phantom is enqueued — poll queue to clean up resources
```

### Q: What are Java memory areas? What is the JVM heap structure?

**A:** JVM memory: Heap (all objects, GC-managed, divided into Young Gen + Old Gen), Stack (one per thread: local variables, method frames, references), Metaspace (class metadata, bytecode — native memory, Java 8+), Code Cache (JIT-compiled native code), PC Register (current instruction pointer per thread), Native Method Stack (for JNI). Heap Young Gen: Eden + S0 + S1 (Survivor). Objects start in Eden → survive minor GC → Survivor → eventually promoted to Old Gen → major/full GC.

```java
// Heap Structure:
// ┌─────────────────────────────────────────────┐
// │  Young Generation               Old Gen      │
// │  ┌────────┬────────┬────────┐  ┌──────────┐  │
// │  │ Eden   │  S0    │  S1    │  │ Tenured  │  │
// │  └────────┴────────┴────────┘  └──────────┘  │
// └─────────────────────────────────────────────┘

// Minor GC: Eden + S0 → live objects → S1 or Old Gen (age threshold ~15)
// Major/Full GC: Old Gen collected — expensive pause

// JVM flags:
// -Xms512m         initial heap size
// -Xmx2g           max heap size
// -Xmn512m         Young Gen size
// -XX:NewRatio=2   Old:Young ratio = 2:1

// Monitor GC via:
// jstat -gc <pid> 1000   (every 1 second)
// -XX:+PrintGCDetails -XX:+PrintGCDateStamps
// Spring Boot Actuator: /actuator/metrics/jvm.memory.used
```

### Q: What is a Spliterator? How does it enable parallel streams?

**A:** Spliterator (Splittable Iterator) is the engine behind Java Streams. It can iterate a data source sequentially OR split itself into two halves for parallel processing. When you call .parallel() on a stream, the ForkJoinPool uses the Spliterator to recursively split the work among CPU cores. Each split runs on its own thread. The split() method returns a new Spliterator covering roughly half the elements. Characteristics flags (SIZED, ORDERED, DISTINCT, etc.) help the Stream optimizer make decisions.

```java
// Spliterator basics
List<String> list = List.of("a", "b", "c", "d", "e", "f");
Spliterator<String> spliterator = list.spliterator();
System.out.println("Size: " + spliterator.estimateSize()); // 6

// Split in half
Spliterator<String> second = spliterator.trySplit();
// spliterator now covers first half, second covers second half

// Parallel stream uses Spliterator under the hood:
long count = list.parallelStream()
    .filter(s -> s.compareTo("c") > 0)
    .count();
// ForkJoinPool splits, filters each half in parallel, combines count

// Custom Spliterator (e.g. for a linked structure)
class NodeSpliterator implements Spliterator<Integer> {
    @Override public boolean tryAdvance(Consumer<? super Integer> action) { ... }
    @Override public Spliterator<Integer> trySplit() { return null; } // no split
    @Override public long estimateSize() { return Long.MAX_VALUE; }
    @Override public int characteristics() { return ORDERED; }
}
```

### Q: How do you make an ArrayList immutable or synchronized?

**A:** Immutable: Collections.unmodifiableList(list) — wraps the list; any mutating call throws UnsupportedOperationException. Note: the underlying list is still mutable through the original reference. Truly immutable: List.of() or List.copyOf() (Java 9+). Synchronized: Collections.synchronizedList(list) — wraps with mutex on every method. Better: CopyOnWriteArrayList for read-heavy concurrent access (writes make a copy, reads always safe). final ArrayList only prevents reassigning the variable — the list contents can still change.

```java
// Unmodifiable wrapper (Java 5+)
List<String> mutable = new ArrayList<>(List.of("a", "b"));
List<String> readOnly = Collections.unmodifiableList(mutable);
readOnly.add("c"); // throws UnsupportedOperationException
mutable.add("c");  // still works — readOnly reflects the change!

// Truly immutable (Java 9+)
List<String> immutable = List.of("a", "b", "c"); // null not allowed
List<String> safeCopy  = List.copyOf(mutable);   // snapshot, defensive copy

// final keyword ≠ immutable
final ArrayList<String> list = new ArrayList<>();
list.add("x"); // OK! final prevents reassignment, NOT mutation
list = new ArrayList<>(); // COMPILE ERROR

// Synchronized (legacy)
List<String> syncList = Collections.synchronizedList(new ArrayList<>());

// Better for concurrent reads:
List<String> cow = new CopyOnWriteArrayList<>(List.of("a","b"));
```

### Q: What changed in HashMap in Java 8? What is IdentityHashMap?

**A:** Java 8 HashMap changes: 1) Bucket linked list → Red-Black Tree when chain length > 8 (treeifyBin). This prevents O(n) worst case from hash collisions (hash DoS attacks), giving O(log n). Tree reverts to list when shrinks below 6. 2) Internal hash() function improved with bit-spreading. IdentityHashMap: uses == (reference equality) instead of .equals() for key comparison, and System.identityHashCode() instead of hashCode(). Use case: serialization graphs (track which exact objects were seen, not which equal objects), interning caches, object graph traversal.

```java
// Java 8 HashMap: treeification
Map<String, Integer> map = new HashMap<>();
// If 8+ keys hash to the same bucket → linked list becomes TreeMap-like
// This protects against collision attacks that degrade to O(n)

// IdentityHashMap: compares by reference (==), not by .equals()
Map<Object, String> identityMap = new IdentityHashMap<>();
String a = new String("key");
String b = new String("key");
identityMap.put(a, "first");
identityMap.put(b, "second");
System.out.println(identityMap.size()); // 2 — a != b (different references)

HashMap<String, String> hashMap = new HashMap<>();
hashMap.put(a, "first");
hashMap.put(b, "second");
System.out.println(hashMap.size()); // 1 — a.equals(b), same key

// Use case: object graph serialization (avoid infinite loops)
IdentityHashMap<Object, Boolean> visited = new IdentityHashMap<>();
```

### Q: What is Map.Entry and how do you iterate a Map efficiently?

**A:** Map.Entry<K,V> is a nested interface inside Map representing a key-value pair. entrySet() returns Set<Map.Entry<K,V>> — iterating it gives access to both key and value in one step (most efficient). Alternatives: keySet() then get(key) — inefficient (two lookups), values() — no key access. Since Java 8: forEach(BiConsumer) is the cleanest. replaceAll(BiFunction) and compute/merge operations work on entries directly.

```java
Map<String, Integer> scores = Map.of("Alice", 95, "Bob", 87, "Carol", 92);

// Most efficient: entrySet() — one lookup per entry
for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + " → " + entry.getValue());
}

// BAD: keySet() + get() — double lookup
for (String key : scores.keySet()) {
    scores.get(key); // redundant lookup
}

// Java 8: forEach (cleanest)
scores.forEach((name, score) -> System.out.println(name + ": " + score));

// Modify values during iteration via replaceAll:
Map<String, Integer> mutable = new HashMap<>(scores);
mutable.replaceAll((name, score) -> score + 5); // add 5 bonus points

// computeIfAbsent: get or create
Map<String, List<String>> groups = new HashMap<>();
groups.computeIfAbsent("admin", k -> new ArrayList<>()).add("Alice");
```

### Q: What happens if Collections.sort() receives a list with null elements?

**A:** Collections.sort() will throw NullPointerException because null cannot be compared using the natural ordering (compareTo) or a Comparator that doesn\

### Q: ConcurrentHashMap internal working: how does it differ from HashMap?

**A:** Java 8 ConcurrentHashMap: no global lock. Reads are lock-free (volatile nodes). Writes lock only the specific bucket (one node) using synchronized + CAS (Compare-And-Swap). This allows true parallelism for different buckets. computeIfAbsent, putIfAbsent are atomic. Null keys/values are NOT allowed (unlike HashMap). Size via mappingCount() (returns long). Java 7 used segment-level locking (16 segments); Java 8 uses per-bucket locking with CAS for much finer granularity.

```java
ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

// Atomic operations (no external synchronization needed)
map.putIfAbsent("key", 1);                         // only inserts if absent
map.computeIfAbsent("key", k -> expensiveLoad(k)); // compute only if absent
map.compute("counter", (k, v) -> v == null ? 1 : v + 1); // atomic increment
map.merge("counter", 1, Integer::sum);             // merge with existing

// Thread-safe iteration (no ConcurrentModificationException)
map.forEach(10_000, (k, v) -> process(k, v)); // parallelism threshold
map.forEachValue(1, System.out::println);

// Cannot store null:
map.put(null, 1); // throws NullPointerException
map.put("key", null); // throws NullPointerException

// size() is approximate — use mappingCount() for large maps:
long count = map.mappingCount(); // long (handles > Integer.MAX_VALUE entries)
```

### Q: How do you ensure threads run in order T1 → T2 → T3?

**A:** Option 1: Thread.join() — T1.start(), T1.join() (waits for T1), T2.start(), T2.join(), T3.start(). Simple but blocks the calling thread. Option 2: CountDownLatch — T1 counts down after completion; T2 awaits the latch before starting. Option 3: Single-thread ExecutorService — submit tasks to a single-thread executor; they execute in submission order. Option 4: CompletableFuture.thenRun() chain — most modern and elegant, non-blocking.

```java
// Option 1: join() — simplest
Thread t1 = new Thread(() -> System.out.println("T1"));
Thread t2 = new Thread(() -> System.out.println("T2"));
Thread t3 = new Thread(() -> System.out.println("T3"));
t1.start(); t1.join(); // block until T1 done
t2.start(); t2.join();
t3.start(); t3.join();

// Option 2: CountDownLatch
CountDownLatch l1 = new CountDownLatch(1);
CountDownLatch l2 = new CountDownLatch(1);
new Thread(() -> { System.out.println("T1"); l1.countDown(); }).start();
new Thread(() -> { try { l1.await(); System.out.println("T2"); l2.countDown(); } catch ... }).start();
new Thread(() -> { try { l2.await(); System.out.println("T3"); } catch ... }).start();

// Option 3: CompletableFuture (cleanest)
CompletableFuture.runAsync(() -> System.out.println("T1"))
    .thenRun(() -> System.out.println("T2"))
    .thenRun(() -> System.out.println("T3"))
    .join();
```

### Q: CountDownLatch vs CyclicBarrier: when to use each?

**A:** CountDownLatch: one-time gate. A thread awaits until count reaches 0 (others call countDown()). Count can only go down, never reset. Use for 

### Q: What are use cases for ThreadLocal? What are the risks?

**A:** ThreadLocal<T> provides a per-thread variable — each thread has its own isolated copy. Changes in one thread are invisible to others. Use cases: 1) Request context (Spring stores SecurityContext, transaction context per thread). 2) SimpleDateFormat (not thread-safe — give each thread its own copy). 3) Database connection per thread. Risks: Memory leaks in thread pools — threads are reused, old ThreadLocal values persist unless explicitly removed. Rule: always call remove() in a finally block after use.

```java
// SimpleDateFormat: NOT thread-safe — use ThreadLocal
ThreadLocal<SimpleDateFormat> dateFormat = ThreadLocal.withInitial(
    () -> new SimpleDateFormat("yyyy-MM-dd")
);

String formatted = dateFormat.get().format(new Date()); // thread-safe

// Request context (similar to Spring's RequestContextHolder)
public class RequestContext {
    private static final ThreadLocal<String> userId = new ThreadLocal<>();
    public static void setUser(String id)  { userId.set(id); }
    public static String getUser()         { return userId.get(); }
    public static void clear()             { userId.remove(); } // CRITICAL!
}

// In filter/interceptor (Spring-style):
try {
    RequestContext.setUser(extractUserFromJwt(request));
    chain.doFilter(request, response);
} finally {
    RequestContext.clear(); // MUST clean up — thread goes back to pool!
}

// Memory leak scenario: thread pool reuses threads.
// If remove() is not called, ThreadLocal value survives to next request.
```

### Q: Optimistic vs Pessimistic Locking: when to use each?

**A:** Pessimistic Locking: assume conflicts will happen; lock the resource immediately (SELECT FOR UPDATE in SQL, synchronized in Java). Safe but reduces concurrency — other threads/transactions block until lock released. Good for high-contention scenarios. Optimistic Locking: assume conflicts are rare; don\

### Q: How does the Fork/Join framework work? How is it different from thread pools?

**A:** Fork/Join (java.util.concurrent.ForkJoinPool): designed for divide-and-conquer tasks. A task can fork() itself into sub-tasks, then join() their results. Key feature: work-stealing — idle threads steal tasks from busy threads\

### Q: What is the difference between peek() and map() in streams? When is peek() dangerous?

**A:** map() is a transforming intermediate operation — it returns a new stream of transformed elements. peek() is a 

### Q: BiFunction, BiConsumer, BiPredicate vs their single-parameter counterparts?

**A:** Single-parameter: Function<T,R> (T→R), Consumer<T> (T→void), Predicate<T> (T→boolean). Bi-variants accept TWO inputs: BiFunction<T,U,R> (T,U→R), BiConsumer<T,U> (T,U→void), BiPredicate<T,U> (T,U→boolean). Use when your logic naturally takes two inputs (e.g. key-value pair, comparison). Collectors.toMap, Map.forEach use BiFunction/BiConsumer under the hood. There are no Tri* variants in standard API — use custom functional interfaces or tuples.

```java
// BiFunction<T,U,R>: takes two inputs, returns result
BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);
System.out.println(repeat.apply("ha", 3)); // "hahaha"

// BiConsumer<T,U>: takes two inputs, returns nothing — perfect for Map.forEach
Map<String, Integer> scores = Map.of("Alice", 95, "Bob", 87);
scores.forEach((name, score) -> System.out.println(name + ": " + score));
// Map.forEach signature: void forEach(BiConsumer<? super K, ? super V>)

// BiPredicate<T,U>: takes two inputs, returns boolean
BiPredicate<String, Integer> longerThan = (s, n) -> s.length() > n;
System.out.println(longerThan.test("Hello", 3)); // true

// Collectors.toMap uses BiFunction for merge:
Map<String, Integer> merged = Stream.of("a","b","a","c")
    .collect(Collectors.toMap(
        s -> s,           // key extractor
        s -> 1,           // value extractor
        (v1, v2) -> v1 + v2  // BiFunction: merge duplicate keys
    ));
```

### Q: Optional.map() vs Optional.flatMap(): why do we need flatMap?

**A:** Optional.map() transforms the value inside an Optional — wraps the result in Optional. If the mapping function itself returns an Optional<T>, you get Optional<Optional<T>> (nested). Optional.flatMap() 

### Q: What are method references (::)? When to prefer them over lambdas?

**A:** Method references are shorthand for lambdas that do nothing but call an existing method. Four types: 1) Static: ClassName::staticMethod (e.g. Integer::parseInt). 2) Instance on specific instance: instance::method (e.g. System.out::println). 3) Instance on arbitrary instance of type: ClassName::instanceMethod (e.g. String::toUpperCase). 4) Constructor: ClassName::new (e.g. ArrayList::new). Prefer method references when the lambda just delegates to a single method — they are more readable and can be more performant (no extra lambda wrapper in some JITs).

```java
// 1. Static method reference
List<String> numStr = List.of("1","2","3");
List<Integer> nums = numStr.stream()
    .map(Integer::parseInt)          // equivalent to: s -> Integer.parseInt(s)
    .collect(Collectors.toList());

// 2. Instance method on specific object
List<String> names = List.of("Alice","Bob");
names.forEach(System.out::println); // equivalent to: s -> System.out.println(s)

// 3. Instance method on arbitrary object of the type
List<String> words = List.of("hello","world");
words.stream()
    .map(String::toUpperCase)        // s -> s.toUpperCase()
    .forEach(System.out::println);

// 4. Constructor reference
Supplier<ArrayList<String>> listFactory = ArrayList::new;
ArrayList<String> newList = listFactory.get();

// Stream.toList() with constructor reference:
List<User> users = ids.stream()
    .map(User::new)                  // id -> new User(id)
    .collect(Collectors.toList());
```

### Q: What is the difference between POJO, DTO, Entity, Bean, and Repository?

**A:** POJO (Plain Old Java Object): any ordinary Java class with no framework constraints. DTO (Data Transfer Object): a POJO used specifically to transfer data between layers (no business logic). Entity: a POJO mapped to a database table (@Entity in JPA). Bean: a Spring-managed object (created and wired by Spring container). Repository: a data-access layer component (@Repository), abstracts DB operations. Hierarchy: all are POJOs; Entity, DTO, Bean are specializations for specific roles.

```java
// Entity: maps to DB table
@Entity @Table(name = "users")
public class User {
    @Id @GeneratedValue Long id;
    String name; String email;
}

// DTO: used for request/response, no DB annotation
public record UserDTO(String name, String email) {}

// Repository: data access layer
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// Service Bean: business logic
@Service
public class UserService {
    private final UserRepository repo; // injected Bean
    public UserDTO getUser(Long id) {
        User user = repo.findById(id).orElseThrow();
        return new UserDTO(user.getName(), user.getEmail()); // Entity → DTO
    }
}
```

### Q: What is the difference between @Component and @Bean?

**A:** @Component: class-level annotation. Spring auto-detects via component scanning. You define the class; Spring instantiates it. @Bean: method-level annotation inside a @Configuration class. You write the instantiation code (return new X()). Use @Component for your own classes. Use @Bean when you need to configure a third-party class you cannot annotate (e.g. Jackson ObjectMapper, RestTemplate), or when you need conditional/custom instantiation logic.

```java
// @Component: Spring creates it, you don't control instantiation
@Component
public class EmailService {
    public void send(String msg) { ... }
}

// @Bean: you control creation — useful for 3rd party classes
@Configuration
public class AppConfig {

    // Can't annotate Jackson's ObjectMapper — use @Bean
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    // Conditional creation
    @Bean
    @ConditionalOnProperty(name = "feature.cache.enabled", havingValue = "true")
    public CacheManager cacheManager() {
        return new RedisCacheManager(...);
    }
}

// Key difference: @Bean allows you to call the method directly
// (within @Configuration class) and get the same singleton instance
```

### Q: What is DispatcherServlet? What is the complete Spring MVC request flow?

**A:** DispatcherServlet is the Front Controller in Spring MVC — a single servlet that handles ALL incoming HTTP requests. Flow: 1) Request arrives at DispatcherServlet. 2) HandlerMapping maps URL to Controller method. 3) HandlerAdapter invokes the method. 4) Controller returns ModelAndView or @ResponseBody data. 5) ViewResolver resolves view name (if not @RestController). 6) View renders response. With @RestController, step 5-6 are replaced by MessageConverter (Jackson) serializing to JSON directly.

```java
// Spring MVC request flow (simplified):
// Client → DispatcherServlet → HandlerMapping (URL → method)
//       → HandlerAdapter (invokes method)
//       → Controller method runs, returns response body
//       → HttpMessageConverter (Object → JSON via Jackson)
//       → Response sent to client

// HandlerMapping types (auto-configured):
// RequestMappingHandlerMapping: scans @RequestMapping annotations
// RouterFunctionMapping: for functional routes (WebFlux)

// DispatcherServlet registration (Spring Boot auto-configures this):
@Bean
public DispatcherServlet dispatcherServlet() { return new DispatcherServlet(); }
@Bean
public ServletRegistrationBean<DispatcherServlet> registration() {
    return new ServletRegistrationBean<>(dispatcherServlet(), "/");
}

// Filter vs Interceptor position:
// Request → [Servlet Filters] → DispatcherServlet → [Interceptors] → Controller
// Filters: before Spring context (auth, CORS, logging)
// Interceptors: inside Spring context (authentication, metrics)
```

### Q: What are idempotent HTTP methods? Common HTTP status codes?

**A:** Idempotent: calling the method multiple times has the same result as calling it once. GET, PUT, DELETE, HEAD, OPTIONS are idempotent. POST is NOT idempotent (each call creates a new resource). PATCH is NOT guaranteed to be idempotent. Safe methods (no side effects): GET, HEAD, OPTIONS. Key status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized (not authenticated), 403 Forbidden (authenticated but no permission), 404 Not Found, 409 Conflict, 422 Unprocessable Entity (validation), 429 Too Many Requests, 500 Internal Server Error, 503 Service Unavailable.

```java
// Idempotency examples:
// GET /users/1 — safe + idempotent (no side effects)
// PUT /users/1 {"name":"Alice"} — idempotent (2nd call = same result)
// DELETE /users/1 — idempotent (deleting twice = resource still gone)
// POST /users {"name":"Alice"} — NOT idempotent (creates a new user each time)

// Spring REST status codes:
@PostMapping("/users")
public ResponseEntity<UserDTO> create(@RequestBody UserDTO dto) {
    User saved = userService.create(dto);
    return ResponseEntity.status(HttpStatus.CREATED).body(toDto(saved)); // 201
}

@DeleteMapping("/users/{id}")
public ResponseEntity<Void> delete(@PathVariable Long id) {
    userService.delete(id);
    return ResponseEntity.noContent().build(); // 204
}

// Custom 409 Conflict:
if (userRepo.existsByEmail(dto.email())) {
    throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
}
```

### Q: What is @Transactional propagation? What happens when one @Transactional method calls another?

**A:** Propagation defines how transactions behave when a transactional method is called from within another transaction. REQUIRED (default): join existing transaction or create new one. REQUIRES_NEW: always suspend existing, create new transaction. NESTED: create save-point within existing transaction (can rollback to save-point without rolling back outer). SUPPORTS: join if exists, no transaction if not. NOT_SUPPORTED: suspend existing, run without transaction. NEVER: throw exception if transaction exists. Important: self-invocation bypasses the proxy — calling @Transactional from within the same class does NOT start a new transaction.

```java
@Service
public class OrderService {

    @Transactional // REQUIRED (default): uses existing tx or creates new
    public void placeOrder(Order order) {
        orderRepo.save(order);
        notificationService.notify(order); // joins this transaction
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void auditLog(String event) {
        // Always runs in its own separate transaction
        // If caller rolls back, this still commits
        auditRepo.save(new AuditLog(event));
    }

    @Transactional(propagation = Propagation.NESTED)
    public void updateInventory(Item item) {
        // Creates a save-point — can rollback to here without affecting outer tx
        inventoryRepo.update(item);
    }

    // SELF-INVOCATION BUG: this.auditLog() bypasses the proxy!
    @Transactional
    public void process() {
        this.auditLog("event"); // NOT a new transaction — proxy not involved
    }
}
```

### Q: Servlet Filter vs Spring Interceptor: what is the difference?

**A:** Filter (javax.servlet.Filter): runs BEFORE DispatcherServlet at the Servlet container level. Has access to raw HttpServletRequest/Response. Cannot access Spring context/beans easily. Use for: authentication, CORS, request logging, compression, encoding. Interceptor (HandlerInterceptor): runs INSIDE Spring\

### Q: What is first-level vs second-level cache in Hibernate?

**A:** First-level cache (L1): Session-scoped, enabled by default, cannot be disabled. Within a single Session, the same entity is returned from cache on repeated load calls (no extra DB queries). Cleared when Session closes. Second-level cache (L2): SessionFactory-scoped, shared across Sessions, opt-in. Configured per entity with @Cache. Providers: EhCache, Infinispan, Redis. Useful for frequently read, rarely changed reference data. Query cache: caches query result sets (entity IDs) — useful with L2 entity cache.

```java
// First-level cache (automatic):
Session session = factory.openSession();
User u1 = session.get(User.class, 1L); // DB query
User u2 = session.get(User.class, 1L); // L1 cache — NO DB query
System.out.println(u1 == u2); // true — same instance

// Second-level cache (opt-in):
@Entity
@Cacheable
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE, region = "users")
public class User { ... }

// application.properties:
// spring.jpa.properties.hibernate.cache.use_second_level_cache=true
// spring.jpa.properties.hibernate.cache.region.factory_class=
//   org.hibernate.cache.ehcache.EhCacheRegionFactory

// Query cache:
@Query("SELECT u FROM User u WHERE u.role = :role")
@QueryHints(@QueryHint(name = "org.hibernate.cacheable", value = "true"))
List<User> findByRole(@Param("role") String role);
```

### Q: What are entity inheritance strategies in Hibernate?

**A:** SINGLE_TABLE (default): all subclasses in one table with a discriminator column. Best performance (single join), but table has many nullable columns. TABLE_PER_CLASS: each concrete class has its own table with all fields. Good for polymorphic queries over individual types; poor for polymorphic queries over the hierarchy (UNION). JOINED: parent fields in parent table, child-specific fields in child table. Normalized, no nulls, but requires JOIN on every query. Choose: SINGLE_TABLE for performance, JOINED for normalization, TABLE_PER_CLASS for independent entities.

```java
// SINGLE_TABLE (fastest queries)
@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "type", discriminatorType = DiscriminatorType.STRING)
public abstract class Payment { @Id Long id; BigDecimal amount; }

@Entity @DiscriminatorValue("CREDIT")
public class CreditCardPayment extends Payment { String cardNumber; }

@Entity @DiscriminatorValue("PAYPAL")
public class PaypalPayment extends Payment { String email; }

// Generated table: payments(id, amount, type, cardNumber, email)
// cardNumber is NULL for PayPal rows, email is NULL for credit card rows

// JOINED (normalized, extra JOIN per query)
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public abstract class Payment { @Id Long id; BigDecimal amount; }

@Entity
public class CreditCardPayment extends Payment { String cardNumber; }
// Tables: payment(id, amount) + credit_card_payment(id FK, cardNumber)
// SELECT joins both tables on every query
```

### Q: What is hbm2ddl.auto? What are the options and when to use each?

**A:** spring.jpa.hibernate.ddl-auto (hbm2ddl.auto) controls schema generation on startup. Options: create — drop and recreate schema every startup (wipes data). create-drop — create on start, drop on shutdown (for tests). update — alter existing schema to match entities (additive only, risky in prod). validate — validate schema matches entities, throw error if mismatch (safe for prod). none — do nothing (use Flyway/Liquibase for migrations). Best practice: none or validate in production with Flyway/Liquibase for versioned migrations.

```java
# application.properties — environment-specific settings:

# Development: recreate schema with test data
spring.jpa.hibernate.ddl-auto=create-drop

# Staging/CI: validate schema matches entities (catches drift early)
spring.jpa.hibernate.ddl-auto=validate

# Production: NEVER use create/update — use Flyway instead
spring.jpa.hibernate.ddl-auto=none

# With Flyway (recommended for production):
# spring.flyway.enabled=true
# spring.flyway.locations=classpath:db/migration
# Flyway runs SQL files: V1__init.sql, V2__add_index.sql, etc.
# Tracks applied migrations in flyway_schema_history table

# hbm2ddl.auto=update risks in production:
# - Can only ADD columns/tables, never remove them
# - No transaction safety
# - Data type changes may fail silently
```

### Q: What is the difference between save(), persist(), saveOrUpdate(), and merge() in Hibernate?

**A:** persist(): JPA standard, inserts new entity, must be in transaction, does not return anything, entity must be Transient. save(): Hibernate-specific, inserts entity, returns generated ID immediately, can work outside transaction (but not recommended). saveOrUpdate(): Hibernate-specific, inserts if new, updates if detached. merge(): JPA standard, copies detached entity state to a managed entity and returns the managed copy. Use merge() for updating detached entities (e.g. loaded in one session, modified, reattached in another). In Spring Data JPA: save() intelligently calls persist() for new entities and merge() for existing ones (checks if ID is null or present in DB).

```java
// Spring Data JpaRepository.save():
// if entity.id == null → EntityManager.persist() (insert)
// if entity.id != null → EntityManager.merge() (update)

// persist(): only for NEW (transient) entities
@Transactional
public void createUser(User user) {
    entityManager.persist(user); // user.id must be null
    // user is now MANAGED — changes tracked until session closes
}

// merge(): detached entity → managed copy
@Transactional
public User updateUser(User detachedUser) {
    return entityManager.merge(detachedUser); // returns NEW managed instance
    // detachedUser is still detached! use the returned reference
}

// Spring Data (simplest approach):
userRepository.save(new User("Alice"));   // persist (new)
userRepository.save(existingUser);         // merge (has id)

// Hibernate-specific: save() returns ID immediately (useful outside tx)
Long id = (Long) session.save(new User("Bob")); // immediate ID
System.out.println("Created user ID: " + id);
```

### Q: What is Apache Kafka? How does it achieve high throughput?

**A:** Kafka is a distributed event streaming platform — a durable, ordered, append-only log. Key concepts: Topic (named log), Partition (horizontal scaling unit, ordered), Broker (server holding partitions), Consumer Group (parallel consumers, each partition consumed by one member per group), Offset (position in partition). High throughput mechanisms: 1) Sequential disk writes (append-only log — faster than random writes). 2) Zero-copy via sendfile() syscall — data moves from disk to network without CPU copying. 3) Batching messages. 4) Compression (Snappy/LZ4). 5) Consumer pull model (controls pace).

```java
// Spring Kafka producer
@Service
public class OrderProducer {
    @Autowired KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public void publish(Order order) {
        OrderEvent event = new OrderEvent(order.getId(), "ORDER_PLACED");
        kafkaTemplate.send("orders", order.getId().toString(), event);
        // Key = orderId → same key always goes to same partition (ordering guarantee)
    }
}

// Consumer
@Component
public class OrderConsumer {
    @KafkaListener(topics = "orders", groupId = "order-processor")
    public void consume(OrderEvent event, Acknowledgment ack) {
        processOrder(event);
        ack.acknowledge(); // manual commit offset — at-least-once delivery
    }
}

# application.yml key settings:
# spring.kafka.producer.acks=all         # wait for all replicas
# spring.kafka.producer.retries=3
# spring.kafka.consumer.auto-offset-reset=earliest
# spring.kafka.consumer.enable-auto-commit=false  # manual ack
```

### Q: Kafka vs RabbitMQ vs ActiveMQ: when to use each?

**A:** Kafka: distributed log, messages persisted and replayable, very high throughput (millions/sec), pull-based consumers, strong ordering per partition. Use for: event sourcing, audit logs, stream processing, large-scale event pipelines. RabbitMQ: traditional message broker, AMQP protocol, push-based, complex routing (fanout/topic/direct exchanges), messages deleted after consumption, lower throughput. Use for: task queues, request/reply patterns, complex routing logic, microservice decoupling. ActiveMQ: mature JMS broker, supports JMS API, good for legacy Java enterprise. Use when: existing JMS-based code, Spring/JEE integration.

```java
// When to choose:
// KAFKA:
// ✓ Need to replay messages (audit trail, event sourcing)
// ✓ Very high throughput (IoT, clickstream, logs)
// ✓ Multiple independent consumers reading same stream
// ✓ Stream processing (Kafka Streams, Flink)
// ✗ Complex routing logic is harder
// ✗ Small message volumes with complex workflows

// RABBITMQ:
// ✓ Complex routing (headers, topic, direct, fanout exchanges)
// ✓ Request-reply patterns (RPC over messaging)
// ✓ Priority queues
// ✓ Per-message TTL and dead-letter queues
// ✗ Messages not replayable after consumption
// ✗ Lower throughput than Kafka

// ACTIVEMQ:
// ✓ JMS API compatibility (legacy systems)
// ✓ Supports both point-to-point and pub/sub (JMS models)
// ✓ Enterprise features (transactions, XA)
// ✗ Performance lower than Kafka/RabbitMQ in modern use

// Rule of thumb:
// "I need to stream events at scale" → Kafka
// "I need to queue tasks with routing" → RabbitMQ
// "I have legacy JMS code" → ActiveMQ
```

### Q: What is an idempotent Kafka producer? How do you handle consumer lag?

**A:** Idempotent producer (enable.idempotence=true): Kafka assigns a producer ID + sequence number to each message. Broker deduplicates messages with the same sequence number — exactly-once delivery semantics per partition even on retries. Prevents duplicate records from producer retries. Consumer lag: the difference between the latest offset in a partition and the consumer\

### Q: What is BFF (Backend For Frontend)? What is the difference between Forward and Reverse Proxy?

**A:** BFF: a dedicated backend service per client type (mobile BFF, web BFF, third-party BFF). Each BFF aggregates microservice calls and shapes the response to exactly what its frontend needs. Avoids one-size-fits-all API. Forward Proxy: sits in front of CLIENTS — client sends all requests through the proxy. The server does not know the client\

### Q: How do you ensure security in a microservices architecture?

**A:** Layered security: 1) Edge Security — API Gateway handles TLS termination, OAuth2/JWT validation, rate limiting, IP filtering. 2) Service-to-Service Auth — mTLS (mutual TLS) or JWT tokens between services (zero-trust network). 3) Service Mesh (Istio/Linkerd) — automates mTLS, traffic policies, certificate rotation. 4) Secrets Management — AWS Secrets Manager, HashiCorp Vault — never hardcode credentials. 5) Least Privilege — each service has its own DB credentials, IAM role with minimal permissions. 6) Input Validation — validate at each service boundary. 7) Audit Logging — centralize all auth events.

```java
// 1. Gateway-level security (Spring Cloud Gateway):
spring:
  cloud:
    gateway:
      routes:
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
          filters:
            - name: JwtValidation  # custom gateway filter
            - name: RateLimiter
              args:
                redis-rate-limiter.replenishRate: 10
                redis-rate-limiter.burstCapacity: 20

// 2. Service-to-service JWT (services verify token)
// Each microservice validates JWT from gateway or issues service tokens

// 3. Spring Security in each service (minimal):
http.authorizeHttpRequests(auth -> auth
    .requestMatchers("/actuator/health").permitAll()
    .anyRequest().authenticated())
    .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

// 4. Vault for secrets (no credentials in config files):
// spring.cloud.vault.uri=https://vault.company.com
// spring.cloud.vault.token=\${VAULT_TOKEN}
```

### Q: What is an enum in Java? How are enums handled internally?

**A:** An enum is a special class where instances are pre-defined constants. Internally, each enum constant is a public static final instance of the enum class. The compiler generates: a private constructor, values() method (returns array of all constants), valueOf(String) method. Enums implicitly extend java.lang.Enum — so they CANNOT extend another class (but can implement interfaces). Enums are singletons by JVM class loading guarantee — safe for Singleton pattern. Can have fields, methods, abstract methods (each constant overrides). Useful in switch expressions (Java 14+).

```java
// Basic enum with behavior
public enum DayType {
    WEEKDAY("Work day"),
    WEEKEND("Rest day");

    private final String description;

    DayType(String description) { this.description = description; }
    public String getDescription() { return description; }
}

// Enum with abstract method (each constant implements differently)
public enum Operation {
    ADD { @Override public int apply(int a, int b) { return a + b; } },
    SUBTRACT { @Override public int apply(int a, int b) { return a - b; } };
    public abstract int apply(int a, int b);
}

// Singleton pattern using enum (Joshua Bloch's recommendation)
public enum DatabaseConnection {
    INSTANCE;
    private Connection conn;
    public Connection getConnection() { return conn; }
}
DatabaseConnection.INSTANCE.getConnection(); // guaranteed singleton

// Strategy pattern via enum:
Operation.ADD.apply(3, 4); // 7
Operation.SUBTRACT.apply(10, 3); // 7

// Iterating enum values:
for (DayType type : DayType.values()) { System.out.println(type.getDescription()); }
```

### Q: Checked vs unchecked exceptions. Can a constructor, static block, or finally throw exceptions?

**A:** Checked exceptions (extends Exception): compiler forces you to handle or declare them with throws. Use for recoverable conditions (IOException, SQLException). Unchecked (extends RuntimeException): no compiler enforcement. Use for programming errors (NullPointerException, IllegalArgumentException). Constructors: CAN throw checked exceptions (declared in throws clause). Static blocks: CAN throw UNCHECKED exceptions (checked exceptions must be caught within the block). Finally: CAN throw exceptions, BUT this will suppress any exception from the try/catch block (dangerous pattern). try-with-resources wraps resource.close() exceptions as Suppressed.

```java
// Constructor throwing checked exception
public class Connection {
    public Connection(String url) throws SQLException {
        if (url == null) throw new SQLException("URL required");
    }
}

// Static block — only unchecked allowed uncaught:
static {
    try {
        Class.forName("com.mysql.Driver"); // checked — must catch here
    } catch (ClassNotFoundException e) {
        throw new RuntimeException("Driver not found", e); // wrap as unchecked
    }
}

// Finally swallowing exception (BAD):
try {
    throw new RuntimeException("original");
} finally {
    throw new RuntimeException("from finally"); // "original" is LOST!
}

// try-with-resources: close() exceptions become Suppressed
try (InputStream is = openStream()) {
    throw new IOException("read error");
} // if close() also throws → it's added as Suppressed, read error propagates

// Access suppressed exceptions:
catch (IOException e) {
    for (Throwable suppressed : e.getSuppressed()) { ... }
}
```

### Q: What are Suppressed Exceptions? How does try-with-resources handle them?

**A:** Suppressed exceptions occur when a second exception is thrown while handling the first (typically in finally blocks or resource closing). Before Java 7, the original exception was silently lost. try-with-resources: automatically calls close() on resources in reverse order of declaration. If close() throws AND the try block also threw, the close() exception is added as a Suppressed exception on the primary exception. Access via Throwable.getSuppressed(). You can also manually add suppressed exceptions with addSuppressed().

```java
// Manual suppression pattern (pre-Java 7 style)
Exception primary = null;
try {
    riskyOperation();
} catch (Exception e) {
    primary = e;
} finally {
    try {
        resource.close();
    } catch (Exception closeEx) {
        if (primary != null) {
            primary.addSuppressed(closeEx); // attach, don't lose
        } else {
            throw closeEx;
        }
    }
    if (primary != null) throw primary;
}

// Java 7+: try-with-resources handles this automatically
try (Connection conn = getConnection();  // closed second
     Statement stmt = conn.createStatement()) { // closed first
    return stmt.executeQuery("SELECT 1");
}
// If executeQuery() throws AND stmt.close() throws:
// → stmt.close() exception is SUPPRESSED on the executeQuery exception

// Reading suppressed exceptions:
try {
    processWithResources();
} catch (Exception e) {
    System.err.println("Primary: " + e.getMessage());
    for (Throwable s : e.getSuppressed()) {
        System.err.println("Suppressed: " + s.getMessage());
    }
}
```

### Q: Which programming paradigms does Java support?

**A:** Java supports: 1) Object-Oriented — everything is an object with encapsulation, inheritance, polymorphism, abstraction. 2) Imperative — step-by-step statements that mutate state. 3) Functional (Java 8+) — lambdas, streams, immutability, functions as first-class citizens via functional interfaces. 4) Concurrent — built-in threading model. Java is NOT a pure OO language because it has primitive types (int, boolean, etc.) that are not objects, and static methods that do not belong to any instance.

```java
// OOP: encapsulation + polymorphism
class Animal { public void speak() { System.out.println("..."); } }
class Dog extends Animal { @Override public void speak() { System.out.println("Woof"); } }

// Functional (Java 8+): treat behavior as data
Function<Integer, Integer> square = x -> x * x;
List<Integer> squares = List.of(1,2,3).stream().map(square).toList();

// Java is NOT purely OO — primitives exist:
int x = 5; // not an object
// In pure OO (Smalltalk, Ruby), even 5 is an object with methods
```

### Q: Can we override private or final methods? Can we override constructors?

**A:** Private methods: cannot be overridden — they are not visible to subclasses. Subclass can define a method with the same name, but it is a new independent method (method hiding at instance level). Final methods: cannot be overridden — compiler enforces this. Use final to prevent subclasses from changing behavior. Constructors: cannot be overridden — they are not inherited. Each class has its own constructors. Constructors can be overloaded (multiple constructors in same class). @Override on a private method causes a compile error.

```java
class Parent {
    private void secretMethod() { System.out.println("Parent private"); }
    public final void lockedMethod() { System.out.println("Locked"); }
}

class Child extends Parent {
    // This is NOT overriding — it's a NEW method in Child
    private void secretMethod() { System.out.println("Child private"); }

    // COMPILE ERROR: cannot override final method
    // @Override public void lockedMethod() { }
}

// Constructors cannot be overridden:
class Base {
    Base() { System.out.println("Base constructor"); }
}
class Derived extends Base {
    Derived() { super(); System.out.println("Derived constructor"); }
    // Not overriding — this IS a new constructor for Derived
}
```

### Q: Can we make a class abstract without an abstract method? Can a class be both final and abstract?

**A:** Abstract without abstract methods: YES — a class can be declared abstract even if all methods are concrete. This prevents direct instantiation while allowing subclassing (useful as a base with shared state + concrete behavior). Final AND abstract: NO — this is a compile error. final means 

### Q: What happens when super() and this() are called in the same constructor? What is the rule?

**A:** Both super() and this() must be the FIRST statement in a constructor — so they CANNOT both appear in the same constructor. This is a compile error. this() delegates to another constructor in the same class. super() calls the parent class constructor. Rule: the first line of any constructor is always an implicit super() call to the no-arg parent constructor — unless you explicitly write super(...) or this(...). If the parent has no no-arg constructor, you MUST explicitly call super(args).

```java
class Animal {
    String name;
    Animal(String name) { this.name = name; }
    // NO default constructor — Animal() doesn't exist!
}

class Dog extends Animal {
    String breed;

    Dog(String name, String breed) {
        super(name);          // MUST be first line — parent has no no-arg constructor
        this.breed = breed;
    }

    Dog(String name) {
        this(name, "Mixed"); // delegates to Dog(String, String) — must be first line
        // super() is implicitly called in Dog(String, String)
    }

    // COMPILE ERROR: both super() and this() in same constructor
    // Dog() {
    //     super("Unknown");
    //     this("Unknown"); // ERROR — two first-statement calls
    // }
}
```

### Q: What happens if you invoke a static method on a null reference?

**A:** It works fine — no NullPointerException! Static methods belong to the class, not the instance. The JVM resolves the call using the declared type of the reference, ignoring the fact that the reference is null. This is a common interview trick. However, this is considered bad practice — always call static methods on the class name, not a variable, for clarity.

```java
class Utility {
    public static String greet() { return "Hello!"; }
    public String instanceHello() { return "Instance Hello"; }
}

Utility util = null;
System.out.println(util.greet());         // "Hello!" — NO NullPointerException!
// JVM sees: Utility.greet() because type is Utility

System.out.println(util.instanceHello()); // NullPointerException — needs instance

// Why? Static calls are resolved at COMPILE TIME using the reference type.
// The null value is never dereferenced for static dispatch.

// Best practice: always call via class name
System.out.println(Utility.greet()); // clear and unambiguous
```

### Q: What is the Object class? What are its key methods?

**A:** java.lang.Object is the root of the Java class hierarchy — every class implicitly extends it. Key methods: equals(Object) — default: reference equality (==). hashCode() — default: typically derived from memory address (identity hash). toString() — default: ClassName@hexHashCode. clone() — shallow copy (protected, requires Cloneable). getClass() — returns the runtime Class object. wait()/notify()/notifyAll() — thread synchronization (class must hold the monitor). finalize() — deprecated GC hook. All these are available on every Java object.

```java
Object obj = new Object();

// getClass() — runtime class info
System.out.println(obj.getClass().getName()); // java.lang.Object
System.out.println("hello".getClass().getSimpleName()); // String

// toString() — default
Object o = new Object();
System.out.println(o); // something like "java.lang.Object@7852e922"

// equals() and hashCode() — default: identity
Object a = new Object(), b = new Object();
System.out.println(a.equals(b)); // false (different references)

// wait/notify must be called in synchronized block:
synchronized (obj) {
    obj.wait(1000);  // releases lock, waits up to 1 second
    obj.notify();    // wakes one waiting thread
    obj.notifyAll(); // wakes all waiting threads
}

// Default hashCode (System.identityHashCode):
System.out.println(System.identityHashCode(a)); // memory-based int
```

### Q: Why are Strings immutable in Java? What are the advantages?

**A:** String is immutable because its value (char[]/byte[] in modern Java) is final and the class is final. Reasons for immutability: 1) String Pool: allows sharing of string literals — if strings were mutable, one reference changing the value would corrupt all references to it. 2) Thread safety: immutable objects can be shared across threads without synchronization. 3) Hash caching: String caches its hashCode — safe because the value never changes. 4) Security: class names loaded by ClassLoader, network connection parameters — must not be modifiable. 5) Key safety in HashMap: String keys cannot change after being inserted.

```java
// Immutability demonstrated:
String s = "hello";
s.toUpperCase(); // creates a NEW String — s still "hello"
System.out.println(s); // "hello"

// String Pool sharing:
String a = "hello";
String b = "hello"; // same pool reference
System.out.println(a == b); // true

// If String were mutable: b.change("world") would change a too! Disaster.

// String hashCode is cached (first call computes, subsequent calls return cached):
String key = "userId";
int h1 = key.hashCode(); // computed and cached
int h2 = key.hashCode(); // returned from cache — same value always

// StringBuilder is mutable (use when building strings in loops):
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) sb.append(i); // efficient — no new objects
String result = sb.toString();
```

### Q: What is the transient keyword? What is the purpose of volatile in multithreading?

**A:** transient: marks a field to be excluded from serialization. When an object is serialized (written to stream), transient fields are skipped and set to their default value on deserialization (null for objects, 0 for numbers, false for boolean). Use for: passwords, cached computed values, non-serializable objects (like InputStream), database connections. volatile: guarantees that reads/writes of the variable go directly to main memory, not a CPU cache. Ensures visibility across threads. Does NOT guarantee atomicity for compound operations (i++ is still not atomic).

```java
// transient: excluded from serialization
class User implements Serializable {
    String username;         // serialized
    transient String password; // NOT serialized — security
    transient int cachedHash;  // NOT serialized — will be recomputed
    transient Connection db;   // NOT serialized — Connection is not Serializable
}
// After deserialization: password=null, cachedHash=0, db=null

// volatile: visibility guarantee
class ProgressTracker {
    private volatile boolean done = false; // visible across threads immediately

    public void finish() { done = true; }   // Thread A writes

    public void waitForDone() {
        while (!done) { /* spin */ }         // Thread B always sees latest value
        System.out.println("Done!");
    }
}
// Without volatile: Thread B might read a stale cached value of 'done'

// volatile does NOT fix compound operations:
private volatile int count = 0;
count++; // NOT atomic: read + increment + write are 3 separate operations
// Use AtomicInteger for atomic increment
```

### Q: What are NIO and BufferedReader? How does NIO differ from standard IO?

**A:** Standard IO (java.io): stream-based, blocking — thread blocks waiting for data. BufferedReader wraps FileReader/InputStreamReader to buffer reads (reduces system calls, much faster for line-by-line reading). NIO (java.nio, Java 4+): channel-based, non-blocking. Key concepts: Channel (bidirectional data source/sink), Buffer (data container), Selector (monitor multiple channels with one thread). Use NIO for high-concurrency servers where blocking I/O would require one thread per connection. NIO.2 (Java 7): Files, Path, Paths — better file API.

```java
// Standard IO with BufferedReader (buffered = efficient line reads)
try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    String line;
    while ((line = br.readLine()) != null) { // reads a full line at once
        System.out.println(line);
    }
}
// FileReader reads char-by-char; BufferedReader buffers 8KB chunks → fewer syscalls

// NIO: read entire file into buffer
Path path = Paths.get("data.txt");
byte[] bytes = Files.readAllBytes(path); // NIO.2 — simple file read
List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);

// NIO non-blocking channel (server accepting many connections on 1 thread):
Selector selector = Selector.open();
ServerSocketChannel server = ServerSocketChannel.open();
server.configureBlocking(false);           // non-blocking!
server.register(selector, SelectionKey.OP_ACCEPT);

while (true) {
    selector.select(); // waits for SOME channel to be ready
    for (SelectionKey key : selector.selectedKeys()) {
        if (key.isAcceptable()) { /* accept new connection */ }
        if (key.isReadable())   { /* read data */ }
    }
}
```

### Q: Can we define an interface inside a class? A class inside an interface? Can an interface have constructors?

**A:** Interface inside a class: YES — it becomes a member interface (static by default). Can be public, protected, private, or package-private. Class inside an interface: YES — it becomes a static nested class. Implicitly public and static. Interface constructors: NO — interfaces cannot have constructors because they cannot be instantiated. They can have static methods, default methods, and constants (implicitly public static final). This is because interfaces define a contract, not an implementation.

```java
// Interface inside a class
class OrderService {
    // Member interface — used to define callback contract
    public interface OrderCallback {
        void onSuccess(Order order);
        void onFailure(Exception e);
    }

    public void placeOrder(Order order, OrderCallback callback) {
        try {
            save(order);
            callback.onSuccess(order);
        } catch (Exception e) {
            callback.onFailure(e);
        }
    }
}

// Class inside an interface
interface Validator<T> {
    boolean validate(T value);

    // Static nested class inside interface — utility factory
    class Rules {
        public static <T> Validator<T> notNull() {
            return value -> value != null;
        }
    }
}
Validator<String> v = Validator.Rules.notNull();

// Interface CANNOT have constructors:
// interface Foo { Foo() {} } // COMPILE ERROR
```

### Q: Difference between Abstraction and Encapsulation?

**A:** Abstraction: hiding WHAT (complexity of implementation) — exposing only the essential features. Achieved via abstract classes and interfaces. 

### Q: What is the purpose of the static keyword? When NOT to use it?

**A:** static: belongs to the CLASS, not to any instance. Static fields: shared across all instances. Static methods: can be called without instantiation. Static blocks: run once when class is loaded. Static nested classes: no reference to outer instance. When NOT to use static: when state must be per-instance (e.g. user sessions), when you need polymorphism (static methods are not overridden), when the class needs to be testable (static dependencies are hard to mock), when it holds mutable state (thread-safety issues — shared state is dangerous). Static fields that are mutable are effectively global state — a design smell.

```java
// GOOD uses of static:
class MathUtils {
    public static final double PI = 3.14159; // constant — immutable, safe
    public static int add(int a, int b) { return a + b; } // utility, stateless
}

class Counter {
    private static int instanceCount = 0; // track how many instances created
    Counter() { instanceCount++; }
    public static int getCount() { return instanceCount; }
}

// BAD: mutable static state (global mutable state — thread-safety nightmare)
class Config {
    public static String dbUrl = "jdbc:..."; // DANGEROUS — any code can change this
}

// BAD: static breaks testability
class OrderService {
    public void process() {
        Logger.log("processing"); // Logger is static → can't inject mock in tests
    }
}

// GOOD: inject dependency instead
class OrderService {
    private final Logger logger; // injectable, mockable
    OrderService(Logger logger) { this.logger = logger; }
}
```

### Q: Can you have a try block without a catch block? Can a finally block be skipped?

**A:** try without catch: YES, if followed by finally — try-finally is valid. The finally block always runs (cleanup code). try without both catch AND finally: compile error. Finally block CAN be skipped in two scenarios: 1) System.exit() is called inside the try/catch block — JVM shuts down immediately. 2) The JVM process is killed externally. 3) Infinite loop or deadlock in the try block (finally never reached but not 

### Q: How to avoid NullPointerException? Can an Error be caught in Java?

**A:** Avoid NPE: 1) Use Optional<T> instead of returning null. 2) Objects.requireNonNull() at method entry. 3) Use @NotNull/@NonNull annotations with IDE/static analysis. 4) Prefer empty collections over null. 5) Java 14+ helpful NPE messages tell exactly which variable was null. 6) Initialize fields to defaults. Can Error be caught: YES — Error extends Throwable, so you can catch it. But you SHOULD NOT catch most errors (OutOfMemoryError, StackOverflowError, etc.) because they indicate unrecoverable JVM conditions. Exception to the rule: catch ThreadDeath or OutOfMemoryError only in very specific frameworks that need to log the error and fail gracefully.

```java
// Avoiding NPE:
// 1. Optional instead of null
Optional<User> findUser(Long id) {
    return Optional.ofNullable(userRepository.findById(id));
}
findUser(1L).map(User::getName).orElse("Unknown");

// 2. requireNonNull at entry
void process(Order order) {
    Objects.requireNonNull(order, "order must not be null");
    Objects.requireNonNull(order.getId(), "order.id must not be null");
}

// 3. Empty collection instead of null
List<Order> getOrders() {
    return orders != null ? orders : Collections.emptyList(); // never return null
}

// Catching Error (generally avoid):
try {
    recursiveMethod();
} catch (StackOverflowError e) {
    // Log and respond with 500 — don't try to recover
    log.error("Stack overflow detected", e);
    return errorResponse();
}
// catch (OutOfMemoryError e) — almost never appropriate
```

### Q: What is the difference between NoClassDefFoundError and ClassNotFoundException?

**A:** ClassNotFoundException (checked): thrown when Class.forName(), ClassLoader.loadClass(), or loadClass() is called with a class name that does not exist in the classpath. Happens at runtime when you explicitly try to load a class dynamically. NoClassDefFoundError (error): class was present at compile time but missing at runtime. Happens when the JVM resolves a class reference that was compiled fine but the .class file is gone. Common cause: JAR in compile classpath but not runtime classpath, or a static initializer of a class threw an exception.

```java
// ClassNotFoundException: explicit dynamic loading fails
try {
    Class<?> clazz = Class.forName("com.mysql.jdbc.Driver"); // class not in classpath
} catch (ClassNotFoundException e) {
    System.err.println("JDBC driver JAR missing from classpath: " + e.getMessage());
}

// NoClassDefFoundError: class was compiled against but missing at runtime
// Compiled with: MyService uses OrderRepository
// Runtime: order-repo.jar is missing from classpath
// Result: NoClassDefFoundError when MyService is first used

// Also triggered by failed static initializer:
class BadClass {
    static {
        if (true) throw new RuntimeException("Static init failed!");
    }
}
// First time: ExceptionInInitializerError
// Subsequent uses: NoClassDefFoundError (JVM remembers it failed)

// Troubleshoot:
// 1. Check classpath: java -verbose:class MyApp | grep "ClassName"
// 2. Check if JAR contains the class: jar tf mylib.jar | grep ClassName
// 3. Dependency conflicts: mvn dependency:tree
```

### Q: How do you create a custom exception? When to use checked vs unchecked?

**A:** Checked exception (extends Exception): callers MUST handle or declare. Use when the caller can reasonably recover (file not found — try another path, network timeout — retry). Unchecked (extends RuntimeException): no forced handling. Use for programming errors the caller cannot recover from (invalid argument, illegal state). Best practice for custom exceptions: include a message and cause (wrapping), provide a specific name that describes the problem, keep them in a package.

```java
// Checked exception: caller must handle or declare throws
public class InsufficientFundsException extends Exception {
    private final double shortage;

    public InsufficientFundsException(double shortage) {
        super("Insufficient funds: short by " + shortage);
        this.shortage = shortage;
    }

    public double getShortage() { return shortage; }
}

// Unchecked exception: programming error
public class InvalidOrderStateException extends RuntimeException {
    public InvalidOrderStateException(String currentState, String requiredState) {
        super("Cannot process order in state '" + currentState
              + "', requires '" + requiredState + "'");
    }
}

// Usage:
public void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) throw new InsufficientFundsException(amount - balance);
    balance -= amount;
}

// Wrapping: preserve original cause
try {
    jdbcOperation();
} catch (SQLException e) {
    throw new DataAccessException("Failed to save order", e); // wrapped
}
```

### Q: What is the difference between List<?>, List<Object>, and List<? extends Object>?

**A:** List<Object>: a list that HOLDS Object instances. Not substitutable for List<String> (generics are invariant). You can add any Object. List<?>: unbounded wildcard — 

### Q: Why can\'t you create an array of generic types? Can you overload methods with List<Integer> and List<Double>?

**A:** No generic arrays due to type erasure: at runtime, List<String>[] and List<Integer>[] both become List[]. The JVM cannot enforce element type safety. Creating generic array would allow storing wrong types without ArrayStoreException — defeats type safety purpose. Overloading with List<Integer> and List<Double>: NO. After type erasure, both become List — identical signatures at bytecode level. The compiler rejects this as a duplicate method.

```java
// Cannot create generic array:
// List<String>[] arr = new List<String>[10]; // COMPILE ERROR
// Why: at runtime it's List[], and you could do:
// arr[0] = new ArrayList<Integer>(); // would succeed — type safety hole!

// Workaround: use List of Lists, or cast with @SuppressWarnings
@SuppressWarnings("unchecked")
List<String>[] arr = (List<String>[]) new List[10]; // allowed with cast + warning

// Overloading after type erasure — compile error:
class Processor {
    // void process(List<Integer> list) { ... }  // After erasure: process(List)
    // void process(List<Double> list) { ... }   // DUPLICATE! Compile error.
}

// Workaround: use different method names or bounded wildcards
void processIntegers(List<Integer> list) { ... }
void processDoubles(List<Double> list) { ... }

// Or use a generic method:
<T extends Number> void process(List<T> list) {
    list.forEach(n -> System.out.println(n.doubleValue()));
}
```

### Q: What are the types of Garbage Collectors in Java? Which is default in which version?

**A:** Serial GC: single-threaded, stop-the-world. Good for small heaps, single-core. Parallel GC (Throughput GC): multi-threaded, stop-the-world for major GC. Default in Java 8. Best for batch processing. CMS (Concurrent Mark Sweep): mostly concurrent, low pause times. Deprecated in Java 9, removed in Java 14. G1 GC (Garbage First): default from Java 9+. Divides heap into equal-sized regions, collects regions with most garbage first. Balances throughput and latency. ZGC (Java 15+ production): sub-millisecond pauses, scales to multi-TB heaps. Shenandoah: concurrent compaction, low pauses. Virtual threads (Java 21+) favour G1/ZGC.

```java
// Check current GC:
// java -XX:+PrintCommandLineFlags -version | grep GC

// Force a specific GC:
// -XX:+UseSerialGC          Java 8 small apps
// -XX:+UseParallelGC        Java 8 default — high throughput batch
// -XX:+UseG1GC              Java 9+ default — balanced
// -XX:+UseZGC               Java 15+ — low latency, large heaps
// -XX:+UseShenandoahGC      RedHat alternative to ZGC

// G1 GC key concepts:
// Heap split into ~2048 equal regions (eden, survivor, old, humongous)
// Collects regions with most garbage first (hence "Garbage First")
// Pause target: -XX:MaxGCPauseMillis=200 (default 200ms target)

// ZGC:
// Concurrent marking, relocation, and compaction
// Pause time < 1ms regardless of heap size (tested with 16TB heaps)
// -XX:+UseZGC -XX:SoftMaxHeapSize=28g

// Monitor GC:
// jstat -gcutil <pid> 1000   prints GC stats every 1 second
// -XX:+PrintGCDetails -Xlog:gc*:file=gc.log
```

### Q: What are Memory Leaks in Java? How do you prevent and detect them?

**A:** Memory leak: objects are no longer needed but still referenced (GC cannot collect them). Common causes: 1) Static collections holding objects forever. 2) ThreadLocal not cleaned up in thread pool. 3) Listeners/callbacks registered but never deregistered. 4) Unclosed streams, connections. 5) Inner class holding implicit reference to outer class. 6) Cache growing without eviction. Detection: heap dump analysis (jmap + Eclipse MAT), profilers (JVisualVM, YourKit), actuator /heapdump endpoint.

```java
// LEAK 1: static collection grows forever
class EventBus {
    private static List<EventListener> listeners = new ArrayList<>();
    public static void register(EventListener l) { listeners.add(l); }
    // Missing: unregister() — listeners never removed → LEAK
}

// LEAK 2: ThreadLocal in thread pool (not cleaned up)
ThreadLocal<byte[]> buffer = new ThreadLocal<>();
// Thread processes request, sets buffer, task ends
// Thread returns to pool — buffer still holds reference!
// FIX:
try {
    buffer.set(new byte[1024]);
    doWork();
} finally {
    buffer.remove(); // ALWAYS remove in finally
}

// LEAK 3: inner class holds outer reference
class Activity {
    class LeakyTask extends AsyncTask { // holds Activity reference
        @Override protected Void doInBackground() { return null; }
    }
    // If Activity is "done" but LeakyTask still running → Activity leaked
    // FIX: use static nested class + WeakReference<Activity>
}

// Detection:
// jmap -histo:live <pid> | head -20   // top objects by count
// jmap -dump:format=b,file=heap.hprof <pid>
// Open heap.hprof in Eclipse MAT → look for "Retained Heap" outliers
```

### Q: Are streams slower than a for loop? What is the advantage of the Stream API?

**A:** For simple sequential operations, a for loop is slightly faster (no stream pipeline overhead, no object creation). For complex operations, streams are comparable and sometimes faster (parallel streams). However, performance is rarely the reason to choose streams. Advantages: 1) Readability — declarative, expresses intent clearly. 2) Composability — chain operations elegantly. 3) Parallelism — add .parallel() without rewriting logic. 4) Lazy evaluation — intermediate operations only run when terminal op is called. 5) No boilerplate — no index variables, less bug surface.

```java
// For loop (slightly faster for simple ops):
int sum = 0;
for (int n : numbers) {
    if (n > 10) sum += n;
}

// Stream (more readable, same result):
int sumStream = numbers.stream()
    .filter(n -> n > 10)
    .mapToInt(Integer::intValue)
    .sum();

// Stream ADVANTAGE: laziness — stops early
Optional<String> first = hugeList.stream()
    .filter(s -> s.startsWith("A"))
    .findFirst(); // stops at first match — for-loop would scan everything

// Parallel stream (no rewriting needed):
int parallelSum = numbers.parallelStream()
    .filter(n -> n > 10)
    .mapToInt(Integer::intValue)
    .sum(); // uses ForkJoinPool internally

// When streams are SLOWER: creating many small streams in tight loops
// JMH benchmark tip: measure with warmup; JIT often equalizes performance
```

### Q: UnaryOperator<T> vs Function<T,R>? BinaryOperator<T> vs BiFunction<T,U,R>?

**A:** Function<T,R>: takes type T, returns type R (different types). UnaryOperator<T> extends Function<T,T>: input and output are the SAME type. Specialization for single-argument transformations on the same type. BiFunction<T,U,R>: takes two inputs of potentially different types, returns R. BinaryOperator<T> extends BiFunction<T,T,T>: all three types are the same. Common in reduce operations.

```java
// Function<T,R>: T in, R out (can be different types)
Function<String, Integer> lengthOf = String::length; // String → Integer
Function<Integer, String> toStr = Object::toString;  // Integer → String

// UnaryOperator<T>: T in, same T out — used for transformations
UnaryOperator<String> trim = String::trim;
UnaryOperator<Integer> square = n -> n * n;

// UnaryOperator in List.replaceAll:
List<String> names = new ArrayList<>(List.of(" alice ", " bob "));
names.replaceAll(String::trim); // UnaryOperator<String>

// BiFunction<T,U,R>: two inputs, one output (all can differ)
BiFunction<String, Integer, String> repeat = (s, n) -> s.repeat(n);

// BinaryOperator<T>: two of same type in, same type out
BinaryOperator<Integer> sum  = Integer::sum;   // (a,b) -> a + b
BinaryOperator<String>  concat = String::concat;

// BinaryOperator in Stream.reduce:
int total = List.of(1,2,3,4).stream()
    .reduce(0, Integer::sum); // BinaryOperator<Integer>
Optional<String> longest = List.of("a","bb","ccc").stream()
    .reduce((a, b) -> a.length() >= b.length() ? a : b);
```

### Q: Lambda expression vs anonymous inner class: can lambdas access non-final local variables?

**A:** Key differences: 1) Lambda: no new class generated — compiled as invokedynamic. this refers to enclosing class. Cannot have state/fields. Must implement a functional interface. 2) Anonymous class: new class file generated ($1, $2 etc.). this refers to anonymous class itself. Can have state. Can implement any interface or extend class. Variable capture: BOTH can only access effectively final local variables (explicitly final or never reassigned after declaration). Non-effectively-final: compile error. Reason: lambda/closure runs potentially on a different thread — local variable from stack might no longer exist.

```java
// Lambda: this = enclosing class
class Outer {
    void test() {
        Runnable r = () -> System.out.println(this.getClass().getName()); // Outer
    }
}

// Anonymous class: this = anonymous class instance
class Outer2 {
    void test() {
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println(this.getClass().getName()); // anonymous class
            }
        };
    }
}

// Effectively final capture:
int x = 10; // effectively final — never reassigned
Runnable r = () -> System.out.println(x); // OK

int y = 10;
y = 20; // NOT effectively final
// Runnable r2 = () -> System.out.println(y); // COMPILE ERROR

// Workaround for mutable capture:
int[] counter = {0}; // array reference is final, element can change
Runnable inc = () -> counter[0]++;
// Or use AtomicInteger for thread-safe mutable capture
```

### Q: What are short-circuiting operations in streams? Name all intermediate and terminal operations.

**A:** Short-circuiting: operations that stop processing the stream early without consuming all elements. Terminal short-circuit ops: findFirst(), findAny() (stop at first match), anyMatch(), allMatch(), noneMatch(). Intermediate short-circuit: limit(n) (stops after n elements). All intermediate operations: filter, map, flatMap, mapToInt/Long/Double, distinct, sorted, limit, skip, peek, takeWhile (Java 9), dropWhile (Java 9). All terminal operations: collect, forEach, forEachOrdered, reduce, count, sum/min/max (primitive streams), findFirst, findAny, anyMatch, allMatch, noneMatch, toArray, iterator.

```java
// Short-circuiting: stops early
boolean hasAdmin = users.stream()
    .anyMatch(u -> u.getRole().equals("ADMIN")); // stops at first ADMIN found

Optional<User> firstAdult = users.stream()
    .filter(u -> u.getAge() >= 18)
    .findFirst(); // stops at first match — infinite stream safe

// limit() enables working with infinite streams:
Stream.iterate(1, n -> n + 1)  // infinite: 1, 2, 3, ...
    .filter(n -> n % 2 == 0)
    .limit(5)                   // short-circuits at 5 results
    .forEach(System.out::println); // 2, 4, 6, 8, 10

// Java 9: takeWhile / dropWhile
List.of(1,2,3,4,5,6).stream()
    .takeWhile(n -> n < 4)      // takes while condition true: [1, 2, 3]
    .forEach(System.out::println);

List.of(1,2,3,4,5,6).stream()
    .dropWhile(n -> n < 4)      // drops while condition true: [4, 5, 6]
    .forEach(System.out::println);
```

### Q: Can we start a thread twice? What happens if we call run() instead of start()?

**A:** Start twice: NO — calling start() on an already-started thread throws IllegalThreadStateException. A Thread can only be started once; once it terminates, it cannot be restarted. Calling run() instead of start(): the run() method is executed on the CURRENT thread, not a new one. No new thread is created. This is a very common bug — to create a new thread, you must call start().

```java
// Cannot start twice:
Thread t = new Thread(() -> System.out.println("Running on: " + Thread.currentThread().getName()));
t.start(); // creates new thread, runs run()
// t.start(); // throws IllegalThreadStateException — thread already started!

// run() vs start():
Thread t2 = new Thread(() -> System.out.println("Thread: " + Thread.currentThread().getName()));
t2.run();   // executes on main thread — "Thread: main"
t2.start(); // creates new thread — "Thread: Thread-0"

// Thread states: NEW → RUNNABLE → [BLOCKED/WAITING/TIMED_WAITING] → TERMINATED
// After TERMINATED, start() throws IllegalThreadStateException

// To reuse: use Runnable with a new Thread each time:
Runnable task = () -> System.out.println("Task");
new Thread(task).start(); // create new Thread, same Runnable — fine
new Thread(task).start(); // another new Thread — fine
```

### Q: Why are wait(), notify(), notifyAll() defined in Object class, not Thread?

**A:** Because they are tied to the OBJECT\

### Q: What are the different ways to achieve synchronization in Java?

**A:** 1) synchronized method — locks the object (or class for static). 2) synchronized block — lock on specific object, finer granularity. 3) ReentrantLock — explicit lock with tryLock, fairness, interruptible. 4) ReadWriteLock — multiple readers OR one writer. 5) StampedLock — optimistic reads (Java 8). 6) volatile — visibility only, no mutual exclusion. 7) Atomic classes (AtomicInteger, AtomicReference) — lock-free via CAS. 8) java.util.concurrent collections (ConcurrentHashMap, BlockingQueue). 9) Semaphore — limits concurrent access count. 10) CountDownLatch, CyclicBarrier — coordination primitives.

```java
// 1. synchronized method
public synchronized void increment() { count++; }

// 2. synchronized block (finer — only lock what needs protection)
public void update(String key, String value) {
    synchronized (this.cache) { cache.put(key, value); }
    // other non-critical work not locked
}

// 3. ReentrantLock (more flexible)
private final ReentrantLock lock = new ReentrantLock(true); // fair
public void doWork() {
    lock.lock();
    try { /* critical section */ }
    finally { lock.unlock(); }
}
// tryLock with timeout:
if (lock.tryLock(500, TimeUnit.MILLISECONDS)) { ... }

// 4. ReadWriteLock (max concurrency for read-heavy)
private final ReadWriteLock rwLock = new ReentrantReadWriteLock();
public String read(String key) {
    rwLock.readLock().lock(); // multiple threads can read simultaneously
    try { return cache.get(key); } finally { rwLock.readLock().unlock(); }
}
public void write(String key, String value) {
    rwLock.writeLock().lock(); // exclusive
    try { cache.put(key, value); } finally { rwLock.writeLock().unlock(); }
}

// 7. AtomicInteger — lock-free
AtomicInteger counter = new AtomicInteger(0);
counter.incrementAndGet(); // CAS — atomic without lock
```

### Q: synchronized vs ReentrantLock: key differences?

**A:** synchronized: built-in language keyword, automatically releases lock on exit/exception, non-interruptible wait, cannot try to acquire, not fair by default, single condition. ReentrantLock: explicit lock/unlock (must be in finally!), tryLock(timeout) — avoid deadlocks, lockInterruptibly() — can be interrupted while waiting, fair mode (FIFO ordering), multiple Condition objects (like multiple wait queues). Use synchronized for simple cases. Use ReentrantLock when you need timeout, fairness, multiple conditions, or interruptible waiting.

```java
// synchronized: simple, automatic release
public synchronized void simpleMethod() {
    // lock acquired on entry, released on exit OR exception
}

// ReentrantLock: explicit, more control
private final ReentrantLock lock = new ReentrantLock();
public void advancedMethod() {
    lock.lock();
    try {
        // critical section
    } finally {
        lock.unlock(); // MUST be in finally — easy to forget!
    }
}

// tryLock: avoid deadlock
boolean acquired = lock.tryLock(1, TimeUnit.SECONDS);
if (acquired) {
    try { doWork(); } finally { lock.unlock(); }
} else {
    handleTimeout(); // instead of blocking forever
}

// Multiple conditions (one ReentrantLock, two wait queues):
ReentrantLock lock2 = new ReentrantLock();
Condition notEmpty = lock2.newCondition();
Condition notFull  = lock2.newCondition();
// Producer waits on notFull; consumer waits on notEmpty
// Much cleaner than a single wait/notify
```

### Q: Concurrency vs Parallelism? submit() vs execute() in ExecutorService?

**A:** Concurrency: multiple tasks are IN PROGRESS at the same time (interleaved on one or more CPUs via context switching). About managing multiple tasks. Parallelism: multiple tasks execute SIMULTANEOUSLY on multiple CPU cores. About using multiple processors. Java concurrency (threads) can be parallel on multi-core or concurrent (time-sliced) on single-core. submit() vs execute(): execute(Runnable) — fire and forget, no return value, unchecked exceptions swallowed. submit(Callable/Runnable) — returns Future, exceptions accessible via future.get(), can cancel the task. Always prefer submit() for tasks that may throw exceptions.

```java
// Concurrency vs Parallelism:
// Concurrency: chef chops, then stirs, then checks oven (interleaved on 1 chef)
// Parallelism: 3 chefs each do a different task simultaneously

// execute(): no return, exceptions lost
executor.execute(() -> {
    throw new RuntimeException("ERROR"); // silently swallowed!
});

// submit(): returns Future, exception accessible
Future<String> future = executor.submit(() -> {
    if (failed) throw new Exception("Task failed");
    return "result";
});
try {
    String result = future.get(5, TimeUnit.SECONDS); // blocks until done
} catch (ExecutionException e) {
    Throwable cause = e.getCause(); // the original exception
} catch (TimeoutException e) {
    future.cancel(true); // cancel if too slow
}

// submit(Runnable) returns Future<?> — get() returns null on success
Future<?> voidFuture = executor.submit(() -> System.out.println("done"));
voidFuture.get(); // blocks until done, returns null
```

### Q: What is ApplicationContext vs BeanFactory? What does @SpringBootApplication do internally?

**A:** BeanFactory: basic container, lazy initialization by default. ApplicationContext: extends BeanFactory, adds: event publishing, internationalization, AOP, environment abstraction, eager initialization of singletons. Always use ApplicationContext. @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan. @Configuration marks it as a config class. @EnableAutoConfiguration triggers auto-configuration (reads META-INF/spring.factories). @ComponentScan scans the current package and sub-packages for @Component, @Service, @Repository, @Controller beans.

```java
// @SpringBootApplication is a composite annotation:
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootConfiguration  // = @Configuration
@EnableAutoConfiguration  // triggers auto-configuration
@ComponentScan            // scans current package
public @interface SpringBootApplication { ... }

// So this:
@SpringBootApplication
public class App { public static void main(String[] args) { SpringApplication.run(App.class, args); } }

// Is equivalent to:
@Configuration
@EnableAutoConfiguration
@ComponentScan(basePackages = "com.myapp") // scans from this package down
public class App { ... }

// ApplicationContext provides:
ApplicationContext ctx = SpringApplication.run(App.class, args);
UserService svc = ctx.getBean(UserService.class); // retrieve any bean
String profile = ctx.getEnvironment().getActiveProfiles()[0];
ctx.publishEvent(new OrderCreatedEvent(order)); // event system
```

### Q: What is the difference between @Component, @Service, @Repository, and @Controller?

**A:** All are specializations of @Component — they are all component-scan targets. Semantic differences: @Component: generic Spring bean. @Service: business logic layer (no technical difference from @Component). @Repository: data access layer — additionally enables automatic exception translation (DataAccessException wrapping). @Controller: Spring MVC controller, processes HTTP requests. @RestController = @Controller + @ResponseBody. IDE/framework tooling uses these annotations for documentation, static analysis, and AOP pointcut targeting.

```java
// All found by component scan — only semantic/tooling difference:
@Component   class UtilityBean { }        // generic
@Service     class OrderService { }       // business logic
@Repository  class UserRepository { }    // DAO — + exception translation
@Controller  class WebController { }     // HTTP handler
@RestController class ApiController { } // HTTP + JSON response

// @Repository exception translation:
// Without @Repository: JPA throws PersistenceException
// With @Repository: Spring wraps it in DataAccessException hierarchy
// Allows catching DataIntegrityViolationException instead of vendor-specific

// AOP pointcuts targeting specific layers:
@Aspect @Component
public class LoggingAspect {
    @Before("within(@org.springframework.stereotype.Service *)")
    public void logServiceCall(JoinPoint jp) {
        log.info("Service: {}", jp.getSignature().getName());
    }
}
```

### Q: How does Spring handle circular dependencies? @Autowired vs @Inject?

**A:** Circular dependency: A depends on B, B depends on A. Spring resolves field/setter injection circular deps by creating a partially-initialized bean proxy. Constructor injection circular deps CANNOT be resolved — Spring throws BeanCurrentlyInCreationException. Best fix: refactor (introduce a third class, use events, use lazy initialization @Lazy). @Autowired: Spring-specific, allows @Autowired(required=false). @Inject: JSR-330 standard (javax.inject), portable across DI frameworks. No required attribute. Functionally identical otherwise — @Inject is preferred for portability, @Autowired is more commonly seen in Spring code.

```java
// Circular dependency: constructor injection fails
@Service class A {
    A(B b) { }
}
@Service class B {
    B(A a) { }
}
// BeanCurrentlyInCreationException!

// Fix 1: use @Lazy on one injection
@Service class A {
    A(@Lazy B b) { } // B is created lazily — breaks the cycle
}

// Fix 2: setter injection (Spring resolves field/setter cycles)
@Service class A {
    @Autowired private B b; // field injection
}
@Service class B {
    @Autowired private A a;
}

// Fix 3: refactor — extract shared logic into a third class C
// A uses C, B uses C — no cycle

// @Autowired vs @Inject:
@Autowired private UserService userService;         // Spring only
@Inject    private UserService userService;         // JSR-330, portable
@Autowired(required = false) private Cache cache;   // optional injection
// @Inject has no required=false equivalent — use Optional<Cache> instead
```

### Q: Setter injection vs constructor injection: when to use each?

**A:** Constructor injection (preferred): dependencies are mandatory and immutable (final). Class is easier to test (pass mock in constructor). Clear dependencies visible at class definition. Cannot create a half-initialized object. Spring itself recommends constructor injection. Setter injection: use for optional dependencies, or when you have many dependencies making constructor large (though this signals a design smell — too many dependencies). Also needed when there are circular dependencies that cannot be resolved otherwise.

```java
// PREFERRED: Constructor injection — final fields, immutable, testable
@Service
public class OrderService {
    private final PaymentGateway payment;  // final = immutable
    private final InventoryService inventory;
    private final NotificationService notifications;

    // Spring auto-detects single constructor — @Autowired optional
    public OrderService(PaymentGateway payment,
                        InventoryService inventory,
                        NotificationService notifications) {
        this.payment = payment;
        this.inventory = inventory;
        this.notifications = notifications;
    }
}
// Test: new OrderService(mockPayment, mockInventory, mockNotifications)

// Setter injection: optional dependency
@Service
public class ReportService {
    private CacheService cache; // optional — app works without cache

    @Autowired(required = false)
    public void setCache(CacheService cache) { this.cache = cache; }
}

// Lombok + constructor injection:
@Service
@RequiredArgsConstructor // generates constructor for all final fields
public class UserService {
    private final UserRepository repo;
    private final EmailService email;
}
```

### Q: What is @Profile vs @ConditionalOnXXX? What is PUT vs PATCH? What is Swagger?

**A:** @Profile: activates a bean only when a specific Spring profile is active (spring.profiles.active=dev). @ConditionalOnProperty: activates based on property value. @ConditionalOnClass: if a class is in classpath. @ConditionalOnMissingBean: if no other bean of that type exists. More precise control than @Profile. PUT vs PATCH: PUT replaces the entire resource (idempotent, send full payload). PATCH partially updates (send only changed fields — not guaranteed idempotent). Swagger (OpenAPI): auto-generates interactive API documentation from Spring controller annotations. springdoc-openapi generates OpenAPI 3.0 spec and UI at /swagger-ui.html.

```java
// @Profile: bean only active in 'dev' profile
@Bean
@Profile("dev")
public DataSource h2DataSource() {
    return new EmbeddedDatabaseBuilder().setType(H2).build();
}
// Activated by: spring.profiles.active=dev

// @ConditionalOnProperty: fine-grained condition
@Bean
@ConditionalOnProperty(name = "feature.cache.enabled", havingValue = "true")
public CacheManager redisCacheManager() { ... }

// PUT vs PATCH:
// PUT: replace entire user
// PUT /users/1 { "name": "Alice", "email": "a@b.com", "role": "ADMIN" }
@PutMapping("/users/{id}")
public User replace(@PathVariable Long id, @RequestBody User user) { ... }

// PATCH: update only name
// PATCH /users/1 { "name": "Alice Updated" }
@PatchMapping("/users/{id}")
public User patch(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
    User user = userRepo.findById(id).orElseThrow();
    if (updates.containsKey("name")) user.setName((String) updates.get("name"));
    return userRepo.save(user);
}

// Swagger (springdoc-openapi):
// dependency: springdoc-openapi-starter-webmvc-ui
// Access: http://localhost:8080/swagger-ui.html
@Operation(summary = "Get user by ID")
@ApiResponse(responseCode = "200", description = "User found")
@GetMapping("/users/{id}")
public UserDTO getUser(@PathVariable Long id) { ... }
```

### Q: Are singleton beans thread-safe? How to handle shared state in Spring beans?

**A:** Singleton beans are NOT automatically thread-safe. Spring creates one instance per ApplicationContext, shared across all threads. If a singleton bean has mutable instance state (fields that change), concurrent requests can corrupt data. Rule: singleton beans should be stateless (all state in local variables or method parameters). If state is needed: use prototype scope, request/session scope, or synchronize access. ThreadLocal is used internally by Spring (RequestContextHolder, TransactionSynchronizationManager) to store per-thread/per-request state safely.

```java
// DANGEROUS: mutable field in singleton bean
@Service
public class OrderProcessor {
    private int processedCount = 0; // SHARED across all threads!

    public void process(Order order) {
        processedCount++; // NOT thread-safe — race condition!
    }
}

// SAFE: stateless — all data in local variables
@Service
public class OrderProcessor {
    public void process(Order order) {
        int localCount = 0; // thread-local variable — safe
        for (OrderItem item : order.getItems()) {
            validateItem(item); // no shared state
            localCount++;
        }
    }
}

// SAFE: use AtomicInteger for shared counters
@Service
public class MetricsService {
    private final AtomicLong requestCount = new AtomicLong(0); // thread-safe
    public void increment() { requestCount.incrementAndGet(); }
    public long getCount() { return requestCount.get(); }
}

// SAFE: request-scoped bean for per-request state
@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class RequestContext {
    private String traceId;
    // ... request-specific state — new instance per HTTP request
}
```

### Q: What is Spring Boot Actuator? How can you integrate it with Grafana?

**A:** Spring Boot Actuator exposes production-ready endpoints for monitoring and management. Key endpoints: /actuator/health (DB, disk, Redis connectivity), /actuator/metrics (Micrometer metrics), /actuator/env (active properties), /actuator/loggers (change log level at runtime), /actuator/threaddump, /actuator/heapdump. Integration with Grafana: Actuator + Micrometer exports metrics to Prometheus (scraping endpoint /actuator/prometheus). Prometheus stores time-series data. Grafana queries Prometheus and displays dashboards. Add micrometer-registry-prometheus dependency.

```java
# application.yml: expose endpoints
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,info,loggers,prometheus
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

# pom.xml: Prometheus registry
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-registry-prometheus</artifactId>
</dependency>

# Prometheus config (prometheus.yml):
# scrape_configs:
#   - job_name: 'spring-boot-app'
#     metrics_path: '/actuator/prometheus'
#     static_configs:
#       - targets: ['localhost:8080']

// Custom metric:
@Service
public class OrderService {
    private final Counter ordersCounter;
    OrderService(MeterRegistry registry) {
        ordersCounter = Counter.builder("orders.placed")
            .description("Total orders placed")
            .register(registry);
    }
    public void placeOrder(Order order) {
        ordersCounter.increment();
        // Visible in Grafana as orders_placed_total
    }
}
```

### Q: What is AOP? What is a pointcut? How do you implement logging with AOP?

**A:** AOP (Aspect-Oriented Programming): separates cross-cutting concerns (logging, security, transactions, caching) from business logic. Key terms: Aspect — the cross-cutting concern class (@Aspect). Advice — the code to run (Before, After, Around, AfterReturning, AfterThrowing). Pointcut — expression that selects which methods to intercept (where advice applies). JoinPoint — the specific point of execution (method call). Spring AOP uses proxy-based approach — only works on Spring-managed beans via public method calls.

```java
@Aspect
@Component
public class LoggingAspect {

    // Pointcut: select all methods in service package
    @Pointcut("execution(* com.app.service.*.*(..))")
    private void serviceMethods() {}

    // @Before: runs before method
    @Before("serviceMethods()")
    public void logEntry(JoinPoint jp) {
        log.info("Calling: {} with args: {}", jp.getSignature().getName(), jp.getArgs());
    }

    // @Around: wraps the method — can measure time
    @Around("serviceMethods()")
    public Object measureTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return pjp.proceed(); // call the actual method
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            log.info("{} took {}ms", pjp.getSignature().getName(), elapsed);
        }
    }

    // @AfterThrowing: runs when exception thrown
    @AfterThrowing(pointcut = "serviceMethods()", throwing = "ex")
    public void logError(JoinPoint jp, Exception ex) {
        log.error("Exception in {}: {}", jp.getSignature().getName(), ex.getMessage());
    }
}

// Pointcut expressions:
// execution(* com.app.service.*.*(..))  — all methods in service package
// @annotation(com.app.Auditable)        — methods with @Auditable annotation
// within(@Service *)                    — all @Service beans
```

### Q: What is HQL? @Entity vs @Table? Session vs SessionFactory? get() vs load()?

**A:** HQL (Hibernate Query Language): object-oriented query language operating on entities/fields, not tables/columns. Database-independent. JPA equivalent: JPQL. @Entity marks the class as JPA-managed. @Table(name=

### Q: What are cascade types and the @EntityListeners annotation in Hibernate?

**A:** Cascade: propagates operations from parent to child. CascadeType.PERSIST — save parent → save children. MERGE — merge parent → merge children. REMOVE — delete parent → delete children (dangerous for shared entities). REFRESH — refresh parent → refresh children. DETACH — detach parent → detach children. ALL = all the above. orphanRemoval=true: remove child from collection → delete from DB. @EntityListeners: registers a class to listen to JPA lifecycle events (@PrePersist, @PostPersist, @PreUpdate, @PostUpdate, @PreRemove, @PostLoad). Used for audit logging (createdAt, updatedAt).

```java
// Cascade: parent controls children lifecycle
@Entity
public class Order {
    @OneToMany(mappedBy = "order",
               cascade = {CascadeType.PERSIST, CascadeType.MERGE},
               orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
}
// orderRepo.save(order); → also saves all items
// order.getItems().remove(item); → deletes item from DB (orphanRemoval)
// CascadeType.REMOVE: careful — deletes children on order delete (usually OK)
// NEVER cascade to shared entities (e.g. User in Order — deletes the User!)

// @EntityListeners: audit fields
@Entity
@EntityListeners(AuditingEntityListener.class)
public class Product {
    @Id Long id;
    @CreatedDate LocalDateTime createdAt;
    @LastModifiedDate LocalDateTime updatedAt;
    @CreatedBy String createdBy;
}
// Requires: @EnableJpaAuditing on @Configuration + AuditorAware<String> bean

// Manual @EntityListeners with custom class:
class AuditListener {
    @PrePersist void onPrePersist(Object entity) { /* set timestamps */ }
    @PreUpdate  void onPreUpdate(Object entity)  { /* update timestamp */ }
}
@EntityListeners(AuditListener.class)
class Invoice { ... }
```

### Q: JMS: P2P vs Pub/Sub models, message reliability, poison messages, durable subscriptions?

**A:** P2P (Point-to-Point): message goes to a QUEUE — only ONE consumer receives each message. Good for task distribution (one worker processes each order). Pub/Sub: message goes to a TOPIC — ALL subscribers receive each message. Good for event broadcasting (all audit services receive every event). Message reliability: persistent delivery (messages survive broker restart), acknowledgment modes (auto-ack vs manual), transaction support. Poison messages: messages that fail processing repeatedly. Handled via Dead Letter Queue (DLQ) — after max retries, message moved to DLQ for inspection. Durable subscription: subscriber receives messages published while it was offline (unlike non-durable which misses them).

```java
// Spring JMS: P2P Queue
@JmsListener(destination = "order.queue")
public void processOrder(Order order) {
    // Only ONE consumer instance receives this message
    orderService.process(order);
}

// Pub/Sub Topic
@JmsListener(destination = "order.events", containerFactory = "topicFactory")
public void handleEvent(OrderEvent event) {
    // ALL subscribers with this topic receive it
    auditService.log(event);
}

// Dead Letter Queue (DLQ) config (application.yml - ActiveMQ):
# spring.activemq.redelivery-policy.maximum-redeliveries=3
# After 3 failures → moved to order.queue.DLQ

// Spring: handle DLQ manually
@JmsListener(destination = "order.queue.DLQ")
public void processDlq(Message message) {
    String text = ((TextMessage) message).getText();
    alertService.notifyOps("Poison message detected: " + text);
}

// Durable subscription (topic):
@Bean
public JmsListenerContainerFactory<?> durableTopicFactory(
        ConnectionFactory cf, DefaultJmsListenerContainerFactoryConfigurer cfg) {
    DefaultJmsListenerContainerFactory factory = new DefaultJmsListenerContainerFactory();
    factory.setPubSubDomain(true);   // topic mode
    factory.setSubscriptionDurable(true); // durable
    factory.setClientId("audit-service"); // unique client ID
    return factory;
}
```

### Q: Abstract Factory vs Factory Method? What design patterns are used in JDK? Decorator pattern?

**A:** Factory Method: defines an interface for creating ONE product, subclasses decide which class. Abstract Factory: creates FAMILIES of related objects without specifying their concrete classes. JDK patterns: Factory Method — Calendar.getInstance(), NumberFormat.getInstance(). Abstract Factory — look & feel UI (creates Button+Checkbox+TextField for a theme). Singleton — Runtime.getRuntime(). Decorator — BufferedReader(FileReader), InputStream wrappers. Adapter — InputStreamReader (byte stream → char stream). Iterator — Collection.iterator(). Observer — EventListener. Strategy — Comparator in Collections.sort(). Template Method — HttpServlet, AbstractList.

```java
// Abstract Factory: create families of objects
interface UIFactory {
    Button createButton();
    Checkbox createCheckbox();
}
class WindowsFactory implements UIFactory {
    public Button createButton() { return new WindowsButton(); }
    public Checkbox createCheckbox() { return new WindowsCheckbox(); }
}
class MacFactory implements UIFactory {
    public Button createButton() { return new MacButton(); }
    public Checkbox createCheckbox() { return new MacCheckbox(); }
}
// Client uses UIFactory — doesn't know which OS it's running on

// Decorator pattern: add behavior to objects dynamically
// JDK: new BufferedReader(new FileReader("file.txt"))
//      new DataInputStream(new BufferedInputStream(new FileInputStream("file.bin")))
// Each wraps the previous, adding behavior (buffering, data types)

// Custom decorator for logging:
interface OrderRepository { Order findById(Long id); }

class LoggingOrderRepository implements OrderRepository {
    private final OrderRepository delegate;
    LoggingOrderRepository(OrderRepository delegate) { this.delegate = delegate; }

    public Order findById(Long id) {
        log.debug("Finding order {}", id);
        Order order = delegate.findById(id);
        log.debug("Found: {}", order != null);
        return order;
    }
}
```

### Q: What is Eventual Consistency? CQRS? Orchestration vs Choreography in Microservices?

**A:** Eventual Consistency: in distributed systems, nodes may return stale data temporarily but will converge to the same state eventually (given no new updates). Preferred in AP systems (available + partition-tolerant). Examples: DNS, NoSQL databases, distributed caches. CQRS (Command Query Responsibility Segregation): separate read and write models. Commands modify state (write DB). Queries read from a separate optimized read model (denormalized, cached). Enables independent scaling. Orchestration vs Choreography: Orchestration — central orchestrator tells each service what to do (Saga orchestrator, easy to debug). Choreography — services react to events and decide own actions (decoupled, harder to trace).

```java
// Eventual Consistency: reads may be stale
// User updates profile → writes to DB → replication to read replicas
// Other users may see old profile for ~100ms (window of inconsistency)
// Eventually all replicas converge → consistent

// CQRS:
// Write model: handles commands
@CommandHandler
public void handle(PlaceOrderCommand cmd) {
    Order order = new Order(cmd.getUserId(), cmd.getItems());
    orderRepository.save(order); // normalized write DB
    eventBus.publish(new OrderPlacedEvent(order));
}

// Read model: optimized query
@EventHandler
public void on(OrderPlacedEvent event) {
    // Denormalized read model (e.g. join with user name, product names)
    orderSummaryRepo.save(new OrderSummary(event)); // fast query DB
}

// Query handler (no business logic):
@QueryHandler
public List<OrderSummary> handle(GetUserOrdersQuery query) {
    return orderSummaryRepo.findByUserId(query.getUserId()); // fast read
}

// Orchestration: Saga Orchestrator tells services what to do
// OrderSaga → PaymentService.charge() → InventoryService.reserve() → ShippingService.schedule()

// Choreography: services react to events
// OrderPlaced event → PaymentService reacts → PaymentSuccess event
//   → InventoryService reacts → Reserved event → ShippingService reacts
```

### Q: What is the Dependency Inversion Principle? Liskov Substitution Principle?

**A:** DIP (D in SOLID): High-level modules should not depend on low-level modules — BOTH should depend on abstractions (interfaces). Abstractions should not depend on details; details should depend on abstractions. This IS Dependency Injection. LSP (L in SOLID): Objects of a subclass must be substitutable for objects of the superclass without breaking behavior. If S extends T, wherever T is used, S must behave correctly. Violations: subclass throws exceptions the parent doesn\

### Q: What are Refresh Tokens? What is a stateless microservice?

**A:** Refresh Tokens: long-lived tokens that obtain new Access Tokens without re-authentication. Access tokens are short-lived (15 min) for security. Refresh tokens live longer (7-30 days). Stored server-side (database/Redis) for revocation capability. Flow: Access token expires → client sends refresh token → server validates, issues new access token + optionally rotates refresh token. Stateless microservice: no server-side session state. Each request is self-contained (contains JWT with user info). Benefits: horizontal scaling (any instance handles any request), no session affinity/sticky sessions needed, easier to recover from failures. State goes to the client (JWT) or external stores (Redis, DB).

```java
// Refresh token flow:
// 1. Login: server issues accessToken (15min) + refreshToken (7d)
// 2. Client stores refreshToken securely (HttpOnly cookie or secure storage)
// 3. API call: send accessToken in Authorization header
// 4. 401 Unauthorized → client sends refreshToken to /auth/refresh
// 5. Server validates refreshToken, issues new accessToken

@PostMapping("/auth/refresh")
public TokenResponse refresh(@RequestBody RefreshRequest req) {
    RefreshToken token = refreshTokenRepo.findByToken(req.getToken())
        .filter(t -> !t.isExpired())
        .orElseThrow(() -> new TokenExpiredException("Refresh token expired"));

    String newAccessToken = jwtService.generateToken(token.getUser());

    // Token rotation: invalidate old, issue new refresh token
    refreshTokenRepo.delete(token);
    String newRefreshToken = refreshTokenService.create(token.getUser());

    return new TokenResponse(newAccessToken, newRefreshToken);
}

// Stateless service — no session stored on server:
// Each JWT contains: userId, roles, expiry — server needs no session lookup
// Scale horizontally: 10 instances behind load balancer — any handles any request
// No session replication needed

// State that SEEMS to require statefulness → externalize:
// Shopping cart → Redis (key: userId, value: cart JSON)
// Rate limiting counters → Redis
// Distributed locks → Redis/Zookeeper
```

### Q: Microservices vs Monolith: when is each preferred? What is the 12-Factor App?

**A:** Monolith: simple deployment, shared memory, easier debugging, lower latency. Choose when: small team, early-stage product, simple domain, low traffic. Microservices: independent deployment, technology diversity, independent scaling, team autonomy. Choose when: large team, complex domain with clear boundaries, different scaling needs per service, high availability requirements. Pitfall: microservices add distributed systems complexity — use only when you outgrow monolith. 12-Factor App: methodology for cloud-native apps — codebase in one repo, dependencies declared, config from env vars, backing services as attached resources, stateless processes, export via port binding, concurrency via process model, disposability, dev/prod parity, logs as streams, admin processes.

```java
// 12-Factor: Config from environment (Factor 3)
// BAD: hardcoded config
String dbUrl = "jdbc:mysql://prod-db.internal:3306/app"; // in code!

// GOOD: config from environment
String dbUrl = System.getenv("DATABASE_URL");
// Or Spring Boot:
@Value("\${database.url}")
String dbUrl; // reads from application.yml OR environment variable

// 12-Factor: Logs as streams (Factor 11)
// Don't write to files — write to stdout/stderr, let platform collect
logging.level.root=INFO
# Let Docker/Kubernetes capture stdout → forward to ELK/Splunk

// 12-Factor: Stateless processes (Factor 6)
// Store all state in backing services:
// Sessions → Redis, Files → S3, DB state → PostgreSQL

// When to choose Microservices:
// ✓ Different teams own different bounded contexts
// ✓ Different services have very different scaling needs (checkout vs catalog)
// ✓ Different technology requirements (ML service in Python, API in Java)
// ✗ Small team (<10 engineers) — operational overhead outweighs benefits
// ✗ Unclear domain boundaries — premature decomposition leads to distributed monolith
```

### Q: Fault tolerance patterns in microservices: Circuit Breaker, Retry, Bulkhead, Rate Limiter?

**A:** Circuit Breaker (Resilience4j): stops calling failing services. States: CLOSED (normal), OPEN (fast-fail, no calls), HALF_OPEN (test calls). Retry: automatically retries failed requests with exponential backoff + jitter. Use only for transient failures — do NOT retry non-idempotent calls without caution. Bulkhead: isolates failures by limiting concurrent calls per service. If inventory-service is slow, bulkhead prevents it from consuming all threads and starving other services. Rate Limiter: limits calls PER TIME WINDOW to prevent overloading downstream services.

```java
// Resilience4j all four patterns combined:
@CircuitBreaker(name = "inventory", fallbackMethod = "fallback")
@Retry(name = "inventory")
@Bulkhead(name = "inventory")
@RateLimiter(name = "inventory")
public boolean checkStock(String sku) {
    return inventoryClient.checkStock(sku);
}

public boolean fallback(String sku, Exception e) {
    log.warn("Inventory unavailable for {}, assuming in stock", sku);
    return true; // graceful degradation
}

# application.yml:
resilience4j:
  circuitbreaker:
    instances:
      inventory:
        failure-rate-threshold: 50
        wait-duration-in-open-state: 30s
        sliding-window-size: 10
  retry:
    instances:
      inventory:
        max-attempts: 3
        wait-duration: 500ms
        exponential-backoff-multiplier: 2  # 500ms, 1s, 2s
  bulkhead:
    instances:
      inventory:
        max-concurrent-calls: 10  # max 10 parallel calls
  rate-limiter:
    instances:
      inventory:
        limit-for-period: 20     # 20 calls per period
        limit-refresh-period: 1s
```

### Q: How do you manage distributed tracing? How do you handle API versioning and rollback?

**A:** Distributed Tracing: Micrometer Tracing (Spring Boot 3) + Zipkin/Jaeger. Every request gets a unique traceId propagated via HTTP headers (traceparent in W3C trace context). Each service span contributes to the trace. In Zipkin UI, you can see the entire request journey and identify slow spans. API Versioning: URL versioning (/api/v1/ vs /api/v2/), header versioning (Accept: application/vnd.app.v2+json), query param. Zero-downtime rollback: Blue-Green deployment (maintain two environments, switch traffic instantly), Canary release (route small % to new version, increase gradually), feature flags (disable feature without deployment).

```java
# Micrometer Tracing + Zipkin (Spring Boot 3)
<dependency>
    <groupId>io.micrometer</groupId>
    <artifactId>micrometer-tracing-bridge-brave</artifactId>
</dependency>
<dependency>
    <groupId>io.zipkin.reporter2</groupId>
    <artifactId>zipkin-reporter-brave</artifactId>
</dependency>

# application.yml
management.tracing.sampling.probability: 1.0  # sample 100% (use 0.1 in prod)
spring.zipkin.base-url: http://zipkin:9411

// traceId automatically added to all logs and HTTP headers
// Every inter-service RestTemplate/WebClient/FeignClient call propagates traceid

// API Versioning:
@RestController
@RequestMapping("/api/v1/orders")
class OrderControllerV1 { ... }

@RestController
@RequestMapping("/api/v2/orders")
class OrderControllerV2 { ... } // breaking change

// Blue-Green deployment (Kubernetes):
// Blue: current stable version (receiving all traffic)
// Green: new version deployed alongside
// Switch: change Service selector from blue to green (instant rollback possible)
// kubectl patch service myapp -p '{"spec":{"selector":{"version":"green"}}}'
```

### Q: What is the difference between Clustered and Unclustered (Non-clustered) Indexes?

**A:** Clustered index: determines the PHYSICAL ORDER of data in the table. Only one per table (data can only be sorted one way). In most databases, the primary key is the clustered index. Leaf nodes of the B-tree ARE the actual data rows. Fast for range queries on the index key. Non-clustered (unclustered) index: separate B-tree structure with pointers to data rows. Multiple per table allowed. Leaf nodes contain the index key + a pointer (row locator) to the actual row. Adds an extra lookup step (

### Q: SQL vs NoSQL: key differences? ACID in databases? Materialized views?

**A:** SQL: structured, schema-on-write, ACID transactions, relational (tables+joins). ACID: Atomicity (all or nothing), Consistency (rules enforced), Isolation (concurrent transactions don\

### Q: What are SQL window functions? ROW_NUMBER vs RANK vs DENSE_RANK? CTE? Find Nth highest salary?

**A:** ROW_NUMBER(): sequential number 1,2,3,4... no ties. RANK(): gaps on ties (1,1,3,4 — two rows rank 1, next is 3). DENSE_RANK(): no gaps on ties (1,1,2,3). CTE (Common Table Expression): named temporary result set defined with WITH clause. Improves readability for complex queries. Recursive CTEs enable hierarchical queries. Nth highest salary: use DENSE_RANK or ROW_NUMBER partitioned appropriately.

```java
-- Nth highest salary (e.g. 3rd highest):
SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM employees
) ranked
WHERE rnk = 3; -- change 3 for Nth

-- ROW_NUMBER vs RANK vs DENSE_RANK:
-- Salaries: 90000, 90000, 80000, 70000
SELECT name, salary,
    ROW_NUMBER()  OVER (ORDER BY salary DESC) AS row_num,  -- 1, 2, 3, 4
    RANK()        OVER (ORDER BY salary DESC) AS rnk,      -- 1, 1, 3, 4
    DENSE_RANK()  OVER (ORDER BY salary DESC) AS dense_rnk -- 1, 1, 2, 3
FROM employees;

-- CTE: readable complex query
WITH dept_avg AS (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM employees GROUP BY department_id
),
high_earners AS (
    SELECT e.name, e.salary, d.avg_salary
    FROM employees e
    JOIN dept_avg d ON e.department_id = d.department_id
    WHERE e.salary > d.avg_salary * 1.2
)
SELECT * FROM high_earners ORDER BY salary DESC;

-- Recursive CTE: org chart (find all managers above an employee)
WITH RECURSIVE hierarchy AS (
    SELECT id, name, manager_id FROM employees WHERE id = 5 -- start
    UNION ALL
    SELECT e.id, e.name, e.manager_id FROM employees e
    JOIN hierarchy h ON e.id = h.manager_id -- join with previous level
)
SELECT * FROM hierarchy;
```

### Q: UNION vs JOIN? Subqueries vs Joins? Find duplicate records? NULL handling in SQL?

**A:** JOIN: combines columns from multiple tables horizontally (adds columns). UNION: combines rows from multiple queries vertically (stacks rows). UNION removes duplicates; UNION ALL keeps them. Both must have same column count and compatible types. Subquery vs Join: subqueries are often less efficient (executed per row for correlated subqueries); joins with proper indexes are usually faster. Duplicates: use GROUP BY + HAVING COUNT(*) > 1. NULL: NULL ≠ NULL in SQL (NULL = NULL is NULL, not true). Use IS NULL / IS NOT NULL. Functions: COALESCE(x, default) returns first non-null. NULLIF(x, y) returns null if x=y.

```java
-- UNION: stack rows
SELECT name, email FROM customers
UNION                                -- removes duplicates
SELECT name, email FROM leads;

SELECT name FROM employees
UNION ALL                            -- keeps duplicates (faster)
SELECT name FROM contractors;

-- Find duplicates:
SELECT email, COUNT(*) AS cnt
FROM users
GROUP BY email
HAVING COUNT(*) > 1;

-- Delete duplicates, keep lowest id:
DELETE FROM users WHERE id NOT IN (
    SELECT MIN(id) FROM users GROUP BY email
);

-- Subquery (often slower — correlated):
SELECT name FROM employees e
WHERE salary > (SELECT AVG(salary) FROM employees);  -- non-correlated, fast

SELECT name FROM employees e
WHERE salary > (SELECT AVG(salary) FROM employees    -- correlated, slower
                WHERE department_id = e.department_id); -- runs per row

-- NULL handling:
SELECT COALESCE(phone, 'N/A') FROM users; -- replace null with default
SELECT * FROM users WHERE phone IS NULL;  -- NOT: phone = NULL (always false!)
SELECT NULLIF(discount, 0) FROM orders;   -- returns null if discount=0

-- NULL in aggregates: COUNT(*) counts all rows; COUNT(col) skips NULLs
SELECT COUNT(*), COUNT(phone) FROM users; -- different if phone has NULLs
```

### Q: What is database sharding? Sharding vs Replication? Database versioning in microservices?

**A:** Sharding: horizontal partitioning — data split across multiple databases (shards) based on a shard key (e.g. userId % 4). Each shard holds a subset of data. Allows horizontal scaling of writes. Replication: copies of the same data on multiple servers. Read replicas: writes go to primary, reads distributed. High availability: failover to replica if primary fails. Use sharding for write scale. Use replication for read scale + HA. Database versioning (microservices): Flyway/Liquibase for versioned SQL migrations. Backward-compatible changes: add columns (nullable), create new tables. Breaking changes: add new column → deploy service → migrate data → drop old column.

```java
-- Sharding by userId:
-- Shard 0: users where userId % 4 = 0
-- Shard 1: users where userId % 4 = 1
-- Application routes to correct shard:
int shard = userId % 4;
DataSource ds = shardDataSources.get(shard);

-- Problems with sharding:
-- Cross-shard queries are expensive (no joins across shards)
-- Rebalancing when adding shards is complex
-- Consistent hashing helps with rebalancing

-- Replication for read scale:
-- Primary: all writes
-- Read Replica 1, 2, 3: serve SELECT queries
-- Replication lag: replica may be ~100ms behind primary (eventual consistency)

-- Flyway: database versioning
-- src/main/resources/db/migration/V1__create_users.sql
CREATE TABLE users (id BIGSERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE);

-- V2__add_phone_to_users.sql
ALTER TABLE users ADD COLUMN phone VARCHAR(20); -- nullable = backward compatible!

-- flyway_schema_history table tracks applied migrations
-- Never modify applied migrations — always add new version files
```

### Q: What is database denormalization? What are Views and their limitations? Procedure vs Function?

**A:** Normalization: eliminate redundancy by splitting data into related tables. Denormalization: intentionally add redundancy to improve read performance — fewer joins. Use when: query performance is critical, data is read much more than written, analytics/reporting workloads. Views: virtual table defined by a query. Benefits: abstraction, security (hide columns), simplify complex queries. Limitations: cannot index in most DBs, no built-in caching, updatable view rules are complex. Procedure vs Function: Function always returns a value, can be used in SELECT. Procedure performs actions, no mandatory return, can return via OUT params, cannot be used in SELECT.

```java
-- Normalization (3NF):
orders(order_id, user_id, product_id, quantity)  -- normalized
users(user_id, name, email)
products(product_id, title, price)

-- Denormalized (for fast reporting — no joins needed):
order_facts(order_id, user_name, user_email, product_title, price, quantity, total)

-- When to denormalize: analytics tables, data warehouses, MongoDB documents

-- View:
CREATE VIEW active_premium_users AS
SELECT id, name, email FROM users
WHERE active = true AND subscription = 'PREMIUM';
-- Usage: SELECT * FROM active_premium_users; -- hides the WHERE clause
-- Limitation: no index on view itself (query still scans underlying table)

-- Function: returns value, used in SELECT
CREATE FUNCTION calculate_tax(price NUMERIC) RETURNS NUMERIC AS $$
BEGIN
    RETURN price * 0.1;
END;
$$ LANGUAGE plpgsql;
SELECT title, price, calculate_tax(price) FROM products; -- used inline

-- Procedure: actions, no mandatory return
CREATE PROCEDURE archive_old_orders(cutoff_date DATE) AS $$
BEGIN
    INSERT INTO archived_orders SELECT * FROM orders WHERE order_date < cutoff_date;
    DELETE FROM orders WHERE order_date < cutoff_date;
END;
$$ LANGUAGE plpgsql;
CALL archive_old_orders('2023-01-01'); -- called with CALL, not in SELECT
```

### Q: What are different JDBC statement types? What is connection pooling?

**A:** Statement: for static SQL, no parameters. Vulnerable to SQL injection. PreparedStatement: pre-compiled, parameterized — prevents SQL injection, better performance (reused execution plan). Use for any user input. CallableStatement: for stored procedures. Connection Pooling: maintaining a pool of pre-opened database connections that are reused. Opening a new DB connection is expensive (~100ms). Pool keeps connections open, lends them out and returns. HikariCP (Spring Boot default): fastest Java connection pool. Key settings: maximumPoolSize, minimumIdle, connectionTimeout, maxLifetime.

```java
// Statement: static SQL (NEVER use with user input!)
Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery("SELECT * FROM users WHERE id = " + userId);
// SQL injection risk: userId = "1 OR 1=1" → returns ALL users!

// PreparedStatement: parameterized (safe from injection + faster)
PreparedStatement pstmt = conn.prepareStatement(
    "SELECT * FROM users WHERE id = ? AND active = ?"
);
pstmt.setLong(1, userId);      // parameter binding
pstmt.setBoolean(2, true);
ResultSet rs = pstmt.executeQuery();
// Even if userId = "1 OR 1=1", it's treated as a literal string value

// CallableStatement: stored procedures
CallableStatement cstmt = conn.prepareCall("{call archive_orders(?)}");
cstmt.setDate(1, Date.valueOf("2023-01-01"));
cstmt.execute();

// HikariCP configuration (Spring Boot):
spring.datasource.hikari.maximum-pool-size=20     # max connections
spring.datasource.hikari.minimum-idle=5           # idle connections to maintain
spring.datasource.hikari.connection-timeout=30000 # wait max 30s for connection
spring.datasource.hikari.max-lifetime=1800000     # max conn lifetime 30min
spring.datasource.hikari.idle-timeout=600000      # idle conn kept 10min

// Monitor pool exhaustion:
// hikaricp.connections.pending > 0 → all connections in use → scale up pool
```

### Q: What is IllegalMonitorStateException vs InterruptedException in Java?

**A:** IllegalMonitorStateException: thrown when you call wait(), notify(), or notifyAll() without holding the object\

### Q: How do you handle thread interruption? How do you check if a thread holds a lock?

**A:** Thread interruption: the interrupt() method sets the interrupt flag. Blocking methods (sleep, wait, join) throw InterruptedException when interrupted. Non-blocking code must poll Thread.interrupted() or isInterrupted(). Check if a thread holds a lock: use Thread.holdsLock(object) — returns true if the current thread holds the monitor for that object. This is useful for assertions in library code: assert Thread.holdsLock(this) in a method that assumes it is called under synchronization.

```java
// Checking interrupt flag in non-blocking code:
class DataProcessor implements Runnable {
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            // isInterrupted() checks but does NOT clear the flag
            processNextBatch();
        }
        System.out.println("Interrupted, shutting down gracefully");
    }
    private void processNextBatch() { /* ... */ }
}

// Thread.interrupted() clears the flag (static method):
// Thread.interrupted() — checks AND clears the interrupt flag
// Thread.currentThread().isInterrupted() — checks but does NOT clear

// holdsLock for assertions:
class SafeCounter {
    private final Object lock = new Object();
    private int count = 0;

    private void increment() {
        assert Thread.holdsLock(lock) : "Must be called while holding lock!";
        count++;
    }

    public int getAndIncrement() {
        synchronized (lock) {
            increment(); // assertion passes
            return count;
        }
    }
}
```

### Q: How do you implement a fair lock in Java? What is the difference between a fair and unfair lock?

**A:** Fair lock: threads acquire the lock in the order they requested it (FIFO). In Java, ReentrantLock(true) creates a fair lock. Unfair lock (default): threads can 

### Q: What happens when an exception occurs inside a synchronized block? Write a Producer/Consumer using wait/notify.

**A:** Exception in synchronized block: the lock IS released. When an exception propagates out of a synchronized method or block, Java releases the monitor. The object\

### Q: What is RejectedExecutionHandler? How does it work in ThreadPoolExecutor?

**A:** RejectedExecutionHandler is called when ThreadPoolExecutor cannot accept a new task — either because the pool is shut down or the queue is full and max threads are reached. Built-in policies: AbortPolicy (default): throws RejectedExecutionException. CallerRunsPolicy: runs the task in the calling thread (provides backpressure). DiscardPolicy: silently discards the task. DiscardOldestPolicy: discards the oldest queued task and retries submission. You can implement a custom handler for logging, metrics, or storing rejected tasks to a database.

```java
import java.util.concurrent.*;

// Custom RejectedExecutionHandler:
RejectedExecutionHandler customHandler = (runnable, executor) -> {
    System.err.println("Task rejected! Queue full. Saving to fallback queue.");
    // Could: save to DB, push to message queue, alert, etc.
    fallbackQueue.add(runnable);
};

ThreadPoolExecutor executor = new ThreadPoolExecutor(
    2,              // corePoolSize
    4,              // maximumPoolSize
    60, TimeUnit.SECONDS, // keepAliveTime
    new ArrayBlockingQueue<>(10), // bounded queue
    customHandler   // rejected task handler
);

// Built-in policies:
new ThreadPoolExecutor(2, 4, 60, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(10),
    new ThreadPoolExecutor.CallerRunsPolicy()); // runs in caller's thread

// CallerRunsPolicy creates natural backpressure:
// When pool is saturated, the calling thread runs the task itself,
// slowing down task submission automatically.
```

### Q: What is the difference between a Stub and a Mock in unit testing?

**A:** Stub: provides pre-programmed responses to calls. Used to replace dependencies with controlled outputs. No behavior verification. You just set 

### Q: Can you test a private method using JUnit? How do you test exceptions and async methods?

**A:** Private methods: generally you should NOT test them directly — test via public methods (if logic is worth testing, it deserves its own class). If you must: use reflection (bad practice) or Mockito\

### Q: What is the @Override annotation? Can we override non-abstract methods in an abstract class? Can we override synchronized with non-synchronized?

**A:** @Override: tells compiler to verify the method truly overrides a parent method. Without it, a typo creates a new method silently — a common bug. Override non-abstract in abstract class: YES — a child can override any non-final, non-static, non-private method regardless of whether the parent is abstract or concrete. This is normal polymorphism. Override synchronized with non-synchronized: YES — the synchronization is NOT part of the method signature. A subclass can override a synchronized method with a non-synchronized one (or vice versa). The override is valid, but you lose thread safety in the subclass.

```java
// @Override catches typos at compile time:
class Animal {
    public void speak() { System.out.println("..."); }
}
class Dog extends Animal {
    @Override
    public void speek() { } // COMPILE ERROR — "speek" not in Animal
    // Without @Override: this silently creates a NEW method — bug!
}

// Override non-abstract in abstract class:
abstract class Vehicle {
    public void start() { System.out.println("Starting engine"); }
    public abstract void drive();
}
class Car extends Vehicle {
    @Override
    public void start() { System.out.println("Car starting"); } // valid
    @Override
    public void drive() { System.out.println("Driving car"); }
}

// Override synchronized with non-synchronized:
class SafeCounter {
    public synchronized void increment() { count++; }
}
class UnsafeCounter extends SafeCounter {
    @Override
    public void increment() { count++; } // valid override, but not synchronized!
    // Thread safety is NOT inherited through overriding
}
```

### Q: Can we have multiple main() methods? Execute without main()? JDK version compatibility?

**A:** Multiple main() methods: YES in different classes. ONE class is the entry point (specified at java launch). You can also overload main() in the same class (not the entry point). Execute without main(): Prior to Java 21 — NO, you need main(). Java 21+ with 

### Q: How do you perform a deep copy in Java? What is CloneNotSupportedException?

**A:** Shallow copy: copies reference values — both original and copy point to the same nested objects. Object.clone() is shallow by default. Deep copy: recursively copies all nested objects so original and copy are fully independent. Ways to deep copy: 1) Override clone() recursively. 2) Serialization + deserialization (slow but simple). 3) Copy constructor. 4) Jackson/Gson: serialize to JSON and back. CloneNotSupportedException: clone() throws this if the class does not implement Cloneable. It is a checked exception. Even with Cloneable, clone() only does a shallow copy.

```java
// Copy constructor (clean deep copy):
class Address {
    String city;
    Address(Address other) { this.city = other.city; } // copy constructor
}
class Employee {
    String name;
    Address address;
    Employee(Employee other) {
        this.name = other.name;
        this.address = new Address(other.address); // deep copy the nested object
    }
}

// Serialization-based deep copy (any Serializable graph):
public static <T extends Serializable> T deepCopy(T obj) throws Exception {
    ByteArrayOutputStream bos = new ByteArrayOutputStream();
    ObjectOutputStream out = new ObjectOutputStream(bos);
    out.writeObject(obj);
    out.flush();
    ByteArrayInputStream bis = new ByteArrayInputStream(bos.toByteArray());
    ObjectInputStream in = new ObjectInputStream(bis);
    return (T) in.readObject(); // new independent copy
}

// clone() + CloneNotSupportedException:
class Point implements Cloneable {
    int x, y;
    @Override
    public Point clone() {
        try {
            return (Point) super.clone(); // shallow — fine for primitives only
        } catch (CloneNotSupportedException e) {
            throw new AssertionError(); // won't happen — we implement Cloneable
        }
    }
}
```

### Q: What happens when the main() method runs? How does System.out.println("Hello") work internally?

**A:** When main() runs: 1) JVM starts. 2) ClassLoader loads the class. 3) Static initializers run. 4) main() is invoked on the main thread. System.out.println internals: System.out is a PrintStream (a static field in System). println() calls print(String) which calls synchronized write() on the underlying OutputStream. For console output this is a FileOutputStream wrapping file descriptor 1 (stdout). The write goes through native OS system call write(1, bytes, len). Thread safety: PrintStream synchronizes on itself internally, so concurrent println() calls are safe (individual calls won\

### Q: Can an enum extend a class? How do you iterate enum values? What is Enum<E extends Enum<E>>?

**A:** Can enum extend a class: NO — every enum implicitly extends java.lang.Enum<E>. Since Java has single inheritance, enums cannot extend another class. However, enums CAN implement interfaces. Iterate enum values: use values() static method (returns array), or EnumSet.allOf(). Enum<E extends Enum<E>>: this is the self-referential generic declaration that allows Enum to provide methods like compareTo(E) that are type-safe. The E is the actual enum type so Suit.HEARTS.compareTo() returns Suit, not raw Enum.

```java
// Enum cannot extend a class:
// enum Status extends BaseStatus { ... } // COMPILE ERROR

// Enum CAN implement interfaces:
interface Describable { String describe(); }
enum Priority implements Describable {
    LOW, MEDIUM, HIGH;
    public String describe() { return name() + " priority"; }
}

// Iterate with values():
for (Priority p : Priority.values()) {
    System.out.println(p.ordinal() + ": " + p.name()); // 0: LOW, 1: MEDIUM...
}

// EnumSet (efficient bit-set implementation):
EnumSet<Priority> urgent = EnumSet.of(Priority.MEDIUM, Priority.HIGH);
EnumSet<Priority> all = EnumSet.allOf(Priority.class);

// Enum<E extends Enum<E>> allows type-safe compareTo:
Priority a = Priority.LOW;
Priority b = Priority.HIGH;
System.out.println(a.compareTo(b)); // negative: LOW comes before HIGH
// compareTo compares by ordinal

// Name and ordinal:
Priority p = Priority.HIGH;
System.out.println(p.name());    // "HIGH"
System.out.println(p.ordinal()); // 2
Priority fromName = Priority.valueOf("LOW"); // reverse lookup
```

### Q: Can you serialize static fields? What happens during serialization if an exception is thrown or a field is not serializable?

**A:** Serialize static fields: NO — static fields belong to the class, not the instance. Serialization captures object state; class-level state is not serialized. On deserialization, static fields retain their current JVM values (or defaults if the class was freshly loaded). Non-serializable member: if a Serializable class has a non-serializable field (not marked transient), ObjectOutputStream throws NotSerializableException. Fix: mark field transient or make the member implement Serializable. Exception during serialization: the stream is corrupted — partial writes. The stream should be discarded. Always close streams in finally/try-with-resources.

```java
// Static fields are NOT serialized:
class Config implements Serializable {
    static int instanceCount = 0;   // NOT serialized — belongs to class
    String name;                     // serialized — instance field

    Config(String name) { this.name = name; instanceCount++; }
}
// After serialize/deserialize: name is restored, instanceCount keeps its current value

// Non-serializable member → NotSerializableException:
class Report implements Serializable {
    String title;
    Thread workerThread; // Thread is NOT Serializable!
    // → throws NotSerializableException at runtime

    // Fix: mark transient
    transient Thread workerThread2; // excluded from serialization
}

// Exception during serialization — use try-with-resources:
try (ObjectOutputStream oos = new ObjectOutputStream(
        new FileOutputStream("data.ser"))) {
    oos.writeObject(myObject);
} catch (NotSerializableException e) {
    System.err.println("Class not serializable: " + e.getMessage());
} catch (IOException e) {
    System.err.println("IO error during serialization: " + e.getMessage());
}
```

### Q: What is covariance and contravariance in Java generics? Can you pass List<String> to a method accepting List<Object>?

**A:** Covariance: a List<Dog> IS-A List<? extends Animal> — you can read Animals from it, not write. Contravariance: a List<Animal> IS-A List<? super Dog> — you can write Dogs to it, not read safely. Invariance: List<String> is NOT a List<Object> — no relationship despite String extends Object. This prevents type pollution (if it were allowed, you could add Integer to a List<String> through the List<Object> reference). Can you pass List<String> to List<Object>: NO. Use List<? extends Object> (wildcard) if you only need to read.

```java
// List<String> is NOT assignable to List<Object> — compile error:
List<String> strings = new ArrayList<>();
// List<Object> objects = strings; // COMPILE ERROR
// Reason: if allowed, you could do objects.add(42) which corrupts strings!

// Covariance (? extends): read only
List<? extends Number> numbers = new ArrayList<Integer>();
Number n = numbers.get(0); // OK — reading as Number
// numbers.add(1); // COMPILE ERROR — can't add, type unknown

// Contravariance (? super): write only
List<? super Integer> ints = new ArrayList<Number>();
ints.add(42); // OK — writing Integer
// Integer i = ints.get(0); // COMPILE ERROR — can only read as Object

// PECS: Producer Extends, Consumer Super
static <T> void copy(List<? extends T> source, List<? super T> dest) {
    for (T t : source) dest.add(t); // source produces, dest consumes
}
copy(new ArrayList<Integer>(), new ArrayList<Number>()); // valid

// Array covariance (different from generics — runtime exception possible):
Object[] arr = new String[3]; // compiles!
arr[0] = 42; // ArrayStoreException at runtime — why generics are invariant
```

### Q: How do LinkedHashSet vs TreeSet compare? Can TreeMap store null keys? How do you set ArrayList initial capacity?

**A:** LinkedHashSet: insertion-order maintained (uses LinkedHashMap internally), O(1) add/contains/remove, allows one null. TreeSet: sorted order (natural or Comparator), O(log n) operations, backed by TreeMap — does NOT allow null (NullPointerException on add). TreeMap null keys: NO (throws NullPointerException) because compareTo(null) fails. HashMap and LinkedHashMap allow one null key. ArrayList initial capacity: use ArrayList(int initialCapacity) constructor. When you know approximate size, pre-sizing avoids repeated array copies: new ArrayList<>(expectedSize). Default capacity is 10; grows by 50% when full.

```java
// LinkedHashSet: insertion order preserved
LinkedHashSet<String> linked = new LinkedHashSet<>();
linked.add("banana"); linked.add("apple"); linked.add("cherry");
System.out.println(linked); // [banana, apple, cherry] — insertion order

// TreeSet: sorted order
TreeSet<String> tree = new TreeSet<>();
tree.add("banana"); tree.add("apple"); tree.add("cherry");
System.out.println(tree); // [apple, banana, cherry] — natural sort

// tree.add(null); // NullPointerException — TreeSet cannot compare null

// TreeMap null key — also throws NPE:
TreeMap<String, Integer> treeMap = new TreeMap<>();
// treeMap.put(null, 1); // NullPointerException

// ArrayList initial capacity:
List<Order> orders = new ArrayList<>(10_000); // pre-allocated, no resizing
// vs:
List<Order> slow = new ArrayList<>();         // starts at 10, resizes ~12 times

// LinkedHashSet: when to use over TreeSet?
// LinkedHashSet: when you need O(1) operations AND insertion order (e.g. LRU cache, deduplication with order)
// TreeSet: when you need sorted order or range queries (headSet/tailSet/subSet)
NavigableSet<Integer> range = tree.subSet(1, true, 5, true); // tree only
```

### Q: How do you implement an LRU Cache? What are the issues with mutable keys in HashMap?

**A:** LRU Cache with LinkedHashMap: use LinkedHashMap(capacity, 0.75f, true) — the third argument (accessOrder=true) makes it maintain access order. Override removeEldestEntry() to evict the oldest when capacity exceeded. Mutable keys in HashMap: dangerous. hashCode is computed at insertion time. If the key is mutated later, its hashCode changes, making it impossible to find in the original bucket. The key becomes 

### Q: Can an interface with multiple default methods still be a functional interface? What is a higher-order function?

**A:** Functional interface: must have exactly ONE abstract method. It CAN have any number of default methods, static methods, and Object overrides (equals, toString, hashCode). The @FunctionalInterface annotation enforces this at compile time. Having multiple defaults is fine — they are not abstract. Higher-order function: a function that takes a function as argument or returns a function. In Java, this means methods that accept or return functional interfaces (Function<T,R>, Predicate<T>, etc.).

```java
// Interface with multiple defaults — still functional:
@FunctionalInterface
interface Transformer<T> {
    T transform(T input); // ONLY ONE abstract method — still functional!

    default Transformer<T> andThen(Transformer<T> after) {
        return input -> after.transform(this.transform(input));
    }
    default Transformer<T> compose(Transformer<T> before) {
        return input -> this.transform(before.transform(input));
    }
    static <T> Transformer<T> identity() {
        return input -> input;
    }
}
Transformer<String> upper = s -> s.toUpperCase();
Transformer<String> trim  = s -> s.trim();
Transformer<String> clean = trim.andThen(upper);
System.out.println(clean.transform("  hello  ")); // "HELLO"

// Higher-order function: accepts a Function as parameter
static <T, R> List<R> transform(List<T> list, Function<T, R> mapper) {
    return list.stream().map(mapper).collect(Collectors.toList());
}
List<String> names = List.of("alice", "bob");
List<String> upper = transform(names, String::toUpperCase); // passes function

// Returns a function:
static Predicate<String> hasMinLength(int min) {
    return s -> s.length() >= min; // returns a new function
}
Predicate<String> longEnough = hasMinLength(5);
System.out.println(longEnough.test("hello")); // true
```

### Q: What is the Java 9 Module System? What are hidden classes (Java 15)?

**A:** Java 9 Module System (JPMS): introduces modules — named, self-describing collections of packages. A module has a module-info.java declaring what it exports and what it requires. Benefits: strong encapsulation (internal packages can be truly hidden), explicit dependencies, smaller runtime images (jlink). Hidden classes (Java 15): classes not discoverable by name, not accessible via ClassLoader. Created by Lookup.defineHiddenClass(). Used by frameworks (Lambdas, Proxies) to generate code at runtime that should be GC\

### Q: What are different Spring Bean scopes? What is @PostConstruct? How do you reduce Spring Boot startup time?

**A:** Bean scopes: Singleton (default) — one instance per container. Prototype — new instance on every injection/getBean. Request — one per HTTP request (web). Session — one per HTTP session. Application — one per ServletContext. WebSocket — one per WebSocket. @PostConstruct: marks a method to run after the bean is fully initialized (dependencies injected). Use for: database validation, cache pre-loading, connection setup. Alternatives: InitializingBean.afterPropertiesSet(), @Bean(initMethod). Reduce startup time: use spring.main.lazy-initialization=true, exclude unneeded AutoConfigurations, use GraalVM native image, reduce component scan scope.

```java
// Bean scopes:
@Bean @Scope("singleton") // default — same instance every time
public PaymentService paymentService() { return new PaymentService(); }

@Bean @Scope("prototype") // new instance each request
public ReportBuilder reportBuilder() { return new ReportBuilder(); }

@Bean @Scope(WebApplicationContext.SCOPE_REQUEST) // web only
public RequestContext requestContext() { return new RequestContext(); }

// @PostConstruct — runs after dependency injection:
@Service
public class CacheWarmer {
    @Autowired private ProductRepository repo;

    @PostConstruct
    public void warmUpCache() {
        // All @Autowired fields are set by now
        List<Product> popular = repo.findTopSelling(100);
        cache.putAll(popular);
        log.info("Cache warmed with {} products", popular.size());
    }
    // Runs once at startup — safe to call repo
}

// Reduce startup time:
// application.properties:
// spring.main.lazy-initialization=true  // beans created on first use
// spring.autoconfigure.exclude=\
//   org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
```

### Q: How do you implement global exception handling in Spring Boot? What is @ControllerAdvice?

**A:** @ControllerAdvice: a special component that applies to all controllers (or a subset). @ExceptionHandler inside it catches exceptions globally. @RestControllerAdvice = @ControllerAdvice + @ResponseBody — best for REST APIs. You can define multiple handlers for different exception types. Return a ResponseEntity with a problem body. ProblemDetail (Spring 6+) provides RFC 7807 standard error format. @ResponseStatus on exception class sets the HTTP status code.

```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Handle specific business exception:
    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ProblemDetail handleOrderNotFound(OrderNotFoundException ex,
                                              HttpServletRequest request) {
        ProblemDetail detail = ProblemDetail.forStatusAndDetail(
            HttpStatus.NOT_FOUND, ex.getMessage());
        detail.setInstance(URI.create(request.getRequestURI()));
        return detail;
    }

    // Handle validation failures:
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err ->
            errors.put(err.getField(), err.getDefaultMessage()));
        return errors;
    }

    // Catch-all fallback:
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ProblemDetail handleAll(Exception ex) {
        log.error("Unhandled exception", ex);
        return ProblemDetail.forStatusAndDetail(
            HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }
}
```

### Q: What is Spring WebFlux and reactive programming? When should you use it?

**A:** Spring WebFlux: reactive web framework built on Project Reactor. Uses non-blocking I/O — a small number of threads handles many concurrent connections (event loop model, like Node.js). Core types: Mono<T> (0 or 1 element) and Flux<T> (0 to N elements). Use WebFlux when: high concurrency with many slow I/O operations (DB, HTTP calls), streaming data (SSE, WebSocket). Do NOT use for: CPU-bound work (no benefit), small apps (extra complexity), when your team is unfamiliar with reactive patterns. Spring MVC is the better default; WebFlux when throughput with blocking I/O is a bottleneck.

```java
// WebFlux controller:
@RestController
public class UserController {

    @GetMapping("/users/{id}")
    public Mono<User> getUser(@PathVariable Long id) {
        return userService.findById(id)    // returns Mono<User>
            .switchIfEmpty(Mono.error(new UserNotFoundException(id)));
    }

    @GetMapping(value = "/users/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<User> streamUsers() {
        return userService.findAll()       // returns Flux<User>
            .delayElements(Duration.ofSeconds(1)); // emit one per second
    }
}

// Reactive service combining calls:
public Mono<OrderSummary> getOrderSummary(Long orderId) {
    Mono<Order> order = orderRepo.findById(orderId);
    Mono<Customer> customer = order.flatMap(o -> customerRepo.findById(o.getCustomerId()));

    // Execute in parallel:
    return Mono.zip(order, customer)
        .map(tuple -> new OrderSummary(tuple.getT1(), tuple.getT2()));
}

// Traditional MVC: 1 thread per request (blocked during DB/HTTP calls)
// WebFlux: 1 thread handles many requests, never blocked
```

### Q: How do you test a Spring Boot application? What is the difference between @SpringBootTest and @WebMvcTest?

**A:** @SpringBootTest: loads the full application context. Use for integration tests. Slow but tests the real wiring. Can start an embedded server with webEnvironment. @WebMvcTest: loads only the web layer (controllers, filters, ControllerAdvice). No service/repository beans — you mock them. Fast and focused. @DataJpaTest: loads only JPA layer (repositories, entities). Uses in-memory H2 by default. @MockBean: creates a Mockito mock and registers it as a Spring bean — replaces the real bean in the context. Best practice: use slice tests for isolated testing and @SpringBootTest only for true end-to-end integration tests.

```java
// @WebMvcTest — tests only the web layer (fast):
@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired MockMvc mockMvc;
    @MockBean OrderService orderService; // replaces real bean

    @Test
    void shouldReturnOrder() throws Exception {
        given(orderService.findById(1L))
            .willReturn(new Order(1L, "Laptop", 999.0));

        mockMvc.perform(get("/orders/1"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.product").value("Laptop"));
    }
}

// @DataJpaTest — tests only JPA layer:
@DataJpaTest
class OrderRepositoryTest {
    @Autowired TestEntityManager entityManager;
    @Autowired OrderRepository repo;

    @Test
    void findByCustomerId() {
        entityManager.persistAndFlush(new Order(null, "Book", 25.0, 1L));
        List<Order> orders = repo.findByCustomerId(1L);
        assertThat(orders).hasSize(1);
    }
}

// @SpringBootTest — full integration test:
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class OrderIntegrationTest {
    @Autowired TestRestTemplate restTemplate;

    @Test
    void fullFlowTest() {
        ResponseEntity<Order> response = restTemplate.getForEntity("/orders/1", Order.class);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }
}
```

### Q: How do you ensure security in a Spring Boot application? What is the role of Spring Security filter chain?

**A:** Spring Security filter chain: a chain of servlet filters applied before requests reach controllers. Key filters: SecurityContextPersistenceFilter (loads auth from session), UsernamePasswordAuthenticationFilter (handles login form), BearerTokenAuthenticationFilter (JWT), ExceptionTranslationFilter (converts auth exceptions to HTTP responses), FilterSecurityInterceptor (enforces authorization). Configuration: in Spring Security 6, use SecurityFilterChain bean with HttpSecurity. Disable CSRF for stateless APIs. Use method-level security with @EnableMethodSecurity and @PreAuthorize/@PostAuthorize.

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())           // stateless API — no CSRF needed
            .sessionManagement(sm ->
                sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()   // public endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    // Method-level security with @PreAuthorize:
    @Service
    class OrderService {
        @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
        public Order getOrder(Long orderId, Long userId) { ... }

        @PostAuthorize("returnObject.userId == authentication.principal.id")
        public Order findOrder(Long id) { ... }
    }
}
```

### Q: How would you investigate a stuck Java web server? How do you debug OutOfMemoryError in production?

**A:** Stuck server (not responding, no logs): 1) Take a thread dump: kill -3 <pid> or jstack <pid>. Look for deadlocks, all threads WAITING/BLOCKED. 2) Check CPU with top -H -p <pid> — which threads use 100%? 3) Run jstat -gc <pid> — is GC running constantly (memory pressure)? 4) Check open file descriptors: lsof -p <pid>. 5) Check for network issues: netstat -anp. OutOfMemoryError: 1) Add JVM flags: -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/. 2) Analyze heap dump with Eclipse MAT or VisualVM — find what holds most memory. 3) Common causes: unbounded caches, unprocessed queues, connection leaks, too many threads.

```java
// JVM flags for production debugging:
// -XX:+HeapDumpOnOutOfMemoryError
// -XX:HeapDumpPath=/tmp/heapdump.hprof
// -Xloggc:/var/log/app/gc.log
// -XX:+PrintGCDetails -XX:+PrintGCDateStamps

// Thread dump analysis — looking for deadlocks:
// jstack -l <pid> | grep -A 50 "deadlock"

// Example deadlock in thread dump:
// Thread 1: waiting for lock <0x...> (held by Thread 2)
// Thread 2: waiting for lock <0x...> (held by Thread 1)
// Found 1 deadlock.

// Monitoring in code (Spring Boot Actuator):
// GET /actuator/threaddump  — current thread states
// GET /actuator/heapdump   — heap dump file
// GET /actuator/metrics/jvm.memory.used  — live memory metrics

// Common OutOfMemoryError scenarios:
// java.lang.OutOfMemoryError: Java heap space
//   → increase -Xmx or fix memory leak

// java.lang.OutOfMemoryError: Metaspace
//   → too many dynamically generated classes (CGLIB proxies, Groovy)
//   → increase -XX:MaxMetaspaceSize

// java.lang.OutOfMemoryError: unable to create native thread
//   → too many threads, reduce thread pool sizes or increase OS limit
```

### Q: What is Spring Batch? What is the Job/Step/Chunk processing model?

**A:** Spring Batch is a framework for processing large volumes of records: CSV imports, database migrations, report generation, ETL pipelines. Core model: Job — the top-level unit, contains one or more Steps. Step — a single phase of a job. Two types: Chunk-oriented (read/process/write in batches) and Tasklet (arbitrary logic). Chunk processing: ItemReader reads one item, ItemProcessor transforms it, results accumulate until chunk-size is reached, then ItemWriter writes the whole chunk in one transaction. JobLauncher starts jobs. JobRepository persists job metadata (status, parameters, execution history) to a database.

```java
@Configuration
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
}
```

### Q: How does Spring Batch handle errors? What is skip/retry/fault-tolerance?

**A:** Skip: configure which exceptions can be skipped without failing the step. A skipped item is logged but not written. skipLimit controls how many skips are allowed before the step fails. Retry: on transient errors (e.g., DB deadlock), retry the chunk. retryLimit controls max retries. Both skip and retry require a SkipPolicy or RetryPolicy. FaultTolerant step: use .faultTolerant() to enable these. Listeners: SkipListener tracks what was skipped. ItemReadListener, ItemWriteListener for auditing. After skipLimit or retryLimit is exceeded, the step fails and the job records FAILED status in JobRepository.

```java
@Bean
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
// JobLauncher restarts from the last failed step using persisted state
```

### Q: What is partitioning in Spring Batch? How do you run batch jobs in parallel?

**A:** Partitioning: splits a large dataset into smaller partitions, each processed by a separate worker Step in parallel. Master step creates partition metadata (ExecutionContext per partition). Slave step processes each partition independently. MultiResourcePartitioner or RangePartitioner are common. Parallel steps: use split() to run Steps concurrently in a flow. Async ItemProcessor: wraps processor in AsyncItemProcessor to process items on a thread pool, write with AsyncItemWriter. Remote Partitioning (Spring Cloud Batch): master sends partitions via a message queue, workers on separate JVMs process them.

```java
// Range-based partitioning (split users by ID range):
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
}
```

### Q: What is Spring Cloud Config Server? How does centralized configuration work?

**A:** Spring Cloud Config Server provides centralized, externalized configuration for distributed systems. Config server reads from a Git repo (or filesystem, Vault, S3). Each microservice (config client) fetches its config at startup via HTTP from the config server using its application name and profile. Supports encryption of sensitive values. @RefreshScope on beans + /actuator/refresh endpoint reloads config without restart (or with Spring Cloud Bus, broadcasts refresh to all instances at once). Key benefit: change configuration without redeploying. Store credentials in Vault, not in Git.

```java
// Config Server setup:
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
// POST /actuator/refresh → reloads @Value and @ConfigurationProperties
```

### Q: What is Spring Cloud Gateway? How do you configure routing, filters, and rate limiting?

**A:** Spring Cloud Gateway: reactive API gateway built on WebFlux. Replaces Zuul. Routes requests to downstream microservices based on predicates (path, host, header, method). Filters modify requests/responses: AddRequestHeader, RewritePath, CircuitBreaker (Resilience4j), RateLimiter (Redis-based), RequestRateLimiter. Global filters apply to all routes. Supports load balancing via Spring Cloud LoadBalancer. Key difference from Zuul: non-blocking, built on Netty, handles high concurrency with fewer threads.

```java
@Configuration
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
}
```

### Q: What is Spring Cloud Stream? How does it simplify event-driven microservices?

**A:** Spring Cloud Stream: abstraction over message brokers (Kafka, RabbitMQ). Defines Binders (broker-specific adapters) and Bindings (application channels). You write plain functional beans (Function<I,O>, Consumer<I>, Supplier<O>). Spring Cloud Stream handles serialization, partitioning, error handling, consumer groups. Consumer group: only one instance in a group processes each message (competing consumers). Retry and DLQ are configurable per binding. Compared to direct Kafka/RabbitMQ use: more portable, less boilerplate, easier to test (TestBinder).

```java
// No broker-specific code — just plain functions:
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
          brokers: localhost:9092
```

### Q: What is Spring Cloud Sleuth and distributed tracing? How do you integrate with Zipkin?

**A:** Spring Cloud Sleuth adds trace-id and span-id to every request, automatically propagated via HTTP headers (B3 propagation) and message headers. A trace spans the entire request chain across services; a span is one unit of work within a trace. Integrating Zipkin: add spring-cloud-starter-zipkin, configure zipkin.base-url. Sleuth sends span data to Zipkin asynchronously. In Spring Boot 3+: Micrometer Tracing replaces Sleuth. Use micrometer-tracing-bridge-brave or otel. OpenTelemetry: the CNCF standard — instruments code once, exports to Jaeger, Zipkin, Datadog, OTLP. All logs automatically include traceId for log correlation.

```java
// build.gradle:
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
// Observation.createNotStarted("db-lookup", registry).observe(() -> ...)
```

### Q: How does Spring @Cacheable work? What are @CacheEvict and @CachePut?

**A:** @Cacheable: method result is stored in cache on first call; subsequent calls with the same key return cached value without executing the method. @CacheEvict: removes an entry (or all entries with allEntries=true) after the method executes. @CachePut: always executes the method but also updates the cache. Common mistake: calling @Cacheable from the same class bypasses the cache (Spring AOP self-invocation problem). Fix: inject the bean or use AspectJ weaving. Default key = method parameters. Custom key with SpEL: @Cacheable(key = 

### Q: What is Redis? How do you use RedisTemplate? What are cache-aside, write-through, and write-behind patterns?

**A:** Redis: in-memory data store. Supports strings, lists, hashes, sets, sorted sets, streams. Sub-millisecond latency. Used for caching, sessions, pub/sub, rate limiting, distributed locks, leaderboards. RedisTemplate: Spring abstraction over Jedis/Lettuce clients. Cache-aside (lazy loading): app checks cache first; on miss, loads from DB and populates cache. Write-through: on write, update both DB and cache synchronously. Ensures consistency but adds write latency. Write-behind (write-back): write to cache immediately, asynchronously flush to DB later. High throughput but risk of data loss on crash. Cache-aside is most common for reads; write-through for critical data consistency.

```java
// RedisTemplate configuration:
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
}
```

### Q: What is Caffeine cache? When do you choose local cache vs distributed cache? What is cache stampede?

**A:** Caffeine: high-performance local (in-process) cache for Java. Uses Window TinyLFU eviction (better hit rate than LRU for most workloads). Not distributed — each JVM has its own copy. Use local cache: when data is small, read-heavy, tolerable to be slightly stale, and doesn\

### Q: What is Flyway? How does it work? When would you choose Flyway vs Liquibase?

**A:** Flyway: convention-based database migration tool. Migrations are SQL files named V1__Create_users.sql (versioned), R__Refresh_view.sql (repeatable), or U1__Undo.sql (undo). Flyway tracks applied migrations in flyway_schema_history table. On app startup, it runs any unexecuted migrations in order. Liquibase: uses changesets in XML/YAML/JSON/SQL. More flexible rollback, supports database diffs, multi-environment management. Flyway: simpler, SQL-first, great for teams that prefer plain SQL. Liquibase: better for complex rollbacks, multi-database support, and when you need database-agnostic changes. Both integrate with Spring Boot via auto-configuration.

```java
// Flyway — migration files go in db/migration/:
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
//                   constraints: { primaryKey: true }
```

### Q: How do you perform zero-downtime database migrations? What is the Expand/Contract pattern?

**A:** Zero-downtime migrations: never drop or rename a column in one step. The Expand/Contract (or parallel-change) pattern: Expand phase — add new column/table, keep old one. Deploy new code that writes to BOTH old and new. Contract phase — once all instances run new code, backfill old data, then drop old column in a separate migration. Example: renaming a column: 1) Add new column, 2) Deploy code writing to both, 3) Backfill, 4) Deploy code reading new column only, 5) Drop old column. For large tables: use pt-online-schema-change (Percona) or gh-ost (GitHub) to alter without locking.

```java
// Scenario: rename column 'name' to 'full_name' without downtime

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
// ALTER TABLE users ADD COLUMN full_name VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
```

### Q: What is gRPC? How does it differ from REST? When should you use it?

**A:** gRPC: Google\

### Q: What are REST API best practices? How do you handle versioning, pagination, and HATEOAS?

**A:** Versioning: URL path (/api/v1/orders), request header (Accept: application/vnd.myapi.v1+json), or query param. URL versioning is simplest. Pagination: offset-based (page=2&size=20) — simple but slow for large offsets. Cursor-based (?after=lastId) — efficient for infinite scroll. Return total count in headers. HATEOAS: Hypermedia As The Engine Of Application State — responses include links to related actions. Clients don\

### Q: What is GraphQL? How does it differ from REST? What are resolvers and N+1 in GraphQL?

**A:** GraphQL: query language for APIs. Client specifies EXACTLY what fields it needs — no over-fetching (getting too many fields) or under-fetching (needing multiple requests). Single endpoint (POST /graphql). Schema-first: define types in SDL (Schema Definition Language). Mutations = writes, Queries = reads, Subscriptions = real-time. N+1 problem in GraphQL: for each Order, fetching the User requires a separate DB call — n orders = n+1 queries. Solution: DataLoader (batching) — accumulates all user IDs from a batch of orders, then fetches them in one query. Spring for GraphQL (Spring Boot 3+) provides @SchemaMapping, @QueryMapping, @MutationMapping, DataFetcher.

```java
// schema.graphqls:
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
}
```

### Q: What is CORS? How do you configure it in Spring Boot? What is CSRF and how does Spring prevent it?

**A:** CORS (Cross-Origin Resource Sharing): browser security mechanism that blocks web pages from making requests to a different domain than the one that served the page. Server must include Access-Control-Allow-Origin header to permit cross-origin requests. Simple solution: @CrossOrigin on controllers. Global: configure WebMvcConfigurer.addCorsMappings or SecurityFilterChain CORS config. CSRF (Cross-Site Request Forgery): attacker tricks a user\

### Q: Explain OAuth 2.0 flows. What is PKCE? When do you use each grant type?

**A:** OAuth 2.0 grant types: Authorization Code: user → authorization server → code → exchange for token. Most secure, for web apps with backend. Implicit: deprecated, returned token in URL (insecure). Client Credentials: service-to-service, no user involved — client authenticates with client_id + client_secret. Resource Owner Password: deprecated, user sends username/password directly — only for trusted first-party apps. Device Code: smart TVs, CLI tools. PKCE (Proof Key for Code Exchange): extension to Authorization Code for public clients (SPAs, mobile apps) that cannot securely store a client_secret. Uses code_verifier (random string) and code_challenge (SHA256 hash of verifier). Prevents authorization code interception attacks.

```java
// Spring Boot as OAuth2 Resource Server (validates JWT from any auth server):
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
// sends code_challenge to auth server, redeems code with verifier (never exposed)
```

### Q: What are rate limiting algorithms? How do you implement rate limiting in Spring Boot?

**A:** Token Bucket: a bucket holds N tokens, refilled at rate R. Each request consumes 1 token. Allows bursts up to bucket size. Most common algorithm. Leaky Bucket: requests drain from bucket at fixed rate. Smooths traffic (no bursts), can drop requests if bucket is full. Fixed Window: count requests per fixed time window (e.g., 100 req/min). Prone to edge case: 200 requests in 2 seconds at window boundary. Sliding Window Log: track timestamps of each request, count within last 60s. Accurate but memory-heavy. Sliding Window Counter: approximate fixed window using weighted previous window count. Implementation options: Spring Cloud Gateway (Redis-backed RateLimiter), Bucket4j library, Resilience4j RateLimiter.

```java
// Bucket4j rate limiter with Redis (distributed, for multiple instances):
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
}
```

### Q: How do you implement distributed locking? Compare Redis SETNX, Redisson, and database locks.

**A:** Distributed lock: ensures only one instance executes a critical section across multiple JVMs. Redis SETNX (SET if Not eXists): SET key value NX EX 30 — atomic, with TTL to prevent deadlock. Must generate a unique value per lock holder and only DELETE if value matches (Lua script for atomicity). Redisson: mature Java client, provides RLock with watchdog (auto-renews TTL while lock held), fair locks, read/write locks. Handles edge cases automatically. Database lock (SELECT FOR UPDATE): uses DB transaction to hold lock — simple but ties lock lifetime to DB connection. Use Redisson for production distributed locking. Database locks are fine for single-DB scenarios.

```java
// Option 1: Redis manual lock (Lua script for atomic unlock):
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
}
```

### Q: What is consistent hashing? Why is it used in distributed caches and load balancers?

**A:** Consistent hashing: a technique to distribute keys across nodes such that adding/removing a node remaps only K/N keys (K=total keys, N=nodes), instead of remapping all keys as in modular hashing. How it works: nodes and keys are placed on a virtual ring (0..2^32). A key is assigned to the first node clockwise on the ring. Virtual nodes: each physical node gets multiple positions on the ring to improve uniformity. Used in: distributed caches (Redis Cluster, Memcached), Cassandra, DynamoDB, consistent load balancers. When a node is added: only the keys between the new node and its predecessor are remapped. Minimizes cache invalidation.

```java
// Consistent hashing implementation sketch:
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
// With 150 virtual nodes each: load spreads evenly (within ~5%)
```

### Q: What is the Java Memory Model (JMM)? What are happens-before relationships?

**A:** Java Memory Model defines the rules for memory visibility between threads. Without synchronization, a thread may read stale values from CPU cache. Happens-before (HB): if action A HB action B, A\

### Q: What are the key JVM flags for production? How do you size the heap and choose a GC?

**A:** Heap sizing: -Xms and -Xmx should be equal in production (avoid resize pauses). Start with 70-75% of available RAM, leaving room for off-heap (Metaspace, native threads, NIO buffers). GC selection: G1GC (default Java 11+): balanced throughput/pause. Configure -XX:MaxGCPauseMillis=200 (target 200ms pause). ZGC (Java 15+): sub-millisecond pauses, good for latency-sensitive apps, scales to terabyte heaps. Use -XX:+UseZGC. Shenandoah: similar to ZGC, concurrent compaction. For batch/throughput apps: -XX:+UseParallelGC. GC logging: -Xlog:gc*:file=/var/log/app/gc.log:time,uptime:filecount=5,filesize=20m. Enable heap dumps: -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/.

```java
# Production JVM flags (Java 17+, G1GC):
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
# 0.0 100  73  24  97  91   3145  6.3   0     0.0    6.3
```

### Q: How do you analyze a heap dump? What are common memory leak patterns in Java?

**A:** Tools: Eclipse MAT (Memory Analyzer), VisualVM, JProfiler, YourKit, IntelliJ Profiler. Steps: 1) Generate heap dump (-XX:+HeapDumpOnOutOfMemoryError or jmap). 2) Open in MAT. 3) Check 

### Q: What is HPA? How do you configure ConfigMap and Secrets in Kubernetes for Spring Boot?

**A:** HPA (HorizontalPodAutoscaler): automatically scales the number of pods based on CPU, memory, or custom metrics (via Prometheus + KEDA). Requires metrics-server. Targets a Deployment/StatefulSet. min/max replicas, target CPU utilization. ConfigMap: stores non-secret configuration (environment variables, config files). Injected as env vars or mounted as files. Secret: like ConfigMap but base64-encoded (not truly encrypted by default — use Sealed Secrets or Vault for real encryption). Best practice: mount application.properties as a ConfigMap file, DB passwords from Secret, use Vault sidecar injector for production credentials.

```java
# HPA: scale order-service pods when CPU > 70%
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
      name: order-service-config
```

### Q: What is the difference between StatefulSet and Deployment in Kubernetes? When do you use each for Java backends?

**A:** Deployment: manages stateless pods. Pods are interchangeable — any pod can handle any request. On restart, pods get new random names. No stable storage. Use for: Spring Boot REST APIs, microservices, batch workers. StatefulSet: manages stateful pods with stable identity. Each pod has a predictable name (pod-0, pod-1), stable network identity (DNS), and its own PersistentVolumeClaim. Pods start/stop in order. Use for: databases (Postgres, MySQL), Kafka brokers, Zookeeper, Elasticsearch — anything that needs stable storage or identity. Java apps: almost always Deployment. Exception: if your Java app has local state (embedded H2, local Kafka streams store) — StatefulSet.

```java
# Deployment (stateless Spring Boot API):
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
          mountPath: /data/kafka-streams
```

### Q: What is the difference between SQS and SNS? When do you use each? What is a dead letter queue?

**A:** SQS (Simple Queue Service): point-to-point queue. One message, one consumer (or one competing consumer group). Pull-based. Two types: Standard (at-least-once, best-effort ordering) and FIFO (exactly-once, strict ordering, 300 TPS). SNS (Simple Notification Service): pub/sub topic. One message → multiple subscribers (SQS queues, Lambda, HTTP, email). Push-based fan-out. Pattern: SNS → multiple SQS queues (fan-out pattern). Dead Letter Queue (DLQ): if a message fails processing N times (maxReceiveCount), it is moved to the DLQ for investigation. Essential for preventing poison messages from blocking the queue. Configure via RedrivePolicy.

```java
// Spring Boot SQS with Spring Cloud AWS:
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
    .messageDeduplicationId(UUID.randomUUID().toString())); // idempotent
```

### Q: What is DynamoDB? When would you choose it over RDS? What is partition key design?

**A:** DynamoDB: AWS managed NoSQL key-value/document store. Millisecond latency at any scale, serverless (no provisioning), automatic scaling. Partition key: determines which partition (physical node) holds the data. Sort key: allows range queries within a partition. Must think about access patterns upfront — DynamoDB is query-pattern-driven, not schema-first. Choose DynamoDB over RDS: need >100K writes/sec, serverless cost model, simple access patterns (key lookups, range queries). Choose RDS: complex SQL joins, strong ACID guarantees across many entities, ad-hoc queries, existing SQL expertise. Bad partition key: userId for a 

### Q: What is AWS Lambda? What are cold starts and how do you minimize them for Java?

**A:** AWS Lambda: serverless, event-driven compute. You deploy a function, AWS handles servers, scaling, and availability. Triggers: API Gateway, SQS, SNS, S3, EventBridge, Kinesis. Cold start: when Lambda spins up a new container for your function — JVM initialization + Spring context startup can take 5-15 seconds for Java. Warm invocation: container reused, fast (<100ms). Minimize cold starts: use GraalVM native compilation (Spring Native) — produces a native binary that starts in <50ms. Use Quarkus or Micronaut (lighter frameworks). Use SnapStart (Lambda feature for Java): pre-initializes the JVM environment and snapshots it — effectively eliminates cold starts. Use Provisioned Concurrency: keeps containers warm at a cost.

```java
// Spring Boot Lambda with AWS Lambda Adapter:
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
}
```

### Q: How do you expose and collect metrics in Spring Boot? What is Micrometer and Prometheus?

**A:** Micrometer: application metrics facade (like SLF4J for metrics). Vendor-neutral API, implementations for Prometheus, Datadog, CloudWatch, InfluxDB. Spring Boot Actuator auto-configures Micrometer. Key meter types: Counter (monotonically increasing), Gauge (current value), Timer (duration + count), DistributionSummary (histogram). Prometheus: open-source time-series metrics DB. Scrapes (pulls) metrics from /actuator/prometheus endpoint. Grafana: dashboards on top of Prometheus. Stack: Spring Boot (Micrometer) → Prometheus scrapes /actuator/prometheus → Grafana visualizes → AlertManager sends PagerDuty alerts.

```java
// build.gradle:
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
      - targets: ['order-service:8080']
```

### Q: What is structured logging? How do you set up the ELK Stack or Loki for log aggregation?

**A:** Structured logging: logs as JSON objects instead of plain text strings. Machine-parseable, queryable by field. Use Logback with logstash-logback-encoder to output JSON. Include: timestamp, level, message, traceId, spanId, service name, custom fields. ELK Stack: Elasticsearch (search/store), Logstash (parse/transform), Kibana (visualize). Modern alternative: Grafana Loki (log aggregation) + Promtail (log shipper) — cheaper than ELK, integrates natively with Grafana. Pattern: App logs JSON to stdout → Fluentd/Promtail collects → sends to Loki/Elasticsearch → Grafana/Kibana dashboard. Correlation: include traceId in every log line to find all logs for one request.

```java
// pom.xml:
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
// {service="order-service"} |= "ERROR" | json | traceId="abc123"
```

### Q: What is Testcontainers? Why use it instead of H2 in-memory database?

**A:** Testcontainers: Java library that manages Docker containers during tests. Starts a real PostgreSQL, Redis, Kafka, etc. in a Docker container for each test run. Automatically cleans up after tests. Why not H2: H2 behaves differently from PostgreSQL (different SQL syntax, different JDBC behavior, missing features like JSONB, window functions, partial indexes). Tests passing with H2 but failing in production is a common source of bugs. Testcontainers gives you production-identical databases in tests. Works with Spring Boot via @ServiceConnection (Spring Boot 3.1+) or @DynamicPropertySource.

```java
// @ServiceConnection (Spring Boot 3.1+):
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
}
```

### Q: What is WireMock? How do you test external API calls in Spring Boot?

**A:** WireMock: HTTP mock server for testing. Stubs HTTP endpoints with defined request matchers and response bodies. Used when your service calls external APIs (payment gateway, SMS service, third-party REST API) — you don\

### Q: What are the types of ClassLoaders in Java? What is the difference between Class.forName() and ClassLoader.loadClass()?

**A:** ClassLoader hierarchy (parent-delegation model): Bootstrap ClassLoader (native, loads rt.jar/JDK core — java.lang, java.util). Extension/Platform ClassLoader (loads jre/lib/ext). Application ClassLoader (loads your classpath). Custom ClassLoader (plugin systems, OSGi, hot reload). Parent delegation: a classloader first asks its parent; loads itself only if parent fails. Prevents loading a malicious java.lang.String. Class.forName(

### Q: How does Java Reflection work? What are dynamic proxies? Compare java.lang.reflect.Proxy vs CGLIB vs ByteBuddy.

**A:** Reflection: inspect and manipulate classes, fields, methods at runtime. Use setAccessible(true) to bypass access control (break encapsulation). Used by: Spring DI, JPA (entity field injection), serialization frameworks, test frameworks. Dynamic proxies: create implementations of interfaces at runtime without writing code. java.lang.reflect.Proxy: interface-only, part of JDK. Proxy.newProxyInstance() creates an object; InvocationHandler intercepts all method calls. CGLIB: creates subclasses of concrete classes at runtime (bytecode manipulation). Spring uses CGLIB for @Configuration and class-based @Transactional proxies. ByteBuddy: modern, type-safe bytecode library. Mockito uses it. Faster than reflection.

```java
// Reflection — access private field:
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
System.out.println(dynamicClass.newInstance().toString()); // "intercepted!"
```

---

## React Topics

### Q: What is React?

**A:** React is an open-source JavaScript library developed by Meta for building user interfaces, especially for single-page applications. It allows developers to create reusable UI components.

```javascript
function App() {
  return <h1>Hello World</h1>;
}
```

### Q: What are components in React?

**A:** Components are the building blocks of a React application. They are reusable UI pieces that can be functional or class-based. They accept inputs called 

### Q: What is JSX?

**A:** JSX stands for JavaScript XML. It is a syntax extension for JavaScript that looks similar to HTML. It allows you to write HTML-like code directly in JavaScript, which is then transpiled to standard JavaScript calls (React.createElement).

```javascript
const element = <h1>Hello</h1>;
```

### Q: What is the difference between Functional and Class Components?

**A:** Functional components are plain JavaScript functions that return JSX. With Hooks (like useState, useEffect), they can manage state and lifecycle. Class components are ES6 classes that extend React.Component and have a render() method. Functional components are now the standard.

```javascript
// Functional
function A() { return <div />; }

// Class
class B extends React.Component {
  render() { return <div />; }
}
```

### Q: What is the Virtual DOM and how does it work?

**A:** The Virtual DOM is a lightweight copy of the real DOM kept in memory. When state changes, React creates a new virtual tree, compares it with the previous one (diffing), and calculates the most efficient way to update the real DOM (reconciliation).

```javascript
setCount(count + 1); // React updates only the changed part in the real DOM
```

### Q: How does React handle UI updates?

**A:** React uses declarative programming. Instead of manually manipulating the DOM, you describe the UI state, and React automatically updates the UI when the state or props change.

```javascript
{count > 0 && <p>Count is positive</p>}
```

### Q: What is State in React?

**A:** State is an object that holds information that may change over the lifetime of a component. Unlike props, state is managed within the component and is private to it. When state updates, the component re-renders.

```javascript
const [count, setCount] = useState(0);
```

### Q: What are Props in React?

**A:** Props (short for properties) are read-only inputs passed from a parent component to a child component. They allow data to flow down the component tree.

```javascript
function Greet(props) {
  return <h1>Hello {props.name}</h1>;
}
<Greet name="Ram" />
```

### Q: What is the difference between Props and State?

**A:** Props are passed to the component (similar to function parameters) and are immutable from the component

### Q: What is 'Lifting State Up'?

**A:** When multiple components need to share the same changing data, it is recommended to move the shared state up to their closest common ancestor. This ensures a single source of truth.

```javascript
// Parent.js
function Parent() {
  const [val, setVal] = useState("Hello from Parent");

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc' }}>
      <h2>Parent Component</h2>
      <p>Shared State: {val}</p>
      {/* Passing state and setter to child */}
      <Child value={val} setValue={setVal} />
    </div>
  );
}

// Child.js
function Child({ value, setValue }) {
  return (
    <div style={{ marginTop: '10px', padding: '10px', background: '#f9f9f9' }}>
      <h3>Child Component</h3>
      <input 
        value={value} 
        onChange={(e) => setValue(e.target.value)} 
        placeholder="Type to update shared state..."
      />
    </div>
  );
}
```

### Q: What are Hooks in React?

**A:** Hooks are functions that let you 

### Q: Explain the useState Hook.

**A:** useState is a Hook that lets you add React state to functional components. It returns a pair: the current state value and a function that lets you update it.

```javascript
const [count, setCount] = useState(0);
```

### Q: Explain the useEffect Hook.

**A:** useEffect lets you perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in classes.

```javascript
function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetching data
    fetch('https://api.example.com/items')
      .then(res => res.json())
      .then(result => {
        setData(result);
        setLoading(false);
      });

    // 2. Cleanup function (componentWillUnmount)
    return () => {
      console.log('Component is being unmounted, cleaning up...');
    };
  }, []); // [] = Run only on mount

  if (loading) return <p>Loading...</p>;
  return <div>{JSON.stringify(data)}</div>;
}
```

### Q: How does the dependency array in useEffect work?

**A:** The dependency array is the second argument to useEffect. If empty ([]), the effect runs once after the initial render. If it contains values ([count]), the effect runs whenever any of those values change.

```javascript
useEffect(() => {
  console.log(count);
}, [count]);
```

### Q: What is the useRef Hook used for?

**A:** useRef returns a mutable ref object whose .current property is initialized to the passed argument. It can be used to access DOM elements directly or to persist values across renders without triggering a re-render.

```javascript
// App.js
function App() {
  const inputRef = useRef();

  const handleFocus = () => {
    // 1. Direct DOM access via ref
    inputRef.current.focus();
    // 2. Manipulate style directly (sparingly!)
    inputRef.current.style.backgroundColor = "#e1f5fe";
  };

  return (
    <div>
      <input ref={inputRef} placeholder="Click button to focus me" />
      <button onClick={handleFocus}>Focus Input</button>
    </div>
  );
}
```

### Q: What is useMemo and when should you use it?

**A:** useMemo is a Hook that memoizes the result of a calculation. It only recomputes the memoized value when one of the dependencies has changed. It is used for performance optimization of expensive calculations.

```javascript
function ExpensiveCalculation({ num }) {
  // Only re-calculates if 'num' changes
  const result = useMemo(() => {
    console.log("Computing expensive result...");
    let sum = 0;
    for (let i = 0; i < 1000000; i++) sum += num;
    return sum;
  }, [num]);

  return <div>Result: {result}</div>;
}
```

### Q: What is useCallback and how does it differ from useMemo?

**A:** useCallback returns a memoized version of a callback function that only changes if one of the dependencies has changed. While useMemo memoizes a value, useCallback memoizes a function.

```javascript
// Parent.js
function ParentComponent() {
  const [count, setCount] = useState(0);

  // useCallback memoizes this function, so it's not recreated on every render.
  // This prevents the child component (memoized) from re-rendering 
  // unnecessarily when the parent renders but 'count' hasn't changed.
  const handleClick = useCallback(() => {
    console.log("Button clicked!");
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      {/* Passing memoized callback to child */}
      <MemoizedChild onAction={handleClick} />
    </div>
  );
}
```

### Q: How do you use the useContext Hook?

**A:** useContext accepts a context object (created with React.createContext) and returns the current context value for that context. It allows you to consume context without wrapping components in a Consumer.

```javascript
// 1. Create a Context
const ThemeContext = React.createContext("light");

// 2. Wrap components in a Provider
function App() {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={theme}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 3. Consume the Context with useContext Hook
function Toolbar() {
  const theme = useContext(ThemeContext);
  return (
    <div style={{ background: theme === "dark" ? "#333" : "#eee" }}>
      Current theme: {theme}
    </div>
  );
}
```

### Q: What are Custom Hooks?

**A:** Custom Hooks are JavaScript functions whose names start with 

### Q: What are the Rules of Hooks?

**A:** 1. Only call Hooks at the top level (not inside loops, conditions, or nested functions). 2. Only call Hooks from React functional components or custom Hooks.

```javascript
// ❌ Wrong
if (x) useState();

// ✅ Correct
useState();
```

### Q: Explain the React Component Lifecycle in Class Components.

**A:** Lifecycle methods in classes include: Mounting (constructor, render, componentDidMount), Updating (render, componentDidUpdate), and Unmounting (componentWillUnmount).

```javascript
componentDidMount() {
  console.log("mounted");
}
```

### Q: What is the Hook equivalent of Lifecycle methods?

**A:** useEffect covers the functionality of componentDidMount, componentDidUpdate, and componentWillUnmount. A return function inside useEffect acts as componentWillUnmount (cleanup).

```javascript
useEffect(() => {
  console.log("mounted");
  return () => console.log("unmounting");
}, []);
```

### Q: What causes a component to re-render in React?

**A:** A component re-renders when its state changes (via setState or the state updater function from useState) or when its props change.

```javascript
setCount(count + 1); // triggers re-render
```

### Q: What is Reconciliation in React?

**A:** Reconciliation is the process through which React updates the DOM. When a component

### Q: Why is the 'key' prop important in lists?

**A:** Keys help React identify which items in a list have changed, been added, or been removed. They should be stable, predictable, and unique among siblings to ensure efficient reconciliation and avoid UI bugs.

```javascript
items.map(item => <li key={item.id}>{item.name}</li>);
```

### Q: How can you optimize a React application's performance?

**A:** Optimization techniques include: Using React.memo for component memoization, useMemo and useCallback for value/function memoization, Code Splitting with React.lazy and Suspense, and avoiding unnecessary re-renders by properly managing state and props.

```javascript
const MemoComp = React.memo(Component);
```

### Q: What is React.memo?

**A:** React.memo is a higher-order component that memoizes a component. If the props are the same, React skips rendering the component and reuses the last rendered result.

```javascript
export default React.memo(MyComponent);
```

### Q: Explain Lazy Loading and Code Splitting in React.

**A:** Lazy loading is a technique where components are loaded only when they are needed. React.lazy lets you define a component that is loaded dynamically, and Suspense provides a fallback UI while loading.

```javascript
const Comp = React.lazy(() => import('./Comp'));

<Suspense fallback={<div>Loading...</div>}>
  <Comp />
</Suspense>
```

### Q: Why should you avoid using inline functions in the render method or JSX?

**A:** Defining a function inside the render method or JSX creates a new function instance on every render. This can cause unnecessary re-renders of child components that use React.memo, as the function reference changes every time.

```javascript
// ❌ Potential performance issue
<button onClick={() => doSomething()} />

// ✅ Better
<button onClick={handleClick} />
```

### Q: What is Batching in React?

**A:** Batching is when React groups multiple state updates into a single re-render for better performance. In React 18, automatic batching is enabled for all updates, including those inside promises, timeouts, and native event handlers.

```javascript
function handleClick() {
  setCount(c => c + 1);
  setFlag(f => !f);
  // React re-renders only once!
}
```

### Q: What is Prop Drilling and how can it be avoided?

**A:** Prop drilling is the process of passing data through several layers of components just to reach a deeply nested component. It can be avoided using Context API or state management libraries like Redux.

```javascript
const MyContext = React.createContext();

// Parent provides data
function App() {
  const [data, setData] = useState("important info");
  return (
    <MyContext.Provider value={data}>
      <Layout />
    </MyContext.Provider>
  );
}

// Child is not using context, but it's passed through
function Layout() {
  return <Sidebar />;
}

// Grandchild uses context directly
function Sidebar() {
  const data = useContext(MyContext);
  return <div>Data from grandparent: {data}</div>;
}
```

### Q: What is the Context API?

**A:** The Context API is a feature in React that allows you to share state globally across the component tree without having to pass props manually at every level.

```javascript
const MyContext = React.createContext();
<MyContext.Provider value="dark">
  <App />
</MyContext.Provider>
```

### Q: When should you use Redux vs Context API?

**A:** Context API is great for low-frequency updates like themes or user authentication. Redux is better suited for large-scale applications with complex state logic, frequent updates, and the need for middleware and powerful debugging tools.

```javascript
store.dispatch({ type: "ADD_TODO", payload: "Learn Redux" });
```

### Q: What is a Reducer and how does it work in Redux?

**A:** A reducer is a pure function that takes the current state and an action, and returns a new state. It describes how the state should change in response to an action.

```javascript
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    default:
      return state;
  }
}
```

### Q: What is Immutability and why is it important in React?

**A:** Immutability means that data cannot be changed after it

### Q: What is the difference between Controlled and Uncontrolled Components?

**A:** Controlled components have their state managed by React (via useState). Uncontrolled components maintain their own internal state in the DOM, and you access it using Refs.

```javascript
// Controlled
<input value={val} onChange={e => setVal(e.target.value)} />

// Uncontrolled
<input ref={inputRef} />
```

### Q: What are Higher-Order Components (HOC)?

**A:** A Higher-Order Component is a function that takes a component and returns a new component with added functionality. It

### Q: What are Render Props?

**A:** Render props is a technique for sharing code between React components using a prop whose value is a function that returns a React element.

```javascript
function DataProvider({ render }) {
  const [data, setData] = useState("Shared info!");
  return (
    <div>
      {/* Passing data to child through a function prop */}
      {render(data)}
    </div>
  );
}

// usage
<DataProvider render={(data) => <h1>Message: {data}</h1>} />
```

### Q: What are Fragments and why use them?

**A:** Fragments let you group a list of children without adding extra nodes to the DOM. This keeps the DOM clean and avoids issues with CSS layout (like flexbox).

```javascript
<>
  <ChildA />
  <ChildB />
</>
```

### Q: What is React Portal?

**A:** Portals provide a way to render children into a DOM node that exists outside the DOM hierarchy of the parent component. It

### Q: What are Error Boundaries?

**A:** Error boundaries are React components that catch JavaScript errors anywhere in their child component tree, log those errors, and display a fallback UI instead of crashing the whole app.

```javascript
class ErrorBoundary extends React.Component {
  componentDidCatch(error, info) {
    logErrorToService(error, info);
  }
  render() {
    if (this.state.hasError) return <h1>Something went wrong.</h1>;
    return this.props.children;
  }
}
```

### Q: What is React StrictMode?

**A:** StrictMode is a tool for highlighting potential problems in an application. It doesn

### Q: What is Server-Side Rendering (SSR) and Client-Side Rendering (CSR)?

**A:** CSR: The browser downloads a minimal HTML file and JavaScript, then builds the UI. SSR: The server generates the full HTML for the page and sends it to the browser, improving SEO and initial load speed.

### Q: What is Hydration in React?

**A:** Hydration is the process where React attaches event listeners to the HTML that was generated on the server (SSR), making it an interactive React application on the client.

```javascript
ReactDOM.hydrate(<App />, document.getElementById('root'));
```

### Q: What is Concurrent Rendering in React 18?

**A:** Concurrent rendering allows React to interrupt a long-running render to handle a high-priority event (like user input). It enables features like transitions and deferred updates.

```javascript
// SearchInput.js
function SearchInput() {
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleChange = (e) => {
    const value = e.target.value;
    // 1. High-priority update: the input value
    setQuery(value);

    // 2. Lower-priority update: filter the long list
    startTransition(() => {
      // expensive filtering logic...
      setFilteredList(hugeList.filter(item => item.includes(value)));
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <p>Updating list...</p>}
      {/* long list follows... */}
    </div>
  );
}
```

### Q: Build an Autocomplete component with debouncing.

**A:** An autocomplete needs an input that triggers an API call. Debouncing prevents excessive API calls by waiting for the user to stop typing.

```javascript
function Autocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (query) {
        fetch(\
```

### Q: Implement a simple Modal using state.

**A:** A modal is typically conditionally rendered based on a boolean state and uses an overlay to capture clicks outside the content.

```javascript
function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    </div>
  );
}
```

### Q: How to implement a Counter with Undo functionality?

**A:** To implement undo, you need to store the history of state values in an array. Undo removes the last element from the history.

```javascript
function Counter() {
  const [history, setHistory] = useState([0]);
  const current = history[history.length - 1];

  const increment = () => setHistory([...history, current + 1]);
  const undo = () => history.length > 1 && setHistory(history.slice(0, -1));

  return (
    <>
      <p>{current}</p>
      <button onClick={increment}>+</button>
      <button onClick={undo}>Undo</button>
    </>
  );
}
```

### Q: Build a simple Stopwatch with Start, Stop, and Reset.

**A:** A stopwatch uses setInterval to update time and clearInterval to stop it. It must clean up the interval on unmount.

```javascript
function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let id;
    if (running) {
      id = setInterval(() => setTime(t => t + 1), 1000);
    }
    return () => clearInterval(id);
  }, [running]);

  return (
    <div>
      <h1>{time}s</h1>
      <button onClick={() => setRunning(true)}>Start</button>
      <button onClick={() => setRunning(false)}>Stop</button>
      <button onClick={() => setTime(0)}>Reset</button>
    </div>
  );
}
```

