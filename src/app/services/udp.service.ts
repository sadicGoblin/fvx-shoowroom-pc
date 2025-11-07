import { Injectable } from '@angular/core';

// Declaración de tipo para la API de Electron
declare global {
  interface Window {
    electronAPI?: {
      udp: {
        send: (ip: string, port: number, message: string) => Promise<{ success: boolean; error?: string }>;
      };
      store: any;
      getScreenOrientation: () => string;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class UdpService {
  /**
   * Envía un mensaje UDP a la IP y puerto especificado.
   * Usa la API nativa de Electron (dgram de Node.js) para envío real.
   */
  async sendMessage(ip: string, port: number, message: string): Promise<void> {
    try {
      // Verificar si estamos en entorno Electron
      if (window.electronAPI?.udp) {
        console.log(`📡 Enviando UDP a ${ip}:${port} - "${message}"`);
        
        const result = await window.electronAPI.udp.send(ip, port, message);
        
        if (result.success) {
          console.log('✅ Mensaje UDP enviado exitosamente');
        } else {
          throw new Error(result.error || 'Error desconocido al enviar UDP');
        }
      } else {
        // Fallback para desarrollo en navegador
        console.warn('⚠️ No se detectó Electron API, simulando envío UDP');
        console.log(`📡 [SIMULADO] Enviando UDP a ${ip}:${port} - "${message}"`);
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('✅ [SIMULADO] Mensaje enviado');
      }
    } catch (error) {
      console.error('❌ Error enviando mensaje UDP:', error);
      throw error;
    }
  }
}
