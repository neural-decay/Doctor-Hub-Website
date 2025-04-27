import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Image as ImageIcon } from "lucide-react";

interface ImageUploaderProps {
  existingImageUrl?: string;
  onChange: (file: File | null) => void;
  isUploading?: boolean; // Chuyển isUploading thành prop (tùy chọn)
}

export function ImageUploader({
  existingImageUrl,
  onChange,
  isUploading = false, // Nhận từ component cha
}: Readonly<ImageUploaderProps>) {
  const [preview, setPreview] = useState<string | null>(
    existingImageUrl || null
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Chỉ chấp nhận file hình ảnh");
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError("Kích thước file quá lớn (tối đa 2MB)");
      return;
    }

    // Reset error
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Send file to parent component
    onChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
  };

  return (
    <div className="space-y-2">
      {preview ? (
        <div className="relative aspect-video w-full border rounded-md overflow-hidden">
          <img
            src={preview}
            alt="Ảnh xem trước"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed border-slate-200 rounded-md p-6 
                     hover:bg-slate-50 transition-colors cursor-pointer text-center
                     ${isUploading ? "opacity-70 pointer-events-none" : ""}`}
          onClick={() =>
            !isUploading && document.getElementById("image-upload")?.click()
          }
        >
          <div className="flex flex-col items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-full">
              <ImageIcon className="h-6 w-6 text-slate-400" />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isUploading
                  ? "Đang tải lên..."
                  : "Kéo thả hoặc click để chọn ảnh"}
              </p>
              <p className="text-xs text-muted-foreground">
                SVG, PNG, JPG (tối đa 2MB)
              </p>
            </div>
            <Input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </div>
          {error && <p className="text-destructive text-sm mt-2">{error}</p>}
        </div>
      )}
    </div>
  );
}
