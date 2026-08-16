import { useState } from 'react';
import { Upload, ChevronDown, ChevronUp, X, FileText, Image as ImageIcon, Video, Link as LinkIcon } from 'lucide-react';

interface UploadFirstBannerProps {
  onCreateOneOff: (files: File[]) => void;
  onCreateCampaign: (files: File[]) => void;
}

export function UploadFirstBanner({ onCreateOneOff, onCreateCampaign }: UploadFirstBannerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setIsExpanded(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="w-4 h-4 text-purple-500" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4 text-green-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div
      className={`border-b border-border transition-all ${
        isExpanded ? 'bg-card' : 'bg-secondary/30'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Upload className={`w-5 h-5 ${isExpanded ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">
              {uploadedFiles.length > 0
                ? `${uploadedFiles.length} file${uploadedFiles.length > 1 ? 's' : ''} uploaded`
                : 'Upload files to get started'}
            </p>
            <p className="text-xs text-muted-foreground">
              Drag & drop or click to upload images, videos, or links
            </p>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-primary/50'
            }`}
          >
            <Upload className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-foreground mb-1">Drop files here or click to upload</p>
            <p className="text-xs text-muted-foreground mb-4">Supports images, videos, PDFs, and documents</p>
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              Choose Files
            </label>
          </div>

          {uploadedFiles.length > 0 && (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Uploaded Files</p>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-secondary/50 rounded-lg"
                    >
                      {getFileIcon(file)}
                      <span className="flex-1 text-sm text-foreground truncate">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="p-1 hover:bg-secondary rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    onCreateOneOff(uploadedFiles);
                    setUploadedFiles([]);
                    setIsExpanded(false);
                  }}
                  className="flex-1 px-4 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Create One Piece of Content
                </button>
                <button
                  onClick={() => {
                    onCreateCampaign(uploadedFiles);
                    setUploadedFiles([]);
                    setIsExpanded(false);
                  }}
                  className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create Campaign from These
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
