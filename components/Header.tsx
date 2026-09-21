import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-5 z-50 mx-auto flex h-18 w-full lg:max-w-6xl px-10 justify-between items-center rounded-2xl border border-border/50 bg-background/40 backdrop-blur-xl shadow-lg shadow-black/5">
      <h2 className="text-primary text-2xl font-semibold italic">A-Coin</h2>
      <div className="flex items-center gap-x-4">
        <nav>
          <ul className="flex items-center justify-center gap-x-2">
            <li>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                coins
              </Link>
            </li>
            <li>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "ghost",
                })}
              >
                search
              </Link>
            </li>
          </ul>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
