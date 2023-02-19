# project-properties-lucky
This is a simple web application that search `project.properties` on GitHub using the GitHub REST API and display the first searched content in a block.
## Visit
https://project.properties/
## Features
* Search for files on GitHub using the GitHub REST API.
* Display the content of the first result in a code block.
* Show the repository name, file path, and link to the file in the page.
* Redirect incoming HTTP requests to HTTPS.
## Requirements
* Certificate and private key
* List of Github fine-grained personal access tokens 
* Node.js
* `node-fetch` package
* `express` package
* `ejs` package
* `dotenv` package
## Deployment
1. Place private key in `private.key` and certificate includes chain in `certificate.crt`
2. Prepare tokens in `.env`
    > githubToken = ["your-github-token1", "your-github-token2"]
## Note
This repository is 90% up made with ChatGPT
