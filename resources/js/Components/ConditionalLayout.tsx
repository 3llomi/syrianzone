import { useCallback, useEffect, useMemo, useState } from 'react'
import { usePage } from '@inertiajs/react'
import Navbar from './Navbar'
import UnblockSyriaNotification from './UnblockSyriaNotification'
import { DevRoleSwitcher } from './DevRoleSwitcher'
import { FocusModeProvider } from '@/Contexts/FocusModeContext'
import { recordVisit } from '@/Lib/visit'

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const { url } = usePage()
  const path = url.split('?')[0]
  // Focus mode (a game hiding the chrome) is owned here because the navbar is a
  // sibling of the page and cannot be hidden from inside it.
  const [focus, setFocusState] = useState(false)
  const setFocus = useCallback((value: boolean) => setFocusState(value), [])
  const focusValue = useMemo(() => ({ focus, setFocus }), [focus, setFocus])
  // Last-visited tracking for the homepage badge (home itself never overwrites).
  useEffect(() => { recordVisit(path); }, [path])
  const isTransit = path.startsWith('/transit')
  // Full-height pages: studio, admin, and city map — no body scrollbar, navbar non-sticky
  const isFullHeight =
    path.startsWith('/transit/studio') ||
    path.startsWith('/transit/admin') ||
    path.match(/^\/transit\/city\/[^/]+\/map$/) !== null ||
    path.match(/^\/transit\/city\/[^/]+\/route\/[^/]+$/) !== null ||
    path.match(/^\/transit\/city\/[^/]+$/) !== null
  // The games hub and each game: a non-sticky navbar too, but the page still
  // scrolls when a board is taller than the screen.
  const isGames = path === '/games' || path.startsWith('/games/')

  return (
    <FocusModeProvider value={focusValue}>
      <div className={isFullHeight ? 'flex flex-col h-screen overflow-hidden' : ''}>
        {!focus && (
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-[200] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-lg focus:outline-none"
          >
            تجاوز إلى المحتوى
          </a>
        )}
        {!focus && <Navbar sticky={!isFullHeight && !path.startsWith('/muslim') && path !== '/' && !isGames} />}
        <main
          id="main-content"
          tabIndex={-1}
          className={
            (isFullHeight ? 'flex-1 min-h-0 overflow-hidden ' : '') + 'focus:outline-none'
          }
        >
          {children}
        </main>
        {!isTransit && <UnblockSyriaNotification />}
        <DevRoleSwitcher />
      </div>
    </FocusModeProvider>
  )
}
