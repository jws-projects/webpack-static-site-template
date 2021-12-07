/**
 * ブラウザが webp をサポートしているかどうか
 *
 * @returns webp をサポートしているなら true そうでないなら false
 */
export const supportsWebp = async () => {
  if (!self.createImageBitmap) return false;
  // webp の仮データ
  const webpData =
    'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then((r) => r.blob());
  return createImageBitmap(blob).then(
    () => true,
    () => false
  );
};

/**
 * webp 対応していれば target に is-webp、対応していなければ is-no-webp クラスを追加する
 *
 * @param {string} target (default: body)
 */
export const addWebpDetectionClass = (target = 'body') => {
  if (supportsWebp()) {
    console.log('true');
    $(target).addClass('is-webp');
  } else {
    console.log('false');
    $(target).addClass('is-no-webp');
  }
};
