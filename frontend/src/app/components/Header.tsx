"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [dropDownOpen, setDropDownOpen] = useState(false);

  return (
    <header className="header">
      <div className="row headerContainer">
        <div className="head">
        <div className="logo">
          <img className="logoImg" src="/images/logo.png" alt="logo" />
        </div>
        <nav className="nav">
                 <ul>
                   <li 
                     className="dropdown-container"
                     onMouseEnter={() => setDropDownOpen(true)}
                     onMouseLeave={() => setDropDownOpen(false)}
                   >
                     <figure className="menu"><img className="dropbtn menuIcon" src="../images/menu.png" alt="Menu" /></figure>
                     {dropDownOpen && (
                       <ul className="dropdown-list">
                         <li className="menuItem">
                           <Link href="/">Home</Link>
                         </li>
                         <li className="menuItem">
                           <Link href="/services">Services</Link>
                         </li>
                         <li className="menuItem">
                           <Link href="/dashboard">Dashboard</Link>
                         </li>
                         <li className="menuItem">
                           <Link href="/about">About</Link>
                         </li>
                         <li className="menuItem">
                           <Link href="/contact">Contact</Link>
                         </li>
                       </ul>
                     )}
                   </li>
                 </ul>
        </nav>
        </div>
      </div>
    </header>
  );
}
