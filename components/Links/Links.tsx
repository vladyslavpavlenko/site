import Link from "next/link";
import { useState } from "react";
import { ExternalIcon } from "../Icons/Icons";
import { Tooltip } from "../Tooltip/Tooltip";
import { IoShareSocialSharp as ShareIcon} from "react-icons/io5"
import useCopy from "@react-hook/copy";

export function LinkExternal({ href, children }) {
  return (
    <a
      className="link link-external"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}

      <ExternalIcon size={16} />
    </a>
  );
}

export function LinkShare({ title, url, children }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const { copy } = useCopy(url);

  const onClick = async () => {
    if (navigator.share) {
      navigator
        .share({
          title,
          url,
        })
        .catch(console.error);
    } else {
      await copy();
      setTooltipOpen(true);

      setTimeout(() => {
        setTooltipOpen(false);
      }, 1000);
    }
  };

  return (
    <div className="relative">
      <Tooltip open={tooltipOpen}>Link copied!</Tooltip>
      <button className="link-share" onClick={onClick}>
        <ShareIcon size={16} />

        {children}
      </button>
    </div>
  );
}
