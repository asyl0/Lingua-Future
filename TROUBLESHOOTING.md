# Troubleshooting Guide

## Invalid API Key Error

If you're seeing "Invalid API key" errors in the console and on the login page, follow these steps:

### 1. Check Environment Variables

Make sure you have a `.env.local` file in the root directory with the correct Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

**Important**: The app will work with fallback values for building, but you need real credentials for full functionality.

### 2. Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Go to Settings → API
4. Copy the following:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Verify Configuration

Run the configuration checker:

```bash
npm run check-supabase
```

This will:
- Check if environment variables are set
- Validate the URL format
- Test the connection to Supabase
- Provide helpful error messages

### 4. Common Issues

#### Wrong API Key
- Make sure you're using the **anon public** key, not the service role key
- The key should start with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`

#### Wrong URL Format
- URL should be: `https://your-project-id.supabase.co`
- Make sure there's no trailing slash
- Check for typos in the project ID

#### Project Not Active
- Make sure your Supabase project is not paused
- Check if you have the correct permissions

#### Environment File Issues
- Make sure the file is named `.env.local` (not `.env`)
- Restart your development server after changing environment variables
- Make sure there are no spaces around the `=` sign

### 5. Test with Demo Credentials

If you want to test the app without setting up Supabase, you can use the demo credentials:

- **Student**: `student@test.com` / `password`
- **Teacher**: `teacher@test.com` / `password`

These will work without a Supabase connection.

### 6. Still Having Issues?

1. Check the browser console for detailed error messages
2. Make sure your Supabase project has the correct database schema (run `SUPABASE_SCHEMA.sql`)
3. Verify that RLS policies are set up correctly
4. Check if your Supabase project is in the correct region

### 7. Reset Everything

If you're still having issues, try:

1. Delete `.env.local`
2. Create a new `.env.local` with fresh credentials
3. Restart your development server
4. Clear browser cache and cookies
5. Run `npm run check-supabase` again

## Other Common Issues

### 401 Unauthorized Errors
- Usually means invalid API key or expired session
- Check your Supabase credentials
- Make sure RLS policies allow the operation

### 404 Not Found Errors
- Check if the Supabase URL is correct
- Verify the project is active
- Make sure the database tables exist

### CORS Errors
- These are usually handled by Supabase automatically
- If you see CORS errors, check your Supabase project settings

## Getting Help

If you're still having issues:

1. Run `npm run check-supabase` and share the output
2. Check the browser console for error messages
3. Verify your Supabase project settings
4. Make sure you're using the latest version of the code
