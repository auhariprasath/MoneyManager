
# 📊 MongoDB Schema – Completed Modules  
**Money Manager Application**

This document describes the MongoDB schema design for the **core completed modules** of the Money Manager application.  
The schema is designed with scalability, simplicity, and analytics in mind.

---

## 1️⃣ Users Collection

### 📁 Collection Name: `users`

### Purpose
Stores **user profile information** required for identification and reference in analytics and budgeting.

### Schema
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "passwordHash": "String",

  "profile": {
    "age": "Number",
    "occupation": "String",
    "monthlyIncome": "Number"
  },

  "createdAt": "YYYY-MM-DD",
  "updatedAt": "YYYY-MM-DD"
}
````

### Design Notes

* Each document represents one user.
* `email` is unique and used for authentication.
* Profile data is kept separate from transactional data.
* Preferences are intentionally excluded at this stage for simplicity.

---

## 2️⃣ Transactions Collection

### 📁 Collection Name: `transactions`

### Purpose

Stores **all income and expense records** entered by the user.

### Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",

  "type": "income | expense",
  "category": "String",
  "amount": "Number",

  "date": "YYYY-MM-DD",
  "notes": "String"
}
```

### Design Notes

* Each transaction is linked to a user using `userId`.
* `type` differentiates income from expenses.
* Date is stored without time to simplify monthly and yearly analytics.
* Categories enable meaningful spending analysis.

---

## 3️⃣ Budgets Collection

### 📁 Collection Name: `budgets`

### Purpose

Defines **category-wise spending limits** for a specific time period.

### Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",

  "category": "String",
  "limitAmount": "Number",

  "period": {
    "type": "monthly | weekly",
    "startDate": "YYYY-MM-DD",
    "endDate": "YYYY-MM-DD"
  }
}
```

### Design Notes

* A user can set multiple budgets for different categories.
* Budget comparison is done by summing expenses within the defined period.
* The period structure supports future extensions (weekly, yearly).

---

## 4️⃣ Goals Collection

### 📁 Collection Name: `goals`

### Purpose

Stores **financial goals** set by the user and tracks progress toward them.

### Schema

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",

  "name": "String",
  "targetAmount": "Number",
  "currentAmount": "Number",

  "deadline": "YYYY-MM-DD",
  "status": "active | completed"
}
```

### Design Notes

* Goals are independent of transactions for flexible tracking.
* `currentAmount` represents progress toward the goal.
* `status` helps distinguish active and completed goals.
* Deadline-based design supports time-bound planning and suggestions.

---

## ✅ Summary of Completed Modules

| Collection   | Description                          |
| ------------ | ------------------------------------ |
| users        | User profile information             |
| transactions | Income and expense tracking          |
| budgets      | Category-wise budget limits          |
| goals        | Financial goal planning and tracking |

