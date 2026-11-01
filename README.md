# yo

## ספירת כניסות לדשבורד

בכל פתיחה של האפליקציה נספרת כניסה למייל המחובר ב-`logins/{email}` (שם, מייל, כמה פעמים ומתי לאחרונה), ומוצגת בדשבורד הכניסות (https://dashboard-delta-opal-80.vercel.app).

צריך להוסיף את החוק הזה ב-Firebase Console ← Firestore Database ← Rules, **בתוך** הבלוק `match /databases/{database}/documents { ... }` הקיים (בלי למחוק את מה שכבר יש), עם המייל של הבעלים במקום `owner@gmail.com`:

```
match /logins/{em} {
  allow read: if request.auth != null && request.auth.token.email.lower() in ['owner@gmail.com'];
  allow create, update: if request.auth != null && request.auth.token.email_verified == true
    && em == request.auth.token.email.lower()
    && request.resource.data.keys().hasOnly(['email', 'name', 'lastSeen', 'count'])
    && request.resource.data.email == em;
  allow delete: if false;
}
```
