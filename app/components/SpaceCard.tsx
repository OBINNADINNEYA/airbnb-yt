import Image from 'next/image';
import Link from 'next/link';
import { Space } from '../lib/db';

interface SpaceCardProps {
  space: Space;
}

export default function SpaceCard({ space }: SpaceCardProps) {
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
        <div className="mt-3 text-sm">
          <div className="flex justify-between items-center">
            <h2 className="font-medium text-sm text-green-500">{space.title}</h2>
            <p className="font-medium text-sm text-white">${space.price_per_hour}/hour</p>
          </div>
          <p className="text-white">{space.location}</p>
          <p className={space.is_available ? "text-green-500" : "text-red-500"}>
            {space.is_available ? 'Available' : 'Not Available'}
          </p>
        </div>
      </div>
    </Link>
  );
} 