# Firebase Setup Guide for FRA Portal

## 🔥 Quick Setup Steps

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `FRA-Portal`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Google Authentication
1. Go to Authentication → Sign-in method
2. Click "Google"
3. Toggle "Enable"
4. Add your Netlify domain to authorized domains
5. Save

### 3. Get Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps"
3. Click Web icon (</>)
4. Register app: `FRA-Portal-Web`
5. Copy the config object

### 4. Set Environment Variables in Netlify
Go to Netlify Dashboard → Site Settings → Environment Variables

Add these variables:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 5. Add Authorized Domains
In Firebase Console → Authentication → Settings → Authorized domains:
- Add your Netlify URL: `your-site-name.netlify.app`
- Add `localhost` for development

### 6. Redeploy
After setting environment variables, trigger a new deployment in Netlify.

## 🚨 Common Issues

### Google Sign-in Fails
- Check if Google provider is enabled
- Verify authorized domains include your Netlify URL
- Ensure environment variables are set correctly

### Environment Variables Not Working
- Make sure variable names start with `VITE_`
- Redeploy after adding variables
- Check Netlify build logs for errors

## 🔧 Testing

1. **Local Testing**: Use `.env.local` file with your Firebase config
2. **Production Testing**: Verify environment variables in Netlify
3. **Console Logs**: Check browser console for Firebase errors

## 📞 Support

If you need help:
1. Check Firebase Console for error messages
2. Check Netlify build logs
3. Check browser console for JavaScript errors