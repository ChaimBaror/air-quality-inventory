import { getRequestConfig } from 'next-intl/server';
import { headers } from 'next/headers';
import { cookies } from 'next/headers';
import { locales, defaultLocale, type Locale } from '../src/lib/i18n-constants';

// Re-export for backward compatibility
export { locales, defaultLocale, type Locale };

// Locale detection with fallback
async function getLocale(): Promise<Locale> {
  // 1. Check cookie first (user preference)
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;
  if (cookieLocale && locales.includes(cookieLocale as Locale)) {
    return cookieLocale as Locale;
  }

  // 2. Check Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language');
  if (acceptLanguage) {
    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,he;q=0.8")
    const languages = acceptLanguage
      .split(',')
      .map(lang => {
        const [locale] = lang.trim().split(';');
        return locale.toLowerCase().split('-')[0]; // Get language code (e.g., "en" from "en-US")
      });

    // Find first supported locale
    for (const lang of languages) {
      if (locales.includes(lang as Locale)) {
        return lang as Locale;
      }
    }
  }

  // 3. Fallback to default
  return defaultLocale;
}

export default getRequestConfig(async () => {
  const locale = await getLocale();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
