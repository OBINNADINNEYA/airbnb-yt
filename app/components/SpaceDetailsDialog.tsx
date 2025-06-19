"use client";

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Space, db } from '../lib/db';
import { useCountries } from '../lib/getCountries';
import { CaegoryShowcase } from './CategoryShowcase';
import { SpaceMap } from './SpaceMap';
import { SelectCalender } from './SelectCalender';
import { BookingSubmitButton } from './SubmitButtons';
import { createBooking } from '../actions';

interface SpaceDetailsDialogProps {
  space: Space;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SpaceDetailsDialog({ space, open, onOpenChange }: SpaceDetailsDialogProps) {
  const [user, setUser] = useState<any>(null);
  const [spaceDetails, setSpaceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const supabase = createClientComponentClient();
  const { getCountryByValue } = useCountries();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, [supabase.auth]);

  useEffect(() => {
    if (open && space.id) {
      setLoading(true);
      db.getSpace(space.id).then((data) => {
        setSpaceDetails(data);
        setLoading(false);
      });
    }
  }, [open, space.id]);

  const country = getCountryByValue(spaceDetails?.location as string);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">{spaceDetails?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-[400px] w-full">
            <Image
              alt="Image of Space"
              src={spaceDetails?.images?.[0] || "/placeholder.jpg"}
              fill
              className="rounded-lg object-cover"
            />
          </div>

          <div className="flex gap-8">
            {/* Left Column - Space Details */}
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-xl font-medium">
                  {country?.flag} {country?.label} / {country?.region}
                </h3>
                <p className="text-lg font-semibold text-green-500 mt-2">
                  ${spaceDetails?.price_per_hour}/hour
                </p>
                <p className={spaceDetails?.is_available ? "text-green-500" : "text-red-500"}>
                  {spaceDetails?.is_available ? 'Available' : 'Not Available'}
                </p>
              </div>

              {/* Host Info */}
              <div className="flex items-center">
                <img
                  src={
                    spaceDetails?.user?.profileImage ??
                    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                  }
                  alt="User Profile"
                  className="w-11 h-11 rounded-full"
                />
                <div className="flex flex-col ml-4">
                  <h3 className="font-medium">Hosted by {spaceDetails?.user?.firstName}</h3>
                  <p className="text-sm text-muted-foreground">Host since 2015</p>
                </div>
              </div>

              <Separator />

              {/* Category */}
              <CaegoryShowcase categoryName={spaceDetails?.categoryName as string} />

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-muted-foreground">{spaceDetails?.description}</p>
              </div>

              <Separator />

              {/* Map */}
              <div>
                <h4 className="font-medium mb-2">Location</h4>
                <SpaceMap locationValue={country?.value as string} />
              </div>
            </div>

            {/* Right Column - Booking Form */}
            <div className="w-80">
              <div className="border rounded-lg p-6 sticky top-0">
                <h4 className="font-medium mb-4">Book this space</h4>
                
                <form action={createBooking}>
                  <input type="hidden" name="spaceId" value={space.id} />
                  <input type="hidden" name="userId" value={user?.id} />

                  <SelectCalender 
                    booking={spaceDetails?.bookings?.map((b: any) => ({
                      startDate: new Date(b.start_time),
                      endDate: new Date(b.end_time)
                    }))} 
                  />

                  {user?.id ? (
                    <BookingSubmitButton />
                  ) : (
                    <Button className="w-full mt-4" asChild>
                      <Link href="/auth">Book this Space</Link>
                    </Button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}