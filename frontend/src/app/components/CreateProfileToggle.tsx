"use client"

import { useState } from "react";
import CreateProfile from "./CreateProfile";

export default function CreateProfileToggle() {
    let [isOpen, setIsOpen] = useState(false)
    return (
        <div className="loginbtn">
        <h3
          onClick={() => setIsOpen(true)}
          >Create Your Farmer Profile
        </h3>
        {isOpen && <CreateProfile />}
        </div>
    )
}