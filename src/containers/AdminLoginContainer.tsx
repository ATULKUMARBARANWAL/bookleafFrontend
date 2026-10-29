import LoginForm from "@/src/components/auth/LoginForm";

export default function AdminLoginContainer() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-amber-50 px-4 py-12">
      <LoginForm role="ADMIN" />
    </main>
  );
}