"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import sdk from "@/lib/spotify-sdk/ClientInstance";
import { Skeleton } from "@/components/ui/skeleton";
import { CardsView } from "@/components/common/CardsView";

export default function Dashboard() {
  const session = useSession() as any;
  const router = useRouter();
  const [name, setName] = useState("");
  const [topTracks, setTopTracks] = useState<any[]>([]);
  const [followedArtists, setFollowedArtists] = useState<any[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<any[]>([]);
  const [savedTracks, setSavedTracks] = useState<any[]>([]);
  const [savedShows, setSavedShows] = useState<any[]>([]);
  const [savedEpisodes, setSavedEpisodes] = useState<any[]>([]);
  const [savedAudioBooks, setSavedAudioBooks] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [show, setShow] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session && session.status === "unauthenticated") {
      router.push("/");
    }

    getTopTracks();
    getSavedTracks();
    setShow("getSavedTracks");

    if (session.data?.user?.name) {
      const firstName = session.data.user.name.split(" ")[0];
      let startTime: number;
      let animationFrameId: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;

        const index = Math.floor((elapsedTime / 650) * firstName.length);
        const truncatedName = firstName.slice(0, index) + "…";
        setName(truncatedName);

        if (index < firstName.length) {
          animationFrameId = requestAnimationFrame(animate);
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => cancelAnimationFrame(animationFrameId);
    }
  }, [session.data?.user?.name]);

  const getTopTracks = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.topItems("tracks", "long_term", 5);
      setTopTracks(res.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getFollowedArtists = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.followedArtists();
      setFollowedArtists(res.artists.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getSavedAlbums = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.albums.savedAlbums();
      setSavedAlbums(res.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getSavedTracks = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.tracks.savedTracks(50);
      setSavedTracks(res.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getSavedShows = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.shows.savedShows();
      setSavedShows(res.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getSavedEpisodes = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.episodes.savedEpisodes();
      setSavedEpisodes(res.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getSavedAudioBooks = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.audiobooks.savedAudiobooks();
      setSavedAudioBooks(res.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getPlaylists = async () => {
    try {
      setLoading(true);
      const res = await sdk.currentUser.playlists.playlists();
      setPlaylists(res.items);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getShowTitle = (show: string) => {
    switch (show) {
      case "getSavedAlbums":
        return "Saved Albums";
      case "getSavedTracks":
        return "Saved Tracks";
      case "getSavedShows":
        return "Saved Shows";
      case "getSavedEpisodes":
        return "Saved Episodes";
      case "getSavedAudioBooks":
        return "Saved AudioBooks";
      case "getPlaylists":
        return "Playlists";
      case "getFollowedArtists":
        return "Followed Artists";
      case "getTopTracks":
        return "Top Tracks";
      default:
        return "Saved Albums";
    }
  };

  const getShowView = (show: string) => {
    switch (show) {
      case "getSavedAlbums":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : savedAlbums.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Saved Albums
                </p>
              </div>
            ) : (
              savedAlbums.map((album, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={album.album.images[0]?.url}
                  name={album.album?.name}
                  artist={album.album?.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
                />
              ))
            )}
          </div>
        );
      case "getSavedTracks":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : savedTracks.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Saved Tracks
                </p>
              </div>
            ) : (
              savedTracks.map((track, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={track.track.album.images[0]?.url}
                  name={track.track?.name}
                  artist={track.track?.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
                />
              ))
            )}
          </div>
        );
      case "getSavedShows":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : savedShows.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Saved Shows
                </p>
              </div>
            ) : (
              savedShows.map((show, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={show.show.images[0]?.url}
                  name={show.show?.name}
                  artist={show.show?.publisher}
                />
              ))
            )}
          </div>
        );
      case "getSavedEpisodes":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : savedEpisodes.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Saved Episodes
                </p>
              </div>
            ) : (
              savedEpisodes.map((episode, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={episode.episode.images[0]?.url}
                  name={episode.episode?.name}
                  artist={episode.episode?.show?.publisher}
                />
              ))
            )}
          </div>
        );
      case "getSavedAudioBooks":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : savedAudioBooks.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Saved AudioBooks
                </p>
              </div>
            ) : (
              savedAudioBooks.map((audiobook, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={audiobook.audiobook.images[0]?.url}
                  name={audiobook.audiobook?.name}
                  artist={audiobook.audiobook?.authors.join(", ")}
                />
              ))
            )}
          </div>
        );
      case "getPlaylists":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : playlists.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Playlists
                </p>
              </div>
            ) : (
              playlists.map((playlist, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={playlist.images[0]?.url}
                  name={playlist.name}
                  artist={playlist.owner.display_name}
                />
              ))
            )}
          </div>
        );
      case "getFollowedArtists":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : followedArtists.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Followed Artists
                </p>
              </div>
            ) : (
              followedArtists.map((artist, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={artist.images[0]?.url}
                  name={artist.name}
                  artist={artist.genres.join(", ")}
                />
              ))
            )}
          </div>
        );
      case "getTopTracks":
        return (
          <div className="flex gap-4 flex-wrap h-[70vh] overflow-y-scroll">
            {loading ? (
              Array.from({ length: 50 }).map((_, index) => (
                <Skeleton key={index} className="w-24 h-24" />
              ))
            ) : topTracks.length === 0 ? (
              <div className="flex flex-col gap-4 w-full h-[70vh] items-center justify-center">
                <p className="text-xl font-semibold text-gray-700">
                  No Top Tracks
                </p>
              </div>
            ) : (
              topTracks.map((track, index) => (
                <CardsView
                  key={index}
                  index={index}
                  image={track.album.images[0]?.url}
                  name={track.name}
                  artist={track.artists
                    .map((artist: any) => artist.name)
                    .join(", ")}
                />
              ))
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const handleSelectChange = (value: string) => {
    setShow(value);
    switch (value) {
      case "getSavedAlbums":
        getSavedAlbums();
        break;
      case "getSavedTracks":
        getSavedTracks();
        break;
      case "getSavedShows":
        getSavedShows();
        break;
      case "getSavedEpisodes":
        getSavedEpisodes();
        break;
      case "getSavedAudioBooks":
        getSavedAudioBooks();
        break;
      case "getPlaylists":
        getPlaylists();
        break;
      case "getFollowedArtists":
        getFollowedArtists();
        break;
      case "getTopTracks":
        getTopTracks();
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex gap-20 py-10 px-16 h-[90vh]">
      <div className="flex flex-col gap-24 w-full">
        <div className="flex w-full items-center justify-between font-mono text-sm">
          <h1 className="text-2xl font-semibold text-gray-700">
            Welcome {name}
          </h1>
        </div>
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-xl font-semibold font-mono text-gray-700">
            Top Tracks ✨
          </h2>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            orientation="vertical"
            className="w-full max-w-xs"
            plugins={[
              Autoplay({
                delay: 2000,
                stopOnInteraction: true,
              }),
            ]}
          >
            <CarouselContent className="-mt-1 h-[330px]">
              {!topTracks.length &&
                Array.from({ length: 1 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="flex aspect-square h-[300px] w-[300px] items-center justify-center p-2 shadow-green-300 shadow-md rounded-lg"
                  />
                ))}

              {topTracks.map((track, index) => (
                <CarouselItem key={index} className="pt-1 md:basis-1/2">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex aspect-square items-center justify-center p-2 shadow-green-300 shadow-md rounded-lg">
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className="rounded-lg"
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Select onValueChange={(value) => handleSelectChange(value)}>
          <SelectTrigger className="w-[180px] shadow-green-400 shadow-md">
            <SelectValue placeholder="Saved Tracks" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="getSavedTracks">Saved Tracks</SelectItem>
            <SelectItem value="getSavedAlbums">Saved Albums</SelectItem>
            <SelectItem value="getSavedShows">Saved Shows</SelectItem>
            <SelectItem value="getSavedEpisodes">Saved Episodes</SelectItem>
            <SelectItem value="getSavedAudioBooks">Saved AudioBooks</SelectItem>
            <SelectItem value="getPlaylists">Playlists</SelectItem>
            <SelectItem value="getFollowedArtists">Followed Artists</SelectItem>
            <SelectItem value="getTopTracks">Top Tracks</SelectItem>
          </SelectContent>
        </Select>

        {show && (
          <div className="flex flex-col gap-4 w-full h-[70vh] overscroll-y-scroll">
            <h2 className="text-xl font-semibold font-mono text-gray-700">
              {getShowTitle(show)}
            </h2>
            {getShowView(show)}
          </div>
        )}
      </div>
    </div>
  );
}
