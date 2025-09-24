# Deployment Configuration

## Environment Variables

Create a `.env` file in the `fitness-app-client` directory with the following variables:

```bash
# For local development
REACT_APP_API_URL=http://localhost:4000

# For production (replace with your deployed backend URL)
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## Vercel Deployment

When deploying to Vercel, add the environment variable:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add `REACT_APP_API_URL` with your production backend URL

## Example Production URLs

- Railway: `https://your-app.railway.app`
- Heroku: `https://your-app.herokuapp.com`
- Render: `https://your-app.onrender.com`
