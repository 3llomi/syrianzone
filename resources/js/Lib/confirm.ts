/**
 * Imperative confirmation, backed by the app's own <AlertDialog>.
 *
 * Replaces every native window.confirm / confirm() call. Because it is a plain
 * function (not a hook) any handler can await it with a single import:
 *
 *   if (!(await confirmDialog({ title: 'حذف المكان نهائياً؟', destructive: true }))) return
 *
 * <ConfirmHost/> (mounted once in MainLayout) renders the dialog and resolves
 * the promise from the user's choice.
 */
export interface ConfirmOptions {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
}

type Resolver = (confirmed: boolean) => void;
type Opener = (options: ConfirmOptions, resolve: Resolver) => void;

let opener: Opener | null = null;

export function registerConfirmOpener(fn: Opener | null) {
  opener = fn;
}

export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  if (!opener) {
    // Extremely unlikely (host not mounted); fail safe with a native prompt so
    // a destructive action is never silently confirmed.
    return Promise.resolve(
      typeof window !== 'undefined' ? window.confirm(options.title) : false
    );
  }
  return new Promise<boolean>((resolve) => opener!(options, resolve));
}
