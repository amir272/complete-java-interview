/**
 * Third batch of extra Java Q&As covering remaining gaps from JavaInterviewQuestions.md.
 * Topics: threading edge cases, JUnit, OOP edge cases, enum/serialization deep dives,
 * generics, collections deeper, Java8 edge cases, Spring deeper, production scenarios.
 */
import { QA } from './javaTopics';

// ─── THREADING EDGE CASES ────────────────────────────────────────────────────
export const threadingExtra3: QA[] = [
  {
    question: 'What is IllegalMonitorStateException vs InterruptedException in Java?',
    answer: 'IllegalMonitorStateException: thrown when you call wait(), notify(), or notifyAll() without holding the object\'s monitor (i.e., outside a synchronized block/method). The thread must own the lock on the object before calling these methods. InterruptedException: checked exception thrown when a thread is sleeping, waiting, or blocked and another thread calls interrupt() on it. It signals that the blocking operation should stop. Best practice: when catching InterruptedException, either re-throw it or restore the interrupt flag: Thread.currentThread().interrupt().',
    codeExample: `// IllegalMonitorStateException: calling wait() without synchronized
Object lock = new Object();

// WRONG — throws IllegalMonitorStateException:
// lock.wait(); // no synchronized!

// CORRECT:
synchronized (lock) {
    lock.wait(); // now we hold the monitor
}

// InterruptedException: handling thread interruption
class Worker implements Runnable {
    public void run() {
        try {
            Thread.sleep(5000); // blocking
        } catch (InterruptedException e) {
            // Option 1: re-throw (if method declares throws)
            // throw e;

            // Option 2: restore interrupt flag (most common)
            Thread.currentThread().interrupt();
            System.out.println("Worker interrupted, stopping.");
            return;
        }
    }
}

Thread t = new Thread(new Worker());
t.start();
t.interrupt(); // causes InterruptedException in sleep()`,
    tags: ['Threading', 'Synchronization', 'Exceptions'],
  },
  {
    question: 'How do you handle thread interruption? How do you check if a thread holds a lock?',
    answer: 'Thread interruption: the interrupt() method sets the interrupt flag. Blocking methods (sleep, wait, join) throw InterruptedException when interrupted. Non-blocking code must poll Thread.interrupted() or isInterrupted(). Check if a thread holds a lock: use Thread.holdsLock(object) — returns true if the current thread holds the monitor for that object. This is useful for assertions in library code: assert Thread.holdsLock(this) in a method that assumes it is called under synchronization.',
    codeExample: `// Checking interrupt flag in non-blocking code:
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
}`,
    tags: ['Threading', 'Interruption', 'Synchronization'],
  },
  {
    question: 'How do you implement a fair lock in Java? What is the difference between a fair and unfair lock?',
    answer: 'Fair lock: threads acquire the lock in the order they requested it (FIFO). In Java, ReentrantLock(true) creates a fair lock. Unfair lock (default): threads can "barge in" ahead of waiting threads — higher throughput but risk of starvation. synchronized keyword always uses an unfair lock. Fair locks have lower throughput because the JVM must maintain a wait queue, but guarantee no thread starvation. Use fair locks when all threads must be served equally and starvation is unacceptable (e.g., booking systems).',
    codeExample: `import java.util.concurrent.locks.ReentrantLock;

// Fair lock — FIFO ordering
ReentrantLock fairLock = new ReentrantLock(true);

// Unfair lock (default) — higher throughput, possible starvation
ReentrantLock unfairLock = new ReentrantLock(false);
ReentrantLock defaultLock = new ReentrantLock(); // same as (false)

// Usage:
class TicketCounter {
    private final ReentrantLock lock = new ReentrantLock(true); // fair
    private int tickets = 100;

    public int buyTicket() {
        lock.lock(); // queued FIFO
        try {
            if (tickets > 0) return tickets--;
            return -1; // sold out
        } finally {
            lock.unlock(); // always release in finally
        }
    }

    // Fair lock with timeout (avoid indefinite waiting):
    public boolean tryBuyTicket() throws InterruptedException {
        if (lock.tryLock(2, java.util.concurrent.TimeUnit.SECONDS)) {
            try {
                return tickets > 0 && --tickets >= 0;
            } finally {
                lock.unlock();
            }
        }
        return false; // could not acquire within 2s
    }
}`,
    tags: ['Threading', 'ReentrantLock', 'Concurrency'],
  },
  {
    question: 'What happens when an exception occurs inside a synchronized block? Write a Producer/Consumer using wait/notify.',
    answer: 'Exception in synchronized block: the lock IS released. When an exception propagates out of a synchronized method or block, Java releases the monitor. The object\'s monitor state is restored — other threads can acquire the lock. This is why you should use try-finally inside synchronized blocks when you need cleanup. Producer/Consumer with wait/notify: the classic problem where a producer adds items to a buffer and a consumer takes them, coordinated via wait() and notifyAll().',
    codeExample: `// Exception releases the lock:
synchronized (lock) {
    try {
        riskyOperation(); // throws exception
    } catch (Exception e) {
        // handle — lock still released when we leave the block
    }
} // lock released here, even if exception was thrown

// Producer/Consumer with wait/notify:
class Buffer {
    private final Queue<Integer> queue = new LinkedList<>();
    private final int MAX = 5;

    public synchronized void produce(int value) throws InterruptedException {
        while (queue.size() == MAX) {
            wait(); // releases lock, waits until consumer signals
        }
        queue.add(value);
        System.out.println("Produced: " + value);
        notifyAll(); // wake up waiting consumers
    }

    public synchronized int consume() throws InterruptedException {
        while (queue.isEmpty()) {
            wait(); // releases lock, waits until producer signals
        }
        int val = queue.poll();
        System.out.println("Consumed: " + val);
        notifyAll(); // wake up waiting producers
        return val;
    }
}`,
    tags: ['Threading', 'Producer-Consumer', 'Synchronization'],
  },
  {
    question: 'What is RejectedExecutionHandler? How does it work in ThreadPoolExecutor?',
    answer: 'RejectedExecutionHandler is called when ThreadPoolExecutor cannot accept a new task — either because the pool is shut down or the queue is full and max threads are reached. Built-in policies: AbortPolicy (default): throws RejectedExecutionException. CallerRunsPolicy: runs the task in the calling thread (provides backpressure). DiscardPolicy: silently discards the task. DiscardOldestPolicy: discards the oldest queued task and retries submission. You can implement a custom handler for logging, metrics, or storing rejected tasks to a database.',
    codeExample: `import java.util.concurrent.*;

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
// slowing down task submission automatically.`,
    tags: ['Threading', 'ThreadPool', 'ExecutorService'],
  },
];

// ─── JUNIT / TESTING ──────────────────────────────────────────────────────────
export const junitExtra: QA[] = [
  {
    question: 'What is the difference between a Stub and a Mock in unit testing?',
    answer: 'Stub: provides pre-programmed responses to calls. Used to replace dependencies with controlled outputs. No behavior verification. You just set "when X is called, return Y." Mock: a stub with built-in verification. You verify THAT methods were called, how many times, and with what arguments. Mocks record interactions and let you assert them. In Mockito: when() + thenReturn() = stub behavior. verify() = mock assertion. Fake: a working implementation (e.g., in-memory database). Spy: wraps a real object, stubs some methods but calls real code for others.',
    codeExample: `import org.mockito.Mockito;
import static org.mockito.Mockito.*;

// Stubbing: control return values
UserRepository mockRepo = mock(UserRepository.class);
when(mockRepo.findById(1L)).thenReturn(Optional.of(new User("Alice")));

// This is a STUB — we don't care HOW MANY times it's called

// Mocking: verify interactions
EmailService mockEmail = mock(EmailService.class);

OrderService service = new OrderService(mockRepo, mockEmail);
service.placeOrder(new Order(1L, 100.0));

// Verify mock was called correctly (this is what makes it a mock):
verify(mockEmail, times(1)).sendConfirmation(any(Order.class));
verify(mockEmail, never()).sendError(anyString());

// Spy: partial mock — real object with some stubbed methods
UserService realService = new UserService();
UserService spy = spy(realService);
doReturn("mocked").when(spy).getUserName(1L); // stub one method
spy.processUser(1L); // other methods run real code`,
    tags: ['Testing', 'JUnit', 'Mockito'],
  },
  {
    question: 'Can you test a private method using JUnit? How do you test exceptions and async methods?',
    answer: 'Private methods: generally you should NOT test them directly — test via public methods (if logic is worth testing, it deserves its own class). If you must: use reflection (bad practice) or Mockito\'s @InjectMocks with package-private scope. Testing exceptions: use assertThrows() in JUnit 5. Testing async: use CompletableFuture.get() with timeout, CountDownLatch to wait for completion, or @Async with a synchronous test executor (SyncTaskExecutor in Spring).',
    codeExample: `// Testing exceptions (JUnit 5):
@Test
void shouldThrowOnNullOrder() {
    OrderService service = new OrderService();
    assertThrows(IllegalArgumentException.class,
        () -> service.process(null));
}

// Testing exception message:
Exception ex = assertThrows(RuntimeException.class,
    () -> service.process(invalidOrder));
assertTrue(ex.getMessage().contains("invalid state"));

// Testing async (CompletableFuture):
@Test
void shouldCompleteAsync() throws Exception {
    CompletableFuture<String> future = asyncService.fetchData();
    String result = future.get(5, TimeUnit.SECONDS); // wait max 5s
    assertEquals("expected", result);
}

// Testing async (CountDownLatch):
@Test
void asyncEventFired() throws InterruptedException {
    CountDownLatch latch = new CountDownLatch(1);
    eventService.onComplete(() -> latch.countDown());
    eventService.triggerAsync();
    assertTrue(latch.await(3, TimeUnit.SECONDS), "Event not fired");
}

// Testing private via reflection (avoid if possible):
Method privateMethod = MyClass.class.getDeclaredMethod("privateHelper", String.class);
privateMethod.setAccessible(true);
Object result = privateMethod.invoke(instance, "arg");`,
    tags: ['Testing', 'JUnit', 'Async'],
  },
];

// ─── OOP EDGE CASES ───────────────────────────────────────────────────────────
export const oopEdgeCasesExtra: QA[] = [
  {
    question: 'What is the @Override annotation? Can we override non-abstract methods in an abstract class? Can we override synchronized with non-synchronized?',
    answer: '@Override: tells compiler to verify the method truly overrides a parent method. Without it, a typo creates a new method silently — a common bug. Override non-abstract in abstract class: YES — a child can override any non-final, non-static, non-private method regardless of whether the parent is abstract or concrete. This is normal polymorphism. Override synchronized with non-synchronized: YES — the synchronization is NOT part of the method signature. A subclass can override a synchronized method with a non-synchronized one (or vice versa). The override is valid, but you lose thread safety in the subclass.',
    codeExample: `// @Override catches typos at compile time:
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
}`,
    tags: ['OOP', 'Override', 'Inheritance'],
  },
  {
    question: 'Can we have multiple main() methods? Execute without main()? JDK version compatibility?',
    answer: 'Multiple main() methods: YES in different classes. ONE class is the entry point (specified at java launch). You can also overload main() in the same class (not the entry point). Execute without main(): Prior to Java 21 — NO, you need main(). Java 21+ with "Unnamed Main Methods" (preview): simplified programs. Static initializers run but that\'s not "executing without main." JDK version compatibility: .class files have a version number. Compiling with JDK 14 produces bytecode the JDK 8 JVM cannot understand (UnsupportedClassVersionError). JDK 11 CAN run Java 8 bytecode (backwards compatible). Always: newer JVM can run older bytecode, older JVM cannot run newer bytecode.',
    codeExample: `// Multiple main() in same class — overloaded, but only String[] is entry point:
class App {
    public static void main(String[] args) { // JVM entry point
        System.out.println("Starting");
    }
    public static void main(String arg) {   // overloaded — never called by JVM
        System.out.println("Overloaded: " + arg);
    }
    public static void main() {             // overloaded — never called by JVM
        System.out.println("No args");
    }
}

// Static initializer runs at class load — not "executing without main":
class EarlyInit {
    static { System.out.println("Class loaded"); } // runs before main!
    public static void main(String[] args) {
        System.out.println("main runs after static block");
    }
}
// Output: "Class loaded" then "main runs after static block"

// Version mismatch error:
// Compiled with JDK 17 (class file version 61), run on JRE 8 (max version 52):
// java.lang.UnsupportedClassVersionError:
//   App has been compiled by a more recent version of the Java Runtime`,
    tags: ['Java', 'JVM', 'Compatibility'],
  },
  {
    question: 'How do you perform a deep copy in Java? What is CloneNotSupportedException?',
    answer: 'Shallow copy: copies reference values — both original and copy point to the same nested objects. Object.clone() is shallow by default. Deep copy: recursively copies all nested objects so original and copy are fully independent. Ways to deep copy: 1) Override clone() recursively. 2) Serialization + deserialization (slow but simple). 3) Copy constructor. 4) Jackson/Gson: serialize to JSON and back. CloneNotSupportedException: clone() throws this if the class does not implement Cloneable. It is a checked exception. Even with Cloneable, clone() only does a shallow copy.',
    codeExample: `// Copy constructor (clean deep copy):
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
}`,
    tags: ['Java', 'OOP', 'Clone', 'Memory'],
  },
  {
    question: 'What happens when the main() method runs? How does System.out.println("Hello") work internally?',
    answer: 'When main() runs: 1) JVM starts. 2) ClassLoader loads the class. 3) Static initializers run. 4) main() is invoked on the main thread. System.out.println internals: System.out is a PrintStream (a static field in System). println() calls print(String) which calls synchronized write() on the underlying OutputStream. For console output this is a FileOutputStream wrapping file descriptor 1 (stdout). The write goes through native OS system call write(1, bytes, len). Thread safety: PrintStream synchronizes on itself internally, so concurrent println() calls are safe (individual calls won\'t interleave, but multi-line output can).',
    codeExample: `// Step-by-step what happens for System.out.println("Hello"):
// 1. System.out → static PrintStream field in java.lang.System
// 2. .println("Hello") → calls synchronized print("Hello\n")
// 3. print() → writes to internal BufferedWriter/OutputStreamWriter
// 4. Writer wraps FileOutputStream(FileDescriptor.out)
// 5. FileOutputStream.write() calls native method writeBytes()
// 6. OS: write(fd=1, "Hello\n", 6) — fd 1 is stdout

// Why System.out is thread-safe:
// PrintStream wraps all writes in synchronized(this) — so individual
// println calls don't interleave their bytes. But:
Thread t1 = new Thread(() -> { System.out.print("Hello "); System.out.println("World"); });
Thread t2 = new Thread(() -> System.out.println("Bye!"));
// Possible output: "Bye!\nHello World\n" — println is atomic, but between
// print() and println() another thread can sneak in.

// Main method execution sequence:
// 1. JVM: load MyApp.class
// 2. Execute static blocks (in order of appearance)
// 3. Call MyApp.main(String[]) on the main thread
// 4. When main() returns, JVM runs shutdown hooks, then exits`,
    tags: ['Java', 'JVM', 'Internals'],
  },
];

// ─── ENUM AND SERIALIZATION EDGE CASES ───────────────────────────────────────
export const enumSerializationExtra: QA[] = [
  {
    question: 'Can an enum extend a class? How do you iterate enum values? What is Enum<E extends Enum<E>>?',
    answer: 'Can enum extend a class: NO — every enum implicitly extends java.lang.Enum<E>. Since Java has single inheritance, enums cannot extend another class. However, enums CAN implement interfaces. Iterate enum values: use values() static method (returns array), or EnumSet.allOf(). Enum<E extends Enum<E>>: this is the self-referential generic declaration that allows Enum to provide methods like compareTo(E) that are type-safe. The E is the actual enum type so Suit.HEARTS.compareTo() returns Suit, not raw Enum.',
    codeExample: `// Enum cannot extend a class:
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
Priority fromName = Priority.valueOf("LOW"); // reverse lookup`,
    tags: ['Enums', 'Java', 'Generics'],
  },
  {
    question: 'Can you serialize static fields? What happens during serialization if an exception is thrown or a field is not serializable?',
    answer: 'Serialize static fields: NO — static fields belong to the class, not the instance. Serialization captures object state; class-level state is not serialized. On deserialization, static fields retain their current JVM values (or defaults if the class was freshly loaded). Non-serializable member: if a Serializable class has a non-serializable field (not marked transient), ObjectOutputStream throws NotSerializableException. Fix: mark field transient or make the member implement Serializable. Exception during serialization: the stream is corrupted — partial writes. The stream should be discarded. Always close streams in finally/try-with-resources.',
    codeExample: `// Static fields are NOT serialized:
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
}`,
    tags: ['Serialization', 'Java', 'Static'],
  },
];

// ─── GENERICS DEEPER ─────────────────────────────────────────────────────────
export const genericsExtra2: QA[] = [
  {
    question: 'What is covariance and contravariance in Java generics? Can you pass List<String> to a method accepting List<Object>?',
    answer: 'Covariance: a List<Dog> IS-A List<? extends Animal> — you can read Animals from it, not write. Contravariance: a List<Animal> IS-A List<? super Dog> — you can write Dogs to it, not read safely. Invariance: List<String> is NOT a List<Object> — no relationship despite String extends Object. This prevents type pollution (if it were allowed, you could add Integer to a List<String> through the List<Object> reference). Can you pass List<String> to List<Object>: NO. Use List<? extends Object> (wildcard) if you only need to read.',
    codeExample: `// List<String> is NOT assignable to List<Object> — compile error:
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
arr[0] = 42; // ArrayStoreException at runtime — why generics are invariant`,
    tags: ['Generics', 'Covariance', 'Type System'],
  },
];

// ─── COLLECTIONS DEEPER ───────────────────────────────────────────────────────
export const collectionsExtra2: QA[] = [
  {
    question: 'How do LinkedHashSet vs TreeSet compare? Can TreeMap store null keys? How do you set ArrayList initial capacity?',
    answer: 'LinkedHashSet: insertion-order maintained (uses LinkedHashMap internally), O(1) add/contains/remove, allows one null. TreeSet: sorted order (natural or Comparator), O(log n) operations, backed by TreeMap — does NOT allow null (NullPointerException on add). TreeMap null keys: NO (throws NullPointerException) because compareTo(null) fails. HashMap and LinkedHashMap allow one null key. ArrayList initial capacity: use ArrayList(int initialCapacity) constructor. When you know approximate size, pre-sizing avoids repeated array copies: new ArrayList<>(expectedSize). Default capacity is 10; grows by 50% when full.',
    codeExample: `// LinkedHashSet: insertion order preserved
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
NavigableSet<Integer> range = tree.subSet(1, true, 5, true); // tree only`,
    tags: ['Collections', 'LinkedHashSet', 'TreeSet', 'ArrayList'],
  },
  {
    question: 'How do you implement an LRU Cache? What are the issues with mutable keys in HashMap?',
    answer: 'LRU Cache with LinkedHashMap: use LinkedHashMap(capacity, 0.75f, true) — the third argument (accessOrder=true) makes it maintain access order. Override removeEldestEntry() to evict the oldest when capacity exceeded. Mutable keys in HashMap: dangerous. hashCode is computed at insertion time. If the key is mutated later, its hashCode changes, making it impossible to find in the original bucket. The key becomes "lost" — it is in the map but unreachable. Always use immutable objects as HashMap keys (String, Integer, enums, or immutable value objects).',
    codeExample: `// LRU Cache with LinkedHashMap (access-order):
class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int capacity;

    LRUCache(int capacity) {
        super(capacity, 0.75f, true); // accessOrder = true
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > capacity; // evict oldest when over capacity
    }
}
LRUCache<Integer, String> cache = new LRUCache<>(3);
cache.put(1, "a"); cache.put(2, "b"); cache.put(3, "c");
cache.get(1);      // access 1 — moves to end (most recently used)
cache.put(4, "d"); // evicts 2 (least recently accessed)
System.out.println(cache.keySet()); // [3, 1, 4]

// Mutable key danger:
class BadKey {
    int value;
    public int hashCode() { return value; }
    public boolean equals(Object o) { return ((BadKey)o).value == value; }
}
Map<BadKey, String> map = new HashMap<>();
BadKey key = new BadKey(); key.value = 1;
map.put(key, "hello");
key.value = 2;                // mutate the key!
System.out.println(map.get(key)); // null — key is lost in wrong bucket!`,
    tags: ['Collections', 'HashMap', 'LRU', 'Cache'],
  },
];

// ─── JAVA 8+ EDGE CASES ───────────────────────────────────────────────────────
export const java8Extra2: QA[] = [
  {
    question: 'Can an interface with multiple default methods still be a functional interface? What is a higher-order function?',
    answer: 'Functional interface: must have exactly ONE abstract method. It CAN have any number of default methods, static methods, and Object overrides (equals, toString, hashCode). The @FunctionalInterface annotation enforces this at compile time. Having multiple defaults is fine — they are not abstract. Higher-order function: a function that takes a function as argument or returns a function. In Java, this means methods that accept or return functional interfaces (Function<T,R>, Predicate<T>, etc.).',
    codeExample: `// Interface with multiple defaults — still functional:
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
System.out.println(longEnough.test("hello")); // true`,
    tags: ['Java8', 'FunctionalInterface', 'Lambdas'],
  },
  {
    question: 'What is the Java 9 Module System? What are hidden classes (Java 15)?',
    answer: 'Java 9 Module System (JPMS): introduces modules — named, self-describing collections of packages. A module has a module-info.java declaring what it exports and what it requires. Benefits: strong encapsulation (internal packages can be truly hidden), explicit dependencies, smaller runtime images (jlink). Hidden classes (Java 15): classes not discoverable by name, not accessible via ClassLoader. Created by Lookup.defineHiddenClass(). Used by frameworks (Lambdas, Proxies) to generate code at runtime that should be GC\'d when no longer needed. A hidden class is tied to its Lookup class and cannot be used as a supertype.',
    codeExample: `// module-info.java (Java 9+ module descriptor):
module com.myapp.service {
    requires java.sql;                    // declare dependency
    requires spring.context;
    exports com.myapp.service.api;        // only this package is visible outside
    // com.myapp.service.internal is hidden — cannot be accessed by other modules
    opens com.myapp.service.dto to spring.core; // allow reflection by Spring
}

// Using a module from another module:
module com.myapp.web {
    requires com.myapp.service;          // dependency
    requires spring.web;
    exports com.myapp.web.controller;
}

// Hidden class (Java 15) — framework use, rarely in application code:
// Lambda expressions under the hood use hidden classes:
Runnable r = () -> System.out.println("lambda");
// JVM generates a hidden class for this lambda at runtime
// When r is garbage collected, the hidden class is also unloaded

// Check if running on module path:
Module module = MyClass.class.getModule();
System.out.println(module.isNamed()); // true if in named module`,
    tags: ['Java9', 'Modules', 'Java15', 'HiddenClasses'],
  },
];

// ─── SPRING DEEPER ────────────────────────────────────────────────────────────
export const springExtra3: QA[] = [
  {
    question: 'What are different Spring Bean scopes? What is @PostConstruct? How do you reduce Spring Boot startup time?',
    answer: 'Bean scopes: Singleton (default) — one instance per container. Prototype — new instance on every injection/getBean. Request — one per HTTP request (web). Session — one per HTTP session. Application — one per ServletContext. WebSocket — one per WebSocket. @PostConstruct: marks a method to run after the bean is fully initialized (dependencies injected). Use for: database validation, cache pre-loading, connection setup. Alternatives: InitializingBean.afterPropertiesSet(), @Bean(initMethod). Reduce startup time: use spring.main.lazy-initialization=true, exclude unneeded AutoConfigurations, use GraalVM native image, reduce component scan scope.',
    codeExample: `// Bean scopes:
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
//   org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration`,
    tags: ['Spring', 'BeanScopes', 'PostConstruct'],
  },
  {
    question: 'How do you implement global exception handling in Spring Boot? What is @ControllerAdvice?',
    answer: '@ControllerAdvice: a special component that applies to all controllers (or a subset). @ExceptionHandler inside it catches exceptions globally. @RestControllerAdvice = @ControllerAdvice + @ResponseBody — best for REST APIs. You can define multiple handlers for different exception types. Return a ResponseEntity with a problem body. ProblemDetail (Spring 6+) provides RFC 7807 standard error format. @ResponseStatus on exception class sets the HTTP status code.',
    codeExample: `@RestControllerAdvice
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
}`,
    tags: ['Spring', 'ExceptionHandling', 'REST'],
  },
  {
    question: 'What is Spring WebFlux and reactive programming? When should you use it?',
    answer: 'Spring WebFlux: reactive web framework built on Project Reactor. Uses non-blocking I/O — a small number of threads handles many concurrent connections (event loop model, like Node.js). Core types: Mono<T> (0 or 1 element) and Flux<T> (0 to N elements). Use WebFlux when: high concurrency with many slow I/O operations (DB, HTTP calls), streaming data (SSE, WebSocket). Do NOT use for: CPU-bound work (no benefit), small apps (extra complexity), when your team is unfamiliar with reactive patterns. Spring MVC is the better default; WebFlux when throughput with blocking I/O is a bottleneck.',
    codeExample: `// WebFlux controller:
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
// WebFlux: 1 thread handles many requests, never blocked`,
    tags: ['Spring', 'WebFlux', 'Reactive'],
  },
  {
    question: 'How do you test a Spring Boot application? What is the difference between @SpringBootTest and @WebMvcTest?',
    answer: '@SpringBootTest: loads the full application context. Use for integration tests. Slow but tests the real wiring. Can start an embedded server with webEnvironment. @WebMvcTest: loads only the web layer (controllers, filters, ControllerAdvice). No service/repository beans — you mock them. Fast and focused. @DataJpaTest: loads only JPA layer (repositories, entities). Uses in-memory H2 by default. @MockBean: creates a Mockito mock and registers it as a Spring bean — replaces the real bean in the context. Best practice: use slice tests for isolated testing and @SpringBootTest only for true end-to-end integration tests.',
    codeExample: `// @WebMvcTest — tests only the web layer (fast):
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
}`,
    tags: ['Spring', 'Testing', 'JUnit'],
  },
];

// ─── SPRING SECURITY DEEPER ───────────────────────────────────────────────────
export const springSecurityExtra: QA[] = [
  {
    question: 'How do you ensure security in a Spring Boot application? What is the role of Spring Security filter chain?',
    answer: 'Spring Security filter chain: a chain of servlet filters applied before requests reach controllers. Key filters: SecurityContextPersistenceFilter (loads auth from session), UsernamePasswordAuthenticationFilter (handles login form), BearerTokenAuthenticationFilter (JWT), ExceptionTranslationFilter (converts auth exceptions to HTTP responses), FilterSecurityInterceptor (enforces authorization). Configuration: in Spring Security 6, use SecurityFilterChain bean with HttpSecurity. Disable CSRF for stateless APIs. Use method-level security with @EnableMethodSecurity and @PreAuthorize/@PostAuthorize.',
    codeExample: `@Configuration
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
}`,
    tags: ['Spring', 'Security', 'JWT'],
  },
];

// ─── PRODUCTION / DEBUGGING ───────────────────────────────────────────────────
export const productionExtra: QA[] = [
  {
    question: 'How would you investigate a stuck Java web server? How do you debug OutOfMemoryError in production?',
    answer: 'Stuck server (not responding, no logs): 1) Take a thread dump: kill -3 <pid> or jstack <pid>. Look for deadlocks, all threads WAITING/BLOCKED. 2) Check CPU with top -H -p <pid> — which threads use 100%? 3) Run jstat -gc <pid> — is GC running constantly (memory pressure)? 4) Check open file descriptors: lsof -p <pid>. 5) Check for network issues: netstat -anp. OutOfMemoryError: 1) Add JVM flags: -XX:+HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=/tmp/. 2) Analyze heap dump with Eclipse MAT or VisualVM — find what holds most memory. 3) Common causes: unbounded caches, unprocessed queues, connection leaks, too many threads.',
    codeExample: `// JVM flags for production debugging:
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
//   → too many threads, reduce thread pool sizes or increase OS limit`,
    tags: ['Production', 'Debugging', 'JVM', 'OutOfMemoryError'],
  },
];
