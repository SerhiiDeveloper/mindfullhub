import { ChangeEvent, FC, FormEvent, useRef, useState } from "react";
import { SvgController } from "../svgController";
import UploadSVG from "../../assets/svg/download.svg";
import SaveSVG from "../../assets/svg/downloaded.svg";

type AddLocalFilesFormPropsType = {
    saveFileCallback: (file: File, title: string) => void
    inputAccept: string
}

export const AddLocalFilesForm: FC<AddLocalFilesFormPropsType> = ({saveFileCallback, inputAccept}) => {
    const titleInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
  
    const handleSubmit = () => (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const title = titleInputRef.current?.value;
      if (!title || !file) return;
      saveFileCallback(file, title);
      setFile(null);
      if (titleInputRef.current?.value) titleInputRef.current.value = ""
      if (fileInputRef.current) {
          titleInputRef.current.files = null
          titleInputRef.current.value = ""
      }
    };
  
    const handleSelectFile = (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) setFile(file);
    }

    return <form
    onSubmit={handleSubmit()}
    className="flex flex-row items-center justify-start"
  >
    <label
      htmlFor={"upload_file" + inputAccept}
      className={"border-2 py-1 " + (file ? "border-gray-500" : "border-red-500")}
    >
      <SvgController src={UploadSVG} alt="Добавити файл" />
    </label>
    <input
      accept={inputAccept}
      ref={fileInputRef}
      type="file"
      className="hidden"
      id={"upload_file" + inputAccept}
      name={"upload_file" + inputAccept}
      onChange={handleSelectFile}
    />
    <input
      ref={titleInputRef}
      placeholder="Назва файлу"
      required
      type="text"
      className="w-full bg-white border-2 border-gray-500 rounded p-2"
    />
    <button type="submit" className="border-0 bg-white">
      <SvgController src={SaveSVG} alt="Зберегти" />
    </button>
  </form>
}