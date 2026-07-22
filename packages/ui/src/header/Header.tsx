import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { NotificationButton } from "./NotificationButton";
import { ThemeToggle } from "./ThemeToggle";
import { LogoutButton } from "./LogoutButton";

type NavItem = { label: string; href: string };

const CLIENT_NAV_ITEMS: NavItem[] = [
  { label: "메인", href: "/" },
  { label: "인증제란?", href: "/certification" },
  { label: "FAQ", href: "/faq" },
  { label: "프로젝트", href: "/projects" },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "메인", href: "/" },
  { label: "인증제란?", href: "/certification" },
  { label: "FAQ", href: "/faq" },
  { label: "학생", href: "/students" },
];

type HeaderProps = {
  isAdmin?: boolean;
  onNotificationClick?: () => void;
  onLogout?: () => void;
};

export function Header({ isAdmin = false, onNotificationClick, onLogout }: HeaderProps) {
  const navItems = isAdmin ? ADMIN_NAV_ITEMS : CLIENT_NAV_ITEMS;

  return (
    <header className="w-full border-b border-line bg-page">
      <div className="mx-auto flex h-14 w-full max-w-[1920px] items-center justify-between px-6 lg:px-16">
        <Logo />
        <nav className="flex items-center gap-0.5">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <NotificationButton onClick={onNotificationClick} />
          <ThemeToggle />
          <LogoutButton onClick={onLogout} />
        </div>
      </div>
    </header>
  );
}
