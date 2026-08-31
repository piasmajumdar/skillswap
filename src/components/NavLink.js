"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavLink = ({ className = "", children, href }) => {

    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <Link
            href={href}
            className={`
                relative
                px-4 py-2
                text-sm font-medium
                rounded-md
                transition-all duration-300 ease-in-out
                
                ${isActive
                    ? "text-white bg-[#002bebda] shadow-lg shadow-blue-500/20"
                    : "text-neutral-700 hover:text-[#002bebda] hover:bg-blue-50"
                }

                before:absolute before:left-1/2 before:-bottom-1
                before:h-[2px] before:w-0
                before:-translate-x-1/2
                before:bg-[#002bebda]
                before:transition-all before:duration-300

                hover:before:w-1/2

                ${className}
            `}
        >
            {children}
        </Link>
    );
};

export default NavLink;