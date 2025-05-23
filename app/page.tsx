import CountriesList from './components/CountriesList'

async function getCountries() {
  try {
    const res = await fetch('https://restcountries.com/v3.1/all', {
      next: { revalidate: 3600 } // Cache for 1 hour
    })

    if (!res.ok) {
      throw new Error('Failed to fetch countries')
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching countries:', error)
    return []
  }
}

export default async function Home() {
  const countries = await getCountries()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white/80 shadow-sm backdrop-blur top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col items-center gap-2">
          <h1 className="text-3xl text-center md:text-5xl font-extrabold text-blue-700 tracking-tight flex items-center gap-3">
            🌏 Thông Tin Các Quốc Gia Trên Thế Giới
          </h1>
          <p className="text-gray-600 mt-2 text-lg md:text-xl text-center max-w-2xl">
            Khám phá thông tin chi tiết về{' '}
            <span className="font-bold text-blue-700">
              {countries.length}
            </span>{' '}
            quốc gia trên toàn cầu: dân số, thủ đô, ngôn ngữ, tiền tệ, bản đồ,
            quốc kỳ và nhiều hơn nữa.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <CountriesList initialCountries={countries} />
      </main>
    </div>
  )
}