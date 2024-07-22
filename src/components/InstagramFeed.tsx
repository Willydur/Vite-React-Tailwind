import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface ArrowProps {
  className?: string;
  onClick?: () => void;
}

const NextArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
  return (
    <div
      className={`${className} p-12 text:2xl z-20 position:absolute top-1/2 -translate-y-1/2 right-0`}
      onClick={onClick}
    ></div>
  );
};

const PrevArrow: React.FC<ArrowProps> = ({ className, onClick }) => {
  return (
    <div
      className={`${className} p-9 rounded-full z-20 position:absolute top-1/2 -translate-y-1/2 left-0`}
      onClick={onClick}
    ></div>
  );
};

interface MediaItem {
  id: string;
  caption?: string;
  media_type: string;
  media_url: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
  children?: {
    data: MediaItem[];
  };
}

const InstagramFeed: React.FC = () => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const accessToken =
    "IGQWROVHRiMkRmVUJCaXFDQnJkOVc0U1ZAJenA5dVFLQlI2eURZAZADczWnkxdVROei1wQVpjSzkxTmMySFFLeVF6eUVFSmF3c2gtenFqZAkhDczdWTGxkLS1fZAlVsMi0xUEh6NGkwbmtvWXY1OXpnSzk0aUd4UVlBVzQZD";

  useEffect(() => {
    const fetchInstagramMedia = async () => {
      try {
        const response = await fetch(
          `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,children{media_url,media_type}&access_token=${accessToken}`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        const validMedia = data.data.filter(
          (item: MediaItem) =>
            item.media_url &&
            (item.media_type === "IMAGE" ||
              item.media_type === "CAROUSEL_ALBUM" ||
              item.media_type === "VIDEO")
        );

        setMedia(validMedia);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramMedia();
  }, [accessToken]);

  const handleMediaError = (id: string) => {
    setMedia((prevMedia) => prevMedia.filter((item) => item.id !== id));
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    dotsClass: "slick-dots slick-thumb",
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-screen font-semibold text-2xl">
        Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">Error: {error.message}</div>
    );
  }

  return (
    <div className="container justify-center h-screen mx-auto">
      <nav>
        <header className="pb-40">
          <h1 className="sm:text-1xl md:text-2xl lg:text-2xl font-bold mb-4 pt-10 inline-block bg-gradient-to-r from-purple-700 via-pink-600 to-yellow-500 text-transparent bg-clip-text">
            @ShotbyAdeulaneuh
          </h1>
        </header>
      </nav>
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-y-72 gap-x-5">
        {media.map((item) => (
          <div
            key={item.id}
            className="w-4/6 rounded overflow-clip shadow-lg justify-center items-center mx-auto my-4"
          >
            {item.media_type === "IMAGE" ? (
              <img
                src={item.media_url}
                alt={item.caption || "Instagram Image"}
                className="w-4/5"
                onError={() => handleMediaError(item.id)}
              />
            ) : item.media_type === "VIDEO" ? (
              <video
                controls
                className="w-full"
                onError={() => handleMediaError(item.id)}
              >
                <source src={item.media_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : item.media_type === "CAROUSEL_ALBUM" ? (
              <Slider {...sliderSettings}>
                {item.children?.data.map((child) => (
                  <div key={child.id} className="w-full">
                    {child.media_type === "IMAGE" ? (
                      <img
                        src={child.media_url}
                        alt={child.caption || "Instagram Image"}
                        className="w-full"
                        onError={() => handleMediaError(child.id)}
                      />
                    ) : child.media_type === "VIDEO" ? (
                      <video
                        controls
                        className="w-full"
                        onError={() => handleMediaError(child.id)}
                      >
                        <source src={child.media_url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : null}
                  </div>
                ))}
              </Slider>
            ) : null}
            <div className="px-6 py-4"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstagramFeed;
