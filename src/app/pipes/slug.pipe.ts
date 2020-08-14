import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "slug" })
export class SlugPipe implements PipeTransform {
  transform(str: string): string {
    str = str.replace(/[ÀÁÂÃÄÅ]/g, "A").replace(/[àáâãäå]/g, "a");
    str = str.replace(/[ÈÉÊË]/g, "E").replace(/[èéêë]/g, "a");
    str = str.replace(/[Î]/g, "I").replace(/[ìíîï]/g, "a");
    str = str.replace(/[Ô]/g, "O").replace(/[òóôö]/g, "a");
    str = str.replace(/[Ù]/g, "U").replace(/[àáâãäå]/g, "a");
    str = str.replace(/[Ç]/g, "C").replace(/[àáâãäå]/g, "a");
    return str
      .toString()
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start of text
      .replace(/-+$/, "");
  }
}
