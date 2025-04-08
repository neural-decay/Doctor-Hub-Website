import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
// Import kiểu dữ liệu cho các tham số của images_upload_handler

interface EditorProps {
  initialValue: string;
  onEditorChange: (content: string) => void;
  onInit?: (evt: any, editor: any) => void;
}

// Định nghĩa kiểu cho BlobInfo từ TinyMCE
interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

export default function Editor({
  initialValue,
  onEditorChange,
  onInit,
}: Readonly<EditorProps>) {
  return (
    <TinyMCEEditor
      apiKey="your-tinymce-api-key" // Đăng ký miễn phí tại https://www.tiny.cloud/
      init={{
        height: 500,
        menubar: true,
        plugins: [
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "help",
          "wordcount",
        ],
        toolbar:
          "undo redo | blocks | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | image media link | help",
        content_style:
          "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
        image_caption: true,
        image_advtab: true,
        automatic_uploads: true,
        file_picker_types: "image",
        // Sửa lỗi TypeScript cho upload handler
        images_upload_handler: (
          blobInfo: BlobInfo,
          progress: (percent: number) => void
        ) => {
          return new Promise<string>((resolve) => {
            // Giả lập upload trong demo
            setTimeout(() => {
              // Thực tế sẽ gọi API để upload ảnh
              resolve(
                `data:${blobInfo.blob().type};base64,${blobInfo.base64()}`
              );
            }, 1000);
          });
        },
      }}
      initialValue={initialValue}
      onEditorChange={onEditorChange}
      onInit={onInit}
    />
  );
}
