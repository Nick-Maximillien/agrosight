"use client"

import { useState } from "react"
import Login from "./Login"

export default function LoginToggle() {
    let [isOpen, setIsOpen] = useState(false)
    return (
        <div className="loginbtn">
        <h3
          className="loginToggle"
          onClick={() => setIsOpen(true)}
          >Login <b className="create">to Green Future</b>
        </h3>
        {isOpen && <Login />}
        </div>
    )
}