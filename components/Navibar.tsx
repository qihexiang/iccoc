"use client";

import navibarItems from "@/config/navibarItems";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navibar() {
    const pathname = (usePathname() ?? "/");
    const isActive = (target: string) => {
        if(target === "/") return pathname === target;
        else return pathname.startsWith(target)
    }
    return <div className="flex items-center gap-1 flex-wrap justify-center">
      {
        navibarItems.map(([name, url, children], idx) => {
          if(children === undefined) {
            return <Link key={idx} className={`navilink ${isActive(url)  ? "active" : "inactive"}`} href={url}>{name}</Link>
          } else {
            return <div key={idx} className={`navilink group`}>
              {name}
              <div className="rounded mt-1 px-2 absolute h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 flex flex-col gap-1 z-10 bg-white shadow-neutral-200 shadow-md ease-in-out duration-300">
                {
                  children.map(([name, link], idx) => <Link key={idx} className={`navilink ${isActive(`${url}${link}`) ? "active" : "inactive"}`} href={`${url}${link}`}>{name}</Link>)
                }
              </div>
            </div>
          }
        })
      }
    </div>
}