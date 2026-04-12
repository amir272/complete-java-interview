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
      {
        question: 'What is the contract between equals() and hashCode()? Why must you override both?',
        answer: 'The contract: if a.equals(b) is true, then a.hashCode() MUST equal b.hashCode(). The reverse is NOT required — same hash code does not mean equal (that is a collision). Hash-based collections (HashMap, HashSet) use hashCode() to find the bucket, then equals() to find the exact key. If you override equals() but not hashCode(), two "equal" objects land in different buckets and the collection breaks.',
        codeExample: `@Override
public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    User user = (User) o;
    return id == user.id && Objects.equals(name, user.name);
}

@Override
public int hashCode() {
    return Objects.hash(id, name); // uses prime multiplier 31
}
// Gotcha: never use mutable fields — changing a field after
// putting object in HashMap makes it unretrievable!`,
        tags: ['OOP', 'HashMap', 'Fundamentals'],
      },
      {
        question: 'Java 8 memory change: PermGen → Metaspace. What changed and why?',
        answer: 'PermGen (Java 7 and below): fixed-size portion of Java Heap storing class metadata. Caused frequent OutOfMemoryError: PermGen space. Metaspace (Java 8+): uses native OS memory, auto-resizable by default. JVM flags changed: -XX:MaxPermSize → -XX:MaxMetaspaceSize. Static variables and String literals moved to main Heap (actually from Java 7). Metaspace stores: class metadata, bytecode, constant pool, annotations.',
        codeExample: `// Old JVM flags (now ignored in Java 8+):
// -XX:PermSize=256m -XX:MaxPermSize=512m

// New Metaspace flags:
// -XX:MetaspaceSize=256m     (initial, triggers GC when reached)
// -XX:MaxMetaspaceSize=512m  (cap to prevent consuming all RAM)

// Error changed from:
// java.lang.OutOfMemoryError: PermGen space
// to:
// java.lang.OutOfMemoryError: Metaspace`,
        tags: ['JVM', 'Memory', 'Java 8'],
      },
      {
        question: 'What are Java primitive types? What is autoboxing and why avoid it in loops?',
        answer: 'Java has 8 primitives: byte (8-bit), short (16-bit), int (32-bit), long (64-bit), float (32-bit), double (64-bit), char (16-bit Unicode), boolean. Primitives live on the Stack; they cannot be null and have default values (int=0, boolean=false). Autoboxing (int→Integer) and unboxing (Integer→int) are automatic conversions. Avoid in tight loops: each boxing creates a new Heap object, causing GC pressure.',
        codeExample: `// BAD: autoboxing on every iteration → 1M heap objects
Long sum = 0L;
for (long i = 0; i < 1_000_000; i++) sum += i; // unbox + box each time

// GOOD: primitive all the way
long sum = 0L;
for (long i = 0; i < 1_000_000; i++) sum += i;

// Autoboxing gotcha with Integer cache (-128 to 127):
Integer a = 127, b = 127;
System.out.println(a == b); // true (cached)
Integer c = 128, d = 128;
System.out.println(c == d); // false (not cached)`,
        tags: ['Primitives', 'Performance', 'JVM'],
      },
      {
        question: 'What are the 5 ways to create an object in Java?',
        answer: '1. new keyword — calls constructor, most common. 2. Reflection (Class.forName().getConstructor().newInstance()) — used by Spring DI and frameworks, can call private constructors. 3. clone() — shallow copy by default; class must implement Cloneable and override clone(). 4. Deserialization (ObjectInputStream.readObject()) — no constructor called, reconstructs from bytes; class must implement Serializable. 5. Factory Method — hides new, may return cached instances (e.g., Calendar.getInstance(), Boolean.valueOf()).',
        codeExample: `// 1. new keyword
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
Boolean flag = Boolean.valueOf(true); // cached, no new object`,
        tags: ['OOP', 'Reflection', 'JVM'],
      },
      {
        question: 'What is the Runnable interface? Difference between run() and start()?',
        answer: 'Runnable is a @FunctionalInterface with one method: void run(). It defines the code a thread will execute. Since it is functional, you can implement it with a lambda. Critical distinction: calling myRunnable.run() directly is a normal method call on the current thread. Calling thread.start() creates a new OS thread and internally calls run() on it. Never call run() directly when you want parallelism.',
        codeExample: `// Lambda implementation (preferred)
Runnable task = () -> System.out.println("Running on: " + Thread.currentThread().getName());

// WRONG: runs on current thread, no new thread created
task.run();

// CORRECT: JVM creates new thread, then calls run() internally
Thread t = new Thread(task);
t.start();

// Callable: like Runnable but returns a value and can throw checked exceptions
Callable<Integer> calc = () -> 42;
Future<Integer> future = executor.submit(calc);`,
        tags: ['Threading', 'Runnable', 'Fundamentals'],
      },
      {
        question: 'Fail-Fast vs Fail-Safe iterators: what is the difference?',
        answer: 'Fail-Fast: operates on the original collection; throws ConcurrentModificationException if collection is modified during iteration. Uses modCount counter. Collections: ArrayList, HashSet, HashMap. Fail-Safe (Weakly Consistent): works on a clone/copy of the collection; never throws. Collections: CopyOnWriteArrayList, ConcurrentHashMap. Trade-off: Fail-Safe uses more memory and may not reflect latest changes. You CAN remove during Fail-Fast iteration using iterator.remove() (updates modCount correctly).',
        codeExample: `// Fail-Fast: throws ConcurrentModificationException
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
}`,
        tags: ['Collections', 'Iterator', 'Concurrency'],
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
      {
        question: 'HashMap vs Hashtable: key differences?',
        answer: 'HashMap (Java 1.2): not synchronized, allows one null key and multiple null values, uses Iterator (Fail-Fast), inherits AbstractMap — use for 99% of cases. Hashtable (Java 1.0): legacy, every method synchronized on a single lock (huge bottleneck), no null keys/values, uses Enumeration. Modern alternative for thread safety: ConcurrentHashMap — locks only individual buckets (lock stripping), not the whole map. Never use Hashtable in new code.',
        codeExample: `// HashMap: fast, not thread-safe
Map<String, String> map = new HashMap<>();
map.put(null, "value"); // allowed

// Hashtable: slow, thread-safe (but outdated)
Hashtable<String, String> table = new Hashtable<>();
table.put(null, "value"); // throws NullPointerException!

// ConcurrentHashMap: fast AND thread-safe (preferred)
Map<String, String> concurrent = new ConcurrentHashMap<>();
concurrent.putIfAbsent("key", "value"); // atomic operation`,
        tags: ['HashMap', 'Thread Safety', 'Concurrency'],
      },
      {
        question: 'How do HashMap buckets, load factor, and treeification work?',
        answer: 'Buckets: HashMap is an array of nodes. hashCode() → index into array. Each bucket is a linked list (Java 7) or Red-Black Tree (Java 8+ when chain > 8 nodes). Load Factor (default 0.75): when 75% of buckets occupied, HashMap rehashes — doubles array size, redistributes all entries. Capacity (default 16). Initial capacity tip: set to expectedSize/0.75 + 1 to avoid rehashing. Treeification threshold: 8 nodes in a bucket → O(n) list becomes O(log n) tree.',
        codeExample: `// Step-by-step for map.get(key):
// 1. Compute hash: hash = key.hashCode() ^ (hash >>> 16)
// 2. Find bucket: index = hash & (capacity - 1)
// 3. Look in bucket: iterate list or tree
// 4. Use .equals() on each node to find exact key

// Optimal initial capacity to avoid rehash:
int expectedEntries = 1000;
Map<String, String> map = new HashMap<>((int)(expectedEntries / 0.75) + 1);

// Java 8: bucket becomes tree at 8 nodes, reverts at 6
// Prevents O(n) worst case from hash collisions (e.g. hash DoS)`,
        tags: ['HashMap', 'Internals', 'Performance'],
      },
      {
        question: 'Comparable vs Comparator: what is the difference and when to use each?',
        answer: 'Comparable (java.lang): implemented inside the class; defines natural/default ordering via compareTo(Object). Class "knows how to sort itself." Comparator (java.util): external, separate from the class; defines custom ordering via compare(o1, o2). Returns negative (o1 before o2), zero (equal), positive (o1 after o2). Use Comparable for the primary, obvious sort order. Use Comparator for multiple sort orders or when you cannot modify the class.',
        codeExample: `// Comparable: natural ordering by ID
public class Student implements Comparable<Student> {
    int id; String name;
    @Override
    public int compareTo(Student other) {
        return Integer.compare(this.id, other.id); // avoid subtraction (overflow)
    }
}
Collections.sort(studentList); // uses compareTo

// Comparator: custom ordering (multiple ways)
Comparator<Student> byName = (s1, s2) -> s1.name.compareTo(s2.name);
Collections.sort(studentList, byName);

// Java 8 style: chained comparators
studentList.sort(Comparator.comparing(Student::getName)
                            .thenComparingInt(Student::getId));`,
        tags: ['Comparable', 'Comparator', 'Sorting'],
      },
      {
        question: 'How does Collections.sort() / Stream.sorted() work internally?',
        answer: 'Collections.sort() uses TimSort (hybrid merge+insertion sort) — O(n log n) worst case. It repeatedly calls compare() or compareTo() with different pairs of elements to determine order; it does NOT go one by one. Stream.sorted() returns a NEW stream with sorted elements; it does NOT modify the original list. Collect with Collectors.toList() to get a List back, or Collectors.toMap() to collect into a Map with key and value extractors.',
        codeExample: `// Stream sort then collect to list
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
    .collect(Collectors.groupingBy(Employee::getDepartment));`,
        tags: ['Collections', 'Streams', 'Sorting'],
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
      {
        question: 'How do you implement a thread-safe Singleton using Double-Checked Locking?',
        answer: 'Double-Checked Locking (DCL): first null check avoids synchronization on every call (performance). Second null check inside synchronized block prevents two threads that both passed the first check from each creating an instance. volatile is MANDATORY: without it, JVM instruction reordering can assign the reference before the constructor finishes, allowing another thread to return a partially-constructed object. Alternative: Bill Pugh Static Holder — cleaner, JVM class-loading guarantees thread safety without explicit locking.',
        codeExample: `// DCL Singleton (Java 5+)
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
}`,
        tags: ['Singleton', 'Thread Safety', 'Design Patterns'],
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
      {
        question: 'What are the top Stream terminal operations including max(), min(), and Collectors?',
        answer: 'Key terminal operations: collect() — converts stream to List/Set/Map; forEach() — action per element (consumes stream); reduce(identity, accumulator) — folds to single value; count() — returns long; anyMatch/allMatch/noneMatch — short-circuit boolean checks; findFirst()/findAny() — returns Optional; max()/min() — return Optional<T> using a Comparator. Key Collectors: groupingBy (SQL GROUP BY), partitioningBy (splits into true/false map), joining (concatenates strings), toMap (key+value extractors).',
        codeExample: `// max / min — return Optional (stream may be empty)
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
    .collect(Collectors.joining(", ", "[", "]"));`,
        tags: ['Streams', 'Collectors', 'Functional'],
      },
      {
        question: 'What are the major Java 17 features? When were Records and Sealed Classes actually introduced?',
        answer: 'Records (final in Java 16, preview in Java 14-15): immutable data carriers, auto-generates constructor, getters, equals(), hashCode(), toString(). Sealed Classes (final in Java 17, preview in Java 15-16): restrict which classes can extend/implement them using permits. Pattern Matching for switch (preview in 17, standard in 21). Helpful NullPointerExceptions: identifies exactly which variable was null. Text Blocks (standard from Java 15). Java 17 is the LTS where Records + Sealed Classes are production-ready without --enable-preview.',
        codeExample: `// Record: replaces ~50 lines of boilerplate
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
    """;`,
        tags: ['Java 17', 'Records', 'Sealed Classes', 'Modern Java'],
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
      {
        question: '@PathVariable vs @RequestParam: when to use each?',
        answer: '@PathVariable: extracts data embedded in the URL path (/users/101). Used for mandatory data that identifies a resource. Always required by default. Cleaner, RESTful URLs. @RequestParam: extracts data from query string (/users?page=2&sort=name). Used for optional filtering, sorting, or pagination. Can have required=false with defaultValue. Rule: path variable = identity (who), query param = filter (how).',
        codeExample: `// @PathVariable: identifies the resource
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
                              @RequestParam String status) { ... }`,
        tags: ['Spring Boot', 'REST', 'Controllers'],
      },
      {
        question: 'What is @Primary in Spring Boot and how does it differ from @Qualifier?',
        answer: '@Primary: placed on a bean definition. Tells Spring "use this bean by default when multiple beans of the same type exist." Resolves NoUniqueBeanDefinitionException globally. @Qualifier: placed at the injection point. Says "I specifically want this named bean." @Qualifier always wins over @Primary. Use @Primary for the default (e.g., real EmailService), use @Qualifier at specific injection sites that need an alternative (e.g., SmsService for OTP alerts). Custom qualifier annotations eliminate string typos.',
        codeExample: `@Component
@Primary  // Default choice for NotificationService
public class EmailService implements NotificationService {
    public void send(String msg) { /* email */ }
}

@Component("smsService")
public class SmsService implements NotificationService {
    public void send(String msg) { /* SMS */ }
}

// Injections:
@Autowired
NotificationService service; // gets EmailService (Primary)

@Autowired
@Qualifier("smsService")
NotificationService smsOnly; // gets SmsService explicitly

// Custom qualifier (avoids typos):
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface Critical {}`,
        tags: ['Spring Boot', 'DI', 'Beans'],
      },
      {
        question: 'How do you implement a Global Exception Handler in Spring Boot?',
        answer: '@RestControllerAdvice (= @ControllerAdvice + @ResponseBody) is a "safety net" around all controllers. @ExceptionHandler methods catch specific exception types and return structured error responses. Benefits: separates error handling from business logic, ensures consistent JSON error format, single place to change error logging/formatting. Extend ResponseEntityExceptionHandler to override Spring MVC default exceptions (405, 400, etc.).',
        codeExample: `public class ErrorResponse {
    private LocalDateTime timestamp = LocalDateTime.now();
    private String message;
    private int status;
    public ErrorResponse(String message, int status) {
        this.message = message; this.status = status;
    }
}

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(UserNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(new ErrorResponse(ex.getMessage(), 404));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String msg = ex.getBindingResult().getFieldError().getDefaultMessage();
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Validation: " + msg, 400));
    }

    @ExceptionHandler(Exception.class) // catch-all
    public ResponseEntity<ErrorResponse> handleGeneral(Exception ex) {
        return ResponseEntity.internalServerError()
            .body(new ErrorResponse("Internal error", 500));
    }
}`,
        tags: ['Spring Boot', 'Exception Handling', 'REST'],
      },
      {
        question: 'What is the Spring Boot application lifecycle?',
        answer: 'Phase 1 — Initialization: SpringApplication.run() loads properties/yml, sets up ApplicationContext. Phase 2 — Bean Lifecycle: Instantiation (constructor called), Populate Properties (@Autowired injection), Initialization (@PostConstruct methods, InitializingBean.afterPropertiesSet()). Phase 3 — Runtime: embedded Tomcat/Netty starts, app serves requests. Phase 4 — Shutdown: ApplicationContext closes, @PreDestroy methods called, DisposableBean.destroy() invoked. Hooks: ApplicationListener<ContextRefreshedEvent>, SmartLifecycle for ordered startup/shutdown.',
        codeExample: `@Service
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
}`,
        tags: ['Spring Boot', 'Lifecycle', 'Beans'],
      },
      {
        question: 'How do you debug production issues in Spring Boot?',
        answer: 'The Observability Triad: 1) Logging — centralize with ELK/Splunk, use Spring Cloud Sleuth/Micrometer for traceId correlation across services, change log level at runtime via /actuator/loggers without restart. 2) Metrics — Spring Boot Actuator + Micrometer + Prometheus/Grafana; watch CPU, Heap, HikariCP connection pool. 3) Distributed Tracing — Zipkin/Jaeger shows which service/DB query ate the time. For OOM: jmap heap dump → Eclipse MAT. For CPU spikes/deadlocks: jstack thread dump → look for BLOCKED threads or infinite loops.',
        codeExample: `# application.yml: enable key actuator endpoints
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
logging.level.org.hibernate.type.descriptor.sql: TRACE`,
        tags: ['Production', 'Debugging', 'Actuator', 'Monitoring'],
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
      {
        question: 'How do you configure multiple databases in Spring Boot?',
        answer: 'Spring Boot auto-configures a single DataSource. For multiple databases: 1) Define separate properties per DB in application.properties. 2) Create a @Configuration class per DB: define DataSource @Bean, LocalContainerEntityManagerFactoryBean, and PlatformTransactionManager. 3) Use @EnableJpaRepositories with basePackages to map each repository package to its EntityManagerFactory. 4) Mark one DataSource as @Primary so auto-configured defaults still work.',
        codeExample: `# application.properties
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
}`,
        tags: ['Spring Data', 'JPA', 'Multiple Databases'],
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
      {
        question: 'How does JWT work? How is tampering detected? How does OAuth 2.0 differ?',
        answer: 'JWT structure: Header.Payload.Signature (dot-separated, Base64URL encoded). Server signs Header+Payload with a secret (HMAC-SHA256) or private key (RSA). On verification: server re-hashes Header+Payload with the same key — if the result matches the signature, the token is valid. Tampering detection: changing any byte in Header or Payload produces a different hash that does not match the signature. Note: JWT is SIGNED not encrypted — anyone can read the payload on jwt.io; never put passwords in JWT. OAuth 2.0: authorization framework for delegated access (e.g. Login with Google). JWT is often the token format used within OAuth flows.',
        codeExample: `// JWT parts (decoded):
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
// JWT is commonly used as the access token format`,
        tags: ['JWT', 'OAuth2', 'Security'],
      },
      {
        question: 'Show a complete JWT authentication filter for Spring Security 6.',
        answer: 'Three components: 1) JwtService — verifies token signature, extracts username and expiry. 2) JwtAuthenticationFilter (OncePerRequestFilter) — intercepts every request, extracts Bearer token, validates it, sets Authentication in SecurityContextHolder. 3) SecurityConfiguration — adds the filter before UsernamePasswordAuthenticationFilter, sets session policy to STATELESS. If verification fails (tampered or expired), the filter catches the exception and does not set Authentication — Spring returns 403 automatically.',
        codeExample: `@Service
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
}`,
        tags: ['JWT', 'Spring Security', 'Filter'],
      },
      {
        question: 'How do you configure Spring Security with in-memory users and method-level security?',
        answer: 'Modern Spring Security (6.x) uses SecurityFilterChain @Bean instead of WebSecurityConfigurerAdapter. InMemoryUserDetailsManager creates users for testing. @EnableMethodSecurity enables @PreAuthorize annotations on service methods. BCryptPasswordEncoder hashes passwords. Stateless JWT APIs should disable CSRF (CSRF is for cookie-based session apps). permitAll() for public endpoints, hasRole() for restricted paths.',
        codeExample: `@Configuration
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
}`,
        tags: ['Spring Security', 'Configuration', 'Authorization'],
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
      {
        question: 'What are the core components of a microservice architecture?',
        answer: 'Each microservice is a self-contained unit with: API Layer (REST/gRPC — the external contract), Business Logic (Service Layer — domain rules), Own Data Store (Database-per-Service pattern for loose coupling), Configuration Management (externalized via Spring Cloud Config), Observability (structured logging + Micrometer metrics + distributed tracing), Connectivity (FeignClient for sync calls, Kafka/RabbitMQ for async events). Infrastructure components: API Gateway (single entry point, routing, auth, rate limiting), Service Discovery (Eureka/Consul — dynamic IP lookup), Load Balancer, Circuit Breaker (Resilience4j), Config Server, Message Broker, Distributed Tracing (Zipkin/Jaeger).',
        codeExample: `// Infrastructure component roles:
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
// OpenFeign:         spring-cloud-starter-openfeign`,
        tags: ['Microservices', 'Architecture', 'Spring Cloud'],
      },
      {
        question: 'RestTemplate vs RestClient vs FeignClient: when to use each?',
        answer: 'RestTemplate (Spring 3.0): imperative, synchronous, verbose. In maintenance mode — Spring recommends migrating away. RestClient (Spring 6.1): fluent, chainable API, modern synchronous HTTP. Preferred for standalone Spring Boot apps without microservice infrastructure. FeignClient (Spring Cloud OpenFeign): declarative — define an interface with Spring MVC annotations, Spring generates the implementation. Automatically integrates with Service Discovery (Eureka) and Load Balancing. Best for microservices. Harder to debug because implementation is "magic".',
        codeExample: `// RestTemplate (legacy)
String result = restTemplate.getForObject("/users/{id}", String.class, 101);

// RestClient (Spring 6.1+ - modern)
String result = restClient.get()
    .uri("/users/{id}", 101)
    .retrieve()
    .body(String.class);

// FeignClient (microservices - declarative)
@FeignClient(name = "user-service") // Eureka resolves "user-service" to URL
public interface UserClient {
    @GetMapping("/users/{id}")
    UserDto getUser(@PathVariable Long id);
}

// Usage: inject and call like a local method
@Service
class OrderService {
    private final UserClient userClient;
    public void process(Long userId) {
        UserDto user = userClient.getUser(userId); // Feign handles HTTP
    }
}`,
        tags: ['Microservices', 'HTTP Clients', 'Spring Cloud'],
      },
      {
        question: 'How do you call multiple services asynchronously in Spring Boot?',
        answer: 'Option A: CompletableFuture with @Async — mark service methods with @Async, they return CompletableFuture<T>. Use CompletableFuture.allOf() to wait for all tasks. Requires @EnableAsync. Option B: WebClient (Spring WebFlux) — fully reactive, non-blocking. Use Mono.zip() to fire multiple calls simultaneously and combine results. WebClient is preferred for high-concurrency scenarios. Both approaches call services in parallel rather than sequentially, dramatically reducing total response time.',
        codeExample: `// Option A: CompletableFuture + @Async
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
    .map(tuple -> new Dashboard(tuple.getT1(), tuple.getT2()));`,
        tags: ['Async', 'CompletableFuture', 'WebFlux', 'Microservices'],
      },
      {
        question: 'What is reactive/non-blocking design? When should you use it?',
        answer: 'Traditional (blocking): one thread per request — thread sits idle waiting for DB/API responses. At 200 concurrent requests you need 200 threads. Reactive (non-blocking): Event Loop model — small fixed thread pool (= CPU cores). When I/O is needed, the thread registers a callback and handles other requests. Returns to complete when data is ready. Uses Flux<T> (0..N items) and Mono<T> (0..1 item). Full-stack: Spring WebFlux + WebClient + R2DBC (reactive DB driver). Golden rule: the ENTIRE chain must be non-blocking — one blocking call (JDBC) defeats all gains. Avoid reactive for simple CRUD or CPU-heavy work.',
        codeExample: `// Traditional (blocking) Spring MVC
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
// Prevents fast producer overwhelming slow consumer (OOM prevention)`,
        tags: ['Reactive', 'WebFlux', 'Non-blocking', 'Scalability'],
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
      {
        question: 'Strategy Pattern vs Factory Pattern: what is the difference?',
        answer: 'Factory (Creational): answers "Which object should I create?" — hides the new keyword; client requests an object and does not care which concrete class is returned. Strategy (Behavioral): answers "How should this object behave right now?" — object already exists; you swap its algorithm/behavior at runtime. Key difference: Factory creates objects; Strategy uses objects. In Spring DI: Spring\'s @Bean methods act as Factories. Strategy is implemented by injecting a Map<String, MyStrategy> and selecting at runtime.',
        codeExample: `// FACTORY: hides creation logic
interface Report { void generate(); }
class PdfReport  implements Report { public void generate() { /* PDF */ } }
class ExcelReport implements Report { public void generate() { /* Excel */ } }

class ReportFactory {
    public static Report create(String type) {
        return switch (type.toUpperCase()) {
            case "PDF"   -> new PdfReport();
            case "EXCEL" -> new ExcelReport();
            default -> throw new IllegalArgumentException("Unknown type");
        };
    }
}
// Client doesn't know PdfReport vs ExcelReport exists:
Report r = ReportFactory.create("PDF");

// STRATEGY: swaps behavior of existing object
interface FormattingStrategy { String format(String text); }
class FormalStrategy  implements FormattingStrategy {
    public String format(String t) { return t.toUpperCase() + ". Regards."; }
}
class CasualStrategy  implements FormattingStrategy {
    public String format(String t) { return "Hey! " + t + " :)"; }
}
class ReportGenerator { // "Context"
    private FormattingStrategy strategy;
    public void setStrategy(FormattingStrategy s) { strategy = s; }
    public void print(String content) { System.out.println(strategy.format(content)); }
}
// Swap behavior at runtime:
ReportGenerator gen = new ReportGenerator();
gen.setStrategy(new FormalStrategy());
gen.print("Hello"); // "HELLO. Regards."
gen.setStrategy(new CasualStrategy());
gen.print("Hello"); // "Hey! Hello :)"`,
        tags: ['Factory', 'Strategy', 'GoF', 'Design Patterns'],
      },
    ],
  },
  {
    id: 'spring-cloud',
    title: 'Spring Cloud',
    icon: '☁️',
    color: '#0288D1',
    description: 'Service discovery, API gateway, config server, resilience, and inter-service communication.',
    questions: [
      {
        question: 'What is the Spring Cloud BOM and how do you structure a multi-module microservices Maven project?',
        answer: 'Spring Cloud BOM (Bill of Materials): added to the root parent POM\'s <dependencyManagement>. Ensures all Spring Cloud modules (Gateway, Eureka, Config, etc.) use compatible versions. Multi-module structure: Root Parent POM (packaging=pom, lists <modules>, defines BOM) → Child Service POMs (inherit parent, add only their specific dependencies). Benefits: version consistency, shared libraries via a common-utils module, one-click build with mvn clean install from root.',
        codeExample: `<!-- Root parent pom.xml -->
<groupId>com.example</groupId>
<artifactId>microservice-parent</artifactId>
<packaging>pom</packaging>

<modules>
  <module>common-utils</module>
  <module>auth-service</module>
  <module>order-service</module>
  <module>gateway-service</module>
</modules>

<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>org.springframework.cloud</groupId>
      <artifactId>spring-cloud-dependencies</artifactId>
      <version>2022.0.3</version>
      <type>pom</type><scope>import</scope>
    </dependency>
  </dependencies>
</dependencyManagement>

<!-- Child order-service/pom.xml -->
<parent>
  <artifactId>microservice-parent</artifactId>
</parent>
<dependencies>
  <dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    <!-- No version needed — inherited from BOM -->
  </dependency>
</dependencies>`,
        tags: ['Spring Cloud', 'Maven', 'Multi-module'],
      },
      {
        question: 'What are the "Big 4" Spring Cloud components and what does each do?',
        answer: '1. Service Discovery (Netflix Eureka): services register themselves on startup; clients ask Eureka for the current IP/port of a service by name — no hardcoded URLs. 2. API Gateway (Spring Cloud Gateway): single entry point for all clients; handles routing, rate limiting, authentication, and SSL termination. 3. Centralized Config (Spring Cloud Config): all application.properties stored in a Git repo; services pull config at startup without code changes. 4. Resilience (Resilience4j): Circuit Breaker (CLOSED→OPEN on failures), Rate Limiter, Retry, Bulkhead. Prevents one failing service from cascading across the system.',
        codeExample: `// 1. Eureka: service registers itself
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
public boolean fallback(String sku, Exception e) { return false; }`,
        tags: ['Spring Cloud', 'Eureka', 'Gateway', 'Resilience4j'],
      },
    ],
  },
  {
    id: 'aws',
    title: 'AWS Integration',
    icon: '🌩️',
    color: '#FF9900',
    description: 'AWS SDK for Java, S3, Secrets Manager, credential management, and best practices.',
    questions: [
      {
        question: 'How do you integrate AWS SDK 2.x in a Java/Spring Boot application?',
        answer: 'Use AWS SDK for Java 2.x (not 1.x): built on Netty for non-blocking I/O, uses builder pattern, clients are thread-safe singletons. Add BOM to pom.xml for version management, then add only the services you need. Authentication: use DefaultCredentialsProvider — automatically checks environment variables, ~/.aws/credentials file, IAM roles (EC2/Lambda). Never hardcode Access Key/Secret Key in code. Clients should be Spring @Beans for lifecycle management and sharing.',
        codeExample: `<!-- pom.xml: BOM for version management -->
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
// 3. EC2 instance profile / ECS task role (production — no keys needed!)`,
        tags: ['AWS', 'SDK', 'Spring Boot'],
      },
      {
        question: 'How do you use AWS Secrets Manager to avoid storing credentials in application.properties?',
        answer: 'AWS Secrets Manager stores sensitive config (DB passwords, API keys) as versioned JSON secrets. At app startup, call SecretsManagerClient to fetch the secret string, parse it as JSON, and inject values. This prevents credentials appearing in source code, logs, or container images. For Spring Boot: use aws-secretsmanager-jdbc or a @PostConstruct init in a @Configuration class to inject secrets into DataSource properties. In production, the service runs with an IAM Role — no hardcoded keys anywhere.',
        codeExample: `<dependency>
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
}`,
        tags: ['AWS', 'Secrets Manager', 'Security', 'Spring Boot'],
      },
    ],
  },
];
