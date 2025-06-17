// components/StepIndicator.tsx
type Props = {
    step: 1 | 2;
};

export default function StepIndicator({ step }: Props) {
    return (
        <div className="flex items-center justify-center gap-6 mb-6">
            <div className="flex items-center gap-2">
                <span
                    className={`w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold ${step === 1 ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                        }`}
                >
                    1
                </span>
                <span className="font-medium">Endpoint Info</span>
            </div>

            <span className="text-gray-400">→</span>

            <div className="flex items-center gap-2">
                <span
                    className={`w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-300 text-black"
                        }`}
                >
                    2
                </span>
                <span className="font-medium">Schema Builder</span>
            </div>
        </div>
    );
}
