export class MyDate extends Date {

  toStringDate(): string {
    return this.toString().split("G")[0];
  }
}
