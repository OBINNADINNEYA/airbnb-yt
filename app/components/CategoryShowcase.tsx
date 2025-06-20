import Image from "next/image";
import { categoryItems } from "../lib/categoryItems";

export function CaegoryShowcase({
  categoryName,
  iconUrl,
}: {
  categoryName: string;
  iconUrl?: string;
}) {
  const category = categoryItems.find((item) => item.name === categoryName);

  const displayIcon = iconUrl || category?.imageUrl;
  const displayTitle = category?.title || categoryName;
  const displayDescription = category?.description;

  return (
    <div className="flex items-center">
      {displayIcon ? (
        <Image
          src={displayIcon}
          alt="Category image"
          width={44}
          height={44}
        />
      ) : (
        <div className="w-[44px] h-[44px] bg-gray-300 rounded-md"></div> // Placeholder
      )}

      <div className="flex flex-col ml-4">
        <h3 className="font-medium">{displayTitle}</h3>
        {displayDescription && (
          <p className="text-sm text-muted-foreground">{displayDescription}</p>
        )}
      </div>
    </div>
  );
}
