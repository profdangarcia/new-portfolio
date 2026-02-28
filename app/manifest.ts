import type { MetadataRoute } from "next";

const iconSizes = [57, 72, 76, 114, 120, 144, 152, 180] as const;

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dan Garcia | Front-end Developer",
    short_name: "DanGarcia",
    description:
      "Um desenvolvedor front-end que ama a tecnologia e novos desafios!",
    theme_color: "#333333",
    background_color: "#ffffff",
    display: "standalone",
    scope: "/",
    start_url: "/",
    icons: [
      ...iconSizes.map((size) => ({
        src: `/icons/apple-touch-icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
        type: "image/png" as const,
        purpose: "any" as const,
      })),
      {
        src: "/icons/apple-touch-icon-180x180.png",
        sizes: "180x180",
        type: "image/png" as const,
        purpose: "maskable" as const,
      },
    ],
  };
}
