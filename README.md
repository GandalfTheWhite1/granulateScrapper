# Granulate Scrapper
Granulate home assignment
First npm install \
To run the code you need to run npm run build and npm run run \
To run tests you need to run npm run test
You will need to run postman and send a request to localhost:3000/parse with body {url: link}
If you want to check if a link exists you need to run get on /parsedData?url=link
Assumptions I made:
1) We need to save the links and their htmls as strings
2) No need for actual parsing of html and extracting links from it(although there is some code to enable if you want to read the html)
3) Therefore, I chose Mongo, and for this assignment I used in memory mongo server, so I can run it locally.
4) If an already existing link is sent we don't parse it further(Because the parser function basically crawls through the urls, no new information would be gained(except in the case where we have reached the capacity and manually stopped it, but it is a very rare case, and it can be easily changed if we do want to check duplicate links))
5) Swapping the mock mongo for the real mongo should be relatively easy, we need to just switch the mongo url and check for errors.

How I approached the assignment:
1) I tried to understand the requirements, I misunderstood the assignment, so I worked both with mongodb and redis, but finally settled on mongodb.
2) Once I understood the requirements I started by thinking which DB is best suited for this kind of request, because we need to save the html document, and we want to be able to scale it a lot, I chose mongodb.
3) After I understood I wanted to work with MongoDb I started working on the flow of the code, and then I started working on the code
4) I always try to create an MVP and expand upon it, making sure each time that more and more functionality works
5) So I created a simple flow in my notebook and started coding

So my process was:
1) Create a parsing function
2) Create a mock link function
3) Create a mongo mock client
4) Save/retrieve/check duplicate from mock client in the scrapper service
5) Create a crawler that takes a link and adds unique links to a queue and goes over the queue(BFS btw)
6) Wrote tests as I worked, to make sure that mongo client works, and then that the parser function works.

How to improve the project: 
1) Work with real Mongo, maybe some graph db, so you can see the links and how they connect, if you want to create a structure of connections or visualize the internet, or add a way to save the found links in the mongodb document in a separate field, so we won't have to parse them again.
2) Find a way to extract links in an efficient way, I have only parsed the html, and the link extraction is fake
3) Add a way to dynamically change the amount of links we want to find, maybe we want to add a limit on the request itself(for example, we want to find the first 100 links in wikipedia, not necessarily all of them), this of course can be done by adding more parameters to the request.
4) Add a way to search for different types of dom elements, so we can find all kinds of data and not just links.
5) Add a better DB layer, so it will be easy to switch between types of dbs, this can be done either locally or as a different microservice.(Currently if we want to use redis we need to change the redis service, so it will save json and not just the link)
6) Add verification to the requests, some sort of key(jwt) so we will not run unauthorized requests
7) Add CICD(dockerfile + github action), with automatic deployment to a cloud, making sure to run tests beforehand.
8) Add a DB service which will be the only connection to Mongo, so when we will want to scale up the project, we will not have to worry about the amount of Simultaneous connections we have to Mongo, also this layer(db service) will allow us to switch dbs easily, in this project I used the same functions with the same signatures more or less so the switch between mongo and redis is relatively simple.
