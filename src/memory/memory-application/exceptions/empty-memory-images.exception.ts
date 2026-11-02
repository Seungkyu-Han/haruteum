export class EmptyMemoryImagesException extends Error {
  constructor(message = '추억에 첨부할 이미지가 최소 1장 이상 필요합니다.') {
    super(message);
  }
}
