import { Card, CardContent } from "../ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

export const CardsView = ({
  index,
  image,
  name,
  artist,
}: {
  index: number;
  image: string;
  name: string;
  artist: string;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Card key={index} className="hover:scale-90 h-24">
          <CardContent className="flex gap-2 items-center justify-center p-1 shadow-green-300 shadow-md rounded-lg h-24 w-24 cursor-pointer">
            {image ? (
              <img src={image} alt={name} className="rounded-lg" />
            ) : (
              <div className="flex items-center justify-center w-20 h-20 rounded-lg bg-gray-100">
                <p className="text-xs font-semibold text-gray-500">No Image</p>
              </div>
            )}
          </CardContent>
        </Card>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-700">{name}</p>
          <p className="text-xs font-semibold text-gray-500">{artist}</p>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
