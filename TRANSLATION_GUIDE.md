# 🌍 Translation System Guide

## Overview

The site now has a complete bilingual system (English/French) with **English as the default language**.

## System Architecture

### 1. Language Context (`contexts/LanguageContext.tsx`)

The language context manages:
- Current language state (EN/FR)
- Language switching function
- Translation function `t(key)`
- LocalStorage persistence

### 2. Translation Keys

All translations are stored in the `translations` object in `LanguageContext.tsx`:

```typescript
const translations = {
  en: {
    // English translations
    nav: { ... },
    home: { ... },
    properties: { ... },
    // etc.
  },
  fr: {
    // French translations
    nav: { ... },
    home: { ... },
    properties: { ... },
    // etc.
  }
}
```

### 3. Language Switcher

Located in `components/Header.tsx`, the language switcher allows users to toggle between EN/FR.

## How to Use Translations in a Component

### 1. Import the hook
```typescript
import { useLanguage } from '@/contexts/LanguageContext';
```

### 2. Get the translation function
```typescript
const { t } = useLanguage();
```

### 3. Use translations
```typescript
<h1>{t('home.title')}</h1>
<p>{t('home.description')}</p>
```

## Complete Example

```typescript
'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function MyPage() {
  const { t, language } = useLanguage();

  return (
    <div>
      <h1>{t('myPage.title')}</h1>
      <p>{t('myPage.description')}</p>
      <p>Current language: {language}</p>
    </div>
  );
}
```

## Pages Already Translated

✅ **Home Page** (`app/page.tsx`)
- All text translated
- Stats labels translated
- Features translated
- Footer translated

✅ **Header** (`components/Header.tsx`)
- Navigation links translated
- Language switcher added

## Pages Pending Translation

The following pages still need translation. Follow the same pattern:

### 🔴 Properties (`app/properties/page.tsx`)
- Main page
- Property detail page
- Create property page

Translation keys already available:
- `properties.title`
- `properties.subtitle`
- `properties.filters.*`
- `properties.card.*`
- `properties.detail.*`
- `properties.create.*`

### 🔴 Marketplace (`app/marketplace/page.tsx`)

Translation keys already available:
- `marketplace.title`
- `marketplace.subtitle`
- `marketplace.stats.*`
- `marketplace.filters.*`
- `marketplace.listing.*`

### 🔴 Rentals (`app/rentals/page.tsx`)

Translation keys already available:
- `rentals.title`
- `rentals.subtitle`
- `rentals.stats.*`
- `rentals.agreement.*`
- `rentals.modal.*`
- `rentals.landlordView.*`

### 🔴 DeFi (`app/defi/page.tsx`)

Translation keys already available:
- `defi.title`
- `defi.subtitle`
- `defi.mortgage.*`
- `defi.collateral.*`
- `defi.staking.*`

### 🔴 Governance (`app/governance/page.tsx`)

Translation keys already available:
- `governance.title`
- `governance.subtitle`
- `governance.stats.*`
- `governance.proposal.*`
- `governance.createModal.*`

### 🔴 Portfolio (`app/portfolio/page.tsx`)

Translation keys already available:
- `portfolio.title`
- `portfolio.subtitle`
- `portfolio.investment.*`

### 🔴 Notifications (`app/notifications/page.tsx`)

Translation keys already available:
- `notifications.title`
- `notifications.subtitle`
- `notifications.filters.*`
- `notifications.types.*`

### 🔴 Badges (`app/badges/page.tsx`)

Translation keys already available:
- `badges.title`
- `badges.subtitle`

## Step-by-Step: How to Translate a Page

### Example: Translating the Properties Page

**Before:**
```typescript
<h1 className="text-4xl font-bold">Propriétés</h1>
<p className="text-sm">Découvrez l'immobilier de luxe tokenisé</p>
```

**After:**
```typescript
import { useLanguage } from '@/contexts/LanguageContext';

export default function Properties() {
  const { t } = useLanguage();

  return (
    <>
      <h1 className="text-4xl font-bold">{t('properties.title')}</h1>
      <p className="text-sm">{t('properties.subtitle')}</p>
    </>
  );
}
```

## Adding New Translation Keys

If you need to add new translations not already in the system:

1. Open `contexts/LanguageContext.tsx`
2. Find the `translations` object
3. Add your key in **both** `en` and `fr` objects:

```typescript
const translations = {
  en: {
    myNewSection: {
      title: 'My New Title',
      description: 'Description in English',
    }
  },
  fr: {
    myNewSection: {
      title: 'Mon Nouveau Titre',
      description: 'Description en français',
    }
  }
}
```

4. Use it in your component:
```typescript
{t('myNewSection.title')}
```

## Common Translation Keys

These are available in all pages:

- `common.loading` → "Loading..." / "Chargement..."
- `common.error` → "Error" / "Erreur"
- `common.success` → "Success" / "Succès"
- `common.cancel` → "Cancel" / "Annuler"
- `common.confirm` → "Confirm" / "Confirmer"
- `common.connectWallet` → "Connect Wallet" / "Connecter le Wallet"

## Testing

1. Start the development server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. You should see the EN/FR switcher in the top right of the header

4. Click to switch languages and verify translations appear correctly

5. Refresh the page - language preference should persist (stored in localStorage)

## Language Detection

The system currently:
- ✅ Defaults to English
- ✅ Saves preference to localStorage
- ✅ Persists across page reloads
- ❌ Does not auto-detect browser language (can be added if needed)

## Best Practices

1. **Always provide both languages** when adding new keys
2. **Use semantic keys** like `home.title` not `homeTitle`
3. **Group related translations** under the same section
4. **Keep translations in sync** - if you update EN, update FR too
5. **Test both languages** after making changes

## FAQ

### How do I change the default language?

In `contexts/LanguageContext.tsx`, change:
```typescript
const [language, setLanguageState] = useState<Language>('en'); // Change 'en' to 'fr'
```

### Can I add more languages?

Yes! You would need to:
1. Update the `Language` type: `type Language = 'en' | 'fr' | 'es';`
2. Add translations: `translations = { en: {...}, fr: {...}, es: {...} }`
3. Add button in Header for new language

### What if a translation key is missing?

The system will return the key itself (e.g., `"home.title"`) so you can easily identify missing translations.

## Status

- ✅ Translation system implemented
- ✅ Language switcher added to header
- ✅ Home page fully translated
- ✅ All translation keys defined for all pages
- 🔄 Other pages need `useLanguage()` hook integration
- ⏳ Testing needed

---

**Need help?** Check the home page (`app/page.tsx`) for a complete working example!
