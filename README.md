# Granulate Scrapper
Granulate home assignment
First npm install \
To run the code you need to run npm run build and npm run run \
To run tests you need to run npm run test
You will need to run postman and send a request to localhost:3000/parse with body {url: link}
If you want to check if a link exists you need to run get on /parsedData?url=link
Assumptions I made - \
1) We don't need to save the html and we don't need to save the connections between the different urls
2) We only need to save the links themselves. 
3) No need for actual parsing of html and extracting links from it(although there is some code to enable if you want to read the html)
4) Therefore, I chose Redis, and for this assignment I used io-redis mock, so I can run it locally.
5) If an already existing link is sent we don't parse it further(Because the parser function basically crawls through the urls, no new information would be gained(except in the case where we have reached the capacity and manually stopped it, but it is a very rare case, and it can be easily changed if we do want to check duplicate links))
6) Swapping the mock redis for the  real redis should be easy

How I approached the assignment:
1) I tried to understand the requirements, I made a wrong assumption, so I worked with Mongodb at first, (I needed to ask questions to better understand it).
2) Once I understood the requirements I started by thinking which DB is best suited for this kind of request, because we don't need to save documents, just unique keys, I chose redis, as it is a very fast in-memory db which excels in saving and loading key/value object.
3) After I understood I wanted to work with Redis I started working on the flow of the code, and then I started working on the code
4) I always try to create an MVP and expand upon it, making sure each time that more and more functionality works
5) So I created a simple flow in my notebook and started coding

So my process was:
1) Create a parsing function
2) Create a mock link function
3) Create redis mock client
4) Save/retrieve/check duplicate from mock client in the scrapper service
5) Create a crawler that takes a link and adds unique links to a queue and goes over the queue(BFS btw)
6) Wrote tests as I worked, to make sure that redis client works, and then that the parser function works.

How to improve the project: 
1) Work with real Redis, maybe some graph db, so you can see the links and how they connect, if you want to create a structure of connections or visualize the internet.
2) Find a way to extract links in an efficient way, I have only parsed the html, and the link extraction is fake
3) Add a way to dynamically change the amount of links we want to find, maybe we want to add a limit on the request itself(for example, we want to find the first 100 links in wikipedia, not necessarily all of them), this of course can be done by adding more parameters to the request.
4) Add a way to search for different types of dom elements, so we can find all kinds of data and not just links.
5) Add verification to the requests, some sort of key(jwt) so we will not run unauthorized requests
6) Add CICD(dockerfile + github action), with automatic deployment to a cloud, making sure to run tests beforehand.
7) Add a redis service which will be the only connection to redis, so when we will want to scale up the project, we will not have to worry about the amount of Simultaneous connections we have to Redis.
8) Maybe we would also want to add different sets in Redis, and not have just 1 set with all the URLs as it will be harder and harder to find whether a URL is unique and adding it, but Redis does work very well with large sets and each set requires additional memory.
