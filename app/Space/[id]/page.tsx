/* eslint-disable @next/next/no-img-element */

import { createBooking } from "@/app/actions";
import { CaegoryShowcase } from "@/app/components/CategoryShowcase";
import { SpaceMap } from "@/app/components/SpaceMap";
import { SelectCalender } from "@/app/components/SelectCalender";
import { BookingSubmitButton } from "@/app/components/SubmitButtons";
import { db } from "@/app/lib/db";
import { useCountries } from "@/app/lib/getCountries";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useEffect, useState } from 'react';

import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

async function getData(spaceId: string) {
  noStore();
  const data = await db.getSpace(spaceId);
  return data;
}

export default function SpaceRoute({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<any>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
    // eslint-disable-next-line
  }, []);

  const [data, setData] = useState<any>(null);
  useEffect(() => {
    async function fetchData() {
      const d = await getData(params.id);
      setData(d);
    }
    fetchData();
    // eslint-disable-next-line
  }, [params.id]);

  const { getCountryByValue } = useCountries();
  const country = getCountryByValue(data?.location as string);

  return (
    <div className="w-[75%] mx-auto mt-10 mb-12">
      <h1 className="font-medium text-2xl mb-5">{data?.title}</h1>
      <div className="relative h-[550px]">
        <Image
          alt="Image of Space"
          src={data?.images?.[0] || "/placeholder.jpg"}
          fill
          className="rounded-lg h-full object-cover w-full"
        />
      </div>

      <div className="flex justify-between gap-x-24 mt-8">
        <div className="w-2/3">
          <h3 className="text-xl font-medium">
            {country?.flag} {country?.label} / {country?.region}
          </h3>

          <div className="flex items-center mt-6">
            <img
              src={
                data?.user?.profileImage ??
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="User Profile"
              className="w-11 h-11 rounded-full"
            />
            <div className="flex flex-col ml-4">
              <h3 className="font-medium">Hosted by {data?.user?.firstName}</h3>
              <p className="text-sm text-muted-foreground">Host since 2015</p>
            </div>
          </div>

          <Separator className="my-7" />

          <CaegoryShowcase categoryName={data?.categoryName as string} />

          <Separator className="my-7" />

          <p className="text-muted-foreground">{data?.description}</p>

          <Separator className="my-7" />

          <SpaceMap locationValue={country?.value as string} />
        </div>

        <form action={createBooking}>
          <input type="hidden" name="spaceId" value={params.id} />
          <input type="hidden" name="userId" value={user?.id} />

          <SelectCalender booking={data?.bookings?.map((b: any) => ({
            startDate: new Date(b.start_time),
            endDate: new Date(b.end_time)
          }))} />

          {user?.id ? (
            <BookingSubmitButton />
          ) : (
            <Button className="w-full" asChild>
              <Link href="/auth">Book this Space</Link>
            </Button>
          )}
        </form>
      </div>
    </div>
  );
} 