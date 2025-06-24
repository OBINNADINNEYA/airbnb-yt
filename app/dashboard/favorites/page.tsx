'use client';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { redirect } from "next/navigation";
import { NoItems } from "../../components/NoItem";
import { ListingCard } from "../../components/ListingCard";
import { useEffect, useState } from 'react';

export default function FavoritesRoute() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        redirect("/");
      } else {
        setUser(data.user);
        fetchFavorites(data.user.id);
      }
    });
    // eslint-disable-next-line
  }, []);

  async function fetchFavorites(userId: string) {
    // Fetch favorite spaces for the user
    const { data: favorites } = await supabase
      .from('favorites')
      .select('*, space:spaces(*)')
      .eq('user_id', userId);
    setData(favorites || []);
  }

  return (
    <section className="px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Favorites</h2>
      {data.length === 0 ? (
        <NoItems
          title="Hey you don't have any favorites"
          description="Please add favorites to see them right here..."
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item: any) => (
            <ListingCard
              key={item.space?.id}
              description={item.space?.description}
              location={item.space?.location}
              pathName="/favorites"
              spaceId={item.space?.id}
              imagePath={item.space?.images?.[0] || ''}
              price={item.space?.price_per_hour}
              userId={user?.id}
              favoriteId={item.id}
              isInFavoriteList={true}
            />
          ))}
        </div>
      )}
    </section>
  );
}
