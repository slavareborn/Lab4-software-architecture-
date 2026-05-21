export class DomainError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'DomainError';
  }
}