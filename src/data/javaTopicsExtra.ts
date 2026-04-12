/**
 * Extra Java interview Q&As sourced from JavaInterviewQuestions.md.
 * Merged into allJavaTopics.ts via mergeJavaInto().
 */
import { QA } from './javaTopics';

// ─── CORE JAVA ────────────────────────────────────────────────────────────────
export const coreJavaExtra: QA[] = [
  {
    question: 'Why is Composition preferred over Inheritance? (Composition vs Inheritance)',
    answer: 'Inheritance creates a rigid "is-a" relationship — changing a parent class can break all children (fragile base class). Composition uses "has-a": a class holds a reference to another class and delegates. Benefits: flexible (swap at runtime), testable (mock the dependency), no tight coupling. Rule of thumb: use inheritance only when the relationship truly is-a (Circle IS-A Shape). Use composition for everything else (Car HAS-A Engine).',
    codeExample: `// BAD: Inheritance for code reuse (not really "is-a")
class Stack extends ArrayList<String> {
    // Inherits 30+ methods we don't want exposed!
}

// GOOD: Composition
class Stack {
    private final List<String> items = new ArrayList<>();
    public void push(String item) { items.add(item); }
    public String pop() { return items.remove(items.size() - 1); }
    // Only expose what Stack should have
}

// Composition is testable — inject the dependency:
class OrderService {
    private final PaymentGateway gateway; // composed, not inherited
    public OrderService(PaymentGateway gateway) { this.gateway = gateway; }
    // In tests: pass a mock PaymentGateway
}`,
    tags: ['OOP', 'Design', 'Composition'],
  },
  {
    question: 'What is method hiding in Java? Can we override static methods?',
    answer: 'Static methods cannot be overridden — they belong to the class, not the instance. If a subclass defines a static method with the same signature, it HIDES the parent method (not polymorphic). The version called depends on the reference type at compile time, not the actual object. Instance method overriding is resolved at runtime (dynamic dispatch). This is why @Override on a static method causes a compile error.',
    codeExample: `class Parent {
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

// Rule: static → hiding (reference type decides), instance → overriding (object type decides)`,
    tags: ['OOP', 'Polymorphism', 'Static'],
  },
  {
    question: 'What is covariant return type? Can we change return type when overriding?',
    answer: 'Yes — covariant return type allows an overriding method to return a subtype of the parent\'s return type. Introduced in Java 5. The overriding method can narrow (but not widen) the return type. Common use: Builder pattern, factory methods, clone(). The compiler is satisfied because the subtype IS-A supertype. You cannot change to a completely unrelated type.',
    codeExample: `class Animal {
    public Animal create() { return new Animal(); }
    public Animal clone()  { return new Animal(); }
}

class Dog extends Animal {
    @Override
    public Dog create() { return new Dog(); } // LEGAL: Dog IS-A Animal (covariant)
    @Override
    public Dog clone()  { return new Dog(); } // LEGAL: narrowed return type
}

// Practical use in fluent builders:
class Builder {
    public Builder setName(String name) { this.name = name; return this; }
}
class SpecialBuilder extends Builder {
    @Override
    public SpecialBuilder setName(String name) { // covariant
        super.setName(name); return this;
    }
}`,
    tags: ['OOP', 'Overriding', 'Generics'],
  },
  {
    question: 'What are Marker Interfaces? Give examples and modern alternatives.',
    answer: 'A marker interface has no methods — it simply "marks" a class for special treatment by the JVM or framework. Examples: Serializable (enables Java serialization), Cloneable (enables Object.clone()), RandomAccess (tells Collections that list supports O(1) access). Modern alternative: annotations (@FunctionalInterface, @Override, custom @Deprecated). Annotations are preferred today because they can carry attributes and are processed at compile-time/runtime via reflection.',
    codeExample: `// Marker interface (legacy approach)
class User implements Serializable {
    // JVM sees Serializable, enables object-to-byte-stream conversion
    private static final long serialVersionUID = 1L;
    String name;
}

// Marker annotation (modern approach — can carry metadata)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Auditable {
    String entity() default "";
}

@Auditable(entity = "Order")
class Order { ... }

// Check at runtime:
if (Order.class.isAnnotationPresent(Auditable.class)) {
    Auditable a = Order.class.getAnnotation(Auditable.class);
    System.out.println(a.entity()); // "Order"
}`,
    tags: ['Interfaces', 'Serialization', 'Annotations'],
  },
  {
    question: 'Why use char[] instead of String for passwords?',
    answer: 'Security reason: Strings are immutable and interned in the String Pool — a password String lives in memory until GC collects it (unpredictable). During that time a heap dump or memory scrape can expose it. char[] can be explicitly zeroed out (Arrays.fill(pwd, \'\\0\')) immediately after use, minimizing the window of exposure. Additionally, String.toString() logs/prints the value; char[] does not. Java security APIs (e.g., JPasswordField.getPassword()) return char[] for this reason.',
    codeExample: `// BAD: String password stays in pool until GC
String password = "secret123";
// ... use password ...
password = null; // string may still be in pool!

// GOOD: char array, zero out immediately after use
char[] password = getPassword();
try {
    authenticate(password);
} finally {
    Arrays.fill(password, '\0'); // zero out — sensitive data gone immediately
}

// Spring Security uses char[] internally:
// PasswordEncoder.encode(CharSequence rawPassword)
// CharSequence can be a char[] wrapper`,
    tags: ['Security', 'Strings', 'Best Practices'],
  },
  {
    question: 'How do you create a custom annotation? What are @Retention and @Target?',
    answer: '@Retention controls when the annotation is available: SOURCE (discarded after compile), CLASS (stored in .class, not at runtime), RUNTIME (available via reflection at runtime — most common for frameworks). @Target restricts where the annotation can be used: TYPE, METHOD, FIELD, PARAMETER, CONSTRUCTOR, LOCAL_VARIABLE, PACKAGE. Annotations are interfaces under the hood — methods define "attributes" with defaults. Processed via reflection or annotation processors.',
    codeExample: `// Custom annotation
@Retention(RetentionPolicy.RUNTIME) // available via reflection
@Target({ElementType.METHOD, ElementType.TYPE}) // on methods or classes
public @interface RateLimit {
    int requestsPerSecond() default 100;
    String key() default "";
}

// Usage
@RateLimit(requestsPerSecond = 10, key = "user")
public Response createOrder(@RequestBody Order order) { ... }

// Processing at runtime (e.g. in an AOP aspect)
@Aspect @Component
public class RateLimitAspect {
    @Around("@annotation(rateLimit)")
    public Object enforce(ProceedingJoinPoint pjp, RateLimit rateLimit) throws Throwable {
        int limit = rateLimit.requestsPerSecond();
        if (!rateLimiter.tryAcquire(limit)) throw new TooManyRequestsException();
        return pjp.proceed();
    }
}`,
    tags: ['Annotations', 'AOP', 'Reflection'],
  },
  {
    question: 'What are ClassLoaders in Java? What are the different types?',
    answer: 'ClassLoader loads .class files into the JVM on demand (lazy). Types: 1) Bootstrap ClassLoader — written in native C++, loads core JDK classes (java.lang.*, java.util.*). 2) Platform/Extension ClassLoader — loads classes from ext directory / module path. 3) Application/System ClassLoader — loads classes from classpath (your app code). Delegation model: child always delegates to parent first (parent-first). This prevents rogue code replacing java.lang.String. You can create a custom ClassLoader by extending ClassLoader and overriding findClass().',
    codeExample: `// Check which ClassLoader loaded a class
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
System.out.println(c1 == c2); // false`,
    tags: ['JVM', 'ClassLoader', 'Internals'],
  },
  {
    question: 'What is Type Erasure in Java Generics? What is the PECS principle?',
    answer: 'Type Erasure: generic type parameters are removed by the compiler at compile time. List<String> becomes List (raw type) in bytecode. This is for backward compatibility with pre-Java-5 code. Consequence: cannot do new T[], cannot do instanceof List<String>, type info not available at runtime. PECS (Producer Extends, Consumer Super): use <? extends T> when you only READ from a collection (it produces T), use <? super T> when you only WRITE to it (it consumes T). Unbounded <?> when you do neither.',
    codeExample: `// Type Erasure — these have identical bytecode:
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
List<Object> objects = strings;  // COMPILE ERROR — not substitutable`,
    tags: ['Generics', 'Type Safety', 'Java'],
  },
  {
    question: 'What are Strong, Weak, Soft, and Phantom references in Java GC?',
    answer: 'Strong: normal reference (Object o = new Object()). GC never collects while strong reference exists. Soft: GC collects only when JVM is low on memory — ideal for memory-sensitive caches. Weak: GC collects at next cycle regardless of memory — used in WeakHashMap for cache entries that should die when key is no longer used elsewhere. Phantom: object already finalized, reference enqueued for cleanup actions. Used for post-mortem cleanup without finalize().',
    codeExample: `import java.lang.ref.*;

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
// When object is collected, phantom is enqueued — poll queue to clean up resources`,
    tags: ['GC', 'Memory', 'References'],
  },
  {
    question: 'What are Java memory areas? What is the JVM heap structure?',
    answer: 'JVM memory: Heap (all objects, GC-managed, divided into Young Gen + Old Gen), Stack (one per thread: local variables, method frames, references), Metaspace (class metadata, bytecode — native memory, Java 8+), Code Cache (JIT-compiled native code), PC Register (current instruction pointer per thread), Native Method Stack (for JNI). Heap Young Gen: Eden + S0 + S1 (Survivor). Objects start in Eden → survive minor GC → Survivor → eventually promoted to Old Gen → major/full GC.',
    codeExample: `// Heap Structure:
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
// Spring Boot Actuator: /actuator/metrics/jvm.memory.used`,
    tags: ['JVM', 'Memory', 'GC', 'Heap'],
  },
  {
    question: 'What is a Spliterator? How does it enable parallel streams?',
    answer: 'Spliterator (Splittable Iterator) is the engine behind Java Streams. It can iterate a data source sequentially OR split itself into two halves for parallel processing. When you call .parallel() on a stream, the ForkJoinPool uses the Spliterator to recursively split the work among CPU cores. Each split runs on its own thread. The split() method returns a new Spliterator covering roughly half the elements. Characteristics flags (SIZED, ORDERED, DISTINCT, etc.) help the Stream optimizer make decisions.',
    codeExample: `// Spliterator basics
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
}`,
    tags: ['Streams', 'Parallel', 'Java 8'],
  },
];

// ─── COLLECTIONS ──────────────────────────────────────────────────────────────
export const collectionsExtra: QA[] = [
  {
    question: 'How do you make an ArrayList immutable or synchronized?',
    answer: 'Immutable: Collections.unmodifiableList(list) — wraps the list; any mutating call throws UnsupportedOperationException. Note: the underlying list is still mutable through the original reference. Truly immutable: List.of() or List.copyOf() (Java 9+). Synchronized: Collections.synchronizedList(list) — wraps with mutex on every method. Better: CopyOnWriteArrayList for read-heavy concurrent access (writes make a copy, reads always safe). final ArrayList only prevents reassigning the variable — the list contents can still change.',
    codeExample: `// Unmodifiable wrapper (Java 5+)
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
List<String> cow = new CopyOnWriteArrayList<>(List.of("a","b"));`,
    tags: ['Collections', 'Thread Safety', 'Immutability'],
  },
  {
    question: 'What changed in HashMap in Java 8? What is IdentityHashMap?',
    answer: 'Java 8 HashMap changes: 1) Bucket linked list → Red-Black Tree when chain length > 8 (treeifyBin). This prevents O(n) worst case from hash collisions (hash DoS attacks), giving O(log n). Tree reverts to list when shrinks below 6. 2) Internal hash() function improved with bit-spreading. IdentityHashMap: uses == (reference equality) instead of .equals() for key comparison, and System.identityHashCode() instead of hashCode(). Use case: serialization graphs (track which exact objects were seen, not which equal objects), interning caches, object graph traversal.',
    codeExample: `// Java 8 HashMap: treeification
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
IdentityHashMap<Object, Boolean> visited = new IdentityHashMap<>();`,
    tags: ['HashMap', 'Java 8', 'Collections'],
  },
  {
    question: 'What is Map.Entry and how do you iterate a Map efficiently?',
    answer: 'Map.Entry<K,V> is a nested interface inside Map representing a key-value pair. entrySet() returns Set<Map.Entry<K,V>> — iterating it gives access to both key and value in one step (most efficient). Alternatives: keySet() then get(key) — inefficient (two lookups), values() — no key access. Since Java 8: forEach(BiConsumer) is the cleanest. replaceAll(BiFunction) and compute/merge operations work on entries directly.',
    codeExample: `Map<String, Integer> scores = Map.of("Alice", 95, "Bob", 87, "Carol", 92);

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
groups.computeIfAbsent("admin", k -> new ArrayList<>()).add("Alice");`,
    tags: ['Map', 'Collections', 'Iteration'],
  },
  {
    question: 'What happens if Collections.sort() receives a list with null elements?',
    answer: 'Collections.sort() will throw NullPointerException because null cannot be compared using the natural ordering (compareTo) or a Comparator that doesn\'t handle null. Solutions: 1) Comparator.nullsFirst() or nullsLast() — wraps any comparator to handle nulls. 2) Pre-filter nulls before sorting. 3) Write a null-safe comparator. Similarly, TreeMap/TreeSet throw NPE if a null key is inserted unless a custom Comparator handles null.',
    codeExample: `List<String> list = Arrays.asList("banana", null, "apple", "cherry", null);

// THROWS NullPointerException:
// Collections.sort(list);

// SAFE: use Comparator.nullsFirst or nullsLast
list.sort(Comparator.nullsFirst(Comparator.naturalOrder()));
System.out.println(list); // [null, null, apple, banana, cherry]

list.sort(Comparator.nullsLast(String::compareToIgnoreCase));
System.out.println(list); // [apple, banana, cherry, null, null]

// Custom null-safe comparator
Comparator<String> safeComp = (a, b) -> {
    if (a == null && b == null) return 0;
    if (a == null) return 1;  // nulls last
    if (b == null) return -1;
    return a.compareTo(b);
};

// Stream version:
list.stream()
    .filter(Objects::nonNull)  // remove nulls first
    .sorted()
    .collect(Collectors.toList());`,
    tags: ['Collections', 'Sorting', 'Null Safety'],
  },
  {
    question: 'ConcurrentHashMap internal working: how does it differ from HashMap?',
    answer: 'Java 8 ConcurrentHashMap: no global lock. Reads are lock-free (volatile nodes). Writes lock only the specific bucket (one node) using synchronized + CAS (Compare-And-Swap). This allows true parallelism for different buckets. computeIfAbsent, putIfAbsent are atomic. Null keys/values are NOT allowed (unlike HashMap). Size via mappingCount() (returns long). Java 7 used segment-level locking (16 segments); Java 8 uses per-bucket locking with CAS for much finer granularity.',
    codeExample: `ConcurrentHashMap<String, Integer> map = new ConcurrentHashMap<>();

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
long count = map.mappingCount(); // long (handles > Integer.MAX_VALUE entries)`,
    tags: ['ConcurrentHashMap', 'Concurrency', 'Thread Safety'],
  },
];

// ─── THREADING / CONCURRENCY ──────────────────────────────────────────────────
export const threadingExtra: QA[] = [
  {
    question: 'How do you ensure threads run in order T1 → T2 → T3?',
    answer: 'Option 1: Thread.join() — T1.start(), T1.join() (waits for T1), T2.start(), T2.join(), T3.start(). Simple but blocks the calling thread. Option 2: CountDownLatch — T1 counts down after completion; T2 awaits the latch before starting. Option 3: Single-thread ExecutorService — submit tasks to a single-thread executor; they execute in submission order. Option 4: CompletableFuture.thenRun() chain — most modern and elegant, non-blocking.',
    codeExample: `// Option 1: join() — simplest
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
    .join();`,
    tags: ['Threading', 'CountDownLatch', 'CompletableFuture'],
  },
  {
    question: 'CountDownLatch vs CyclicBarrier: when to use each?',
    answer: 'CountDownLatch: one-time gate. A thread awaits until count reaches 0 (others call countDown()). Count can only go down, never reset. Use for "wait for N tasks to complete before continuing" (e.g. wait for 5 services to initialize). CyclicBarrier: all threads wait at the barrier until ALL have arrived, then they continue together. Can be reset and reused (cyclic). Has an optional barrier action that runs when all parties arrive. Use for "rendezvous point" in iterative parallel algorithms.',
    codeExample: `// CountDownLatch: main waits for 3 worker threads
CountDownLatch latch = new CountDownLatch(3);
for (int i = 0; i < 3; i++) {
    int id = i;
    new Thread(() -> {
        loadData(id);
        latch.countDown(); // signal done
    }).start();
}
latch.await(); // main blocks until all 3 workers done
System.out.println("All data loaded");

// CyclicBarrier: 3 threads compute in phases, sync between phases
CyclicBarrier barrier = new CyclicBarrier(3, () ->
    System.out.println("--- Phase complete, all threads synced ---"));
for (int i = 0; i < 3; i++) {
    new Thread(() -> {
        computePhase1();
        barrier.await(); // wait for all threads to reach this point
        computePhase2(); // all start phase2 together
        barrier.await(); // reusable — can sync again
    }).start();
}`,
    tags: ['Threading', 'CountDownLatch', 'CyclicBarrier'],
  },
  {
    question: 'What are use cases for ThreadLocal? What are the risks?',
    answer: 'ThreadLocal<T> provides a per-thread variable — each thread has its own isolated copy. Changes in one thread are invisible to others. Use cases: 1) Request context (Spring stores SecurityContext, transaction context per thread). 2) SimpleDateFormat (not thread-safe — give each thread its own copy). 3) Database connection per thread. Risks: Memory leaks in thread pools — threads are reused, old ThreadLocal values persist unless explicitly removed. Rule: always call remove() in a finally block after use.',
    codeExample: `// SimpleDateFormat: NOT thread-safe — use ThreadLocal
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
// If remove() is not called, ThreadLocal value survives to next request.`,
    tags: ['Threading', 'ThreadLocal', 'Spring'],
  },
  {
    question: 'Optimistic vs Pessimistic Locking: when to use each?',
    answer: 'Pessimistic Locking: assume conflicts will happen; lock the resource immediately (SELECT FOR UPDATE in SQL, synchronized in Java). Safe but reduces concurrency — other threads/transactions block until lock released. Good for high-contention scenarios. Optimistic Locking: assume conflicts are rare; don\'t lock — read freely. Before writing, check if data changed (version column). If changed, throw OptimisticLockException and retry. Good for read-heavy, low-contention scenarios. JPA supports both: @Lock for pessimistic, @Version for optimistic.',
    codeExample: `// Pessimistic locking in JPA
@Lock(LockModeType.PESSIMISTIC_WRITE)
@Query("SELECT o FROM Order o WHERE o.id = :id")
Optional<Order> findByIdForUpdate(@Param("id") Long id);
// Generates: SELECT * FROM orders WHERE id=? FOR UPDATE

// Optimistic locking in JPA: @Version column
@Entity
public class Product {
    @Id Long id;
    int stock;
    @Version int version; // auto-incremented on each update
}
// JPA adds: UPDATE product SET stock=?, version=? WHERE id=? AND version=?
// If version mismatch → throws OptimisticLockException → retry

// Java synchronized (pessimistic):
synchronized (account) { account.debit(amount); }

// Java StampedLock with optimistic read (Java 8):
StampedLock lock = new StampedLock();
long stamp = lock.tryOptimisticRead(); // no lock!
double x = point.x, y = point.y;
if (!lock.validate(stamp)) { // check if write occurred
    stamp = lock.readLock(); // fall back to real read lock
    try { x = point.x; y = point.y; } finally { lock.unlockRead(stamp); }
}`,
    tags: ['Locking', 'JPA', 'Concurrency'],
  },
  {
    question: 'How does the Fork/Join framework work? How is it different from thread pools?',
    answer: 'Fork/Join (java.util.concurrent.ForkJoinPool): designed for divide-and-conquer tasks. A task can fork() itself into sub-tasks, then join() their results. Key feature: work-stealing — idle threads steal tasks from busy threads\' queues (LIFO stealing), improving CPU utilization. ForkJoinPool uses a fixed pool of daemon threads (default = CPU cores). Better than ThreadPoolExecutor for recursive/tree problems. Used internally by parallel streams. Overhead: task creation overhead means Fork/Join is NOT better for simple flat parallel tasks.',
    codeExample: `// ForkJoinTask: parallel sum of array
class SumTask extends RecursiveTask<Long> {
    private final int[] arr;
    private final int lo, hi;
    private static final int THRESHOLD = 1000;

    SumTask(int[] arr, int lo, int hi) {
        this.arr = arr; this.lo = lo; this.hi = hi;
    }

    @Override
    protected Long compute() {
        if (hi - lo <= THRESHOLD) {  // base case: compute directly
            long sum = 0;
            for (int i = lo; i < hi; i++) sum += arr[i];
            return sum;
        }
        int mid = (lo + hi) / 2;
        SumTask left  = new SumTask(arr, lo, mid);
        SumTask right = new SumTask(arr, mid, hi);
        left.fork();              // run left asynchronously
        long rightResult = right.compute(); // run right in current thread
        long leftResult  = left.join();     // wait for left
        return leftResult + rightResult;
    }
}

ForkJoinPool pool = new ForkJoinPool();
long total = pool.invoke(new SumTask(array, 0, array.length));

// Parallel streams use the common ForkJoinPool automatically:
long total2 = IntStream.of(array).parallel().asLongStream().sum();`,
    tags: ['Fork/Join', 'Parallelism', 'Concurrency'],
  },
];

// ─── JAVA 8+ / FUNCTIONAL ─────────────────────────────────────────────────────
export const java8Extra: QA[] = [
  {
    question: 'What is the difference between peek() and map() in streams? When is peek() dangerous?',
    answer: 'map() is a transforming intermediate operation — it returns a new stream of transformed elements. peek() is a "spy" intermediate operation — it performs a side effect on each element WITHOUT changing the element. Danger: peek() is only invoked when a terminal operation is actually executed (lazy). Using peek() for debugging is fine; using it for critical side effects (e.g. saving to DB) is dangerous because lazy evaluation may skip it if the terminal op short-circuits (e.g. findFirst, anyMatch). Always use forEach for side effects.',
    codeExample: `List<String> names = List.of("alice", "bob", "charlie");

// peek(): inspect elements as they flow through (debugging)
List<String> result = names.stream()
    .peek(s -> System.out.println("Before: " + s))     // side effect, same element
    .map(String::toUpperCase)                            // transformation
    .peek(s -> System.out.println("After: " + s))       // after map
    .collect(Collectors.toList());
// Output: Before: alice → After: ALICE → Before: bob → etc.

// DANGEROUS: peek with short-circuiting terminal
names.stream()
    .peek(s -> saveToDatabase(s))   // NOT safe! may not run for all elements
    .filter(s -> s.length() > 3)
    .findFirst();  // stops after first match — saveToDatabase not called for all!

// SAFE: forEach for side effects
names.stream()
    .filter(s -> s.length() > 3)
    .forEach(s -> saveToDatabase(s)); // guaranteed to run for all filtered elements`,
    tags: ['Streams', 'peek', 'Functional'],
  },
  {
    question: 'BiFunction, BiConsumer, BiPredicate vs their single-parameter counterparts?',
    answer: 'Single-parameter: Function<T,R> (T→R), Consumer<T> (T→void), Predicate<T> (T→boolean). Bi-variants accept TWO inputs: BiFunction<T,U,R> (T,U→R), BiConsumer<T,U> (T,U→void), BiPredicate<T,U> (T,U→boolean). Use when your logic naturally takes two inputs (e.g. key-value pair, comparison). Collectors.toMap, Map.forEach use BiFunction/BiConsumer under the hood. There are no Tri* variants in standard API — use custom functional interfaces or tuples.',
    codeExample: `// BiFunction<T,U,R>: takes two inputs, returns result
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
    ));`,
    tags: ['Functional', 'Streams', 'Java 8'],
  },
  {
    question: 'Optional.map() vs Optional.flatMap(): why do we need flatMap?',
    answer: 'Optional.map() transforms the value inside an Optional — wraps the result in Optional. If the mapping function itself returns an Optional<T>, you get Optional<Optional<T>> (nested). Optional.flatMap() "flattens" this: the mapping function returns Optional<T> and flatMap unwraps one layer, giving Optional<T>. Rule: use map when your function returns a plain value; use flatMap when your function returns an Optional (to avoid nesting). Same concept as Stream.flatMap.',
    codeExample: `class User {
    String name;
    Optional<Address> getAddress() { return Optional.ofNullable(address); }
}
class Address {
    Optional<String> getCity() { return Optional.ofNullable(city); }
}

Optional<User> user = Optional.of(new User());

// map: wraps result → Optional<Optional<String>> (WRONG — double wrapped)
Optional<Optional<String>> nested = user
    .map(u -> u.getAddress())   // returns Optional<Address>
    .map(a -> a.flatMap(Address::getCity)); // messy

// flatMap: unwraps → Optional<String> (CORRECT)
Optional<String> city = user
    .flatMap(User::getAddress)   // Optional<Address>
    .flatMap(Address::getCity);  // Optional<String>

String result = city.orElse("Unknown city");

// Simpler example:
Optional<String> name = Optional.of("  alice  ");
Optional<String> trimmed = name.map(String::trim);           // Optional<String> - fine
Optional<String> upper = name.flatMap(s ->
    Optional.ofNullable(s.trim().isEmpty() ? null : s.trim().toUpperCase())); // flattens`,
    tags: ['Optional', 'Functional', 'Java 8'],
  },
  {
    question: 'What are method references (::)? When to prefer them over lambdas?',
    answer: 'Method references are shorthand for lambdas that do nothing but call an existing method. Four types: 1) Static: ClassName::staticMethod (e.g. Integer::parseInt). 2) Instance on specific instance: instance::method (e.g. System.out::println). 3) Instance on arbitrary instance of type: ClassName::instanceMethod (e.g. String::toUpperCase). 4) Constructor: ClassName::new (e.g. ArrayList::new). Prefer method references when the lambda just delegates to a single method — they are more readable and can be more performant (no extra lambda wrapper in some JITs).',
    codeExample: `// 1. Static method reference
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
    .collect(Collectors.toList());`,
    tags: ['Method References', 'Functional', 'Java 8'],
  },
];

// ─── SPRING BOOT / SPRING MVC ─────────────────────────────────────────────────
export const springBootExtra: QA[] = [
  {
    question: 'What is the difference between POJO, DTO, Entity, Bean, and Repository?',
    answer: 'POJO (Plain Old Java Object): any ordinary Java class with no framework constraints. DTO (Data Transfer Object): a POJO used specifically to transfer data between layers (no business logic). Entity: a POJO mapped to a database table (@Entity in JPA). Bean: a Spring-managed object (created and wired by Spring container). Repository: a data-access layer component (@Repository), abstracts DB operations. Hierarchy: all are POJOs; Entity, DTO, Bean are specializations for specific roles.',
    codeExample: `// Entity: maps to DB table
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
}`,
    tags: ['Spring', 'Architecture', 'DI'],
  },
  {
    question: 'What is the difference between @Component and @Bean?',
    answer: '@Component: class-level annotation. Spring auto-detects via component scanning. You define the class; Spring instantiates it. @Bean: method-level annotation inside a @Configuration class. You write the instantiation code (return new X()). Use @Component for your own classes. Use @Bean when you need to configure a third-party class you cannot annotate (e.g. Jackson ObjectMapper, RestTemplate), or when you need conditional/custom instantiation logic.',
    codeExample: `// @Component: Spring creates it, you don't control instantiation
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
// (within @Configuration class) and get the same singleton instance`,
    tags: ['Spring', 'Beans', 'DI'],
  },
  {
    question: 'What is DispatcherServlet? What is the complete Spring MVC request flow?',
    answer: 'DispatcherServlet is the Front Controller in Spring MVC — a single servlet that handles ALL incoming HTTP requests. Flow: 1) Request arrives at DispatcherServlet. 2) HandlerMapping maps URL to Controller method. 3) HandlerAdapter invokes the method. 4) Controller returns ModelAndView or @ResponseBody data. 5) ViewResolver resolves view name (if not @RestController). 6) View renders response. With @RestController, step 5-6 are replaced by MessageConverter (Jackson) serializing to JSON directly.',
    codeExample: `// Spring MVC request flow (simplified):
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
// Interceptors: inside Spring context (authentication, metrics)`,
    tags: ['Spring MVC', 'DispatcherServlet', 'Architecture'],
  },
  {
    question: 'What are idempotent HTTP methods? Common HTTP status codes?',
    answer: 'Idempotent: calling the method multiple times has the same result as calling it once. GET, PUT, DELETE, HEAD, OPTIONS are idempotent. POST is NOT idempotent (each call creates a new resource). PATCH is NOT guaranteed to be idempotent. Safe methods (no side effects): GET, HEAD, OPTIONS. Key status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized (not authenticated), 403 Forbidden (authenticated but no permission), 404 Not Found, 409 Conflict, 422 Unprocessable Entity (validation), 429 Too Many Requests, 500 Internal Server Error, 503 Service Unavailable.',
    codeExample: `// Idempotency examples:
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
}`,
    tags: ['REST', 'HTTP', 'Spring Boot'],
  },
  {
    question: 'What is @Transactional propagation? What happens when one @Transactional method calls another?',
    answer: 'Propagation defines how transactions behave when a transactional method is called from within another transaction. REQUIRED (default): join existing transaction or create new one. REQUIRES_NEW: always suspend existing, create new transaction. NESTED: create save-point within existing transaction (can rollback to save-point without rolling back outer). SUPPORTS: join if exists, no transaction if not. NOT_SUPPORTED: suspend existing, run without transaction. NEVER: throw exception if transaction exists. Important: self-invocation bypasses the proxy — calling @Transactional from within the same class does NOT start a new transaction.',
    codeExample: `@Service
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
}`,
    tags: ['Spring', 'Transactions', '@Transactional'],
  },
  {
    question: 'Servlet Filter vs Spring Interceptor: what is the difference?',
    answer: 'Filter (javax.servlet.Filter): runs BEFORE DispatcherServlet at the Servlet container level. Has access to raw HttpServletRequest/Response. Cannot access Spring context/beans easily. Use for: authentication, CORS, request logging, compression, encoding. Interceptor (HandlerInterceptor): runs INSIDE Spring\'s DispatcherServlet AFTER routing. Has access to Spring context, handler method, ModelAndView. Three hooks: preHandle (before controller), postHandle (after controller, before view), afterCompletion (after view rendered). Use for: authorization checks, performance monitoring, setting user context.',
    codeExample: `// Filter (runs BEFORE DispatcherServlet — very early)
@Component
public class CorrelationIdFilter implements Filter {
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        ((HttpServletRequest) req).setAttribute("traceId", UUID.randomUUID().toString());
        chain.doFilter(req, res);
    }
}

// Interceptor (runs INSIDE Spring, knows about handler)
@Component
public class AuthInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest req, HttpServletResponse res,
                             Object handler) {
        String token = req.getHeader("Authorization");
        if (!isValid(token)) {
            res.setStatus(401);
            return false; // short-circuit — controller not invoked
        }
        return true; // continue to controller
    }
}

// Register interceptor:
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(authInterceptor).addPathPatterns("/api/**");
    }
}`,
    tags: ['Spring MVC', 'Filter', 'Interceptor'],
  },
];

// ─── JPA / HIBERNATE ──────────────────────────────────────────────────────────
export const springDataExtra: QA[] = [
  {
    question: 'What is first-level vs second-level cache in Hibernate?',
    answer: 'First-level cache (L1): Session-scoped, enabled by default, cannot be disabled. Within a single Session, the same entity is returned from cache on repeated load calls (no extra DB queries). Cleared when Session closes. Second-level cache (L2): SessionFactory-scoped, shared across Sessions, opt-in. Configured per entity with @Cache. Providers: EhCache, Infinispan, Redis. Useful for frequently read, rarely changed reference data. Query cache: caches query result sets (entity IDs) — useful with L2 entity cache.',
    codeExample: `// First-level cache (automatic):
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
List<User> findByRole(@Param("role") String role);`,
    tags: ['Hibernate', 'Cache', 'Performance'],
  },
  {
    question: 'What are entity inheritance strategies in Hibernate?',
    answer: 'SINGLE_TABLE (default): all subclasses in one table with a discriminator column. Best performance (single join), but table has many nullable columns. TABLE_PER_CLASS: each concrete class has its own table with all fields. Good for polymorphic queries over individual types; poor for polymorphic queries over the hierarchy (UNION). JOINED: parent fields in parent table, child-specific fields in child table. Normalized, no nulls, but requires JOIN on every query. Choose: SINGLE_TABLE for performance, JOINED for normalization, TABLE_PER_CLASS for independent entities.',
    codeExample: `// SINGLE_TABLE (fastest queries)
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
// SELECT joins both tables on every query`,
    tags: ['Hibernate', 'JPA', 'Inheritance'],
  },
  {
    question: 'What is hbm2ddl.auto? What are the options and when to use each?',
    answer: 'spring.jpa.hibernate.ddl-auto (hbm2ddl.auto) controls schema generation on startup. Options: create — drop and recreate schema every startup (wipes data). create-drop — create on start, drop on shutdown (for tests). update — alter existing schema to match entities (additive only, risky in prod). validate — validate schema matches entities, throw error if mismatch (safe for prod). none — do nothing (use Flyway/Liquibase for migrations). Best practice: none or validate in production with Flyway/Liquibase for versioned migrations.',
    codeExample: `# application.properties — environment-specific settings:

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
# - Data type changes may fail silently`,
    tags: ['Hibernate', 'Database', 'Configuration'],
  },
  {
    question: 'What is the difference between save(), persist(), saveOrUpdate(), and merge() in Hibernate?',
    answer: 'persist(): JPA standard, inserts new entity, must be in transaction, does not return anything, entity must be Transient. save(): Hibernate-specific, inserts entity, returns generated ID immediately, can work outside transaction (but not recommended). saveOrUpdate(): Hibernate-specific, inserts if new, updates if detached. merge(): JPA standard, copies detached entity state to a managed entity and returns the managed copy. Use merge() for updating detached entities (e.g. loaded in one session, modified, reattached in another). In Spring Data JPA: save() intelligently calls persist() for new entities and merge() for existing ones (checks if ID is null or present in DB).',
    codeExample: `// Spring Data JpaRepository.save():
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
System.out.println("Created user ID: " + id);`,
    tags: ['Hibernate', 'JPA', 'Persistence'],
  },
];

// ─── MESSAGING / KAFKA ────────────────────────────────────────────────────────
export const messagingExtra: QA[] = [
  {
    question: 'What is Apache Kafka? How does it achieve high throughput?',
    answer: 'Kafka is a distributed event streaming platform — a durable, ordered, append-only log. Key concepts: Topic (named log), Partition (horizontal scaling unit, ordered), Broker (server holding partitions), Consumer Group (parallel consumers, each partition consumed by one member per group), Offset (position in partition). High throughput mechanisms: 1) Sequential disk writes (append-only log — faster than random writes). 2) Zero-copy via sendfile() syscall — data moves from disk to network without CPU copying. 3) Batching messages. 4) Compression (Snappy/LZ4). 5) Consumer pull model (controls pace).',
    codeExample: `// Spring Kafka producer
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
# spring.kafka.consumer.enable-auto-commit=false  # manual ack`,
    tags: ['Kafka', 'Messaging', 'Microservices'],
  },
  {
    question: 'Kafka vs RabbitMQ vs ActiveMQ: when to use each?',
    answer: 'Kafka: distributed log, messages persisted and replayable, very high throughput (millions/sec), pull-based consumers, strong ordering per partition. Use for: event sourcing, audit logs, stream processing, large-scale event pipelines. RabbitMQ: traditional message broker, AMQP protocol, push-based, complex routing (fanout/topic/direct exchanges), messages deleted after consumption, lower throughput. Use for: task queues, request/reply patterns, complex routing logic, microservice decoupling. ActiveMQ: mature JMS broker, supports JMS API, good for legacy Java enterprise. Use when: existing JMS-based code, Spring/JEE integration.',
    codeExample: `// When to choose:
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
// "I have legacy JMS code" → ActiveMQ`,
    tags: ['Kafka', 'RabbitMQ', 'ActiveMQ', 'Messaging'],
  },
  {
    question: 'What is an idempotent Kafka producer? How do you handle consumer lag?',
    answer: 'Idempotent producer (enable.idempotence=true): Kafka assigns a producer ID + sequence number to each message. Broker deduplicates messages with the same sequence number — exactly-once delivery semantics per partition even on retries. Prevents duplicate records from producer retries. Consumer lag: the difference between the latest offset in a partition and the consumer\'s current offset. Causes: slow processing, not enough consumer instances, GC pauses. Debug: check kafka-consumer-groups.sh --describe, or monitor via Grafana/Prometheus.',
    codeExample: `# Idempotent producer config (application.yml):
spring:
  kafka:
    producer:
      enable-idempotence: true  # deduplication via sequence numbers
      acks: all                 # wait for all in-sync replicas
      retries: 2147483647       # retry indefinitely
      max-in-flight-requests-per-connection: 5 # max 5 with idempotence

# Debugging consumer lag:
# kafka-consumer-groups.sh --bootstrap-server localhost:9092 \
#   --group my-group --describe
# Output shows: PARTITION | CURRENT-OFFSET | LOG-END-OFFSET | LAG

# Solutions for consumer lag:
# 1. Add more consumers (up to partition count)
# 2. Increase partition count (more parallelism)
# 3. Optimize consumer processing (async, batching)
# 4. Increase consumer poll timeout and max.poll.records
# 5. Scale consumer instances horizontally

spring:
  kafka:
    consumer:
      max-poll-records: 500        # process up to 500 records per poll
      fetch-min-size: 1            # wait for at least 1 byte
      fetch-max-wait: 500          # ms to wait for fetch-min-size`,
    tags: ['Kafka', 'Idempotent', 'Consumer Lag'],
  },
];

// ─── MICROSERVICES EXTRA ──────────────────────────────────────────────────────
export const microservicesExtra: QA[] = [
  {
    question: 'What is BFF (Backend For Frontend)? What is the difference between Forward and Reverse Proxy?',
    answer: 'BFF: a dedicated backend service per client type (mobile BFF, web BFF, third-party BFF). Each BFF aggregates microservice calls and shapes the response to exactly what its frontend needs. Avoids one-size-fits-all API. Forward Proxy: sits in front of CLIENTS — client sends all requests through the proxy. The server does not know the client\'s real IP. Use for: corporate firewalls, caching, VPNs, anonymity. Reverse Proxy: sits in front of SERVERS — clients send requests to the proxy which forwards to backend servers. The client doesn\'t know which backend handled it. Use for: load balancing, SSL termination, rate limiting, API gateway.',
    codeExample: `// BFF Pattern:
// Mobile App → Mobile BFF → [UserService, OrderService, ProductService]
// Web App    → Web BFF    → [UserService, OrderService, ProductService]
// Each BFF shapes its own response payload

// Mobile BFF endpoint (aggregates 3 services)
@GetMapping("/mobile/dashboard/{userId}")
public MobileDashboard getDashboard(@PathVariable Long userId) {
    var user    = userClient.getUser(userId);
    var orders  = orderClient.getRecentOrders(userId, 3); // fewer for mobile
    var balance = walletClient.getBalance(userId);
    // Mobile-specific DTO: compact, fewer fields
    return new MobileDashboard(user.name(), orders, balance);
}

// Forward Proxy (client-side):
// Client → Proxy → Internet → Server
// Server sees proxy IP, not client IP

// Reverse Proxy (server-side) — Nginx example:
// Client → Nginx (Reverse Proxy) → Spring Boot 1 / Spring Boot 2
// Client sees only nginx, doesn't know about backend instances

// API Gateway is a specialized Reverse Proxy with:
// + Authentication, + Rate Limiting, + Request transformation`,
    tags: ['Microservices', 'BFF', 'API Gateway', 'Proxy'],
  },
  {
    question: 'How do you ensure security in a microservices architecture?',
    answer: 'Layered security: 1) Edge Security — API Gateway handles TLS termination, OAuth2/JWT validation, rate limiting, IP filtering. 2) Service-to-Service Auth — mTLS (mutual TLS) or JWT tokens between services (zero-trust network). 3) Service Mesh (Istio/Linkerd) — automates mTLS, traffic policies, certificate rotation. 4) Secrets Management — AWS Secrets Manager, HashiCorp Vault — never hardcode credentials. 5) Least Privilege — each service has its own DB credentials, IAM role with minimal permissions. 6) Input Validation — validate at each service boundary. 7) Audit Logging — centralize all auth events.',
    codeExample: `// 1. Gateway-level security (Spring Cloud Gateway):
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
// spring.cloud.vault.token=\${VAULT_TOKEN}`,
    tags: ['Security', 'Microservices', 'JWT', 'mTLS'],
  },
];

// ─── ENUMS ────────────────────────────────────────────────────────────────────
export const enumsExtra: QA[] = [
  {
    question: 'What is an enum in Java? How are enums handled internally?',
    answer: 'An enum is a special class where instances are pre-defined constants. Internally, each enum constant is a public static final instance of the enum class. The compiler generates: a private constructor, values() method (returns array of all constants), valueOf(String) method. Enums implicitly extend java.lang.Enum — so they CANNOT extend another class (but can implement interfaces). Enums are singletons by JVM class loading guarantee — safe for Singleton pattern. Can have fields, methods, abstract methods (each constant overrides). Useful in switch expressions (Java 14+).',
    codeExample: `// Basic enum with behavior
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
for (DayType type : DayType.values()) { System.out.println(type.getDescription()); }`,
    tags: ['Enum', 'Design Patterns', 'Java'],
  },
];

// ─── EXCEPTION HANDLING ───────────────────────────────────────────────────────
export const exceptionHandlingExtra: QA[] = [
  {
    question: 'Checked vs unchecked exceptions. Can a constructor, static block, or finally throw exceptions?',
    answer: 'Checked exceptions (extends Exception): compiler forces you to handle or declare them with throws. Use for recoverable conditions (IOException, SQLException). Unchecked (extends RuntimeException): no compiler enforcement. Use for programming errors (NullPointerException, IllegalArgumentException). Constructors: CAN throw checked exceptions (declared in throws clause). Static blocks: CAN throw UNCHECKED exceptions (checked exceptions must be caught within the block). Finally: CAN throw exceptions, BUT this will suppress any exception from the try/catch block (dangerous pattern). try-with-resources wraps resource.close() exceptions as Suppressed.',
    codeExample: `// Constructor throwing checked exception
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
}`,
    tags: ['Exceptions', 'Java', 'Best Practices'],
  },
  {
    question: 'What are Suppressed Exceptions? How does try-with-resources handle them?',
    answer: 'Suppressed exceptions occur when a second exception is thrown while handling the first (typically in finally blocks or resource closing). Before Java 7, the original exception was silently lost. try-with-resources: automatically calls close() on resources in reverse order of declaration. If close() throws AND the try block also threw, the close() exception is added as a Suppressed exception on the primary exception. Access via Throwable.getSuppressed(). You can also manually add suppressed exceptions with addSuppressed().',
    codeExample: `// Manual suppression pattern (pre-Java 7 style)
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
}`,
    tags: ['Exceptions', 'try-with-resources', 'Java 7'],
  },
];
