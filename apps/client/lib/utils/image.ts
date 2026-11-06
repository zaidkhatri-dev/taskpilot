const COVER_IMAGES = [
  "/covers/cover-01.webp",
  "/covers/cover-02.webp",
  "/covers/cover-03.webp",
  "/covers/cover-04.webp",
  "/covers/cover-05.webp",
  "/covers/cover-06.webp",
  "/covers/cover-07.webp",
];

function hashString(value: string): number {
  let hash = 0;

  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }

  return Math.abs(hash);
}

export function getBoardCoverImage(boardId: string): string {
  const index = hashString(boardId) % COVER_IMAGES.length;

  return COVER_IMAGES[index];
}
