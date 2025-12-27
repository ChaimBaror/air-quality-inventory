# מערכת ניהול מלאי ומעקב משלוחים - Inventory Management System

## סקירה כללית

מערכת ניהול מלאי ומעקב משלוחים והזמנות מסין לארה"ב. המערכת מספקת כלים מקיפים לניהול משלוחים, הזמנות, מעקב סטטוסים, שליחת התראות אוטומטיות, ייבוא/ייצוא נתונים ויצירת דוחות.

### טכנולוגיות עיקריות

- **Next.js 15** - Framework ל-React עם App Router
- **React 19** - ספריית UI מודרנית
- **TypeScript** - טייפ-ספייפייט לכתיבת קוד בטוח
- **Material-UI (MUI) 7** - ספריית קומפוננטים מוכנים
- **next-intl** - תמיכה רב-לשונית (i18n)
- **Recharts** - גרפים וויזואליזציה
- **XLSX** - ייבוא/ייצוא קבצי Excel
- **Nodemailer** - שליחת מיילים
- **Google Gemini AI** - אינטגרציה עם AI

---

## תכונות האפליקציה

### 1. ניהול משלוחים (Shipments)

מערכת מעקב משלוחים מסין לארה"ב עם יכולות מתקדמות:

#### סטטוסי משלוח
- **Pending** - משלוח בהמתנה
- **In Transit** - משלוח בתנועה
- **In Customs** - משלוח במכס
- **Delayed** - משלוח מתעכב
- **Delivered** - משלוח נמסר
- **Exception** - משלוח עם בעיה

#### נושאי משלוח נתמכים
- DHL
- FedEx
- UPS
- USPS
- China Post
- SF Express
- Other

#### תכונות נוספות
- מעקב אחר מספרי מעקב (Tracking Numbers)
- ניהול פרטי ספק (שם, טלפון, אימייל)
- מעקב אחר תאריכי משלוח (תאריך משלוח, תאריך אספקה צפוי, תאריך אספקה בפועל)
- ניהול משקל, נפח וערך משלוח
- מעקב אחר בעלים (Owner) - מי אחראי על המשלוח
- היסטוריית שינויים מלאה
- אינטגרציה עם WhatsApp לשליחת הודעות לספקים
- ייבוא/ייצוא נתונים ל-Excel
- שליחת מיילים אוטומטית למשלוחים מתעכבים

### 2. ניהול הזמנות (Orders)

מערכת ניהול הזמנות מספקים עם מעקב מפורט:

#### סטטוסי הזמנה
- **Draft** - טיוטה
- **Pending** - בהמתנה
- **Confirmed** - מאושר
- **In Production** - בייצור
- **Ready to Ship** - מוכן למשלוח
- **Shipped** - נשלח
- **Delivered** - נמסר
- **Cancelled** - בוטל

#### תכונות הזמנות
- ניהול מספרי הזמנה (PO Number, Customer PO)
- מעקב אחר ספקים (פרטי קשר, אימייל, טלפון)
- ניהול פריטי הזמנה:
  - SKU
  - תיאור
  - כמות
  - מחיר ליחידה
  - מחיר כולל
  - סגנון (Style)
  - צבע
  - מידה
- מעקב תאריכים (תאריך הזמנה, תאריך השלמה צפוי, תאריך משלוח צפוי/פועלי)
- ניהול כתובת משלוח
- חישוב ערך כולל של ההזמנה
- היסטוריית שינויים
- ייבוא/ייצוא Excel
- שליחת מיילים לספקים

### 3. דשבורד (Dashboard)

דשבורד מרכזי עם סטטיסטיקות וויזואליזציות:

#### כרטיסי סטטוס
- משלוחים בהמתנה (Pending)
- משלוחים בתנועה (In Transit)
- משלוחים במכס (In Customs)
- משלוחים מתעכבים (Delayed)
- משלוחים נמסרו (Delivered)
- משלוחים מגיעים בקרוב (Arriving Soon)

#### גרפים וסטטיסטיקות
- התפלגות משלוחים לפי ספק (Supplier Chart)
- סטטיסטיקות לפי מפעל/ספק
- התראות על משלוחים מתעכבים
- סטטיסטיקות הזמנות לפי סטטוס

### 4. מערכת מיילים

מערכת שליחת מיילים אוטומטית וידנית:

#### תכונות
- **שליחה אוטומטית**: מיילים נשלחים אוטומטית בימי רביעי בשעה 9:00 בבוקר למשלוחים מתעכבים
- **שליחה ידנית**: אפשרות לשלוח מיילים ידנית למשלוחים או הזמנות ספציפיים
- **שליחה מרובת**: שליחת מיילים למספר משלוחים/הזמנות בבת אחת
- **תבניות מותאמות**: תבניות מייל מותאמות אישית עם פרטי המשלוח/הזמנה
- **היסטוריית שליחות**: מעקב אחר כל המיילים שנשלחו (תאריך, נמען, סטטוס)
- **תמיכה ב-SMTP**: תמיכה ב-Gmail וספקי SMTP אחרים

#### תבנית מייל
המיילים כוללים:
- פרטי PO/מספר הזמנה
- שם הספק
- תאריך אספקה צפוי
- מספר ימים של איחור (אם רלוונטי)
- הודעת התאמה אישית (אופציונלי)

### 5. ייבוא/ייצוא Excel

מערכת מתקדמת לייבוא וייצוא נתונים:

#### ייצוא ל-Excel
- ייצוא משלוחים עם כל הפרטים
- ייצוא הזמנות עם פריטים (בגיליונות נפרדים)
- תאריכים בפורמט קריא
- שמירה אוטומטית עם תאריך

#### ייבוא מ-Excel
- ייבוא משלוחים מקובץ Excel
- ייבוא הזמנות ופריטי הזמנה
- תמיכה בפורמטים שונים (.xlsx, .xls)
- אימות נתונים אוטומטי
- הודעות שגיאה ברורות

#### עמודות נדרשות לייבוא

**משלוחים:**
- Tracking Number, Carrier, PO Number, Supplier, Supplier Phone, Supplier Email
- Origin City, Origin Country, Destination City, Destination State, Destination Country
- Ship Date, Expected Delivery Date, Actual Delivery Date
- Status, Weight, Volume, Value (USD), Owner, Notes

**הזמנות:**
- Orders Sheet: PO Number, Customer PO, Supplier, Order Date, Status, Total Value (USD), Owner
- Order Items Sheet (אופציונלי): PO Number, SKU, Description, Quantity, Unit Price, Total Price

### 6. אינטגרציות

#### Google Gemini AI
- אינטגרציה עם Google Gemini AI
- API endpoint: `/api/gemini`
- React Hook: `useGemini`
- תמיכה במודלים: `gemini-pro`, `gemini-pro-vision`

#### WhatsApp
- כפתור לפתיחת WhatsApp עם הודעת תבנית
- שליחת הודעות לספקים
- מעקב אחר תאריך שליחת WhatsApp

#### SMTP/Email
- תמיכה ב-Gmail (עם App Password)
- תמיכה בכל ספק SMTP
- הגדרה דרך משתני סביבה

### 7. תמיכה רב-לשונית (i18n)

- תמיכה בעברית ואנגלית
- מבוסס על `next-intl`
- תרגומים בקובץ `messages/en.json`
- הגדרת שפה דרך `i18n/routing.ts`

---

## מבנה הפרויקט

```
inventory/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── email/
│   │   │   ├── send/             # שליחת מייל ידנית
│   │   │   └── scheduled/       # Cron job למיילים אוטומטיים
│   │   ├── gemini/               # Gemini AI API
│   │   ├── orders/
│   │   │   └── email/            # שליחת מייל להזמנה
│   │   └── shipments/
│   │       └── email/             # שליחת מייל למשלוח
│   │           └── batch/        # שליחת מיילים מרובים
│   ├── page.tsx                  # דף ראשי עם טאבים
│   ├── layout.tsx                # Layout ראשי
│   └── globals.css               # סגנונות גלובליים
│
├── components/                    # קומפוננטים React
│   ├── common/                   # קומפוננטים משותפים
│   │   ├── SearchBar.tsx
│   │   └── StatusChip.tsx
│   ├── dashboard/                # קומפוננטי דשבורד
│   │   ├── FactoryChart.tsx
│   │   ├── StatusCard.tsx
│   │   └── StatusCardsGrid.tsx
│   ├── orders/                   # ניהול הזמנות
│   │   ├── CreateOrderDialog.tsx
│   │   ├── EditOrderDialog.tsx
│   │   ├── ImportOrderDialog.tsx
│   │   ├── OrderDetail.tsx
│   │   ├── OrderTable.tsx
│   │   ├── OrderTracker.tsx
│   │   └── SendOrderEmailDialog.tsx
│   ├── shipments/                # ניהול משלוחים
│   │   ├── DelayedShipmentsNotifications.tsx
│   │   ├── EditShipmentDialog.tsx
│   │   ├── ImportShipmentDialog.tsx
│   │   ├── SendNotificationDialog.tsx
│   │   ├── ShipmentDashboard.tsx
│   │   ├── ShipmentDetail.tsx
│   │   ├── ShipmentTable.tsx
│   │   ├── ShipmentTracker.tsx
│   │   ├── SupplierChart.tsx
│   │   ├── TrackersView.tsx
│   │   └── WhatsAppButton.tsx
│   └── tracker/                 # מעקב (legacy)
│
├── lib/                          # ספריות ושירותים
│   ├── hooks/
│   │   └── useGemini.ts          # Hook ל-Gemini AI
│   ├── data.ts                   # נתונים (legacy)
│   ├── emailConfig.ts            # הגדרות מייל
│   ├── emailService.ts           # שירות מייל (legacy)
│   ├── gemini.ts                 # שירות Gemini AI
│   ├── orderData.ts              # נתוני הזמנות (mock)
│   ├── orderEmailService.ts      # שירות מייל להזמנות
│   ├── orderExcelUtils.ts        # ייבוא/ייצוא Excel להזמנות
│   ├── orderUtils.ts             # כלי עזר להזמנות
│   ├── shipmentData.ts           # נתוני משלוחים (mock)
│   ├── shipmentEmailService.ts   # שירות מייל למשלוחים
│   ├── shipmentExcelUtils.ts     # ייבוא/ייצוא Excel למשלוחים
│   ├── shipmentUtils.ts          # כלי עזר למשלוחים
│   └── utils.ts                  # כלי עזר כלליים
│
├── types/                        # הגדרות TypeScript
│   └── index.ts                  # Interfaces ו-Types
│
├── messages/                     # תרגומים
│   └── en.json                   # תרגומים לאנגלית
│
├── i18n/                         # הגדרות i18n
│   ├── request.ts
│   └── routing.ts
│
├── src/
│   └── lib/
│       └── i18n-constants.ts     # קבועי i18n
│
├── public/                       # קבצים סטטיים
├── vercel.json                   # הגדרות Vercel (Cron jobs)
├── next.config.ts                # הגדרות Next.js
├── package.json                  # תלויות הפרויקט
├── tsconfig.json                 # הגדרות TypeScript
└── EMAIL_SETUP.md                # הוראות הגדרת מייל
```

---

## התקנה והגדרה

### דרישות מערכת

- **Node.js** 18+ 
- **npm** או **yarn** או **pnpm** או **bun**

### התקנת Dependencies

```bash
npm install
# או
yarn install
# או
pnpm install
# או
bun install
```

### הגדרת משתני סביבה

צור קובץ `.env.local` בתיקיית הפרויקט:

```env
# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Sender Information
EMAIL_FROM_NAME=Inventory Management System
EMAIL_FROM_EMAIL=your-email@gmail.com

# Cron Job Security (אופציונלי)
CRON_SECRET=your-secret-token-here

# Google Gemini AI (אופציונלי)
GEMINI_API_KEY=your-gemini-api-key
```

### הגדרת Gmail/SMTP

#### עבור Gmail:

1. הפעל **2-Step Verification** בחשבון Google שלך
2. צור **App Password**:
   - לך ל-[Google Account Settings](https://myaccount.google.com/)
   - בחר **Security** > **2-Step Verification**
   - גלול למטה ובחר **App passwords**
   - צור סיסמת אפליקציה חדשה עבור **Mail**
   - השתמש בסיסמה שנוצרה ב-`SMTP_PASS`

#### עבור ספקי SMTP אחרים:

עדכן את המשתנים ב-`.env.local`:
- `SMTP_HOST` - כתובת שרת SMTP
- `SMTP_PORT` - פורט (לרוב 587 או 465)
- `SMTP_SECURE` - `true` ל-SSL/TLS, `false` ל-STARTTLS

### הגדרת Gemini API

1. קבל API Key מ-[Google AI Studio](https://makersuite.google.com/app/apikey)
2. הוסף ל-`.env.local`:
   ```env
   GEMINI_API_KEY=your-api-key-here
   ```

### הפעלת שרת פיתוח

```bash
npm run dev
# או
yarn dev
# או
pnpm dev
# או
bun dev
```

פתח [http://localhost:3000](http://localhost:3000) בדפדפן.

---

## שימוש באפליקציה

### ניווט בממשק

האפליקציה כוללת 4 טאבים עיקריים:

1. **Dashboard** - דשבורד מרכזי עם סטטיסטיקות וגרפים
2. **Shipment Tracker** - מעקב משלוחים
3. **Orders** - ניהול הזמנות
4. **Multiple Trackers** - מעקב מרובה

### יצירת משלוח חדש

1. עבור לטאב **Shipment Tracker**
2. לחץ על כפתור **Import Excel** או צור ידנית
3. מלא את הפרטים:
   - מספר מעקב (Tracking Number)
   - נושא משלוח (Carrier)
   - מספר PO
   - פרטי ספק
   - כתובת מוצא ויעד
   - תאריכים
   - סטטוס

### יצירת הזמנה חדשה

1. עבור לטאב **Orders**
2. לחץ על **Create Order**
3. מלא את פרטי ההזמנה:
   - מספר PO
   - ספק
   - תאריך הזמנה
   - סטטוס
   - הוסף פריטים (SKU, כמות, מחיר)

### ייבוא נתונים מ-Excel

1. לחץ על **Import Excel** בטאב הרלוונטי
2. בחר קובץ Excel (.xlsx)
3. ודא שהקובץ מכיל את העמודות הנדרשות
4. המערכת תייבא את הנתונים אוטומטית

### ייצוא נתונים ל-Excel

1. לחץ על **Export** בטאב הרלוונטי
2. הקובץ יורד אוטומטית עם תאריך בשם הקובץ

### שליחת מיילים

#### שליחה ידנית:

1. פתח פרטי משלוח/הזמנה
2. לחץ על **Send Email**
3. הוסף הודעה מותאמת (אופציונלי)
4. לחץ **Send**

#### שליחה מרובת:

1. עבור ל-**Dashboard**
2. בחר משלוחים מתעכבים
3. לחץ **Send Emails to Selected**

#### שליחה אוטומטית:

המערכת שולחת מיילים אוטומטית בימי רביעי בשעה 9:00 למשלוחים מתעכבים.

---

## API Routes

### `/api/shipments/email`

שליחת מייל למשלוח ספציפי.

**Method:** `POST`

**Body:**
```json
{
  "shipmentId": "1",
  "customMessage": "הודעה מותאמת (אופציונלי)"
}
```

**Response:**
```json
{
  "success": true,
  "messageId": "message-id"
}
```

### `/api/shipments/email/batch`

שליחת מיילים למספר משלוחים.

**Method:** `POST`

**Body:**
```json
{
  "shipmentIds": ["1", "2", "3"],
  "customMessage": "הודעה מותאמת (אופציונלי)"
}
```

**Response:**
```json
{
  "results": [
    {
      "shipmentId": "1",
      "success": true,
      "messageId": "message-id"
    }
  ]
}
```

### `/api/orders/email`

שליחת מייל להזמנה ספציפית.

**Method:** `POST`

**Body:**
```json
{
  "orderId": "ord-1",
  "customMessage": "הודעה מותאמת (אופציונלי)"
}
```

### `/api/email/send`

שליחת מייל כללי (legacy).

**Method:** `POST`

**Body:**
```json
{
  "sampleId": "1"
}
// או
{
  "sendAll": true
}
```

### `/api/email/scheduled`

Cron job endpoint לשליחת מיילים אוטומטית.

**Method:** `GET` או `POST`

**Headers:**
```
Authorization: Bearer YOUR_CRON_SECRET
```

**Schedule:** כל יום רביעי בשעה 9:00 (מוגדר ב-`vercel.json`)

### `/api/gemini`

אינטגרציה עם Google Gemini AI.

**Method:** `POST`

**Body:**
```json
{
  "prompt": "Your prompt here",
  "model": "gemini-pro" // אופציונלי
}
```

**Response:**
```json
{
  "result": "AI response text"
}
```

---

## מבנה נתונים

### Shipment Interface

```typescript
interface Shipment {
  id: string;
  tracking_number: string;
  carrier: Carrier;
  po_number: string;
  supplier: string;
  supplier_phone?: string;
  supplier_email?: string;
  origin_city: string;
  origin_country: string;
  destination_city: string;
  destination_state: string;
  destination_country: string;
  ship_date: Date;
  expected_delivery_date: Date;
  actual_delivery_date?: Date;
  status: ShipmentStatus;
  weight?: string;
  volume?: string;
  value?: number;
  owner: string;
  whatsapp_sent_date?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  history?: HistoryEntry[];
  images?: string[];
}
```

### Order Interface

```typescript
interface Order {
  id: string;
  po_number: string;
  customer_po?: string;
  supplier: string;
  supplier_phone?: string;
  supplier_email?: string;
  order_date: Date;
  expected_completion_date?: Date;
  expected_ship_date?: Date;
  actual_ship_date?: Date;
  status: OrderStatus;
  total_value: number;
  currency?: string;
  items?: OrderItem[];
  shipping_address?: {
    city: string;
    state: string;
    country: string;
    address?: string;
  };
  owner: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  history?: HistoryEntry[];
  images?: string[];
  related_shipments?: string[];
  email_history?: EmailHistoryEntry[];
}
```

### OrderItem Interface

```typescript
interface OrderItem {
  id: string;
  sku?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  style?: string;
  color?: string;
  size?: string;
  notes?: string;
}
```

### HistoryEntry Interface

```typescript
interface HistoryEntry {
  id: string;
  timestamp: Date;
  action: string;
  user?: string;
  changes?: Record<string, { old: any; new: any }>;
}
```

### EmailHistoryEntry Interface

```typescript
interface EmailHistoryEntry {
  id: string;
  timestamp: Date;
  recipient: string;
  subject: string;
  status: 'sent' | 'failed';
  messageId?: string;
  error?: string;
  sentBy?: string;
}
```

---

## פתרון בעיות

### שגיאת אימות SMTP

**תסמינים:** שגיאה בשליחת מייל, "Authentication failed"

**פתרונות:**
- ודא ש-`SMTP_USER` ו-`SMTP_PASS` מוגדרים נכון ב-`.env.local`
- עבור Gmail, ודא שאתה משתמש ב-**App Password** ולא בסיסמה הרגילה
- ודא ש-**2-Step Verification** מופעל בחשבון Google
- בדוק שהפורט נכון (587 ל-STARTTLS, 465 ל-SSL)

### מיילים לא נשלחים

**תסמינים:** כפתור שליחת מייל לא עובד, אין שגיאות

**פתרונות:**
- בדוק את ה-console logs בדפדפן (F12)
- ודא שכתובת המייל של הספק (`supplier_email`) מוגדרת
- בדוק את ה-logs של שרת הפיתוח
- ודא שההגדרות ב-`lib/emailConfig.ts` נכונות

### Cron job לא רץ

**תסמינים:** מיילים אוטומטיים לא נשלחים

**פתרונות:**
- ודא ש-`vercel.json` מוגדר נכון (אם משתמשים ב-Vercel)
- בדוק את ה-logs ב-Vercel Dashboard
- ודא שה-endpoint `/api/email/scheduled` נגיש
- בדוק שה-`CRON_SECRET` מוגדר נכון

### בעיות ייבוא Excel

**תסמינים:** שגיאות בעת ייבוא, נתונים לא נטענים

**פתרונות:**
- ודא שהקובץ בפורמט `.xlsx` או `.xls`
- בדוק שכל העמודות הנדרשות קיימות
- ודא שתאריכים בפורמט תקין (YYYY-MM-DD או פורמט Excel)
- בדוק את ה-console logs לשגיאות ספציפיות
- ודא שהשמות של העמודות תואמים בדיוק (case-sensitive)

### שגיאות TypeScript

**תסמינים:** שגיאות קומפילציה, טייפים לא תואמים

**פתרונות:**
- הרץ `npm run build` לבדיקת שגיאות
- ודא שכל ה-interfaces ב-`types/index.ts` מעודכנים
- בדוק שה-imports נכונים

### בעיות Gemini AI

**תסמינים:** שגיאות בשימוש ב-Gemini API

**פתרונות:**
- ודא ש-`GEMINI_API_KEY` מוגדר ב-`.env.local`
- בדוק שהמפתח תקין ולא פג תוקף
- בדוק את ה-logs של ה-API route

---

## ✨ שיפורים חדשים שהתווספו!

### 📊 דוחות ואנליטיקה
- ✅ **ייצוא PDF מתקדם** - דוחות מקצועיים עם טבלאות מעוצבות
- ✅ **ייצוא Excel משופר** - גיליונות מרובים, סטטיסטיקות, פילטרים אוטומטיים
- ✅ **גרפים מתקדמים** - Area, Line, Bar, Pie Charts עם בחירת טווח זמן

### ⚡ ביצועים וקנה מידה
- ✅ **Pagination** - עימוד עם בחירת מספר פריטים לדף
- ✅ **Virtual Scrolling** - ביצועים מעולים עם אלפי פריטים
- ✅ **Lazy Loading** - טעינת קומפוננטות לפי דרישה

### 🎨 חוויית משתמש
- ✅ **Toast Notifications** - הודעות מעוצבות להצלחה/שגיאה/טעינה
- ✅ **Loading Skeletons** - מסכי טעינה מעוצבים
- ✅ **Advanced Filters** - סינון מתקדם מתקפל עם חיפוש
- ✅ **Drag & Drop Upload** - העלאת קבצים בגרירה
- ✅ **Dark Mode** - מצב כהה עם זיהוי אוטומטי

**למדריך שימוש מפורט:** [IMPROVEMENTS_GUIDE.md](./IMPROVEMENTS_GUIDE.md)  
**רשימת תכונות חדשות:** [FEATURES_ADDED.md](./FEATURES_ADDED.md)

---

## פיתוח עתידי

### הצעות לשיפורים נוספים

1. **מסד נתונים**: החלפת נתוני Mock במסד נתונים אמיתי (PostgreSQL, MongoDB)
2. **אימות משתמשים**: הוספת מערכת התחברות והרשאות
3. **עדכונים בזמן אמת**: WebSockets לעדכונים בזמן אמת
4. **אפליקציית מובייל**: React Native או PWA
5. **אינטגרציות נוספות**: חיבור ל-APIs של נושאי משלוח (DHL, FedEx וכו')
6. **תמיכה בשפות נוספות**: הוספת שפות נוספות ל-i18n
7. **מערכת התראות**: התראות בדפדפן, Push notifications
8. **גיבויים אוטומטיים**: מערכת גיבוי אוטומטית
9. **API מלא**: RESTful API מלא עם תיעוד (Swagger/OpenAPI)
10. **בדיקות**: Jest/Vitest + Playwright

---

## רישיון

פרויקט זה הוא פרטי.

---

## תמיכה

לשאלות או בעיות:
- בדוק את ה-logs של השרת
- בדוק את ה-console logs בדפדפן
- עיין בקובץ `EMAIL_SETUP.md` להגדרת מייל
- עיין בקובץ `lib/gemini.README.md` להגדרת Gemini AI

---

**נבנה עם ❤️ באמצעות Next.js ו-React**
