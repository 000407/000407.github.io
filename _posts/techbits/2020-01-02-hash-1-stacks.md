---
layout: post
title:  "#::1-Stacks"
date:   2020-01-02 13:20:00 +0530
categories: techbits
excerpt: This post intends to explain the concept of Stack, as a data structure. When learning about Abstract Data Types (ADTs), Stack is a good place to start at, as it will further clarify/clear off your misty picture on what ADTs really are.
---

When learning about Abstract Data Types (ADTs), Stack is a good place to start at, as it will further clarify/clear off your misty picture on what ADTs really are.

All of us have seen the CD bulk at some point in our life.

![CD Bulk](/assets/img/posts/hash-1-stacks/featured.jpg#center)

This is the easiest and the most prominent form of a Stack. You can observe the following properties here.

 - Only one opening at the top. That’s all where you can put in and get out things.
 - Whatever the last item that has put in (LAST-IN), comes out first (FIRST-OUT), hence LIFO.
 - Traversal Order will be the reverse order of insertion.

This could be visualized in general as follows.

![CD Bulk](/assets/img/posts/hash-1-stacks/stack_representation.jpg#center)

Illustration of a Stack (Image Courtesy [Tutorials Point](https://www.tutorialspoint.com/data_structures_algorithms/images/stack_representation.jpg))

Stack type has the following signatures of operations over it.

 - `void push(T item)`:- To put an item into the stack
 - `T pop()`:- To get the top most item out of the stack (i.e. item is removed from the stack)
 - `T peek()`:- To get the top most item of the stack (i.e. item is not removed from the stack)
 - `boolean isFull()`:- To check if the stack is empty. This is required for popping a stack as trying to pop and empty stack won’t make sense.
 - `boolean isEmpty()`:- To check if the stack is full. This method is only required for the cases where we are using a core data structure (such as an array) which is strict in size (e.g. arrays in C# and Java).

Now that we have figured the operations, let’s try to implement this. I have taken the liberty of using C# language for implementation. If you are interested, you may read this Medium blog, to see some other implementations of stack. Also, the following assumptions/preconditions are set for this implementation.

 - This stack can hold only to integer values (C#’s type int )
 - The underlying data structure used here in this implementation is C#’s array. Of course this could be implemented with LinkedList as well. That will be much more flexible than the array-based implementation.

Implementing a stack based on an array is quite straight forward. All we need is a pointer named `top` , which will be an *integer holding onto the index of the array*, that has the item that is treated as the current top most item of the stack. We simply manipulate the value of top by the methods, `push()` , `pop()` and `peek()`.

 - `top` is initially set to -1.
 - Whenever a new item needs to be pushed to the stack, increase `top` by 1, and set `array[top]` to the new value to be added. This is what we need to do in our `push()` operation implementation. This cannot be done beyond the point where the value of `top` is `array.Length - 1`.
 - Whenever the stack is popped, we will get the value at `array[top]` and then decrease `top` by 1. This cannot be done beyond the point where the value of `top` is -1.
 - Whenever we want to peek at the top of the stack, we just return the value in the array at `array[top]`.
 - Actual content of the stack is the items in the array that are in the range 0 and top .

### The Interface for Stack :: `IStack`

We can define an initial interface that sets the contract for a stack implementation. This will be as follows.

```c#
interface IStack {
    void Push(int value);
    int Pop();
    int Peek();
    bool IsFull();
    bool IsEmpty();
}
```

Then, let’s define a class that agrees to this contract.

```c#
class Stack : IStack {
    private int[] array;
    private int top; public Stack(int size) {
        this.array = new int[size];
        top = -1;
    } 
    // Method implementations
}
```

When initializing the stack,

 - Size of the stack should be specified in the constructor parameter size . This will be the initialization size of the core array .
 - `top` should be initialized to -1. This is the floor value that `top` can have. The ceiling value of `top` will be `size - 1` .

Each method implementation will take the shape as follows.

```c#
public void Push(int value) {
    if(this.IsFull()) { //Check if the stack is full
        throw new SystemException("Stack is already full!"); // Will not try to add new items
    }
    this.array[++top] = value;
}

public int Pop() {
    if(this.IsEmpty()) { // Check if the stack is empty
        throw new SystemException("Stack is empty!"); // Will not try to remove the top most item from the stack
    } return this.array[top--];
}

public int Peek() {
    if(this.IsEmpty()) { // Check if the stack is empty
        throw new SystemException("Stack is empty!"); // Will not try to get the top most item from the stack
    } return this.array[top];
}
```

We need two additional methods to verify if the top value stays within the boundaries. These are as follows.

```c#
public bool IsFull() {
    return (this.array.Length - 1) == this.top;
}

public bool IsEmpty() {
    return this.top == -1;
}
```

That’s it! Now we have a usable stack. We can verify the execution by follows.

```cmd
Stack stack1 = new Stack(3);
stack1.Push(10);
stack1.ShowStack();
stack1.Push(30);
stack1.ShowStack();
stack1.Push(20);
stack1.ShowStack();
stack1.Push(50);
stack1.ShowStack(); //Throws the SystemException
```

I also have implemented a non-standard method `ShowStack()` to display the stack in the terminal. This will give us the following result in the terminal.

```cmd
|  |
|  |
|10|
|__|
|  |
|30|
|10|
|__|
|20|
|30|
|10|
|__|
Unhandled Exception:
System.SystemException: Stack is already full!
  at Stack.Push (System.Int32 value) [0x0000b] in <6575c48c03074e1789a42989f3c57445>:0 
  at StackDemo.Main (System.String[] args) [0x00031] in <6575c48c03074e1789a42989f3c57445>:0 
[ERROR] FATAL UNHANDLED EXCEPTION: System.SystemException: Stack is already full!
  at Stack.Push (System.Int32 value) [0x0000b] in <6575c48c03074e1789a42989f3c57445>:0 
  at StackDemo.Main (System.String[] args) [0x00031] in <6575c48c03074e1789a42989f3c57445>:0
```
You can see that when we try to push to a stack which is already full, we get the intended exception thrown with message Stack is already full! .

That’s pretty much it. I will later on include the same implementation improved with the use of Generics. Happy coding!