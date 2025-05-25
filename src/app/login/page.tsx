// app/login/page.tsx
import { loginWithGoogle } from "./actions"
import { FaGoogle } from "react-icons/fa"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gray-900">Добро пожаловать</h1>
                    <p className="text-gray-600">
                        Войдите с помощью Google для доступа к вашим тестам
                    </p>
                </div>

                <form className="space-y-4">
                    <button
                        formAction={loginWithGoogle}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                        <FaGoogle className="w-5 h-5" />
                        <span>Продолжить с Google</span>
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
                    <p>
                        Нажимая кнопку, вы соглашаетесь с нашими<br/>
                        <a href="#" className="text-blue-600 hover:underline">
                            Условиями использования
                        </a> и  
                        <a href="#" className="text-blue-600 hover:underline">
                        Политикой конфиденциальности
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}