export class RouteConstant {

  // dashboard
  public static readonly DASHBOARD = 'dashboard';
  public static readonly DASHBOARD_ROUTE = '/' + RouteConstant.DASHBOARD;

  // auth
  public static readonly AUTH = 'auth';
  public static readonly LOGIN = 'auth/login';

  // un-auth
  public static readonly UNAUTHORIZED = 'unauthorized';
  public static readonly UNAUTHORIZED_ROUTE = '/' + RouteConstant.UNAUTHORIZED;

  // schedule
  public static readonly SCHEDULE_VIEW = 'schedule';
  public static readonly SCHEDULE_VIEW_ROUTE = '/' + RouteConstant.SCHEDULE_VIEW;
  public static readonly SCHEDULE = ':id';
  public static readonly SCHEDULE_ROUTE = RouteConstant.SCHEDULE_VIEW_ROUTE + '/' + RouteConstant.SCHEDULE;

  public static readonly PRESENTATION_VIEW = 'presentation';
  public static readonly PRESENTATION_VIEW_ROUTE = RouteConstant.SCHEDULE_ROUTE + '/' + RouteConstant.PRESENTATION_VIEW;
  public static readonly PRESENTATION = ':id';
  public static readonly PRESENTATION_ROUTE = RouteConstant.PRESENTATION_VIEW_ROUTE + '/' + RouteConstant.PRESENTATION;
  public static readonly EVALUATE = 'evaluate';
  public static readonly EVALUATE_ROUTE = RouteConstant.PRESENTATION_ROUTE + '/' + RouteConstant.EVALUATE;
  public static readonly FORM = ':form';
  public static readonly FORM_ROUTE = RouteConstant.EVALUATE_ROUTE + '/' + RouteConstant.FORM;
  public static readonly REPORT = 'report';
  public static readonly REPORT_ROUTE = RouteConstant.PRESENTATION_ROUTE + '/' + RouteConstant.REPORT;

  public static readonly ADD_PRESENTATION = 'add';
  public static readonly ADD_PRESENTATION_ROUTE = RouteConstant.PRESENTATION_VIEW_ROUTE + '/' + RouteConstant.ADD_PRESENTATION;

  // timetable
  public static readonly TIMETABLE = 'timetable';
  public static readonly TIMETABLE_ROUTE = RouteConstant.SCHEDULE_ROUTE + '/' + RouteConstant.TIMETABLE;
  public static readonly AUTO_SCHEDULE = 'auto';
  public static readonly AUTO_SCHEDULE_ROUTE = RouteConstant.TIMETABLE_ROUTE + '/' + RouteConstant.AUTO_SCHEDULE;

  public static readonly CRITERIA = 'criteria';
  public static readonly CRITERIA_ROUTE = RouteConstant.SCHEDULE_ROUTE + '/' + RouteConstant.CRITERIA;

  public static readonly EVALUATION_VIEW = 'evaluation';
  public static readonly EVALUATION_VIEW_ROUTE = RouteConstant.SCHEDULE_ROUTE + '/' + RouteConstant.EVALUATION_VIEW;

  public static readonly GOOGLE_CALENDAR = 'google';
  public static readonly GOOGLE_CALENDAR_ROUTE = RouteConstant.SCHEDULE_ROUTE + '/' + RouteConstant.GOOGLE_CALENDAR;

  public static readonly CREATE = 'create';
  public static readonly CREATE_SCHEDULE_ROUTE = RouteConstant.SCHEDULE_VIEW_ROUTE + '/' + RouteConstant.CREATE;


  // availability
  public static readonly AVAILABILITY = 'availability';
  public static readonly AVAILABILITY_ROUTE = '/' + RouteConstant.AVAILABILITY;
  public static readonly USER_AVAILABILITY = ':id';
  public static readonly USER_AVAILABILITY_ROUTE = RouteConstant.AVAILABILITY_ROUTE + '/' + RouteConstant.AVAILABILITY;

  // user management
  public static readonly USER_MANAGEMENT = 'user-management';
  public static readonly USER_MANAGEMENT_ROUTE = '/' + RouteConstant.USER_MANAGEMENT;
  public static readonly ADD_USER = 'add';
  public static readonly ADD_USER_ROUTE = RouteConstant.USER_MANAGEMENT_ROUTE + '/' + RouteConstant.ADD_USER;

}
