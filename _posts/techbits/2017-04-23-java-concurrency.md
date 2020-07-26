---
layout: post
title:  "Java - Concurrency in a Nutshell"
date:   2017-04-23 15:42:18 +0530
categories: techbits
excerpt: This is the first of a series of discussions on concurrency in general and how those concepts areemployed in the Java ecosystem.
---

## Introduction

Concurrent processing is simply understood as executing multiple tasks simultaneously. The primary intention of implementing concurrent processing is to increase the throughput of a system. Thereby, the efficiency of the system could be elevated drastically, like introducing more lanes instead of a single lane, would increase the number of vehicles that could take that road at once.

## Core Concepts

There are a few key concepts that need clarification prior to proceed in this discussion and narrow down the scope. Those concepts are discussed below.

### Processor Architecture

Within a processor assembly, there exists the execution core. Based on the architecture of the processor, the number of execution cores might vary from one to many. This could be understood as a tunnel for the sake of simplicity. A tunnel which is wide enough for only one person to walk along could be comprehended as a single execution core, while a parallel set of such singular tunnels could be comprehended as a processor having multiple execution cores. Irrespective of whether there is only one execution core or there are many, concurrent processing is possible.

### Processes & Threads

There are two basic units in common jargon of concurrency, namely Process and Thread. Within the Java environment, most concurrent implementation works with threads. Nevertheless, processes are also quite important when it comes to concurrent processing. These two could be differentiated as follows.

#### Processes

A process has a self-contained execution environment, which generally includes a complete, private set of basic run-time resources. These resources are usually contained in a private memory space.

Processes sometimes appear to be synonymous with the terms *program* and *application* in certain contexts. However, what a user might see as a whole program/application is actually a cooperating set of processes which run independently. For the program to function, these processes are communicating among each other using certain mechanisms such as pipes and sockets. This as a whole is identified as *Inter-Process Communication* (IPC) and this is one important concept to take into account within a multi-processing environment.

Within the Java Virtual Machine (JVM) most of the implementations are done as single-process implementations. Creating separate processes is possible with the utilization of ProcessBuilder and so forth.

#### Threads
Within a single process, there may be certain segments of instructions that could be executed in parallel. These segments of instructions are treated as a *Thread* in terms of multi-processing. Threads are precisely segments of a process. In fact, the original sequence of instructions of a process alone is treated as a thread. Then, this thread is broken down into many threads so that those could be executed in parallel. In that sense, a thread could also be comprehended as a *lightweight process*.

All these threads which belong to a single process share the same memory space and the same set of resources which are owned by the process. This makes it very efficient as well as potentially problematic when multi-threading is implemented. Conceptual aspects of some of these problems are discussed under the topics race conditions, deadlocks and livelocks.

Leaning towards Java, *Multithreaded execution is an essential feature of the Java platform. Every application has at least one thread — or several if you count system threads that do things like memory management and signal handling* according to the [Javadoc](http://docs.oracle.com/javase/tutorial/essential/concurrency/procthread.html). What is implemented in JVM using Java, is a main thread, which the other threads are eventually created from, if and whenever required. This is on the programmer.

## Concepts related to Possible Problems

### Race Condition

There are certain code segments in threads named critical segments. When multiple threads execute simultaneously, the order of execution of each threads critical segments would impact the final result of the code execution. To simplify this, let us assume that there are three Threads namely `T1`, `T2` and `T3`. Let us also assume that the critical segments of each of these threads are named `CT1`, `CT2` and `CT3` respectively. Then, when these threads execute in parallel, the critical sections being executed in the order `CT1 -> CT2 -> CT3` would yield a different result from `CT1 -> CT3 -> CT2`. Such a scenario is well known as a Race Condition in concurrency terminology. The [*Dining Philosophers’ Problem*](https://en.wikipedia.org/wiki/Dining_philosophers_problem) is also a prominent example of a race condition.

### Deadlock

Deadlock is precisely a problem which arises due to incorrect application of mechanisms which are implemented to overcome Race Conditions. Assume that 
 
 - two groups (namely A and B), each group comprising of two people are working on two different handcraft tasks. 
 - there is only one pair of scissors and only one paperknife. 
 - group A would need only the pair of scissors during the first half of their work and they would need both the pair of scissors and the paperknife during the latter half of their work. 
 - group B would need only the paperknife during the initial half of their work and then both during the latter half. 
 - group A starts to work and before they reach the point where they would need the paperknife, group B starts their work. 

Now it is obvious that when group A reaches to the point where they need the paperknife, the paperknife is not available leaving them waiting for paperknife. Similarly, when group B reaches the point where they need the pair of scissors, they also will have to pause and wait until the pair of scissors is available. Effectively, no group is working and yielding any result. Such a blocked situation arise in a program that is run in multiple threads/processors is known as a Deadlock. This could be overcome only either one of

 - Making sure that the two groups start their work in some way that they wouldn’t hold on to the apparatus that the other group would need.
 - When a deadlock occurs, either one of the parties giving up what they are already holding on to.

### Livelock

Livelock is somewhat similar to a deadlock, except the fact that the threads which are interfering with each other are continuously working, unlike in a deadlock situation. This could be mapped to a real-world situation of two watchmen `WA` & `WB`, who are watching a room which is having two doors `DA` & `DB`, where each door can only be locked from inside and unlocked from outside.

 - Each watchman is responsible for only one door. 
 - When both the doors are open, `WA` would go in, lock his responsible door `DA` and walk out of the room, leaving `DB` open. 
 - For `WB` to lock `DB` and come out, `DA` should remain open. So `WB` would open up `DA`, walk in, lock `DB` and walk out from `DA`, leaving `DA` open again.
 - Now `WA`'s duty is in jeopardy, which would make him unlock `DB`, walk in, lock `DA` and come out from `DB`.
 
This would continue to happen, leaving both watchmen to continuously attend the work. If the two watchmen are assumed to be two threads, they would continuously work to achieve their outputs. Livelock is precisely a result of poor utilization of threads during programming. A similar problem is discussed in Javadoc under the topic livelocks.

### Starvation

Starvation occurs when certain threads in a multithreaded environment are unable to make progress due to unavailability of resources and this unavailability is occurred because of other threads which hold onto the resources. These threads, which holds on to resources on a long term basis are known as greedy threads.

## Synchronization

Primarily, two types of errors/problems are possible due to attempts of concurrency. Those are namely,

 - ***Thread Interference***: Happens when two operations, running in different threads but acting on the same data, interleave. This means that the two operations consist of multiple steps, and the sequences of steps overlap. Interleaving refers to alternatively executing statements from both threads. It is important to note that even a single statement in a Java source might compile and interpret into multiple machine instructions during execution. This might lead to a race condition as discussed above.
 - ***Memory Inconsistency Errors***: Occur when different threads have inconsistent views of what should be the same data. One possible result is a livelock.

In the core of Java, it has an implementation to dodge this kind of scenarios. That is the utilization of the `synchronized` keyword. Synchronized methods enable a simple strategy for preventing thread interference and memory consistency errors. If an object is visible to more than one thread, *all reads or writes to that object’s variables could be done through synchronized methods*. When a method is modified with this, it ensures the execution of the method will be atomic, as the thread would acquire and hold on to the intrinsic lock of the respective object instance/class, until the end of the synchronized method/block. This strategy is effective but can present problems with liveness.

### Atomic Access

Atomic access in Java refers to as a pre-demarcated block of codes execute without interleaving in the midway. In a simpler explanation, let us assume that when you write an essay your mother is asking you to help her with another chore. There, if you pause the writing the essay and attend to her work and then come back to your work, essay writing task is interleaved in the midway. That is considered as non-atomic because the task is not executed at once. Happening this in a multithreaded is the reason for most of the problems. Ensuring a block is which is meant to run at once, runs at once is known as atomic execution/access.

## Happens-Before Guarantee

let us say that there are two threads `TA` & `TB` and a variable named `VA` where `TA` writes a value to `VA` and subsequently `TB` reads `VA` (note `TA` writing on `VA` is followed by `TB` reading `VA` is the order that the programmer wants this to be). This would be something as follows.

```
TA WRITE(VA)

TB READ(VA)
```

Typically, to ensure the efficient switching between threads, JVM may or may not reorder the instructions from two threads to get the best out of it. In such a scenario it is possible that the execution order of the two instructions would be flipped, as follows:

```
TB READ(VA)

TA WRITE(VA)
```

In the second case, it is obvious that what is read by `TB` is actually an incorrect value, which is later changed to the real value by `TA`. To void this from happening, it is important to ensure instruction 1 happens before instruction 2. There are few occasions that this guarantee is essential in a multithreaded environment.

 1. Blocks of codes from two threads accessing the same object
 2. Volatile reads and  writes
 3. Thread starting
 4. Thread joining
 5. Intrinsic Locks

The intrinsic lock is which Java’s concurrency controlling is built around. This is a singleton entity that is implemented by the JVM for each class and for each object instance. This lock is acquired by the thread that invokes methods/access variables of the particular class. Simplified, assume that there is an object instance `A`, which is accessed by a thread `TA`, to invoke a method in `A`. First the intrinsic lock of `A`, should be acquired by the thread. Then only the thread is able to execute the methods/blocks. If the lock is already acquired by a different thread, all threads who are expecting to access the synchronized methods/blocks have to wait until the lock is released.

Implementation of this lock is done at both class level and instance level. For class members (static members), the thread that accesses should acquire the class’s intrinsic lock and for instance members, the thread that accesses them should acquire the object lock.

## Volatility

Generally in computer science, volatility refers to data retention being dependent on the existence of electricity/voltage. Java uses volatility however, with a different face given to it. Members (i.e. attributes) modified with volatile ensures that all cached copies of the volatile members are synchronized with the main memory. This, in other words, means that the data is not read/written thread-locally (the thread’s private memory space), instead directly written and read from the main memory. This affects on all of the assignments/writes prior to writing the volatile variable as well. When a volatile variable is written, values of all the other variables are flushed to the main memory as well. Look at the below pieces of snippets.

```java
public class Shared {
    public int a;
    public int b;
    public volatile int c;
}
```

Here, the variable `c` is declared volatile. Hence, when `c` is written, `a` and `b` also are written to the main memory before `c`. Beyond Java 5, volatile gives you the happens-before guarantee as well.

That’s all for the time being folks! Await for an in-depth, detailed discussion on how Java implements these concepts along with some examples…