"use client";

import { useState } from "react";
import Link from "next/link";
import SearchIcon from "./SearchIcon";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="GAMEVION"
            className="block h-[34px] w-auto md:h-[34px]"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Beranda
          </Link>
          <a
            href="#games"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Semua Game
          </a>
          <a
            href="#cara-order"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Cara Order
          </a>
          <Link
            href="/cek-transaksi"
            className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
          >
            Cek Transaksi
          </Link>
        </nav>

        {/* Search Form (desktop) */}
        <form className="relative hidden sm:block" action="/search" method="get">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <SearchIcon />
          </div>
          <input
            type="text"
            name="q"
            placeholder="Cari game..."
            className="h-9 w-48 rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none transition-all focus:w-64 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
        </form>

        {/* CTA Button (desktop) */}
        <a
          href="#games"
          className="hidden rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-purple-700 md:block"
        >
          Top Up
        </a>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Panel */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-gray-950 px-4 pb-4 pt-2 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Beranda
            </Link>
            <a
              href="#games"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Semua Game
            </a>
            <a
              href="#cara-order"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Cara Order
            </a>
            <Link
              href="/cek-transaksi"
              className="rounded-lg px-3 py-2 text-sm font-medium text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              onClick={() => setMobileOpen(false)}
            >
              Cek Transaksi
            </Link>
          </nav>

          {/* Mobile Search */}
          <form className="mt-3" action="/search" method="get">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon />
              </div>
              <input
                type="text"
                name="q"
                placeholder="Cari game..."
                className="h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-3 text-sm text-white placeholder-gray-500 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </form>

          {/* Mobile CTA */}
          <a
            href="#games"
            className="mt-3 block rounded-lg bg-purple-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-purple-700"
            onClick={() => setMobileOpen(false)}
          >
            Top Up
          </a>
        </div>
      )}
    </header>
  );
}
