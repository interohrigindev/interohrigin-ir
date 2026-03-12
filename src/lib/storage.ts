import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Firebase Storage에 이미지를 업로드하고 다운로드 URL을 반환합니다.
 */
export async function uploadImage(
  file: File,
  path: string,
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const fullPath = `${path}/${timestamp}_${safeName}`;
  const storageRef = ref(storage, fullPath);

  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
}

/**
 * Firebase Storage에서 이미지를 삭제합니다.
 * URL에서 경로를 추출하여 삭제합니다.
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // 이미 삭제된 경우 무시
  }
}
