# Guía de Uso de i18n (Traducción)

## Configuración Completada ✅

- **Hook**: `useTranslate()` en `src/locales/langs/i18n.tsx`
- **Idiomas soportados**: Español (es) e Inglés (en)
- **Detección automática**: El navegador detecta idioma automático
- **Persistencia**: Se guarda en localStorage
- **Flags**: Usando SVG desde `public/assets/images/country_flags/`

---

## Cómo Usar en Componentes

### 1. Importar el hook

```tsx
import { useTranslate } from 'src/locales';
```

### 2. Usar en tu componente

```tsx
export function MyComponent() {
  const { translate, currentLang } = useTranslate();
  
  return (
    <h1>
      {translate('tableLatestOrders', 'title')}
    </h1>
  );
}
```

---

## Estructura de Traducciones

### Español: `src/locales/langs/es/translation.json`
```json
{
  "tableLatestOrders": {
    "title": "Últimos Pedidos",
    "columns": {
      "id": "Pedido",
      "customer": "Cliente",
      "date": "Fecha",
      "total": "Total",
      "status": "Estado"
    }
  },
  "TopProducts": {
    "title": "Productos Principales"
  },
  "TopClients": {
    "title": "Clientes Principales"
  }
}
```

### Inglés: `src/locales/langs/en/translation.json`
```json
{
  "tableLatestOrders": {
    "title": "Latest Orders",
    "columns": {
      "id": "Order",
      "customer": "Customer",
      "date": "Date",
      "total": "Total",
      "status": "Status"
    }
  },
  "TopProducts": {
    "title": "Top Products"
  },
  "TopClients": {
    "title": "Top Clients"
  }
}
```

---

## Sintaxis de Traducción

```tsx
const { translate } = useTranslate();

// Acceso a propiedades anidadas con puntos (.)
translate('tableLatestOrders', 'title')           // "Últimos Pedidos" / "Latest Orders"
translate('tableLatestOrders', 'columns.id')      // "Pedido" / "Order"
translate('tableLatestOrders', 'columns.customer')// "Cliente" / "Customer"
translate('TopProducts', 'title')                 // "Productos Principales" / "Top Products"
```

---

## Hook completo - Propiedades disponibles

```tsx
const {
  currentLang,      // 'es' | 'en' - idioma actual
  onChangeLang,     // (lang: 'es' | 'en') => void - cambiar idioma
  translate,        // (namespace, key) => string - traducir texto
  currentLangOption,// { value, label, countryCode } - info del idioma actual
  allLanguages,     // array de todos los idiomas disponibles
  mounted,          // boolean - true cuando está hidratado en cliente
} = useTranslate();
```

---

## Ejemplo Completo: Como en `overview-app-view.tsx`

```tsx
'use client';

import { useTranslate } from 'src/locales';
import { AppNewInvoices } from '../app-new-invoices';

export function OverviewAppView() {
  const { translate } = useTranslate();

  return (
    <AppNewInvoices
      title={translate('tableLatestOrders', 'title')}
      headCells={[
        { id: 'id', label: translate('tableLatestOrders', 'columns.id') },
        { id: 'customer', label: translate('tableLatestOrders', 'columns.customer') },
        { id: 'date', label: translate('tableLatestOrders', 'columns.date') },
        { id: 'total', label: translate('tableLatestOrders', 'columns.total') },
        { id: 'status', label: translate('tableLatestOrders', 'columns.status') },
      ]}
      tableData={data}
    />
  );
}
```

---

## Agregar Nuevas Traducciones

### 1. Editar JSON
Agrega en `src/locales/langs/es/translation.json`:
```json
{
  "newNamespace": {
    "key": "Valor en Español"
  }
}
```

Agrega en `src/locales/langs/en/translation.json`:
```json
{
  "newNamespace": {
    "key": "Value in English"
  }
}
```

### 2. Usar en Componente
```tsx
const { translate } = useTranslate();
const text = translate('newNamespace', 'key');
```

---

## Cambiar Idioma Programáticamente

```tsx
export function MyComponent() {
  const { onChangeLang } = useTranslate();
  
  return (
    <button onClick={() => onChangeLang('en')}>
      Change to English
    </button>
  );
}
```

---

## Archivos Configurados

✅ `src/locales/langs/i18n.tsx` - Hook y configuración
✅ `src/locales/langs/es/translation.json` - Traducciones español  
✅ `src/locales/langs/en/translation.json` - Traducciones inglés
✅ `src/locales/index.ts` - Exportador central
✅ `src/layouts/components/language-popover.tsx` - Selector de idioma (Español 🇪🇸 + Inglés 🇬🇧)
✅ `src/sections/overview/app/view/overview-app-view.tsx` - Ejemplo implementado
