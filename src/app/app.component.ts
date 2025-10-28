import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Screen, ContentButton } from './models/screen.model';
import { StorageService } from './services/storage.service';
import { UdpService } from './services/udp.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  screens: Screen[] = [];
  contentButtons: ContentButton[] = [];
  statusMessage = 'Bienvenido al Showroom';
  
  // Dialog states
  showAddScreenDialog = false;
  showEditScreenDialog = false;
  showDeleteScreenDialog = false;
  showDeleteMultipleDialog = false;
  showAddContentDialog = false;
  showEditContentDialog = false;
  showDeleteContentDialog = false;
  showReorderContentDialog = false;
  
  // Form data
  screenForm = {
    id: '',
    name: '',
    ip: '',
    selectedInitialContent: null as string | null
  };
  
  contentForm = {
    name: '',
    command: '',
    color: '#007ACC',
    textColor: '#ffffff'
  };
  
  availableColors = [
    '#f44336', '#ff9800', '#ffeb3b', '#4caf50',
    '#007ACC', '#3f51b5', '#9c27b0', '#e91e63',
    '#00bcd4', '#009688', '#795548', '#9e9e9e',
    '#000000', '#ffffff'
  ];
  
  currentScreen: Screen | null = null;
  currentContent: ContentButton | null = null;
  tempContentButtons: ContentButton[] = [];

  constructor(
    private storageService: StorageService,
    private udpService: UdpService
  ) {}

  async ngOnInit(): Promise<void> {
    this.screens = await this.storageService.loadScreens();
    this.contentButtons = await this.storageService.loadContent();
  }

  get selectedCount(): number {
    return this.screens.filter(s => s.isSelected).length;
  }

  get selectedScreens(): Screen[] {
    return this.screens.filter(s => s.isSelected);
  }

  get allSelected(): boolean {
    return this.screens.length > 0 && this.screens.every(s => s.isSelected);
  }

  get displayStatusMessage(): string {
    if (this.statusMessage.startsWith('✅') || 
        this.statusMessage.startsWith('⚠️') || 
        this.statusMessage.startsWith('🗑️')) {
      return this.statusMessage;
    }
    
    if (this.selectedCount > 0) {
      return `${this.selectedCount} pantalla${this.selectedCount > 1 ? 's' : ''} seleccionada${this.selectedCount > 1 ? 's' : ''}`;
    }
    
    return this.statusMessage;
  }

  toggleScreenSelection(screen: Screen): void {
    screen.isSelected = !screen.isSelected;
  }

  selectAllScreens(): void {
    const allSelected = this.allSelected;
    this.screens.forEach(screen => screen.isSelected = !allSelected);
  }

  async sendContentToSelected(button: ContentButton): Promise<void> {
    const selected = this.selectedScreens;
    
    if (selected.length === 0) {
      this.updateStatus('⚠️  Selecciona al menos una pantalla', true);
      return;
    }

    const screenNames = selected.length === 1 
      ? selected[0].name
      : `${selected.length} pantallas`;
    
    try {
      for (const screen of selected) {
        await this.udpService.sendMessage(screen.ip, 5000, button.command);
        screen.lastUpdate = new Date();
        screen.lastContent = button.command;
      }
      
      await this.storageService.saveScreens(this.screens);
      this.updateStatus(`✅  Enviado "${button.command}" a ${screenNames}`);
    } catch (error) {
      this.updateStatus('⚠️  Error enviando mensaje', true);
    }
  }

  updateStatus(message: string, isError = false): void {
    this.statusMessage = message;
    setTimeout(() => {
      this.statusMessage = 'Bienvenido al Showroom';
    }, 4000);
  }

  getContentColor(content: string): string {
    const colors: { [key: string]: string } = {
      'rojo': '#f44336',
      'amarillo': '#ffeb3b',
      'azul': '#007ACC',
      'verde': '#4caf50',
      'blanco': '#ffffff',
      'negro': '#000000'
    };
    return colors[content.toLowerCase()] || '#9e9e9e';
  }

  // Screen Dialog Methods
  openAddScreenDialog(): void {
    this.resetScreenForm();
    this.showAddScreenDialog = true;
  }

  openEditScreenDialog(screen: Screen): void {
    this.currentScreen = screen;
    this.screenForm = {
      id: screen.id,
      name: screen.name,
      ip: screen.ip,
      selectedInitialContent: null
    };
    this.showEditScreenDialog = true;
  }

  openDeleteScreenDialog(screen: Screen): void {
    this.currentScreen = screen;
    this.showDeleteScreenDialog = true;
  }

  openDeleteMultipleDialog(): void {
    this.showDeleteMultipleDialog = true;
  }

  closeAllDialogs(): void {
    this.showAddScreenDialog = false;
    this.showEditScreenDialog = false;
    this.showDeleteScreenDialog = false;
    this.showDeleteMultipleDialog = false;
    this.showAddContentDialog = false;
    this.showEditContentDialog = false;
    this.showDeleteContentDialog = false;
    this.showReorderContentDialog = false;
    this.currentScreen = null;
    this.currentContent = null;
  }

  resetScreenForm(): void {
    this.screenForm = {
      id: '',
      name: '',
      ip: '',
      selectedInitialContent: null
    };
  }

  validateIP(ip: string): boolean {
    const regex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
    return regex.test(ip);
  }

  isIPDuplicate(ip: string, excludeId?: string): boolean {
    return this.screens.some(s => s.ip === ip && s.id !== excludeId);
  }

  async addScreen(): Promise<void> {
    if (!this.screenForm.name.trim() || !this.screenForm.ip.trim()) {
      return;
    }

    if (!this.validateIP(this.screenForm.ip.trim())) {
      this.updateStatus('⚠️  IP inválida', true);
      return;
    }

    if (this.isIPDuplicate(this.screenForm.ip.trim())) {
      this.updateStatus('⚠️  Esta IP ya está registrada', true);
      return;
    }

    const newScreen: Screen = {
      id: this.screenForm.id.trim() || Date.now().toString(),
      name: this.screenForm.name.trim(),
      ip: this.screenForm.ip.trim(),
      isSelected: false,
      lastUpdate: new Date(),
      isOnline: false,
      lastContent: null
    };

    this.screens.push(newScreen);
    await this.storageService.saveScreens(this.screens);

    if (this.screenForm.selectedInitialContent) {
      // Buscar el botón de contenido por nombre para obtener su comando
      const selectedButton = this.contentButtons.find(btn => btn.name === this.screenForm.selectedInitialContent);
      if (selectedButton) {
        await this.udpService.sendMessage(newScreen.ip, 5000, selectedButton.command);
        newScreen.lastContent = selectedButton.command;
        await this.storageService.saveScreens(this.screens);
        this.updateStatus(`✅  Pantalla "${newScreen.name}" agregada y contenido "${selectedButton.command}" enviado`);
      } else {
        this.updateStatus(`✅  Pantalla "${newScreen.name}" agregada`);
      }
    } else {
      this.updateStatus(`✅  Pantalla "${newScreen.name}" agregada`);
    }

    this.closeAllDialogs();
  }

  async updateScreen(): Promise<void> {
    if (!this.currentScreen) return;

    if (!this.screenForm.name.trim() || !this.screenForm.ip.trim() || !this.screenForm.id.trim()) {
      this.updateStatus('⚠️  Completa todos los campos', true);
      return;
    }

    const existingScreen = this.screens.find(s => s.id === this.currentScreen!.id);
    if (existingScreen) {
      existingScreen.name = this.screenForm.name.trim();
      existingScreen.ip = this.screenForm.ip.trim();
      
      // Si cambió el ID, actualizar
      if (existingScreen.id !== this.screenForm.id.trim()) {
        existingScreen.id = this.screenForm.id.trim();
      }
      
      // Actualizar en la pantalla actual también para que el diálogo muestre bien
      this.currentScreen = {
        ...existingScreen,
        name: this.screenForm.name.trim(),
        ip: this.screenForm.ip.trim()
      };
      await this.storageService.saveScreens(this.screens);
      this.updateStatus(`✅  Pantalla "${this.screenForm.name.trim()}" actualizada`);
    }

    this.closeAllDialogs();
  }

  async deleteScreen(): Promise<void> {
    if (!this.currentScreen) return;

    const index = this.screens.indexOf(this.currentScreen);
    if (index !== -1) {
      const name = this.currentScreen.name;
      this.screens.splice(index, 1);
      await this.storageService.saveScreens(this.screens);
      this.updateStatus(`🗑️  Pantalla "${name}" eliminada`);
    }

    this.closeAllDialogs();
  }

  async deleteMultipleScreens(): Promise<void> {
    const selected = this.selectedScreens;
    this.screens = this.screens.filter(s => !s.isSelected);
    await this.storageService.saveScreens(this.screens);
    this.updateStatus(`🗑️  ${selected.length} pantalla${selected.length > 1 ? 's' : ''} eliminada${selected.length > 1 ? 's' : ''}`);
    this.closeAllDialogs();
  }

  // Content Dialog Methods
  openAddContentDialog(): void {
    this.resetContentForm();
    this.showAddContentDialog = true;
  }

  openEditContentDialog(content: ContentButton): void {
    this.currentContent = content;
    this.contentForm = { ...content };
    this.showEditContentDialog = true;
  }

  openDeleteContentDialog(content: ContentButton): void {
    this.currentContent = content;
    this.showDeleteContentDialog = true;
  }

  openReorderContentDialog(): void {
    this.tempContentButtons = [...this.contentButtons];
    this.showReorderContentDialog = true;
  }

  resetContentForm(): void {
    this.contentForm = {
      name: '',
      command: '',
      color: '#007ACC',
      textColor: '#ffffff'
    };
  }

  selectColor(color: string): void {
    this.contentForm.color = color;
    // Auto-select text color based on background
    this.contentForm.textColor = this.isLightColor(color) ? '#000000' : '#ffffff';
  }

  isLightColor(color: string): boolean {
    const lightColors = ['#ffeb3b', '#ffffff', '#00bcd4'];
    return lightColors.includes(color);
  }

  async addContent(): Promise<void> {
    if (!this.contentForm.name.trim() || !this.contentForm.command.trim()) {
      return;
    }

    this.contentButtons.push({
      name: this.contentForm.name.trim(),
      command: this.contentForm.command.trim(),
      color: this.contentForm.color,
      textColor: this.contentForm.textColor
    });

    await this.storageService.saveContent(this.contentButtons);
    this.updateStatus(`✓ Contenido "${this.contentForm.name.trim()}" agregado`);
    this.closeAllDialogs();
  }

  async updateContent(): Promise<void> {
    if (!this.currentContent) return;

    if (!this.contentForm.name.trim() || !this.contentForm.command.trim()) {
      return;
    }

    const index = this.contentButtons.indexOf(this.currentContent);
    if (index !== -1) {
      this.contentButtons[index] = {
        name: this.contentForm.name.trim(),
        command: this.contentForm.command.trim(),
        color: this.contentForm.color,
        textColor: this.contentForm.textColor
      };
      await this.storageService.saveContent(this.contentButtons);
      this.updateStatus('✓ Contenido editado correctamente');
    }

    this.closeAllDialogs();
  }

  async deleteContent(): Promise<void> {
    if (!this.currentContent || this.contentButtons.length <= 1) return;

    const index = this.contentButtons.indexOf(this.currentContent);
    if (index !== -1) {
      this.contentButtons.splice(index, 1);
      await this.storageService.saveContent(this.contentButtons);
      this.updateStatus('🗑️ Contenido eliminado');
    }

    this.closeAllDialogs();
  }

  async saveContentOrder(): Promise<void> {
    this.contentButtons = [...this.tempContentButtons];
    await this.storageService.saveContent(this.contentButtons);
    this.updateStatus('✓ Orden del contenido actualizado');
    this.closeAllDialogs();
  }

  moveContentUp(index: number): void {
    if (index > 0) {
      [this.tempContentButtons[index], this.tempContentButtons[index - 1]] = 
      [this.tempContentButtons[index - 1], this.tempContentButtons[index]];
    }
  }

  moveContentDown(index: number): void {
    if (index < this.tempContentButtons.length - 1) {
      [this.tempContentButtons[index], this.tempContentButtons[index + 1]] = 
      [this.tempContentButtons[index + 1], this.tempContentButtons[index]];
    }
  }

  onScreenLongPress(screen: Screen): void {
    if (this.selectedCount > 1) {
      this.openDeleteMultipleDialog();
    } else {
      // Open options menu
      this.currentScreen = screen;
    }
  }

  selectInitialContent(contentName: string): void {
    this.screenForm.selectedInitialContent = 
      this.screenForm.selectedInitialContent === contentName ? null : contentName;
  }
}
