// src/pages/NotFound.jsx
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-xl mt-4">Page not found.</p>
      <a href="/" className="text-blue-600 underline mt-2">Go back home</a>
    </div>
  );
}
