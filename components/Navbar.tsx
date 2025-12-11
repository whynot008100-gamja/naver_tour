'use client';

import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between gap-4 px-4 max-w-7xl mx-auto">
        {/* 로고 */}
        <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          My Trip
        </Link>

        {/* 검색창 (데스크톱) */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-md mx-4"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="관광지 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>
        </form>

        {/* 네비게이션 링크 + 로그인 */}
        <nav className="flex items-center gap-4">
          <Link 
            href="/" 
            className="hidden sm:inline-block text-sm font-medium hover:text-primary transition-colors"
          >
            홈
          </Link>
          <Link 
            href="/stats" 
            className="hidden sm:inline-block text-sm font-medium hover:text-primary transition-colors"
          >
            통계
          </Link>
          <SignedIn>
            <Link 
              href="/bookmarks" 
              className="hidden sm:inline-block text-sm font-medium hover:text-primary transition-colors"
            >
              북마크
            </Link>
          </SignedIn>
          
          <ThemeToggle />
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="sm">로그인</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </nav>
      </div>

      {/* 검색창 (모바일) */}
      <form 
        onSubmit={handleSearch}
        className="md:hidden px-4 pb-3"
      >
        <div className="relative w-full min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="관광지 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        </div>
      </form>
    </header>
  );
};

export default Navbar;
