export class RouteConstant {

  // auth
  public static readonly LOGIN = 'auth/login';

  // schedule
  public static readonly SCHEDULE_VIEW = 'schedule';
  public static readonly SCHEDULE_VIEW_ROUTE = '/' + RouteConstant.SCHEDULE_VIEW;
  public static readonly SCHEDULE = ':id';
  public static readonly SCHEDULE_ROUTE = RouteConstant.SCHEDULE_VIEW_ROUTE + '/' + RouteConstant.SCHEDULE;
  public static readonly PRESENTATION = 'presentation';
  public static readonly PRESENTATION_ROUTE = RouteConstant.SCHEDULE + '/' + RouteConstant.PRESENTATION;
  public static readonly ADD_PRESENTATION = 'add';
  public static readonly ADD_PRESENTATION_ROUTE = RouteConstant.PRESENTATION_ROUTE + '/' + RouteConstant.ADD_PRESENTATION;
  public static readonly TIMETABLE = 'timetable';
  public static readonly TIMETABLE_ROUTE = RouteConstant.SCHEDULE + '/' + RouteConstant.TIMETABLE;
  public static readonly CREATE = 'create';
  public static readonly CREATE_SCHEDULE_ROUTE = RouteConstant.SCHEDULE_VIEW_ROUTE + '/' + RouteConstant.CREATE;


  // availability
  public static readonly AVAILABILITY = 'availability';
  public static readonly AVAILABILITY_ROUTE = '/' + RouteConstant.AVAILABILITY;

}
