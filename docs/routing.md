Next.js 13+ 引入了全新的 **`app/` 路由系統**，稱為 **App Router**，用來取代舊版的 `pages/` 機制，提供更高的彈性與強大的功能，例如 **Server Components、Nested Layouts、Streaming** 等。

以下是詳細介紹：

---

## 🗂️ `app/` 資料夾與檔案對應關係

在 `app/` 架構下，每一個子資料夾對應一個「路由 segment」，透過特殊檔案來控制行為：

| 檔名              | 功能                             |
| --------------- | ------------------------------ |
| `page.tsx`      | 對應一個頁面（URL Endpoint）           |
| `layout.tsx`    | 該 segment 的版面配置，可套用在子路由上       |
| `loading.tsx`   | 用於懸掛/等待頁面載入（Suspense fallback） |
| `error.tsx`     | 對應該 segment 的錯誤 UI             |
| `not-found.tsx` | 404 頁面                         |
| `template.tsx`  | 每次 navigation 都會重新渲染           |

---

## 📁 範例結構

```
app/
├── layout.tsx          // 全站 layout
├── page.tsx            // 對應 "/"
├── about/
│   ├── page.tsx        // 對應 "/about"
│   └── layout.tsx      // 只影響 "/about/*" 路由
├── blog/
│   ├── [slug]/
│   │   ├── page.tsx    // 動態路由 "/blog/:slug"
│   └── page.tsx        // 對應 "/blog"
```

---

## 📌 路由對應與範例

### ✅ 靜態路由

```tsx
// app/about/page.tsx
export default function About() {
  return <h1>關於我們</h1>
}
```

對應網址：`/about`

---

### 🔁 動態路由 `[param]`

```tsx
// app/blog/[slug]/page.tsx
export default function BlogPost({ params }: { params: { slug: string } }) {
  return <h1>文章: {params.slug}</h1>
}
```

輸入 `/blog/nextjs-routing` 時，`params.slug === "nextjs-routing"`。

---

### 🧮 catch-all 路由 `[[...slug]]`

```tsx
// app/docs/[[...slug]]/page.tsx
export default function Docs({ params }: { params: { slug?: string[] } }) {
  return <p>文件頁：{params.slug?.join("/")}</p>
}
```

可對應 `/docs`、`/docs/a`、`/docs/a/b/c` 等。

---

## 🧱 Layouts：巢狀版型（Nested Layout）

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
```

每層的 `layout.tsx` 會像「殼」一樣包住子頁面。

你也可以在 `/dashboard/layout.tsx` 寫不同風格，只對 `/dashboard/*` 生效。

---

## ⚡ Server vs Client Components

* `app/` 預設使用 **React Server Components**（節省 bundle 大小）。
* 加上 `'use client'` 宣告就會變成 **Client Component**。

```tsx
// app/some/page.tsx
'use client'

export default function ClientPage() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>{count}</button>
}
```

---

## 📦 API 路由怎麼辦？

仍然用 `pages/api/*` 管理 API，或自己建立 `app/api/*` 搭配 Route Handler：

```ts
// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello from App Router" })
}
```

---

## 📍特點總覽

| 特性                  | `pages/` | `app/`（App Router）    |
| ------------------- | -------- | --------------------- |
| Routing 機制          | 檔案路由     | 檔案路由 + segment config |
| Layouts             | 需重複引入    | 支援巢狀 layout           |
| Server Component 支援 | ❌        | ✅ 預設使用                |
| Loading/Error UI    | 需自己處理    | 檔案式支援 `loading.tsx` 等 |
| Streaming 支援        | 基本支援     | 原生支援（搭配 React 18）     |

