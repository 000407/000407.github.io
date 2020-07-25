---
layout: post
title:  "#::2-Linked Lists"
date:   2020-03-07 15:42:18 +0530
categories: techbits
scripts: ["mermaid.min"]
excerpt: A linked list is a data structure that is nothing but a list of elements which are linearly interlinked with the use of references. This post intends to explain the concepts behind linked lists, along with how to implement one, using C#.
---

Let us start this discussion with a simple analogy, that is a story about one of my friends, Alice.

Say I need to meet Charlie, who happens to be someone in possession with a book I need and who is not friends with me. Then, there is Bob, who happens to be friends with Charlie, has a book in his possession, and Bob also knows that he knows someone who is friends with him either have the book I am looking for or knows someone who does so. Finally, there is Alice, who is friends with me, has a book in her possession and also knows that someone who is friends with her either knows or has the book. I, the one who needs the book, also know that someone that I know either. In summary, each person has a book and also friends with at most two people. Clear eh?

<div class="mermaid">
    graph LR;
        I[Me] -- knows --> A[Alice]
        A[Alice] -- knows --> B[Bob];
        B[Bob] -- knows --> Charlie["Charlie (hasBook=true)"];
</div>

Now, in order for me to get my hands on that book I need so badly, I can simply start by going to Alice and ask from her if she has the book. Given that she does not have the book I need and knows only Bob other than me, she could introduce me to Bob. I could do the same with Bob and get introduced to Charlie and find out that Charlie has what I am looking for.

This analogy very closely resembles a LinkedList. A linked list is a data structure that is nothing but a list of elements which are linearly interlinked with the use of references. Each item in the list has at least two (02) properties which are namely,

 - Data – The data that is held by the element (in the above example the book)
 - Next – A memory reference to the next item in the list (in the above example, whereabouts of the other person)

This analogy can be easily implemented in the memory of the computer. Let’s look at a simple implementation done in C#.

The first thing to elaborate here is the interface that forms the contract that a class has to abide by, in order to act as a linked list. This interface can provide, but not limited to the signatures for the following operations.

 - `void addToTail(data)` – Item will be added at the end/tail of the list.
 - `ListNode removeFromTail()` – Remove the last item from the list.
 - `bool isEmpty()` – Check if the list has no elements.
 - `int find(data)` – Find the item in a list and return its position.

We can define an interface for this, which looks like follows.

```c#
interface ILinkedList {
    void addToTail(int data);
    ListNode removeFromTail();
    bool IsEmpty();
    int find(int data);
}
```

You might have noticed that I have included something that takes the name ListNode here. That is a class that I use to encapsulate the data. Let’s take a quick peak on that first, in order to lessen the confusions.

```c#
class ListNode() {
    public int Data {
        get; set;
    }
    public ListNode Next {
        get; set;
    }
    public ListNode(int data) {
        this.Data = data;
        this.Next = null;
    }
}
```

Take note on the fact that this list node is capable of holding only integer for the time being. We can always extend that with the use of generics.

Now, we can move on to implementing the interface in a concrete class named LinkedList. That will take the shape of the following scaffold.

```c#
class LinkedList : ILinkedList {
    private ListNode head;
    public LinkedList() {
        this.head = null;
    }
    // Other method implementations
}
```

We have the private property head in this implementation. That is the essential component that keeps track of the memory location that the list begins. We initialize it to null and as we add the first element, it will start to point to that instead. Now let’s look at each of the methods to see how they are in action.

```c#
void addToTail(int data) {
    ListNode node = new ListNode(data);
    if(this.head == null) { //head == null means the list is empty.
        this.head = node;
    }
    else { // List is not empty. Have to find the tail...
        ListNode tmp = this.head; // Use a temporary pointer...
        while(tmp.Next != null) { // ...to find the node that has it's next is null
            tmp = tmp.Next;
        }
        tmp.Next = node; // Found it. Assign the node as the next of tmp
    }
}
```

Here, it flows as follows.

 1. Create a ListNode to encapsulate the data.
 2. If the current head of the list is null, that means the list has no nodes. So we can set the new node as the head of our list.
 3. Otherwise, we have to find the tail (the last node) of the list. Tail has a special property that makes it distinct from other nodes. That is, its Next is null.
 4. To find such, we use a variable tmp that initially refers to the current head of the list.
 5. Starting from that, we keep on switching the reference of tmp to tmp.Next until tmp refers to the list node that its Next is null. That’s the end/tail of the list.
 6. Append our new node there.

Obviously, this method to add something of the tail is not so efficient. The reason is having to sequentially reach the end every time. Assume a list of 1 million items. Adding to the tail of that? Let’s refactor the code a bit. This time, we keep another pointer like Head, the Tail, that points to the end of the list always.

```c#
class LinkedList : ILinkedList {
    private ListNode head;
    private ListNode tail;
    public LinkedList() {
        this.head = null;
        this.tail = null;
    }
    // ...
```

Our new add method will look like follows.

```c#
void addToTail(int data) {
    ListNode node = new ListNode(data);
    if(this.head == null) { //head == null means the list is empty.
        this.head = node;
        this.tail = node; //tail will be the last element.
    }
    else { // List is not empty. Have to find the tail, which we already know.
        this.tail.Next = node; // current tail's Next will be the newnode.
        this.tail = node; // new tail will be the newly added node.
    }
}
```

Here we do a little bit of trade-off of memory, to avoid time complexity. The memory trade-off is insignificant because it’s just a pointer of a few bytes of size. When the list is not empty,

 - The newly created node will be the next of the current tail.
 - After that set, the new node will become the new tail of the list.

Next up, is the RemoveFromTail method. The implementation is as follows.

```c#
public int RemoveFromTail() {
    if(this.IsEmpty()) { // If the list is already empty...
        throw new InvalidOperationException("List is empty."); // Throw exception
    }
    int data = this.head.Data;
    if (this.head.Next == null) { // Head is the only element availble. so..
        this.head = null; // reset head and tail and...
        this.tail = null;
        return data; // Return recently detached data element
    }
    ListNode tmp = this.head;
    // tmp should refer to the node before the tail
    while(tmp.Next.Next != null) { 
        tmp = tmp.Next;
    }
    // Removal
    data = tmp.Next.Data;
    this.tail = tmp; // New tail should be the one referred by tmp.
    this.tail.Next = null; // New tail's Next should be null
    return data; // Return recently detached data element
}
```

Here, it has three cases to address which are,

 1. the list is empty. When the list is empty, we will throw an InvalidOperationException.
 2. the list has only one element. Here, we extract the data, reset the pointers head and tail to their defaults and return data.
 3. otherwise. Here, we extract the data and set the new tail of the list to the one before the element that is the current tail. Notice the while loop that checks `tmp.Next.Next != null`.

You can already see that we use the `IsEmpty()` method to check the emptiness of the list before we remove from the tail. That method has a very straightforward implementation which is as follows. All it does is checking if the current head of the list is null and returning bool to indicate the state.

```c#
public bool IsEmpty() {
    return this.head == null;
}
```

Finally, we need to find if we have a given data element in the list. That can be implemented as follows.

```c#
public int Find(int needle) {
    ListNode tmp = this.head;
    int index = -1; // 0 based index of the node being checked.
    // tmp should refer to the node before the tail
    while(tmp.Next != null) {
        ++index;
        if(tmp.Data == needle) { // Check if the needle is the current item's data..
            return index; // found it. Return it...
        }
        tmp = tmp.Next;
    }
    return -1;
}
```

The method is intended to look for a data item in the entire list return its index. If not found the index will be -1. Searching is nothing but a simple linear traversal.

That is it for the time being. Given that these are abstract data types (ADTs), you are free to decide the implementations according to your preference and the purpose intended. There are many different optimizations that could be done on this before it is production-ready. For now, this should be enough. The complete implementation that includes some test cases, added in this gist. That’s it folks. Until next time. Happy coding! :)