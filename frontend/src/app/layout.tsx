'use server'
import React from "react";
import { AuthProvider } from "context/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css"


export default async function RootLayout(props: {
  children: React.ReactNode
  home: React.ReactNode
}) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="/bootstrap/css/bootstrap-grid.min.css" />
      </head>
      <body className="body">
        <AuthProvider>
          <Header />
        {props.children}
        <Footer />
        </AuthProvider>
      </body>
    </html>

  )
};
