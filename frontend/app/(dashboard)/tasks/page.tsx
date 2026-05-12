export default function PlaceholderPage() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white border-2 border-dashed border-violet-200 rounded-3xl p-12 text-center max-w-md">
        <div className="w-20 h-20 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-violet-400">
             <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Próximamente</h2>
        <p className="text-gray-400">
          Sección en desarrollo.
        </p>
      </div>
    </div>
  );
}