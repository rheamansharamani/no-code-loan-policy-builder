# no-code-loan-policy-builder

### AI-Powered Business Rule Engine for Lending Institutions

> **Build, Manage, Test, and Deploy Lending Rules without Writing Code.**

RuleForge AI is a configurable Business Rule Management System (BRMS) designed for banks and financial institutions. It enables business users to create and modify loan eligibility policies through an intuitive visual interface or natural language using AI, eliminating the need for developer intervention.

---

# 🚀 Problem Statement

Financial institutions frequently launch new loan products and revise lending policies.

Traditional systems require developers to modify backend code whenever business rules change.

Example:

```java
if(age >= 21 && income >= 500000 && cibil >= 750)
```

If the business decides that the minimum income should be ₹4,00,000 instead of ₹5,00,000, the application must be modified, tested, and redeployed.

This dependency slows down policy updates and increases operational costs.

---

# 💡 Our Solution

RuleForge AI separates **business rules** from **application code**.

Business managers can:

- Create Loan Products
- Define Eligibility Rules Visually
- Generate Rules using AI
- Test Customer Eligibility
- View Rule History
- Rollback Previous Versions
- Track Audit Logs

No coding required.

---

# ✨ Features

## 📊 Dashboard

- Total Loan Products
- Active Rules
- Rules Updated Today
- Applications Processed
- Approval Rate
- Recent Activity

---

## 🏦 Loan Product Management

Supports multiple configurable loan products.

Example

- Home Loan
- Car Loan
- Education Loan
- Gold Loan
- Business Loan

Each product maintains its own rule configuration.

---

## ⭐ Visual Rule Builder

Business users create rules using an intuitive interface.

Example

```
Applicant Age >= 23

AND

Monthly Income >= 50000

AND

Employment Type = Salaried

AND

CIBIL Score >= 700
```

No programming knowledge required.

---

## 🤖 AI Rule Generator

Users simply describe the policy in plain English.

Example

```
Create a Home Loan for salaried employees above age 23
with income above 4 lakh and CIBIL above 700.
```

AI converts it into structured business rules automatically.

---

## 📚 Rule Library

Manage every business rule.

- Create
- Edit
- Delete
- Disable
- Search
- Filter

---

## 🧪 Rule Tester

Evaluate customer eligibility instantly.

Input

```
Age : 25

Income : 600000

Employment : Salaried

CIBIL : 780
```

Output

```
Eligible ✅
```

or

```
Rejected ❌

Reason:

Income should be greater than ₹500000.
```

---

## 📜 Rule Version History

Every modification creates a new version.

```
Version 1

Income >= 500000

------------------

Version 2

Income >= 400000
```

Supports rollback.

---

## 📝 Audit Logs

Every action is recorded.

```
Rahul

Created Home Loan Rule

10:25 AM

----------------

Priya

Updated Gold Loan Rule

Yesterday
```

---

# 🧠 AI-Powered Features

- Natural Language → Rule Conversion
- Explainable Decisions
- Configurable Metadata
- Zero Developer Dependency
- Rule Validation
- AI-Assisted Policy Creation

---

# 🏗️ System Architecture

```
                Business User

                       │

                       ▼

          Visual Rule Builder / AI

                       │

                       ▼

            Business Rule Engine

                       │

          ┌────────────┴─────────────┐

          ▼                          ▼

     Rule Storage             Rule Evaluation

          │                          │

          └────────────┬─────────────┘

                       ▼

              Loan Eligibility Result
```

---

# ⚙️ Technology Stack

## Frontend

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)

## Backend

- Node.js
- Express.js

## Database

- SQLite

## AI

- Groq API
- Llama 3.3 70B

---

# 📂 Project Structure

```
ruleforge-ai/

│

├── public/

│   ├── css/

│   ├── js/

│   └── pages/

│

├── routes/

├── services/

├── database/

├── utils/

├── server.js

└── README.md
```

---

# 🎯 Business Benefits

✅ No Developer Dependency

Business teams can modify lending policies without waiting for engineering.

---

✅ Faster Policy Deployment

New rules can be published instantly.

---

✅ Improved Transparency

Every approval and rejection is explainable.

---

✅ Reduced Operational Cost

Business rules become configurable instead of hardcoded.

---

✅ Enterprise Ready

Supports versioning, auditing, and future scalability.

---

# 📈 Future Enhancements

- AI Conflict Detection
- Rule Simulator
- Bulk Customer Testing
- Rule Analytics Dashboard
- Policy Comparison
- Multi-Level Approval Workflow
- User Authentication
- Role-Based Access Control
- Export Rules to JSON/PDF
- Integration with Core Banking Systems

---


# 🏆 USP

Unlike traditional rule management systems, RuleForge AI enables business users to generate lending rules directly from natural language while maintaining explainability, version control, and enterprise-grade configurability.

---

# 📄 License

Developed as part of a Hackathon Project.

For educational and demonstration purposes.