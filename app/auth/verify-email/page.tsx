export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Check your email
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          We sent you a verification link. Please check your email and click the
          link to verify your account.
        </p>
      </div>
    </div>
  );
}
