---
layout: post
title:  "#::3-Generics"
date:   2020-03-27 15:42:18 +0530
categories: techbits
excerpt: A deep dive into the concept of Generics, and a glance at under the hood of C# and Java, to slightly improve the understanding on how these two implements the concept of Generics.
---

Some time back, I wrote about stacks and how to implement them. There, I have promised at the end that I will improve our current implementation using generics. This, I write to keep that promise. The initial part of this, I am going to discuss some technical aspects related to generics in C# and Java. For those who are less interested in that part, you can jump into the implementation straight away. Let’s get started. First of all, I am going to take a look at a simple method `void Swap()` that is used to swap two references.

```c#
void Swap(Integer lhs, Integer rhs) {
    Integer tmp = lhs;
    lhs = rhs;
    rhs = tmp;
}
```

All about this method looks fine except that it can Swap only integer object references. That simply tells us that if we have other types of objects (for instance say `Float`), you will need other methods to be implemented with almost similar body, and blatantly violate one of the key principles of coding practices DRY (AKA Don’t Repeat Yourself) and end up having to do Shotgun Surgery. DUH! Can we really improve this to have only one implementation that is reusable across different types? Just look at the three implementations of `Swap()` method given below for `Integer`, `Person` and `Car`.

```c#
class Utility {
    void Swap(Integer lhs, Integer rhs) {
        Integer tmp = lhs;
        lhs = rhs;
        rhs = tmp;
    }
    void Swap(Person lhs, Person rhs) {
        Person tmp = lhs;
        lhs = rhs;
        rhs = tmp;
    }
    void Swap(Car lhs, Car rhs) {
        Car tmp = lhs;
        lhs = rhs;
        rhs = tmp;
    }
}
```

The obvious difference in the three methods is the type of the parameters lhs and rhs being passed and the type of the variable tmp. That is where Generics come into play. Generics is a notation/syntactical component of most programming languages, that allows developers to specify the type parameters. In C#, we could easily rewrite the methods given above in to follows.

## Generic Methods

```c#
class Utility {
    void Swap<T>(T lhs, T rhs) {
        T tmp = lhs;
        lhs = rhs;
        rhs = tmp;
    }
}
```

Here, `<T>` is the syntactical nuance that enables specifying type annotations. `T` acts just as a variable and allows a level of abstraction, which enables better reuse of code. In other words, if (god forbid) the logic of swapping happened to change over time, we will have to go and stitch only one bleeding wound except for multiple. That makes our code much much easier to maintain. When this method is invoked during runtime, different things happen under the hood, depending on the language under consideration. For the case of C#, the translated result into Intermediate Language (IL) would look something like follows. (thanks to https://sharplab.io for the output)

```c#
.class private auto ansi '<Module>'
{
} // end of class <Module>
.class private auto ansi beforefieldinit Utility
    extends [System.Private.CoreLib]System.Object
{
    // Methods
    .method private hidebysig 
        instance void Swap<T> (
            !!T lhs,
            !!T rhs
        ) cil managed 
    {
        // Method begins at RVA 0x2050
        // Code size 10 (0xa)
        .maxstack 1
        .locals init (
            [0] !!T
        )
        IL_0000: nop
        IL_0001: ldarg.1
        IL_0002: stloc.0
        IL_0003: ldarg.2
        IL_0004: starg.s lhs
        IL_0006: ldloc.0
        IL_0007: starg.s rhs
        IL_0009: ret
    } // end of method Utility::Swap
    .method public hidebysig specialname rtspecialname 
        instance void .ctor () cil managed 
    {
        // Method begins at RVA 0x2066
        // Code size 8 (0x8)
        .maxstack 8
        IL_0000: ldarg.0
        IL_0001: call instance void [System.Private.CoreLib]System.Object::.ctor()
        IL_0006: nop
        IL_0007: ret
    } // end of method Utility::.ctor
} // end of class Utility
```

As it is clearly visible, we don’t see much difference in the IL code also, with regard to generics. So, as we can obviously conclude, the thing happens during the runtime. The .NET Common Language Runtime (CLR) will generate object code, with overrides for each invocation with different types, of our swap method, as if we wrote our C# code like in the first code snippet. In other words, in runtime, each different specialization of the method is treated as a different method of the same class. This same example written in Java would look quite close to identical. You already know that syntactical rules are very much similar in C# and Java. So, the almost identical looks should not be suprising.

```java
class Utility {
    void <T> swap(T lhs, T rhs) {
        T tmp = lhs;
        lhs = rhs;
        rhs = tmp;
    }
}
```

Unlike the .NET CLR, Java Runtime Environment (JRE) takes a different avenue in handling generics. It does something called type erasure. Even though the type parameters are specified in the code, all of them will be erased during the compile time. Generally, type erasure will replace the references to the type parameter `T` with Object for `T` is not bound. `T` will be replaced with the upper bound type. Further details and edge cases are discussed below.

## Generic Classes

When you have a generic class instantiated, the runtime will generate a specialized version of the said class with the specific parameters. How it is done exactly, varies on whether the type parameters are value type or reference type. No matter what, the compiler will only generate a single generic type into the assembly. During the runtime, a separate set of static fields will be allocated for each type parameter of the generic class. How many different versions of the generic class will be generated depends on whether the type parameters are value type or reference type where,

 - for each value type parameter invocation, there will be a dedicated version of the generic class
 - all reference type parameter invocations will share the same version of the generic class (because the reference types have the same size)

In other words, a class `Sample<T>`, initialized as follows would cause in having three different versions during the runtime.

```java
Sample<int> s1 = new Sample<int>();
Sample<float> s1 = new Sample<float>();
Sample<Person> s1 = new Sample<Person>();
```

## Type Constraints in C#

Constraining is about limiting the possible values that each type parameter could take during the runtime. For an instance, a method `void Swap<T>()` can have any type for the parameter `T`. If we need to restrict this, we could do it like `void Swap<T>() where T : Person`. Now, `T` can’t be just anything. It should be anything that extends `Person`. Otherwise it will cause errors during compile time. In fact, these constraints could be categorized into four (04) as follows.

 - Reference Type Constraints – Restricts the type arguments to be only reference types. In the example below, the 3rd line will cause in The type `'int' must be a reference type in order to use it as parameter 'T' in the generic type or method 'Sample<T>'` during compile time.

```c#
class Sample<T> where T : class {}

Sample<Integer> intSample = new Sample<Integer>(); // Valid
Sample<int> intSample = new Sample<int>(); // Invalid
```

 - Unmanaged Type Constraints – Similar to previous one this time, type arguments only which are of non-nullable [unmanaged types](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/unmanaged-types) are allowed now.

```c#
class Sample<T> where T : class {}

Sample<Integer> intSample = new Sample<Integer>(); // Invalid
Sample<int> intSample = new Sample<int>(); // Valid
```

 - Constructor Type Constraints – This will check if the given type parameter `T` has a parameter-less default constructor, for each `T` is any non-static, non-abstract class without any explicitly declared constructors and for any non-abstract class with an explicit public parameter-less constructor. This should be the  last constraint defined for a generic type. Below, line number 7 will cause in `'string' must be a non-abstract type with a public parameterless constructor in order to use it as parameter `T` in the generic type or method 'Program.CreateInstance<T>()'` during compile time.

```c#
public static T CreateInstance<T>() where T : new() {
    return new T();
}
int newInt =  CreateInstance<int>();      //(5) Valid
object newObj = CreateInstance<object>(); //(6) Valid
string newStr = CreateInstance<string>(); //(7) Invalid: string DOES NOT have parameter-less public constructor
```

 - Conversion Type Constraints – This is the most complex form of constraints. The conversion can be done based on identity, reference and boxing. To clarify this a bit, let’s consider the below example.

```c#
using System;

public class Program {
    public static void Main() {
        Sample<A> s1 = new Sample<A>();          // ---(1.1)
        Sample<C> s2 = new Sample<C>();          // ---(1.2)
    }
}
public class Sample<T> where T : IComparable<T> { }
```

Lines highlighted with comment 1.x in the above provides examples of  of boxing conversion. 1.1 above is valid because the class Sample expects a type parameter `T` that implements the interface `System.IComparable<T>` and the type parameter is int which is boxed into the struct `System.Int32`, that implements `IComparable<Int32>`.  This is because of the nature of the CLR on how it handles boxing. According to the doc on Boxing and Unboxing, **Boxing is the process of converting a value type to the type object <u>or to any interface type implemented by this value type</u>**. The underlined latter part of the sentence clears it off.

```c#
using System;

public class Program {
    public static void Main() {
        Sample<B> s1 = new Sample<B>();          // ---(2.1)
        Sample<C> s2 = new Sample<C>();          // ---(2.2)
    }
}

public class Sample<T> where T : IX { }
public interface IX<T> { }
public interface IX { }
public class A : IX<A> { }
public class B : A, IX { }
public class C { }
```

Now, class `Sample` expects a type parameter which is of type `IX`. This form of conversion is called reference type conversion. `B` implements the interface `IX` and hence 2.1 will be valid, while 2.2 will cause a compile time error because, `C` does not implement `IX`.

```c#
using System;

public class Program {
    public static void Main() {
        Sample<A> s1 = new Sample<A>();          // ---(3.1)
        Sample<B> s2 = new Sample<B>();          // ---(3.2)
        Sample<C> s3 = new Sample<C>();          // ---(3.3)
    }
}

public class Sample<T> where T : A { }
public interface IX<T> { }
public interface IX { }
public class A : IX<A> { }
public class B : A, IX { }
public class C { }
```

Lines highlighted with 3.x are examples for identity conversions. 3.1 and 3.2 are valid because the class `Sample` expects a type parameter which is of type `A`. 3.2 has `B` passed as a type arg, which extends `A`. 3.3 on the other hand is invalid because `C` does not belong to `A` in the inheritance hierarchy.

```c#
using System;

public class Program {
    public static void Main() {
        Sample<B, A> s1 = new Sample<B, A>();    // ---(4.1)
        Sample<B, IX> s2 = new Sample<B, IX>();  // ---(4.2)
        Sample<C, A> s3 = new Sample<C, A>();    // ---(4.3)
    }
}

public class Sample<T, U> where T : U {}
public interface IX<T> { }
public interface IX { }
public class A : IX<A> { }
public class B : A, IX { }
public class C { }
```

Lines highlighted with comments 4.x are a special case of reference conversion. As you can see the class Sample now has two type args `T` and `U` where, `T` should extend `U`. In other words, whatever the type parameter passed for `T` should either be a subclass of, or implement `U`. In that sense, both 4.1 and 4.2 will be valid and 4.3 will cause compile time error because `C` neither extends nor implements `A` in their inheritance hierarchy.

## Bound Type Parameters in Java

Similar to constraints in C#, Java has Bound Type parameters. Consider a simple class hierarchy in Java as `Object` :> `Alpha` :> `Bravo` :> `Charlie`. Now when we define type args for a method `<T> void do(T t)`, we can alter the signature of the method as `<T extends Alpha>` which will restrict the assignable types to the parameter to only of type Alpha or anything that inherits from Alpha. This will result the compiler to perform type erasure and replace all occurrences that refer to type arg `T`, with `Alpha`. In fact `<T extends A>` is identical to` <T>`. But this is quite handy, when we use this with interfaces, as it will enable an upper bound which is not restricted to a particular sub tree in the object hierarchy. Upon type erasure, `<T extends IAlpha> void do(T t)` will result in `void do(IAlpha t)`, where `IAlpha` is an interface.

```java
// Source
public <T extends IAlpha> void do(T t) { }

// Results in follows
public void do(IAlpha t) { }
```

As previously mentioned, Java compiler performs type erasure by replacing the generic methods with a signature where the bounded type parameters will be replaced with upper bound. “Okay, so what about lower bound?” is a nice counter question, which I believe will be answered with something like “that’s a useful feature which is not useful enough to be implemented in Java core”. That’s why when you try public `<T super String> void swap(T lhs, T rhs)`, it will end up in a compile time error. Java also allows specifying multiple bounds, under the same restrictions for class declaration. There can be any number of bounds with at most one class as a bound.

```java
public <T extends String & Serializable & Iterable> void do(T t) { } // Valid
public <T extends String & Integer & Iterable> void do(T t) { } // Invalid: Muliple class bounds
```

When there are multiple bounds as such, Java compiler will internally refactor the source with synthetic methods (so called because generated automatically based on the existing methods) to have overrides of the method for each bound. These methods are called bridge methods.

```java
// Source
public <T extends String & Serializable & Iterable> void do(T t) { }

// Results in follows
public void do(String t) { }
public void do(Serializable t) { }
public void do(Iterable t) { }
```

## Type Inference in Generics – C\#

In layman terms, this is how the runtime determines the actual type for a given type parameter, in invocations where the actual types for the parameters are not explicitly mentioned/specified. This is specifically essential in generic methods. In C#, the only source for inferring types is the arguments list of a method. Neither the left hand side of an assignment, nor the type constraints will provide sources to infer the types. The rules are actually quite complicated and even the spec has got them wrong in multiple places (at least according to Jon Skeet as mentioned by himself in [this answer to a question in Stack Overflow](https://stackoverflow.com/a/479983)).

```c#
// Implementation
T Work<T>(T t){
    // Body
    return t;
}
// Invocation
int a = 10;
Work(a);
Person p = new Person();
Work(p);
```

Here, the runtime can easily and obviously determine the type of of the parameter a. For the case where we pass an int as a parameter to method Work, the runtime can determine the method will return an int. So, There will be strict type enforcement even if different invocations of method Work are there. This gives us a form of a polymorphic behaviour.

```c#
public static LinkedList<T> CreateList<T>() {
    return new LinkedList<T>();
}

LinkedList<int> intList = CreateList();      // ---(1)
LinkedList<int> intList = CreateList<int>(); // ---(2)
```

However, the line, highlighted with the comment 1 above, will cause a compile tile error. This is a case where the C# runtime won’t be able to infer the type. If the method call is added with explicit type arguments (line with comment 2) the problem will be resolved.

## Type Inference in Generics – Java

Java also capable of determining the types based on method arguments. Also, there is diamond operator `<>` available from Java 7 onward. This allows JRE to determine the type by inference. So, Java is perfectly capable of the following.

```java
// Declaration
public static <T> Alpha<T> make() {
    return new Alpha<>(); // Inference
}

// Invocation
Alpha<String> alpha = make();
But the following, where it attempts to deserialize a JSON string into a given type using ObjectMapper in Jackson Databind.
List<Car> cars1 = objectMapper.readValue(jsonArray, new TypeReference<>(){}); // Will fail during the runtime
List<Car> cars1 = objectMapper.readValue(jsonArray, new TypeReference<List<Car>>(){}); // Works
```

Even though you might think, “since the end result should be a `List<Car>` type argument for `TypeReference<>` should be obvious”, it seems like there is no inference channel that the compiler can understand so. Hence, the first method above will fail during the runtime. So the bottom line is, there should be some inference channels that the compiler/runtime is aware of, in order to successfully infer the types for generics.

## Modified Stack

Previously, our stack supported only int data and now we are trying to make it work with different types. The first thing is to rewrite the IStack interface with generics.

```c#
public interface IStack<T> {
    void Push(T value);
    T Pop();
    T Peek();
    bool IsFull();
    bool IsEmpty();
}
```

The difference from the previous version is quite simple. All the stack operations are now refactored to work with the type `T`, that will be varied in the runtime. Given the interface that provides the contract for stack operations has changed, we need to change its implementation as well. The refactored version will take its shape as follows.

```c#
public class Stack<T> : IStack<T> {
    private T[] array;
    private int top;
    
    public Stack(int size) {
        this.array = new T[size];
        top = -1;
    } 
    
    public void Push(T value) {
        if(this.IsFull()) { //Check if the stack is full
            throw new SystemException("Stack is already full!"); // Will not try to add new items
        }
        this.array[++top] = value;
    }
    
    public T Pop() {
        if(this.IsEmpty()) { // Check if the stack is empty
            throw new SystemException("Stack is empty!"); // Will not try to remove the top most item from the stack
        }
        return this.array[top--];
    }
    
    public T Peek() {
        if(this.IsEmpty()) { // Check if the stack is empty
            throw new SystemException("Stack is empty!"); // Will not try to get the top most item from the stack
        }
        return this.array[top];
    }
    
    public bool IsFull() {
        return (this.array.Length - 1) == this.top;
    }
    
    public bool IsEmpty() {
        return this.top == -1;
    }
}
```

As you can see, it is quite straightforward in these sort of cases. All you need to do is

 - Introduce a type parameter `T`
 - Change all method signatures to work on `T`. 

That’s pretty much it. I hope this has shed some light in the grey areas you had on generics. Happy cording!
