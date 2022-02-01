export class Constant {
  public static readonly SERVER_URL = 'http://localhost:8080';
  public static readonly BASE_URL = 'http://localhost:4200';

  // http response
  public static readonly RESPONSE_SUCCESS = 'SUCCESS';
  public static readonly RESPONSE_FAILED = 'FAILED';

  // ui
  public static readonly THEME_COLOR = '#4056A1';
  public static readonly SCHEDULER_COLOR_1 = 'rgb(54, 162, 235)';
  public static readonly SCHEDULER_COLOR_2 = 'rgb(75, 192, 192)';
  public static readonly SCHEDULER_COLOR_BLOCKED = '#616161';

  // scheduler
  public static readonly SCHEDULER_START_HOUR = '08:00';
  public static readonly SCHEDULER_END_HOUR = '18:00';

  // date
  public static readonly TIME_FORMAT = 'dd MMM yyyy hh:mm a';
  public static readonly DATE_FORMAT = 'dd MMM yyyy';

  // role
  // schedule
  public static readonly ROLE_SCHEDULE_COORDINATOR = 'SCHEDULE_COORDINATOR';
  // presentation
  public static readonly ROLE_PANEL = 'PANEL';
  public static readonly ROLE_SUPERVISOR = 'SUPERVISOR';
  public static readonly ROLE_CHAIRPERSON = 'CHAIRPERSON';

  // presentation mode
  public static readonly MODE_ONLINE = 'Online';
  public static readonly MODE_PHYSICAL = 'Physical';


}
