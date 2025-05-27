//app/error/page.tsx
import Link from "next/link";

export default function ErrorPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error 500</h1>
          <p className="text-lg">Виникла неочікувана помилка</p>
          <Link 
            href="/" 
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Повернутися на головну
          </Link>
        </div>
      </div>
    )
  }