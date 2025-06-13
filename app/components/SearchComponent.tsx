"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Search } from "lucide-react";
import { useState } from "react";
import { useCountries } from "../lib/getCountries";
import { SpaceMap } from "./SpaceMap";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CreationSubmit } from "./SubmitButtons";
import Image from "next/image";

export function SearchModalComponent() {
  const [step, setStep] = useState(1);
  const [locationValue, setLocationValue] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const { getAllCountries } = useCountries();

  const SubmitButtonLocal = () =>
    step === 1 ? (
      <Button onClick={() => setStep(step + 1)} type="button">
        Next
      </Button>
    ) : (
      <CreationSubmit />
    );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="rounded-full py-2 px-5 border flex items-center cursor-pointer">
          <div className="flex h-full divide-x font-medium">
            <p className="px-4 text-green-500">{locationValue || "Anywhere"}</p>
            <p className="px-4 text-green-500">{spaceType || "Any Treatment"}</p>
          </div>
          <Search className="bg-primary text-white p-1 h-8 w-8 rounded-full" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form className="gap-4 flex flex-col">
          <input type="hidden" name="country" value={locationValue} />
          <input type="hidden" name="type" value={spaceType} />

          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Select a Location</DialogTitle>
                <DialogDescription>
                  Pick a country or region to start your search.
                </DialogDescription>
              </DialogHeader>

              <Select
                required
                onValueChange={(value) => setLocationValue(value)}
                value={locationValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a Country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Countries</SelectLabel>
                    {getAllCountries().map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.flag} {item.label} / {item.region}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <SpaceMap locationValue={locationValue} />
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Refine your search</DialogTitle>
                <DialogDescription>
                  Tell us what you need so we can match you to the right space.
                </DialogDescription>
              </DialogHeader>

              <Card>
                <CardHeader className="flex flex-col gap-y-6">
                  {/* 1. Treatment Type */}
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium underline">Type of Treatment</h3>
                    <Select value={spaceType} onValueChange={(val) => setSpaceType(val)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select treatment type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual Therapy / Massage</SelectItem>
                        <SelectItem value="rehab">Active Rehab / Movement</SelectItem>
                        <SelectItem value="acupuncture">Acupuncture / Needling</SelectItem>
                        <SelectItem value="strength">Strength Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 2. Equipment Needed */}
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium underline">Required Equipment</h3>
                    <p className="text-muted-foreground text-sm">
                      Select all that apply:
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { name: "hydraulic_table", label: "Hydraulic Table" },
                        { name: "stretch_tools", label: "Stretching Tools" },
                        { name: "dumbbells", label: "Dumbbells" },
                        { name: "barbells", label: "Barbells" },
                        { name: "squat_rack", label: "Squat Rack" },
                        { name: "sharps_container", label: "Sharps Container" },
                        { name: "laundry", label: "On-site Laundry" },
                      ].map((item) => (
                        <label key={item.name} className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            name="equipment"
                            value={item.name}
                            className="accent-primary"
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 3. Room Type */}
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium underline">Room Preference</h3>
                    <Select name="room_type">
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private Room</SelectItem>
                        <SelectItem value="shared">Shared Gym Space</SelectItem>
                        <SelectItem value="either">Doesn't Matter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 4. Reception Area */}
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium underline">Reception Area</h3>
                    <Select name="reception_area">
                      <SelectTrigger>
                        <SelectValue placeholder="Need a waiting area?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 5. Linen Service */}
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium underline">Linen Service</h3>
                    <Select name="linen_service">
                      <SelectTrigger>
                        <SelectValue placeholder="Need linen or towels?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes – Provided</SelectItem>
                        <SelectItem value="no">No – I'll bring mine</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
              </Card>
            </>
          )}

          <DialogFooter>
            <SubmitButtonLocal />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
