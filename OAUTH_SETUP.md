# Google Console Settings

## 1. Go to Google Cloud Console
- Visit: https://console.cloud.google.com/
- Select your project or create a new one

## 2. Enable Google+ API
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" and enable it

## 3. Create OAuth 2.0 Client ID
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client IDs"
- Application type: "Web application"
- Name: "VMKV NCC Web App"

## 4. Authorized JavaScript origins
- Add: `http://localhost:8085` (for dev)
- Add: `https://yourdomain.com` (for production)

## 5. Authorized redirect URIs
- Add: `http://localhost:8085` (for dev)
- Add: `https://yourdomain.com` (for production)

## 6. Copy Client ID
- Copy the Client ID (ends with .apps.googleusercontent.com)
- Set in .env: `VITE_GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"`

---

# Microsoft Azure Settings

## 1. Go to Azure Portal
- Visit: https://portal.azure.com/
- Go to "Azure Active Directory" > "App registrations"

## 2. Create New Registration
- Click "New registration"
- Name: "VMKV NCC Web App"
- Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
- Redirect URI:
  - Platform: "Single-page application (SPA)"
  - Redirect URI: `http://localhost:8085` (for dev)
  - Also add: `https://yourdomain.com` (for production)

## 3. Copy Application (client) ID
- From the app overview, copy the "Application (client) ID"
- Set in .env: `VITE_MICROSOFT_CLIENT_ID="your-application-id"`

## 4. API Permissions (Optional)
- Go to "API permissions"
- Add: "Microsoft Graph" > "User.Read" (delegated)

---

# Important Notes

## For Google:
- The redirect URI is your app's origin URL
- Since we're using direct ID-token sign-in, the redirect URI is used for the popup flow

## For Microsoft:
- The redirect URI must exactly match your app's origin
- We're using the "Single-page application (SPA)" platform type
- The popup handles the OAuth flow and returns the ID token

## Environment Variables
Update your `.env` file with real values:

```
VITE_GOOGLE_CLIENT_ID="123456789-abcdef.apps.googleusercontent.com"
VITE_MICROSOFT_CLIENT_ID="98765432-1234-5678-9abc-def123456789"
```

## Testing
- Start your dev server: `npm run dev`
- Try the "Continue with Google" button
- Try the "Continue with Microsoft" button
- Both should now work without the "Unsupported provider" error