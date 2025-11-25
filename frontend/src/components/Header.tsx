import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import "./header.css"

export default function Header() {
const location = useLocation();
const isHome = location.pathname === "/";


return (
<header className={isHome ? "header transparent" : "header solid"}>
<div className="brand">VoxNews</div>
<nav>
<ul>
<li><Link to="/">Inicio</Link></li>
<li><Link to="/servicios">Crear</Link></li>
</ul>
</nav>
</header>
);
}