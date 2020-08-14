import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "splitStr" })
export class SplitPipe implements PipeTransform {
  transform(value: string, separator: string, position: number): string {
    let splits = value.split(separator);
    if (splits.length > 1) {
      return splits[position];
    } else {
      return "";
    }
  }
}
