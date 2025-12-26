# מערכת שליחת מייל אוטומטית - הוראות התקנה והגדרה

## סקירה כללית

מערכת זו שולחת מיילים אוטומטית לספקים על הזמנות מתעכבות. המיילים נשלחים אוטומטית בימי רביעי בשעה 9:00 בבוקר.

## התקנה

### 1. התקנת חבילות

```bash
npm install
```

### 2. הגדרת משתני סביבה

צור קובץ `.env.local` בתיקיית הפרויקט והוסף את ההגדרות הבאות:

```env
# Email Configuration (SMTP)
# עבור Gmail, השתמש ב-App Password: https://support.google.com/accounts/answer/185833
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Sender Information
EMAIL_FROM_NAME=Inventory Management System
EMAIL_FROM_EMAIL=your-email@gmail.com

# Cron Job Security (אופציונלי)
# הגדר סיסמה להגנה על ה-endpoint של ה-cron
CRON_SECRET=your-secret-token-here
```

### 3. הגדרת Gmail (אם משתמשים ב-Gmail)

1. הפעל "2-Step Verification" בחשבון Google שלך
2. צור "App Password":
   - לך ל-[Google Account Settings](https://myaccount.google.com/)
   - בחר "Security" > "2-Step Verification"
   - גלול למטה ובחר "App passwords"
   - צור סיסמת אפליקציה חדשה עבור "Mail"
   - השתמש בסיסמה שנוצרה ב-`SMTP_PASS`

## שימוש

### שליחת מייל ידנית

#### שליחת מייל להזמנה ספציפית:

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"sampleId": "1"}'
```

#### שליחת מיילים לכל ההזמנות המתעכבות:

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{"sendAll": true}'
```

### תזמון אוטומטי (Cron Job)

המערכת מוגדרת לשלוח מיילים אוטומטית בימי רביעי בשעה 9:00 בבוקר.

#### אם אתה משתמש ב-Vercel:

הקובץ `vercel.json` כבר מוגדר. ה-cron job ירוץ אוטומטית.

#### אם אתה משתמש בשירות אחר:

הגדר cron job שקורא ל-endpoint הבא:

```
POST https://your-domain.com/api/email/scheduled
Authorization: Bearer YOUR_CRON_SECRET
```

**דוגמה ל-cron expression:**
- `0 9 * * 3` - כל יום רביעי בשעה 9:00 בבוקר

#### בדיקה ידנית של ה-cron job:

```bash
curl -X GET http://localhost:3000/api/email/scheduled \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

## התאמה אישית

### שינוי תבנית המייל

ערוך את הקובץ `lib/emailConfig.ts`:

1. **שינוי נושא המייל:**
   ```typescript
   template: {
     subject: 'Your Custom Subject - {po} / {style}',
   }
   ```

2. **שינוי תוכן המייל:**
   - ערוך את הפונקציה `getEmailTemplate()` ב-`lib/emailConfig.ts`
   - זהו HTML שניתן לערוך בקלות

### שינוי הגדרות SMTP

ערוך את `lib/emailConfig.ts` או עדכן את משתני הסביבה:

```typescript
smtp: {
  host: 'smtp.your-provider.com',
  port: 587,
  secure: false,
  // ...
}
```

### הוספת כתובות מייל לספקים

הוסף את השדה `supplierEmail` לכל הזמנה:

```typescript
{
  id: '1',
  po: 'PO-2024-001',
  // ... שאר השדות
  supplierEmail: 'supplier@example.com',
}
```

## מבנה הקבצים

- `lib/emailConfig.ts` - הגדרות SMTP ותבנית המייל (נוח לעריכה)
- `lib/emailService.ts` - לוגיקת שליחת המיילים
- `app/api/email/send/route.ts` - API endpoint לשליחה ידנית
- `app/api/email/scheduled/route.ts` - API endpoint לתזמון אוטומטי
- `vercel.json` - הגדרות cron job ל-Vercel

## פתרון בעיות

### שגיאת אימות SMTP

- ודא ש-`SMTP_USER` ו-`SMTP_PASS` מוגדרים נכון
- עבור Gmail, ודא שאתה משתמש ב-App Password ולא בסיסמה הרגילה
- ודא ש-2-Step Verification מופעל

### מיילים לא נשלחים

- בדוק את ה-console logs לשגיאות
- ודא שכתובת המייל של הספק (`supplierEmail`) מוגדרת
- ודא שההזמנה במצב `overdue`

### Cron job לא רץ

- ודא ש-`vercel.json` מוגדר נכון (אם משתמשים ב-Vercel)
- בדוק את ה-logs ב-Vercel Dashboard
- ודא שה-endpoint נגיש ופועל

## תמיכה

לשאלות או בעיות, בדוק את ה-logs או צור issue בפרויקט.

