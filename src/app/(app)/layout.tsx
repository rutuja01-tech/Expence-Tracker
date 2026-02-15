import { ReactNode } from 'react';
import Link from 'next/link';
import {
  Home,
  PanelLeft,
  ArrowRightLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import NavLink from '@/components/nav-link';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <nav className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <Logo />
          </div>
          <div className="flex-1 overflow-auto py-4">
            <nav className="grid items-start px-4 text-sm font-medium">
              <NavLink href="/">
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink href="/transactions">
                <ArrowRightLeft className="h-4 w-4" />
                Transactions
              </NavLink>
            </nav>
          </div>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <div className="flex h-16 items-center border-b px-6 -ml-6 -mt-6 mb-2">
                   <Logo />
                </div>
                <Link
                  href="/"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="/transactions"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                  Transactions
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="ml-auto flex items-center gap-2">
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 sm:px-6 sm:py-0">{children}</main>
      </div>
    </div>
  );
}
