/**
 * Second batch of extra Java interview Q&As covering all remaining gaps
 * from JavaInterviewQuestions.md (questions not yet in javaTopics.ts or javaTopicsExtra.ts).
 */
import { QA } from './javaTopics';

// ─── CORE JAVA OOP ADVANCED ───────────────────────────────────────────────────
export const coreJavaExtra2: QA[] = [
  {
    question: 'Which programming paradigms does Java support?',
    answer: 'Java supports: 1) Object-Oriented — everything is an object with encapsulation, inheritance, polymorphism, abstraction. 2) Imperative — step-by-step statements that mutate state. 3) Functional (Java 8+) — lambdas, streams, immutability, functions as first-class citizens via functional interfaces. 4) Concurrent — built-in threading model. Java is NOT a pure OO language because it has primitive types (int, boolean, etc.) that are not objects, and static methods that do not belong to any instance.',
    codeExample: `// OOP: encapsulation + polymorphism
class Animal { public void speak() { System.out.println("..."); } }
class Dog extends Animal { @Override public void speak() { System.out.println("Woof"); } }

// Functional (Java 8+): treat behavior as data
Function<Integer, Integer> square = x -> x * x;
List<Integer> squares = List.of(1,2,3).stream().map(square).toList();

// Java is NOT purely OO — primitives exist:
int x = 5; // not an object
// In pure OO (Smalltalk, Ruby), even 5 is an object with methods`,
    tags: ['Java', 'OOP', 'Functional', 'Paradigms'],
  },
  {
    question: 'Can we override private or final methods? Can we override constructors?',
    answer: 'Private methods: cannot be overridden — they are not visible to subclasses. Subclass can define a method with the same name, but it is a new independent method (method hiding at instance level). Final methods: cannot be overridden — compiler enforces this. Use final to prevent subclasses from changing behavior. Constructors: cannot be overridden — they are not inherited. Each class has its own constructors. Constructors can be overloaded (multiple constructors in same class). @Override on a private method causes a compile error.',
    codeExample: `class Parent {
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
}`,
    tags: ['OOP', 'Overriding', 'Inheritance'],
  },
  {
    question: 'Can we make a class abstract without an abstract method? Can a class be both final and abstract?',
    answer: 'Abstract without abstract methods: YES — a class can be declared abstract even if all methods are concrete. This prevents direct instantiation while allowing subclassing (useful as a base with shared state + concrete behavior). Final AND abstract: NO — this is a compile error. final means "cannot be subclassed"; abstract means "must be subclassed to be used." These are contradictory. Similarly, abstract methods cannot be private (must be overridable) or static (no polymorphism on static).',
    codeExample: `// Abstract class with NO abstract methods — still prevents instantiation
abstract class BaseController {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    public void log(String msg) { logger.info(msg); } // concrete!
    // No abstract methods — but you must subclass to use it
}

class UserController extends BaseController {
    // Inherits log() method, no need to override anything
}

// new BaseController(); // COMPILE ERROR — abstract class!
new UserController().log("test"); // fine

// COMPILE ERROR: final + abstract makes no sense
// final abstract class Broken { } // won't compile

// Abstract method cannot be private:
// abstract private void method(); // COMPILE ERROR`,
    tags: ['OOP', 'Abstract', 'Design'],
  },
  {
    question: 'What happens when super() and this() are called in the same constructor? What is the rule?',
    answer: 'Both super() and this() must be the FIRST statement in a constructor — so they CANNOT both appear in the same constructor. This is a compile error. this() delegates to another constructor in the same class. super() calls the parent class constructor. Rule: the first line of any constructor is always an implicit super() call to the no-arg parent constructor — unless you explicitly write super(...) or this(...). If the parent has no no-arg constructor, you MUST explicitly call super(args).',
    codeExample: `class Animal {
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
}`,
    tags: ['OOP', 'Constructors', 'Inheritance'],
  },
  {
    question: 'What happens if you invoke a static method on a null reference?',
    answer: 'It works fine — no NullPointerException! Static methods belong to the class, not the instance. The JVM resolves the call using the declared type of the reference, ignoring the fact that the reference is null. This is a common interview trick. However, this is considered bad practice — always call static methods on the class name, not a variable, for clarity.',
    codeExample: `class Utility {
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
System.out.println(Utility.greet()); // clear and unambiguous`,
    tags: ['Java', 'Static', 'Tricky'],
  },
  {
    question: 'What is the Object class? What are its key methods?',
    answer: 'java.lang.Object is the root of the Java class hierarchy — every class implicitly extends it. Key methods: equals(Object) — default: reference equality (==). hashCode() — default: typically derived from memory address (identity hash). toString() — default: ClassName@hexHashCode. clone() — shallow copy (protected, requires Cloneable). getClass() — returns the runtime Class object. wait()/notify()/notifyAll() — thread synchronization (class must hold the monitor). finalize() — deprecated GC hook. All these are available on every Java object.',
    codeExample: `Object obj = new Object();

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
System.out.println(System.identityHashCode(a)); // memory-based int`,
    tags: ['Java', 'Object', 'Fundamentals'],
  },
  {
    question: 'Why are Strings immutable in Java? What are the advantages?',
    answer: 'String is immutable because its value (char[]/byte[] in modern Java) is final and the class is final. Reasons for immutability: 1) String Pool: allows sharing of string literals — if strings were mutable, one reference changing the value would corrupt all references to it. 2) Thread safety: immutable objects can be shared across threads without synchronization. 3) Hash caching: String caches its hashCode — safe because the value never changes. 4) Security: class names loaded by ClassLoader, network connection parameters — must not be modifiable. 5) Key safety in HashMap: String keys cannot change after being inserted.',
    codeExample: `// Immutability demonstrated:
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
String result = sb.toString();`,
    tags: ['Strings', 'Immutability', 'JVM'],
  },
  {
    question: 'What is the transient keyword? What is the purpose of volatile in multithreading?',
    answer: 'transient: marks a field to be excluded from serialization. When an object is serialized (written to stream), transient fields are skipped and set to their default value on deserialization (null for objects, 0 for numbers, false for boolean). Use for: passwords, cached computed values, non-serializable objects (like InputStream), database connections. volatile: guarantees that reads/writes of the variable go directly to main memory, not a CPU cache. Ensures visibility across threads. Does NOT guarantee atomicity for compound operations (i++ is still not atomic).',
    codeExample: `// transient: excluded from serialization
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
// Use AtomicInteger for atomic increment`,
    tags: ['Serialization', 'Threading', 'Keywords'],
  },
  {
    question: 'What are NIO and BufferedReader? How does NIO differ from standard IO?',
    answer: 'Standard IO (java.io): stream-based, blocking — thread blocks waiting for data. BufferedReader wraps FileReader/InputStreamReader to buffer reads (reduces system calls, much faster for line-by-line reading). NIO (java.nio, Java 4+): channel-based, non-blocking. Key concepts: Channel (bidirectional data source/sink), Buffer (data container), Selector (monitor multiple channels with one thread). Use NIO for high-concurrency servers where blocking I/O would require one thread per connection. NIO.2 (Java 7): Files, Path, Paths — better file API.',
    codeExample: `// Standard IO with BufferedReader (buffered = efficient line reads)
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
}`,
    tags: ['IO', 'NIO', 'Performance'],
  },
  {
    question: 'Can we define an interface inside a class? A class inside an interface? Can an interface have constructors?',
    answer: 'Interface inside a class: YES — it becomes a member interface (static by default). Can be public, protected, private, or package-private. Class inside an interface: YES — it becomes a static nested class. Implicitly public and static. Interface constructors: NO — interfaces cannot have constructors because they cannot be instantiated. They can have static methods, default methods, and constants (implicitly public static final). This is because interfaces define a contract, not an implementation.',
    codeExample: `// Interface inside a class
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
// interface Foo { Foo() {} } // COMPILE ERROR`,
    tags: ['OOP', 'Interfaces', 'Nested Classes'],
  },
  {
    question: 'Difference between Abstraction and Encapsulation?',
    answer: 'Abstraction: hiding WHAT (complexity of implementation) — exposing only the essential features. Achieved via abstract classes and interfaces. "What it does." Example: List interface — you know it stores elements, you don\'t need to know if it\'s a linked list or array. Encapsulation: hiding HOW (internal data) — bundling data + methods and restricting access. Achieved via private fields + public getters/setters. "How it protects its data." Example: BankAccount with private balance field — balance can only be changed through deposit()/withdraw() methods.',
    codeExample: `// ABSTRACTION: hiding implementation complexity
interface PaymentGateway {
    boolean charge(double amount); // You know WHAT it does
    // You don't care if it uses Stripe, PayPal, or Braintree internally
}

class StripePayment implements PaymentGateway {
    public boolean charge(double amount) {
        // Complex Stripe API logic hidden from caller
        return stripeClient.createCharge(amount);
    }
}

// ENCAPSULATION: protecting internal state
class BankAccount {
    private double balance; // hidden — cannot be directly modified

    public void deposit(double amount) {
        if (amount > 0) balance += amount; // validation enforced
    }
    public void withdraw(double amount) {
        if (amount <= balance) balance -= amount;
    }
    public double getBalance() { return balance; } // read-only access
}
// Without encapsulation: account.balance = -1000; // anyone could corrupt state`,
    tags: ['OOP', 'Abstraction', 'Encapsulation'],
  },
  {
    question: 'What is the purpose of the static keyword? When NOT to use it?',
    answer: 'static: belongs to the CLASS, not to any instance. Static fields: shared across all instances. Static methods: can be called without instantiation. Static blocks: run once when class is loaded. Static nested classes: no reference to outer instance. When NOT to use static: when state must be per-instance (e.g. user sessions), when you need polymorphism (static methods are not overridden), when the class needs to be testable (static dependencies are hard to mock), when it holds mutable state (thread-safety issues — shared state is dangerous). Static fields that are mutable are effectively global state — a design smell.',
    codeExample: `// GOOD uses of static:
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
}`,
    tags: ['Java', 'Static', 'Design'],
  },
];

// ─── EXCEPTION HANDLING EXTRA ─────────────────────────────────────────────────
export const exceptionExtra2: QA[] = [
  {
    question: 'Can you have a try block without a catch block? Can a finally block be skipped?',
    answer: 'try without catch: YES, if followed by finally — try-finally is valid. The finally block always runs (cleanup code). try without both catch AND finally: compile error. Finally block CAN be skipped in two scenarios: 1) System.exit() is called inside the try/catch block — JVM shuts down immediately. 2) The JVM process is killed externally. 3) Infinite loop or deadlock in the try block (finally never reached but not "skipped" by design).',
    codeExample: `// try-finally (no catch) — valid
InputStream is = openStream();
try {
    processStream(is);
} finally {
    is.close(); // always runs, even if processStream throws
}

// try-with-resources (modern, preferred way):
try (InputStream is2 = openStream()) {
    processStream(is2);
} // auto-close — no need for explicit finally

// Finally CAN be skipped:
try {
    System.exit(0); // JVM shuts down — finally does NOT run
} finally {
    System.out.println("This never prints");
}

// Finally still runs even after return:
int getResult() {
    try {
        return 1;
    } finally {
        System.out.println("finally runs before return!"); // still executes
    }
}`,
    tags: ['Exceptions', 'Java', 'Fundamentals'],
  },
  {
    question: 'How to avoid NullPointerException? Can an Error be caught in Java?',
    answer: 'Avoid NPE: 1) Use Optional<T> instead of returning null. 2) Objects.requireNonNull() at method entry. 3) Use @NotNull/@NonNull annotations with IDE/static analysis. 4) Prefer empty collections over null. 5) Java 14+ helpful NPE messages tell exactly which variable was null. 6) Initialize fields to defaults. Can Error be caught: YES — Error extends Throwable, so you can catch it. But you SHOULD NOT catch most errors (OutOfMemoryError, StackOverflowError, etc.) because they indicate unrecoverable JVM conditions. Exception to the rule: catch ThreadDeath or OutOfMemoryError only in very specific frameworks that need to log the error and fail gracefully.',
    codeExample: `// Avoiding NPE:
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
// catch (OutOfMemoryError e) — almost never appropriate`,
    tags: ['Exceptions', 'NPE', 'Best Practices'],
  },
  {
    question: 'What is the difference between NoClassDefFoundError and ClassNotFoundException?',
    answer: 'ClassNotFoundException (checked): thrown when Class.forName(), ClassLoader.loadClass(), or loadClass() is called with a class name that does not exist in the classpath. Happens at runtime when you explicitly try to load a class dynamically. NoClassDefFoundError (error): class was present at compile time but missing at runtime. Happens when the JVM resolves a class reference that was compiled fine but the .class file is gone. Common cause: JAR in compile classpath but not runtime classpath, or a static initializer of a class threw an exception.',
    codeExample: `// ClassNotFoundException: explicit dynamic loading fails
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
// 3. Dependency conflicts: mvn dependency:tree`,
    tags: ['Exceptions', 'ClassLoader', 'JVM'],
  },
  {
    question: 'How do you create a custom exception? When to use checked vs unchecked?',
    answer: 'Checked exception (extends Exception): callers MUST handle or declare. Use when the caller can reasonably recover (file not found — try another path, network timeout — retry). Unchecked (extends RuntimeException): no forced handling. Use for programming errors the caller cannot recover from (invalid argument, illegal state). Best practice for custom exceptions: include a message and cause (wrapping), provide a specific name that describes the problem, keep them in a package.',
    codeExample: `// Checked exception: caller must handle or declare throws
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
}`,
    tags: ['Exceptions', 'Custom', 'Best Practices'],
  },
];

// ─── GENERICS EXTRA ───────────────────────────────────────────────────────────
export const genericsExtra: QA[] = [
  {
    question: 'What is the difference between List<?>, List<Object>, and List<? extends Object>?',
    answer: 'List<Object>: a list that HOLDS Object instances. Not substitutable for List<String> (generics are invariant). You can add any Object. List<?>: unbounded wildcard — "a list of some unknown type." You can read elements as Object, but CANNOT add anything (except null). Used when you just need to read. List<? extends Object>: upper-bounded wildcard — same as List<?>. It means "a list of some type that is a subtype of Object" (which is everything). Cannot add elements either. Key rule: List<String> IS a List<? extends Object> but is NOT a List<Object>.',
    codeExample: `// List<Object>: can add anything, but NOT compatible with List<String>
List<Object> objects = new ArrayList<>();
objects.add("hello");
objects.add(42);
// List<String> strings = objects; // COMPILE ERROR — invariance

// List<?>: read-only, accepts any list
void printAll(List<?> list) {
    for (Object o : list) System.out.println(o); // read as Object
    // list.add("x"); // COMPILE ERROR — cannot add to List<?>
}
printAll(new ArrayList<String>());   // OK
printAll(new ArrayList<Integer>());  // OK

// List<? extends Object>: same as List<?> — upper bounded wildcard
void sumSizes(List<? extends Collection<?>> list) {
    int total = list.stream().mapToInt(Collection::size).sum();
}

// Assignment compatibility:
List<String> strings = new ArrayList<>();
List<?> wildcard = strings;           // OK
List<? extends Object> extended = strings; // OK
// List<Object> objs = strings;       // COMPILE ERROR`,
    tags: ['Generics', 'Wildcards', 'Type Safety'],
  },
  {
    question: 'Why can\'t you create an array of generic types? Can you overload methods with List<Integer> and List<Double>?',
    answer: 'No generic arrays due to type erasure: at runtime, List<String>[] and List<Integer>[] both become List[]. The JVM cannot enforce element type safety. Creating generic array would allow storing wrong types without ArrayStoreException — defeats type safety purpose. Overloading with List<Integer> and List<Double>: NO. After type erasure, both become List — identical signatures at bytecode level. The compiler rejects this as a duplicate method.',
    codeExample: `// Cannot create generic array:
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
}`,
    tags: ['Generics', 'Type Erasure', 'Arrays'],
  },
];

// ─── GARBAGE COLLECTION EXTRA ─────────────────────────────────────────────────
export const gcExtra: QA[] = [
  {
    question: 'What are the types of Garbage Collectors in Java? Which is default in which version?',
    answer: 'Serial GC: single-threaded, stop-the-world. Good for small heaps, single-core. Parallel GC (Throughput GC): multi-threaded, stop-the-world for major GC. Default in Java 8. Best for batch processing. CMS (Concurrent Mark Sweep): mostly concurrent, low pause times. Deprecated in Java 9, removed in Java 14. G1 GC (Garbage First): default from Java 9+. Divides heap into equal-sized regions, collects regions with most garbage first. Balances throughput and latency. ZGC (Java 15+ production): sub-millisecond pauses, scales to multi-TB heaps. Shenandoah: concurrent compaction, low pauses. Virtual threads (Java 21+) favour G1/ZGC.',
    codeExample: `// Check current GC:
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
// -XX:+PrintGCDetails -Xlog:gc*:file=gc.log`,
    tags: ['GC', 'JVM', 'Performance'],
  },
  {
    question: 'What are Memory Leaks in Java? How do you prevent and detect them?',
    answer: 'Memory leak: objects are no longer needed but still referenced (GC cannot collect them). Common causes: 1) Static collections holding objects forever. 2) ThreadLocal not cleaned up in thread pool. 3) Listeners/callbacks registered but never deregistered. 4) Unclosed streams, connections. 5) Inner class holding implicit reference to outer class. 6) Cache growing without eviction. Detection: heap dump analysis (jmap + Eclipse MAT), profilers (JVisualVM, YourKit), actuator /heapdump endpoint.',
    codeExample: `// LEAK 1: static collection grows forever
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
// Open heap.hprof in Eclipse MAT → look for "Retained Heap" outliers`,
    tags: ['Memory', 'GC', 'Memory Leaks'],
  },
];

// ─── STREAMS / FUNCTIONAL EXTRA ───────────────────────────────────────────────
export const streamsExtra2: QA[] = [
  {
    question: 'Are streams slower than a for loop? What is the advantage of the Stream API?',
    answer: 'For simple sequential operations, a for loop is slightly faster (no stream pipeline overhead, no object creation). For complex operations, streams are comparable and sometimes faster (parallel streams). However, performance is rarely the reason to choose streams. Advantages: 1) Readability — declarative, expresses intent clearly. 2) Composability — chain operations elegantly. 3) Parallelism — add .parallel() without rewriting logic. 4) Lazy evaluation — intermediate operations only run when terminal op is called. 5) No boilerplate — no index variables, less bug surface.',
    codeExample: `// For loop (slightly faster for simple ops):
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
// JMH benchmark tip: measure with warmup; JIT often equalizes performance`,
    tags: ['Streams', 'Performance', 'Java 8'],
  },
  {
    question: 'UnaryOperator<T> vs Function<T,R>? BinaryOperator<T> vs BiFunction<T,U,R>?',
    answer: 'Function<T,R>: takes type T, returns type R (different types). UnaryOperator<T> extends Function<T,T>: input and output are the SAME type. Specialization for single-argument transformations on the same type. BiFunction<T,U,R>: takes two inputs of potentially different types, returns R. BinaryOperator<T> extends BiFunction<T,T,T>: all three types are the same. Common in reduce operations.',
    codeExample: `// Function<T,R>: T in, R out (can be different types)
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
    .reduce((a, b) -> a.length() >= b.length() ? a : b);`,
    tags: ['Functional', 'Streams', 'Java 8'],
  },
  {
    question: 'Lambda expression vs anonymous inner class: can lambdas access non-final local variables?',
    answer: 'Key differences: 1) Lambda: no new class generated — compiled as invokedynamic. this refers to enclosing class. Cannot have state/fields. Must implement a functional interface. 2) Anonymous class: new class file generated ($1, $2 etc.). this refers to anonymous class itself. Can have state. Can implement any interface or extend class. Variable capture: BOTH can only access effectively final local variables (explicitly final or never reassigned after declaration). Non-effectively-final: compile error. Reason: lambda/closure runs potentially on a different thread — local variable from stack might no longer exist.',
    codeExample: `// Lambda: this = enclosing class
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
// Or use AtomicInteger for thread-safe mutable capture`,
    tags: ['Lambda', 'Functional', 'Java 8'],
  },
  {
    question: 'What are short-circuiting operations in streams? Name all intermediate and terminal operations.',
    answer: 'Short-circuiting: operations that stop processing the stream early without consuming all elements. Terminal short-circuit ops: findFirst(), findAny() (stop at first match), anyMatch(), allMatch(), noneMatch(). Intermediate short-circuit: limit(n) (stops after n elements). All intermediate operations: filter, map, flatMap, mapToInt/Long/Double, distinct, sorted, limit, skip, peek, takeWhile (Java 9), dropWhile (Java 9). All terminal operations: collect, forEach, forEachOrdered, reduce, count, sum/min/max (primitive streams), findFirst, findAny, anyMatch, allMatch, noneMatch, toArray, iterator.',
    codeExample: `// Short-circuiting: stops early
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
    .forEach(System.out::println);`,
    tags: ['Streams', 'Short-circuit', 'Java 8'],
  },
];

// ─── THREADING EXTRA 2 ────────────────────────────────────────────────────────
export const threadingExtra2: QA[] = [
  {
    question: 'Can we start a thread twice? What happens if we call run() instead of start()?',
    answer: 'Start twice: NO — calling start() on an already-started thread throws IllegalThreadStateException. A Thread can only be started once; once it terminates, it cannot be restarted. Calling run() instead of start(): the run() method is executed on the CURRENT thread, not a new one. No new thread is created. This is a very common bug — to create a new thread, you must call start().',
    codeExample: `// Cannot start twice:
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
new Thread(task).start(); // another new Thread — fine`,
    tags: ['Threading', 'Thread Lifecycle'],
  },
  {
    question: 'Why are wait(), notify(), notifyAll() defined in Object class, not Thread?',
    answer: 'Because they are tied to the OBJECT\'S MONITOR LOCK, not the thread. Every Java object has an intrinsic lock (monitor). wait() releases the lock on the object it is called on and suspends the calling thread. notify() wakes one thread waiting on THAT object\'s lock. Since any object can serve as a lock (synchronized(anyObject)), wait/notify must be on Object. If they were on Thread, you could only synchronize on Thread instances. Design: locks are associated with shared data (the object), not with threads.',
    codeExample: `// wait/notify are on the shared resource (object), not on threads:
class SharedQueue<T> {
    private final Queue<T> queue = new LinkedList<>();
    private final int capacity;

    SharedQueue(int capacity) { this.capacity = capacity; }

    public synchronized void put(T item) throws InterruptedException {
        while (queue.size() == capacity) {
            wait(); // releases THIS object's lock, waits for notify on THIS
        }
        queue.add(item);
        notifyAll(); // wake threads waiting on THIS object
    }

    public synchronized T take() throws InterruptedException {
        while (queue.isEmpty()) {
            wait(); // wait on THIS queue object
        }
        T item = queue.poll();
        notifyAll();
        return item;
    }
}
// The lock is on the SharedQueue instance (the shared resource)
// Makes semantic sense: "wait for the queue to have space"`,
    tags: ['Threading', 'Monitor', 'Object'],
  },
  {
    question: 'What are the different ways to achieve synchronization in Java?',
    answer: '1) synchronized method — locks the object (or class for static). 2) synchronized block — lock on specific object, finer granularity. 3) ReentrantLock — explicit lock with tryLock, fairness, interruptible. 4) ReadWriteLock — multiple readers OR one writer. 5) StampedLock — optimistic reads (Java 8). 6) volatile — visibility only, no mutual exclusion. 7) Atomic classes (AtomicInteger, AtomicReference) — lock-free via CAS. 8) java.util.concurrent collections (ConcurrentHashMap, BlockingQueue). 9) Semaphore — limits concurrent access count. 10) CountDownLatch, CyclicBarrier — coordination primitives.',
    codeExample: `// 1. synchronized method
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
counter.incrementAndGet(); // CAS — atomic without lock`,
    tags: ['Threading', 'Synchronization', 'Concurrency'],
  },
  {
    question: 'synchronized vs ReentrantLock: key differences?',
    answer: 'synchronized: built-in language keyword, automatically releases lock on exit/exception, non-interruptible wait, cannot try to acquire, not fair by default, single condition. ReentrantLock: explicit lock/unlock (must be in finally!), tryLock(timeout) — avoid deadlocks, lockInterruptibly() — can be interrupted while waiting, fair mode (FIFO ordering), multiple Condition objects (like multiple wait queues). Use synchronized for simple cases. Use ReentrantLock when you need timeout, fairness, multiple conditions, or interruptible waiting.',
    codeExample: `// synchronized: simple, automatic release
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
// Much cleaner than a single wait/notify`,
    tags: ['Threading', 'Locks', 'ReentrantLock'],
  },
  {
    question: 'Concurrency vs Parallelism? submit() vs execute() in ExecutorService?',
    answer: 'Concurrency: multiple tasks are IN PROGRESS at the same time (interleaved on one or more CPUs via context switching). About managing multiple tasks. Parallelism: multiple tasks execute SIMULTANEOUSLY on multiple CPU cores. About using multiple processors. Java concurrency (threads) can be parallel on multi-core or concurrent (time-sliced) on single-core. submit() vs execute(): execute(Runnable) — fire and forget, no return value, unchecked exceptions swallowed. submit(Callable/Runnable) — returns Future, exceptions accessible via future.get(), can cancel the task. Always prefer submit() for tasks that may throw exceptions.',
    codeExample: `// Concurrency vs Parallelism:
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
voidFuture.get(); // blocks until done, returns null`,
    tags: ['Threading', 'ExecutorService', 'Concurrency'],
  },
];

// ─── SPRING EXTRA 2 ───────────────────────────────────────────────────────────
export const springExtra2: QA[] = [
  {
    question: 'What is ApplicationContext vs BeanFactory? What does @SpringBootApplication do internally?',
    answer: 'BeanFactory: basic container, lazy initialization by default. ApplicationContext: extends BeanFactory, adds: event publishing, internationalization, AOP, environment abstraction, eager initialization of singletons. Always use ApplicationContext. @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan. @Configuration marks it as a config class. @EnableAutoConfiguration triggers auto-configuration (reads META-INF/spring.factories). @ComponentScan scans the current package and sub-packages for @Component, @Service, @Repository, @Controller beans.',
    codeExample: `// @SpringBootApplication is a composite annotation:
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
ctx.publishEvent(new OrderCreatedEvent(order)); // event system`,
    tags: ['Spring', 'ApplicationContext', 'Annotations'],
  },
  {
    question: 'What is the difference between @Component, @Service, @Repository, and @Controller?',
    answer: 'All are specializations of @Component — they are all component-scan targets. Semantic differences: @Component: generic Spring bean. @Service: business logic layer (no technical difference from @Component). @Repository: data access layer — additionally enables automatic exception translation (DataAccessException wrapping). @Controller: Spring MVC controller, processes HTTP requests. @RestController = @Controller + @ResponseBody. IDE/framework tooling uses these annotations for documentation, static analysis, and AOP pointcut targeting.',
    codeExample: `// All found by component scan — only semantic/tooling difference:
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
}`,
    tags: ['Spring', 'Annotations', 'Stereotypes'],
  },
  {
    question: 'How does Spring handle circular dependencies? @Autowired vs @Inject?',
    answer: 'Circular dependency: A depends on B, B depends on A. Spring resolves field/setter injection circular deps by creating a partially-initialized bean proxy. Constructor injection circular deps CANNOT be resolved — Spring throws BeanCurrentlyInCreationException. Best fix: refactor (introduce a third class, use events, use lazy initialization @Lazy). @Autowired: Spring-specific, allows @Autowired(required=false). @Inject: JSR-330 standard (javax.inject), portable across DI frameworks. No required attribute. Functionally identical otherwise — @Inject is preferred for portability, @Autowired is more commonly seen in Spring code.',
    codeExample: `// Circular dependency: constructor injection fails
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
// @Inject has no required=false equivalent — use Optional<Cache> instead`,
    tags: ['Spring', 'DI', 'Circular Dependencies'],
  },
  {
    question: 'Setter injection vs constructor injection: when to use each?',
    answer: 'Constructor injection (preferred): dependencies are mandatory and immutable (final). Class is easier to test (pass mock in constructor). Clear dependencies visible at class definition. Cannot create a half-initialized object. Spring itself recommends constructor injection. Setter injection: use for optional dependencies, or when you have many dependencies making constructor large (though this signals a design smell — too many dependencies). Also needed when there are circular dependencies that cannot be resolved otherwise.',
    codeExample: `// PREFERRED: Constructor injection — final fields, immutable, testable
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
}`,
    tags: ['Spring', 'DI', 'Best Practices'],
  },
  {
    question: 'What is @Profile vs @ConditionalOnXXX? What is PUT vs PATCH? What is Swagger?',
    answer: '@Profile: activates a bean only when a specific Spring profile is active (spring.profiles.active=dev). @ConditionalOnProperty: activates based on property value. @ConditionalOnClass: if a class is in classpath. @ConditionalOnMissingBean: if no other bean of that type exists. More precise control than @Profile. PUT vs PATCH: PUT replaces the entire resource (idempotent, send full payload). PATCH partially updates (send only changed fields — not guaranteed idempotent). Swagger (OpenAPI): auto-generates interactive API documentation from Spring controller annotations. springdoc-openapi generates OpenAPI 3.0 spec and UI at /swagger-ui.html.',
    codeExample: `// @Profile: bean only active in 'dev' profile
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
public UserDTO getUser(@PathVariable Long id) { ... }`,
    tags: ['Spring', 'REST', 'Swagger'],
  },
  {
    question: 'Are singleton beans thread-safe? How to handle shared state in Spring beans?',
    answer: 'Singleton beans are NOT automatically thread-safe. Spring creates one instance per ApplicationContext, shared across all threads. If a singleton bean has mutable instance state (fields that change), concurrent requests can corrupt data. Rule: singleton beans should be stateless (all state in local variables or method parameters). If state is needed: use prototype scope, request/session scope, or synchronize access. ThreadLocal is used internally by Spring (RequestContextHolder, TransactionSynchronizationManager) to store per-thread/per-request state safely.',
    codeExample: `// DANGEROUS: mutable field in singleton bean
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
}`,
    tags: ['Spring', 'Thread Safety', 'Beans'],
  },
  {
    question: 'What is Spring Boot Actuator? How can you integrate it with Grafana?',
    answer: 'Spring Boot Actuator exposes production-ready endpoints for monitoring and management. Key endpoints: /actuator/health (DB, disk, Redis connectivity), /actuator/metrics (Micrometer metrics), /actuator/env (active properties), /actuator/loggers (change log level at runtime), /actuator/threaddump, /actuator/heapdump. Integration with Grafana: Actuator + Micrometer exports metrics to Prometheus (scraping endpoint /actuator/prometheus). Prometheus stores time-series data. Grafana queries Prometheus and displays dashboards. Add micrometer-registry-prometheus dependency.',
    codeExample: `# application.yml: expose endpoints
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
}`,
    tags: ['Actuator', 'Monitoring', 'Grafana', 'Prometheus'],
  },
  {
    question: 'What is AOP? What is a pointcut? How do you implement logging with AOP?',
    answer: 'AOP (Aspect-Oriented Programming): separates cross-cutting concerns (logging, security, transactions, caching) from business logic. Key terms: Aspect — the cross-cutting concern class (@Aspect). Advice — the code to run (Before, After, Around, AfterReturning, AfterThrowing). Pointcut — expression that selects which methods to intercept (where advice applies). JoinPoint — the specific point of execution (method call). Spring AOP uses proxy-based approach — only works on Spring-managed beans via public method calls.',
    codeExample: `@Aspect
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
// within(@Service *)                    — all @Service beans`,
    tags: ['AOP', 'Spring', 'Logging'],
  },
];

// ─── HIBERNATE / JPA EXTRA 2 ──────────────────────────────────────────────────
export const hibernateExtra2: QA[] = [
  {
    question: 'What is HQL? @Entity vs @Table? Session vs SessionFactory? get() vs load()?',
    answer: 'HQL (Hibernate Query Language): object-oriented query language operating on entities/fields, not tables/columns. Database-independent. JPA equivalent: JPQL. @Entity marks the class as JPA-managed. @Table(name="...") customizes the table name (optional — defaults to class name). Session: one-time use unit of work (like a request transaction). Opened from SessionFactory, must be closed. SessionFactory: heavyweight, thread-safe, one per application (JPA equivalent: EntityManagerFactory). get(): returns entity immediately or null — executes SELECT at once. load(): returns a proxy (lazy), SELECT deferred until first access — throws EntityNotFoundException if not found on access.',
    codeExample: `// HQL: works on entity names and field names, not tables
String hql = "FROM User u WHERE u.email = :email AND u.active = true";
List<User> users = session.createQuery(hql, User.class)
    .setParameter("email", "alice@example.com")
    .getResultList();

// HQL JOIN:
String hql2 = "SELECT o FROM Order o JOIN FETCH o.items WHERE o.user.id = :userId";

// @Entity vs @Table:
@Entity                          // required: marks as JPA entity
@Table(name = "app_users",       // optional: customize table name
       uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class User {
    @Id @GeneratedValue Long id;
    @Column(name = "user_email", nullable = false) String email;
}

// Session: per-request, per-transaction (like Connection)
Session session = sessionFactory.openSession();
Transaction tx = session.beginTransaction();
session.save(user);
tx.commit();
session.close(); // must close!

// get() vs load():
User u1 = session.get(User.class, 1L);   // immediate SELECT — null if not found
User u2 = session.load(User.class, 1L);  // returns proxy — SELECT deferred
u2.getName(); // SELECT happens HERE — throws if not found`,
    tags: ['Hibernate', 'JPA', 'HQL'],
  },
  {
    question: 'What are cascade types and the @EntityListeners annotation in Hibernate?',
    answer: 'Cascade: propagates operations from parent to child. CascadeType.PERSIST — save parent → save children. MERGE — merge parent → merge children. REMOVE — delete parent → delete children (dangerous for shared entities). REFRESH — refresh parent → refresh children. DETACH — detach parent → detach children. ALL = all the above. orphanRemoval=true: remove child from collection → delete from DB. @EntityListeners: registers a class to listen to JPA lifecycle events (@PrePersist, @PostPersist, @PreUpdate, @PostUpdate, @PreRemove, @PostLoad). Used for audit logging (createdAt, updatedAt).',
    codeExample: `// Cascade: parent controls children lifecycle
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
class Invoice { ... }`,
    tags: ['Hibernate', 'JPA', 'Cascade'],
  },
];

// ─── JMS EXTRA ────────────────────────────────────────────────────────────────
export const jmsExtra: QA[] = [
  {
    question: 'JMS: P2P vs Pub/Sub models, message reliability, poison messages, durable subscriptions?',
    answer: 'P2P (Point-to-Point): message goes to a QUEUE — only ONE consumer receives each message. Good for task distribution (one worker processes each order). Pub/Sub: message goes to a TOPIC — ALL subscribers receive each message. Good for event broadcasting (all audit services receive every event). Message reliability: persistent delivery (messages survive broker restart), acknowledgment modes (auto-ack vs manual), transaction support. Poison messages: messages that fail processing repeatedly. Handled via Dead Letter Queue (DLQ) — after max retries, message moved to DLQ for inspection. Durable subscription: subscriber receives messages published while it was offline (unlike non-durable which misses them).',
    codeExample: `// Spring JMS: P2P Queue
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
}`,
    tags: ['JMS', 'Messaging', 'Queue'],
  },
];

// ─── DESIGN PATTERNS EXTRA ────────────────────────────────────────────────────
export const designPatternsExtra2: QA[] = [
  {
    question: 'Abstract Factory vs Factory Method? What design patterns are used in JDK? Decorator pattern?',
    answer: 'Factory Method: defines an interface for creating ONE product, subclasses decide which class. Abstract Factory: creates FAMILIES of related objects without specifying their concrete classes. JDK patterns: Factory Method — Calendar.getInstance(), NumberFormat.getInstance(). Abstract Factory — look & feel UI (creates Button+Checkbox+TextField for a theme). Singleton — Runtime.getRuntime(). Decorator — BufferedReader(FileReader), InputStream wrappers. Adapter — InputStreamReader (byte stream → char stream). Iterator — Collection.iterator(). Observer — EventListener. Strategy — Comparator in Collections.sort(). Template Method — HttpServlet, AbstractList.',
    codeExample: `// Abstract Factory: create families of objects
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
}`,
    tags: ['Design Patterns', 'GoF', 'JDK'],
  },
  {
    question: 'What is Eventual Consistency? CQRS? Orchestration vs Choreography in Microservices?',
    answer: 'Eventual Consistency: in distributed systems, nodes may return stale data temporarily but will converge to the same state eventually (given no new updates). Preferred in AP systems (available + partition-tolerant). Examples: DNS, NoSQL databases, distributed caches. CQRS (Command Query Responsibility Segregation): separate read and write models. Commands modify state (write DB). Queries read from a separate optimized read model (denormalized, cached). Enables independent scaling. Orchestration vs Choreography: Orchestration — central orchestrator tells each service what to do (Saga orchestrator, easy to debug). Choreography — services react to events and decide own actions (decoupled, harder to trace).',
    codeExample: `// Eventual Consistency: reads may be stale
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
//   → InventoryService reacts → Reserved event → ShippingService reacts`,
    tags: ['Microservices', 'CQRS', 'Distributed Systems'],
  },
  {
    question: 'What is the Dependency Inversion Principle? Liskov Substitution Principle?',
    answer: 'DIP (D in SOLID): High-level modules should not depend on low-level modules — BOTH should depend on abstractions (interfaces). Abstractions should not depend on details; details should depend on abstractions. This IS Dependency Injection. LSP (L in SOLID): Objects of a subclass must be substitutable for objects of the superclass without breaking behavior. If S extends T, wherever T is used, S must behave correctly. Violations: subclass throws exceptions the parent doesn\'t, weakens preconditions, strengthens postconditions.',
    codeExample: `// DIP VIOLATION: high-level depends directly on low-level
class OrderService {
    private MySQLOrderRepository repo = new MySQLOrderRepository(); // direct dependency!
}

// DIP CORRECT: both depend on abstraction
interface OrderRepository { Order findById(Long id); void save(Order o); }

class OrderService {
    private final OrderRepository repo; // depends on abstraction
    OrderService(OrderRepository repo) { this.repo = repo; } // injected
}
class MySQLOrderRepository implements OrderRepository { ... }  // detail
class InMemoryOrderRepository implements OrderRepository { ... } // for tests

// LSP VIOLATION:
class Rectangle { int width, height; void setWidth(int w) { width=w; } }
class Square extends Rectangle {
    @Override void setWidth(int w) { width = w; height = w; } // breaks Rectangle contract!
}
// Code that works for Rectangle (setWidth ≠ setHeight) breaks for Square

// LSP CORRECT: use composition or separate hierarchy
interface Shape { int area(); }
class Rectangle implements Shape { ... }
class Square implements Shape { ... }   // separate, no violation`,
    tags: ['SOLID', 'Design Patterns', 'OOP'],
  },
  {
    question: 'What are Refresh Tokens? What is a stateless microservice?',
    answer: 'Refresh Tokens: long-lived tokens that obtain new Access Tokens without re-authentication. Access tokens are short-lived (15 min) for security. Refresh tokens live longer (7-30 days). Stored server-side (database/Redis) for revocation capability. Flow: Access token expires → client sends refresh token → server validates, issues new access token + optionally rotates refresh token. Stateless microservice: no server-side session state. Each request is self-contained (contains JWT with user info). Benefits: horizontal scaling (any instance handles any request), no session affinity/sticky sessions needed, easier to recover from failures. State goes to the client (JWT) or external stores (Redis, DB).',
    codeExample: `// Refresh token flow:
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
// Distributed locks → Redis/Zookeeper`,
    tags: ['Security', 'JWT', 'Microservices', 'Stateless'],
  },
];

// ─── MICROSERVICES EXTRA 2 ────────────────────────────────────────────────────
export const microservicesExtra2: QA[] = [
  {
    question: 'Microservices vs Monolith: when is each preferred? What is the 12-Factor App?',
    answer: 'Monolith: simple deployment, shared memory, easier debugging, lower latency. Choose when: small team, early-stage product, simple domain, low traffic. Microservices: independent deployment, technology diversity, independent scaling, team autonomy. Choose when: large team, complex domain with clear boundaries, different scaling needs per service, high availability requirements. Pitfall: microservices add distributed systems complexity — use only when you outgrow monolith. 12-Factor App: methodology for cloud-native apps — codebase in one repo, dependencies declared, config from env vars, backing services as attached resources, stateless processes, export via port binding, concurrency via process model, disposability, dev/prod parity, logs as streams, admin processes.',
    codeExample: `// 12-Factor: Config from environment (Factor 3)
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
// ✗ Unclear domain boundaries — premature decomposition leads to distributed monolith`,
    tags: ['Microservices', 'Architecture', '12-Factor'],
  },
  {
    question: 'Fault tolerance patterns in microservices: Circuit Breaker, Retry, Bulkhead, Rate Limiter?',
    answer: 'Circuit Breaker (Resilience4j): stops calling failing services. States: CLOSED (normal), OPEN (fast-fail, no calls), HALF_OPEN (test calls). Retry: automatically retries failed requests with exponential backoff + jitter. Use only for transient failures — do NOT retry non-idempotent calls without caution. Bulkhead: isolates failures by limiting concurrent calls per service. If inventory-service is slow, bulkhead prevents it from consuming all threads and starving other services. Rate Limiter: limits calls PER TIME WINDOW to prevent overloading downstream services.',
    codeExample: `// Resilience4j all four patterns combined:
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
        limit-refresh-period: 1s`,
    tags: ['Microservices', 'Resilience4j', 'Fault Tolerance'],
  },
  {
    question: 'How do you manage distributed tracing? How do you handle API versioning and rollback?',
    answer: 'Distributed Tracing: Micrometer Tracing (Spring Boot 3) + Zipkin/Jaeger. Every request gets a unique traceId propagated via HTTP headers (traceparent in W3C trace context). Each service span contributes to the trace. In Zipkin UI, you can see the entire request journey and identify slow spans. API Versioning: URL versioning (/api/v1/ vs /api/v2/), header versioning (Accept: application/vnd.app.v2+json), query param. Zero-downtime rollback: Blue-Green deployment (maintain two environments, switch traffic instantly), Canary release (route small % to new version, increase gradually), feature flags (disable feature without deployment).',
    codeExample: `# Micrometer Tracing + Zipkin (Spring Boot 3)
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
// kubectl patch service myapp -p '{"spec":{"selector":{"version":"green"}}}'`,
    tags: ['Microservices', 'Tracing', 'Deployment'],
  },
];

// ─── DATABASES (NEW TOPIC) ────────────────────────────────────────────────────
export const databasesExtra: QA[] = [
  {
    question: 'What is the difference between Clustered and Unclustered (Non-clustered) Indexes?',
    answer: 'Clustered index: determines the PHYSICAL ORDER of data in the table. Only one per table (data can only be sorted one way). In most databases, the primary key is the clustered index. Leaf nodes of the B-tree ARE the actual data rows. Fast for range queries on the index key. Non-clustered (unclustered) index: separate B-tree structure with pointers to data rows. Multiple per table allowed. Leaf nodes contain the index key + a pointer (row locator) to the actual row. Adds an extra lookup step ("bookmark lookup"). Good for occasional queries on non-PK columns.',
    codeExample: `-- Clustered index: data physically sorted by customer_id
CREATE TABLE customers (
    customer_id INT PRIMARY KEY,  -- clustered by default in most DBs
    name VARCHAR(100),
    email VARCHAR(100)
);

-- Non-clustered index on email (for email-based lookups)
CREATE INDEX idx_customer_email ON customers(email);
-- B-tree: email values sorted → each leaf has email + pointer to row

-- Range query: clustered index is fastest
SELECT * FROM customers WHERE customer_id BETWEEN 1000 AND 2000;
-- Rows are physically adjacent → sequential read (fast)

-- Email lookup: uses non-clustered index → extra lookup
SELECT * FROM customers WHERE email = 'alice@example.com';
-- 1. Scan idx_customer_email for email → get row pointer
-- 2. Fetch actual row using pointer (bookmark lookup)

-- Covering index: include all needed columns → no bookmark lookup needed
CREATE INDEX idx_email_name ON customers(email) INCLUDE (name);
-- SELECT name WHERE email = ? → served entirely from index (no row lookup)`,
    tags: ['Database', 'Indexes', 'Performance'],
  },
  {
    question: 'SQL vs NoSQL: key differences? ACID in databases? Materialized views?',
    answer: 'SQL: structured, schema-on-write, ACID transactions, relational (tables+joins). ACID: Atomicity (all or nothing), Consistency (rules enforced), Isolation (concurrent transactions don\'t interfere), Durability (committed data survives crashes). NoSQL: schema-flexible, BASE (Basically Available, Soft state, Eventually consistent), designed for horizontal scale. Types: Document (MongoDB), Key-Value (Redis), Column (Cassandra), Graph (Neo4j). Materialized view: a pre-computed, physically stored query result. Unlike regular views (virtual), materialized views store actual data on disk. Faster queries at the cost of storage + staleness (must be refreshed).',
    codeExample: `-- ACID example: bank transfer
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance - 100 WHERE id = 1; -- debit
UPDATE accounts SET balance = balance + 100 WHERE id = 2; -- credit
COMMIT; -- both or neither happen (Atomicity)
-- If crash between: ROLLBACK restores original state (Durability via WAL)

-- SQL (RDBMS): structured, joins
SELECT o.id, u.name, p.title FROM orders o
JOIN users u ON o.user_id = u.id
JOIN products p ON o.product_id = p.id
WHERE o.status = 'PENDING';

-- NoSQL (MongoDB document): no joins needed
{ _id: "order123", user: {id: "u1", name: "Alice"}, product: {title: "Book"} }
db.orders.find({status: "PENDING"})

-- Materialized view:
CREATE MATERIALIZED VIEW monthly_sales AS
SELECT DATE_TRUNC('month', order_date) AS month,
       SUM(total) AS revenue, COUNT(*) AS orders
FROM orders GROUP BY 1;

-- Refresh: REFRESH MATERIALIZED VIEW monthly_sales;
-- Query (fast — pre-computed): SELECT * FROM monthly_sales WHERE month = '2024-01-01';
-- Use case: dashboards, reports, aggregations that are expensive to compute live`,
    tags: ['Database', 'SQL', 'NoSQL', 'ACID'],
  },
  {
    question: 'What are SQL window functions? ROW_NUMBER vs RANK vs DENSE_RANK? CTE? Find Nth highest salary?',
    answer: 'ROW_NUMBER(): sequential number 1,2,3,4... no ties. RANK(): gaps on ties (1,1,3,4 — two rows rank 1, next is 3). DENSE_RANK(): no gaps on ties (1,1,2,3). CTE (Common Table Expression): named temporary result set defined with WITH clause. Improves readability for complex queries. Recursive CTEs enable hierarchical queries. Nth highest salary: use DENSE_RANK or ROW_NUMBER partitioned appropriately.',
    codeExample: `-- Nth highest salary (e.g. 3rd highest):
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
SELECT * FROM hierarchy;`,
    tags: ['SQL', 'Window Functions', 'CTE'],
  },
  {
    question: 'UNION vs JOIN? Subqueries vs Joins? Find duplicate records? NULL handling in SQL?',
    answer: 'JOIN: combines columns from multiple tables horizontally (adds columns). UNION: combines rows from multiple queries vertically (stacks rows). UNION removes duplicates; UNION ALL keeps them. Both must have same column count and compatible types. Subquery vs Join: subqueries are often less efficient (executed per row for correlated subqueries); joins with proper indexes are usually faster. Duplicates: use GROUP BY + HAVING COUNT(*) > 1. NULL: NULL ≠ NULL in SQL (NULL = NULL is NULL, not true). Use IS NULL / IS NOT NULL. Functions: COALESCE(x, default) returns first non-null. NULLIF(x, y) returns null if x=y.',
    codeExample: `-- UNION: stack rows
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
SELECT COUNT(*), COUNT(phone) FROM users; -- different if phone has NULLs`,
    tags: ['SQL', 'Joins', 'NULL', 'Duplicates'],
  },
  {
    question: 'What is database sharding? Sharding vs Replication? Database versioning in microservices?',
    answer: 'Sharding: horizontal partitioning — data split across multiple databases (shards) based on a shard key (e.g. userId % 4). Each shard holds a subset of data. Allows horizontal scaling of writes. Replication: copies of the same data on multiple servers. Read replicas: writes go to primary, reads distributed. High availability: failover to replica if primary fails. Use sharding for write scale. Use replication for read scale + HA. Database versioning (microservices): Flyway/Liquibase for versioned SQL migrations. Backward-compatible changes: add columns (nullable), create new tables. Breaking changes: add new column → deploy service → migrate data → drop old column.',
    codeExample: `-- Sharding by userId:
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
-- Never modify applied migrations — always add new version files`,
    tags: ['Database', 'Sharding', 'Replication', 'Migration'],
  },
  {
    question: 'What is database denormalization? What are Views and their limitations? Procedure vs Function?',
    answer: 'Normalization: eliminate redundancy by splitting data into related tables. Denormalization: intentionally add redundancy to improve read performance — fewer joins. Use when: query performance is critical, data is read much more than written, analytics/reporting workloads. Views: virtual table defined by a query. Benefits: abstraction, security (hide columns), simplify complex queries. Limitations: cannot index in most DBs, no built-in caching, updatable view rules are complex. Procedure vs Function: Function always returns a value, can be used in SELECT. Procedure performs actions, no mandatory return, can return via OUT params, cannot be used in SELECT.',
    codeExample: `-- Normalization (3NF):
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
CALL archive_old_orders('2023-01-01'); -- called with CALL, not in SELECT`,
    tags: ['Database', 'SQL', 'Views', 'Procedures'],
  },
  {
    question: 'What are different JDBC statement types? What is connection pooling?',
    answer: 'Statement: for static SQL, no parameters. Vulnerable to SQL injection. PreparedStatement: pre-compiled, parameterized — prevents SQL injection, better performance (reused execution plan). Use for any user input. CallableStatement: for stored procedures. Connection Pooling: maintaining a pool of pre-opened database connections that are reused. Opening a new DB connection is expensive (~100ms). Pool keeps connections open, lends them out and returns. HikariCP (Spring Boot default): fastest Java connection pool. Key settings: maximumPoolSize, minimumIdle, connectionTimeout, maxLifetime.',
    codeExample: `// Statement: static SQL (NEVER use with user input!)
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
// hikaricp.connections.pending > 0 → all connections in use → scale up pool`,
    tags: ['JDBC', 'Database', 'Connection Pool'],
  },
];
