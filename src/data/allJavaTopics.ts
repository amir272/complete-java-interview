/**
 * Merges base javaTopics with all extra Q&As from javaTopicsExtra, javaTopicsExtra2, javaTopicsExtra3 and javaTopicsExtra4.
 * Import from this file instead of javaTopics.ts for the full question set.
 */
import { javaTopics, JavaTopic } from './javaTopics';
import {
  coreJavaExtra,
  collectionsExtra,
  threadingExtra,
  java8Extra,
  springBootExtra,
  springDataExtra,
  messagingExtra,
  microservicesExtra,
  enumsExtra,
  exceptionHandlingExtra,
} from './javaTopicsExtra';
import {
  coreJavaExtra2,
  exceptionExtra2,
  genericsExtra,
  gcExtra,
  streamsExtra2,
  threadingExtra2,
  springExtra2,
  hibernateExtra2,
  jmsExtra,
  designPatternsExtra2,
  microservicesExtra2,
  databasesExtra,
} from './javaTopicsExtra2';
import {
  threadingExtra3,
  junitExtra,
  oopEdgeCasesExtra,
  enumSerializationExtra,
  genericsExtra2,
  collectionsExtra2,
  java8Extra2,
  springExtra3,
  springSecurityExtra,
  productionExtra,
} from './javaTopicsExtra3';
import {
  springBatchExtra,
  springCloudDeepExtra,
  cachingExtra,
  dbMigrationsExtra,
  modernApisExtra,
  securityDeepExtra,
  distributedSystemsDeepExtra,
  jvmTuningExtra,
  kubernetesDeepExtra,
  awsDeepExtra,
  observabilityExtra,
  testingDeepExtra,
  classLoaderReflectionExtra,
} from './javaTopicsExtra4';

function mergeInto(topics: JavaTopic[], id: string, extra: JavaTopic['questions']): JavaTopic[] {
  return topics.map(t =>
    t.id === id ? { ...t, questions: [...t.questions, ...extra] } : t
  );
}

export const allJavaTopics: JavaTopic[] = (() => {
  let topics = [...javaTopics];

  // Merge extra batch 1
  topics = mergeInto(topics, 'core-java',       coreJavaExtra);
  topics = mergeInto(topics, 'collections',     collectionsExtra);
  topics = mergeInto(topics, 'threading',       threadingExtra);
  topics = mergeInto(topics, 'java8',           java8Extra);
  topics = mergeInto(topics, 'spring-boot',     springBootExtra);
  topics = mergeInto(topics, 'spring-data',     springDataExtra);
  topics = mergeInto(topics, 'microservices',   microservicesExtra);

  // Merge extra batch 2
  topics = mergeInto(topics, 'core-java',       coreJavaExtra2);
  topics = mergeInto(topics, 'core-java',       genericsExtra);
  topics = mergeInto(topics, 'core-java',       gcExtra);
  topics = mergeInto(topics, 'threading',       threadingExtra2);
  topics = mergeInto(topics, 'java8',           streamsExtra2);
  topics = mergeInto(topics, 'spring-boot',     springExtra2);
  topics = mergeInto(topics, 'spring-data',     hibernateExtra2);
  topics = mergeInto(topics, 'design-patterns', designPatternsExtra2);
  topics = mergeInto(topics, 'microservices',   microservicesExtra2);
  topics = mergeInto(topics, 'databases',       databasesExtra);

  // Merge extra batch 3
  topics = mergeInto(topics, 'threading',       threadingExtra3);
  topics = mergeInto(topics, 'core-java',       oopEdgeCasesExtra);
  topics = mergeInto(topics, 'core-java',       genericsExtra2);
  topics = mergeInto(topics, 'collections',     collectionsExtra2);
  topics = mergeInto(topics, 'java8',           java8Extra2);
  topics = mergeInto(topics, 'spring-boot',     springExtra3);
  topics = mergeInto(topics, 'spring-security', springSecurityExtra);
  topics = mergeInto(topics, 'spring-boot',     productionExtra);
  
  // Merge extra batch 4
  topics = mergeInto(topics, 'spring-boot',      springBatchExtra);
  topics = mergeInto(topics, 'spring-cloud',     springCloudDeepExtra);
  topics = mergeInto(topics, 'spring-boot',      cachingExtra);
  topics = mergeInto(topics, 'databases',        dbMigrationsExtra);
  topics = mergeInto(topics, 'microservices',    modernApisExtra);
  topics = mergeInto(topics, 'spring-security',  securityDeepExtra);
  topics = mergeInto(topics, 'system-design',    distributedSystemsDeepExtra);
  topics = mergeInto(topics, 'core-java',        jvmTuningExtra);
  topics = mergeInto(topics, 'docker-k8s',       kubernetesDeepExtra);
  topics = mergeInto(topics, 'aws',              awsDeepExtra);
  topics = mergeInto(topics, 'microservices',    observabilityExtra);
  topics = mergeInto(topics, 'core-java',        classLoaderReflectionExtra);

  // Add new standalone topics (not in base javaTopics.ts)
  topics = [
    ...topics,
    {
      id: 'exception-handling',
      title: 'Exception Handling',
      icon: '⚠️',
      color: '#F4511E',
      description: 'Checked vs unchecked, try-with-resources, custom exceptions, suppressed exceptions.',
      questions: [...exceptionHandlingExtra, ...exceptionExtra2],
    },
    {
      id: 'enums',
      title: 'Enums & Serialization',
      icon: '🔢',
      color: '#7C4DFF',
      description: 'Enum internals, patterns, serialization, generics, and type system.',
      questions: [...enumsExtra, ...enumSerializationExtra],
    },
    {
      id: 'messaging',
      title: 'Messaging & Kafka',
      icon: '📨',
      color: '#00897B',
      description: 'Kafka internals, RabbitMQ vs Kafka, JMS, idempotent producers, consumer lag.',
      questions: [...messagingExtra, ...jmsExtra],
    },
    {
      id: 'testing',
      title: 'Testing & JUnit',
      icon: '🧪',
      color: '#00BCD4',
      description: 'Unit testing, mocks vs stubs, JUnit 5, testing Spring Boot, async testing.',
      questions: [...junitExtra, ...testingDeepExtra],
    },
  ];

  return topics;
})();
