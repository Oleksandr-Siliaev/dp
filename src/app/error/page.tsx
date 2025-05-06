//app/error/page.tsx
export default function ErrorPage() {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Ошибка 500</h1>
          <p className="text-lg">Произошла непредвиденная ошибка</p>
          <link 
            href="/" 
            className="mt-4 inline-block text-blue-500 hover:underline"
          >
            Вернуться на главную
          </link>
        </div>
      </div>
    )
  }