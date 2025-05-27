// app/login/page.tsx
import { loginWithGoogle } from "./actions"
import { FaGoogle } from "react-icons/fa"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#0f0233] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Ласкаво просимо</h1>
                    <p className="text-gray-600">
                        Увійдіть за допомогою Google для доступу до результатів тестів та рекомендацій 
                    </p>
                </div>

                <form className="space-y-4">
                    <button
                        formAction={loginWithGoogle}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <FaGoogle className="w-5 h-5" />
                        <span>Продовжити с Google</span>
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <p>
                        Натискаючи кнопку, ви погоджуєтесь з нашими <br/>
                        <a href="#" className="text-blue-600 hover:underline">
                            Умовами використання
                        </a> та{" "}  
                        <a href="#" className="text-blue-600 hover:underline">
                            Політикою конфіденційності
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}