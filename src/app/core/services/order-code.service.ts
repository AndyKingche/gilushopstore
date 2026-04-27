import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderCodeService {

  /**
   * Generates a unique order code in the format: GILU-YYMMDD-HHmm-RANDOM
   * Where:
   * - GILU: Fixed prefix
   * - YYMMDD: Date in YYMMDD format
   * - HHmm: Time in HHmm format
   * - RANDOM: 6-character alphanumeric uppercase code
   */
  generateOrderCode(): string {
    const now = new Date();

    // Date part: YYMMDD
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const datePart = `${year}${month}${day}`;

    // Time part: HHmm
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timePart = `${hours}${minutes}`;

    // Random part: 6-character alphanumeric uppercase
    const randomPart = this.generateRandomCode(6);

    return `GILU-${datePart}-${timePart}-${randomPart}`;
  }

  /**
   * Generates a random alphanumeric string of specified length using uppercase letters and numbers.
   */
  private generateRandomCode(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}