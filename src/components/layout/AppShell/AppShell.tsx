import type { PropsWithChildren } from 'react'

import './AppShell.css'

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="app-shell">
    <div className="app-shell__ambient app-shell__ambient--left" />
    <div className="app-shell__ambient app-shell__ambient--right" />
    <main className="app-shell__content">{children}</main>
  </div>
)
