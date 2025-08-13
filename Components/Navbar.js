"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ChatBubbleBottomCenterTextIcon,
  UserCircleIcon,
  BellIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

const Navbar = ({ user, onLogout, onFilterChange }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/", icon: HomeIcon },
    { name: "Chat", href: "/chat", icon: ChatBubbleBottomCenterTextIcon },
    { name: "Notifications", href: "/notifications", icon: BellIcon },
  ];

  const isHome = pathname === "/home";

  const isActive = (href) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <nav className="bg-[#FFFFFF] shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-indigo-600 font-semibold text-2xl font-sans select-none"
          >
            IshqLine
          </Link>

          {/* Desktop and medium nav and search/filter */}
          <div className="hidden md:flex items-center space-x-6 flex-1 ml-6">
            {/* Navigation links with icon + text */}
            <div className="flex space-x-6 flex-shrink-0">
              {navLinks.map(({ name, href, icon: Icon }) => (
                <Link
                  key={name}
                  href={href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-gray-700 hover:text-indigo-600 transition ${
                    isActive(href)
                      ? "bg-indigo-100 text-indigo-700 font-semibold"
                      : ""
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden xl:block">{name}</span>
                </Link>
              ))}
            </div>

            {/* Search and Filter for home */}
            {isHome && (
              <>
                <input
                  type="search"
                  placeholder="Search..."
                  className="ml-8 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-64 max-w-xs"
                  onChange={(e) => {
                    // Optional: onSearchChange && onSearchChange(e.target.value);
                  }}
                />

                <div className="relative ml-4 flex-shrink-0">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center space-x-1 px-3 py-2 rounded-md border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    aria-haspopup="true"
                    aria-expanded={filterOpen}
                    aria-controls="filter-menu"
                  >
                    <FunnelIcon className="h-5 w-5" />
                    <span className="hidden xl:block">Filter</span>
                  </button>

                  {filterOpen && (
                    <div
                      id="filter-menu"
                      className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50"
                    >
                      {["Age", "Location", "Interests"].map((filter) => (
                        <button
                          key={filter}
                          className="block w-full text-left px-4 py-2 hover:bg-indigo-100 transition"
                          onClick={() => {
                            onFilterChange &&
                              onFilterChange(filter.toLowerCase());
                            setFilterOpen(false);
                          }}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Auth buttons or profile + logout */}
          <div className="hidden md:flex items-center space-x-4 ml-6 flex-shrink-0">
            {!user ? (
              <>
                <Link
                  href="/signup"
                  className="px-4 py-2 rounded-2xl border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/profile"
                  className="flex items-center space-x-1 px-3 py-2 rounded-md text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                >
                  <UserCircleIcon className="h-5 w-5" />
                  <span>My Profile</span>
                </Link>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-2xl border border-rose-500 text-rose-500 font-semibold hover:bg-rose-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="p-2 rounded-md hover:bg-indigo-100 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6 text-indigo-600" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-indigo-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white border-t border-gray-200 shadow-md transition-max-height duration-300 ease-in-out overflow-hidden ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-2 text-gray-700">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-indigo-100 transition ${
                isActive(href)
                  ? "bg-indigo-100 font-semibold text-indigo-700"
                  : ""
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <Icon className="h-5 w-5" />
              <span>{name}</span>
            </Link>
          ))}

          {/* Search input on Home */}
          {isHome && (
            <input
              type="search"
              placeholder="Search..."
              className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              onChange={(e) => {
                // Optional: onSearchChange && onSearchChange(e.target.value);
              }}
            />
          )}

          {/* Filter button on mobile */}
          {isHome && (
            <>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="w-full flex items-center justify-center space-x-1 mt-2 px-3 py-2 rounded-md border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <FunnelIcon className="h-5 w-5" />
                <span>Filter</span>
              </button>

              {filterOpen && (
                <div className="w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {["Age", "Location", "Interests"].map((filter) => (
                    <button
                      key={filter}
                      className="block w-full text-left px-4 py-2 hover:bg-indigo-100 transition"
                      onClick={() => {
                        onFilterChange && onFilterChange(filter.toLowerCase());
                        setFilterOpen(false);
                        setMenuOpen(false);
                      }}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Auth buttons */}
          {!user ? (
            <>
              <Link
                href="/signup"
                className="block px-3 py-2 rounded-md border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setMenuOpen(false)}
              >
                Sign Up
              </Link>
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-indigo-700 font-semibold hover:bg-indigo-100 transition"
                onClick={() => setMenuOpen(false)}
              >
                <UserCircleIcon className="h-5 w-5" />
                <span>My Profile</span>
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  setMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md border border-rose-500 text-rose-500 font-semibold hover:bg-rose-500 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Small screen icons-only nav (under 400px) */}
      <style jsx>{`
        @media (max-width: 400px) {
          nav > div > div.md\\:flex {
            display: none !important; /* hide default desktop nav */
          }
          .icons-only-nav {
            display: flex !important;
          }
        }
        @media (min-width: 401px) {
          .icons-only-nav {
            display: none !important;
          }
        }
      `}</style>

      <div className="icons-only-nav fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-md md:hidden z-50 px-4">
        <div className="flex justify-around py-2">
          {navLinks.map(({ name, href, icon: Icon }) => (
            <Link
              key={name}
              href={href}
              className={`flex flex-col items-center justify-center text-gray-700 hover:text-indigo-600 ${
                isActive(href) ? "text-indigo-600 font-semibold" : ""
              }`}
              onClick={() => setMenuOpen(false)}
              aria-label={name}
            >
              <Icon className="h-6 w-6" />
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
