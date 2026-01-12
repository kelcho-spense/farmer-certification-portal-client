import Link from 'next/link';

export default function Home() {
    return (
        <div className="min-h-[calc(100vh-4rem)]">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 to-green-800 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Farmer Certification Portal
                    </h1>
                    <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
                        Register your farm, get certified, and grow your agricultural
                        business with official certification.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/register"
                            className="bg-white text-green-700 hover:bg-green-50 px-8 py-4 rounded-lg font-semibold text-lg transition shadow-lg"
                        >
                            Register as Farmer
                        </Link>
                        <Link
                            href="/login"
                            className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 rounded-lg font-semibold text-lg transition"
                        >
                            Login to Dashboard
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
                        How It Works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">📝</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">1. Register</h3>
                            <p className="text-gray-600">
                                Fill in your details including farm size and crop type to create
                                your account.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⏳</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">2. Await Review</h3>
                            <p className="text-gray-600">
                                Your application will be reviewed by our admin team for
                                certification.
                            </p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">✅</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">3. Get Certified</h3>
                            <p className="text-gray-600">
                                Once approved, you&apos;ll receive your certification status and can
                                access benefits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-gray-400">
                        © 2026 FarmCert Portal. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
