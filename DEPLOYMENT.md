# Deployment Guide: Next.js + Vercel + Postgres

Since you are using **Next.js**, the best place to host your application is **Vercel**.

## ⚠️ Important: Database Change Required
Currently, your project uses **SQLite** (`file:./dev.db`). SQLite stores data in a local file, which **does not work** on Vercel because Vercel's file system is "ephemeral" (it resets frequently, deleting your data).

To make this "proper" for production, you need to switch to a cloud database like **Vercel Postgres** or **Neon**.

## Step 1: Create a Vercel Project
1.  Go to [Vercel.com](https://vercel.com) and sign up/login.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your GitHub repository: `finance-fund`.
4.  **Do not deploy yet.** We need to set up the database first.

## Step 2: Set up Vercel Postgres (Free)
1.  In your Vercel Project Dashboard, go to the **Storage** tab.
2.  Click **"Connect Store"** -> **"Create New"** -> **"Postgres"**.
3.  Accept the terms and create the database.
4.  Once created, go to the **".env.local"** tab in the database page.
5.  Copy the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING`.

## Step 3: Update Your Code for Postgres
You need to update your `prisma/schema.prisma` file to use Postgres instead of SQLite.

**Modify `prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql" // Changed from sqlite
  url      = env("POSTGRES_PRISMA_URL") // Uses connection pooling
  directUrl = env("POSTGRES_URL_NON_POOLING") // Uses direct connection
}
```

## Step 4: Push Changes
1.  Run the following commands locally to generate the new client:
    ```bash
    npm install @prisma/extension-accelerate
    npx prisma generate
    ```
2.  Commit and push these changes to GitHub:
    ```bash
    git add .
    git commit -m "Switch to Postgres for production"
    git push
    ```

## Step 5: Deploy
1.  Go back to your Vercel Project.
2.  Go to **Settings** -> **Environment Variables**.
3.  Vercel should automatically add the database variables if you created the store within the project. If not, paste the `POSTGRES_PRISMA_URL` and `POSTGRES_URL_NON_POOLING` you copied earlier.
4.  Go to **Deployments** and redeploy (or push a new commit to trigger it).
5.  **Initialize the DB**: Vercel might not auto-migrate. You may need to run this command in your local terminal (connected to the remote DB via .env) or add a build command:
    ```bash
    npx prisma db push
    ```
    *(Note: To run this locally against the production DB, you need to put the Vercel env vars in your local `.env` file temporarily).*

## Alternative: Keep SQLite (Not Recommended for Vercel)
If you absolutely want to keep SQLite, you cannot use Vercel. You must use a VPS (Virtual Private Server) like:
*   **Railway** (has persistent volumes)
*   **Render** (with disk)
*   **DigitalOcean Droplet** (you manage the server)
