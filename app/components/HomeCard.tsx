import Image from 'next/image';
import Link from 'next/link';
import { Space } from '../lib/db';

interface HomeCardProps {
  space: Space;
}

export default function HomeCard({ space }: HomeCardProps) {
  return (
    <Link href={`/space/${space.id}`}>
      <div className="flex flex-col w-full">
        <div className="relative w-full h-72">
          <Image
            src={space.images?.[0] || '/placeholder.jpg'}
            alt={space.title}
            fill
            className="object-cover rounded-xl"
          />
        </div>
        <div className="mt-3">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg">{space.title}</h2>
            <p className="font-semibold">${space.price_per_hour}/hour</p>
          </div>
          <p className="text-gray-500">{space.location}</p>
          <p className="text-gray-500">
            {space.is_available ? 'Available' : 'Not Available'}
          </p>
        </div>
      </div>
    </Link>
  );
} 