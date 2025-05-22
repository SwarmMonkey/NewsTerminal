# Setting Up Cloudflare D1 with Vercel Frontend

This guide explains how to connect your Vercel deployment (https://news-terminal-beta.vercel.app/) with a Cloudflare D1 database using Cloudflare Workers.

## Architecture Overview

```
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│               │      │               │      │               │
│  Vercel App   │ ──→  │  CF Worker    │ ──→  │  D1 Database  │
│  (Frontend)   │ ←──  │  (API Server) │ ←──  │ (Data Storage)│
│               │      │               │      │               │
└───────────────┘      └───────────────┘      └───────────────┘
```

## Step 1: Deploy Cloudflare Worker API

1. Navigate to the `cloudflare-worker` directory:
   ```bash
   cd cloudflare-worker
   ```

2. Deploy the worker to Cloudflare:
   ```bash
   wrangler deploy
   ```

3. Note the URL of your deployed worker (e.g., `https://newsnow-api.yourusername.workers.dev`)

## Step 2: Update Frontend API Client

1. Update the API base URL in `src/api/articles.ts`:
   ```typescript
   const API_BASE_URL = "https://newsnow-api.yourusername.workers.dev"
   ```
   Replace the URL with your actual deployed worker URL.

2. Build your Vercel app:
   ```bash
   npm run build
   ```

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## Step 3: Test the Connection

1. Make sure your D1 database has some data in it:
   ```bash
   wrangler d1 execute newsnow-db --command "INSERT INTO categories (name) VALUES ('Technology'), ('Science'), ('Business'), ('World')"
   ```

2. Visit your Vercel app and check if it can fetch data from the D1 database through the Cloudflare Worker API.

## Security Considerations

1. **CORS**: The Cloudflare Worker is configured to only accept requests from your Vercel app domain. Update the CORS headers if needed.

2. **Authentication**: For a production app, add authentication to protect your API endpoints. Consider using JWT tokens or API keys.

3. **Rate Limiting**: Consider adding rate limiting to your Cloudflare Worker to prevent abuse.

## Troubleshooting

- If the frontend can't connect to the worker, check the CORS configuration.
- If the worker can't connect to D1, make sure the database_id in wrangler.toml is correct.
- Check the Cloudflare Worker logs for any errors.

## Additional Resources

- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Vercel Documentation](https://vercel.com/docs)
