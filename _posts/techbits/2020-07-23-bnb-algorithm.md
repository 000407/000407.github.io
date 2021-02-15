---
layout: post
title: "vLayman.1::Branch and Bound Algorithm"
date: 2020-07-23 20:00:00 +0530
categories: techbits
excerpt: "Branch and Bound Algorithm, invented by P.M. Narendra and K. Fukunaga, is a long standing, widely used algorithm in machine learning and pattern recognition. This post intends to explain the mathematical background and the function of the BnB algorithm in details along with an example."
scripts: ["mermaid.min"]
---

## Prologue

 - Assume a set of features $ S = \{x_1, x_2, \ldots, x_n\} $
 - Goal is to select a set having $b$ number features from $S$ (i.e. $b \lt n$)
 - Power Set of $S$ is given by $ P(S) = \{B \mid B \subseteq S\} $
 - Set of all sets that has $b$ number of elements is given by $\mathcal{A}_b = \{C \mid C \subseteq S, n(C)=b\}$

## Criterion(Objective) Function

 - This is a function $J$ where $J:P(S) \mapsto (-\infty, \infty)$
     + Purpose of $J$ is to attach a value to each element in $P(S)$, so that a decision about each subset of $S$ can be made.
     + Example of a $J$ (one of many ways of defining a $J$)
         * Consider a set of 5 features (i.e. $n(S) = 5$) and we are to select 2 features (i.e. $b = 5$). We can select ${5 \choose 2} = 10$ different sets having 2 elements.
         * For each of these 2 feature sets, infinite number of decision rules can be formulated, out of which we can choose a finite number of decision rules.
         * For each of such decision rules, there is a probability of misclassification, and the minimum of these probabilities can be obtained.
         * For an arbitrary feature pair $(l,m) \forall l,m \in S$, let's say the minimum misclassification probability is $P_{min}(l,m)$. This $P_{min}$ can be calculated for each feature pairs.
         * Out of all those $P_{min}$ we can find the smallest. The feature pair, corresponding to this smallest value will ***minimise*** the probability of misclassification.
 - $J$ is to be optimized, i.e
     + Find $C_0 \in \mathcal{A}_b$ such that
         * $J(C_0) \geq J(C) \forall C \in \mathcal{A}_b$ ~> Maximisation Problem
         * $J(C_0) \leq J(C) \forall C \in \mathcal{A}_b$ ~> Minimisation Problem

## Formulation of Algorithm

 - Assume the criterion function $J$, and the target number of features $b$ are given.
 - We can perform an exhaustive search to find the optimal subset with the use of $J$.
 - But this will quickly become impractical (E.g. consider a feature set having 100 features out of which we are to choose 10. Number of possible choices are ${100 \choose 10} = 1.7310309\times 10^{13})$, which is 1+ trillions)
 - However, if $J$ satisfies the property given below, we can formulate an algorithm to find optimal feature subset, without exhaustive search.
     + Given $S = \{x_1, x_2, \ldots, x_n\}$
     + $J(A_1) \leq J(A_2)$ when $ A_1 \subseteq A_2 \subseteq S - (1)$
 - This means ***more features implies that there is more information***. This property is not always useful because, certain features which could act as noise might distort the quality of the feature subset, in terms of its importance.

### Branch and Bound Algorithm

 - Formulated by P.M. Narendra and K.Fukunaga initially in 1975, this is an algorithm that can be used to derive the optimal feature subset, without exhaustively searching the given space.
 - This consists of a tree that is specifically developed under certain constraints.
     + \# of levels $L = n - b + 1$, where $n$ is the number of features in the initial set, and $b$ is the number of elements in the target feature set.
     + \# of branches of a node + \# of features to be preserved $= b + 1$
         * **Features to Preserve**: At each node, the ***features eliminated by the right-side siblings of each parent***, up the hierarchy should be preserved.
     + \# of leaf nodes = ${n \choose b}$
     + Tree is constructed either **left-to-right**, or **right-to-left**. By the nature, ***the tree will be asymmetric***.

### Example

 - Assume a feature set $S = \{a,b,c,d,e\}$, and out of this 3 features to be chosen.

Initial parameters $n=5, b=3$

Number of choices ${5 \choose 3} = 10$

#### Steps of constructing the tree:

 - Notes:
     + -a indicates that feature a is removed from the feature set
     + There is a selection criteria $\mathcal{C}$ that selects features to eliminate on each branch, at each node. (This function is discussed later)
 - For the root node, number of nodes to preserve is 0. Therefore root node will have $b+1$ branches, which is 4.
 - If we assume that $\mathcal{C}$ chose $a,b,c$ and $d$ to be removed from the feature set in each branch, we will get a tree like follows.

<div class="mermaid">
    graph TD;
        R["*"] --- A["-a"] & B["-b"] & C["-c"] & D["-d"];
</div>

 - Now, the right most branch should always preserve $a,b$ and $c$. From the formula for #branches, we can calculate it should have only 1 branch. Since $d$ is already taken out, next we have to remove $e$. And we have ${a,b,c}$ as a feature subset.

<div class="mermaid">
    graph TD;
        R["*"] --- A["-a"] & B["-b"] & C["-c"] & D["-d"];
        D --- E1["-e"];
        E1 --- ss1["{a,b,c}"];
</div>

 - The second right-most branch should preserve $a$ and $b$. So, it should have 2 branches. For each of the two branches, let's say $\mathcal{C}$ choose $d$ and $e$. So, we put each 

<div class="mermaid">
    graph TD;
        R["*"] --- A1["-a"] & B1["-b"] & C1["-c"] & D1["-d"];
        D1 --- E1["-e"];
        E1 -.- ss1["{a,b,c}"];
        C1 --- E2["-e"] & D2["-d"];
        E2 -.- ss2["{a,b,d}"];
        D2 -.- ss3["{a,b,e}"];
</div>

 - The third right-most (second left-most) branch from the root, should preserve only $a$, it needs to have 3 branches (from the formula). Assuming that $\mathcal{C}$ chose $c,d$ and $e$,

<div class="mermaid">
    graph TD;
        R["*"] --- A1["-a"] & B1["-b"] & C1["-c"] & D1["-d"];
        D1 --- E1["-e"];
        E1 -.- ss1["{a,b,c}"];
        C1 --- D2["-d"] & E2["-e"];
        D2 -.- ss3["{a,b,e}"];
        E2 -.- ss2["{a,b,d}"];
        B1 --- C2["-c"] & D3["-d"] & E3["-e"];
        C2 -.- ss6["{a,d,e}"];;
        D3 -.- ss5["{a,c,e}"];
        E3 -.- ss4["{a,c,d}"]
</div>

 - Finally for the left most node, #features to preserve is 0. Hence, there should be 4 branches (from the formula). Assuming that $\mathcal{C}$ chose $b,c,d$ and $e$ for those 4 branches,

<div class="mermaid">
    graph TD;
        R["*"] --- A1["-a"] & B1["-b"] & C1["-c"] & D1["-d"];
        D1 --- E1["-e"];
        E1 -.- ss1["{a,b,c}"];
        C1 --- D2["-d"] & E2["-e"];
        D2 -.- ss2["{a,b,e}"];
        E2 -.- ss3["{a,b,d}"];
        B1 --- C2["-c"] & D3["-d"] & E3["-e"];
        C2 -.- ss4["{a,d,e}"];;
        D3 -.- ss5["{a,c,e}"];
        E3 -.- ss6["{a,c,d}"];
        A1 --- B2["-b"] & C3["-c"] & D4["-d"] & E4["-e"];
        B2 -.- ss7["{c,d,e}"];
        C3 -.- ss8["{b,d,e}"];
        D4 -.- ss9["{b,c,e}"];
        E4 -.- ss10["{b,c,d}"];
</div>

As it should be obvious by now, this algorithm provides us a way of systematically permuting a feature set, in a way which facilitates reducing the search space to improve search performance.

#### Role of $J$

 - $J$ is the function that provides a bound for each of the nodes.

<div class="mermaid">
    graph TD;
        R["Root"] --- L["l"] & M["m"];
        M --- N["n"];
</div>

 - In the tree, it is evident that each node $n$ is a subset of its parent $m$, which makes it evident that $J(n) \leq J(m)$.
 - Given $n$ is a leaf node, if there is a sibling $l$ of node $m$, that which $J(l) \leq J(n)$, ***it is guaranteed that all of $l$'children will yield values for $J$, which are less than $J(n)$***. Here $J(l)$ acts as a ***lower bound*** for $J(o)$ (hence the name ***bound***).
 - So, we can conclude that the node $n$ is the node that has the optimal subset of features.