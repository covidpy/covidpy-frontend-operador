export class PagedList<T> {
  constructor(
    public list: T[],
    public total: number,
  ) {}
}
