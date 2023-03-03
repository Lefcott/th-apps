import { Canvas, WidgetTool, WT } from '../components';
import Verify from '../assertions/Verify';
import Auth from '../utils/Auth';
import { UrlOptions } from '../utils/SetupBrowser';


context('Widget tests!', function() {
  beforeEach(() => {
    Auth.user();
    cy.visit(UrlOptions);
    Canvas.waitUntilLoaded()
  });

  it('Should add a daily weather widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addDailyWeather()
    Verify.theElement(WT.dailyWeatherWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.dailyWeatherWidget.widget).doesntExist()
  });

  it('Should add a 3 day weather widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addThreeDayWidget()
    Verify.theElement(WT.threeDayWeatherWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.threeDayWeatherWidget.widget).doesntExist()
  });

  it('Should add an Event widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addTodaysEventsWidget()
    Verify.theElement(WT.todaysEventsWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.todaysEventsWidget.widget).doesntExist()
  });

  it('Should add a date/time widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addDateTimeWidget()
    Verify.theElement(WT.dateTimeWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.dateTimeWidget.widget).doesntExist()
  });
  
  it('Should add a calendar widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addDayCalendarWidget()
    Verify.theElement(WT.dayCalendarWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.dayCalendarWidget.widget).doesntExist()  
  });

  it('Should add a weeklycalendar widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addWeeklyCalendarWidget()
    Verify.theElement(WT.weekCalendarWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.weekCalendarWidget.widget).doesntExist()
  });

  it('Should add a monthlycalender widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addMonthlyCalendarWidget()
    Verify.theElement(WT.monthCalendarWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.monthCalendarWidget.widget).doesntExist()
  });

it('Should add a calendarkey widget, verify, then delete it', function () {
    WidgetTool.open()
    WidgetTool.addCalendarkeyWidget()
    Verify.theElement(WT.calenderKeyWidget.widget).isVisible()
    WidgetTool.deleteElement()
    Verify.theElement(WT.calenderKeyWidget.widget).doesntExist()
  });

it('Should add an external website widget, verify, then delete it', function () {
  const externalUrl = 'https://www.k4connect.com'
  const elementOnIframePage = 'img[alt="K4Connect"]'
  
  WidgetTool.open()
  WidgetTool.addExternalUrlWidget(externalUrl)
  Verify.theElement(WT.websiteWidget.widget).isVisible()
  WidgetTool.validateExternalWidgetLoadsElement(elementOnIframePage)
  WidgetTool.deleteElement()
  Verify.theElement(WT.websiteWidget.widget).doesntExist()
});
});