import { safeFileName } from "./safe-file-name";

export function buildDocumentPath(params: {
  houseId: string;
  systemId?: string | null;
  itemId?: string | null;
  fileName: string;
}) {
  const timestamp = Date.now();
  const cleaned = safeFileName(params.fileName);

  if (params.systemId) {
    return `houses/${params.houseId}/systems/${params.systemId}/${timestamp}-${cleaned}`;
  }

  if (params.itemId) {
    return `houses/${params.houseId}/items/${params.itemId}/${timestamp}-${cleaned}`;
  }

  return `houses/${params.houseId}/general/${timestamp}-${cleaned}`;
}
