import AppHeader from "@/app/components/app-header";

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AppHeader />
            {children}
        </>
    );
}
