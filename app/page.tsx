import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 relative overflow-hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/25 z-10"></div>

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <div className="w-32 h-32 bg-white rounded-full p-2 shadow-2xl mx-auto">
            <Image
              src="/logo.jpg"
              alt="Logo UDINUS"
              width={128}
              height={128}
              className="rounded-full object-cover"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wide animate-slide-up">
          Aspirasi Mahasiswa
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-blue-50 mb-8 max-w-2xl animate-slide-up animation-delay-200">
          Suara Anda untuk Kemajuan Universitas Dian Nuswantoro
        </p>

        {/* CTA Button */}
        <Link
          href="/login"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-slide-up animation-delay-400"
        >
          Masuk ke Sistem
        </Link>

        {/* Footer */}
        <footer className="absolute bottom-4 left-0 right-0 text-center text-blue-50 text-sm">
          © {new Date().getFullYear()} Sistem Aspirasi Mahasiswa | Universitas Dian Nuswantoro
        </footer>
      </div>
    </div>
  )
}
