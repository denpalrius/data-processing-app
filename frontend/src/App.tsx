import { FileUpload } from './components/FileUpload';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 md:p-8 lg:p-12 min-h-screen flex flex-col justify-center">
        <header className="mb-10 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            File Upload
          </h1>
          <p className="mt-4 text-center text-gray-600 text-lg">
            Securely upload and process your files
          </p>
        </header>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8">
          <FileUpload />
        </div>
        
        <footer className="mt-8 text-center">
          <div className="inline-flex items-center gap-4 text-sm text-gray-500 bg-white/50 px-4 py-2 rounded-full">
            <span>All file types supported</span>
            <span>•</span>
            <span>Up to 100MB</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
export default App;
