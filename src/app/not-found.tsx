import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="space-y-6">
                    <h1 className="text-6xl md:text-8xl font-bold text-gray-900 tracking-tight">
                        Oops.
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
                        We can&apos;t access the <br />
                        page you are looking for.
                    </h2>
                    <p className="text-gray-500 text-lg max-w-md">
                        Either this page doesn&apos;t exist or you don&apos;t have permissions to view it.
                    </p>

                    <div className="pt-4">
                        <Link
                            href="/"
                            className="inline-block bg-[#FFC107] hover:bg-[#FFD54F] text-black font-bold py-4 px-8 rounded-sm transition-colors text-lg"
                        >
                            Go back home
                        </Link>
                    </div>
                </div>

                {/* Illustration */}
                <div className="relative h-[400px] w-full flex items-center justify-center">
                    <svg viewBox="0 0 400 300" className="w-full h-full max-w-md" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        {/* Left Hand */}
                        <path d="M50 200 Q 40 220 60 250 L 60 300 L 140 280 L 140 220 Q 120 180 100 200" className="text-gray-900" fill="white" />
                        <path d="M60 250 Q 40 200 60 180" className="text-gray-900" />
                        <path d="M80 250 Q 70 170 90 170" className="text-gray-900" />
                        <path d="M100 250 Q 100 180 120 180" className="text-gray-900" />
                        {/* Sleeve/Hole Left */}
                        <ellipse cx="100" cy="290" rx="40" ry="10" className="fill-[#FFC107] stroke-gray-900" />

                        {/* Right Hand */}
                        <path d="M350 200 Q 360 220 340 250 L 340 300 L 260 280 L 260 220 Q 280 180 300 200" className="text-gray-900" fill="white" />
                        <path d="M340 250 Q 360 200 340 180" className="text-gray-900" />
                        <path d="M320 250 Q 330 170 310 170" className="text-gray-900" />
                        <path d="M300 250 Q 300 180 280 180" className="text-gray-900" />
                        {/* Sleeve/Hole Right */}
                        <ellipse cx="300" cy="290" rx="40" ry="10" className="fill-[#FFC107] stroke-gray-900" />

                        {/* Abstract Shapes */}
                        {/* Squiggly Line */}
                        <path d="M100 100 Q 130 50 160 100 T 220 100" className="text-gray-900" fill="none" />

                        {/* Spiral */}
                        <path d="M300 80 Q 320 60 300 40 Q 280 60 300 80 Q 310 90 320 80" className="text-gray-900" fill="none" />

                        {/* Sparkles */}
                        <path d="M250 150 L 260 150 M 255 145 L 255 155" className="text-gray-900" />
                        <path d="M200 180 L 200 200 M 190 190 L 210 190" className="text-gray-900" />
                    </svg>
                </div>

            </div>
        </div>
    );
}
