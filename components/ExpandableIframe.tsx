"use client";
import { useState } from "react";

export default function ExpandableIframe(
  props: {
    buttonName: string;
    autoExpand?: boolean;
  } & React.IframeHTMLAttributes<HTMLIFrameElement>
) {
  const { buttonName, autoExpand, ...iframeProps } = props;
  const [expand, setExpand] = useState(autoExpand ?? false);
  return (
    <div>
      {expand ? (
        <div className="shaodw-neutral-600 shadow-lg rounded p-2">
          <div className="flex items-center justify-between p-2">
            <h4>Google Map</h4>
            <button
              className="btn danger"
              onClick={() => setExpand(false)}
            >
              Close
            </button>
          </div>
          <iframe {...iframeProps}></iframe>
        </div>
      ) : (
        <button
          className="btn info"
          onClick={() => setExpand(true)}
        >
          {buttonName}
        </button>
      )}
    </div>
  );
}
