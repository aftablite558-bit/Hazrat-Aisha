import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';

const DebugElement = ({ title, children, elementRef }: { title: string, children: React.ReactNode, elementRef: React.RefObject<HTMLDivElement> }) => {
  const [dims, setDims] = useState<any>({});

  useEffect(() => {
    const update = () => {
      if (elementRef.current) {
        const el = elementRef.current;
        const rect = el.getBoundingClientRect();
        const style = window.getComputedStyle(el);
        setDims({
          offsetWidth: el.offsetWidth,
          clientWidth: el.clientWidth,
          rectWidth: rect.width,
          computedWidth: style.width,
          display: style.display,
          flex: style.flex,
          minWidth: style.minWidth,
          maxWidth: style.maxWidth,
        });
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [elementRef]);

  return (
    <div className="p-4 border border-red-500 mb-4">
      <h2 className="font-bold text-red-500 mb-2">{title}</h2>
      <div ref={elementRef}>{children}</div>
      <pre className="text-xs bg-gray-100 p-2 mt-2">{JSON.stringify(dims, null, 2)}</pre>
    </div>
  );
};

export default function LayoutDebug() {
  const divRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const tailwindRef = useRef<HTMLDivElement>(null);
  const glassRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const uiBtnRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="p-10 space-y-4">
      <DebugElement title="1. Plain HTML div" elementRef={divRef}>
        <div className="border bg-gray-200">Test Div</div>
      </DebugElement>
      <DebugElement title="2. Plain HTML button" elementRef={btnRef as any}>
        <button className="border bg-gray-200">Test Button</button>
      </DebugElement>
      <DebugElement title="3. Tailwind w-full max-w-lg" elementRef={tailwindRef}>
        <div className="w-full max-w-lg bg-blue-100 border">Tailwind Div</div>
      </DebugElement>
      <DebugElement title="4. Glass-panel" elementRef={glassRef}>
        <div className="glass-panel bg-white/50 border">Glass Panel</div>
      </DebugElement>
      <DebugElement title="5. Card component" elementRef={cardRef as any}>
        <Card className="p-4">Card</Card>
      </DebugElement>
      <DebugElement title="6. Button component" elementRef={uiBtnRef as any}>
        <Button>UI Button</Button>
      </DebugElement>
    </div>
  );
}
