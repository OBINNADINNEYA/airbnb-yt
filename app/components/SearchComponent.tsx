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
import { useCanadianCities } from "../lib/getCanadianCities";
import { SpaceMap } from "./SpaceMap";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { CreationSubmit } from "./SubmitButtons";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function SearchModalComponent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [locationValue, setLocationValue] = useState("");
  const [spaceType, setSpaceType] = useState("");
  const [equipment, setEquipment] = useState<string[]>([]);
  const [roomType, setRoomType] = useState("");
  const [receptionArea, setReceptionArea] = useState("");
  const [linenService, setLinenService] = useState("");
  const { getAllCities } = useCanadianCities();

  function handleEquipmentChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setEquipment((prev) =>
      e.target.checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  }

  function handleShowResults(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (locationValue) params.set("city", locationValue);
    if (spaceType) params.set("space_type", spaceType);
    if (equipment.length === 1) params.set("category", equipment[0]);
    if (roomType) params.set("room_type", roomType);
    if (receptionArea) params.set("reception_area", receptionArea);
    if (linenService) params.set("linen_service", linenService);
    router.push("/?" + params.toString());
    setOpen(false);
  }

  const SubmitButtonLocal = () =>
    step === 1 ? (
      <Button onClick={() => setStep(step + 1)} type="button">
        Next
      </Button>
    ) : (
      <Button type="submit">Show Results</Button>
    );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="rounded-full py-2 px-5 border flex items-center cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <div className="flex h-full divide-x font-medium">
            <p className="px-4 text-green-500">{locationValue || "Anywhere"}</p>
            <p className="px-4 text-green-500">{spaceType || "Any Treatment"}</p>
          </div>
          <Search className="bg-primary text-white p-1 h-8 w-8 rounded-full" />
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form className="gap-4 flex flex-col" onSubmit={handleShowResults}>
          <input type="hidden" name="city" value={locationValue} />
          <input type="hidden" name="type" value={spaceType} />

          {step === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle>Select a City</DialogTitle>
                <DialogDescription>
                  Pick a city in Canada to start your search.
                </DialogDescription>
              </DialogHeader>

              <Select
                required
                onValueChange={(value) => setLocationValue(value)}
                value={locationValue}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cities</SelectLabel>
                    {getAllCities().map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
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
                    <Select value={spaceType} onValueChange={setSpaceType}>
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
                            checked={equipment.includes(item.name)}
                            onChange={handleEquipmentChange}
                          />
                          {item.label}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 3. Room Type */}
                  <div className="flex flex-col gap-y-2">
                    <h3 className="font-medium underline">Room Preference</h3>
                    <Select value={roomType} onValueChange={setRoomType}>
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
                    <Select value={receptionArea} onValueChange={setReceptionArea}>
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
                    <Select value={linenService} onValueChange={setLinenService}>
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
