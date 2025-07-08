"use client";

import { useEffect } from "react";

export default function SwaggerDocs() {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js";
        script.async = true;
        script.onload = () => {
            // @ts-ignore
            window.SwaggerUIBundle({
                url: "/api/swagger",
                dom_id: "#swagger-ui",
            });
        };
        document.body.appendChild(script);
    }, []);

    return (
        <div className="bg-white text-black min-h-screen px-6 py-8">
            <link
                rel="stylesheet"
                href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
            />
            <h1 className="text-2xl font-bold mb-4">ZeroCodeApi API Docs</h1>
            <div id="swagger-ui" />
        </div>
    );
}
