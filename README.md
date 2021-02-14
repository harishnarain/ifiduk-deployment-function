# IFIDUK - The marketplace for web based apps

[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

IFIDUK is an app suite for running your own SaaS marketplace. You assemble your app and deploy it on IFIDUK where your users can visit and deploy their own instances.

The suite consists of the following:

- A ReactJS front end that uses Azure Active Directory B2C for authentication and authorization - https://github.com/harishnarain/ifiduk-app
- An Azure Functions App that handles all CRUD operations and a MongoDB seeder. The functions app will also require Azure Service Bus for sending deployment messages - https://github.com/harishnarain/ifiduk-deployment-function
- The IFIDUK Server Agent that deploys containers on Docker - https://github.com/harishnarain/ifiduk-agent
- IFIDUK Terraform code to deploy services on Azure (Work in progress) - https://github.com/harishnarain/ifiduk-terraform

## Table of Contents

- [IFIDUK - The marketplace for web based apps](#ifiduk---the-marketplace-for-web-based-apps)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Routes](#routes)
  - [Features](#features)
  - [License](#license)
  - [Contributing](#contributing)
  - [Screenshots](#screenshots)
  - [Questions](#questions)

## Installation

This is the installation instructions for the Azure Function App.

1. Clone this GitHub repository

   ```
   git@github.com:harishnarain/ifiduk-deployment-function.git
   ```

2. Install all dependent npm packages

   ```
   npm install --save
   ```

3. Update config/auth.json with relevant information to your Azure AD B2C tenant. Update local.settings.json with updated MongoDB and Azure Service Bus connection strings.

4. Run the development server

   ```
   func start
   ```

5. To deploy to Azure Functions run and update the application settings with MongoDB and Azure Service Bus connection strings.

   ```
   func azure functionapp publish <Enter your function app name>
   ```

## Routes for all functions

All routes except for [GET - /api/products] are guarded and require a valid Bearer token

- [POST - /api/organizations] - Used to create an organization post sign up of a new account
- [POST - /api/products] - Used to create a product
- [POST - /api/subscriptions] - Used to create a new subscription
- [DELETE - /api/subscriptions/:id] - Used to delete a subscription by subscription ID
- [GET - /api/organizations] - Used to get all organizations
- [GET - /api/products] - Used to get all products. This route is not guarded
- [GET - /api/subscriptions] - Used to get all subscriptions

## Deployment or Deletion process

1. The CreateSubscription receives a POST request from the IFIDUK front end client app. Alternatively DeleteSubscription can receive a DELETE request from the client app.
2. Creates a document in MongoDB with status of "Pending" and reference in organization document for CreateSubscription. For DeleteSubscription the status field is updated to "Deleting"
3. Generates a JSON message and sends it to the Azure Service Bus queue
4. From here the request is processed by the IFIDUK Server Agent. Check out that repository for its operations. https://github.com/harishnarain/ifiduk-agent

## Post deployment or deletion process

1. The Azure Service Bus message is received.
2. For deployment operations the MongoDB document is updated with status of "Running". For deletions the MongoDB document for the subscription is deleted and the reference in the organization document is also removed.

## Features

- Azure Functions
- Azure Active Directory B2C authorization
- Azure Service Bus
- ExpressJS
- Mongoose ODM

## License

This project uses the MIT license

## Contributing

Pull requests are welcome

## Questions

Checkout my GitHub [profile](https://github.com/harishnarain)

Please feel free to email at: <Harish.Narain@microsoft.com>
