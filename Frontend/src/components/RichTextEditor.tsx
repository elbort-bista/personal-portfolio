import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  value: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
};

export function RichTextEditor({ value, onChange, onUploadImage }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [linkUrl, setLinkUrl] = useState("");

  const exec = (cmd: string, arg?: string) => {
    document.execCommand(cmd, false, arg);
    onChange(ref.current?.innerHTML || "");
  };

  const onInput = () => {
    onChange(ref.current?.innerHTML || "");
  };

  const applyLink = () => {
    if (!linkUrl) return;
    exec("createLink", linkUrl);
    setLinkUrl("");
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f || !onUploadImage) return;
    const url = await onUploadImage(f);
    if (!url) return;
    exec("insertImage", url);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" onClick={() => exec("bold")}>B</Button>
        <Button type="button" variant="outline" onClick={() => exec("italic")}>I</Button>
        <Button type="button" variant="outline" onClick={() => exec("underline")}>U</Button>
        <Button type="button" variant="outline" onClick={() => exec("formatBlock", "<h2>")}>H2</Button>
        <Button type="button" variant="outline" onClick={() => exec("formatBlock", "<p>")}>P</Button>
        <select
          className="border rounded px-2 py-1 bg-background"
          onChange={(e) => exec("fontSize", e.target.value)}
          defaultValue="3"
        >
          <option value="1">Small</option>
          <option value="2">Normal-</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">X-Large</option>
        </select>
        <div className="flex items-center gap-2">
          <Input
            placeholder="https://link"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className="h-9 w-48"
          />
          <Button type="button" variant="outline" onClick={applyLink}>Link</Button>
        </div>
        <div className="flex items-center">
          <input id="rte-image" type="file" accept="image/*" className="hidden" onChange={onPickImage} />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("rte-image")?.click()}
          >
            Image
          </Button>
        </div>
      </div>
      <div
        ref={ref}
        onInput={onInput}
        contentEditable
        suppressContentEditableWarning
        className="min-h-[220px] border border-primary/20 rounded p-3 bg-background prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: value || "" }}
      />
    </div>
  );
}
