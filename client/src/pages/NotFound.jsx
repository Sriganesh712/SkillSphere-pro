export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-5xl font-bold text-gray-800">404</h1>
      <p className="text-gray-600 mt-2">Page not found</p>
      <a href="/" className="mt-4 text-indigo-600 hover:underline">
        Go Home
      </a>
    </div>
  );
}
