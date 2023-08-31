"use client";
import useAlert from "./useAlert";

export default function ClipaleArea({ content }: { content: string }) {
  const [setInformation, alertElement] = useAlert(6000);
  return (
    <>
      {alertElement}
      <div className="rounded shadow-neutral-200 shadow-md border-2 border-black  p-4 mt-2">
        <div className="overflow-scroll">
          <pre className="text-sm font-sans">
            {content}
          </pre>
        </div>
        <button
          className="mt-2 btn info"
          onClick={() =>
            window.navigator.clipboard
              .writeText(content)
              .then(() =>
                setInformation({
                  color: "success",
                  message: "Text successfully copied into your clipboard.",
                })
              )
              .catch(() =>
                setInformation({
                  color: "warning",
                  message:
                    "Unable to copy the text into your clipboard. Please copy it manually.",
                })
              )
          }
        >
          Copy
        </button>
      </div>
    </>
  );
}
