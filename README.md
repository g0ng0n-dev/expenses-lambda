# Serverless Expenses App

# Functionality of the application

This application will allow creating/removing/updating/fetching Expenses Items to track your Personal Finance Expenses. 
Each Expense item can optionally have a Ticket attachment image. Each user only has access to Expenses items that he/she has created.

# Expense item Model

The application should store Expense items, and each Expense item contains the following fields:

* `expenseId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `merchantName` (string) - name of a Merchant where you pay your expense
* `date` (string) - date and time of the expense
* `amount` (string) - the amount that you pay
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Expense item

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless Expenses application.

