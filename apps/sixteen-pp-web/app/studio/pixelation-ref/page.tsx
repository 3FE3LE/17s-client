import { PixelationRefStudio } from '@/components/pixelation-ref/PixelationRefStudio';

export const metadata = {
  title: 'Pixelation Reference | Sixteen Pixel Perfect',
  description:
    'Convert any image into a pixel-art reference: logical grid, palette, dithering, exports.',
};

export default function PixelationRefPage() {
  return <PixelationRefStudio />;
}
