//app/login/page.tsx
import { loginWithGoogle } from "./actions";

export default function LoginPage() {
    return (
        <form>
            <button formAction={loginWithGoogle}>Login with Google</button>
        </form>
    )
}