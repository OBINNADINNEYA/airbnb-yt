import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/supabase-js';
import { redirect } from "next/navigation";
import { NoItems } from "../components/NoItem";
import { ListingCard } from "../components/ListingCard";
import { useEffect, useState } from 'react';

export default function MySpaces() {
  const [user, setUser] = useState<User | null>(null);
  const [data, setData] = useState<any[]>([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        redirect("/");
      } else {
        setUser(data.user);
        fetchSpaces(data.user.id);
      }
    });
    // eslint-disable-next-line
  }, []);

  async function fetchSpaces(userId: string) {
    // Fetch from Supabase 'spaces' table where user_id = userId
    const { data: spaces } = await supabase
      .from('spaces')
      .select('*')
      .eq('user_id', userId);
    setData(spaces || []);
  }

  return (
    <section className="container mx-auto px-5 lg:px-10 mt-10">
      <h2 className="text-3xl font-semibold tracking-tight">Your Spaces</h2>
      {data.length === 0 ? (
        <NoItems
          description="Please list a space so that you can see it right here"
          title="You don't have any Spaces listed"
        />
      ) : (
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 grid-cols-1 gap-8 mt-8">
          {data.map((item: any) => (
            <ListingCard
              key={item.id}
              imagePath={item.images?.[0] || ''}
              spaceId={item.id}
              price={item.price_per_hour}
              description={item.description}
              location={item.location}
              userId={user?.id}
              pathName="/my-spaces"
              favoriteId={''}
              isInFavoriteList={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}
