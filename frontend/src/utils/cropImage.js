// Helper: create cropped image file
// Converts selected image + crop area into a new image Blob


export default function getCroppedImg(imageSrc, cropPixels) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = cropPixels.width;
      canvas.height = cropPixels.height;

      ctx.drawImage(
        image,
        cropPixels.x,
        cropPixels.y,
        cropPixels.width,
        cropPixels.height,
        0,
        0,
        cropPixels.width,
        cropPixels.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Crop failed"));
          return;
        }

        resolve(blob);
      }, "image/jpeg");
    };

    image.onerror = reject;
  });
}