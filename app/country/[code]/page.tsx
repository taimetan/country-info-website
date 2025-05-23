import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface CountryName {
  common: string;
  official?: string;
}

interface CountryFlags {
  svg?: string;
  png?: string;
}

interface CountryCoatOfArms {
  svg?: string;
}

interface CountryCurrency {
  name: string;
  symbol: string;
}

interface CountryMaps {
  googleMaps?: string;
}

export interface Country {
  name: CountryName;
  flags: CountryFlags;
  coatOfArms?: CountryCoatOfArms;
  population?: number;
  region?: string;
  subregion?: string;
  capital?: string[];
  area?: number;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: CountryCurrency };
  timezones?: string[];
  tld?: string[];
  maps?: CountryMaps;
  borders?: string[];
  cca3: string;
}

async function getCountry(code: string): Promise<Country | null> {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${code.toUpperCase()}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return null;
    }

    const data: Country[] = await res.json();
    return data[0];
  } catch (error) {
    console.error("Error fetching country:", error);
    return null;
  }
}

async function getBorderCountries(borderCodes: string[] | undefined): Promise<Country[]> {
  if (!borderCodes || borderCodes.length === 0) {
    return [];
  }

  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching border countries:", error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { code: string } }) {
  const { code } = params;
  const country = await getCountry(code);

  if (!country) {
    return {
      title: "Không tìm thấy quốc gia",
    };
  }

  return {
    title: `${country.name.common} - Thông Tin Quốc Gia`,
    description: `Thông tin chi tiết về ${country.name.common}`,
  };
}

export default async function CountryPage({ params }: { params: { code: string } }) {
  const { code } = params;
  const country = await getCountry(code);

  if (!country) {
    notFound();
  }

  const borderCountries = await getBorderCountries(country.borders);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white/80 shadow-sm backdrop-blur top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-2">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-flex items-center gap-1 transition"
          >
            <span className="text-lg">←</span>
            <span>Quay về trang chủ</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            {country.name.common}
          </h1>
          {country.name.official &&
            country.name.official !== country.name.common && (
              <p className="text-gray-600 mt-1">
                Tên chính thức: {country.name.official}
              </p>
            )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Flag */}
          <div>
            <div className="aspect-video relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={country.flags.svg || country.flags.png || "/placeholder-flag.png"}
                alt={`Cờ của ${country.name.common}`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            {country.coatOfArms?.svg && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Quốc huy</h3>
                <div className="w-32 h-32 relative">
                  <Image
                    src={country.coatOfArms.svg}
                    alt={`Quốc huy của ${country.name.common}`}
                    fill
                    className="object-contain"
                    sizes="128px"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Information */}
          <div className="bg-white rounded-lg h-fit shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6">Thông tin chi tiết</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Thông tin cơ bản
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Dân số:</span>{" "}
                    {country.population?.toLocaleString() || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Khu vực:</span>{" "}
                    {country.region || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Tiểu vùng:</span>{" "}
                    {country.subregion || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Thủ đô:</span>{" "}
                    {country.capital?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Diện tích:</span>{" "}
                    {country.area?.toLocaleString() || "N/A"} km²
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  Ngôn ngữ & Tiền tệ
                </h3>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Ngôn ngữ:</span>{" "}
                    {country.languages
                      ? Object.values(country.languages).join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Tiền tệ:</span>{" "}
                    {country.currencies
                      ? Object.values(country.currencies)
                          .map((curr) => {
                            const currency = curr as { name: string; symbol: string };
                            return `${currency.name} (${currency.symbol})`;
                          })
                          .join(", ")
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Múi giờ:</span>{" "}
                    {country.timezones?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Tên miền:</span>{" "}
                    {country.tld?.join(", ") || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {country.maps?.googleMaps && (
              <div className="mt-6">
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Xem trên Google Maps
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Border Countries */}
        {borderCountries.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Quốc gia giáp biên</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {borderCountries.map((borderCountry: {
                cca3: string;
                flags: { svg?: string; png?: string };
                name: { common: string };
              }) => (
                <Link
                  key={borderCountry.cca3}
                  href={`/country/${borderCountry.cca3.toLowerCase()}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-3 text-center"
                >
                  <div className="aspect-video relative mb-2 rounded overflow-hidden">
                    <Image
                      src={borderCountry.flags.svg || borderCountry.flags.png || "/placeholder-flag.png"}
                      alt={`Cờ của ${borderCountry.name.common}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                    />
                  </div>
                  <p className="text-sm font-medium">
                    {borderCountry.name.common}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
