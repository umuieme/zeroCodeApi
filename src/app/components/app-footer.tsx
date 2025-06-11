export function AppFooter() {
    return (
        <footer className="w-full flex bg-neutral-900 justify-center shadow-sm px-8 py-4">
            <p className="text-sm">
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
            </p>
        </footer>
    );
}