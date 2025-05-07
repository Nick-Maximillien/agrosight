"use client"

import { useState } from "react";
import Signup from "./Signup";

export default function SignUpToggle() {
    let [isOpen, setIsOpen] = useState(false)
    return (
        <div className="signupbtn">
        <h3 className="signupToggle" onClick={() => setIsOpen(true)}>Signup <b className="create">and create account</b></h3>
        {isOpen && <Signup />}
        </div>
    )
}