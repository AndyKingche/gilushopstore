import { Component, OnInit } from '@angular/core';

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
export class ScheduleComponent implements OnInit {
  today: number = 0;
  
  schedule: ScheduleItem[] = [
    { day: 'Lunes', dayNum: 1, open: '10:00 AM', close: '7:00 PM', isOpen: true },
    { day: 'Martes', dayNum: 2, open: '10:00 AM', close: '7:00 PM', isOpen: true },
    { day: 'Miércoles', dayNum: 3, open: '10:00 AM', close: '7:00 PM', isOpen: true },
    { day: 'Jueves', dayNum: 4, open: '10:00 AM', close: '7:00 PM', isOpen: true },
    { day: 'Viernes', dayNum: 5, open: '10:00 AM', close: '7:00 PM', isOpen: true },
    { day: 'Sábado', dayNum: 6, open: '10:00 AM', close: '7:00 PM', isOpen: true },
    { day: 'Domingo', dayNum: 0, open: '11:00 AM', close: '5:00 PM', isOpen: true },
  ];

  ngOnInit(): void {
    this.today = new Date().getDay();
  }
}
