import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Music2, Home, Library, Plus, User, LogOut, Crown } from "lucide-react";
import { auth } from "~/lib/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Server-side authentication check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-border bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Music2 className="h-6 w-6 text-primary" />
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Mellow-AI
            </span>
          </Link>

          {/* Right Section: Credits and User Menu */}
          <div className="flex items-center gap-4">
            {/* Credits Display */}
            <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-semibold">
                {session.user.credits ?? 0} Credits
              </span>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <User className="h-4 w-4" />
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">
                  {session.user.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {session.user.email}
                </span>
              </div>
            </div>

            {/* Sign Out Button */}
            <form action="/api/auth/sign-out" method="POST">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-border bg-sidebar">
          <nav className="flex flex-col gap-2 p-4">
            {/* Home */}
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Home className="h-5 w-5" />
              <span className="font-medium">Home</span>
            </Link>

            {/* Generate New Song */}
            <Link
              href="/generate"
              className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">Generate Song</span>
            </Link>

            {/* My Library */}
            <Link
              href="/library"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Library className="h-5 w-5" />
              <span className="font-medium">My Library</span>
            </Link>

            {/* Divider */}
            <div className="my-2 border-t border-sidebar-border" />

            {/* Categories/Genres Section */}
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
                Browse
              </h3>
            </div>

            <Link
              href="/explore"
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <Music2 className="h-5 w-5" />
              <span className="font-medium">Explore</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
