//our root app component
import { Component, NgModule, Pipe, PipeTransform } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

import { DomSanitizer } from "@angular/platform-browser";

@Pipe({ name: "safeHtml" })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    if (value != null && typeof value !== "undefined" && value !== "null") {
      return this.sanitized.bypassSecurityTrustHtml(value);
    } else {
      return "-";
    }
  }
}
