---
layout: post
title:  "Apache Maven"
date:   2016-09-19 15:42:18 +0530
categories: techbits
excerpt: Maven, created by Takari’s Jason van Zyl, began as a subproject of Apache Turbine in 2002. In 2003, it was voted on and accepted as a top-level Apache Software Foundation project. In July 2004, Maven’s release was the critical first milestone, v1.0. Maven 2 was declared v2.0 in October 2005 after about six months in beta cycles. Maven 3.0 was released in October 2010 is mostly backwards compatible with Maven 2. This is a quick glance at what exactly Maven is and what it can do.
---

Apache Maven is a build automation tool, which is currently used industry-wide. “Maven” is a Yiddish word meaning “accumulator of knowledge”. Maven acts as an accumulator for the knowledge required in building an application and hence the name is given.

Maven, created by Takari’s Jason van Zyl, began as a subproject of Apache Turbine in 2002. In 2003, it was voted on and accepted as a top-level Apache Software Foundation project. In July 2004, Maven’s release was the critical first milestone, v1.0. Maven 2 was declared v2.0 in October 2005 after about six months in beta cycles. Maven 3.0 was released in October 2010 is mostly backwards compatible with Maven 2.

Maven allows defining the knowledge required for building an application in a special annotation called “Project Object Model”, written in XML. This is available in a file named pom.xml for each project. For each phase in a build lifecycle (i.e. cleaning, compiling, testing, packaging, deployment and so forth), maven allows defining tasks for those goals along with the required dependencies. This way, it is like writing a build script that is being interpreted by some interpreter and accordingly, the build process is automated.

## Ant vs. Maven

Fundamentally, maven is different from ant as maven treats each software project as a consistent sequence of activities. In fact, this is quite applicable to most cases of software projects. However, maven requires the developer to look at the project in maven’s point of view in order to understand how maven would handle it, what happens when one executes a phase in Maven is not immediately obvious just from examining the Maven project file. Along with that, the developer has no much of control upon how things would be handled in maven. However, for those who have certain exposure to maven, can immediately get started working on a project seeing for the first time because the workflow is almost consistent from one project to another.

On the cons, there may be projects that do not really fit into this generic structure. Ant, on the other hand, does not look at a project as a project. It is rather using build scripts written in an optimized version of XML, allows clearer definitions of activities to perform. Each task performs an operation stipulated by the build scripts, which could involve copying files around, compiling sources and so forth. Thus, a developer who’s not so much familiar with ant can relatively easily read an ant script and understand the behaviour of the script. Yet, understanding the project structure and functions would be a daunting challenge based on the complexity of the project.

Uniformity wise, maven is miles ahead of ant. Even though ant allows maintaining a certain amount of uniformity, it is also very easy to stay out of the initially established uniformity. Compared to this, maven always imposes a certain way of doing certain things, making uniformity enforcement less of a problem.

In a nutshell, Maven is like a portable railway track. It would allow you reaching any desired destination, via a limited number of intermediary locations. Ant, on the other hand, is like a bulldozer that lets you reach any destination via any intermediary location.

## IDE Integration

Maven could be conveniently integrated with the following.

 - Eclipse
 - NetBeans
 - IntelliJ IDEA
 - JBuilder
 - JDeveloper (version 11.1.2)
 - MyEclipse

## Maven – Setup

Latest binaries of Maven could be downloaded from the [Apache official site]( https://maven.apache.org/download.cgi). From there the tarball could be downloaded.) After downloading, extract the tarball to any desired location with the following command.

{% highlight bash %}
sudo tar -C /path/of/desired/location -xzvf apache-maven-bin.tar.gz
{% endhighlight %}

Then, the location of the “bin” inside the extracted directory should be appended to the PATH variable. This could be done by modifying the /etc/environment file.

## Maven – Project Creation

Archetypes: These are templates for certain generic types of projects. Upon creation of projects, the project’s folder structure and certain source files are created in the desired location of the project, based on these archetypes. Example 1: Creating a stand-alone project. In a terminal, opened in the location that you need to create the project base directory, run the following command.

```bash
mvn archetype:generate -DgroupId=package.name -DartifactId=artifactName -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
```

 - `mvn` – invokes the maven runtime
 - `archetype:generate` – generates the folder structure and the flags and their functionality is as follows.
 - `groupId` – Name of the package
 - `artifactId` – Name of the artefact that is created
 - `archetypeArtifactId` – Name of the Maven template that should be used to create the project
 - `interactiveMode` – Governs the execution of the project generation as an interactive process with the user

Execution result would be something like following.

```bash
user@pc:~/Documents/Maven$ mvn archetype:generate -DgroupId=Test -DartifactId=Hello -DartifactArchetypeId=maven-archetype-quickstart -DinteractiveMode=false
 [INFO] Scanning for projects...[INFO]
 [INFO] ------------------------------------------------------------------------
 [INFO] Building Maven Stub Project (No POM) 1
 [INFO] ------------------------------------------------------------------------
 [INFO]
 [INFO] >>> maven-archetype-plugin:2.4:generate (default-cli) > generate-sources @ standalone-pom >>>
 [INFO]
 [INFO] <<< maven-archetype-plugin:2.4:generate (default-cli) < generate-sources @ standalone-pom <<<
 [INFO]
 [INFO] --- maven-archetype-plugin:2.4:generate (default-cli) @ standalone-pom ---
 [INFO] Generating project in Batch mode
 [INFO] No archetype defined. Using maven-archetype-quickstart (org.apache.maven.archetypes:maven-archetype-quickstart:1.0)
 Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.jar
 ownloaded: https://repo.maven.apache.org/maven2/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.jar (5 KB at 2.8 KB/sec)
 Downloading: https://repo.maven.apache.org/maven2/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.pom
 Downloaded: https://repo.maven.apache.org/maven2/org/apache/maven/archetypes/maven-archetype-quickstart/1.0/maven-archetype-quickstart-1.0.pom (703 B at 1.3 KB/sec)
 [INFO] ----------------------------------------------------------------------------
 [INFO] Using following parameters for creating project from Old (1.x) Archetype: maven-archetype-quickstart:1.0
 [INFO] ----------------------------------------------------------------------------
 [INFO] Parameter: basedir, Value: /home/hsenid/Documents/Maven
 [INFO] Parameter: package, Value: Test
 [INFO] Parameter: groupId, Value: Test
 [INFO] Parameter: artifactId, Value: Hello
 [INFO] Parameter: packageName, Value: Test
 [INFO] Parameter: version, Value: 1.0-SNAPSHOT
 [INFO] project created from Old (1.x) Archetype in dir: /home/hsenid/Documents/Maven/Hello
 [INFO] ------------------------------------------------------------------------
 [INFO] BUILD SUCCESS
 [INFO] ------------------------------------------------------------------------
 [INFO] Total time: 8.259 s
 [INFO] Finished at: 2016-09-15T10:28:34+05:30
 [INFO] Final Memory: 16M/174M
 [INFO] ------------------------------------------------------------------------
```

Following will be the folder structure generated by maven.

```
.
 |-- src
 |   |-- main
 |   |   `-- java
 |   |       `-- [your project's package]   
 |   |           `-- App.java
 |   `-- test
 |       `-- java
 |           `-- [your project's package]   
 |               `-- AppTest.java
  `-- pom.xml
```

Similarly, a web application could be created using maven as follows.

```bash
mvn archetype:generate -DgroupId=package.name -DartifactId=artifactName -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false
```

Here everything is the same, except that the project generated would be a web-app. Hence it would have a different folder structure. The folder structure is as follows.

```
.
 |-- src
 |   `-- main
 |       `-- java
 |           |-- resources
 |           |-- webapp
 |           |   `-- WEB-INF
 |           |       `-- web.xml
 |           `-- index.jsp
  `-- pom.xml
```