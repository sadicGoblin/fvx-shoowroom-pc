import { Injectable } from '@angular/core';
import { Screen, ContentButton } from '../models/screen.model';

// Declarar el API de Electron
declare const electronAPI: any;

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly SCREENS_KEY = 'showroom_screens';
  private readonly CONTENT_KEY = 'showroom_content';
  
  // Detectar si estamos en Electron
  private isElectron(): boolean {
    return typeof window !== 'undefined' && typeof (window as any).electronAPI !== 'undefined';
  }

  async saveScreens(screens: Screen[]): Promise<void> {
    try {
      if (this.isElectron()) {
        // Usar electron-store para persistencia real
        await electronAPI.store.set(this.SCREENS_KEY, screens);
        console.log('✅ Pantallas guardadas en electron-store:', screens.length);
      } else {
        // Fallback a localStorage en navegador
        localStorage.setItem(this.SCREENS_KEY, JSON.stringify(screens));
        console.log('✅ Pantallas guardadas en localStorage:', screens.length);
      }
    } catch (error) {
      console.error('❌ Error guardando pantallas:', error);
    }
  }

  async loadScreens(): Promise<Screen[]> {
    try {
      let data;
      
      if (this.isElectron()) {
        // Cargar desde electron-store
        data = await electronAPI.store.get(this.SCREENS_KEY);
        if (data) {
          console.log('✅ Pantallas cargadas desde electron-store:', data.length);
        }
      } else {
        // Fallback a localStorage
        const storedData = localStorage.getItem(this.SCREENS_KEY);
        if (storedData) {
          data = JSON.parse(storedData);
          console.log('✅ Pantallas cargadas desde localStorage:', data.length);
        }
      }
      
      if (data) {
        return data.map((s: any) => ({
          ...s,
          lastUpdate: new Date(s.lastUpdate),
          isSelected: false // Reset selection on load
        }));
      }
    } catch (error) {
      console.error('❌ Error cargando pantallas:', error);
    }
    
    // Default screens
    return [
      {
        id: '1',
        name: 'Pantalla Principal',
        ip: '172.16.70.247',
        isSelected: false,
        lastUpdate: new Date(),
        isOnline: false,
        lastContent: null
      }
    ];
  }

  async saveContent(content: ContentButton[]): Promise<void> {
    try {
      if (this.isElectron()) {
        // Usar electron-store
        await electronAPI.store.set(this.CONTENT_KEY, content);
        console.log('✅ Contenido guardado en electron-store:', content.length);
      } else {
        // Fallback a localStorage
        localStorage.setItem(this.CONTENT_KEY, JSON.stringify(content));
        console.log('✅ Contenido guardado en localStorage:', content.length);
      }
    } catch (error) {
      console.error('❌ Error guardando contenido:', error);
    }
  }

  async loadContent(): Promise<ContentButton[]> {
    try {
      let data;
      
      if (this.isElectron()) {
        // Cargar desde electron-store
        data = await electronAPI.store.get(this.CONTENT_KEY);
        if (data) {
          console.log('✅ Contenido cargado desde electron-store:', data.length);
          return data;
        }
      } else {
        // Fallback a localStorage
        const storedData = localStorage.getItem(this.CONTENT_KEY);
        if (storedData) {
          data = JSON.parse(storedData);
          console.log('✅ Contenido cargado desde localStorage:', data.length);
          return data;
        }
      }
    } catch (error) {
      console.error('❌ Error cargando contenido:', error);
    }
    
    // Default content
    return [
      { name: 'Salsas', command: 'Rojo', color: '#f44336', textColor: '#ffffff' },
      { name: 'Cervezas', command: 'Amarillo', color: '#ffeb3b', textColor: '#000000' },
      { name: 'Cócteles', command: 'Azul', color: '#007ACC', textColor: '#ffffff' },
      { name: 'Bebidas', command: 'Verde', color: '#4caf50', textColor: '#ffffff' },
      { name: 'Para Compartir', command: 'Blanco', color: '#ffffff', textColor: '#000000' },
      { name: 'Postres', command: 'Negro', color: '#000000', textColor: '#ffffff' }
    ];
  }
}
