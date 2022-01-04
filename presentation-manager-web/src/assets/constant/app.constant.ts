export class Constant {
  public static readonly SERVER_URL = 'http://localhost:8080';
  public static readonly BASE_URL = 'http://localhost:4200';

  // http response
  public static readonly RESPONSE_SUCCESS = 'SUCCESS';
  public static readonly RESPONSE_FAILED = 'FAILED';

  // ui
  public static readonly THEME_COLOR = '#4056A1';

  // date
  public static readonly TIME_FORMAT = 'dd MMM yyyy hh:mm a';

  // role
  // schedule
  public static readonly ROLE_SCHEDULE_COORDINATOR = 'SCHEDULE_COORDINATOR';
  // presentation
  public static readonly ROLE_PANEL = 'PANEL';
  public static readonly ROLE_SUPERVISOR = 'SUPERVISOR';
  public static readonly ROLE_CHAIRPERSON = 'CHAIRPERSON';

}
