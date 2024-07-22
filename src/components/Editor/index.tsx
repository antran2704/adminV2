import { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useDebounce } from "use-debounce";

import "react-quill/dist/quill.snow.css";
import "./index.scss";
import SpinnerLoading from "../Loading/Spinner";
import { presignedNewsUrl } from "~/api-client/news/internal";
import axios from "axios";

//Add class Image Quill Editor
let Image = ReactQuill.Quill.import("formats/image");
Image.className = "quill__image";

ReactQuill.Quill.register(Image, true);

//Font Quill Editor
const FontAttributor = ReactQuill.Quill.import("attributors/class/font");
FontAttributor.whitelist = [
  "sofia",
  "slabo",
  "roboto",
  "inconsolata",
  "ubuntu",
];
ReactQuill.Quill.register(FontAttributor, true);

// Format header for Quill Editor
const formats: string[] = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "code-block",
  "background",
  "color",
  "link",
  "image",
  "video",
  "align",
  "float",
];

// Module color for Quill Editor
const colors: string[] = ["blue", "white", "orange", "#A91D3A"];

// Module background color for Quill Editor
const backgroundColors: string[] = ["red"];

interface Props {
  content?: string;
  debounce?: number;
  placeholder?: string;
  getContent: (content: string) => void;
}

const Editor = (props: Props) => {
  const {
    content = "",
    debounce = 1000,
    placeholder = "Enter your content...",
    getContent,
  } = props;
  const quillRef = useRef(null);

  const [value, setValue] = useState<string>(content);
  const [loading, setLoading] = useState<boolean>(false);
  const [newValue] = useDebounce(value, debounce);

  const uploadImage = async () => {
    if (!document || !quillRef.current) return;

    const quill: ReactQuill = quillRef.current;
    const editor = quill.getEditor();
    const position = (quill?.selection?.index as number) || 0;

    // create new imput for form post

    const input = document.createElement("input");

    input.setAttribute("type", "file");
    input.click();

    input.onchange = async () => {
      setLoading(true);
      // setLoadMessage("Hình ảnh đang tải lên...")
      if (!input.files) return;

      const file = input.files[0] as File;
      const urlImage = await presignedNewsUrl(
        file.lastModified.toString() as string,
      );

      await axios.put(urlImage.preSignedPutUrl, file, {
        headers: {
          "Content-Type": file.type,
        },
      });
      console.log("file", file, urlImage);

      //add image in quill
      editor.insertEmbed(position, "image", urlImage.url);
      editor.formatLine(position, position, "align", "center");
      const newPosition: number = position + 1;
      editor.setSelection({ index: newPosition, length: 1 });
      editor.insertText(newPosition, "\n");
      // }

      setLoading(false);
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: "1" }, { header: "2" }, { font: [] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ color: colors }, { background: backgroundColors }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          [{ align: [] }],
          ["code-block"],
          ["link", "image"],
          ["clean"],
        ],
        handlers: {
          image: uploadImage,
        },
      },
    }),
    [],
  );

  const onChangeContent = (newConten: string) => {
    if (!newConten) return;

    setValue(newConten);
  };

  useEffect(() => {
    getContent(value);
  }, [newValue]);

  return (
    <div className="relative w-full h-full overflow-hidden z-0">
      <ReactQuill
        modules={modules}
        formats={formats}
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChangeContent}
        placeholder={placeholder}
      />

      {loading && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-white/50 backdrop-blur-md z-10">
          <SpinnerLoading size="L" />
        </div>
      )}
    </div>
  );
};

export default memo(Editor);
