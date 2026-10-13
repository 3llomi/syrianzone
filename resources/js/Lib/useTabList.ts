import { useCallback, useId, useRef } from 'react';

/**
 * Minimal ARIA tab pattern (roving tabindex + arrow keys), RTL-aware.
 *
 * Use it for in-page tab/segmented switchers that don't use the shadcn Tabs
 * primitive. It wires role=tablist/tab/tabpanel, keeps one tab in the tab order,
 * moves selection with ArrowLeft/ArrowRight (mirrored for RTL), and supports
 * Home/End.
 *
 *   const tabs = useTabList({ ids: ['a','b'], active, onChange: setActive });
 *   <div {...tabs.tabListProps}> <button {...tabs.tabProps('a')}>A</button> ... </div>
 *   <div {...tabs.panelProps('a')}>…</div>
 */
export function useTabList<T extends string>(options: {
  ids: readonly T[];
  active: T;
  onChange: (id: T) => void;
  /** Reading direction; arrow keys are mirrored for 'rtl'. */
  dir?: 'rtl' | 'ltr';
}) {
  const { ids, active, onChange, dir = 'rtl' } = options;
  const base = useId();
  const refs = useRef<Record<string, HTMLElement | null>>({});

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const index = ids.indexOf(active);
      if (index === -1) return;
      const rtl = dir === 'rtl';
      let next: number;
      switch (e.key) {
        case 'ArrowRight':
          next = rtl ? index - 1 : index + 1;
          break;
        case 'ArrowLeft':
          next = rtl ? index + 1 : index - 1;
          break;
        case 'Home':
          next = 0;
          break;
        case 'End':
          next = ids.length - 1;
          break;
        default:
          return;
      }
      e.preventDefault();
      next = (next + ids.length) % ids.length;
      const id = ids[next];
      onChange(id);
      refs.current[id]?.focus();
    },
    [active, dir, ids, onChange]
  );

  const tabListProps = {
    role: 'tablist' as const,
    onKeyDown,
  };

  const tabProps = (id: T) => ({
    role: 'tab' as const,
    id: `${base}-tab-${id}`,
    'aria-selected': active === id,
    'aria-controls': `${base}-panel-${id}`,
    tabIndex: active === id ? 0 : -1,
    ref: (el: HTMLElement | null) => {
      refs.current[id] = el;
    },
    onClick: () => onChange(id),
  });

  const panelProps = (id: T) => ({
    role: 'tabpanel' as const,
    id: `${base}-panel-${id}`,
    'aria-labelledby': `${base}-tab-${id}`,
    tabIndex: 0,
  });

  return { tabListProps, tabProps, panelProps };
}
