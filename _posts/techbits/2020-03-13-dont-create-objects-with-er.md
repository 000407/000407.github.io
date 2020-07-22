---
layout: post
title:  "Don’t Create Objects That End With -ER? My Two Cents…"
date:   2020-03-13 15:42:18 +0530
categories: techbits
excerpt: Classes that ends with 'ER' has been the root for criticisms from many Object Paradigm Purists. One such was found at [Don't Create Objects That End With -ER](https://www.yegor256.com/2015/03/09/objects-end-with-er.html). This is an attempt to pen down some thoughts on this idea of ER.
---
![Scenario 1](/assets/img/posts/dont-create-objects-with-er/featured.png#center)

Well, the beginning of this story goes back to the beginning of August 2019 (not so far eh?). I came across this interesting article [Don't Create Objects That End With -ER](https://www.yegor256.com/2015/03/09/objects-end-with-er.html) , with the title Don’t Create Objects That End With -ER. Ever since I read that, I had a lot of thoughts rumbling in my head that ultimately said: “something in this post doesn’t add up!”. Here I am penning down those thoughts.

At the very beginning, I should mention that this is not any sort of a challenge to the person who wrote that article. From his philosophy of the Object-Oriented Paradigm, he probably should be having many years of experience, which is pacific ocean compared to the jug of water I have with me. This is actually a question. I will end this article with a question mark, hopefully, to revisit and update this with the answers, if and whenever I find them.

There is an interesting pick of an example. In the same words from the article

![Scenario 1](/assets/img/posts/dont-create-objects-with-er/1.png#center)

And, the things that follow this, are what made me having a problem. Let’s take a look at that as well.

![Scenario 2](/assets/img/posts/dont-create-objects-with-er/2.png#center)

Haven’t noticed anything yet? Okay, let’s try to jot down the facts.

 - Both scenarios are about trying to get the biggest apple.
 - In scenario 1, simply sort the apples in the descending order, and get the one at the beginning.
 - In scenario 2, it is doing things my(the Sorted’s own) way. In the scenario itself, it is clearly mentioned that instead of sorting all of them, it will go through each apple and find the biggest one and then return it.

If we take a look at scenario 2 in an implementation perspective, something is missing there in that given implementation.

 1. It creates an instance of the Sorted object. I don’t have a problem with that. But I have a problem with how the core of the Sorted object is written. To that also, there is a clue given which is “go through them all one by one and find the biggest”. This is nothing but finding maximum in O(n) time isn’t it? (Linear data structure, you can’t finalize the result until you examine the last element)
 2. Then in the next line, it assigns sorted.get(0) to the biggest.

From the way I see it, scenario 2 has at least the following grey areas.

 1. Sorted should know the purpose/final expectation of calling itself. This is evident from the scenario even. (consider the question **Consider them sorted, what do you want to do next?**)
 2. Based on the answer to that question, the Sorted object decides its next course of actions.
 3. The business partner now calls itself **Sorted**, which actually does not have anything sorted at all. Simply put, ***how can you end up with something sorted, without actually sorting***? I, being a fan of descriptive identifiers, find this to be a bit disturbing because the name that has been chosen is too close to a lie.

In other words, we are talking about intelligent objects, aren’t we? I think yes, we are talking about an intelligent object in scenario 2. Can you think of an implementation of such an object? Wouldn’t that be a god class which is knowing a lot of things, including how to make decisions on what to do in certain cases?

If someone says that this is not about intelligent objects, then someone should know the expectation of this, isn’t it? If the object doesn’t know that, then the obvious another party who should know what the expectation is the developer who writes the code.

All of these I can boil down to the following.

 >Who will ask the question “Consider them sorted, what do you want to do next”?

Is there anyone who knows the answer? Please feel free to comment. Until next time!