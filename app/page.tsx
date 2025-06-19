import { db } from './lib/db';
import SpaceCard from '@/app/components/SpaceCard';
import { MapFilterItems } from '@/app/components/MapFilterItems';

export default async function Space({ searchParams }: { searchParams: Record<string, string> }) {
  try {
    // Build filters from searchParams
    const filters: any = {};
    if (searchParams.city) filters.location = searchParams.city;
    if (searchParams.space_type) filters.space_type = searchParams.space_type;
    if (searchParams.room_type && searchParams.room_type !== 'either') filters.room_type = searchParams.room_type;
    if (searchParams.reception_area) filters.reception_area = searchParams.reception_area === 'yes';
    if (searchParams.linen_service) filters.linen_service = searchParams.linen_service === 'yes';
    if (searchParams.category) filters.category = searchParams.category;
    // Add more filters as needed (e.g., equipment, min_price, max_price)

    const data = await db.getSpaces(filters);

    return (
      <main className="container mx-auto px-5 lg:px-10">
        <MapFilterItems />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {data.map((item) => (
            <SpaceCard key={item.id} space={item} />
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error loading spaces:', error);
    return (
      <main className="container mx-auto px-5 lg:px-10">
        <div className="text-center mt-8">
          <h2 className="text-2xl font-semibold">Something went wrong</h2>
          <p className="text-gray-500">Please try again later</p>
        </div>
      </main>
    );
  }
}
