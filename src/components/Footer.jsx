import Image from "next/image";
import Link from "next/link";

import {
  RiTwitterXFill,
  RiLinkedinFill,
  RiInstagramFill,
  RiFacebookFill,
} from "react-icons/ri";

import {
  CircleQuestion,
  Envelope,
  MapPin,
} from "@gravity-ui/icons";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Browse Tasks", href: "/tasks" },
  { name: "Browse Freelancers", href: "/freelancers" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "About Us", href: "/about" },
];

const socialLinks = [
  {
    name: "X",
    href: "https://x.com/",
    icon: RiTwitterXFill,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: RiLinkedinFill,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/",
    icon: RiInstagramFill,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/",
    icon: RiFacebookFill,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Main Footer */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="inline-flex items-center gap-2"
            >
              <Image
                src="/logo.png"
                alt="SkillSwap logo"
                width={38}
                height={38}
                className="h-9 w-9 object-contain"
              />

              <span className="text-2xl font-bold tracking-tight text-[#3030d8]">
                SkillSwap
              </span>
            </Link>

            <p className="mt-5 text-sm leading-6 text-slate-600">
              Connect with talented freelancers and get your tasks
              done quickly, reliably, and affordably.
            </p>

            {/* Contact */}
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Envelope className="h-4 w-4 text-[#3030d8]" />
                <a
                  href="mailto:support@skillswap.com"
                  className="transition-colors hover:text-[#3030d8]"
                >
                  support@skillswap.com
                </a>
              </div>

              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-[#3030d8]" />
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Platform
            </h3>

            <ul className="mt-5 space-y-3">
              {navigation.slice(0, 3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition-colors hover:text-[#3030d8]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Company
            </h3>

            <ul className="mt-5 space-y-3">
              {navigation.slice(3).map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-slate-600 transition-colors hover:text-[#3030d8]"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-slate-600 transition-colors hover:text-[#3030d8]"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Support
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/help"
                  className="inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-[#3030d8]"
                >
                  <CircleQuestion className="h-4 w-4" />
                  Help Center
                </Link>
              </li>

              <li>
                <Link
                  href="/terms"
                  className="text-sm text-slate-600 transition-colors hover:text-[#3030d8]"
                >
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-slate-600 transition-colors hover:text-[#3030d8]"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-10 flex flex-col gap-6 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          
          {/* Copyright */}
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SkillSwap. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-2">
            {socialLinks.map((social) => {
              const Icon = social.icon;

              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`SkillSwap on ${social.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-200 hover:border-[#3030d8] hover:bg-[#3030d8] hover:text-white"
                >
                  <Icon className="h-[17px] w-[17px]" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}