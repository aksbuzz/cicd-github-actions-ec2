# CI/CD with GitHub Actions and AWS EC2

This repository demonstrates a standard CI/CD pipeline for a TypeScript Node.js application. It automates testing and deployment to multiple environments on AWS EC2, complete with a database and migration steps.

## Features

*   **Multi-Environment Deployments:** Separate `dev` and `prod` environments.
*   **Secure Authentication:** Uses AWS IAM Roles (OIDC) for secure, keyless authentication from GitHub Actions.
*   **Automated Migrations:** Database schema changes are managed with `knex` and applied automatically on deployment.


## Dev Workflow

1.  **Feature Development:**
    *   Create a feature branch from `develop` (e.g., `feature/my-new-api`).
    *   When work is complete, open a **Pull Request to `develop`**. This automatically runs the `build-and-test` job to validate your changes.

2.  **Deploy to Development:**
    *   Once the PR is approved and **merged into `develop`**, the pipeline automatically builds a new version and deploys it to the **dev** environment.

3.  **Deploy to Production:**
    *   When `develop` is stable and ready for release, open a **Pull Request from `develop` to `main`**.
    *   After the PR is approved and **merged into `main`**, the production deployment pipeline is triggered.
    *   The deployment will **pause for manual approval**. A designated reviewer must approve the deployment in the GitHub Actions UI before it proceeds to the **prod** environment.

---

## Setup Guide

Follow these steps to replicate this setup in your own AWS account and GitHub repository.

### 1. AWS Setup

#### EC2 Instance
*   Launch an **Amazon Linux 2** EC2 instance (`t2.micro` is fine).
*   Create and download a new **SSH Key Pair**.
*   Configure its **Security Group** to allow inbound traffic on:
    *   **Port 22 (SSH)** from your IP (or `0.0.0.0/0` for simplicity).
    *   **Ports 3001-3002 (TCP)** for our dev and prod apps (`0.0.0.0/0`).

#### RDS PostgreSQL Database
*   Launch a **PostgreSQL** RDS instance.
*   Set it to be in the **same VPC** as your EC2 instance and set **Public Access** to **"No"**.
*   Configure its **Security Group** to allow inbound traffic on **Port 5432 (PostgreSQL)** from the *EC2 instance's security group*.

#### IAM & OIDC for Secure Authentication
1.  **Create OIDC Provider:** In the IAM console, add `token.actions.githubusercontent.com` as an OpenID Connect identity provider. 
2.  **Create IAM Role:** Create a role for a "Web Identity", selecting the OIDC provider you just created. Point it to your GitHub organization and repository. Name it `GitHubActionsEC2DeployRole`.

### 2. GitHub Configuration

#### Environments
*   In your repository, go to **Settings > Environments**.
*   Create two environments: `dev` and `prod`.
*   For the `prod` environment, add a **protection rule** for **"Required reviewers"** and add yourself or your team.

#### Secrets
*   Add the following secrets in **Settings > Secrets and variables > Actions**.

| Secret Name                | Level       | Description                                                                 |
| -------------------------- | ----------- | --------------------------------------------------------------------------- |
| `AWS_REGION`               | Repository  | Your AWS region (e.g., `us-east-1`).                                          |
| `AWS_ROLE_TO_ASSUME_ARN`   | Repository  | The full ARN of the `GitHubActionsEC2DeployRole` you created.                 |
| `EC2_HOST`                 | Repository  | The public IP address of your EC2 instance.                                 |
| `EC2_USER`                 | Repository  | The EC2 instance username (`ec2-user` for Amazon Linux).                      |
| `EC2_SSH_KEY`              | Repository  | The complete private key from the `.pem` file you downloaded.                 |
| `DEV_ENV_FILE_CONTENT`     | `dev` Env   | The content of the `.env` file for the dev environment (port, DB name, etc.). |
| `PROD_ENV_FILE_CONTENT`    | `prod` Env  | The content of the `.env` file for the prod environment.                      |

### 3. Final Steps

1.  **SSH into your EC2 instance** and install Node.js (via `nvm`), `git`, `pm2`, and the `postgresql` client.
2.  **Create the databases** (`my_app_dev`, `my_app_prod`) on your RDS instance by connecting from your EC2 instance.
3.  **Push your code** to GitHub and start the workflow!

---

## Running Locally

1.  Clone the repository.
2.  Install dependencies: `npm install`.
3.  Create a `.env` file in the root directory with your local database credentials.
4.  Run the database migrations: `npm run migrate`.
5.  Build the TypeScript code: `npm run build`.
6.  Start the server: `npm start`.

## Tech Stack

*   Node.js & TypeScript
*   Express.js
*   PostgreSQL
*   Knex.js (for migrations)
*   GitHub Actions
*   AWS EC2 & RDS