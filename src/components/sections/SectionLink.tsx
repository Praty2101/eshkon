"use client";

import Link from "next/link";

function isInternalHref(href: string): boolean {
  return href.startsWith("/");
}

interface SectionLinkProps {
  href: string;
  className: string;
  children: React.ReactNode;
}

export function SectionLink({ href, className, children }: SectionLinkProps) {
  if (isInternalHref(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a
      href={href}
      className={className}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
}
