export default function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${active
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
                }`}
        >
            {children}
        </button>
    );

}