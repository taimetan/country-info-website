"use client";
import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

type Country = {
  cca3: string;
  name: { common: string };
  region: string;
  capital?: string[];
  population: number;
  flags: { png: string; svg: string };
};

interface CountriesListProps {
  initialCountries: Country[];
}

const getUniqueRegions = (countries: Country[]) => {
  const regions = countries.map((c) => c.region).filter(Boolean);
  return Array.from(new Set(regions));
};

export default function CountriesList({ initialCountries }: CountriesListProps) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");

  const regions = useMemo(() => getUniqueRegions(initialCountries), [initialCountries]);

  const filteredCountries = useMemo(() => {
    return initialCountries.filter((country) => {
      const matchRegion = region ? country.region === region : true;
      const matchSearch = country.name.common.toLowerCase().includes(search.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [search, region, initialCountries]);

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
        <input
          type="text"
          placeholder="Tìm kiếm quốc gia..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="relative w-full md:w-1/4">
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 pr-10 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition bg-white appearance-none"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          >
            <option value="">🌐 Tất cả khu vực</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            ▼
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-4">
        {filteredCountries.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Không tìm thấy quốc gia nào.</div>
        )}
        {filteredCountries.map((country) => (
          <Link
            key={country.cca3}
            href={`/country/${country.cca3.toLowerCase()}`}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col overflow-hidden"
          >
            <div className="relative w-full h-40">
              <Image
                src={country.flags.png || country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
                priority
              />
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-2">{country.name.common}</h2>
              <div className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Khu vực:</span> {country.region}
              </div>
              <div className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Thủ đô:</span> {country.capital?.[0] || 'N/A'}
              </div>
              <div className="text-gray-600 text-sm mb-1">
                <span className="font-medium">Dân số:</span> {country.population.toLocaleString()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}