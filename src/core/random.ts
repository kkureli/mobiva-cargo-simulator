import uuid from 'react-native-uuid';
const uuidv4 = uuid.v4;
export { uuidv4 };

export function randomAlnum(lenMin = 8, lenMax = 16): string {
  const CHARS =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = lenMin + Math.floor(Math.random() * (lenMax - lenMin + 1));
  let result = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * CHARS.length);
    result += CHARS[index];
  }

  return result;
}

export function pick<T>(arr: readonly T[]): T {
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}
