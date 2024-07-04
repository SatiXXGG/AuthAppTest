import { useEffect, useState } from "react";

export default function useImage({ imageData }: { imageData: string }) {
  const [image, setImage] = useState<string | ArrayBuffer | null>();
  useEffect(() => {
    console.log(imageData);

    //reads image data from base 64
    setImage(atob(imageData));
  }, [imageData]);

  return image;
}
