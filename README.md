# ניהול לקוחות (yo)

אפליקציית ווב חד-עמודית (Single Page) לניהול לקוחות, טיפולים, תשלומים ולוח זמנים שבועי. הנתונים נשמרים ב-Firebase Firestore (עם גיבוי מקומי ב-localStorage למקרה של ניתוק).

## הרצה מקומית

האפליקציה היא קובץ `index.html` יחיד, ללא תהליך build. אפשר לפתוח אותו ישירות בדפדפן, או להריץ שרת סטטי פשוט:

```bash
npx serve .
```

## הגדרת Firebase (חובה)

מומלץ ליצור **פרויקט Firebase נפרד וחדש** לאפליקציה זו (לא לשתף עם אפליקציות אחרות), מכיוון שהיא מאחסנת מידע רגיש של לקוחות (כולל ת.ז.).

1. גש ל-[Firebase Console](https://console.firebase.google.com) וצור פרויקט חדש (חינמי).
2. בתפריט הצד: **Build → Firestore Database → Create database**. אפשר להתחיל ב-production mode (החוקים יוגדרו בשלב הבא).
3. **Project settings → General → Your apps → Add app → Web** (סימן `</>`), תן לאפליקציה שם, וקבל אובייקט `firebaseConfig`.
4. פתח את `index.html` וחפש את הבלוק:
   ```js
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_PROJECT_ID.appspot.com",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```
   והחלף את הערכים בערכים שקיבלת מ-Firebase.
5. שמור, פתח את `index.html` בדפדפן - האפליקציה תתחבר ל-Firestore ותתחיל לשמור נתונים במסמך `appData/clientsManagement`.

## העברת נתונים קיימים מ-Google Sheets

האפליקציה כוללת מעבר אוטומטי **חד-פעמי**: בפעם הראשונה שהיא נפתחת ומגלה שהמסמך ב-Firestore עדיין לא קיים, היא תמשוך את הנתונים הקיימים מהגיליון הישן (Google Sheets) ותשמור אותם ב-Firestore. אין צורך בפעולה ידנית - מספיק לפתוח את האתר המעודכן פעם אחת.

⚠️ **אחרי שההעברה הצליחה** (מופיעה הודעת "הנתונים יובאו מהמערכת הקודמת"), מומלץ:
1. לבטל/למחוק את ה-Apps Script Web App הישן (בקובץ הגיליון: Extensions → Apps Script → Deploy → Manage deployments → Archive).
2. להסיר מ-`index.html` את הקבוע `LEGACY_SHEETS_URL` ואת הפונקציה `migrateFromLegacySheets`, כדי לא להשאיר בקוד כתובת שהייתה חשופה בעבר.

## ⚠️ הגדרת אבטחה ב-Firebase (חשוב!)

מפתח ה-API של Firebase מוגדר בקוד (`firebaseConfig` ב-`index.html`). זה תקין ומקובל עבור אפליקציות צד-לקוח - **אבל** האבטחה האמיתית של הנתונים נקבעת ע"י **Firestore Security Rules**, שמוגדרים בקונסולת Firebase ולא בקוד הזה.

כדאי לוודא בקונסולת Firebase (Firestore Database → Rules) שהחוקים אינם פתוחים לכל (`allow read, write: if true`), כדי שלא כל מי שיש לו את הקישור לאתר יוכל לקרוא או לשנות את הנתונים האישיים והפיננסיים של הלקוחות (כולל ת.ז.). מומלץ להגדיר אימות משתמשים (Firebase Authentication) ולהגביל גישה למשתמשים מאומתים בלבד, לדוגמה:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /appData/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## תכונות

- **לקוחות**: ניהול פרטי לקוח (שם, טלפון, ת.ז.), סטטוס פעיל/לא פעיל, ולוח שבועי קבוע
- **טיפולים**: יצירת טיפולים בודדים או סדרות, סטטוס תשלום, ביטולים
- **תשלומים**: רישום תשלומים מרובי-טיפולים, היסטוריית תשלומים, הפקת טקסט לקבלה
- **לוח שבועי**: תצוגת לוח זמנים שבועי לפי לקוחות פעילים
- **היסטוריית לקוח**: סיכום טיפולים ותשלומים לפי שנים
- **PWA**: ניתן להוסיף למסך הבית במובייל

## אבטחה

- כל הטקסט החופשי המוצג בעמוד (שמות, הערות וכו') עובר escaping למניעת XSS.
- שדות טלפון ות.ז. עוברים אימות תקינות לפני שמירה.
