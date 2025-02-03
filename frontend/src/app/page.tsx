
import '@picocss/pico'
import '../styles/file-uploader.css'
import FileUploader from '@/components/FileUploader';

export default function Home() {
  return (
    <main className="container">
      <h1>File Processing App</h1>
      <FileUploader />
    </main>
  );
}
