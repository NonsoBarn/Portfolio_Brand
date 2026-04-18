# Spotify "Now Playing" Setup

Getting the refresh token is a one-time process. Once you have it, it never expires as long as you use it at least once every 60 days.

## Step 1 — Create a Spotify App

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Click **Create app**
3. Fill in any name/description
4. Add this Redirect URI: `http://localhost:3000/callback`
5. Copy your **Client ID** and **Client Secret** into `.env.local`

## Step 2 — Authorize and Get the Code

Open this URL in your browser (replace `YOUR_CLIENT_ID`):

```
https://accounts.spotify.com/authorize?client_id=YOUR_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000/callback&scope=user-read-currently-playing,user-read-playback-state
```

After you click **Agree**, Spotify redirects you to:

```
http://localhost:3000/callback?code=LONG_CODE_HERE
```

Copy the `code` value from the URL.

## Step 3 — Exchange the Code for a Refresh Token

Run this curl command in your terminal (replace the placeholders):

```bash
curl -X POST https://accounts.spotify.com/api/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -u "YOUR_CLIENT_ID:YOUR_CLIENT_SECRET" \
  -d "grant_type=authorization_code&code=YOUR_CODE&redirect_uri=http://localhost:3000/callback"
```

The response will include a `refresh_token`. Copy it into `.env.local`:

```env
SPOTIFY_REFRESH_TOKEN=your_refresh_token_here
```

## Step 4 — Test

Start the dev server and open `http://localhost:3000/api/spotify`. If Spotify is playing something you'll see live track data. If nothing is playing you'll see `{ "isPlaying": false }`.

## Notes

- The **refresh token** does not expire as long as it's used within 60 days.
- The `/api/spotify` route is set to `force-dynamic` so it never caches — the progress bar stays live.
- If you revoke access from your Spotify account settings you'll need to repeat this process.
