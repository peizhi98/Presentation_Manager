export class RouteConstant {

  // auth
  public static readonly LOGIN = 'auth/login';

  // schedule
  public static readonly SCHEDULE = 'schedule';
  public static readonly SCHEDULE_ROUTE = '/' + RouteConstant.SCHEDULE;
  public static readonly CREATE_SCHEDULE_ROUTE = RouteConstant.SCHEDULE_ROUTE + '/' + 'create';
  public static readonly MANAGE_SCHEDULE_ROUTE = RouteConstant.SCHEDULE_ROUTE + '/' + ':id';

  // availability
  public static readonly AVAILABILITY = 'availability';
  public static readonly AVAILABILITY_ROUTE = '/' + RouteConstant.AVAILABILITY;

}
