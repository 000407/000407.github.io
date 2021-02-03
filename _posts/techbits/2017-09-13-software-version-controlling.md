---
layout: post
title: "Software Version Controlling"
date: 2017-09-13 17:36:00 +0530
categories: techbits
excerpt: Version control systems (VCS) (also known as revision control, source control, or source code management) is a class of systems responsible for managing changes to a collections of information such as computer programs, multimedia, databases, documents and so on. In computer programming and software engineering, VCSs are extensively used for controlling the versioning of the source code and plays a vital role in any software development effort as a software project is essentially a team effort which most of the cases are geographically dispersed across many regions. This article explains the fundamental concepts of VCS and their use and practice in modern software development context.
styles: ["software-vcs"]
git_docs_src: https://git-scm.com/docs
---

![Some Popular VCSs](/assets/img/posts/software-vcs/title_image.png#center#title){: .title}

## Fundamentals

A **Version Control System** is a special piece of software, that helps a group of developers working on a project to keep track of their work. Primarily, a VCS

 - allows developers to work simultaneously.
 - restricts unintentional overwrites.
 - maintains version history.

Two types of VCSs are currently in use industry-wide.

 - Centralized VCS
 - Distributed VCS

[This article](https://medium.com/faun/centralized-vs-distributed-version-control-systems-a135091299f0) is doing a good job at explaining the similarities, differences, pros and cons of these two. To put the together an idea of the difference between the two for the sake of completeness,

 - **Centralized VCS** - There is a single centralized copy of the project. Everyone who is working on it, will have a working copy of the project in their systems. Once a change is ready to be published, it will go into this central working copy, from which the others will get the updates into their working copy. Typical examples of CVCSs include [Subversion](https://subversion.apache.org/) and [Perforce](https://www.perforce.com/).

 - **Distributed VCS** - In theory, there is no single central copy. Everyone involved have their own copy of the repository, to which the changes done in the working copy are published into. In order to publish these updates, all of the local repositories are synchronized with a shared remote location (this is where the [bare repos](#bare_repo) come in to play). Without such a central location, one who has added some changes to their local repository will have to broadcast infomation about the said update so as to the others to see. [Git](https://git-scm.com/) and [Mercurial](https://www.mercurial-scm.org/) could be enumerated as popular exampels of DVCSs.

Advantages of Git, over other available VCSs, could be summarized as follows.

 - FOSS
 - Fast & small
 - Implicit backup
 - Security
 - Powerful hardware is not required
 - Simpler branching

## DVCS Terminology

In order to understand how a DVCS works, we need to clarify and be familiar with the following terminology.

 - **Local Repo**: A copy of the remote repo. All individual changes are saved in the local repo. This is also known as the ***Working Tree/Working Directory***.
 - **Staging area**: A temporary buffer that keeps track of the files presented for the commit. This allows committing each file separately if needed.
 - **BLOB**: Stands for Binary Large Object. A BLOB in Git represents each version of a file. Git DB saves the SHA1 hash of this, making it immune to overwrites.
 - **Tree**: An object that represents the directory structure.
 - **Commit**: The current state of the repo. Every commit is named by SHA1 and points at the previous commit allowing traversing back in the history, as in a reversed linked list.
 - **Branch**: A branch is a list of linked commits. Git has a default named "master". Every branch is referenced by HEAD that points at the latest commit of the branch.
 - **Tag**: Ususally a commit may appear as not much meaningful given it is identified by the SHA1 hash. Tags are names/identifiers that can be assigned to such commits which may be defined as human readable, thereby meaningful. These IDs are immutable and each tag is assigned to/associated with ***exactly one*** commit.
 - **Clone**: Creates a snapshot/an instance of the repo. This could also be understood as a single frame of a video clip.
 - **Pull**: Copies the changes in the remote repo to the local.
 - **Push**: Copies the changes in the local to the remote.
 - **HEAD**: A pointer which always points at the latest commit of the branch.
 - **Revision**: Represents a particular version of the source code.

## Typical Life Cycle

When we are working on an existing repo, below mentioned is the typical life cycle that we would follow.

 - Clone the remote repo as a working copy
 - Modify the local copy
 - Review changes
 - Commit
 - Push changes to remote

## Creation Operations

### <a name="bare_repo"></a>Bare Repository

By the nature, Git is a distributed VCS, which turn means that, there is no central singular copy of the Project, in theory. This leaves us with a problem on how to share the committed updates to all the other interested parties. This is where the concept of **Bare Repository** comes into play. A bare repository ***without a working tree***. Conventionally, this is named as `<reponame>.git`.

A git repository could be initialized using [`git init`]({{page.git_docs_src}}/git-init) command. To make the repository being initialized a bare repo, the flag `--bare` could be used.

```bash
$ mkdir projectname.git
$ git --bare init projectname.git/
Initialized empty Git repository in /<location>/projectname.git/
$ ls
branches        config       HEAD   index  logs     refs
COMMIT_EDITMSG  description  hooks  info   objects
```

### Local Repository

This is the local copy of the project, that contains everything related to versioning, along with the version history. Transforming a working directory into a local repo could be done as follows.

```bash
$ git init #Initializes the current directory as a repository
Initialized empty Git repository in /<location>/<projectname>.git/
$ git status -s #Indicates the current status of the files contained in the local repository.
?? README.md
```

Here, the command [`git status`]({{page.git_docs_src}}/git-status) displays the summary status of the current repository (unstaged files, changes which are not committed etc.). `??` indicates that the file is not being tracked.

### Staging - Adding files to track

Adding files to the staging area is done with [`git add`]({{page.git_docs_src}}/git-add) command. Following would add the selected files for tracking.

```bash
$ git add <filename1> <filename2> ... <filenameN>
```

Once the command is issued, the file(s) specified as arguments for this command will be marked with a green color capital letter A.

```bash
$ git add .
```

The above command adds all the files (the dot character acts as a wildcard that means ***all files***) available in the repo for tracking. Usual practice is to use this method, where the command will add all files except the files/paths mentioned in the `.gitignore` file, in to the staging area. Following are some of the allowed expressions in `.gitignore`.

 - `*` - All files in the repository are ignored.
 - `.idea` - A file/directory with the name `.idea` is ignored.
 - `!.gitignore` - DO NOT ignore the file `.gitignore`.

Once the add command is executed, the Added files will be indicated with 'A' prefixed to indicate that the file is "Added" into staging area.

### Committing

Files staged, could be committed with [`git commit`]({{page.git_docs_src}}/git-commit). The commit message, followed by -m flag is compulsory. Make sure to put something meaningful as the commit message. In fact, the comment can be a multiline message where the first line will be interpreted as the title by most of the git hosts ([GitHub](), [GitLab]() etc.)

```bash
$ git commit -m "Commit message"
[master (root-commit) df52a51] Commit message
4 files changed, 5 insertions(+)
create mode 100644 .gitignore
create mode 100644 README.md
create mode 100644 ig1.mml
create mode 100644 ig2.mml
```

### Binding the Local Repo with Remote Repo(s)

The local repo could be bound to a remote repo using [`git remote`]({{page.git_docs_src}}/git-remote) command, as follows.

```bash
$ git remote add origin git@github.com:username/reponame.git
```

Here, `origin` is actually a name, that serves as an identifier assigned to uniquely identify this remote location.

Similarly, if we have a remote repo that is already bound, that could be changed as follows. Here, the remote with the name `origin` is given with a different URL.

```bash
$ git remote set-url origin git@gitgithub.com:username/reponame.git
```

Once this is done, the URLs could be verified as follows. Note that the URL mentioned here is what needs to be used in SSH access to the remote repository. [Read about accessing remote with HTTPS and SSH](https://dev.to/lostintangent/do-you-clone-git-repos-via-https-or-ssh-3gp2), here.

```bash
$ git remote –v
origin    git@github.com:<username>/<reponame>.git (fetch)
origin    git@github.com:<username>/<reponame>.git (push)
```

### Pushing

This is the operation where the changes committed to the local repository will be pushed to the remote repository. This is achieved with the command [`git push`]({{page.git_docs_src}}/git-push)

```bash
$ git push origin master
Counting objects: 5, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (5/5), 374 bytes | 0 bytes/s, done.
Total 5 (delta 0), reused 0 (delta 0)
To git@github.com:<username>/<reponame>.git
* [new branch]      master -> master
```

If you check the remote repo after this operation, the files except the files mentioned in the `.gitignore` should be available there.

## Clone Operation

A local instance of a remote repo could be created with ***cloning*** as follows, using the command [`git clone`]({{page.git_docs_src}}/git-clone).

```bash
$ git clone git@github.com:<username>/<reponame>.git
Cloning into 'repo_test_1'...
remote: Counting objects: 10, done.
remote: Compressing objects: 100% (5/5), done.
remote: Total 10 (delta 1), reused 10 (delta 1), pack-reused 0
Receiving objects: 100% (10/10), done.
Resolving deltas: 100% (1/1), done.
Checking connectivity... done.
```

This would make an exact local copy of the remote repo.

## Checkout Operations

Checking out primarily refers to switch between branches. This is achieved using [`git checkout`]({{page.git_docs_src}}/git-checkout)

```bash
$ git checkout branch_name
Switched to branch 'branch_name'
```

Branches may be already existing or it may be to a new branch. A new branch can be checked out with `-b` for `git checkout`.

```bash
$ git checkout -b branch_name
Switched to a new branch 'branch_name'
```

Additionally, this operation could also be used in replacing/resetting files and the changes done as indicated under reset operations.

```bash
$ git checkout file`.txt
Updated 1 path from the index
```

The above operation will drop all the changes in the working tree for the file `file1.txt`, and revert it to the latest version available in the local repository.

### Performing Changes

After cloning, you can change the working tree. Once you are done with the required changes, you can commit them to the local repository.

***When should I commit?*** Every time you have done some substantial and meaningful changes, you should commit them to the repository.

If new files are created, then those needs to be added using the `git add` command.

### Revision History

Git provides two options for reviewing the changes.

 - `git log`
 - `git show`

The command [`git log`]({{page.git_docs_src}}/git-log) indicates the revision history for the repository as follows.

```bash
$ git log
commit c1f363ad701b9ff98734ee0b01189e3f1edb648e
Author: <username> <user@email.com>
Date:   Mon Sep 26 15:56:10 2016 +0530
			
more changes

commit e94af7e5672302dfd33dec828ad8bbd3c5557dc7
Author: <username> <user@email.com>
Date:   Mon Sep 26 15:20:09 2016 +0530

some more of the files

commit 0bfdd2f3620ca9242f80b37cf485e56251ea7e9f
Author: <username> <user@email.com>
Date:   Mon Sep 26 15:13:59 2016 +0530

further new files
```

[`git show`]({{page.git_docs_src}}/git-show) command indicates the revisions and their changes. Output is varying on the input flags. Optionally, the commit's SHA1 hash could be given as an argument to view the commit's details.

```bash
$ git show
commit c1f363ad701b9ff98734ee0b01189e3f1edb648e
Author: <username> user@email.com
Date:   Mon Sep 26 15:56:10 2016 +0530

commit message

diff --git a/src/.dmm b/src/.dmm
new file mode 100644
index 0000000..d6f09c3
--- /dev/null
+++ b/src/.dmm
@@ -0,0 +1 @@
+some more garbage to come
```

Further, [`git diff`]({{page.git_docs_src}}/git-diff) can be used to compare between commits and revisions. Following is the usage and an example output.

```bash
$ git diff HEAD~1 HEAD
diff --git a/Test.c b/Test.c
deleted file mode 100644
index 3438120..0000000
--- a/Test.c
+++ /dev/null
@@ -1,7 +0,0 @@
-/*created by 0004072
- *on date
- */
-#include <stdio.h>
-void main(){
-       prinf("Good bye cruel worldl\n");
-}
diff --git a/src/test2.tst b/src/test2.tst
new file mode 100644
index 0000000..359bb01
--- /dev/null
+++ b/src/test2.tst
@@ -0,0 +1 @@
+some meaningless text appended to a file for testing purposes
```

The result contains the comparison between the two commits. There are different options available to compare specific files selected from the two commits.

## Update Operation

Update operations are done by the following sequence of steps.

 - Checkout
 - Modify/add/remove files
 - Add the changes to the staging area
 - Commit
 - Push to the relevant branch

Here, ***pushing may not be allowed if the repo is not in full synchronization with the remote repo***. So, based on the situation, it might be required to pull the latest changes, which could be done using [`git pull`]({{page.git_docs_src}}/git-pull) command.

```bash
$ git pull origin master
remote: Counting objects: 7, done.
remote: Compressing objects: 100% (4/4), done.
remote: Total 7 (delta 2), reused 7 (delta 2), pack-reused 0
Unpacking objects: 100% (7/7), done.
From github.com:<username>/<reponame>
528d725..7560a95  master     -> origin/master
Updating 528d725..7560a95
Fast-forward
hmacsha1.sh   | 6 ++++++
src/test3.tst | 1 +
2 files changed, 7 insertions(+)
create mode 100644 hmacsha1.sh
create mode 100644 src/test3.tst
```

## Stash Operation

Stashing is saving uncommitted changes added to the local repository. This allows managing such changes which would require later attention. In fact, stash works as a linked list that is kept track of in `$PROJECT_ROOT/.git/refs/stash`. Everytime the command [`git stash`]({{page.git_docs_src}}/git-stash) is executed a ***kind of a temporary commit* is created in the said location, which can be referred to using `stash@{n}` where n being the zero-based index of the stash entry/commit. [This tutorial from Atlassian on Git](https://www.atlassian.com/git/tutorials/saving-changes/git-stash) explains how stashing functions under the hood.

```bash
$ git stash
Saved working directory and index state WIP on master: 7560a95 Merge branch 'master' of github.com:<username>/<reponame>
```

After stashing, those stashes could later be listed out as follows using `git stash list` command.

```bash
$ git stash list
stash@{0}: WIP on master: 7560a95 Merge branch 'master' of github.com:<username>/<reponame>
```

These stashes could later be launched for continuation of work using `git stash pop` command. This will apply the most recent stash reference (referred by `stash@{0}`) in to the working tree and the stash entry will be marked as garbage for later removal. ***Popping*** stash entries is analoguous to popping a stack.

```bash
$ git stash pop
On branch master
Your branch is up-to-date with 'origin/master'.
Changes to be committed:
(use "git reset HEAD <file>..." to unstage)
			
new file:   comp.txt
new file:   src/test3.txt
			
Dropped refs/stash@{0} (15a9d4f9088b151263f8f235330e67d6c9e771e7)
```

There is a `git stash apply` as well, which without a stash reference will apply the most recent stash reference. `git stash apply stash@{n}` where `n` is a non-negative integer will apply the `n+1`<sup>th</sup> stash entry. 

## Move & Rename Operations

This is done using [`git mv`]({{page.git_docs_src}}/git-mv) command, as given below. Needs to be followed by git add to add them in the stage area.

```bash
$ git mv path/of/location/file.name path/of/dest/file.name
$ git mv path/of/location/old.name path/of/location/new.name
```

The above are nothing more than git added to the typical linux move command.

## Delete Operation

Delete is also achieved by a similar strategy as above, using [`git rm`]({{page.git_docs_src}}/git-rm) command.

```bash
$ git rm file.name
```

## Reset Operations

Resetting the incorrect/accidental changes is possible in git before committing the changes. Practically, these files could reside in two different locations from git's standpoint,

 - in the local repo – Unintended deletions or modifications in the local repo could be restored by pulling out the required file from the local repo.
 - in the staging area – Files available in the staging area could be removed before the commit by checking them out from the HEAD. This involves an additional parameter added in the git checkout.

```bash
$ git checkout HEAD file.name
```

Apart from that, there is an explicit [`git reset`]({{page.git_docs_src}}/git-reset) command available, that deals with resetting using pointers for commits. This works in 3 different levels.

 - Soft: moves the `HEAD` pointer of the current branch to a specified commit without erasing the commits afterwards.

```bash
$ git reset --soft HEAD~
```

 - Mixed: removes the changes from the staging area. Local modifications are not affected and no effect on the commit either. Git reset defaults to this.

```bash
$ git reset –mixed <SOME COMMIT>
```

 - Hard: Pointer is moved to the specified commit, staging area is cleared and the local changes are also reverted.

```bash
$ git reset –hard <SOME COMMIT>
```

## Tagging

Idea of tagging is assigning a human-readable and meaningful name to a particular commit. This is particularly useful in software versioning. Git supports two flavors of tags namely,

 - ***Lightweight Tag*** - Acts as a branch that won't change. Functions as a readable pointer to a specific commit.

 - ***Annotated Tag*** - These are stored as full objects in the Git database, with their checksum and other information such as tagger name, email, date and a tagging message. These could be signed and verified with GNU Privacy Guard (GPG).

In general, annotated tags are the preferred mode of tagging, as it enables storing some information along with the tag. If for some reason it is required to omit all these additional information for some temporary requirements, a lightweight tag also can be used.

Creation of a tag could be done with [`git tag`]({{page.git_docs_src}}/git-tag) command. The commit that should be tagged with, can be mentioned either with its commit hash, or else using the pointer `HEAD`.

```bash
$ git tag -a "tagname" -m "Message on tag" HEAD
```

Once the tagging is done, it should be pushed to the remote repo as follows. `git push --tags` will push all the unpushed tags into the remote.

```bash
$ git push origin tag tagname
Counting objects: 1, done.
Writing objects: 100% (1/1), 166 bytes | 0 bytes/s, done.
Total 1 (delta 0), reused 0 (delta 0)
To git@github.com:0004072/repo_test_1
* [new tag]         tagname -> tagname
```

Tags could be listed down using the `-l` flag.

```bash
$ git tag -l
```

Tags could be deleted from the local repo as follows, with `-d` flag and tag name.

```bash
$ git tag -d 'tagname'
Deleted tag 'tagname' (was ff39d14)
```

Once the tag is removed from the local repo, to make them effective in the remote repo, it requires a push operation to be executed.

```bash
$ git push origin :V1.0
To https://github.com/user/repo.git
- [deleted]         V1.0
```

Also, the following can be used to delete tags in remote. Note that the local tag should still be removed.

```bash
$ git push --delete origin tagname
To https://github.com/user/repo.git
 - [deleted]         tagname
```