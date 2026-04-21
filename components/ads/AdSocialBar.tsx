'use client';
import { useEffect } from 'react';

export function AdSocialBar() {
  useEffect(() => {
    const srcs = ["https://pl29147482.profitablecpmratenetwork.com/b2/1b/e6/b21be67ae70381ca1dfdcaee89349e72.js", "https://pl29147484.profitablecpmratenetwork.com/c4/d6/f5/c4d6f53a617e2ba4a15875844752f8a5.js"];
    const scripts = srcs.map((src) => {
      const s = document.createElement('script');
      s.src = src; s.async = true;
      document.head.appendChild(s);
      return s;
    });
    return () => scripts.forEach((s) => s.parentNode?.removeChild(s));
  }, []);
  return null;
}
