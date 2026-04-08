import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface ScheduleItem {
  day: string;
  dayNum: number;
  open: string;
  close: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {
  today: number = 0;
  currentTime: string = '';
  isStoreOpen: boolean = false;
  private timeInterval: any;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  schedule: ScheduleItem[] = [
    { day: 'Lunes', dayNum: 1, open: '08:30', close: '19:00', isOpen: true },
    { day: 'Martes', dayNum: 2, open: '08:30', close: '19:00', isOpen: true },
    { day: 'Miércoles', dayNum: 3, open: '08:30', close: '19:00', isOpen: true },
    { day: 'Jueves', dayNum: 4, open: '08:30', close: '19:00', isOpen: true },
    { day: 'Viernes', dayNum: 5, open: '08:30', close: '19:00', isOpen: true },
    { day: 'Sábado', dayNum: 6, open: '08:30', close: '19:00', isOpen: true },
    { day: 'Domingo', dayNum: 0, open: '11:00', close: '17:00', isOpen: true },
  ];

  ngOnInit(): void {
    this.today = new Date().getDay();
    this.updateTime();

    if (this.isBrowser) {
      this.timeInterval = setInterval(() => {
        this.updateTime();
      }, 60000);
    }
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime(): void {
    // Obtener hora de Ecuador (Guayaquil - UTC-5)
    const now = new Date();
    const ecuadorTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }));
    
    const hours = ecuadorTime.getHours();
    const minutes = ecuadorTime.getMinutes();
    
    // Formatear hora actual
    this.currentTime = this.formatTime(hours, minutes);
    
    // Determinar si está abierto
    const todaySchedule = this.schedule.find(s => s.dayNum === this.today);
    
    if (todaySchedule) {
      const [openHour, openMin] = todaySchedule.open.split(':').map(Number);
      const [closeHour, closeMin] = todaySchedule.close.split(':').map(Number);
      
      const currentMinutes = hours * 60 + minutes;
      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;
      
      this.isStoreOpen = currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    }
  }

  private formatTime(hours: number, minutes: number): string {
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${period}`;
  }

  getStatusClass(): string {
    return this.isStoreOpen ? 'status-open' : 'status-closed';
  }

  getStatusText(): string {
    return this.isStoreOpen ? 'Abierto' : 'Cerrado';
  }
}
