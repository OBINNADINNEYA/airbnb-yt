'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { ListingCard } from "../components/ListingCard";
import { NoItems } from "../components/NoItem";
import { redirect } from "next/navigation";
import { useEffect, useState } from 'react';

export default function BookingsRoute() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        redirect("/");
      } else {
        setUser(data.user);
        fetchBookings(data.user.id);
      }
    });
    // eslint-disable-next-line
  }, []);

  async function fetchBookings(userId: string) {
    // Fetch bookings for the user, joining with spaces
    const { data: bookings } = await supabase
      .from('bookings')
      .select('*, space:spaces(*)')
      .eq('user_id', userId);
    setData(bookings || []);
  }

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">
        Your Bookings
      </h2>
      {data.length === 0 ? (
        <NoItems
          title="Hey, you don't have any bookings"
          description="Please add a booking to see it right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item: any) => (
            <ListingCard
              key={item.space?.id}
              description={item.space?.description}
              location={item.space?.location}
              pathName="/bookings"
              spaceId={item.space?.id}
              imagePath={item.space?.images?.[0] || ''}
              price={item.space?.price_per_hour}
              userId={user?.id}
              favoriteId={''}
              isInFavoriteList={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
