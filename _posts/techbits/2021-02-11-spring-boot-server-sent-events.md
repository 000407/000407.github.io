---
layout: post
title:  "Server-Sent Events in Action"
date:   2021-02-11 00:00:00
categories: techbits
excerpt: In client-server architecture, the modes of interaction between the client and the server are primarily two-fold. They are namely Push and Pull. Generally, the server is understood to be passive, where the interaction is initiated from the side of the client, making the client the active party. But this is not the case, when the server wants to notify the client when there is a specific event occurred on the side of the server. These events are sent, or pushed to the client as they occur. This article is about Server-Side Events and how to use them.
scripts: ["mermaid.min"]
src_raw_host: https://raw.githubusercontent.com/000407/sse_demo/master/src
src_host: https://github.com/000407/sse_demo/blob/master/src
---

In client-server architecture, the modes of interaction between the client and the server are primarily two-fold. They are namely Push and Pull. Generally, the server is understood to be passive, where the interaction is initiated from the side of the client, making the client the active party. Whenever the client wants, the client will poke the server saying *hey, are you up?* and the server will keep an ear on the line listening to such *hey!* messages. This is known as ***pull-messaging***. But this is not the case, when the server wants to notify the client when there is a specific ***event*** occurred on the side of the server. These events are ***sent***, or ***pushed*** to the client as they occur. This is the reason why we employ ***Server-Sent Events*** in the first place.

According to [Wikipedia's page](https://en.wikipedia.org/wiki/Server-sent_events),

 > Server-Sent Events is a standard describing how servers can initiate data transmission towards clients once an initial client connection has been established. They are commonly used to send message updates or continuous data streams to a browser client and designed to enhance native, cross-browser streaming through a JavaScript API called EventSource, through which a client requests a particular URL in order to receive an event stream.

![Standard Client-Server Interaction](/assets/img/posts/spring_sse/standard_client_server.png#center)

The above diagram depicts the difference between the two. In fact in server-sent events, the initial connection is again requested by the client. This could be achieved for instance using [EventSource](https://developer.mozilla.org/en-US/docs/Web/API/EventSource) in JavaScript. Server-sent events differ from [Web Sockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) as Server-Sent Events are ***uni-directional*** while Web Sockets are ***bi-directional***. That means Server-Sent Events, as the name implies are on the direction of `Server -> Client` but not the other way around.

## Server-Sent Events with Spring

The famous [Spring Framework](https://spring.io/projects/spring-framework) provides support for reactive-stack web applications to run on non-blocking servers such as Netty and Undertow, with [Spring Webflux](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html). This is a popular library among developers for its streaming capability and so forth. We will be using Webflux to create a streaming API. Let's get started.

This demo mainly comprises of two services which are integrated with streams over HTTP.

 1. `EventEmitter` - This is the origin of events. This will also have a standard HTTP endpoing which is not streaming data.
 2. `EventConsumerProxy` - This is the service that is acting as a proxy. This consumes both the streaming and non-streaming endpoints from the `EventEmitter` and provides two streaming endpoints, one for each.

In the `EventEmitter`, there is a controller [`EventEmitterController`]({{page.src_host}}/sse_emitter/java/sse_emitter/controller/EventEmitterController.java), that has a method `Flux<ServerSentEvent<String>> streamEvents()` which appears as follows. Let's break down what the statements of this method means.

{% gyst https://raw.githubusercontent.com/000407/sse_demo/master/src/sse_emitter/java/sse_emitter/controller/EventEmitterController.java#L29-L45 %}

 - `@GetMapping(...)` - typical Spring controller endpoint URL mapping
 - Return type `Flux<ServerSentEvent<String>>` - This return is important, as it specifies the response of this endpoint would be a reactive stream of data with the content type `text/event-stream`
 - Construction of the [`ServerSentEvent`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/http/codec/ServerSentEvent.html) - The SSE object is created using the builder specified in the said class.

In addition, there is a `Thread.sleep(...)` that adds a random delay to this event generation. This is to mimic the random behaviour of event generation. When this endpoint is accessed with `http://localhost:8099/stream` in a web browser, the result would be as follows.

```bash
id:0
event:periodic-event
data:SSE - 2021-02-11T22:29:57.493093900

id:1
event:periodic-event
data:SSE - 2021-02-11T22:29:59.896589400

id:2
event:periodic-event
data:SSE - 2021-02-11T22:30:02.135695500

id:3
event:periodic-event
data:SSE - 2021-02-11T22:30:03.512121300

id:4
event:periodic-event
data:SSE - 2021-02-11T22:30:05.739262100

id:5
event:periodic-event
data:SSE - 2021-02-11T22:30:07.930640900
```

The `EventConsumerProxy` is intended to act as an intermediary, which creates a stream by consuming the stream from the `EventEmitter`. To access the `EventEmitter` over HTTP, `EventConsumerProxy` has a service [`EventService]({{page.src_host}}/main/java/com/kaze2/sse_demo/service/EventService.java), which is written as follows.

{% gyst https://raw.githubusercontent.com/000407/sse_demo/master/src/main/java/com/kaze2/sse_demo/service/EventService.java#L16-L44 %}

This class
 - employs [`WebClient`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/web/reactive/function/client/WebClient.html) which is a ***Non-blocking, reactive client to perform HTTP requests, exposing a fluent, reactive API over underlying HTTP client libraries such as Reactor Netty***.
 - has `Flux<ServerSentEvent<String>> consumeStream()`, that the `webClient` instance accesses the `EventEmitter` and creates the stream of events.
    + `.accept(MediaType.TEXT_EVENT_STREAM)` - Sets the expected content type. Notice the accept type is set to `text/event-stream`.
    + `.bodyToFlux(type)` - Creates a [`Flux`](https://projectreactor.io/docs/core/release/api/reactor/core/publisher/Flux.html) of type `type`, which is a [`ParameterizedTypeReference`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/core/ParameterizedTypeReference.html) of type `ServerSentEvent`.

This service is consumed by [`EventController`]({{page.src_host}}/main/java/com/kaze2/sse_demo/controller/EventController.java). Notice the use of the `map(Function<? super T,? extends V> mapper)` method to map the stream items into a new stream of `ServerSentEvent`s which are based on the origin `EventEmitter`.

{% gyst https://raw.githubusercontent.com/000407/sse_demo/master/src/main/java/com/kaze2/sse_demo/controller/EventController.java#L29-L41 %}

When this endpoint is accessed with `http://localhost:8088/stream` in a web browser, the result would be as follows.

```bash
id:PROXY::0
event:PROXY::periodic-event
data:PROXY::SSE - 2021-02-11T22:30:56.395588800

id:PROXY::1
event:PROXY::periodic-event
data:PROXY::SSE - 2021-02-11T22:30:58.741941900

id:PROXY::2
event:PROXY::periodic-event
data:PROXY::SSE - 2021-02-11T22:31:00.987860

id:PROXY::3
event:PROXY::periodic-event
data:PROXY::SSE - 2021-02-11T22:31:02.383951

id:PROXY::4
event:PROXY::periodic-event
data:PROXY::SSE - 2021-02-11T22:31:04.744465

id:PROXY::5
event:PROXY::periodic-event
data:PROXY::SSE - 2021-02-11T22:31:06.507792900
```

When the result streams are compared, it is evident that the `EventConsumerProxy` is actually routing the streamed response from `EventEmitter`.

{% gyst https://raw.githubusercontent.com/000407/sse_demo/master/src/main/java/com/kaze2/sse_demo/service/EventService.java#L33-L43 %}

In the above snippet of `EventService`, the method `Flux<SomeDTO> createStream()` repeatedly consumes a typical REST endpoint that provides `application/json` in evey 1 second, creating a stream. This is particularly useful as a method of pinging a source for updates. Notice

 - the use of `.delaySubscription(Duration.ofSeconds(1))` delaying access to the endpoint by 1 second
 - the use of `repeat()` which plays the same HTTP request repeatedly, that which creates a stream of updates.

### a final note...

Server-Sent Events has its own merits and demerits. For merits

 - it uses HTTP, so supporting this is trivial
 - it can be poly-filled (using something like JS) to "backport" to browsers with no support
 - has reconnect and event ID built-in
 - it is particularly useful in the cases where there are one-way server originated communication requirements (e.g. live updates to stock prices)

However, these could be achieved only within the following constraints/limitations

 - SSE is limited to UTF-8; no support binary data
 - SSE is having an imposed limitation on maximum number of concurrent connections. This can be particularly hindering when opening multiple tabs as the limit is per browser and set to a very low number ([about 6](https://stackoverflow.com/a/16853226/3126973), 100 by default with HTTP/2 and HTTP/3)

That's it for this one lads. Feel free to drop a comment below. Happy coding! :sunglasses:

### References

 - [WebSockets vs Server-Sent Events](https://www.ably.io/blog/websockets-vs-sse)
 - [Server Sent Event is Spring](https://www.baeldung.com/spring-server-sent-events)
 - [SSE(EventSource): why no more than 6 connections?](https://stackoverflow.com/a/16853226/3126973)