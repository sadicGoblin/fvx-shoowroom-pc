import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UdpService {
  /**
   * Sends a UDP message to the specified IP and port.
   * Note: Browsers cannot send UDP directly. This is a simulation.
   * In production, you would need to:
   * 1. Create a backend service (Node.js, Python, etc.) that can send UDP
   * 2. Call that backend via HTTP from this Angular app
   * 3. The backend would then send the actual UDP message
   */
  async sendMessage(ip: string, port: number, message: string): Promise<void> {
    try {
      console.log(`📡 Sending UDP message to ${ip}:${port} - "${message}"`);
      
      // In production, replace this with an actual HTTP call to your backend:
      // return this.http.post('http://your-backend/api/udp/send', { ip, port, message }).toPromise();
      
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('✅ UDP message sent successfully');
    } catch (error) {
      console.error('❌ Error sending UDP message:', error);
      throw error;
    }
  }
}
