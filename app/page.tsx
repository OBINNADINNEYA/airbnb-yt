import { db } from './lib/db';
import HomeCard from '@/app/components/HomeCard';

export default async function Home() {
  try {
    const data = await db.getSpaces();

    return (
      <main className="container mx-auto px-5 lg:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
          {data.map((item) => (
            <HomeCard key={item.id} space={item} />
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
